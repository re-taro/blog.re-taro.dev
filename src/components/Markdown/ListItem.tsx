import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";

interface Props {
	node: A.ListItem;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

const ListItem: Component<Props> = (props) => {
	return (
		<li>
			<MarkdownChildren nodes={props.node.children} footnoteDefs={props.footnoteDefs} />
		</li>
	);
};

export default ListItem;
