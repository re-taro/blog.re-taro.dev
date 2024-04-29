import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const strong: Handler<M.Strong> = (
	node,
	state,
): A.Strong | undefined => {
	const children = state.transformAll(node);
	if (children.length === 0)
		return;

	return {
		type: "strong",
		children,
		position: node.position,
	};
};
