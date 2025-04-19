import { css } from 'styled-system/css';
import { Markdown } from '..';
import type * as A from 'ast';
import type { FC } from 'react';

interface Props {
	footnoteDefs: A.FootnoteDefinition[];
	node: A.Delete;
}

export const Delete: FC<Props> = ({ footnoteDefs, node }) => {
	return (
		<del
			className={css({
				_after: {
					content: "'~~'",
				},
				_before: {
					content: "'~~'",
				},
				_supportsAlternativeTextAfter: {
					_after: {
						content: "'~~' / ''",
					},
					_before: {
						content: "'~~' / ''",
					},
				},
			})}>
			<Markdown footnoteDefs={footnoteDefs} nodes={node.children} />
		</del>
	);
};
