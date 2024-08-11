import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	footnoteDefs: Array<A.FootnoteDefinition>;
	node: A.Emphasis;
}

const Emphasis: Component<Props> = (props) => {
	return (
		<em
			class={css({
				_after: {
					content: "'*'",
				},
				_before: {
					content: "'*'",
				},
				_supportsAlternativeTextAfter: {
					_after: {
						content: "'*' / ''",
					},
					_before: {
						content: "'*' / ''",
					},
				},
				fontWeight: "bold",
			})}
		>
			<MarkdownChildren footnoteDefs={props.footnoteDefs} nodes={props.node.children} />
		</em>
	);
};

export default Emphasis;
