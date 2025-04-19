/* eslint-disable array-callback-return */
'use client';

import { useEffect, useState } from 'react';
import { css } from 'styled-system/css';
import { TocItem } from './internal/TocItem';
import type * as A from 'ast';
import type { FC } from 'react';
import type { SystemStyleObject } from 'styled-system/types';

interface TocProps {
	toc: A.Toc[];
	css?: SystemStyleObject;
}

export const Toc: FC<TocProps> = ({ toc, css: cssStyle }) => {
	const [activeIds, setActiveIds] = useState<string[]>([]);

	useEffect(() => {
		const inObserver = new IntersectionObserver(
			(event) => {
				const outIds = new Set(
					event
						.filter((entry) => !entry.isIntersecting)
						.map((entry) => {
							const $heading = entry.target.querySelector('h1,h2,h3,h4,h5,h6');
							if (!$heading) return;
							return $heading.id;
						})
						.filter((id): id is string => id !== undefined),
				);
				const inIds = event
					.filter((entry) => entry.isIntersecting)
					.map((entry) => {
						const $heading = entry.target.querySelector('h1,h2,h3,h4,h5,h6');
						if (!$heading) return;
						return $heading.id;
					})
					.filter((id): id is string => id !== undefined);

				setActiveIds((prev) => [...prev.filter((id) => !outIds.has(id)), ...inIds]);
			},
			{
				root: null,
				rootMargin: '-80px 0px 0px 0px',
				threshold: [0],
			},
		);

		const subscribe = (item: A.Toc) => {
			const id = item.id;

			// eslint-disable-next-line unicorn/prefer-query-selector
			const $heading = document.getElementById(id);
			if (!$heading) return;

			const $section = $heading.closest('section');
			if (!$section) return;

			inObserver.observe($section);
			for (const child of item.children) {
				subscribe(child);
			}
		};
		for (const item of toc) {
			subscribe(item);
		}

		return () => {
			inObserver.disconnect();
		};
	}, [toc]);

	return (
		<div className={css(cssStyle)}>
			<nav
				className={css({
					color: 'text.secondary',
					position: 'sticky',
					top: '[6.25rem]',
				})}>
				<h2
					className={css({
						color: 'text.main',
						fontSize: 'xl',
						marginBottom: '2',
					})}>
					toc
				</h2>
				<ul
					className={css({
						paddingLeft: '2',
						paddingY: '1',
					})}>
					{toc.map((item) => (
						<TocItem activeIds={activeIds} level={1} toc={item} key={item.id} />
					))}
				</ul>
			</nav>
		</div>
	);
};
