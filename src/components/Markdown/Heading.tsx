import type { Component } from "solid-js";
import { Match, Switch, createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { cva, cx } from "~/styled-system/css";

interface Props {
	footnoteDefs: Array<A.FootnoteDefinition>;
	node: A.Heading;
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
				_before: {
					_supportsAlternativeTextAfter: {
						content: "'#' / ''",
					},
					content: "'#'",
					marginLeft: "[-1em]",
					position: "absolute",
				},
				fontSize: "2xl",
				marginLeft: "[1em]",
				position: "relative",
			},
			2: {
				_before: {
					_supportsAlternativeTextAfter: {
						content: "'##' / ''",
					},
					content: "'##'",
					marginLeft: "[-1.8em]",
					position: "absolute",
				},
				fontSize: "2xl",
				marginLeft: "[1.8em]",
				position: "relative",
			},
			3: {
				_before: {
					_supportsAlternativeTextAfter: {
						content: "'###' / ''",
					},
					content: "'###'",
					marginLeft: "[-2.4em]",
					position: "absolute",
				},
				fontSize: "xl",
				marginLeft: "[2.4em]",
				position: "relative",
			},
			4: {
				_before: {
					_supportsAlternativeTextAfter: {
						content: "'####' / ''",
					},
					content: "'####'",
					marginLeft: "[-3em]",
					position: "absolute",
				},
				fontSize: "ml",
				marginLeft: "[3em]",
				position: "relative",
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
	const memoizedH1 = createMemo(() => props.node.level === 1 ? props.node : undefined);
	const memoizedOher = createMemo(() => props.node.level > 1 ? props.node : undefined);

	return (
		<Dynamic class={cx(heading({ level: props.node.level }), "markdown_heading")} component={tag} id={props.node.id} title={props.node.id}>
			<Switch>
				<Match when={memoizedH1()}>
					{node => (
						<MarkdownChildren footnoteDefs={props.footnoteDefs} nodes={node().children} />
					)}
				</Match>
				<Match when={memoizedOher()}>
					{node => (
						<a aria-hidden="true" href={`#${props.node.id}`} tabIndex={-1}>
							<MarkdownChildren footnoteDefs={props.footnoteDefs} nodes={node().children} />
						</a>
					)}
				</Match>
			</Switch>
		</Dynamic>
	);
};

export default Heading;
