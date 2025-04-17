import { css } from 'styled-system/css';
import { Markdown } from '..';
import type * as A from 'ast';
import type { FC } from 'react';

interface Props {
	footnoteDefs: A.FootnoteDefinition[];
	node: A.DescriptionTerm;
}

export const DescriptionTerm: FC<Props> = ({ footnoteDefs, node }) => {
	return (
		<dt
			className={css({
				fontWeight: 'bold',
			})}>
			<Markdown footnoteDefs={footnoteDefs} nodes={node.children} />
		</dt>
	);
};
