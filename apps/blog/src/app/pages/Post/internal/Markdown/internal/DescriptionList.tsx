import { css } from 'styled-system/css';
import { Markdown } from '..';
import type * as A from 'ast';
import type { FC } from 'react';

interface Props {
	footnoteDefs: A.FootnoteDefinition[];
	node: A.DescriptionList;
}

export const DescriptionList: FC<Props> = ({ footnoteDefs, node }) => {
	return (
		<dl
			className={css({
				'& > dt': {
					_after: {
						content: "':'",
						position: 'absolute',
					},
					_before: {
						content: "'-'",
						marginLeft: '[-1em]',
						position: 'absolute',
					},
					_supportsAlternativeTextAfter: {
						_after: {
							content: "':' / ''",
							position: 'absolute',
						},
						_before: {
							content: "'-' / ''",
							position: 'absolute',
						},
					},
					marginLeft: '[1em]',
					position: 'relative',
				},
			})}>
			<Markdown footnoteDefs={footnoteDefs} nodes={node.children} />
		</dl>
	);
};
