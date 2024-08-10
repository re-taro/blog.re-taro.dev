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
			footnoteIndex: usedDef.index,
			position: node.position,
			referenceIndex: usedDef.count,
			type: "footnoteReference",
		};
	}

	const mdastDef = state.mdastFootnoteDefinition.get(node.identifier);
	if (!mdastDef)
		unreachable();

	const footnoteIndex = state.astFootnoteDefinition.size;
	const newDef: A.FootnoteDefinition = {
		children: await state.transformAll(mdastDef),
		count: 1,
		index: footnoteIndex,
		position: mdastDef.position,
		type: "footnoteDefinition",
	};
	state.astFootnoteDefinition.set(node.identifier, newDef);

	return {
		footnoteIndex,
		position: node.position,
		referenceIndex: 1,
		type: "footnoteReference",
	};
};
