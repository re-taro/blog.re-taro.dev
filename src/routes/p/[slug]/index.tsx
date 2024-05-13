import { component$ } from "@builder.io/qwik";
import type { DocumentHead, StaticGenerateHandler } from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import { allBlogs } from "content-collections";
import { Temporal } from "temporal-polyfill";
import Article from "./features/Article/Article";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";
import { articleTags, createOgpImageUrl, ogMetaTags } from "~/libs/og";

export const onStaticGenerate: StaticGenerateHandler = () => {
	return {
		params: allBlogs
			.filter(blog => blog.published)
			.map(blog => ({ slug: blog._meta.directory })),
	};
};

export const useMarkdownLoader = routeLoader$(async (req) => {
	const blog = allBlogs.find(blog => blog._meta.directory === req.params.slug);
	if (blog)
		return blog;
	else
		throw new Error(`Blog ${req.params.slug} not found`);
});

export default component$(() => {
	const blog = useMarkdownLoader();
	return (
		<main
			class={css({
				marginTop: "[5.25rem]",
				paddingX: "6",
				paddingY: "4",
			})}
		>
			<Article article={blog.value.mdast as A.Article} abstract={blog.value.abstract} slug={blog.value._meta.directory} publishedAt={blog.value.publishedAt} updatedAt={blog.value.updatedAt} tags={blog.value.tags} />
		</main>
	);
});

export const head: DocumentHead = ({ resolveValue }) => {
	const blog = resolveValue(useMarkdownLoader);

	return {
		title: blog.title,
		meta: [
			{
				name: "description",
				content: blog.description,
			},
			...ogMetaTags({
				title: blog.title,
				description: blog.description,
				imgUrl: createOgpImageUrl(blog.title, blog.tags).href,
				type: "article",
				twitter: {
					username: "re_taro_",
					imgType: "summary_large_image",
				},
			}),
			{
				name: "article:published_time",
				content: Temporal.ZonedDateTime.from(blog.publishedAt).toString({
					timeZoneName: "never",
				}),
			},
			blog.updatedAt
				? {
						name: "article:modified_time",
						content: Temporal.ZonedDateTime.from(blog.updatedAt).toString({
							timeZoneName: "never",
						}),
					}
				: {},
			...articleTags(blog.tags),
		],
	};
};
