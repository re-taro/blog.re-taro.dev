import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import { Index } from "solid-js";
import { css } from "~/styled-system/css";

interface TagProps {
	tag: string;
}

interface TagsProps {
	tags: Array<string>;
}

const Tag: Component<TagProps> = (props) => {
	return (
		<li
			class={css({
				"&:first-child": {
					_before: {
						content: "'['",
						paddingInlineEnd: "1",
					},
					_supportsAlternativeTextAfter: {
						_before: {
							content: "'[' / ''",
							paddingInlineEnd: "1",
						},
					},
				},
				"&:last-child": {
					_after: {
						content: "']'",
						paddingInlineStart: "1",
					},
					_supportsAlternativeTextAfter: {
						_after: {
							content: "']' / ''",
							paddingInlineStart: "1",
						},
					},
				},
				"_after": {
					_supportsAlternativeTextAfter: {
						content: "',' / ''",
					},
					content: "','",
					paddingInlineEnd: "2",
				},
				"color": "text.main",
			})}
		>
			<A
				class={css({
					_focus: {
						color: "accent.main",
					},
					_hover: {
						color: "accent.main",
					},
					color: "accent.secondary",
				})}
				href={`/tags#${props.tag}`}
			>
				{props.tag}
			</A>
		</li>
	);
};

const Tags: Component<TagsProps> = (props) => {
	return (
		<ul
			class={css({
				display: "inline-flex",
			})}
		>
			<Index each={props.tags}>
				{tag => (
					<Tag tag={tag()} />
				)}
			</Index>
		</ul>
	);
};

export default Tags;
