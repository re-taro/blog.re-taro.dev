import { css } from 'styled-system/css';
import { Markdown } from '..';
import type * as A from 'ast';
import type { FC } from 'react';

interface Props {
	footnoteDefs: A.FootnoteDefinition[];
	node: A.DescriptionDetails;
}

export const DescriptionDetails: FC<Props> = ({ footnoteDefs, node }) => {
	return (
		<dd
			className={css({
				_before: {
					_supportsAlternativeTextAfter: {
						content: "'-' / ''",
					},
					content: "'-'",
					marginLeft: '[-1em]',
					position: 'absolute',
				},
				marginLeft: '[1em]',
				paddingLeft: '6',
				position: 'relative',
			})}>
			<Markdown footnoteDefs={footnoteDefs} nodes={node.children} />
		</dd>
	);
};
