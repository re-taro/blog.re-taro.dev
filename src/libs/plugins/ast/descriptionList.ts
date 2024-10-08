import type { Plugin } from "unified";

import type {
	DescriptionDetails as MDescriptionDetails,
	DescriptionList as MDescriptionList,
	DescriptionTerm as MDescriptionTerm,
} from "../remark/remarkDescriptionList";
import type * as A from "./ast";
import type { Handler } from "./transform";

const descriptionList: Handler<MDescriptionList> = async (
	node,
	state,
): Promise<A.DescriptionList | undefined> => {
	const children = await state.transformAll(node);
	if (children.length === 0)
		return;

	return {
		children,
		position: node.position,
		type: "descriptionList",
	};
};

const descriptionTerm: Handler<MDescriptionTerm> = async (
	node,
	state,
): Promise<A.DescriptionTerm | undefined> => {
	const children = await state.transformAll(node);
	if (children.length === 0)
		return;

	return {
		children,
		position: node.position,
		type: "descriptionTerm",
	};
};

const descriptionDetails: Handler<MDescriptionDetails> = async (
	node,
	state,
): Promise<A.DescriptionDetails | undefined> => {
	const children = await state.transformAll(node);
	if (children.length === 0)
		return;

	return {
		children,
		position: node.position,
		type: "descriptionDetails",
	};
};

export const astDescriptionList: Plugin = function () {
	const data = this.data();

	data.astFromMdastHandlers ??= {};
	data.astFromMdastHandlers.descriptionList = descriptionList;
	data.astFromMdastHandlers.descriptionTerm = descriptionTerm;
	data.astFromMdastHandlers.descriptionDetails = descriptionDetails;
};
