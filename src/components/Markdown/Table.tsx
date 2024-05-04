import { component$ } from "@builder.io/qwik";
import TableRow from "./TableRow";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.Table;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

export default component$<Props>(({ node, footnoteDefs }) => {
	const [headerRow, ...bodyRows] = node.children;

	return (
		<table class={css({
			marginY: "4",
			borderSpacingY: "0",
			borderSpacingX: "[.4rem]",
			fontFamily: "mono",
			textAlign: "left",
			whiteSpace: "nowrap",
			borderCollapse: "collapse",

			lg: {
				overflowX: "scroll",
			},
		})}
		>
			<thead class={css({
				_supportsAlternativeTextAfter: {
					"& tr:last-child": {
						_after: {
							content: "'|\A|' / ''",
							whiteSpace: "pre",
						},
					},
				},
			})}
			>
				<TableRow node={headerRow} footnoteDefs={footnoteDefs} align={node.align} />
			</thead>
			<tbody>
				{bodyRows.map((row, idx) => (
					<TableRow node={row} footnoteDefs={footnoteDefs} align={node.align} key={idx} />
				))}
			</tbody>
		</table>
	);
});
