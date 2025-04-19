import { visit as unistVisit } from 'unist-util-visit';
import type { Node, Parents } from 'mdast';

export const visit = unistVisit as <T extends Node>(
	tree: Parents,
	test: (node: Node) => node is T,
	visitor: (node: T, index: number | undefined, parent: Parents | undefined) => void,
) => void;
