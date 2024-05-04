import { component$ } from "@builder.io/qwik";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";

interface Props {
	node: A.ListItem;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

export default component$<Props>(({ node, footnoteDefs }) => {
	return (
		<li>
			<MarkdownChildren nodes={node.children} footnoteDefs={footnoteDefs} />
		</li>
	);
});
