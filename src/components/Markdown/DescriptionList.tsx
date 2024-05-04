import { component$ } from "@builder.io/qwik";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.DescriptionList;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

export default component$<Props>(({ node, footnoteDefs }) => {
	return (
		<dl class={css({
			"& > dt": {
				marginLeft: "[1em]",

				_before: {
					content: "'-'",
					marginLeft: "[-1em]",
				},

				_after: {
					content: "':'",
				},

				_supportsAlternativeTextAfter: {
					_before: {
						content: "'-' / ''",
					},

					_after: {
						content: "':' / ''",
					},
				},
			},
		})}
		>
			<MarkdownChildren nodes={node.children} footnoteDefs={footnoteDefs} />
		</dl>
	);
});
