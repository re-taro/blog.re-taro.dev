import { css } from 'styled-system/css';
import { FootnoteDefinitionList } from './internal/FootnoteDefinitionList';
import type { FootnoteProps } from './types';
import type { FC } from 'react';

export const Footnote: FC<FootnoteProps> = ({ footnotes }) => {
	if (footnotes.length > 0) {
		return (
			<>
				<hr
					className={css({
						borderTop: '[1px solid {colors.border.main}]',
						height: '[1px]',
						marginY: '4',
						width: 'full',
					})}
				/>
				<section aria-labelledby="footnote">
					<h2
						className={css({
							borderWidth: '0',
							clip: 'rect(0 0 0 0)',
							height: '[1px]',
							margin: '[-1px]',
							overflow: 'hidden',
							padding: '0',
							position: 'absolute',
							whiteSpace: 'nowrap',
							width: '[1px]',
						})}
						aria-hidden>
						脚注
					</h2>
					<FootnoteDefinitionList footnotes={footnotes} />
				</section>
			</>
		);
	}

	return null;
};
