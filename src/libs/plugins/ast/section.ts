import type { Plugin } from "unified";
import type { Position } from "unist";

import type * as A from "./ast";

export const astSection: Plugin<Array<never>, A.Root> = function () {
	return (tree) => {
		transform(tree, 1);
	};
};

function transform(tree: A.Parent, level: number): void {
	if (level > 6)
		return;

	let index: number | undefined;
	while (index !== undefined ? index < tree.children.length : true) {
		const startIdx = findNodeAfter(tree, index, isHeadingOfLevel(level));
		if (startIdx === undefined)
			return;

		const endIdx = findNodeAfter(tree, startIdx, isHeadingOfLevel(level));

		const children = tree.children.slice(startIdx, endIdx) as [
			A.Heading,
			...Array<A.Content>,
		];
		const firstChild = children.at(0);
		const lastChild = children.at(-1);
		const position: Position | undefined = firstChild?.position && lastChild?.position ? { end: lastChild.position.end, start: firstChild.position.start } : undefined;
		const section: A.Section = {
			children,
			position,
			type: "section",
		};
		tree.children.splice(startIdx, children.length, section);

		transform(section, level + 1);

		index = startIdx;
	}
}

function isHeadingOfLevel(
	level: number,
): (node: A.Node) => node is A.Heading {
	return (node): node is A.Heading =>
		isHeading(node) && node.level === level;
}

function isHeading(node: A.Node): node is A.Heading {
	return node.type === "heading";
}

function findNodeAfter(
	tree: A.Parent,
	after: number | undefined,
	predicate: (node: A.Node) => boolean,
): number | undefined {
	const idx = tree.children.findIndex(
		(node, idx) =>
			(after !== undefined ? idx > after : true) && predicate(node),
	);
	if (idx === -1)
		return undefined;

	return idx;
}
