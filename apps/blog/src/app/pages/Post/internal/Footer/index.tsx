import { css } from 'styled-system/css';
import { getEditPostUrl, getPostUrl } from './helper';
import type { FC } from 'react';

interface Props {
	plainTitle: string;
	slug: string;
}

export const Footer: FC<Props> = ({ plainTitle, slug }) => {
	const editUrl = getEditPostUrl(slug);

	const title = `${plainTitle} | ${'blog.re-taro.dev'.replaceAll('.', '․')}`;
	const url = getPostUrl(slug).href;

	const twitterUrl = new URL('https://twitter.com/share');
	twitterUrl.searchParams.set('text', title);
	twitterUrl.searchParams.set('url', url);
	twitterUrl.searchParams.set('via', 're_taro_');
	twitterUrl.searchParams.set('related', 're_taro_');

	return (
		<footer
			className={css({
				marginTop: '8',
				textAlign: 'end',
			})}>
			<ul
				className={css({
					display: 'flex',
					flexWrap: 'wrap',
					gap: '4',
					justifyContent: 'flex-end',
				})}>
				<li
					className={css({
						marginRight: 'auto',
					})}>
					<a
						className={css({
							_focus: {
								color: 'text.main',
							},
							_hover: {
								color: 'text.main',
							},
							border: '[1px solid {colors.border.main}]',
							borderRadius: 'full',
							color: 'text.secondary',
							paddingX: '4',
							paddingY: '2',
						})}
						href={editUrl.href}
						rel="noreferrer"
						target="_blank">
						編集の提案をする
					</a>
				</li>
				<li>
					<a
						className={css({
							_focus: {
								backgroundColor: 'accent.main',
								color: 'bg.main',
							},
							_hover: {
								backgroundColor: 'accent.main',
								color: 'bg.main',
							},
							backgroundColor: '[unset]',
							border: '[1px solid {colors.accent.main}]',
							borderRadius: 'full',
							color: 'text.main',
							paddingX: '4',
							paddingY: '2',
							transition: '[background-color 0.2s ease-in-out, color 0.2s ease-in-out]',
						})}
						href={twitterUrl.toString()}
						rel="noreferrer"
						target="_blank">
						Twitterにポスト
					</a>
				</li>
			</ul>
		</footer>
	);
};
