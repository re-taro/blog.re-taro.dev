import { Meta, Title } from "@solidjs/meta";
import type { RouteDefinition } from "@solidjs/router";
import { A, cache, createAsync } from "@solidjs/router";
import type { Blog } from "content-collections";
import type { Component } from "solid-js";
import { Index, Show, Suspense } from "solid-js";
import { Temporal } from "temporal-polyfill";
import { OgMetaTags } from "~/components/Meta/Meta";
import { css } from "~/styled-system/css";

const loadAllPostsForTags = cache(async () => {
	"use server";

	const { allBlogs } = await import("content-collections");

	return allBlogs;
}, "loadAllPostsForTags");

export const route = {
	preload: () => loadAllPostsForTags(),
} as const satisfies RouteDefinition;

const Content: Component = () => {
	const allBlogs = createAsync(() => loadAllPostsForTags());

	return (
		<>
			<Title>タグ一覧</Title>
			<Meta name="description" content="タグ一覧" />
			<OgMetaTags title="タグ一覧" description="タグ一覧" imgUrl="https://og.re-taro.dev?title=Tags&text=blog.re-taro.dev" type="website" twitter={{ username: "re_taro_", imgType: "summary_large_image" }} />
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
							Tags
						</h1>
						<Index
							each={Array.from(allBlogs()!.filter(blog => import.meta.env.DEV || blog.published).reduce((acc, blog) => {
								blog.tags.forEach((tag) => {
									if (acc.has(tag))
										acc.get(tag)?.push(blog); // MEMO: This is an safe operation because the tag is already in the map.
									else
										acc.set(tag, [blog]);
								});

								return acc;
							}, new Map<string, Array<Blog>>())
								.entries())
								.sort((a, b) => a[0] > b[0] ? 1 : -1)}
						>
							{map => (
								<section
									class={css({
										marginTop: "6",
										paddingBottom: "2",
									})}
								>
									<h2
										class={css({
											color: "text.main",
											fontWeight: "bold",
											lineHeight: "tight",
											position: "relative",
											fontSize: "2xl",
											marginLeft: "[1.8em]",

											_before: {
												position: "absolute",
												content: "'##'",
												marginLeft: "[-1.8em]",

												_supportsAlternativeTextAfter: {
													content: "'##' / ''",
												},
											},
										})}
										id={`#${map()[0]}`}
									>
										{map()[0]}
									</h2>
									<Index
										each={map()[1].filter(blog => import.meta.env.DEV || blog.published).sort((a, b) => Temporal.ZonedDateTime.compare(
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
												<h3
													class={css({
														color: "text.main",
														fontWeight: "bold",
														lineHeight: "tight",
														fontSize: "xl",
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
												</h3>
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
