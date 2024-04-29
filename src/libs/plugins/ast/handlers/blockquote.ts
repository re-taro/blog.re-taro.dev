import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const blockquote: Handler<M.Blockquote> = (
	node,
	state,
): A.Blockquote | undefined => {
	const children = state.transformAll(node);
	if (children.length === 0)
		return;

	return {
		type: "blockquote",
		children,
		position: node.position,
	};
};
