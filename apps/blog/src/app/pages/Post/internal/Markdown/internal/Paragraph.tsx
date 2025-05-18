import { css } from 'styled-system/css';
import { Markdown } from '..';
import type * as A from 'ast';
import type { FC } from 'react';

interface Props {
	footnoteDefs: A.FootnoteDefinition[];
	node: A.Paragraph;
}

export const Paragraph: FC<Props> = ({ footnoteDefs, node }) => {
	return (
		<p className={css({ lineHeight: 'normal' })}>
			<Markdown footnoteDefs={footnoteDefs} nodes={node.children} />
		</p>
	);
};
