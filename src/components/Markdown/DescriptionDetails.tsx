import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	footnoteDefs: Array<A.FootnoteDefinition>;
	node: A.DescriptionDetails;
}

const DescriptionDetails: Component<Props> = (props) => {
	return (
		<dd
			class={css({
				_before: {
					_supportsAlternativeTextAfter: {
						content: "'-' / ''",
					},
					content: "'-'",
					marginLeft: "[-1em]",
					position: "absolute",
				},
				marginLeft: "[1em]",
				paddingLeft: "6",
				position: "relative",
			})}
		>
			<MarkdownChildren footnoteDefs={props.footnoteDefs} nodes={props.node.children} />
		</dd>
	);
};

export default DescriptionDetails;
