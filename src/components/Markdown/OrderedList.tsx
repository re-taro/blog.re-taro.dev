import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	footnoteDefs: Array<A.FootnoteDefinition>;
	node: A.OrderedList;
}

const OrderedList: Component<Props> = (props) => {
	return (
		<ol
			class={css({
				"& > li": {
					_before: {
						_supportsAlternativeTextAfter: {
							content: "counter(list) '.' / ''",
						},
						content: "counter(list) '.'",
						counterIncrement: "list",
						marginLeft: "[-1em]",
						position: "absolute",
					},
					marginLeft: "[1em]",
					position: "relative",
				},
				"counterReset": "list",
				"paddingLeft": "6",
			})}
			start={props.node.start}
		>
			<MarkdownChildren footnoteDefs={props.footnoteDefs} nodes={props.node.children} />
		</ol>
	);
};

export default OrderedList;
