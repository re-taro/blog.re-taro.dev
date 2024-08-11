import type { Component } from "solid-js";
import MarkdownChildren from "./Markdown";
import type * as A from "~/libs/plugins/ast/ast";
import { css, cx } from "~/styled-system/css";

interface Props {
	footnoteDefs: Array<A.FootnoteDefinition>;
	node: A.Section;
}

const Section: Component<Props> = (props) => {
	return (
		<section
			class={cx(css({
				"& > * + *": {
					marginTop: "6",
				},
				"& > .markdown_heading": {
					fontWeight: "bold",
					marginTop: "8",
					paddingBottom: "1",
					scrollMarginTop: "[6.25rem]",
				},
			}), "markdown_section")}
			aria-labelledby={props.node.children[0].id}
		>
			<MarkdownChildren footnoteDefs={props.footnoteDefs} nodes={props.node.children} />
		</section>
	);
};

export default Section;
