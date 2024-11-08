import type { Component } from "solid-js";
import { Index } from "solid-js";
import TableRow from "./TableRow";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	footnoteDefs: Array<A.FootnoteDefinition>;
	node: A.Table;
}

const Table: Component<Props> = (props) => {
	const [headerRow, ...bodyRows] = props.node.children;

	return (
		<div
			class={css({
				marginX: "0",
				marginY: "4",
				overflowX: "scroll",
			})}
		>
			<table
				class={css({
					borderCollapse: "collapse",
					borderSpacingX: "[.4rem]",
					borderSpacingY: "0",
					fontFamily: "mono",
					marginInlineStart: "0",
					textAlign: "left",
					whiteSpace: "nowrap",
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
					<TableRow head align={props.node.align} footnoteDefs={props.footnoteDefs} node={headerRow} />
				</thead>
				<tbody>
					<Index each={bodyRows}>
						{row => (
							<TableRow align={props.node.align} footnoteDefs={props.footnoteDefs} node={row()} />
						)}
					</Index>
				</tbody>
			</table>
		</div>
	);
};

export default Table;
