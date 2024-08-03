import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.OrderedList;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

const OrderedList: Component<Props> = (props) => {
	return (
		<ol
			start={props.node.start}
			class={css({
				"paddingLeft": "6",
				"counterReset": "list",

				"& > li": {
					position: "relative",
					marginLeft: "[1em]",

					_before: {
						position: "absolute",
						content: "counter(list) '.'",
						marginLeft: "[-1em]",
						counterIncrement: "list",

						_supportsAlternativeTextAfter: {
							content: "counter(list) '.' / ''",
						},
					},
				},
			})}
		>
			<MarkdownChildren nodes={props.node.children} footnoteDefs={props.footnoteDefs} />
		</ol>
	);
};

export default OrderedList;
