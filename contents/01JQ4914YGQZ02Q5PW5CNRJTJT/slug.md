---
title: styled-components の歴史、現在、これから
description: styled-components のメンテナンスモードを受けて考えた記録。
tags: ["styled-components", "CSS in JS", "React"]
published: true
publishedAt: 2025-03-24T23:31:13.108+09:00[Asia/Tokyo]
updatedAt: 2025-04-02T00:04:33.74+09:00[Asia/Tokyo]
---

# styled-components の歴史、現在、これから

## はじめに

先日、１つの時代が終わりを迎えた。

https://opencollective.com/styled-components/updates/thank-you

styled-components のメンテナンスモードへの移行が発表された。
これは、CSS in JS 並びに styling library の歴史において、１つの節目となる出来事である。

社内のプロダクトでは styled-components が使用されており、年末に私が v6 へのアップデートを行ったばかりだった。
そのため、この発表は私にとっても大きな影響を与えるものであった。

そこで、今回は styled-components の歴史を振り返り、現在の状況を整理し、これからの展望を考える。

## styled-components とは

styled-components は 2016 年に Glen Maddern 氏によって作成された[^1]、CSS in JS ライブラリである。
React コンポーネントシステムのスタイリングをどのように強化できるかという疑問から生まれたものであり、その後、多くの開発者によって利用されるようになった。
styled-components は開発者にとってより良い開発体験を提供することに加えて、以下の利点を提供する。

[^1]: https://github.com/styled-components/styled-components/commit/d2561d4928ff252eb79e5e3a3749c13930b6f062

- Critical CSS を自動的に生成する
  - これはほんまか？って気持ちがあったが、レンダリングされたコンポーネントのスタイルのみを注入するのだから、Critical CSS と言っても過言ではないかもしれない。
- シンプルに動的なスタイルを適用できる
- スタイルのコロケーション

これらはドキュメント[^2]から引用してきたものであるが、私の認識とほとんど変わらない。

