import { Temporal } from "temporal-polyfill";
import type { RouteDefinition, RouteSectionProps } from "@solidjs/router";
import { cache, createAsync } from "@solidjs/router";
import type { Component } from "solid-js";
import { Show, Suspense } from "solid-js";
import { Meta, Title } from "@solidjs/meta";
import Article from "./features/Article/Article";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";
import { createOgpImageUrl } from "~/libs/og";
import { ArticleTags, OgMetaTags } from "~/components/Meta/Meta";

const loadPost = cache(async (slug: string) => {
	"use server";

	const { allBlogs } = await import("content-collections");

	const blog = allBlogs.find(blog => blog._meta.directory === slug);
	if (blog)
		return blog;
	else
		throw new Error(`Blog ${slug} not found`);
}, "loadPost");

export const route = {
	preload: ({ params }) => loadPost(params.slug),
} as const satisfies RouteDefinition;

const Content: Component<{ slug: string }> = (props) => {
	const blog = createAsync(() => loadPost(props.slug));

	return (
		<Show when={blog()} fallback={null}>
			<Title>{blog()!.title}</Title>
			<Meta name="description" content={blog()!.description} />
			<Meta name="article:published_time" content={Temporal.ZonedDateTime.from(blog()!.publishedAt).toString({ timeZoneName: "never" })} />
			{blog()!.updatedAt && (
				<Meta name="article:modified_time" content={Temporal.ZonedDateTime.from(blog()!.updatedAt as string).toString({ timeZoneName: "never" })} />
			)}
			<OgMetaTags title={blog()!.title} description={blog()!.description} imgUrl={createOgpImageUrl(blog()!.title, blog()!.tags).href} type="article" twitter={{ username: "re_taro_", imgType: "summary_large_image" }} />
			<ArticleTags tags={blog()!.tags} />
			<div
				class={css({
					marginTop: "[5.25rem]",
					paddingX: "6",
					paddingY: "4",
					width: "[100dvw]",
				})}
			>
				<Article article={blog()!.mdast as A.Article} abstract={blog()!.abstract} slug={blog()!._meta.directory} publishedAt={blog()!.publishedAt} updatedAt={blog()!.updatedAt} tags={blog()!.tags} />
			</div>
		</Show>
	);
};

export default function Page(props: RouteSectionProps) {
	return (
		<Suspense fallback={null}>
			<Content slug={props.params.slug} />
		</Suspense>
	);
};
