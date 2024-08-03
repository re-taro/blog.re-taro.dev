import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.DescriptionDetails;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

const DescriptionDetails: Component<Props> = (props) => {
	return (
		<dd class={css({
			position: "relative",
			paddingLeft: "6",
			marginLeft: "[1em]",

			_before: {
				position: "absolute",
				content: "'-'",
				marginLeft: "[-1em]",

				_supportsAlternativeTextAfter: {
					content: "'-' / ''",
				},
			},
		})}
		>
			<MarkdownChildren nodes={props.node.children} footnoteDefs={props.footnoteDefs} />
		</dd>
	);
};

export default DescriptionDetails;
