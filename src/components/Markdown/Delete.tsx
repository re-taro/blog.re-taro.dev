import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.Delete;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

const Delete: Component<Props> = (props) => {
	return (
		<del class={css({
			_before: {
				content: "'~~'",
			},

			_after: {
				content: "'~~'",
			},

			_supportsAlternativeTextAfter: {
				_before: {
					content: "'~~' / ''",
				},

				_after: {
					content: "'~~' / ''",
				},
			},
		})}
		>
			<MarkdownChildren nodes={props.node.children} footnoteDefs={props.footnoteDefs} />
		</del>
	);
};

export default Delete;
