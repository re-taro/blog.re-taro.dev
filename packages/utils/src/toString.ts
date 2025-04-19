import type * as A from 'ast';

export const astarToString = (...nodes: A.Node[]): string => {
	return nodesToString(nodes);
};

const nodeToString = (node: A.Node): string => {
	if (isParent(node)) return nodesToString(node.children);

	if (isLiteral(node) && ['inlineCode', 'text'].includes(node.type)) return node.value;

	return '';
};

const nodesToString = (nodes: A.Node[]): string => {
	return nodes.map(nodeToString).join('');
};

const isLiteral = (node: A.Node): node is A.Literal => {
	return 'value' in node;
};

const isParent = (node: A.Node): node is A.Parent => {
	return 'children' in node;
};
