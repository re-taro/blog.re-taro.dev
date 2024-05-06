import { component$ } from "@builder.io/qwik";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.UnorderedList;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

export default component$<Props>(({ node, footnoteDefs }) => {
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
			<MarkdownChildren nodes={node.children} footnoteDefs={footnoteDefs} />
		</ul>
	);
});
