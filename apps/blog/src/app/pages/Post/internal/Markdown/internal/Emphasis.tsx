import { css } from 'styled-system/css';
import { Markdown } from '..';
import type * as A from 'ast';
import type { FC } from 'react';

interface Props {
	footnoteDefs: A.FootnoteDefinition[];
	node: A.Emphasis;
}

export const Emphasis: FC<Props> = ({ footnoteDefs, node }) => {
	return (
		<em
			className={css({
				_after: {
					content: "'*'",
				},
				_before: {
					content: "'*'",
				},
				_supportsAlternativeTextAfter: {
					_after: {
						content: "'*' / ''",
					},
					_before: {
						content: "'*' / ''",
					},
				},
				fontWeight: 'bold',
			})}>
			<Markdown footnoteDefs={footnoteDefs} nodes={node.children} />
		</em>
	);
};
