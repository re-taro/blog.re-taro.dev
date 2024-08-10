import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	footnoteDefs: Array<A.FootnoteDefinition>;
	node: A.DescriptionList;
}

const DescriptionList: Component<Props> = (props) => {
	return (
		<dl
			class={css({
				"& > dt": {
					_after: {
						content: "':'",
						position: "absolute",
					},
					_before: {
						content: "'-'",
						marginLeft: "[-1em]",
						position: "absolute",
					},
					_supportsAlternativeTextAfter: {
						_after: {
							content: "':' / ''",
							position: "absolute",
						},
						_before: {
							content: "'-' / ''",
							position: "absolute",
						},
					},
					marginLeft: "[1em]",
					position: "relative",
				},
			})}
		>
			<MarkdownChildren footnoteDefs={props.footnoteDefs} nodes={props.node.children} />
		</dl>
	);
};

export default DescriptionList;
