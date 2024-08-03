import type { Article as JsonLdArticle, WithContext } from "schema-dts";
import { Temporal } from "temporal-polyfill";
import type { Component } from "solid-js";
import Header from "../Header/Header";
import Toc from "../Toc/Toc";
import Footnote from "../Footnote/Footnote";
import Footer from "../Footer/Footer";
import { createOgpImageUrl } from "~/libs/og";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";
import Markdown from "~/components/Markdown/Markdown";

interface Props {
	article: A.Article;
	abstract: string;
	slug: string;
	publishedAt: string;
	updatedAt?: string | undefined;
	tags: Array<string>;
}

const Article: Component<Props> = (props) => {
	const jsonLd: WithContext<JsonLdArticle> = {
		"@context": "https://schema.org",
		"@type": "Article",
		"headline": props.article.title.plain,
		"abstract": props.abstract,
		"datePublished": Temporal.ZonedDateTime.from(props.publishedAt).toString({
			timeZoneName: "never",
		}),
		...(typeof props.updatedAt !== "undefined"
			? {
					dateModified: Temporal.ZonedDateTime.from(props.updatedAt).toString(
						{
							timeZoneName: "never",
						},
					),
				}
			: {}),
		"image": createOgpImageUrl(props.article.title.plain, props.tags)
			.href,
		"author": {
			"@type": "Person",
			"name": "Rintaro Itokawa",
			"url": "https://re-taro.dev",
		},
	};

	return (
		<article>
			<Header
				title={props.article.title}
				publishedAt={props.publishedAt}
				updatedAt={props.updatedAt}
				tags={props.tags}
				css={css.raw({
					maxWidth: "[calc(80ch + 30ch + 1rem)]",
					marginX: "auto",
				})}
			/>
			<div class={css({
				display: "flex",
				flexDirection: "row-reverse",
				columnGap: "4",
				maxWidth: "[calc(80ch + 30ch + 1rem)]",
				marginX: "auto",
			})}
			>
				<Toc
					toc={props.article.toc}
					css={css.raw({
						"width": "[30ch]",

						"@media screen and (max-width: 130ch)": {
							display: "none",
						},
					})}
				/>
				<div class={css({
					"width": "[calc(100% - 30ch - 1rem)]",
					"color": "text.main",
					"fontSize": "m",
					"fontWeight": "normal",
					"lineHeight": "normal",

					"& > .markdown_section:first-child > .markdown_heading": {
						marginTop: "0",
					},

					"@media screen and (max-width: 130ch)": {
						width: "full",
					},
				})}
				>
					<Markdown nodes={props.article.children} footnoteDefs={props.article.footnotes} />
					<Footnote footnotes={props.article.footnotes} />
					<Footer plainTitle={props.article.title.plain} slug={props.slug} />
				</div>
			</div>
			<script type="application/ld+json" innerHTML={JSON.stringify(jsonLd)} />
		</article>
	);
};

export default Article;
