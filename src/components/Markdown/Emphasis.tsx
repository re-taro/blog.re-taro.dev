import { component$ } from "@builder.io/qwik";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.Emphasis;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

export default component$<Props>(({ node, footnoteDefs }) => {
	return (
		<em class={css({
			fontWeight: "bold",

			_before: {
				content: "'*'",
			},

			_after: {
				content: "'*'",
			},

			_supportsAlternativeTextAfter: {
				_before: {
					content: "'*' / ''",
				},

				_after: {
					content: "'*' / ''",
				},
			},
		})}
		>
			<MarkdownChildren nodes={node.children} footnoteDefs={footnoteDefs} />
		</em>
	);
});
