import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const tableRow: Handler<M.TableRow> = (
	node,
	state,
): A.TableRow | undefined => {
	const children = state.transformAll(node);
	if (children.length === 0)
		return;

	return {
		type: "tableRow",
		children,
		position: node.position,
	};
};
