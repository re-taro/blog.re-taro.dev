import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { routeLoader$, useNavigate } from "@builder.io/qwik-city";
import { allBlogs } from "content-collections";
import { Temporal } from "temporal-polyfill";
import { css } from "~/styled-system/css";

export const useLatestMarkdownLoader = routeLoader$(() => {
	const latestPost = allBlogs.filter(b => import.meta.env.DEV || b.published).sort((a, b) => Temporal.ZonedDateTime.compare(
		Temporal.ZonedDateTime.from(b.publishedAt),
		Temporal.ZonedDateTime.from(a.publishedAt),
	))[0];

	return latestPost;
});

export default component$(() => {
	const second = useSignal(3);
	const nav = useNavigate();
	const latestPost = useLatestMarkdownLoader();
	// eslint-disable-next-line qwik/no-use-visible-task
	useVisibleTask$(({ cleanup }) => {
		const id = setInterval(() => {
			if (second.value === 1)
				nav(`/p/${latestPost.value._meta.directory}`);
			else
				second.value--;
		}, 1000);

		cleanup(() => clearInterval(id));
	});

	return (
		<section
			class={css({
				padding: "[5.25rem 1rem 0]",
			})}
		>
			<h1
				class={css({
					color: "text.main",
					fontSize: "2xl",
					fontWeight: "bold",
					lineHeight: "tight",
				})}
			>
				{second.value}
				秒後に最新の記事へリダイレクトされます...
			</h1>
		</section>
	);
});

export const head: DocumentHead = ({ resolveValue }) => {
	const blog = resolveValue(useLatestMarkdownLoader);

	return {
		title: `Redirecting to ${blog.title}...`,
	};
};
