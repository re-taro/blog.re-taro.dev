import { component$ } from "@builder.io/qwik";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { cva, cx } from "~/styled-system/css";

interface Props {
	node: A.Heading;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

const heading = cva({
	base: {
		color: "text.main",
		fontWeight: "bold",
		lineHeight: "tight",
	},
	variants: {
		level: {
			1: {
				fontSize: "2xl",
				marginLeft: "[1em]",

				_before: {
					content: "'#'",
					marginLeft: "[-1em]",

					_supportsAlternativeTextAfter: {
						content: "'#' / ''",
					},
				},
			},
			2: {
				fontSize: "2xl",
				marginLeft: "[1em]",

				_before: {
					content: "'##'",
					marginLeft: "[-1em]",

					_supportsAlternativeTextAfter: {
						content: "'##' / ''",
					},
				},
			},
			3: {
				fontSize: "xl",
				marginLeft: "[1em]",

				_before: {
					content: "'###'",
					marginLeft: "[-1em]",

					_supportsAlternativeTextAfter: {
						content: "'###' / ''",
					},
				},
			},
			4: {
				fontSize: "ml",
				marginLeft: "[1em]",

				_before: {
					content: "'####'",
					marginLeft: "[-1em]",

					_supportsAlternativeTextAfter: {
						content: "'####' / ''",
					},
				},
			},
			5: {
				fontSize: "sl",
			},
			6: {
				fontSize: "l",
			},
		},
	},
});

export default component$<Props>(({ node, footnoteDefs }) => {
	const Tag = `h${node.level}` as const;

	return (
		<Tag id={node.id} class={cx(heading({ level: node.level }), "markdown_heading")}>
			{node.level > 1
				? (
					<a href={`#${node.id}`} aria-hidden="true">
						<MarkdownChildren nodes={node.children} footnoteDefs={footnoteDefs} />
					</a>
					)
				: <MarkdownChildren nodes={node.children} footnoteDefs={footnoteDefs} />}
		</Tag>
	);
});
