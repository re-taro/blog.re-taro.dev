import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const hardBreak: Handler<M.Break> = async (node): Promise<A.Break> => {
	return {
		type: "break",
		position: node.position,
	};
};
