import { component$ } from "@builder.io/qwik";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.Link;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

export default component$<Props>(({ node, footnoteDefs }) => {
	return (
		<a
			href={node.url}
			title={node.title ?? undefined}
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
			<MarkdownChildren nodes={node.children} footnoteDefs={footnoteDefs} />
		</a>
	);
});
