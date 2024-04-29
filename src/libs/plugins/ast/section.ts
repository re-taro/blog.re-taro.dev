import type { Plugin } from "unified";
import type { Position } from "unist";

import type * as Astar from "./ast";

export const astSection: Plugin<Array<never>, Astar.Root> = function () {
	return (tree) => {
		transform(tree, 1);
	};
};

function transform(tree: Astar.Parent, level: number): void {
	if (level > 6)
		return;

	let index: number | undefined;
	while (index !== undefined ? index < tree.children.length : true) {
		const startIdx = findNodeAfter(tree, index, isHeadingOfLevel(level));
		if (startIdx === undefined)
			return;

		const endIdx = findNodeAfter(tree, startIdx, isHeadingOfLevel(level));

		const children = tree.children.slice(startIdx, endIdx) as [
			Astar.Heading,
			...Array<Astar.Content>,
		];
		const firstChild = children.at(0);
		const lastChild = children.at(-1);
		const position: Position | undefined = firstChild?.position && lastChild?.position ? { start: firstChild.position.start, end: lastChild.position.end } : undefined;
		const section: Astar.Section = {
			type: "section",
			children,
			position,
		};
		tree.children.splice(startIdx, children.length, section);

		transform(section, level + 1);

		index = startIdx;
	}
}

function isHeadingOfLevel(
	level: number,
): (node: Astar.Node) => node is Astar.Heading {
	return (node): node is Astar.Heading =>
		isHeading(node) && node.level === level;
}

function isHeading(node: Astar.Node): node is Astar.Heading {
	return node.type === "heading";
}

function findNodeAfter(
	tree: Astar.Parent,
	after: number | undefined,
	predicate: (node: Astar.Node) => boolean,
): number | undefined {
	const idx = tree.children.findIndex(
		(node, idx) =>
			(after !== undefined ? idx > after : true) && predicate(node),
	);
	if (idx === -1)
		return undefined;

	return idx;
}
