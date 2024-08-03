import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.Paragraph;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

const Paragraph: Component<Props> = (props) => {
	return (
		<p class={css({ lineHeight: "normal" })}>
			<MarkdownChildren nodes={props.node.children} footnoteDefs={props.footnoteDefs} />
		</p>
	);
};

export default Paragraph;
