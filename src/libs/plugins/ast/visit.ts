import { visit as unistVisit } from "unist-util-visit";

import type * as A from "./ast";

export const visit = unistVisit as <T extends A.Node>(
	tree: A.Parent,
	test: (node: A.Node) => node is T,
	visitor: (
		node: T,
		index: number | undefined,
		parent: A.Parent | undefined,
	) => void,
) => void;
