import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	footnoteDefs: Array<A.FootnoteDefinition>;
	node: A.Link;
}

const Link: Component<Props> = (props) => {
	return (
		<a
			class={css({
				_focus: {
					color: "accent.main",
				},
				_hover: {
					color: "accent.main",
				},
				color: "accent.secondary",
			})}
			href={props.node.url}
			rel="noreferrer"
			target="_blank"
			title={props.node.title ?? undefined}
		>
			<MarkdownChildren footnoteDefs={props.footnoteDefs} nodes={props.node.children} />
		</a>
	);
};

export default Link;
