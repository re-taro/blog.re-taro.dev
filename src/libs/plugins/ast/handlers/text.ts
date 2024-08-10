import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const text: Handler<M.Text> = async (node): Promise<A.Text> => {
	return {
		position: node.position,
		type: "text",
		value: node.value,
	};
};
