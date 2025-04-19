import { css } from 'styled-system/css';
import type { FC } from 'react';
import type { SystemStyleObject } from 'styled-system/types';

interface Props {
	css?: SystemStyleObject;
}

export const Header: FC<Props> = (props) => {
	return (
		<header
			className={css(
				{
					alignItems: 'center',
					backgroundColor: 'bg.main',
					display: 'flex',
					insetInline: '0',
					padding: '6',
					position: 'fixed',
					top: '0',
					width: 'full',
					zIndex: 'calc(infinity)',
				},
				props.css,
			)}>
			<a
				className={css({
					_focus: {
						opacity: '1',
					},
					_hover: {
						opacity: '1',
					},
					color: 'text.main',
					fontSize: 'xl',
					fontWeight: 'bold',
					opacity: '0.6',
					transition: '[opacity 0.3s ease-in]',
				})}
				href="/">
				blog.re-taro.dev
			</a>
		</header>
	);
};
