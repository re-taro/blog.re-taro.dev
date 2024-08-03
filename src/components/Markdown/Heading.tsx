import type { Component } from "solid-js";
import { Dynamic } from "solid-js/web";
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
				position: "relative",
				fontSize: "2xl",
				marginLeft: "[1em]",

				_before: {
					position: "absolute",
					content: "'#'",
					marginLeft: "[-1em]",

					_supportsAlternativeTextAfter: {
						content: "'#' / ''",
					},
				},
			},
			2: {
				position: "relative",
				fontSize: "2xl",
				marginLeft: "[1.8em]",

				_before: {
					position: "absolute",
					content: "'##'",
					marginLeft: "[-1.8em]",

					_supportsAlternativeTextAfter: {
						content: "'##' / ''",
					},
				},
			},
			3: {
				position: "relative",
				fontSize: "xl",
				marginLeft: "[2.4em]",

				_before: {
					position: "absolute",
					content: "'###'",
					marginLeft: "[-2.4em]",

					_supportsAlternativeTextAfter: {
						content: "'###' / ''",
					},
				},
			},
			4: {
				position: "relative",
				fontSize: "ml",
				marginLeft: "[3em]",

				_before: {
					position: "absolute",
					content: "'####'",
					marginLeft: "[-3em]",

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

const Heading: Component<Props> = (props) => {
	const tag = `h${props.node.level}` as const;

	return (
		<Dynamic component={tag} id={props.node.id} title={props.node.id} class={cx(heading({ level: props.node.level }), "markdown_heading")}>
			{props.node.level > 1
				? (
					<a href={`#${props.node.id}`} aria-hidden="true" tabIndex={-1}>
						<MarkdownChildren nodes={props.node.children} footnoteDefs={props.footnoteDefs} />
					</a>
					)
				: <MarkdownChildren nodes={props.node.children} footnoteDefs={props.footnoteDefs} />}
		</Dynamic>
	);
};

export default Heading;
