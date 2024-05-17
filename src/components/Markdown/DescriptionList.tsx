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
				position: "relative",
				marginLeft: "[1em]",

				_before: {
					position: "absolute",
					content: "'-'",
					marginLeft: "[-1em]",
				},

				_after: {
					position: "absolute",
					content: "':'",
				},

				_supportsAlternativeTextAfter: {
					_before: {
						position: "absolute",
						content: "'-' / ''",
					},

					_after: {
						position: "absolute",
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
