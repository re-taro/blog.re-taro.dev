---
title: EventListener のオプションメモ
description: Event Listener Options について調べたのでまとめた。
tags: ['web', 'performance']
published: true
publishedAt: 2024-07-06T01:32:43.557+09:00[Asia/Tokyo]
---

# EventListener のオプションメモ

## はじめに

`addEventListener` は DOM イベントを登録するためのメソッドである。このメソッドにはオプションを指定できる。このオプションについて調べてみた。

## オプション

`addEventListener` には以下のオプションを指定できる。

```ts:sample.ts
interface EventListenerOptions {
    capture?: boolean;
}

interface AddEventListenerOptions extends EventListenerOptions {
    once?: boolean;
    passive?: boolean;
    signal?: AbortSignal;
}
```

それぞれのオプションについて調べてみた。

### capture

`capture` オプションは、イベントの伝播をキャプチャリングフェーズで処理するかどうかを指定する。デフォルトは `false` である。Event Listener Options 対応以前の、 useCapture フラグ相当である。

#### イベントの伝播順

イベントの伝播順序を理解していなかったのでついでに調べてみた。[^1] [^2]

- キャプチャリングフェーズ

  `window` から event target まで、DOM ツリーを下りるフェーズ。親要素から子要素に向かってイベントが伝播する。

  このフェーズで登録されている event listener は、event target の event listener よりも先に実行される。

- ターゲットフェーズ

  event target に登録された event listener が実行される。

- バブリングフェーズ

  event target から `window` まで、DOM ツリーを上りるフェーズ。子要素から親要素に向かってイベントが伝播する。

  このフェーズで登録されている event listener は、event target の event listener よりも後に実行される。

例として次の HTML と JS を考える。

```html:sample.html
<button id="button">foo</button>
```

```js:sample.js
const elm = document.querySelector('#button');

document.addEventListener('click', () => {
    console.log('document');
}, { capture: false });

elm.addEventListener('click', () => {
    console.log('button');
}, { capture: false });
```

この場合、ボタンをクリックしたとき、コンソールには次のように表示される。

```log:console.log
button
document
```

`capture` オプションを `true` にすると、次のように表示される。

```log:console.log
document
button
```

[^1]: [JavaScript Event order](https://www.quirksmode.org/js/events_order.html#link4)

[^2]: [Event order](https://javascript.info/bubbling-and-capturing)

### once

`once` オプションは、event listener を一度だけ実行し削除するかどうかを指定する。デフォルトは `false` である。

通常 event listner 及びそのスコープ変数は登録されている限り参照を保持するため、GC の対象にならず、メモリリークの原因になることがある。明示的に `removeEventListener` を呼び出すことで解決できるが、`once` オプションはより簡単に GC のケアができる。

例外として useEffect で event listner を登録する処理を書く場合は、必ず useEffect のクリーンアップ関数で `removeEventListener` を呼び出すこと。`once` オプションはその event listner が実行されたときに自動的に削除されるだけなので、event listenr を持つ component を mount しただけで listner が発火しなかった場合、クリーンアップ関数が無い場合はメモリリークの原因になる。

```tsx:sample.tsx
const Component: FC = () => {
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    const handleClick = () => {
      console.log('click');
    };
    const button = ref.current;

    button?.addEventListener('click', handleClick, { once: true });

    return () => {
      button?.removeEventListener('click', handleClick);
    };
  }, []);

  return <button ref={ref}>click me</button>;
}
```

### passive

ブラウザは通常ドキュメントのスクロール体験を最適化する。しかし scroll event に event listner が登録された場合、event listener 内で `preventDefault()` が呼ばれる場合はスクロールを止めなくてはならない。

しかしブラウザは event listener 内で `preventDefault()` が呼ばれるかどうかを事前に判断できないため、scroll event に event listener が登録された場合はスクロールを止めるためにスクロールを待つ。これによりスクロール体験が悪くなる。

この問題は `passive` オプションを `true` にすることで解決できる。`passive` オプションを `true` にすると、event listener 内で `preventDefault()` を呼ばれないことが保証されるため、ブラウザは listener の完了を待たずにスクロールできる。

どの程度ユーザー操作が改善されるかは以下記事内の動画が参考になる。

https://developer.chrome.com/blog/passive-event-listeners?hl=ja

### signal

`signal` オプションは AbortSignal を指定する。AbortSignal は AbortController を通じて生成される。AbortSignal が abort されると、event listener は削除される。

一見とても便利なオプションだが罠がある。Abort すればもちろん event listener が削除されるが、正常処理された場合を Signal だけからは判断できないため、event listener が削除されずメモリリークの原因になる可能性がある。

これらに対する対策は [@jxck](https://jxck.io/) さんのこの記事が参考になるのでそちらを参考にしてほしい。

https://blog.jxck.io/entries/2023-06-01/abort-signal-any.html

## まとめ

これらの提案は 2016 年〜 2020 年には既に提案 / 実装されていたが、なかなか使う機会がなかったので調べてみた。特に `once` オプションと `passive` オプション、`signal` オプションは今後の開発で使う機会があるかもしれないので、覚えておくと便利かもしれない。
