import { Suspense } from 'react';
import { css } from 'styled-system/css';
import { Layout } from '../../components/layout/Layout';
import { OgMetaTags } from '../../components/meta/OgMetaTags';
import { TagList } from './internal/TagList';
import type { JSX } from 'react';

export const Tags = ({ request }: { request: Request }): JSX.Element => {
	return (
		<Layout>
			<title>タグ一覧</title>
			<meta content="タグ一覧" name="description" />
			<OgMetaTags
				description="タグ一覧"
				imgUrl="https://og.re-taro.dev?title=Tags&text=blog.re-taro.dev"
				title="タグ一覧"
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
						Tags
					</h1>
					<Suspense fallback={null}>
						<TagList request={request} />
					</Suspense>
				</section>
			</div>
		</Layout>
	);
};
