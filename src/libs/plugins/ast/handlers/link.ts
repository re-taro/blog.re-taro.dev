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
		type: "link",
		url: node.url,
		title: node.title ?? undefined,
		children,
		position: node.position,
	};
};
