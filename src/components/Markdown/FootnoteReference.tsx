import type { Component } from "solid-js";
import { getFootnoteDefId, getFootnoteIndex, getFootnoteRefId } from "./helper";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.FootnoteReference;
	footnoteDefs: Array<A.FootnoteDefinition>;
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
			id={fnRefId}
			aria-labelledby={fnDefId}
		>
			<a
				href={`#${fnDefId}`}
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
				{index}
			</a>
		</sup>
	);
};

export default FootnoteReference;
