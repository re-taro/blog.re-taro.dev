---
title: React Compiler はどのように値のメモ化を決定しているのか
description: React Compiler core team が公開した MUTABILITY_ALIASING_MODEL.md に基づきまとめる。
tags: ['React', 'React Compiler']
published: false
publishedAt: 2025-06-29T14:53:32.238+09:00[Asia/Tokyo]
---

# React Compiler はどのように値のメモ化を決定しているのか

## はじめに

React Compiler core team が 6/19 に公開した [MUTABILITY_ALIASING_MODEL.md](https://github.com/facebook/react/blob/94cf60bede7cd6685e07a4374d1e3aa90445130b/compiler/packages/babel-plugin-react-compiler/src/Inference/MUTABILITY_ALIASING_MODEL.md) は、React における値のメモ化の決定プロセスについての詳細を提供した。
この文書では、メモ化の背後にある理論と実装の詳細が説明されており、React のパフォーマンス最適化における重要な要素となっている。

公開されたタイトルには、いかにも可変性やエイリアシングなど CS 的な視点からの仕様であるように読み取れるが、React Compiler の中で実際に独立したモジュールやクラスがあるわけではなく、設計上の「責務のまとまり」を指すものとして捉えると良い。
React Compiler に導入された新しい解析レイヤ(以降これを **The Mutability & Aliasing Model** と呼ぶ)の目的は、「一緒に変化する値の最小集合」と「それらを変更する命令の範囲」を特定することである。

## The Mutability & Aliasing Model の目的

次のようなコンポーネントのコードがあるとする。

```jsx:SampleComponent.jsx
function Component() {
	// a is created and mutated over the course of these two instructions:
	const a = {};
	mutate(a);

	// b and c are created and mutated together — mutate might modify b via c
	const b = {};
	const c = { b };
	mutate(c);

	// does not modify a/b/c
	return <Foo a={a} c={c} />;
}
```

The Mutability & Aliasing Model の目的は、a, b および c を作成または変更する命令のセットを特定することである。

React Compiler の実装において、 The Mutability & Aliasing Model は、次の４つのフェーズで実装されている。

### `InferMutationAliasingEffects`

`InferMutationAliasingEffects` は、各 HIR が値の可変性やエイリアシングに与える「副作用」を推論し、命令オブジェクトに effects として書き戻すパスである。
その具体の流れは 2 段構えになっている。

1. 副作用の候補を作成
   - 構文とオペランドの型だけを見て「起こり得る」効果を組み立てる。起こり得る効果については後述する。
2. 副作用の候補を絞り込み、確定する
   - プログラムをデータフロー解析しながら「今この値は Mutable/Frozen ...」という抽象状態を管理し、副作用の候補を適用・縮約・書き換えして「実際に起こる」集合へ落とし込む。

それぞれのフェーズをコードで追ってみる。

#### 副作用の候補を作成

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

#### 副作用の候補を絞り込み、確定する

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

#### `InferMutationAliasingEffects` の例

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

### `InferMutationAliasingRanges`

`InferMutationAliasingRanges` は、「どの値がいつからいつまで mutable だったか」を求める解析パスである。
その具体の流れは 3 段構えになっている。

1. グラフの構築とミューテーションの収集
2. legacy Effect の付与と `mutableRange` の補正
3. 外部に漏れる副作用の決定

それぞれのフェーズをコードで追ってみる。

#### グラフの構築とミューテーションの収集

`InferMutationAliasingRanges` の最初のフェーズでは、関数の引数や戻り値を含むすべての値をノードとして生成し、命令を走査して副作用の候補をグラフに追加する。[^4]
[^4]: [facebook/react/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L81-L232](https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L81-L232)

1. ノード生成
   - すべての `params`, `context`, `returns` を `AliasingState.create` で初期ノード化する
2. ブロック走査
   - Φノード: `pendingPhis` に遅延登録し、 index を保存。
   - 通常命令: `effect.kind` を見て
     - `Create*` -> 新規ノード
     - `Assign/Alias/Capture` -> エッジ追加 (`state.assign`, `state.capture`)
     - `Mutate*` -> 後で処理するため `mutations` 配列へ格納
3. phi の接続 & return の alias
   - `pendingPhis` と `terminal` を使い、最後に全エッジが張られたグラフを得ます。

```ts:InferMutationAliasingRanges.ts
  /**
   * Part 1: Infer mutable ranges for values. We build an abstract model of
   * values, the alias/capture edges between them, and the set of mutations.
   * Edges and mutations are ordered, with mutations processed against the
   * abstract model only after it is fully constructed by visiting all blocks
   * _and_ connecting phis. Phis are considered ordered at the time of the
   * phi node.
   *
   * This should (may?) mean that mutations are able to see the full state
   * of the graph and mark all the appropriate identifiers as mutated at
   * the correct point, accounting for both backward and forward edges.
   * Ie a mutation of x accounts for both values that flowed into x,
   * and values that x flowed into.
   */
  const state = new AliasingState();
  type PendingPhiOperand = {from: Place; into: Place; index: number};
  const pendingPhis = new Map<BlockId, Array<PendingPhiOperand>>();
  const mutations: Array<{
    index: number;
    id: InstructionId;
    transitive: boolean;
    kind: MutationKind;
    place: Place;
  }> = [];
  const renders: Array<{index: number; place: Place}> = [];

  let index = 0;

  const errors = new CompilerError();

  for (const param of [...fn.params, ...fn.context, fn.returns]) {
    const place = param.kind === 'Identifier' ? param : param.place;
    state.create(place, {kind: 'Object'});
  }
	/* ほかの effect は assign/capture/create の形でグラフに追加 */
```

その後、実際の `mutation` を時間軸順に処理していく。[^5]
[^5]: [facebook/react/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L234-L244](https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L234-L244)

```ts:InferMutationAliasingRanges.ts
  for (const mutation of mutations) {
    state.mutate(
      mutation.index,
      mutation.place.identifier,
      makeInstructionId(mutation.id + 1),
      mutation.transitive,
      mutation.kind,
      mutation.place.loc,
      errors,
    );
  }
```

このとき、`state.mutate` のキーとなる実装は `AliasingState.mutate` である。[^6]
[^6]: [facebook/react/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L670-L765](https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L670-L765)

##### `AliasingState.mutate`

`AliasingState.mutate` は「いま起きた 1 個のミューテーションが、いつ・だれまで波及するか」を BFS でシミュレーションして、各 `Identifier` ノードに

- `lastMutated` (最後に触られた**時刻** = 副作用の順序)
- `mutableRange.end` (実際の IR 上で「ここ以降は変更済み」と分かる命令番号)
- `local`, `transitive` (直接 vs. 伝搬で壊れたか、さらに Definite / Conditional の強度付き)

を刻み込む。これが後続パスの可変性の判定と外部に漏れる副作用の基礎になる。

`AliasingState.mutate` はまず、初期ノードを backwards に入れ、エッジごとに「forward or backward に進むか / transitive を引き継ぐか」を切り替えながら広げていく。[^7]
[^7]: [facebook/react/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L681-L765](https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L681-L765)

```ts:InferMutationAliasingRanges.ts
    const queue: Array<{
      place: Identifier;
      transitive: boolean;
      direction: 'backwards' | 'forwards';
    }> = [{place: start, transitive, direction: 'backwards'}];
    while (queue.length !== 0) {
      const {place: current, transitive, direction} = queue.pop()!;
		  // ①ノード更新
      // ②辺をたどって enqueue
		}
```

###### ノードの更新

まずは、`mutableRange` を伸ばす。解析時は `end` に**mutation の直後の命令 ID**が来るので、それより短ければ上書きする。
その後、以下のように local / transitive をセットする。より強い (Definite > Conditional) mutation で上書きする。

https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L709-L717

最後に、まだ local/transitive が無い（＝純粋と推定）のに壊されたら、`appendFunctionErrors` でその関数本体をエラーとしてマークする。

https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L702-L708

###### エッジをたどって enqueue

https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L718-L763

- 時間順序の尊重
  - 各エッジには**生成されたインデックス**が付いており、mutation より**後**に出来たエッジ (when ≥ index) は無視する
- `forward`
  - a -> b の向きは `Capture` と `Alias` の両方が対象
- `backward`
  - `createdFrom`、`Alias`、`Capture` を逆流
  - Φノードから来た `forward` 探索では、もう一方の入力は触らないよう `direction=='forwards'` かつ `value.kind==='Phi'` の時に別入力をスキップ
- `capture Edge` は transitive 限定
  - `Mutate` は閉じたスコープ外へ波及しないが、`MutateTransitive` は**捕まえられた値**にも影響、という React Compiler の不変条件をそのままコード化している。

##### 結論 `AliasingState.mutate` は何をしている？

`AliasingState.mutate` はエッジに時刻スタンプを付けた alias, capture 有向グラフ上で「この瞬間に x を壊したら、どの値が壊れたことになるか？」を正確にマーキングする。

この情報を

- mutableRange
  - 後段の再計算除外 / メモ化
- local/transitive
  - 外から見える副作用を判定
- lastMutated - シミュレーションでの到達をチェック
  に利用し、React Compiler の安全な副作用解析を支えている。

#### legacy Effect の付与と `mutableRange` の補正

`InferMutationAliasingRanges` の 2 番目のフェーズでは、legacy Effect を付与し、`mutableRange` を補正する。[^8]
[^8]: [facebook/react/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L290-L466](https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L290-L466)
