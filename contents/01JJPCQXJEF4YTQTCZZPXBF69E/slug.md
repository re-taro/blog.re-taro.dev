---
title: pnpm とセキュアな依存管理
description: pnpm v10 で登場した機能とその背景
tags: ["pnpm", "security"]
published: true
publishedAt: 2025-01-31T23:48:55.604+09:00[Asia/Tokyo]
---

# pnpm とセキュアな依存管理

## はじめに

pnpm v10 から、依存するパッケージのライフサイクルスクリプトをデフォルトで実行しないようになる。

## ライフサイクルスクリプトが必要なパッケージとは

昨今、swc や esbuild など異なる言語で書かれたパッケージを npm でインストールすることが一般的になってきた。
これらは、バイナリで提供されているため、インストールしたユーザーのアーキテクチャに合わせて用意される必要がある。

https://github.com/swc-project/swc/blob/f960d52364e72fa7548cc8aaaf6367dfdf7b9a8f/packages/core/postinstall.js

このコードは。swc の postinstall script で、インストール時に実行される。
内容は、適切なアーキテクチャのバイナリを検証し、無い場合は `@swc/wasm` を取得してくるというものである。

## ライフサイクルスクリプトが必要なパッケージの課題

npm レジストリのパッケージは度々サプライチェーンの標的にされる。[^1][^2]

[^1]: https://github.com/advisories/GHSA-5rqg-jm4f-cqx7

[^2]: https://github.com/advisories/GHSA-pjwm-rvh2-c87w

ここで読者の皆さんに質問したい。あなたはある npm パッケージをインストールするときに、そのパッケージがどのようなライフサイクルスクリプトを持っているかを確認しているだろうか？
私はしていない。

前述した通り、ライフサイクルスクリプトを必要とする npm パッケージは必要な理由がある。
きっと読者含め多くの人が、その理由を理解しているからこそ必要とされるパッケージに、ライフサイクルスクリプトがあってもおかしくないな、という気持ちを持っているだろう。

しかし、やべーハカーは、ライフサイクルスクリプトを悪用する。
直近にも、npm パッケージのライフサイクルスクリプトを悪用した脆弱性が報告されている。[^3]

[^3]: https://github.com/web-infra-dev/rspack/issues/8767

これは余談だが、rspack はどうやらライフサイクルスクリプトを必要としないらしい。
対応していないアーキテクチャで rspack を使おうとすると例外が投げられて死ぬ。

https://github.com/web-infra-dev/rspack/blob/cc5e3f6a49073b354c08ec4b8c75142e602d02ee/crates/node_binding/binding.js

## pnpm v10 での変更点

https://github.com/pnpm/pnpm/releases/tag/v10.0.0

pnpm v10 では Node.js から corepack が分離する決定[^4]に伴い、`package.json#packageManager` を見て pnpm が指定されているプロジェクトでは、そのプロジェクトの pnpm を使う挙動がデフォルトとなった。

[^4]: https://github.com/nodejs/package-maintenance/blob/c3519284e9f1e2a4acc4c3586c585cf0c3b2fed9/docs/version-management/proposal-next-steps.md

詳しい話は [euxn23](https://x.com/euxn23) さんの記事を読んでほしい。めちゃ分かりやすい。

https://zenn.dev/euxn23/articles/399a6815ddac93

他にも store バージョンの更新や、`pnpm link` の挙動変更など、多くの変更があるが、本記事ではライフサイクルスクリプトの実行周りについてのみ触れる。

### onlyBuiltDependencies

https://github.com/pnpm/pnpm/pull/8897

直近に起こった rspack の脆弱性を受けて、pnpm team は改めて Twitter でライフサイクルスクリプトの実行についてユーザーアンケートを募った。[^5]

[^5]: https://x.com/pnpmjs/status/1869911712763093048

その結果、ライフサイクルスクリプトの実行をデフォルトで無効化することが決定され、実装された。

[リリースノート](https://github.com/pnpm/pnpm/releases/tag/v10.0.0) にも記載されている通り、特定の依存関係のライフサイクルスクリプトを許可するには、package.json に以下のように追記することで可能となる。

```json:package.json
{
	"pnpm": {
		"onlyBuiltDependencies": ["fsevents"]
	}
}
```

この例では、`fsevents` というパッケージのライフサイクルスクリプトのみを許可する設定となる。

### bun のアプローチとの違い

実装の PR では bun のアプローチとの違いについて議論されている。

bun も pnpm と同様にライフサイクルスクリプトの実行をデフォルトで無効化しているが、bun はデフォルトでライフサイクルスクリプトの実行を許可するパッケージのリストを持っている。

https://github.com/oven-sh/bun/blob/8c75c777c2ffa418b18f313fcde23df4c147e964/src/install/default-trusted-dependencies.txt

実装の PR では bun のようにデフォルトで許可するパッケージのリストを持つことを求める声もあったが、pnpm はそのようなアプローチを取らなかった。

pnpm team はリストのメンテナンスが大変であることや冗長であることなどから、ユーザーが明示的に許可するパッケージを指定することで、より安全な環境を提供することを目指した。

## pnpm v10.1 と体験の向上

pnpm v10 で依存のライフサイクルスクリプトの実行は制限されたが、onlyBuiltDependencies に設定している配列を**良い感じ**に管理することは難しい。

そこで pnpm v10.1 では新たに `pnpm ignored-builds` と `pnpm approve-builds` というコマンドが追加された。

https://github.com/pnpm/pnpm/pull/8963

`pnpm ignored-builds` は、ライフサイクルスクリプトを持った依存関係を一覧表示するコマンドである。
`pnpm approve-builds` は、ライフサイクルスクリプトを持った依存関係を許可するコマンドである。

これらのコマンドを使用することで、対話的にライフサイクルスクリプトを持った依存関係を管理することが可能となる。
(読んでみた感じ追加ができるだけで削除はできないようで、ほしいなぁと思うのだ)

## まとめ

pnpm v10 から、依存するパッケージのライフサイクルスクリプトをデフォルトで実行しないようになった。

JavaScript のエコシステムは日々進化している。その中で、セキュリティに関する問題も増えている。
すこしでもセキュリティを意識して、より安全な環境を提供するために、pnpm v10 での変更は大きな意味を持つ。
