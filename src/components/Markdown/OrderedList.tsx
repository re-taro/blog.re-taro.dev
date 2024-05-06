import { component$ } from "@builder.io/qwik";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.OrderedList;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

export default component$<Props>(({ node, footnoteDefs }) => {
	return (
		<ol
			start={node.start}
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
			<MarkdownChildren nodes={node.children} footnoteDefs={footnoteDefs} />
		</ol>
	);
});
