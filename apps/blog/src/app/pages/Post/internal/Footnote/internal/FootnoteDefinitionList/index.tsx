import { css } from 'styled-system/css';
import { FootnoteDefinition } from '../FootnoteDefinition';
import type { FootnoteProps } from '../../types';
import type { FC } from 'react';

export const FootnoteDefinitionList: FC<FootnoteProps> = ({ footnotes }) => {
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
					marginY: '2',
					position: 'relative',
				},
				'color': 'text.main',
				'counterReset': 'list',
				'paddingLeft': '6',
			})}>
			{footnotes.map((footnote, idx) => (
				<FootnoteDefinition key={footnote.index} footnote={footnote} footnoteDefs={footnotes} idx={idx} />
			))}
		</ol>
	);
};
