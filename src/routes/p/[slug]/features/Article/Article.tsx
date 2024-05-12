import { component$ } from "@builder.io/qwik";
import type { Article as JsonLdArticle, WithContext } from "schema-dts";
import { Temporal } from "temporal-polyfill";
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

export default component$<Props>(({ article, abstract, slug, publishedAt, updatedAt, tags }) => {
	const jsonLd: WithContext<JsonLdArticle> = {
		"@context": "https://schema.org",
		"@type": "Article",
		"headline": article.title.plain,
		abstract,
		"datePublished": Temporal.ZonedDateTime.from(publishedAt).toString({
			timeZoneName: "never",
		}),
		...(typeof updatedAt !== "undefined"
			? {
					dateModified: Temporal.ZonedDateTime.from(updatedAt).toString(
						{
							timeZoneName: "never",
						},
					),
				}
			: {}),
		"image": createOgpImageUrl(article.title.plain, tags)
			.href,
		"author": {
			"@type": "Person",
			"name": "Rintaro Itokawa",
			"url": "https://re-taro.dev",
		},
	};

	return (
		<article>
			<Header title={article.title} publishedAt={publishedAt} updatedAt={updatedAt} tags={tags} />
			<div class={css({
				display: "flex",
				flexDirection: "row-reverse",
				columnGap: "4",
				maxWidth: "[calc(80ch + 30ch + 1rem)]",
				marginX: "auto",
			})}
			>
				<Toc
					toc={article.toc}
					css={css.raw({
						"width": "[30ch]",

						"@media screen and (max-width: 130ch)": {
							display: "none",
						},
					})}
				/>
				<div class={css({
					"width": "[calc(100% - 30ch - 1rem)]",

					"& > markdown_section:first-child > markdown_heading": {
						marginTop: "0",
					},

					"@media screen and (max-width: 130ch)": {
						width: "full",
					},
				})}
				>
					<Markdown nodes={article.children} footnoteDefs={article.footnotes} />
					<Footnote footnotes={article.footnotes} />
					<Footer plainTitle={article.title.plain} slug={slug} />
				</div>
			</div>
			<script type="application/ld+json" dangerouslySetInnerHTML={JSON.stringify(jsonLd)} />
		</article>
	);
});
