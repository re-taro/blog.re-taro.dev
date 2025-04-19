---
title: React Compilerのopt-inとopt-outを整理する
description: ややこしすぎるopt-inとopt-outの挙動を整理する。
tags: ['React', 'React Compiler']
published: true
publishedAt: 2024-06-11T15:42:49.854+09:00[Asia/Tokyo]
---

# React Compiler の opt-in と opt-out を整理する

## はじめに

先日に引き続き React Compiler のコードを読んでいる中で、opt-in と opt-out についての挙動がややこしいと感じたので整理してみた。

この記事で参照するコードの commit は [c015abd](https://github.com/facebook/react/commit/c015abd9dc32e9604e992cf351f1e130fd2a0de0) である。

## opt-in と opt-out

React Compiler の設定に、`compilationMode` というものがある。これは次のように定義されている。

```ts:Options.ts
const CompilationModeSchema = z.enum([
  /*
   * Compiles functions annotated with "use forget" or component/hook-like functions.
   * This latter includes:
   * * Components declared with component syntax.
   * * Functions which can be inferred to be a component or hook:
   *   - Be named like a hook or component. This logic matches the ESLint rule.
   *   - *and* create JSX and/or call a hook. This is an additional check to help prevent
   *     false positives, since compilation has a greater impact than linting.
   * This is the default mode
   */
  "infer",
  // Compile only functions which are explicitly annotated with "use forget"
  "annotation",
  // Compile all top-level functions
  "all",
]);
```

https://github.com/facebook/react/blob/d77dd31a329df55a051800fc76668af8da8332b4/compiler/packages/babel-plugin-react-compiler/src/Entrypoint/Options.ts#L116-L132

### opt-out

`opt-out` はそもそも公式で明言された呼び方ではないということに留意しておく。`opt-in` の逆なんだから `opt-out` やろ！というのが私の勝手な解釈である。

デフォルトでは `infer` となっている。これは、コンポーネントやフックのような関数をコンパイルする。後者は、次の条件を満たす関数をコンパイルする。

- `component` や `hook` で定義された関数
  - Flow のシンタックス
  - https://medium.com/flow-type/announcing-component-syntax-b6c5285660d0
- コンポーネントやフックのような関数であると推測される関数
  - フックやコンポーネントのような名前が付けられている
  - JSX を生成するか、フックを呼び出す
  - `eslint-plugin-react` のルールに一致する

> - フックやコンポーネントのような名前が付けられている
> - JSXを生成するか、フックを呼び出す

これらは [ここ](https://github.com/facebook/react/blob/d77dd31a329df55a051800fc76668af8da8332b4/compiler/packages/babel-plugin-react-compiler/src/Entrypoint/Program.ts#L566-L787) で実装されている。なかなか味わいのあるコードだ。

`infer` モードの嬉しさは、自動的にコンパイルされる関数を選択してくれることだ。

私が `infer` モードを `opt-out` と読んでいるのは後で詳しく説明する `"use no memo"` というディレクティブでコンパイル対象から外すことができるからだ。

### opt-in

`annotation` モードは、`"use memo"` というディレクティブが付与された関数のみをコンパイルする。

ドキュメントでも言及されている通り、`opt-in` はあくまで既に存在する React のプロジェクトに対して段階的に React Compoler を導入するための仕組みだ。

> In rare cases, you can also configure the compiler to run in “opt-in” mode using the compilationMode: "annotation" option. This makes it so the compiler will only compile components and hooks annotated with a "use memo" directive. Please note that the annotation mode is a temporary one to aid early adopters, and that we don’t intend for the "use memo" directive to be used for the long term.
>
> When you have more confidence with rolling out the compiler, you can expand coverage to other directories as well and slowly roll it out to your whole app.
>
> --- https://react.dev/learn/react-compiler#existing-projects

## ややこしいディレクティブの挙動

さて、本題だ(？)。`use memo` と `use no memo` というディレクティブがある。これらはどちらも関数やファイルの行頭に付与することでコンパイルの挙動を変更する。

混乱するのは `compilationMode` の値とその時の挙動である。例えば...

- `infer` の時に `"use memo"` を付与した時
- `annotation` の時に `"use no memo"` を付与した時

など、挙動はどうなるのだろうか？

解答はコードに隠されていた。

```ts:Program.ts
function getReactFunctionType(
  fn: BabelFn,
  pass: CompilerPass
): ReactFunctionType | null {
  const hookPattern = pass.opts.environment?.hookPattern ?? null;
  if (fn.node.body.type === "BlockStatement") {
    // Opt-outs disable compilation regardless of mode
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
    // Otherwise opt-ins enable compilation regardless of mode
    if (findDirectiveEnablingMemoization(fn.node.body.directives) != null) {
      return getComponentOrHookLike(fn, hookPattern) ?? "Other";
    }
  }
  switch (pass.opts.compilationMode) {
    case "annotation": {
      // opt-ins are checked above
      return null;
    }
    case "infer": {
      // Component and hook declarations are known components/hooks
      if (fn.isFunctionDeclaration()) {
        if (isComponentDeclaration(fn.node)) {
          return "Component";
        } else if (isHookDeclaration(fn.node)) {
          return "Hook";
        }
      }

      // Otherwise check if this is a component or hook-like function
      return getComponentOrHookLike(fn, hookPattern);
    }
    case "all": {
      // Compile only top level functions
      if (fn.scope.getProgramParent() !== fn.scope.parent) {
        return null;
      }

      return getComponentOrHookLike(fn, hookPattern) ?? "Other";
    }
    default: {
      assertExhaustive(
        pass.opts.compilationMode,
        `Unexpected compilationMode \`${pass.opts.compilationMode}\``
      );
    }
  }
}
```

https://github.com/facebook/react/blob/d77dd31a329df55a051800fc76668af8da8332b4/compiler/packages/babel-plugin-react-compiler/src/Entrypoint/Program.ts#L471-L533

上記のコードコメントにある通り、ディレクティブが見つかった場合、`compilationMode` の値に関係なくディレクティブの指示に従う。つまり、`"use no memo"` が見つかった場合はコンパイルをスキップするし、`"use memo"` が見つかった場合はコンパイルを実行する。

## まとめ

React Compiler の opt-in と opt-out について整理してみた。`compilationMode` は opt-in と opt-out の挙動を制御する。`"use memo"` と `"use no memo"` はどちらもコンパイルの挙動を変更するディレクティブで、`compilationMode` の値に関係なく挙動を変更する。

React Compiler の中身を [@yossydev](https://twitter.com/yossydev)、[@shun_shobon](https://twitter.com/shun_shobon) と読んでいるので、興味がある方はぜひ見てみてほしい。

https://www.youtube.com/watch?v=PqPgr_hlVKM
