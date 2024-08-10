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
			<Meta content="タグ一覧" name="description" />
			<OgMetaTags description="タグ一覧" imgUrl="https://og.re-taro.dev?title=Tags&text=blog.re-taro.dev" title="タグ一覧" twitter={{ imgType: "summary_large_image", username: "re_taro_" }} type="website" />
			<Show
				when={allBlogs()}
			>
				{blogs => (
					<div
						class={css({
							marginTop: "[6.25rem]",
							paddingX: "6",
						})}
					>
						<section
							class={css({
								marginX: "auto",
								maxWidth: "[calc(110ch + 1rem)]",
							})}
						>
							<h1
								class={css({
									_before: {
										_supportsAlternativeTextAfter: {
											content: "'#' / ''",
										},
										content: "'#'",
										marginLeft: "[-1em]",
										position: "absolute",
									},
									color: "text.main",
									fontSize: "3xl",
									fontWeight: "bold",
									lineHeight: "tight",
									marginLeft: "[1em]",
									position: "relative",
									textAlign: "center",
								})}
							>
								Tags
							</h1>
							<Index
								each={Array.from(blogs().filter(blog => import.meta.env.DEV || blog.published).reduce((acc, blog) => {
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
												_before: {
													_supportsAlternativeTextAfter: {
														content: "'##' / ''",
													},
													content: "'##'",
													marginLeft: "[-1.8em]",
													position: "absolute",
												},
												color: "text.main",
												fontSize: "2xl",
												fontWeight: "bold",
												lineHeight: "tight",
												marginLeft: "[1.8em]",
												position: "relative",
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
														borderBottom: "[1.2px solid {colors.border.main}]",
														marginTop: "6",
														paddingBottom: "2",
													})}
												>
													<h3
														class={css({
															color: "text.main",
															fontSize: "xl",
															fontWeight: "bold",
															lineHeight: "tight",
														})}
													>
														<A
															class={css({
																_focus: {
																	color: "accent.main",
																},

																_hover: {
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
				)}
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
