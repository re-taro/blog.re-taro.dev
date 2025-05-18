import type { Handler } from '..';
import type * as A from 'ast';
import type * as M from 'mdast';

// eslint-disable-next-line ts/require-await
export const inlineCode: Handler<M.InlineCode> = async (node): Promise<A.InlineCode> => {
	return {
		position: node.position,
		type: 'inlineCode',
		value: node.value,
	};
};
