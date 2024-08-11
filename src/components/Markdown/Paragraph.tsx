import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	footnoteDefs: Array<A.FootnoteDefinition>;
	node: A.Paragraph;
}

const Paragraph: Component<Props> = (props) => {
	return (
		<p class={css({ lineHeight: "normal" })}>
			<MarkdownChildren footnoteDefs={props.footnoteDefs} nodes={props.node.children} />
		</p>
	);
};

export default Paragraph;
