import type { Component } from "solid-js";
import { Index } from "solid-js";
import type { MarkdownProps } from "./Markdown";
import TableCell from "./TableCell";
import { css } from "~/styled-system/css";

interface Props extends MarkdownProps {
	align: Array<"left" | "center" | "right" | null>;
	head?: boolean;
}

const TableRow: Component<Props> = (props) => {
	if (props.node.type === "tableRow") {
		return (
			<tr
				class={css({
					_supportsAlternativeTextAfter: {
						_after: {
							content: "'|' / ''",
							fontWeight: "normal",
						},
					},
				})}
			>
				<Index each={props.node.children}>
					{(cell, idx) => (
						<TableCell
							node={cell()}
							footnoteDefs={props.footnoteDefs}
							align={props.align[idx]}
							head={props.head ?? false}
						/>
					)}
				</Index>
			</tr>
		);
	}
	else {
		return null;
	}
};

export default TableRow;
