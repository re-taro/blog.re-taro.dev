import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const strong: Handler<M.Strong> = async (
	node,
	state,
): Promise<A.Strong | undefined> => {
	const children = await state.transformAll(node);
	if (children.length === 0)
		return;

	return {
		children,
		position: node.position,
		type: "strong",
	};
};
