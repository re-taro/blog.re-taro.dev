import { css } from 'styled-system/css';
import { Markdown } from '..';
import type * as A from 'ast';
import type { FC } from 'react';

interface Props {
	footnoteDefs: A.FootnoteDefinition[];
	node: A.OrderedList;
}

export const OrderedList: FC<Props> = ({ footnoteDefs, node }) => {
	return (
		<ol
			className={css({
				'& > li': {
					_before: {
						_supportsAlternativeTextAfter: {
							content: "counter(list) '.' / ''",
						},
						content: "counter(list) '.'",
						counterIncrement: 'list',
						marginLeft: '[-1em]',
						position: 'absolute',
					},
					marginLeft: '[1em]',
					position: 'relative',
				},
				'counterReset': 'list',
				'paddingLeft': '6',
			})}
			start={node.start}>
			<Markdown footnoteDefs={footnoteDefs} nodes={node.children} />
		</ol>
	);
};
