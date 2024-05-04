import { component$ } from "@builder.io/qwik";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.FootnoteReference;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

export default component$<Props>(({ node, footnoteDefs }) => {
	const index = getFootnoteIndex(node, footnoteDefs);
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
					color: "blue.200",

					_hover: {
						color: "blue.400",
					},

					_focus: {
						color: "blue.400",
					},
				})}
			>
				{index}
			</a>
		</sup>
	);
});

function getFootnoteIndex(
	footnoteReference: A.FootnoteReference,
	footnoteDefinitions: Array<A.FootnoteDefinition>,
): number {
	const index = footnoteDefinitions.findIndex((footnoteDefinition) => {
		return footnoteDefinition.index === footnoteReference.referenceIndex;
	});
	if (index === -1)
		throw new Error("Footnote definition not found");

	return index + 1;
}

export function getFootnoteRefId(index: number): string {
	return `fnref-${index}`;
}

export function getFootnoteDefId(index: number): string {
	return `fn-${index}`;
}
