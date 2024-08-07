import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.Emphasis;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

const Emphasis: Component<Props> = (props) => {
	return (
		<em class={css({
			fontWeight: "bold",

			_before: {
				content: "'*'",
			},

			_after: {
				content: "'*'",
			},

			_supportsAlternativeTextAfter: {
				_before: {
					content: "'*' / ''",
				},

				_after: {
					content: "'*' / ''",
				},
			},
		})}
		>
			<MarkdownChildren nodes={props.node.children} footnoteDefs={props.footnoteDefs} />
		</em>
	);
};

export default Emphasis;
