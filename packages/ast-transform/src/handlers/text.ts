import type { Handler } from '..';
import type * as A from 'ast';
import type * as M from 'mdast';

// eslint-disable-next-line ts/require-await
export const text: Handler<M.Text> = async (node): Promise<A.Text> => {
	return {
		position: node.position,
		type: 'text',
		value: node.value,
	};
};
