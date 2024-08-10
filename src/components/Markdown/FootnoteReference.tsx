import type { Component } from "solid-js";
import { A } from "@solidjs/router";
import { getFootnoteDefId, getFootnoteIndex, getFootnoteRefId } from "./helper";
import type * as Ast from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	footnoteDefs: Array<Ast.FootnoteDefinition>;
	node: Ast.FootnoteReference;
}

const FootnoteReference: Component<Props> = (props) => {
	const index = getFootnoteIndex(props.node, props.footnoteDefs);
	const fnRefId = getFootnoteRefId(index);
	const fnDefId = getFootnoteDefId(index);

	return (
		<sup
			class={css({
				fontWeight: "bold",
				scrollMarginTop: "[6.25rem]",
			})}
			aria-labelledby={fnDefId}
			id={fnRefId}
		>
			<A
				class={css({
					_focus: {
						color: "accent.main",
					},
					_hover: {
						color: "accent.main",
					},
					color: "accent.secondary",
				})}
				href={`#${fnDefId}`}
			>
				{index}
			</A>
		</sup>
	);
};

export default FootnoteReference;
