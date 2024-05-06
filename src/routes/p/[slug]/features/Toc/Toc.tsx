import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import type * as A from "~/libs/plugins/ast/ast";
import { css, cx } from "~/styled-system/css";
import type { SystemStyleObject } from "~/styled-system/types";

interface TocProps {
	toc: Array<A.Toc>;
	css?: SystemStyleObject;
}

export default component$<TocProps>(({ toc, css: cssStyle }) => {
	const activeIds = useSignal<Array<string>>([]);

	// eslint-disable-next-line qwik/no-use-visible-task
	useVisibleTask$(({ cleanup }) => {
		const observer = new IntersectionObserver(
			(event) => {
				const outIds = new Set(
					event
						.filter(entry => !entry.isIntersecting)
						.map((entry) => {
							const heading = entry.target.querySelector("h1,h2,h3,h4,h5,h6");
							if (!heading)
								return undefined;
							return heading.id;
						})
						.filter((id): id is string => id !== undefined),
				);

				const inIds = event
					.filter(entry => entry.isIntersecting)
					.map((entry) => {
						const heading = entry.target.querySelector("h1,h2,h3,h4,h5,h6");
						if (!heading)
							return undefined;
						return heading.id;
					})
					.filter((id): id is string => id !== undefined);

				activeIds.value = [
					...activeIds.value.filter(id => !outIds.has(id)),
					...inIds,
				];
			},
			{
				root: null,
				rootMargin: "-80px 0px 0px 0px",
				threshold: [0],
			},
		);

		const subscribe = (item: A.Toc) => {
			const id = item.id;

			const heading = document.getElementById(id);
			if (!heading)
				return;

			const section = heading.closest("section");
			if (!section)
				return;

			observer.observe(section);
			item.children.forEach(subscribe);
		};
		toc.forEach(subscribe);

		cleanup(() => {
			observer.disconnect();
		});
	});

	return (
		<div class={css(cssStyle)}>
			<nav
				class={css({
					position: "sticky",
					top: "[6.25rem]",
					color: "text.secondary",
				})}
			>
				<h2
					class={css({
						marginBottom: "2",
						fontSize: "xl",
						color: "text.main",
					})}
				>
					toc
				</h2>
				<ul
					class={css({
						paddingY: "1",
						paddingLeft: "2",
					})}
				>
					{toc.map(item => (
						<TocItem toc={item} activeIds={activeIds.value} level={1} key={item.id} />
					))}
				</ul>
			</nav>
		</div>
	);
});

interface TocItemProps {
	toc: A.Toc;
	activeIds: Array<string>;
	level: number;
}

export function TocItem({ toc, activeIds, level }: TocItemProps) {
	return (
		<li
			class={cx(css({
				paddingY: "1",
				paddingLeft: "2",
				borderLeft: "[2px solid {colors.border.main}]",
				transition: "[border-color 0.2s ease-in-out]",
			}), activeIds.includes(toc.id) && css({
				borderLeftColor: "accent.main",
			}))}
		>
			<a
				href={`#${toc.id}`}
				class={css({
					color: "text.secondary",
					transition: "[color 0.2s ease-in-out]",

					_hover: {
						color: "text.main",
					},

					_focus: {
						color: "text.main",
					},
				})}
			>
				{toc.plain}
			</a>
			{toc.children.length > 0 && (
				<ul
					class={css({
						paddingY: "1",
						paddingLeft: "2",
					})}
				>
					{toc.children.map(child => (
						<TocItem toc={child} activeIds={activeIds} level={level + 1} key={child.id} />
					))}
				</ul>
			)}
		</li>
	);
}
