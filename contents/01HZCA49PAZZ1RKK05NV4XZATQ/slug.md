---
title: React CompilerのeslintSuppressionRules を考察してみる
description: React Compiler における eslintSuppressionRules の使い方について考察してみる
tags: ["React", "React Compiler"]
published: true
publishedAt: 2024-06-02T20:07:36.528+09:00[Asia/Tokyo]
updatedAt: 2024-06-11T16:21:21.528+09:00[Asia/Tokyo]
---

# eslintSuppressionRules を考察してみる

## はじめに

先日 React Compiler が OSS になった。React のベータ版を使うことで今すぐ使うことができる。

> React Compiler is a new experimental compiler that we’ve open sourced to get early feedback from the community. It still has rough edges and is not yet fully ready for production.
>
> React Compiler requires React 19 RC. If you are unable to upgrade to React 19, you may try a userspace implementation of the cache function as described in the Working Group. However, please note that this is not recommended and you should upgrade to React 19 when possible.
>
> --- https://react.dev/learn/react-compiler

とある通り、まだ本番環境での使用は推奨されていない。

先日公開された [React Compiler Code reading #1](https://youtu.be/PqPgr_hlVKM?si=OIgDQWxUwbV3se-A) の中で `eslintSuppressionRules` という設定を見つけた。この設定の想定されるであろう使い方について考えてみた。

この記事で参照するコードの commit は [113c8e7](https://github.com/facebook/react/tree/113c8e7f72bcf5d3bc285546da1508b45da3cf53) である。

## React Compiler とは

詳しくはドキュメント[^1]を読むことをおすすめする。簡潔に説明すると、React Compiler は `React.memo` や `useMemo` を始めとしたメモ化を自動で行い不要な再レンダリングを防ぐコンパイラである。

現在は `babel` のプラグインとして提供されており、eslint のルールと React Compiler の実行時のエラーで React Compiler のルールに従わせている。

[^1]: https://react.dev/learn/react-compiler

## eslintSuppressionRules

結論から言うと `eslintSuppressionRules` は、登録された ESLint ルールが無効化された場合に React Compiler が例外をスローするようにする設定である。

```ts:Options.ts
export type PluginOptions = {
  // ...some options

  /**
   * By default React Compiler will skip compilation of code that suppresses the default
   * React ESLint rules, since this is a strong indication that the code may be breaking React rules
   * in some way.
   *
   * Use eslintSuppressionRules to pass a custom set of rule names: any code which suppresses the
   * provided rules will skip compilation. To disable this feature (never bailout of compilation
   * even if the default ESLint is suppressed), pass an empty array.
   */
  eslintSuppressionRules?: Array<string> | null | undefined;
};
```

https://github.com/facebook/react/blob/d77dd31a329df55a051800fc76668af8da8332b4/compiler/packages/babel-plugin-react-compiler/src/Entrypoint/Options.ts#L96-L105

### 必要性

`eslintSuppressionRules` はデフォルトで次の 2 つのルールが登録されている

```ts:Program.ts
const DEFAULT_ESLINT_SUPPRESSIONS = [
	"react-hooks/exhaustive-deps",
	"react-hooks/rules-of-hooks",
];
```

https://github.com/facebook/react/blob/d77dd31a329df55a051800fc76668af8da8332b4/compiler/packages/babel-plugin-react-compiler/src/Entrypoint/Program.ts#L194-L197

これらのルールが無効化された場合、React Compiler は例外をスローする。これらのルールは React の基本的なルール[^2]であり、無効化されることは React のルールに違反している可能性が高い。おさらいだが、React Compiler は React のルールに従ったコードのみを解析して最適化する。そのため `eslintSuppressionRules` は React のルールに違反しているコードを見つけ、例外をスローすることで React Compiler が正しく動作することを保証する。

[^2]: https://react.dev/reference/rules/rules-of-hooks にある通り hoosk はコンポーネントのトップレベルもしくはカスタムフック内でのみ呼び出すべきであるなど。

(2024/06/11 追記) ただし、 `"use no memo"` ディレクティブを書いた場合は、React Compiler は例外をスローしない。

```ts:Program.ts
  // Top level "use no forget", skip this file entirely
  if (
    findDirectiveDisablingMemoization(program.node.directives, options) != null
  ) {
    return;
  }
```

https://github.com/facebook/react/blob/d77dd31a329df55a051800fc76668af8da8332b4/compiler/packages/babel-plugin-react-compiler/src/Entrypoint/Program.ts#L243-L248

```ts:Program.ts
    const useNoForget = findDirectiveDisablingMemoization(
      fn.node.body.directives,
      pass.opts
    );
    if (useNoForget != null) {
      pass.opts.logger?.logEvent(pass.filename, {
        kind: "CompileError",
        fnLoc: fn.node.body.loc ?? null,
        detail: {
          severity: ErrorSeverity.Todo,
          reason: 'Skipped due to "use no forget" directive.',
          loc: useNoForget.loc ?? null,
          suggestions: null,
        },
      });
      return null;
    }
```

https://github.com/facebook/react/blob/d77dd31a329df55a051800fc76668af8da8332b4/compiler/packages/babel-plugin-react-compiler/src/Entrypoint/Program.ts#L478-L493

### ESLint v9との関係と使い方

前項で `eslintSuppressionRules` は React Compiler が正しく動作するための設定であることを述べた。他にも `eslintSuppressionRules` が必要な理由が無いか考えてると、次のような理由があることに気づいた。

それは、ESLint v9 から stable となった flat config の仕様に関係している。flat config では次のようにプラグインを設定する。

```js:eslint.config.js
// @ts-check

import qwikPlugin from "eslint-plugin-qwik";

export default [
	{
		files: ["src/**/*.tsx"],
		plugins: {
			qwik: qwikPlugin,
		},
		languageOptions: {
			parserOptions: {
				project: ["./tsconfig.json"],
			},
		},
		rules: {
			...qwikPlugin.configs.recommended.rules,
		},
	}
];
```

注目してほしいのは `plugins` の部分である。ここで各ユーザーがプラグインのプレフィックスを設定している。つまり以下のような設定が可能である。

```js:eslint.config.js
// @ts-check

import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";

export default [
	// ... some settings

	{
		files: ["**/*.{js,jsx,mjs,cjs,ts,tsx}"],
		plugins: {
			r: reactHooks,
		},
		languageOptions: {
			parserOptions: {
				ecmaFeatures: {
					jsx: true,
				},
			},
			globals: {
				...globals.browser,
			},
		},
		rules: {
			// ... any rules you want
			"r/exhaustive-deps": "error",
			"r/rules-of-hooks": "error",
		},
		// ... others are omitted for brevity
	}
];
```

上のような設定をしたプロジェクトで React Copiler を使おうとするとある問題が発生する。前項にて述べたように、`eslintSuppressionRules` はデフォルトで `react-hooks/exhaustive-deps` と `react-hooks/rules-of-hooks` が登録されている。ユーザーは ESLint の設定で `reac-hooks` プラグインのプレフィックスを `r` に設定している。するとユーザーはあるタイミングで eslint を無効化させる時に次のようなコードを書く。

```tsx:sample.tsx
// eslint-disable-next-line r/exhaustive-deps
useEffect(() => {
	// some code
}, []);
```

このコードを含んだアプリケーションを React Compiler に食べさせると、本来は例外をスローされるべきコードがコンパイルされてしまい、挙動が変わってしまう恐れがある。プレイグラウンド[^3]で試してみると一目瞭然だが、React Compiler はかなり元のコードを変更して最適化を行う。もちろん React のルールに則ったコードであれば正しく動作するが、そうでないコードは正しく動作する保証がない。

[^3]: https://playground.react.dev/

この問題を解決するために `eslintSuppressionRules` がある。ユーザーは次のように設定することで、`eslintSuppressionRules` に `r/exhaustive-deps` と `r/rules-of-hooks` を登録することで、上記の問題を解決できる。

```ts:vite.config.ts
import { defineConfig } from "vite";

export default defineConfig(() => {
	return {
		plugins: [
			react({
				babel: {
					plugins: [
						[
							"babel-plugin-react-compiler",
							{
								eslintSuppressionRules: ["r/exhaustive-deps", "r/rules-of-hooks"],
							}
						],
					],
				},
			}),
		],
		// ...
	};
});
```

このように設定することで、`eslintSuppressionRules` に登録されたルールが無効化された場合に例外をスローするようになる。これにより、React Compiler は正しく動作することが保証される。

## まとめ

`eslintSuppressionRules` は React Compiler が正しく動作するための設定である。デフォルトで `react-hooks/exhaustive-deps` と `react-hooks/rules-of-hooks` が登録されており、これらのルールが無効化された場合に例外をスローする。また flat config との相性も良いため、React Compiler を使う際には `eslintSuppressionRules` の設定することをおすすめする。

引き続き React Compiler のコードを読んで、使い方を考えていきたい。

React Compiler の中身を [@yossydev](https://twitter.com/yossydev)、[@shun_shobon](https://twitter.com/shun_shobon) と読んでいるので、興味がある方はぜひ見てみてほしい。

https://www.youtube.com/watch?v=PqPgr_hlVKM
