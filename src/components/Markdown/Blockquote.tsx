import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	footnoteDefs: Array<A.FootnoteDefinition>;
	node: A.Blockquote;
}

const Blockquote: Component<Props> = (props) => {
	return (
		<blockquote
			class={css({
				"& > p": {
					_before: {
						_supportsAlternativeTextAfter: {
							content: "'>' / ''",
						},
						content: "'>'",
						marginLeft: "[-1em]",
						position: "absolute",
					},
					marginLeft: "[1em]",
					position: "relative",
				},
				"border": "[1px solid {colors.border.main}]",
				"borderRadius": "sm",
				"padding": "4",
			})}
		>
			<MarkdownChildren footnoteDefs={props.footnoteDefs} nodes={props.node.children} />
		</blockquote>
	);
};

export default Blockquote;
