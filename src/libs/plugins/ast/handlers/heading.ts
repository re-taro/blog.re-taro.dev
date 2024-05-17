import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";
import { astarToString } from "../toString";

export const heading: Handler<M.Heading> = async (
	node,
	state,
): Promise<A.Heading | undefined> => {
	const children = await state.transformAll(node);
	if (children.length === 0)
		return;

	const plain = astarToString(...children);
	const id = state.headingSlugger.slug(plain);

	return {
		type: "heading",
		level: node.depth,
		id,
		plain,
		children,
		position: node.position,
	};
};
