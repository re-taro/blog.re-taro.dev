import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	footnoteDefs: Array<A.FootnoteDefinition>;
	node: A.UnorderedList;
}

const UnorderedList: Component<Props> = (props) => {
	return (
		<ul class={css({
			"& > li": {
				_before: {
					content: "'-'",
					marginLeft: "[-1em]",
					position: "absolute",
				},
				marginLeft: "[1em]",

				position: "relative",
			},

			"paddingLeft": "6",
		})}
		>
			<MarkdownChildren footnoteDefs={props.footnoteDefs} nodes={props.node.children} />
		</ul>
	);
};

export default UnorderedList;
