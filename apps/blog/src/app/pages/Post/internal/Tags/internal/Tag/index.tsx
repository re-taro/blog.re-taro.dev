import { css } from 'styled-system/css';
import type { FC } from 'react';

interface Props {
	tag: string;
}

export const Tag: FC<Props> = ({ tag }) => {
	return (
		<li
			className={css({
				'&:first-child': {
					_before: {
						content: "'['",
						paddingInlineEnd: '1',
					},
					_supportsAlternativeTextAfter: {
						_before: {
							content: "'[' / ''",
							paddingInlineEnd: '1',
						},
					},
				},
				'&:last-child': {
					_after: {
						content: "']'",
						paddingInlineStart: '1',
					},
					_supportsAlternativeTextAfter: {
						_after: {
							content: "']' / ''",
							paddingInlineStart: '1',
						},
					},
				},
				'_after': {
					_supportsAlternativeTextAfter: {
						content: "',' / ''",
					},
					content: "','",
					paddingInlineEnd: '2',
				},
				'color': 'text.main',
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
				href={`/tags#${tag}`}>
				{tag}
			</a>
		</li>
	);
};
