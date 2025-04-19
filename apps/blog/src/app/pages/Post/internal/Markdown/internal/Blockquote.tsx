import { css } from 'styled-system/css';
import { Markdown } from '..';
import type * as A from 'ast';
import type { FC } from 'react';

interface Props {
	footnoteDefs: A.FootnoteDefinition[];
	node: A.Blockquote;
}

export const Blockquote: FC<Props> = ({ node, footnoteDefs }) => {
	return (
		<blockquote
			className={css({
				'& > p': {
					_before: {
						_supportsAlternativeTextAfter: {
							content: "'>' / ''",
						},
						content: "'>'",
						marginLeft: '[-1em]',
						position: 'absolute',
					},
					marginLeft: '[1em]',
					position: 'relative',
				},
				'border': '[1px solid {colors.border.main}]',
				'borderRadius': 'sm',
				'padding': '4',
			})}>
			<Markdown footnoteDefs={footnoteDefs} nodes={node.children} />
		</blockquote>
	);
};
