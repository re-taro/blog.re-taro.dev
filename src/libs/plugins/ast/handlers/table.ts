import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const table: Handler<M.Table> = async (
	node,
	state,
): Promise<A.Table | undefined> => {
	const children = await state.transformAll(node);
	if (children.length === 0)
		return;

	const align
    = node.align
    ?? Array.from({ length: node.children[0]?.children.length ?? 0 }, () => null);

	return {
		type: "table",
		align,
		children,
		position: node.position,
	};
};
