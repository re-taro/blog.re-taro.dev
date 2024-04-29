import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const paragraph: Handler<M.Paragraph> = (
	node,
	state,
): A.Paragraph | undefined => {
	const children = state.transformAll(node);
	if (children.length === 0)
		return;

	return {
		type: "paragraph",
		children,
		position: node.position,
	};
};
