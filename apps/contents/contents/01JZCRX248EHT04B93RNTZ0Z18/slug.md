---
title: React Compiler はどのように値のメモ化を決定しているのか(InferMutationAliasingRanges 篇)
description: 「React Compiler はどのように値のメモ化を決定しているのか」の InferMutationAliasingEffects 篇
tags: ['React', 'React Compiler']
published: true
publishedAt: 2025-07-05T16:48:06.412+09:00[Asia/Tokyo]
---

# React Compiler はどのように値のメモ化を決定しているのか(InferMutationAliasingRanges 篇)

## はじめに

React Compiler core team が 6/19 に公開した [MUTABILITY_ALIASING_MODEL.md](https://github.com/facebook/react/blob/94cf60bede7cd6685e07a4374d1e3aa90445130b/compiler/packages/babel-plugin-react-compiler/src/Inference/MUTABILITY_ALIASING_MODEL.md) は、React における値のメモ化の決定プロセスについての詳細を提供した。
この文書では、メモ化の背後にある理論と実装の詳細が説明されており、React のパフォーマンス最適化における重要な要素となっている。

公開されたタイトルには、いかにも可変性やエイリアシングなど CS 的な視点からの仕様であるように読み取れるが、React Compiler の中で実際に独立したモジュールやクラスがあるわけではなく、設計上の「責務のまとまり」を指すものとして捉えると良い。
React Compiler に導入された新しい解析レイヤ(以降これを **The Mutability & Aliasing Model** と呼ぶ)の目的は、「一緒に変化する値の最小集合」と「それらを変更する命令の範囲」を特定することである。

この記事では、The Mutability & Aliasing Model の実装の一部である `InferMutationAliasingRanges` について詳しく解説する。

## `InferMutationAliasingRanges`

`InferMutationAliasingRanges` は、「どの値がいつからいつまで mutable だったか」を求める解析パスである。
その具体の流れは 3 段構えになっている。

1. グラフの構築とミューテーションの収集
2. effect と `mutableRange` の補正
3. 外部に漏れる副作用の決定

それぞれのフェーズをコードで追ってみる。

### グラフの構築とミューテーションの収集

`InferMutationAliasingRanges` の最初のフェーズでは、関数の引数や戻り値を含むすべての値をノードとして生成し、命令を走査して副作用の候補をグラフに追加する。[^1]
[^1]: [facebook/react/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L81-L232](https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L81-L232)

1. ノード生成
   - すべての `params`, `context`, `returns` を `AliasingState.create` で初期ノード化する
2. ブロック走査
   - Φノード: `pendingPhis` に遅延登録し、 index を保存。
   - 通常命令: `effect.kind` を見て
     - `Create*` -> 新規ノード
     - `Assign/Alias/Capture` -> エッジ追加 (`state.assign`, `state.capture`)
     - `Mutate*` -> 後で処理するため `mutations` 配列へ格納
3. phi の接続 & return の alias
   - `pendingPhis` と `terminal` を使い、最後に全エッジが張られたグラフを得る。
     - `terminal` とは `return ` や `throw` など、関数の終端を表す命令である。

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

その後、実際の `mutation` を時間軸順に処理していく。[^2]
[^2]: [facebook/react/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L234-L244](https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L234-L244)

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

このとき、`state.mutate` のキーとなる実装は `AliasingState.mutate` である。[^3]
[^3]: [facebook/react/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L670-L765](https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L670-L765)

#### `AliasingState.mutate`

`AliasingState.mutate` は「いま起きた 1 個のミューテーションが、いつ・だれまで波及するか」を BFS でシミュレーションして、各 `Identifier` ノードに

- `lastMutated` (最後に触られた**時刻** = 副作用の順序)
- `mutableRange.end` (実際の IR 上で「ここ以降は変更済み」と分かる命令番号)
- `local`, `transitive` (直接 vs. 伝搬で壊れたか、さらに Definite / Conditional の強度付き)

を刻み込む。これが後続パスの可変性の判定と外部に漏れる副作用の基礎になる。

`AliasingState.mutate` はまず、初期ノードを backwards に入れ、エッジごとに「forward or backward に進むか / transitive を引き継ぐか」を切り替えながら広げていく。[^4]
[^4]: [facebook/react/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L681-L765](https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L681-L765)

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

##### ノードの更新

まずは、`mutableRange` を伸ばす。解析時は `end` に**mutation の直後の命令 ID**が来るので、それより短ければ上書きする。
その後、以下のように local / transitive をセットする。より強い (Definite > Conditional) mutation で上書きする。

https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L709-L717

最後に、まだ local/transitive が無い（＝純粋と推定）のに壊されたら、`appendFunctionErrors` でその関数本体をエラーとしてマークする。

https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L702-L708

##### エッジをたどって enqueue

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

#### 結論 `AliasingState.mutate` は何をしている？

`AliasingState.mutate` はエッジに時刻スタンプを付けた alias, capture 有向グラフ上で「この瞬間に x を壊したら、どの値が壊れたことになるか？」を正確にマーキングする。

この情報を

- mutableRange
  - 後段の再計算除外 / メモ化
- local/transitive
  - 外から見える副作用を判定
- lastMutated - シミュレーションでの到達をチェック
  に利用し、React Compiler の安全な副作用解析を支えている。

### effect と `mutableRange` の補正

`InferMutationAliasingRanges` の 2 番目のフェーズでは、HIR の Place ごとの effect フィールドを確定し、`mutableRange` を補正する。[^5]
[^5]: [facebook/react/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L290-L466](https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L290-L466)

その具体の流れは 5 段構えになっている。

1. Φノードの後処理
2. 命令ごとの effect と `mutableRange` を補正
3. オペランドのもつ effect を確定
4. hoist された関数の `mutableRange` を補正
5. `terminal` の effect を確定

それぞれのフェーズをコードで追ってみる。

#### Φノードの後処理

https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L297-L324

まず Φノード自体の副作用には `Store` が付与される。
これは Φノードが「どの値を受け取るか」を決定するためのものであり、実際に値を変更するわけではないからである。

しかし、Φノードが生成された後に mutation が起きる場合、Φノードの入力側の副作用は `Capture` に格上げされる。
つまり、Φノードが a,b のどちらを返してもそれは**書き換わったもの**として扱われる。

最後にΦノードのうち、`mutableRange.start` が 0 のものにはブロック直前の ID をセットし、 `mutableRange` を start < end で正規化する。

#### 命令ごとの effect と `mutableRange` を補正

https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L326-L342

次に、命令の effect と `mutableRange` を補正する。
まず暫定的に命令の左辺を `ConditionallyMutate`、右辺を `Read` とする。

#### オペランドのもつ effect を確定

https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L343-L406

その後命令本体のもつ effect を参照して、先程置いた暫定的な effect を上書きする。
例えば命令が `Assign` であれば、その参照元が再度 mutate されるのであればその effect は `Capture` になる。
再度 mutate されないのであれば、その命令は純粋な読み取りのみであるので `Read` になる。

#### hoist された関数の `mutableRange` を補正

https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L424-L455

関数宣言の hoist では、関数自体の `mutableRange.end` が `StoreContext` を持つ Place HIR よりも前にある場合がある。
その場合、関数の `mutableRange.end` を `StoreContext` の直後に補正する。
これにより、関数と hoist した関数値の両方が同一メモ化単位として扱われる。

#### `terminal` の effect を確定

https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L457-L465

最後に `terminal` の effect を確定する。
関数の `return` は外部へ出るという意味で、**書き換え不可能** であることから `Freeze` として扱われる。
ここで、関数が関数式の場合は、その式の結果はあくまで呼び出した親に依存するため `Read` として扱われる。
それ以外の `terminal` は `Read` として扱われる。

これらの処理により、各 Place HIR がいつ作られ、いつ最後に書かれ、どのように読まれるかをその HIR が持つ情報のみで決定できるようになる。

### 外部に漏れる副作用の決定

`InferMutationAliasingRanges` の最後のフェーズでは、外部に漏れる副作用を決定する。[^6]
[66]: [facebook/react/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L468-L543](https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L468-L543)

このフェーズでは `functionEffects` 配列に対して、

- 副作用そのもの
- 外から観測できるデータフロー
- 戻り値の `Create`

を追加し、**呼び出し側から見える副作用**を決定する。

いくつかの処理を追ってみる。

https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L475-L485

戻り値それ自体が新しい値を生成する副作用として必ず記録される。
`ValueKind` が primitive と JSX で分岐されているのは、後続パスで freeze 可能かどうかを決定するためである。
JSX だと freeze するのは React のコンポーネントは純粋であるという前提が感じ取れて面白い。

https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L486-L496

次に、 `tracked` という配列に**関数外と共有し得る値**を集約する。

https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L497-L507

その後集約した `tracked` を `AliasingState` でシミュレートし、どのノードの `lastMutated` が更新されるかを確認する。

https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L508-L537

そして、副作用の波及を `functionEffects` に追加する。
具体的には、

- 波及先が戻り値でかつ、他の params や context が変更されていれば `Alias` とする
  - 関数の `return` と params は同じリファレンスを共有するためである。
- 波及先が params や context であれば `Capture` とする
  - 関数のある param を変えると別の param も壊れるためである。

https://github.com/facebook/react/blob/811e203ed42c1a496790426a687d5045c473653d/compiler/packages/babel-plugin-react-compiler/src/Inference/InferMutationAliasingRanges.ts#L540-L543

これらの処理により、副作用の安全な分離や DCE を呼び出し側に影響を漏らさず行えるようになる。

## `InferMutationAliasingRanges` の例

たらたらと `InferMutationAliasingRanges` の実装を追ってきたが、どのように動くのかを見てみよう。

### 例1: パラメータを直接mutateするだけ

```js:sample.js
export const setActive = (user) => {
  user.active = true;
};
```

この関数は、引数 `user` の `active` プロパティを `true` に設定するだけの単純な関数である。
`InferMutationAliasingRanges` はこの関数を解析し、以下のような `functionEffects` を生成する。

```txt:sample.txt
[
  // ① 戻り値は常に Create（値は undefined でも “生成” とみなす）
  { kind: 'Create', into: returnValue, value: ValueKind.Primitive },

  // ② param `user` を書き換えているので外部からは Mutate
  { kind: 'MutateTransitive', value: user },
]
```

### 例2: 引数をそのまま返すだけ

```js:sample.js
export const identity = (x) => {
  return x;
};
```

この関数は引数 `x` をそのまま返すだけの関数である。
`InferMutationAliasingRanges` はこの関数を解析し、以下のような `functionEffects` を生成する。

```txt:sample.txt
[
  { kind: 'Create', into: returnValue, value: ValueKind.Mutable },

  // 戻り値と param x が同一参照なので Alias
  { kind: 'Alias', from: x, into: returnValue },
]
```

このとき、 `InferMutationAliasingRange` は `identity` 関数の副作用をシミュレーションし、引数 `x` を壊すと戻り値も壊れることを確認しているため `Alias` として扱われる。

### 例3: 引数どうしをくっつける

```js:sample.js
export const link = (a, b) => {
  a.ref = b;
};
```

この関数は引数 `a` の `ref` プロパティに `b` を設定する。
`InferMutationAliasingRanges` はこの関数を解析し、以下のような `functionEffects` を生成する。

```txt:sample.txt
[
  { kind: 'Create', into: returnValue, value: ValueKind.Primitive },

  // a は書き換えたので MutateTransitive
  { kind: 'MutateTransitive', value: a },

  /* ====== Part 3 のシミュレーション結果 ====== */
  // b を仮にミュートすると a も汚染される → Capture
  { kind: 'Capture', from: b, into: a },
]
```

このとき、`InferMutationAliasingRanges` は `a.ref = b` の命令をシミュレーションし、`b` を壊すと `a` も壊れることを確認しているため `Capture` として扱われる。

## まとめ

`InferMutationAliasingRanges` はプログラムを時間軸でのエイリアシングと mutation のシミュレーションの結果から、静的に副作用を決定する。
その結果、 React Compiler は「副作用のない再利用可能コード」と「依存関係を持つコード」を安全に分離し、後続での DCE やメモ化に役立てている。
