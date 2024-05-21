import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { Link } from "@builder.io/qwik-city";
import { allBlogs } from "content-collections";
import { Temporal } from "temporal-polyfill";
import { ogMetaTags } from "~/libs/og";
import { css } from "~/styled-system/css";

export default component$(() => {
	return (
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
				{
					Array.from(allBlogs.filter(blog => import.meta.env.DEV || blog.published).reduce((acc, blog) => {
						blog.tags.forEach((tag) => {
							if (acc.has(tag))
								acc.get(tag)?.push(blog); // MEMO: This is an safe operation because the tag is already in the map.
							else
								acc.set(tag, [blog]);
						});

						return acc;
					}, new Map<string, typeof allBlogs>())
						.entries())
						.sort((a, b) => a[0] > b[0] ? 1 : -1)
						.map(([tag, blogs], idx) => (
							<section
								class={css({
									marginTop: "6",
									paddingBottom: "2",
								})}
								key={idx}
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
									id={`#${tag}`}
								>
									{tag}
								</h2>
								{blogs.filter(blog => import.meta.env.DEV || blog.published).sort((a, b) => Temporal.ZonedDateTime.compare(
									Temporal.ZonedDateTime.from(b.publishedAt),
									Temporal.ZonedDateTime.from(a.publishedAt),
								)).map((blog, idx) => (
									<section
										class={css({
											marginTop: "6",
											paddingBottom: "2",
											borderBottom: "[1.2px solid {colors.border.main}]",
										})}
										key={idx}
									>
										<h3
											class={css({
												color: "text.main",
												fontWeight: "bold",
												lineHeight: "tight",
												fontSize: "xl",
											})}
										>
											<Link
												class={css({
													_hover: {
														color: "accent.main",
													},

													_focus: {
														color: "accent.main",
													},
												})}
												href={`/p/${blog._meta.directory}`}
											>
												{blog.title}
											</Link>
										</h3>
										<time
											class={css({
												color: "text.secondary",
												fontSize: "m",
												lineHeight: "normal",
												marginY: "2",
											})}
											dateTime={Temporal.ZonedDateTime.from(blog.publishedAt).toString()}
										>
											{Temporal.PlainDate.from(blog.publishedAt).toString()}
										</time>
										<p
											class={css({
												color: "text.secondary",
												fontSize: "m",
												lineHeight: "normal",
												marginY: "4",
											})}
										>
											{`${blog.abstract.slice(0, 140)}...`}
										</p>
									</section>
								))}
							</section>
						))
				}
			</section>
		</div>
	);
});

export const head: DocumentHead = {
	title: "タグ一覧",
	meta: [
		{
			name: "description",
			content: "タグ一覧",
		},
		...ogMetaTags({
			title: "タグ一覧",
			description: "タグ一覧",
			imgUrl: "https://og.re-taro.dev?title=Tags&text=blog.re-taro.dev",
			type: "website",
			twitter: {
				username: "re_taro_",
				imgType: "summary_large_image",
			},
		}),
	],
};
