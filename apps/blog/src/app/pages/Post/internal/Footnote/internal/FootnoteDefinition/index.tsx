import { css } from 'styled-system/css';
import { Markdown } from '../../../Markdown';
import { getFootnoteDefId, getFootnoteRefId } from '../../../Markdown/internal/helper';
import type * as A from 'ast';
import type { FC } from 'react';

interface FootnoteDefinitionProps {
	footnote: A.FootnoteDefinition;
	footnoteDefs: A.FootnoteDefinition[];
	idx: number;
}

export const FootnoteDefinition: FC<FootnoteDefinitionProps> = ({ footnote, footnoteDefs, idx }) => {
	return (
		<li id={getFootnoteDefId(idx + 1)}>
			<div
				className={css({
					'& > *': {
						margin: '0',
					},
					'display': 'grid',
					'gap': '2',
					'gridTemplateAreas': "'content link noop'",
					'gridTemplateColumns': '[auto auto 1fr]',
				})}>
				<Markdown footnoteDefs={footnoteDefs} nodes={footnote.children} />
				<a
					className={css({
						_focus: {
							color: 'accent.main',
						},
						_hover: {
							color: 'accent.main',
						},
						alignSelf: 'end',
						color: 'accent.secondary',
						gridArea: 'link',
					})}
					aria-label="Back to content"
					href={`#${getFootnoteRefId(idx + 1)}`}>
					↵
				</a>
			</div>
		</li>
	);
};
