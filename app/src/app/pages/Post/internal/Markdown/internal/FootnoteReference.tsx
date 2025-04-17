import { css } from 'styled-system/css';
import { getFootnoteDefId, getFootnoteIndex, getFootnoteRefId } from './helper';
import type * as Ast from 'ast';
import type { FC } from 'react';

interface Props {
	footnoteDefs: Ast.FootnoteDefinition[];
	node: Ast.FootnoteReference;
}

export const FootnoteReference: FC<Props> = ({ footnoteDefs, node }) => {
	const index = getFootnoteIndex(node, footnoteDefs);
	const fnRefId = getFootnoteRefId(index);
	const fnDefId = getFootnoteDefId(index);

	return (
		<sup
			className={css({
				fontWeight: 'bold',
				scrollMarginTop: '[6.25rem]',
			})}
			aria-labelledby={fnDefId}
			id={fnRefId}>
			<a
				className={css({
					_focus: {
						color: 'accent.main',
					},
					_hover: {
						color: 'accent.main',
					},
					color: 'accent.secondary',
				})}
				href={`#${fnDefId}`}>
				{index}
			</a>
		</sup>
	);
};
