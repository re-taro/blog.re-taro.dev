import { css } from 'styled-system/css';
import { TableRow } from './TableRow';
import type * as A from 'ast';
import type { FC } from 'react';

interface Props {
	footnoteDefs: A.FootnoteDefinition[];
	node: A.Table;
}

export const Table: FC<Props> = ({ footnoteDefs, node }) => {
	const [headerRow, ...bodyRows] = node.children;

	if (headerRow == null) {
		return null;
	}

	return (
		<div
			className={css({
				marginX: '0',
				marginY: '4',
				overflowX: 'scroll',
			})}>
			<table
				className={css({
					borderCollapse: 'collapse',
					borderSpacingX: '[.4rem]',
					borderSpacingY: '0',
					fontFamily: 'mono',
					marginInlineStart: '0',
					textAlign: 'left',
					whiteSpace: 'nowrap',
				})}>
				<thead
					className={css({
						_supportsAlternativeTextAfter: {
							'& tr:last-child': {
								_after: {
									content: String.raw`'|\A|' / ''`,
									whiteSpace: 'pre',
								},
							},
						},
					})}>
					<TableRow head align={node.align} footnoteDefs={footnoteDefs} node={headerRow} />
				</thead>
				<tbody>
					{bodyRows.map((row, idx) => (
						<TableRow align={node.align} footnoteDefs={footnoteDefs} node={row} key={idx} />
					))}
				</tbody>
			</table>
		</div>
	);
};
