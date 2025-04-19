import { css } from 'styled-system/css';
import { TableCell } from './TableCell';
import type { MarkdownProps } from '..';
import type { FC } from 'react';

interface Props extends MarkdownProps {
	align: ('center' | 'left' | 'right' | null)[];
	head?: boolean;
}

export const TableRow: FC<Props> = ({ align, head, footnoteDefs, node }) => {
	if (node.type === 'tableRow') {
		return (
			<tr
				className={css({
					_supportsAlternativeTextAfter: {
						_after: {
							content: "'|' / ''",
							fontWeight: 'normal',
						},
					},
				})}>
				{node.children.map((cell, idx) => (
					<TableCell
						align={align[idx] ?? null}
						footnoteDefs={footnoteDefs}
						head={head ?? false}
						node={cell}
						key={idx}
					/>
				))}
			</tr>
		);
	}

	return null;
};
