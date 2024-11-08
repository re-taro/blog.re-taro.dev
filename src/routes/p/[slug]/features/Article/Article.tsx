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
	abstract: string;
	article: A.Article;
	publishedAt: string;
	slug: string;
	tags: Array<string>;
	updatedAt?: string | undefined;
}

const Article: Component<Props> = (props) => {
	const jsonLd: WithContext<JsonLdArticle> = {
		"@context": "https://schema.org",
		"@type": "Article",
		"abstract": props.abstract,
		"datePublished": Temporal.ZonedDateTime.from(props.publishedAt).toString({
			timeZoneName: "never",
		}),
		"headline": props.article.title.plain,
		...(typeof props.updatedAt !== "undefined"
			? {
					dateModified: Temporal.ZonedDateTime.from(props.updatedAt).toString(
						{
							timeZoneName: "never",
						},
					),
				}
			: {}),
		"author": {
			"@type": "Person",
			"name": "Rintaro Itokawa",
			"url": "https://re-taro.dev",
		},
		"image": createOgpImageUrl(props.article.title.plain, props.tags)
			.href,
	};

	return (
		<article>
			<Header
				css={css.raw({
					marginX: "auto",
					maxWidth: "[calc(80ch + 30ch + 1rem)]",
				})}
				publishedAt={props.publishedAt}
				tags={props.tags}
				title={props.article.title}
				updatedAt={props.updatedAt}
			/>
			<div
				class={css({
					columnGap: "4",
					display: "flex",
					flexDirection: "row-reverse",
					marginX: "auto",
					maxWidth: "[calc(80ch + 30ch + 1rem)]",
				})}
			>
				<Toc
					css={css.raw({
						"@media screen and (max-width: 130ch)": {
							display: "none",
						},
						"width": "[30ch]",
					})}
					toc={props.article.toc}
				/>
				<div
					class={css({
						"& > .markdown_section:first-child > .markdown_heading": {
							marginTop: "0",
						},
						"@media screen and (max-width: 130ch)": {
							width: "full",
						},
						"color": "text.main",
						"fontSize": "m",
						"fontWeight": "normal",
						"lineHeight": "normal",
						"width": "[calc(100% - 30ch - 1rem)]",
					})}
				>
					<Markdown footnoteDefs={props.article.footnotes} nodes={props.article.children} />
					<Footnote footnotes={props.article.footnotes} />
					<Footer plainTitle={props.article.title.plain} slug={props.slug} />
				</div>
			</div>
			{/*  eslint-disable-next-line solid/no-innerhtml */}
			<script innerHTML={JSON.stringify(jsonLd)} type="application/ld+json" />
		</article>
	);
};

export default Article;
