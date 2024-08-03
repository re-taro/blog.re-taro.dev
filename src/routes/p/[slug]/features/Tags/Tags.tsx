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
				"color": "text.main",

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

				"_after": {
					content: "','",
					paddingInlineEnd: "2",

					_supportsAlternativeTextAfter: {
						content: "',' / ''",
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
			})}
		>
			<A
				href={`/tags#${props.tag}`}
				class={css({
					color: "accent.secondary",

					_hover: {
						color: "accent.main",
					},

					_focus: {
						color: "accent.main",
					},
				})}
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
