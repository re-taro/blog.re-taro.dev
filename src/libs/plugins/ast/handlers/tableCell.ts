import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const tableCell: Handler<M.TableCell> = (
	node,
	state,
): A.TableCell | undefined => {
	const children = state.transformAll(node);
	if (children.length === 0)
		return;

	return {
		type: "tableCell",
		children,
		position: node.position,
	};
};
