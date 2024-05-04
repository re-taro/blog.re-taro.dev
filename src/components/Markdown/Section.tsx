import { component$ } from "@builder.io/qwik";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css, cx } from "~/styled-system/css";

interface Props {
	node: A.Section;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

export default component$<Props>(({ node, footnoteDefs }) => {
	return (
		<section
			class={cx(css({
				"& > * + *": {
					marginTop: "6",
				},

				"& > markdown_heading": {
					paddingBottom: "1",
					marginTop: "8",
					fontWeight: "bold",
					borderBottom: "[1px solid {colors.border.main}]",
					scrollMarginTop: "[6.25rem]",
				},
			}), "markdown_section")}
			aria-labelledby={node.children[0].id}
		>
			<MarkdownChildren nodes={node.children} footnoteDefs={footnoteDefs} />
		</section>
	);
});
