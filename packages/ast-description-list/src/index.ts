import type * as A from 'ast';
import type { Handler } from 'ast-transform';
import type * as M from 'remark-description-list';
import type { Plugin } from 'unified';

const descriptionList: Handler<M.DescriptionList> = async (node, state): Promise<A.DescriptionList | undefined> => {
	const children = await state.transformAll(node);
	if (children.length === 0) return;

	return {
		children,
		position: node.position,
		type: 'descriptionList',
	};
};

const descriptionTerm: Handler<M.DescriptionTerm> = async (node, state): Promise<A.DescriptionTerm | undefined> => {
	const children = await state.transformAll(node);
	if (children.length === 0) return;

	return {
		children,
		position: node.position,
		type: 'descriptionTerm',
	};
};

const descriptionDetails: Handler<M.DescriptionDetails> = async (
	node,
	state,
): Promise<A.DescriptionDetails | undefined> => {
	const children = await state.transformAll(node);
	if (children.length === 0) return;

	return {
		children,
		position: node.position,
		type: 'descriptionDetails',
	};
};

export const astDescriptionList: Plugin = function () {
	const data = this.data();

	data.astFromMdastHandlers ??= {};
	data.astFromMdastHandlers['descriptionList'] = descriptionList;
	data.astFromMdastHandlers['descriptionTerm'] = descriptionTerm;
	data.astFromMdastHandlers['descriptionDetails'] = descriptionDetails;
};
