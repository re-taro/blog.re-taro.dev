import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const strikethrough: Handler<M.Delete> = (
	node,
	state,
): A.Delete | undefined => {
	const children = state.transformAll(node);
	if (children.length === 0)
		return;

	return {
		type: "delete",
		children,
		position: node.position,
	};
};
