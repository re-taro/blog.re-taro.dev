import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const paragraph: Handler<M.Paragraph> = async (
	node,
	state,
): Promise< A.Paragraph | undefined> => {
	const children = await state.transformAll(node);
	if (children.length === 0)
		return;

	return {
		children,
		position: node.position,
		type: "paragraph",
	};
};
