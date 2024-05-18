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
					Archive
				</h1>
				{allBlogs.filter(blog => blog.published).sort((a, b) => Temporal.ZonedDateTime.compare(
					Temporal.ZonedDateTime.from(a.publishedAt),
					Temporal.ZonedDateTime.from(b.publishedAt),
				)).map((blog, idx) => (
					<section
						class={css({
							marginTop: "6",
							paddingBottom: "2",
							borderBottom: "[1.2px solid {colors.border.main}]",
						})}
						key={idx}
					>
						<h2
							class={css({
								color: "text.main",
								fontWeight: "bold",
								lineHeight: "tight",
								fontSize: "2xl",
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
						</h2>
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
		</div>
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
