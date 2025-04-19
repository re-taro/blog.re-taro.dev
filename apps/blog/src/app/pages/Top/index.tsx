import { Suspense } from 'react';
import { css } from 'styled-system/css';
import { Layout } from '../../components/layout/Layout';
import { OgMetaTags } from '../../components/meta/OgMetaTags';
import { BlogList } from './internal/BlogList';
import type { JSX } from 'react';

export const Top = ({ request }: { request: Request }): JSX.Element => {
	return (
		<Layout>
			<title>blog.re-taro.dev</title>
			<meta content="ブログ記事一覧" name="description" />
			<OgMetaTags
				description="ブログ記事一覧"
				imgUrl="https://og.re-taro.dev?title=Blog+posts&text=blog.re-taro.dev"
				title="blog.re-taro.dev"
				twitter={{ imgType: 'summary_large_image', username: 're_taro_' }}
				type="website"
			/>
			<div
				className={css({
					marginTop: '[6.25rem]',
					paddingX: '6',
				})}>
				<section
					className={css({
						marginX: 'auto',
						maxWidth: '[calc(110ch + 1rem)]',
					})}>
					<h1
						className={css({
							_before: {
								_supportsAlternativeTextAfter: {
									content: "'#' / ''",
								},
								content: "'#'",
								marginLeft: '[-1em]',

								position: 'absolute',
							},
							color: 'text.main',
							fontSize: '3xl',
							fontWeight: 'bold',
							lineHeight: 'tight',
							marginLeft: '[1em]',
							position: 'relative',
							textAlign: 'center',
						})}>
						Archive
					</h1>
					<Suspense fallback={null}>
						<BlogList request={request} />
					</Suspense>
				</section>
			</div>
		</Layout>
	);
};