[^2]: [https://styled-components.com/docs/basics#motivation](https://styled-components.com/docs/basics#motivation)

## styled-components の歴史

### CSS in JS の登場

CSS in JS は、2014 年に Facebook の Christopher "vjeux" Chedeau 氏によって提唱された[^3]。
彼は CSS の問題点として、グローバル変数の汚染や使用されなくなった CSS の削除が困難であることを挙げた。

[^3]: [https://speakerdeck.com/vjeux/react-css-in-js](https://speakerdeck.com/vjeux/react-css-in-js)

Facebook 社内ではこれらの問題に対処するため、 JavaScript を用いてインラインスタイルをオブジェクト化するという手法が講じられた。

```jsx:sample.jsx
const style = {
  text: {
    backgroundColor: '#000000',
    color: 'white'
  }
}

<div style={style.text} />
```

スタイルオブジェクトはプレーンな JavaScript のため、スタイルの条件分岐することや props から新たにスタイルをオーバーライドする事が容易となる。
上記の手法に、擬似クラスや擬似要素、メディアクエリがサポートするためコミュニティによって様々なライブラリが作成された。

### styled-components という選択

様々なライブラリが登場した中で、styled-components はある種パイオニア的な存在であった。
同じ時期に登場したライブラリと比較して、styled-components は以下の特徴を持っていて、開発者にとって魅力的であった。

- 依存 package が少ない
- template literal の中に今までの CSS とほぼ同じような書き味で記述できる

これらの特徴は、styled-components は多くの開発者に支持される理由となった。

2020 年の頃の記事を参照してしまい大変恐縮ではあるが、[@takepepe](https://twitter.com/takepepe) さんが書いている、「経年劣化に耐える React Component の書き方[^4]」という記事は、とても筋が良いなと個人的に思う。
DOM 層として実装した Component を styled-components でスタイリングするという技法は、今でも有効であると感じる。

[^4]: [https://qiita.com/Takepepe/items/41e3e7a2f612d7eb094a](https://qiita.com/Takepepe/items/41e3e7a2f612d7eb094a)

styled-components の大胆にスタイルできる利点が少々失われてしまうが、今までの BEM 記法や CSS Modules へのフォールバックが容易であり、それでいてスタイルのコロケーションが可能である。
こういった選択に自由度がありつつ、プロダクトごとに規約を持たせることで開発体験を上げることができるのは、styled-components の魅力である。

## styled-components の現在

### React Server Components の登場

2023 年の 5 月、Vercel は Next.js 13.4 を発表し、React Server Components の上で動作する最初のフレームワークとなった。[^5]
また同じ月に React Core team は React Labs からの発表として React Server Components をよりプリミティブな形で提供することを目指していると発表した。[^6]

[^5]: [https://nextjs.org/blog/next-13-4](https://nextjs.org/blog/next-13-4)

[^6]: [https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components](https://react.dev/blog/2023/03/22/react-labs-what-we-have-been-working-on-march-2023#react-server-components)

React Server Components の RFC[^7] では、React がよりサーバーを活用することでパフォーマンスやバンドルサイズを改善することを目指している。

まだまだ発展途上な概念ではあるが、React を使って開発をする人や、React を使って作られたアプリケーションのユーザーにとって、画期的な機能であることは間違いない。
だが、この概念の登場によって頭を抱え、存続の危機に陥るライブラリもある。
styled-components もその 1 つである。

[^7]: [https://github.com/reactjs/rfcs/blob/7f8492f6a177fc33fe807d242319f2f96353bf68/text/0188-server-components.md](https://github.com/reactjs/rfcs/blob/7f8492f6a177fc33fe807d242319f2f96353bf68/text/0188-server-components.md)

#### styled-components の動作原理

ランタイム CSS in JS という集合に分けられる、 styled-components や emotion などのライブラリは、JavaScript の実行時にスタイルを生成する。
生成されたスタイルは DOM API を介して、style タグとして挿入される。

```ts:dom.ts
/** Create a style element inside `target` or <head> after the last */
export const makeStyleTag = (target?: InsertionTarget | undefined): HTMLStyleElement => {
  const head = document.head;
  const parent = target || head;
  const style = document.createElement('style');
  const prevStyle = findLastStyleTag(parent);
  const nextSibling = prevStyle !== undefined ? prevStyle.nextSibling : null;

  style.setAttribute(SC_ATTR, SC_ATTR_ACTIVE);
  style.setAttribute(SC_ATTR_VERSION, SC_VERSION);

  const nonce = getNonce();

  if (nonce) style.setAttribute('nonce', nonce);

  parent.insertBefore(style, nextSibling);

  return style;
};
```

https://github.com/styled-components/styled-components/blob/ef548a2fd1d8b7766a273084edb33caf7d8a37df/packages/styled-components/src/sheet/dom.ts#L13-L31

しかし、React Server Components では DOM API を使用できないため、styled-components のようなランタイム CSS in JS ライブラリは、React Server Components 上で動作しない。

### React Server Components への対応

これに対し、React は v19 では `<body>` の中にある `<style>` を自動で `<head>` に巻き上げる機能を追加した[^8]。
詳しい挙動のイメージはブログを参照してほしいが、この機能を使った新しい世代の CSS in JS ライブラリがある[^9]。
style tag hoisting は DOM API を使用せず、React のレンダリングの流れに乗って、`<style>` タグを `<head>` に挿入できる。
この機能は、React Server Components の上で動作する CSS in JS ライブラリにとって、非常に重要な機能である。

[^8]: [https://react.dev/blog/2024/12/05/react-19#support-for-stylesheets](https://react.dev/blog/2024/12/05/react-19#support-for-stylesheets)

[^9]: [souporserious/restyle - The simplest way to add CSS styles to your React components.](https://github.com/souporserious/restyle)

### styled-components の選択

React v19 の styled hoisting を使えば、styled-components も React Server Components 上で動作できる。
しかし、長く続いているライブラリにおいて、React の API 変更へ大胆に対応するのは既存のユーザーへ求める負荷が高まってしまう。
そのため、styled-components はメンテナンスモードに移行することを選択したと話している。

私達は、この選択を決して責めることはできないし、責めるべきではない。
styled-components は長い間、CSS in JS のパイオニアとして多くの開発者に支持されてきた。
そして、新機能を追加しないと判断した今もなお、UX を損なわない程度にバグ修正などはしばらく行うとも発表している。
私達は、styled-components の選択を尊重し、感謝の意を表するべきである。

ただ、発表文の中にあった、「The React core team has decided to defacto-deprecate certain APIs like the Context API」という文言は、少々気になる。
少なくとも、React core team は Context API を事実上の非推奨とするような変更や発言はどこでもしていない。
上述の文言が styled-components の開発者の誤解であることを願うが、React Server Components の登場によって、styled-components の選択肢が狭まったことは間違いない。
また、styled-components のメンテナンスモードへの移行は、CSS in JS ライブラリの選択肢を狭めることにもつながる。

## styled-components とこれから

### 移行先？

styled-components のメンテナンスモードに対して、私達はどのように対応すれば良いのだろうか。
対応を検討するときに、次の観点が重要である。

- CSS in JS ライブラリを使用するのか
  - runtime CSS in JS を使用するのか zero-runtime CSS in JS を使用するのか
  - 使用するなら template literal を使用するのか
    - object literal を使用する場合、stylelint などの資産が使えなくなることへの考慮
  - 使用しないなら、CSS Modules や BEM 記法を使用するのか
- 移行する場合に、必ずプロダクトに複数の styling library が混在することになる
  - その場合、どのように移行するのか
    - AST 走査による機械的な移行
    - Cursor や Cline などの AI を使用した移行
    - 手動での移行
  - どのように運用していくのか
- そもそも移行するのか？
  - 現状 React Server Components を使用していない場合
  - styled-components 起因で React などのバージョンアップができない場合
  - styled-components のバグに悩まされている場合

これらの観点を考慮しながら、移行先を検討する必要がある。
私の個人的な感想としては、React Server Components や Streaming SSR を使用する場合、あとは React の major version を上げる際に、styled-components の存在が障壁になったタイミングで移行するのが良いのではないかと思う。

## おわりに

styled-components のメンテナンスモードへの移行は、CSS in JS ライブラリの歴史において、１つの節目となる出来事である。
私達は、styled-components の選択を尊重し、感謝の意を表するべきである。
また、React Server Components の登場によって、CSS in JS ライブラリの選択肢が狭まることは間違いない。
私達は、移行先を検討し、プロダクトに最適な選択をする必要がある。
