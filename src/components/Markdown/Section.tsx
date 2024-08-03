import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css, cx } from "~/styled-system/css";

interface Props {
	node: A.Section;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

const Section: Component<Props> = (props) => {
	return (
		<section
			class={cx(css({
				"& > * + *": {
					marginTop: "6",
				},

				"& > .markdown_heading": {
					paddingBottom: "1",
					marginTop: "8",
					fontWeight: "bold",
					scrollMarginTop: "[6.25rem]",
				},
			}), "markdown_section")}
			aria-labelledby={props.node.children[0].id}
		>
			<MarkdownChildren nodes={props.node.children} footnoteDefs={props.footnoteDefs} />
		</section>
	);
};

export default Section;
