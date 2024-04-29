import type * as M from "mdast";

import { unreachable } from "../../error";
import type * as A from "../ast";
import type { Handler } from "../transform";

export const footnoteReference: Handler<M.FootnoteReference> = async (
	node,
	state,
): Promise< A.FootnoteReference | undefined> => {
	const usedDef = state.astFootnoteDefinition.get(node.identifier);
	if (usedDef) {
		usedDef.count += 1;

		return {
			type: "footnoteReference",
			footnoteIndex: usedDef.index,
			referenceIndex: usedDef.count,
			position: node.position,
		};
	}

	const mdastDef = state.mdastFootnoteDefinition.get(node.identifier);
	if (!mdastDef)
		unreachable();

	const footnoteIndex = state.astFootnoteDefinition.size;
	const newDef: A.FootnoteDefinition = {
		type: "footnoteDefinition",
		index: footnoteIndex,
		count: 1,
		children: await state.transformAll(mdastDef),
		position: mdastDef.position,
	};
	state.astFootnoteDefinition.set(node.identifier, newDef);

	return {
		type: "footnoteReference",
		footnoteIndex,
		referenceIndex: 1,
		position: node.position,
	};
};
