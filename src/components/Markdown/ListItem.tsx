import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";

interface Props {
	footnoteDefs: Array<A.FootnoteDefinition>;
	node: A.ListItem;
}

const ListItem: Component<Props> = (props) => {
	return (
		<li>
			<MarkdownChildren footnoteDefs={props.footnoteDefs} nodes={props.node.children} />
		</li>
	);
};

export default ListItem;
