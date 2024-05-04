import { component$ } from "@builder.io/qwik";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.Paragraph;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

export default component$<Props>(({ node, footnoteDefs }) => {
	return (
		<p class={css({ lineHeight: "normal" })}>
			<MarkdownChildren nodes={node.children} footnoteDefs={footnoteDefs} />
		</p>
	);
});
