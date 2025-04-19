import { astarToString } from 'utils';
import type { Handler } from '..';
import type * as A from 'ast';
import type * as M from 'mdast';

export const heading: Handler<M.Heading> = async (node, state): Promise<A.Heading | undefined> => {
	const children = await state.transformAll(node);
	if (children.length === 0) return;

	const plain = astarToString(...children);
	const id = state.headingSlugger.slug(plain);

	return {
		children,
		id,
		level: node.depth,
		plain,
		position: node.position,
		type: 'heading',
	};
};
