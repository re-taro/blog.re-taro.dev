import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const listItem: Handler<M.ListItem> = (
	node,
	state,
): A.ListItem | undefined => {
	const children = state.transformAll(node);
	if (children.length === 0)
		return;

	return {
		type: "listItem",
		children,
		position: node.position,
	};
};
