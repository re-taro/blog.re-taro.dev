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
		<Show when={blog()}>
			{slug => (
				<>
					<Title>{slug().title}</Title>
					<Meta content={slug().description} name="description" />
					<Meta content={Temporal.ZonedDateTime.from(slug().publishedAt).toString({ timeZoneName: "never" })} name="article:published_time" />
					<Show when={slug().updatedAt}>
						{updatedAt => (
							<Meta content={Temporal.ZonedDateTime.from(updatedAt()).toString({ timeZoneName: "never" })} name="article:modified_time" />
						)}
					</Show>
					<OgMetaTags description={slug().description} imgUrl={createOgpImageUrl(slug().title, slug().tags).href} title={slug().title} twitter={{ imgType: "summary_large_image", username: "re_taro_" }} type="article" />
					<ArticleTags tags={slug().tags} />
					<div
						class={css({
							marginTop: "[5.25rem]",
							paddingX: "6",
							paddingY: "4",
							width: "[100dvw]",
						})}
					>
						<Article abstract={slug().abstract} article={slug().mdast as A.Article} publishedAt={slug().publishedAt} slug={slug()._meta.directory} tags={slug().tags} updatedAt={slug().updatedAt} />
					</div>
				</>
			)}
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
