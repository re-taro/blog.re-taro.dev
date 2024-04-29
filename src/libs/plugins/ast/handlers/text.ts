import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const text: Handler<M.Text> = async (node): Promise<A.Text> => {
	return {
		type: "text",
		value: node.value,
		position: node.position,
	};
};
