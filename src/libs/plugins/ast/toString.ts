import type * as A from "./ast";

export function astarToString(...nodes: Array<A.Node>): string {
	return nodesToString(nodes);
}

function nodeToString(node: A.Node): string {
	if (isParent(node))
		return nodesToString(node.children);

	if (isLiteral(node) && ["text", "inlineCode"].includes(node.type))
		return node.value;

	return "";
}

function nodesToString(nodes: Array<A.Node>): string {
	return nodes.map(nodeToString).join("");
}

function isLiteral(node: A.Node): node is A.Literal {
	return "value" in node;
}

function isParent(node: A.Node): node is A.Parent {
	return "children" in node;
}
