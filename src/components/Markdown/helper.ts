import type * as A from "~/libs/plugins/ast/ast";

export function getFootnoteIndex(
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
