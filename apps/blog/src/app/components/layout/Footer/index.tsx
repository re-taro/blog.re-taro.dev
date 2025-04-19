import { css } from 'styled-system/css';
import type { FC } from 'react';
import type { SystemStyleObject } from 'styled-system/types';

interface Props {
	css?: SystemStyleObject;
}

export const Footer: FC<Props> = (props) => {
	return (
		<footer
			className={css(
				{
					borderTopColor: 'border.main',
					borderTopStyle: 'solid',
					borderTopWidth: '1px',
					marginTop: '4',
					paddingX: '6',
					paddingY: '4',
					width: 'full',
				},
				props.css,
			)}>
			<p
				className={css({
					color: 'text.secondary',
					fontSize: 'l',
					lineHeight: 'normal',
					marginBlockEnd: '0',
					marginBlockStart: '0',
					marginInlineEnd: 'auto',
					marginInlineStart: 'auto',
					textAlign: 'center',
				})}>
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
					href="https://creativecommons.org/licenses/by-nc-sa/4.0"
					rel="noreferrer"
					target="_blank">
					CC BY-NC-SA 4.0
				</a>{' '}
				Copyright &copy; 2021{' '}
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
					href="https://re-taro.dev"
					rel="noreferrer"
					target="_blank">
					Rintaro Itokawa
				</a>{' '}
				See{' '}
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
					href="/privacy">
					Privacy Policy
				</a>
				.
			</p>
		</footer>
	);
};
