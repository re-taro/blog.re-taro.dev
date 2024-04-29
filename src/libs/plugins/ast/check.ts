import type * as A from "./ast.js";

export function isSection(node: A.Node): node is A.Section {
	return node.type === "section";
}
