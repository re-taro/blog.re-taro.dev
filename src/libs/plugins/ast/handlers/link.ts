import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const link: Handler<M.Link> = async (
	node,
	state,
): Promise< A.Link | undefined > => {
	const children = await state.transformAll(node);
	if (children.length === 0)
		return;

	return {
		children,
		position: node.position,
		title: node.title ?? undefined,
		type: "link",
		url: node.url,
	};
};
