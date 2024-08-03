import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.Link;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

const Link: Component<Props> = (props) => {
	return (
		<a
			href={props.node.url}
			title={props.node.title ?? undefined}
			target="_blank"
			rel="noreferrer"
			class={css({
				color: "accent.secondary",

				_hover: {
					color: "accent.main",
				},

				_focus: {
					color: "accent.main",
				},
			})}
		>
			<MarkdownChildren nodes={props.node.children} footnoteDefs={props.footnoteDefs} />
		</a>
	);
};

export default Link;
