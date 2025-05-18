import type { Handler } from '..';
import type * as A from 'ast';
import type * as M from 'mdast';

// eslint-disable-next-line ts/require-await
export const thematicBreak: Handler<M.ThematicBreak> = async (node): Promise<A.ThematicBreak> => {
	return {
		position: node.position,
		type: 'thematicBreak',
	};
};
