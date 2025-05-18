import type { Handler } from '..';
import type * as A from 'ast';
import type * as M from 'mdast';

// eslint-disable-next-line ts/require-await
export const hardBreak: Handler<M.Break> = async (node): Promise<A.Break> => {
	return {
		position: node.position,
		type: 'break',
	};
};
