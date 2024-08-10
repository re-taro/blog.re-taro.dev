import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const list: Handler<M.List> = async (
	node,
	state,
): Promise<A.OrderedList | A.UnorderedList | undefined> => {
	const children = await state.transformAll(node);
	if (children.length === 0)
		return;

	if (node.ordered ?? false) {
		return {
			children,
			position: node.position,
			start: node.start ?? 1,
			type: "orderedList",
		};
	}

	return {
		children,
		position: node.position,
		type: "unorderedList",
	};
};
