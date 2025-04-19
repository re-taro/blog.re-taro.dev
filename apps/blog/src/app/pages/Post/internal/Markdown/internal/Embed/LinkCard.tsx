import { css } from 'styled-system/css';
import type * as A from 'ast';
import type { FC } from 'react';
import type { unfurl } from 'unfurl.js';

type Metadata = Awaited<ReturnType<typeof unfurl>>;

interface Props {
	meta: Metadata;
	node: A.Embed;
}

export const LinkCard: FC<Props> = ({ meta, node }) => {
	const url = new URL(node.src);

	return (
		<a
			className={css({
				display: 'block',
			})}
			href={url.href}
			rel="noreferrer"
			target="_blank">
			<article
				className={css({
					_focus: {
						backgroundColor: 'bg.teriary',
					},
					_hover: {
						backgroundColor: 'bg.teriary',
					},
					border: '[1px solid {colors.border.main}]',
					borderRadius: 'sm',
					display: 'flex',
					overflow: 'hidden',
					transition: '[background-color 0.25s ease-in-out]',
				})}>
				<div
					className={css({
						display: 'grid',
						gap: '2',
						padding: '4',
					})}>
					<h2
						className={css({
							fontSize: 'l',
							fontWeight: 'bold',
							lineHeight: 'tight',
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						})}>
						{meta.title}
					</h2>
					<p
						className={css({
							overflow: 'hidden',
							textOverflow: 'ellipsis',
							whiteSpace: 'nowrap',
						})}>
						{meta.description}
					</p>
					<footer
						className={css({
							alignItems: 'center',
							display: 'flex',
							gap: '1',
						})}>
						<img
							className={css({
								aspectRatio: 'square',
								maxHeight: '4',
							})}
							alt=""
							height={16}
							src={meta.favicon ?? ''}
							width={16}
						/>
						<span
							className={css({
								overflow: 'hidden',
								textOverflow: 'ellipsis',
								whiteSpace: 'nowrap',
							})}>
							{url.hostname}
						</span>
					</footer>
				</div>
				{meta.open_graph.images && (
					<img
						className={css({
							borderLeft: '[1px solid {colors.border.main}]',
							maxHeight: '32',
							maxWidth: '[40%]',
							objectFit: 'cover',
						})}
						alt={meta.open_graph.images[0]?.alt ?? ''}
						src={meta.open_graph.images[0]?.url}
					/>
				)}
			</article>
		</a>
	);
};
