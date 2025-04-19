import type { Handler } from '..';
import type * as A from 'ast';
import type * as M from 'mdast';

export const link: Handler<M.Link> = async (node, state): Promise<A.Link | undefined> => {
	const children = await state.transformAll(node);
	if (children.length === 0) return;

	return {
		children,
		position: node.position,
		title: node.title ?? undefined,
		type: 'link',
		url: node.url,
	};
};
