import type { Handler } from '..';
import type * as A from 'ast';
import type * as M from 'mdast';

export const blockquote: Handler<M.Blockquote> = async (node, state): Promise<A.Blockquote | undefined> => {
	const children = await state.transformAll(node);
	if (children.length === 0) return;

	return {
		children,
		position: node.position,
		type: 'blockquote',
	};
};
