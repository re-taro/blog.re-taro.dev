---
title: React Compiler はどのように値のメモ化を決定しているのか
description: React Compiler core team が公開した MUTABILITY_ALIASING_MODEL.md に基づきまとめる。
tags: ['React', 'React Compiler']
published: true
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

- `InferMutationAliasingEffects`
- `InferMutationAliasingRanges`
- `InferReactiveScopeVariables`
- `AnalyzingFunction`

それぞれについて解説していると長いブログになってしまったので、各フェーズの詳細は別の記事に分けて説明する。

- [React Compiler はどのように値のメモ化を決定しているのか(InferMutationAliasingEffects 篇)](/p/01JZCRHSP96KXJEB325SBKY3DF)
- [React Compiler はどのように値のメモ化を決定しているのか(InferMutationAliasingRanges 篇)](/p/01JZCRX248EHT04B93RNTZ0Z18)
- [React Compiler はどのように値のメモ化を決定しているのか(InferReactiveScopeVariables 篇)]()
- [React Compiler はどのように値のメモ化を決定しているのか(AnalyzingFunction 篇)]()
