import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.DescriptionTerm;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

const DescriptionTerm: Component<Props> = (props) => {
	return (
		<dt class={css({
			fontWeight: "bold",
		})}
		>
			<MarkdownChildren nodes={props.node.children} footnoteDefs={props.footnoteDefs} />
		</dt>
	);
};

export default DescriptionTerm;
