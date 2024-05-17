import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const inlineCode: Handler<M.InlineCode> = async (
	node,
): Promise<A.InlineCode> => {
	return {
		type: "inlineCode",
		value: node.value,
		position: node.position,
	};
};
