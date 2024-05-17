import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { css } from "~/styled-system/css";

interface TagsProps {
	tags: Array<string>;
}

export default component$<TagsProps>(({ tags }) => {
	return (
		<ul
			class={css({
				display: "inline-flex",
			})}
		>
			{tags.map((tag, idx) => (
				<Tag tag={tag} key={idx} />
			))}
		</ul>
	);
});

interface TagProps {
	tag: string;
}

function Tag({ tag }: TagProps) {
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
			<Link
				href={`/tags#${tag}`}
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
				{tag}
			</Link>
		</li>
	);
}
