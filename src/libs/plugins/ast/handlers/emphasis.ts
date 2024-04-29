import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const emphasis: Handler<M.Emphasis> = (
	node,
	state,
): A.Emphasis | undefined => {
	const children = state.transformAll(node);
	if (children.length === 0)
		return;

	return {
		type: "emphasis",
		children,
		position: node.position,
	};
};
