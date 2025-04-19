import { cva } from 'styled-system/css';
import { Markdown } from '..';
import type { MarkdownProps } from '..';
import type { FC } from 'react';

interface Props extends MarkdownProps {
	align: 'center' | 'left' | 'right' | null;
	head: boolean;
}

const tabCell = cva({
	base: {
		'&:last-child': {
			borderRight: '[2px solid {colors.text.main}]',
		},
		'_supportsAlternativeTextAfter': {
			'&:last-child': {
				border: 'none',
				padding: '[unset]',
			},
			'_before': {
				content: "'|' / ''",
				float: '[left]',
				fontWeight: 'normal',
				marginInlineEnd: '[.8em]',
			},
			'border': 'none',
			'clear': 'left',
			'padding': '[unset]',
			'paddingInlineEnd': '[.8em]',
		},
		'lg': {
			paddingInlineEnd: '[1.6em]',
		},
	},
	compoundVariants: [
		{
			align: 'left',
			css: {
				_supportsAlternativeTextAfter: {
					_after: {
						content: "':-----------------------------------------------------------------' / ''",
					},
				},
			},
			head: true,
		},
		{
			align: 'right',
			css: {
				_supportsAlternativeTextAfter: {
					_after: {
						content: "':-----------------------------------------------------------------' / ''",
						direction: 'rtl',
					},
				},
			},
			head: true,
		},
	],
	variants: {
		align: {
			center: {
				textAlign: 'center',
			},
			left: {
				textAlign: 'left',
			},
			right: {
				textAlign: 'right',
			},
		},
		head: {
			false: {
				borderLeft: '[2px solid {colors.text.main}]',
				paddingX: '4',
				paddingY: '2',
			},
			true: {
				_supportsAlternativeTextAfter: {
					_after: {
						content: "'------------------------------------------------------------------' / ''",
						fontWeight: 'normal',
						left: '[1.2em]',
						letterSpacing: '[.1em]',
						overflow: 'hidden',
						position: 'absolute',
						right: '[.4em]',
						textOverflow: 'clip',
						top: '[100%]',
						transform: 'translateY(-100%)',
						whiteSpace: 'nowrap',
					},
					_before: {
						content: String.raw`'|\A|' / ''`,
						whiteSpace: 'pre',
					},
					position: 'relative',
				},
				borderBottom: '[2px dashed {colors.text.main}]',
				borderLeft: '[2px solid {colors.text.main}]',
				padding: '[0 1rem .5rem 1rem]',
			},
		},
	},
});

export const TableCell: FC<Props> = ({ align, footnoteDefs, head, node }) => {
	if (node.type === 'tableCell') {
		const Component = head ? 'th' : 'td';

		return (
			<Component className={tabCell({ align: align ?? undefined, head })}>
				<Markdown footnoteDefs={footnoteDefs} nodes={node.children} />
			</Component>
		);
	}

	return null;
};
