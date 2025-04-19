import type * as A from 'ast';

export const getFootnoteIndex = (
	footnoteReference: A.FootnoteReference,
	footnoteDefinitions: A.FootnoteDefinition[],
): number => {
	const index = footnoteDefinitions.findIndex((footnoteDefinition) => {
		return footnoteDefinition.index === footnoteReference.footnoteIndex;
	});
	if (index === -1) throw new Error('Footnote definition not found');

	return index + 1;
};

export const getFootnoteRefId = (index: number): string => {
	// eslint-disable-next-line ts/restrict-template-expressions
	return `fnref-${index}`;
};

export const getFootnoteDefId = (index: number): string => {
	// eslint-disable-next-line ts/restrict-template-expressions
	return `fn-${index}`;
};
