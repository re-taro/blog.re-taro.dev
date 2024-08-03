import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.Blockquote;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

const Blockquote: Component<Props> = (props) => {
	return (
		<blockquote class={css({
			"padding": "4",
			"border": "[1px solid {colors.border.main}]",
			"borderRadius": "sm",

			"& > p": {
				position: "relative",
				marginLeft: "[1em]",

				_before: {
					position: "absolute",
					content: "'>'",
					marginLeft: "[-1em]",

					_supportsAlternativeTextAfter: {
						content: "'>' / ''",
					},
				},
			},
		})}
		>
			<MarkdownChildren nodes={props.node.children} footnoteDefs={props.footnoteDefs} />
		</blockquote>
	);
};

export default Blockquote;
