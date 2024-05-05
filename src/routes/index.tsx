import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { ogMetaTags } from "~/libs/og";
import { css } from "~/styled-system/css";

export default component$(() => {
	return (
		<>
			<h1 class={css({
				color: "text.main",
				fontSize: "9xl",
			})}
			>
				Hi 👋
			</h1>
		</>
	);
});

export const head: DocumentHead = {
	title: "blog.re-taro.dev",
	meta: [
		{
			name: "description",
			content: "ブログ記事一覧",
		},
		...ogMetaTags({
			title: "blog.re-taro.dev",
			description: "ブログ記事一覧",
			imgUrl: "https://og.re-taro.dev?title=Blog+posts&text=blog.re-taro.dev",
			type: "website",
			twitter: {
				username: "re_taro_",
				imgType: "summary_large_image",
			},
		}),
	],
};
