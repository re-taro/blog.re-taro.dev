import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.UnorderedList;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

const UnorderedList: Component<Props> = (props) => {
	return (
		<ul class={css({
			"paddingLeft": "6",

			"& > li": {
				position: "relative",
				marginLeft: "[1em]",

				_before: {
					position: "absolute",
					content: "'-'",
					marginLeft: "[-1em]",
				},
			},
		})}
		>
			<MarkdownChildren nodes={props.node.children} footnoteDefs={props.footnoteDefs} />
		</ul>
	);
};

export default UnorderedList;
