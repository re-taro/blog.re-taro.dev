import { component$ } from "@builder.io/qwik";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.DescriptionDetails;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

export default component$<Props>(({ node, footnoteDefs }) => {
	return (
		<dd class={css({
			position: "relative",
			paddingLeft: "6",
			marginLeft: "[1em]",

			_before: {
				position: "absolute",
				content: "'-'",
				marginLeft: "[-1em]",

				_supportsAlternativeTextAfter: {
					content: "'-' / ''",
				},
			},
		})}
		>
			<MarkdownChildren nodes={node.children} footnoteDefs={footnoteDefs} />
		</dd>
	);
});
