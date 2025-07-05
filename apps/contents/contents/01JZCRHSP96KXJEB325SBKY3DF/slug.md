---
title: React Compiler はどのように値のメモ化を決定しているのか(InferMutationAliasingEffects 篇)
description: 「React Compiler はどのように値のメモ化を決定しているのか」の InferMutationAliasingEffects 篇
tags: ['React', 'React Compiler']
published: false
publishedAt: 2025-07-01T16:41:57.326+09:00[Asia/Tokyo]
---

# React Compiler はどのように値のメモ化を決定しているのか(InferMutationAliasingEffects 篇)

## はじめに

React Compiler core team が 6/19 に公開した [MUTABILITY_ALIASING_MODEL.md](https://github.com/facebook/react/blob/94cf60bede7cd6685e07a4374d1e3aa90445130b/compiler/packages/babel-plugin-react-compiler/src/Inference/MUTABILITY_ALIASING_MODEL.md) は、React における値のメモ化の決定プロセスについての詳細を提供した。
この文書では、メモ化の背後にある理論と実装の詳細が説明されており、React のパフォーマンス最適化における重要な要素となっている。

公開されたタイトルには、いかにも可変性やエイリアシングなど CS 的な視点からの仕様であるように読み取れるが、React Compiler の中で実際に独立したモジュールやクラスがあるわけではなく、設計上の「責務のまとまり」を指すものとして捉えると良い。
React Compiler に導入された新しい解析レイヤ(以降これを **The Mutability & Aliasing Model** と呼ぶ)の目的は、「一緒に変化する値の最小集合」と「それらを変更する命令の範囲」を特定することである。

この記事では、The Mutability & Aliasing Model の実装の一部である `InferMutationAliasingEffects` について詳しく解説する。

## `InferMutationAliasingEffects`

`InferMutationAliasingEffects` は、各 HIR が値の可変性やエイリアシングに与える「副作用」を推論し、命令オブジェクトに effects として書き戻すパスである。
その具体の流れは 2 段構えになっている。

1. 副作用の候補を作成
   - 構文とオペランドの型だけを見て「起こり得る」効果を組み立てる。起こり得る効果については後述する。
2. 副作用の候補を絞り込み、確定する
   - プログラムをデータフロー解析しながら「今この値は Mutable/Frozen ...」という抽象状態を管理し、副作用の候補を適用・縮約・書き換えして「実際に起こる」集合へ落とし込む。

それぞれのフェーズをコードで追ってみる。

### 副作用の候補を作成

下のコードは `InferMutationAliasingEffects` の最初のフェーズである、「命令から副作用」を機械的に生成する部分である。[^1]
[^1]: [facebook/react/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingEffects.ts#L1521-L2059](https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingEffects.ts#L1521-L2059)

```ts:InferMutationAliasingEffects.ts
/**
 * Computes an effect signature for the instruction _without_ looking at the inference state,
 * and only using the semantics of the instructions and the inferred types. The idea is to make
 * it easy to check that the semantics of each instruction are preserved by describing only the
 * effects and not making decisions based on the inference state.
 *
 * Then in applySignature(), above, we refine this signature based on the inference state.
 *
 * NOTE: this function is designed to be cached so it's only computed once upon first visiting
 * an instruction.
 */
function computeSignatureForInstruction(
  context: Context,
  env: Environment,
  instr: Instruction,
): InstructionSignature {
  const {lvalue, value} = instr;
  const effects: Array<AliasingEffect> = [];
  switch (value.kind) {
    case 'ArrayExpression': {
			// 新しい可変の配列を作る
      effects.push({
        kind: 'Create',
        into: lvalue,
        value: ValueKind.Mutable,
        reason: ValueReason.Other,
      });
			// 各要素は配列に Capture されうる
      for (const element of value.elements) {
        if (element.kind === 'Identifier') {
          effects.push({
            kind: 'Capture',
            from: element,
            into: lvalue,
          });
        }
				/* Spread も同様に Capture + 条件付きで Mutate */
      }
      break;
    }
    case 'CallExpression': {
      const signature = getFunctionCallSignature(env, value.callee.identifier.type);
			// 関数呼び出しは Apply にまとめる
      effects.push({
        kind: 'Apply',
        receiver: value.callee,
        function: value.callee,
        mutatesFunction: true,
        args: value.args,
        into: lvalue,
        signature,
        loc: value.loc,
      });
      break;
    }
		// ... 他多数の構文があるが省略 ...
	}
}
```

### 副作用の候補を絞り込み、確定する

副作用を絞り込むには、`applySignature` と `applyEffect` の二人の登場人物を理解する必要がある。

1. `applySignature` が候補セットをループし、`applyEffect` にバケツリレー。
2. `applyEffect` は現在の `InferenceState` と照合して副作用の効果を改良・場合によっては削除する。

下のコードは `applySignature` の一部であり、「`Frozen` なら `ImmutableCapture` に置き換える」など、静的情報で副作用を抑制している。[^2]
[^2]: [facebook/react/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingEffects.ts#L404-L1110](https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingEffects.ts#L404-L1110)

```ts:InferMutationAliasingEffects.ts
switch () {
	case 'Capture': {
	  const intoKind = state.kind(effect.into).kind;   // 目的地の抽象の種別
	  const fromKind = state.kind(effect.from).kind;   // ソースの抽象の種別

	  // ソースが Frozen なら不変参照として扱う
	  if (fromKind === ValueKind.Frozen) {
	    applyEffect(context, state, {
	      kind: 'ImmutableCapture',   // Capture → ImmutableCapture へ格下げ
	      from: effect.from,
	      into: effect.into,
	    }, initialized, effects);
	    break;
	  }

	  // destination が可変 かつ ソースが可変参照型なら Capture を残す
	  if (isMutableDesination && isMutableReferenceType) {
	    effects.push(effect);
	  }
	  break;
	}
}
```

先程少し出てきた `InferenceState` は、値の推論における抽象状態を表現するものである。[^3]
[^3]: [facebook/react/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingEffects.ts#L1112-L1476](https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingEffects.ts#L1112-L1476)

- `#values`: 値オブジェクト -> 抽象の種別(`Mutable`,`Frozen`,`Primitive` ...)
- `#variables`: 識別子 -> それが指す値の集合
  - Φ ノードやエイリアスを扱うため集合になっている。

`mutate` , `freeze` , `assign` , `appendAlias` などが半順序集合の結合則を使って安定的に状態を更新し、`merge` でブロック間の到達情報を結合する。

これにより「この識別子はどんな値を指し得るか」「値の可変性は？」が常に問い合わせ可能になり、`applyEffect` の判断材料になる。

### `InferMutationAliasingEffects` の例

```js:sample.js
const frozen = Object.freeze({x:1}); // ← 解析時点で Frozen
const arr = [frozen];
```

このコードは `computeSignatureForInstruction` によって次のような副作用の候補を生成する

```text:sample.txt
Create arr
Capture frozen → arr
```

しかし、`frozen` は `Object.freeze` によって Frozen であるため、`applySignature` の中で `Capture frozen → arr` が `ImmutableCapture frozen → arr` に置き換えられる。

最終的に `arr` 自体は可変だけど、中に閉じ込めたオブジェクトは不変と認識される。

## まとめ

React Compiler は副作用の候補とプログラム全体の状態を分離して扱うことで、宣言的に書いたルールを安全に絞り込むことを可能にしている。
これにより React Compiler は「不変なデータを突然 mutate した」などのバグを早期検出でき、最終的には値の寿命ややフリーズ範囲の推定に役立てている。
