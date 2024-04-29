import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const emphasis: Handler<M.Emphasis> = async (
	node,
	state,
): Promise<A.Emphasis | undefined> => {
	const children = await state.transformAll(node);
	if (children.length === 0)
		return;

	return {
		type: "emphasis",
		children,
		position: node.position,
	};
};
