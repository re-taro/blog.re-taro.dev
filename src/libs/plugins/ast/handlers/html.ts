import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const html: Handler<M.Html> = (node): A.Html => {
	return {
		type: "html",
		value: node.value,
		position: node.position,
	};
};
