import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	footnoteDefs: Array<A.FootnoteDefinition>;
	node: A.DescriptionTerm;
}

const DescriptionTerm: Component<Props> = (props) => {
	return (
		<dt
			class={css({
				fontWeight: "bold",
			})}
		>
			<MarkdownChildren footnoteDefs={props.footnoteDefs} nodes={props.node.children} />
		</dt>
	);
};

export default DescriptionTerm;
