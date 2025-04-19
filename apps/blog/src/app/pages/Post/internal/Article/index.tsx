import { Suspense } from 'react';
import { css } from 'styled-system/css';
import { Temporal } from 'temporal-polyfill';
import { createOgpImageUrl } from '../../../../context/og';
import { Footer } from '../Footer';
import { Footnote } from '../Footnote';
import { Header } from '../Header';
import { Markdown } from '../Markdown';
import { Toc } from '../Toc';
import type * as A from 'ast';
import type { FC } from 'react';
import type { Article as JsonLdArticle, WithContext } from 'schema-dts';

interface Props {
	abstract: string;
	article: A.Article;
	publishedAt: string;
	slug: string;
	tags: string[];
	updatedAt?: string | undefined;
}

export const Article: FC<Props> = ({ abstract, article, publishedAt, slug, tags, updatedAt }) => {
	const jsonLd: WithContext<JsonLdArticle> = {
		'@context': 'https://schema.org',
		'@type': 'Article',
		abstract,
		'datePublished': Temporal.ZonedDateTime.from(publishedAt).toString({
			timeZoneName: 'never',
		}),
		'headline': article.title.plain,
		...(updatedAt !== undefined ?
			{
				dateModified: Temporal.ZonedDateTime.from(updatedAt).toString({
					timeZoneName: 'never',
				}),
			}
		:	{}),
		'author': {
			'@type': 'Person',
			'name': 'Rintaro Itokawa',
			'url': 'https://re-taro.dev',
		},
		'image': createOgpImageUrl(article.title.plain, tags).href,
	};

	return (
		<article>
			<Header
				css={css.raw({
					marginX: 'auto',
					maxWidth: '[calc(80ch + 30ch + 1rem)]',
				})}
				publishedAt={publishedAt}
				tags={tags}
				title={article.title}
				updatedAt={updatedAt}
			/>
			<div
				className={css({
					columnGap: '4',
					display: 'flex',
					flexDirection: 'row-reverse',
					marginX: 'auto',
					maxWidth: '[calc(80ch + 30ch + 1rem)]',
				})}>
				<Toc
					css={css.raw({
						'@media screen and (max-width: 130ch)': {
							display: 'none',
						},
						'width': '[30ch]',
					})}
					toc={article.toc}
				/>
				<div
					className={css({
						'& > .markdown_section:first-child > .markdown_heading': {
							marginTop: '0',
						},
						'@media screen and (max-width: 130ch)': {
							width: 'full',
						},
						'color': 'text.main',
						'fontSize': 'm',
						'fontWeight': 'normal',
						'lineHeight': 'normal',
						'width': '[calc(100% - 30ch - 1rem)]',
					})}>
					<Suspense fallback={null}>
						<Markdown footnoteDefs={article.footnotes} nodes={article.children} />
					</Suspense>
					<Footnote footnotes={article.footnotes} />
					<Footer plainTitle={article.title.plain} slug={slug} />
				</div>
			</div>
			<script dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} type="application/ld+json" />
		</article>
	);
};
