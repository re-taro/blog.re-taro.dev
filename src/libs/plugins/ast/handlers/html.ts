import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const html: Handler<M.Html> = async (node): Promise<A.Html> => {
	return {
		position: node.position,
		type: "html",
		value: node.value,
	};
};
