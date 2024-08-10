import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const tableCell: Handler<M.TableCell> = async (
	node,
	state,
): Promise< A.TableCell | undefined> => {
	const children = await state.transformAll(node);
	if (children.length === 0)
		return;

	return {
		children,
		position: node.position,
		type: "tableCell",
	};
};
