import { Markdown } from '..';
import type * as A from 'ast';
import type { FC } from 'react';

interface Props {
	footnoteDefs: A.FootnoteDefinition[];
	node: A.ListItem;
}

export const ListItem: FC<Props> = ({ footnoteDefs, node }) => {
	return (
		<li>
			<Markdown footnoteDefs={footnoteDefs} nodes={node.children} />
		</li>
	);
};
