import { env } from 'cloudflare:workers';
import { css } from 'styled-system/css';
import { Temporal } from 'temporal-polyfill';
import { ArticleTags } from '../../../../components/meta/ArticleTags';
import { OgMetaTags } from '../../../../components/meta/OgMetaTags';
import { createOgpImageUrl } from '../../../../context/og';
import { Article } from '../Article';
import type * as A from 'ast';
import type { Blog } from 'contents';
import type { FC } from 'react';

interface Props {
	request: Request;
}

export const Post: FC<Props> = async ({ request }) => {
	const { blog } = await env.CONTENTS.fetch(request).then(async (res) => await res.json<{ blog: Blog }>());

	return (
		<>
			<title>{blog.title}</title>
			<meta name="description" content={blog.description} />
			<meta
				name="article:published_time"
				content={Temporal.ZonedDateTime.from(blog.publishedAt).toString({ timeZoneName: 'never' })}
			/>
			{blog.updatedAt != null && (
				<meta
					name="article:modified_time"
					content={Temporal.ZonedDateTime.from(blog.updatedAt).toString({ timeZoneName: 'never' })}
				/>
			)}
			<OgMetaTags
				description={blog.description}
				imgUrl={createOgpImageUrl(blog.title, blog.tags).href}
				title={blog.title}
				twitter={{
					description: blog.description,
					imgType: 'summary_large_image',
					imgUrl: createOgpImageUrl(blog.title, blog.tags).href,
					title: blog.title,
					username: 're_taro_',
				}}
				type="article"
			/>
			<ArticleTags tags={blog.tags} />
			<div
				className={css({
					marginTop: '[5.25rem]',
					paddingX: '6',
					paddingY: '4',
					width: '[100dvw]',
				})}>
				<Article
					abstract={blog.abstract}
					article={blog.mdast as A.Article}
					publishedAt={blog.publishedAt}
					slug={blog._meta.directory}
					tags={blog.tags}
					updatedAt={blog.updatedAt}
				/>
			</div>
		</>
	);
};
