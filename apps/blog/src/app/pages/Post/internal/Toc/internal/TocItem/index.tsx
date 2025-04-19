'use client';

import { css, cx } from 'styled-system/css';
import type * as A from 'ast';
import type { FC } from 'react';

interface TocItemProps {
	activeIds: string[];
	level: number;
	toc: A.Toc;
}

export const TocItem: FC<TocItemProps> = ({ activeIds, level, toc }) => {
	return (
		<li
			className={cx(
				css({
					borderLeft: '[2px solid {colors.border.main}]',
					paddingLeft: '2',
					paddingY: '1',
					transition: '[border-color 0.2s ease-in-out]',
				}),
				activeIds.includes(toc.id) &&
					css({
						borderLeftColor: 'accent.main',
					}),
			)}>
			<a
				className={css({
					_focus: {
						color: 'text.main',
					},
					_hover: {
						color: 'text.main',
					},
					color: 'text.secondary',
					transition: '[color 0.2s ease-in-out]',
				})}
				href={`#${toc.id}`}>
				{toc.plain}
			</a>
			{toc.children.length > 0 && (
				<ul
					className={css({
						paddingLeft: '2',
						paddingY: '1',
					})}>
					{toc.children.map((child) => (
						<TocItem activeIds={activeIds} level={level + 1} toc={child} key={child.id} />
					))}
				</ul>
			)}
		</li>
	);
};
