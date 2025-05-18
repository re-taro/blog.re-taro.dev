---
title: '@cloudflare/workers-types の Compatibility dates を知っているか'
description: '@cloudflare/workers-types の 仕様を今知ったので書いた'
tags: ['Cloudflare Workers', 'TypeScript']
published: true
publishedAt: 2024-11-09T23:01:29.591+09:00[Asia/Tokyo]
---

# @cloudflare/workers-types の Compatibility dates を知っているか

## はじめに

Cloudflare Workers で TypeScript を使う際に、`@cloudflare/workers-types` という型定義パッケージを使う。

## Compatibility dates

Cloudflare Workers には Compatibility dates という概念がある。これは後方互換性を保つためにある。

通常これは `wrangler.toml` に記述することで Cloudflare Workers ランタイムのバージョンをプロジェクトで指定できる。

## @cloudflare/workers-types にもある Compatibility dates

筆者は今日まで知らなかったが、`@cloudflare/workers-types` にも Compatibility dates がある。

https://www.npmjs.com/package/@cloudflare/workers-types

ここの `Compatibility dates` には、現在 `@cloudflare/workers-types` で設定できる Compatibility dates が記載されている。筆者が特に気になったのはこれらの記述である。

- `@cloudflare/workers-types`
  - よくブログや記事で見かける書き方であるが、これは最新のバージョンを指定してくれているわけではなく、`2021-11-03` よりも前の互換性を保証しているということである。
- `@cloudflare/workers-types/experimental`
  - これは最新の Cloudflare Workers ランタイムに追従した型定義である。プロダクションなどで使う際には注意が必要である。

## さいごに

みんな困っていないのだろうか...
