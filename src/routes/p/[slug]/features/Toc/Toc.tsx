import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import { Index, Show, createSignal, onCleanup, onMount } from "solid-js";
import type * as Ast from "~/libs/plugins/ast/ast";
import { css, cx } from "~/styled-system/css";
import type { SystemStyleObject } from "~/styled-system/types";

interface TocItemProps {
	activeIds: Array<string>;
	level: number;
	toc: Ast.Toc;
}

interface TocProps {
	toc: Array<Ast.Toc>;
	css?: SystemStyleObject;
}

const TocItem: Component<TocItemProps> = (props) => {
	return (
		<li
			class={cx(css({
				borderLeft: "[2px solid {colors.border.main}]",
				paddingLeft: "2",
				paddingY: "1",
				transition: "[border-color 0.2s ease-in-out]",
			}), props.activeIds.includes(props.toc.id) && css({
				borderLeftColor: "accent.main",
			}))}
		>
			<A
				class={css({
					_focus: {
						color: "text.main",
					},
					_hover: {
						color: "text.main",
					},
					color: "text.secondary",
					transition: "[color 0.2s ease-in-out]",
				})}
				href={`#${props.toc.id}`}
			>
				{props.toc.plain}
			</A>
			<Show when={props.toc.children.length > 0}>
				<ul
					class={css({
						paddingLeft: "2",
						paddingY: "1",
					})}
				>
					<Index each={props.toc.children}>
						{child => (
							<TocItem activeIds={props.activeIds} level={props.level + 1} toc={child()} />
						)}
					</Index>
				</ul>
			</Show>
		</li>
	);
};

const Toc: Component<TocProps> = (props) => {
	const [activeIds, setActiveIds] = createSignal<Array<string>>([]);
	onMount(() => {
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

				setActiveIds([
					...activeIds().filter(id => !outIds.has(id)),
					...inIds,
				]);
			},
			{
				root: null,
				rootMargin: "-80px 0px 0px 0px",
				threshold: [0],
			},
		);

		const subscribe = (item: Ast.Toc) => {
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
		props.toc.forEach(subscribe);

		onCleanup(() => {
			observer.disconnect();
		});
	});

	return (
		<div class={css(props.css)}>
			<nav
				class={css({
					color: "text.secondary",
					position: "sticky",
					top: "[6.25rem]",
				})}
			>
				<h2
					class={css({
						color: "text.main",
						fontSize: "xl",
						marginBottom: "2",
					})}
				>
					toc
				</h2>
				<ul
					class={css({
						paddingLeft: "2",
						paddingY: "1",
					})}
				>
					<Index each={props.toc}>
						{item => (
							<TocItem activeIds={activeIds()} level={1} toc={item()} />
						)}
					</Index>
				</ul>
			</nav>
		</div>
	);
};

export default Toc;
