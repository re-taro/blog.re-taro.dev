import { component$ } from "@builder.io/qwik";
import {
	QwikCityProvider,
	RouterOutlet,
	ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { RouterHead } from "~/components/router-head/router-head";
import styles from "~/global.css?url";

export default component$(() => {
	return (
		<QwikCityProvider>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width" />
				<meta
					name="description"
					content="Rintaro Itokawa(re-taro)のブログです。"
				/>
				<meta property="og:title" content="blog.re-taro.dev" />
				<meta
					property="og:description"
					content="Rintaro Itokawa(re-taro)のブログです。"
				/>
				<meta property="og:url" content="https://blog.re-taro.dev" />
				<meta property="og:image" content="https://og.re-taro.dev?title=blog.re-taro.dev" />
				<meta property="og:type" content="website" />
				<meta property="twitter:card" content="summary_large_image" />
				<meta
					property="twitter:title"
					content="blog.re-taro.dev"
				/>
				<meta
					property="twitter:description"
					content="Rintaro Itokawa(re-taro)のブログです。"
				/>
				<meta property="twitter:image" content="https://og.re-taro.dev?title=blog.re-taro.dev" />
				<meta property="twitter:site" content="@re_taro_" />
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
				<link rel="stylesheet" href={styles} />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Noto+Sans+JP:wght@400;600&display=swap" />
				<RouterHead />
			</head>
			<body lang="ja">
				<RouterOutlet />
				<ServiceWorkerRegister />
			</body>
		</QwikCityProvider>
	);
});
