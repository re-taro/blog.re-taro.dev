import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const thematicBreak: Handler<M.ThematicBreak> = (
	node,
): A.ThematicBreak => {
	return {
		type: "thematicBreak",
		position: node.position,
	};
};
