import type { Component } from "solid-js";
import { Index } from "solid-js";
import TableRow from "./TableRow";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.Table;
	footnoteDefs: Array<A.FootnoteDefinition>;
}

const Table: Component<Props> = (props) => {
	const [headerRow, ...bodyRows] = props.node.children;

	return (
		<table
			class={css({
				marginInlineStart: "0",
				marginX: "0",
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
			<thead
				class={css({
					_supportsAlternativeTextAfter: {
						"& tr:last-child": {
							_after: {
								content: "'|\\A|' / ''",
								whiteSpace: "pre",
							},
						},
					},
				})}
			>
				<TableRow node={headerRow} footnoteDefs={props.footnoteDefs} align={props.node.align} head />
			</thead>
			<tbody>
				<Index each={bodyRows}>
					{row => (
						<TableRow node={row()} footnoteDefs={props.footnoteDefs} align={props.node.align} />
					)}
				</Index>
			</tbody>
		</table>
	);
};

export default Table;
