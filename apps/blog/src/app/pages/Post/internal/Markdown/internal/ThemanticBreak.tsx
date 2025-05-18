import { css } from 'styled-system/css';
import type { FC } from 'react';

export const ThemanticBreak: FC = () => {
	return (
		<hr
			className={css({
				borderTop: '[1px solid {colors.border.main}]',
				height: '[1px]',
				marginY: '4',
				width: 'full',
			})}
		/>
	);
};
