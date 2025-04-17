import type * as A from 'ast';

export const isSection = (node: A.Node): node is A.Section => {
	return node.type === 'section';
};
