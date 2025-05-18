import { css } from 'styled-system/css';
import { Markdown } from '..';
import type * as A from 'ast';
import type { FC } from 'react';

interface Props {
	footnoteDefs: A.FootnoteDefinition[];
	node: A.UnorderedList;
}

export const UnorderedList: FC<Props> = ({ footnoteDefs, node }) => {
	return (
		<ul
			className={css({
				'& > li': {
					_before: {
						content: "'-'",
						marginLeft: '[-1em]',
						position: 'absolute',
					},
					marginLeft: '[1em]',

					position: 'relative',
				},

				'paddingLeft': '6',
			})}>
			<Markdown footnoteDefs={footnoteDefs} nodes={node.children} />
		</ul>
	);
};
