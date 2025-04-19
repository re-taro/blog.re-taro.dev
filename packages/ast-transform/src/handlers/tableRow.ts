import type { Handler } from '..';
import type * as A from 'ast';
import type * as M from 'mdast';

export const tableRow: Handler<M.TableRow> = async (node, state): Promise<A.TableRow | undefined> => {
	const children = await state.transformAll(node);
	if (children.length === 0) return;

	return {
		children,
		position: node.position,
		type: 'tableRow',
	};
};
