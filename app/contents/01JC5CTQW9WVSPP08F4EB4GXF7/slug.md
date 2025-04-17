---
title: Life Cycle Scripts を理解する
description: 混乱しがちな Life Cycle Scripts の挙動を理解する
tags: ['npm scripts', 'package manager']
published: true
publishedAt: 2024-11-08T21:04:11.79+09:00[Asia/Tokyo]
updatedAt: 2024-11-09T22:54:16.82+09:00[Asia/Tokyo]
---

# Life Cycle Scripts を理解する

## はじめに

npm scripts には、`pre` と `post` というプレフィックスのついたスクリプトがある。これは、スクリプトの前後に実行されるスクリプトを指定するものである。

その中でも、特定の状況下で実行されるスクリプトがある。それらを Life Cycle Scripts と呼ぶ。この挙動が混乱しがちなので、整理してみた。

## Life Cycle Scripts とは

Life Cycle Scripts とは、`pre` や `post` のついたスクリプトの中でも、特定の状況下で実行されるスクリプトのことである。

具体的には、以下のようなスクリプトが Life Cycle Scripts に該当する。

### `prepublish`

`npm install` や `npm ci` が実行されたときに実行されるスクリプトである。

`npm publish` では実行されない。(ナント！！！)

このスクリプトは、名前と挙動の違いから混乱するという理由で非推奨[^1]であり、代わりに `prepare` スクリプトと `prepublishOnly` スクリプトを使うことが推奨されている。`prepublish` のユースケースを公式では以下のように説明されている。

> If you need to perform operations on your package before it is used, in a way that is not dependent on the operating system or architecture of the target system, use a prepublish script. This includes tasks such as:
>
> - Compiling CoffeeScript source code into JavaScript.
> - Creating minified versions of JavaScript source code.
> - Fetching remote resources that your package will use.
>
> --- [Prepare and Prepublish](https://docs.npmjs.com/cli/v9/using-npm/scripts#prepare-and-prepublish)

[^1]: https://github.com/npm/npm/issues/10074

### `prepare`

`prepare` スクリプトは、`npm install` や `npm publish` , `npm pack` が実行されたときに、実行されるスクリプトである。

`prepublish` スクリプトの挙動の互換性の観点から、`prepare` スクリプトは `prepublishOnly` スクリプトの前に実行され、`prepublish` スクリプトの後に実行される。

### `prepublishOnly`

`prepublishOnly` スクリプトは、`npm publish` が実行されたときにのみ、実行されるスクリプトである。(シンプル！)

### `prepack`

tarball が作成される前に実行されるスクリプトである。tarball が作成されるタイミングは以下の通りである。

- `npm pack`
- `npm publish`
- git URL でのインストール

ここで `npm run pack` と `npm pack` は別である。前者はユーザーが定義したスクリプトであり、`prepack` は実行されない。

### `postpack`

tarball が作成された後に実行されるスクリプトである。

### `dependencies`

`node_modules` ディレクトリが変更されたとき、変更の後に実行される。

## Life Cycle Scripts が実行されるタイミング

次に npm のコマンドが実行されたときに、どの Life Cycle Scripts がどの順番で実行されるかを整理する。

| コマンド          | 実行される Life Cycle Scripts の種類と順番                                                                     |
| ----------------- | -------------------------------------------------------------------------------------------------------------- |
| `npm cache add`   | `prepare`                                                                                                      |
| `npm ci`          | `preinstall` --> `install` --> `postinstall` --> `prepublish` --> `preprepare` --> `prepare` --> `postprepare` |
| `npm diff`        | `prepare`                                                                                                      |
| `npm install`[^2] | `preinstall` --> `install` --> `postinstall` --> `prepublish` --> `preprepare` --> `prepare` --> `postprepare` |
| `npm pack`        | `prepack` --> `pack` --> `postpack`                                                                            |
| `npm publish`[^3] | `prepublishOnly` --> `prepack` --> `prepare` --> `postpack` --> `publish` --> `postpublish`                    |
| `npm rebuild`[^4] | `preinstall` --> `install` --> `postinstall` --> `prepare`                                                     |
| `npm restart`     | `prerestart` --> `restart` --> `postrestart`                                                                   |
| `npm start`       | `prestart` --> `start` --> `poststart`                                                                         |
| `npm stop`        | `prestop` --> `stop` --> `poststop`                                                                            |
| `npm test`        | `pretest` --> `test` --> `posttest`                                                                            |
| `npm version`     | `preversion` --> `version` --> `postversion`                                                                   |

[^2]: `binding.gyp` というファイルが存在する場合、`install` スクリプトは `node-gyp rebuild` が代わりに実行される。

[^3]: `--dry-run` オプションを指定した場合、`prepare` は実行されない。

[^4]: `prepare` はリンクされたパッケージなど、カレントディレクトリがシンボリックリンクの場合にのみ実行される。

## npm 以外での挙動

余談だが npm 以外のパッケージマネージャでは、原則 `pre` と `post` プレフィックスの付いたスクリプトは実行されない。これはワークフローの動作が複雑になることを避けるために設計されている。[^5][^6]

また yarn[^5] や pnpm[^7] では定義されている Life Cycle Scripts が npm と異なるので注意が必要である。

---

[@s6n_jp](https://twitter.com/s6n_jp) から指摘されて気づいたのだが、どうやら pnpm v9 以降では Life Cycle Scripts がサポートされるようになった[^8]ようだ。これにより、pnpm でも npm と同様に Life Cycle Scripts が実行されるようになった。

Twitter で poll を取った結果[^9]入った変更のようで、多くの人がこの変更を望んでいたようだ。

[^5]: https://yarnpkg.com/advanced/lifecycle-scripts

[^6]: https://github.com/pnpm/pnpm/issues/2891

[^7]: https://pnpm.io/scripts

[^8]: https://github.com/pnpm/pnpm/pull/7634

[^9]: https://twitter.com/pnpmjs/status/1755902257751605717

## まとめ

調べていくと、npm の Life Cycle Scripts は意外と複雑で、挙動が混乱しやすい。しかし、理解してしまえば、それほど難しいものではない。この記事が、少しでもその理解に役立てば幸いである。
