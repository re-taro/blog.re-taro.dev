import type { Handler } from '..';
import type * as A from 'ast';
import type * as M from 'mdast';

// eslint-disable-next-line ts/require-await
export const html: Handler<M.Html> = async (node): Promise<A.Html> => {
	return {
		position: node.position,
		type: 'html',
		value: node.value,
	};
};
