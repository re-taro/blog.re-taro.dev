import { Meta, Title } from "@solidjs/meta";
import type { RouteDefinition } from "@solidjs/router";
import { A, cache, createAsync } from "@solidjs/router";
import type { Component } from "solid-js";
import { Index, Show, Suspense } from "solid-js";
import { Temporal } from "temporal-polyfill";
import { OgMetaTags } from "~/components/Meta/Meta";
import { css } from "~/styled-system/css";

const loadAllPostsForTop = cache(async () => {
	"use server";

	const { allBlogs } = await import("content-collections");

	return allBlogs;
}, "loadAllPostsForTop");

export const route = {
	preload: () => loadAllPostsForTop(),
} as const satisfies RouteDefinition;

const Content: Component = () => {
	const allBlogs = createAsync(() => loadAllPostsForTop());

	return (
		<>
			<Title>blog.re-taro.dev</Title>
			<Meta name="description" content="ブログ記事一覧" />
			<OgMetaTags title="blog.re-taro.dev" description="ブログ記事一覧" imgUrl="https://og.re-taro.dev?title=Blog+posts&text=blog.re-taro.dev" type="website" twitter={{ username: "re_taro_", imgType: "summary_large_image" }} />
			<Show
				when={allBlogs()}
			>
				<div
					class={css({
						marginTop: "[6.25rem]",
						paddingX: "6",
					})}
				>
					<section
						class={css({
							maxWidth: "[calc(110ch + 1rem)]",
							marginX: "auto",
						})}
					>
						<h1
							class={css({
								color: "text.main",
								fontWeight: "bold",
								lineHeight: "tight",
								textAlign: "center",
								position: "relative",
								fontSize: "3xl",
								marginLeft: "[1em]",

								_before: {
									position: "absolute",
									content: "'#'",
									marginLeft: "[-1em]",

									_supportsAlternativeTextAfter: {
										content: "'#' / ''",
									},
								},
							})}
						>
							Archive
						</h1>
						<Index
							each={allBlogs()!.filter(blog => import.meta.env.DEV || blog.published).sort((a, b) => Temporal.ZonedDateTime.compare(
								Temporal.ZonedDateTime.from(b.publishedAt),
								Temporal.ZonedDateTime.from(a.publishedAt),
							))}
						>
							{blog => (
								<section
									class={css({
										marginTop: "6",
										paddingBottom: "2",
										borderBottom: "[1.2px solid {colors.border.main}]",
									})}
								>
									<h2
										class={css({
											color: "text.main",
											fontWeight: "bold",
											lineHeight: "tight",
											fontSize: "2xl",
										})}
									>
										<A
											class={css({
												_hover: {
													color: "accent.main",
												},

												_focus: {
													color: "accent.main",
												},
											})}
											href={`/p/${blog()._meta.directory}`}
										>
											{blog().title}
										</A>
									</h2>
									<time
										class={css({
											color: "text.secondary",
											fontSize: "m",
											lineHeight: "normal",
											marginY: "2",
										})}
										dateTime={Temporal.ZonedDateTime.from(blog().publishedAt).toString()}
									>
										{Temporal.PlainDate.from(blog().publishedAt).toString()}
									</time>
									<p
										class={css({
											color: "text.secondary",
											fontSize: "m",
											lineHeight: "normal",
											marginY: "4",
										})}
									>
										{`${blog().abstract.slice(0, 140)}...`}
									</p>
								</section>
							)}
						</Index>
					</section>
				</div>
			</Show>
		</>
	);
};

export default function Page() {
	return (
		<Suspense fallback={null}>
			<Content />
		</Suspense>
	);
}
