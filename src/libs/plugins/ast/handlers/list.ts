import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const list: Handler<M.List> = async (
	node,
	state,
): Promise<A.UnorderedList | A.OrderedList | undefined> => {
	const children = await state.transformAll(node);
	if (children.length === 0)
		return;

	if (node.ordered ?? false) {
		return {
			type: "orderedList",
			start: node.start ?? 1,
			children,
			position: node.position,
		};
	}

	return {
		type: "unorderedList",
		children,
		position: node.position,
	};
};
