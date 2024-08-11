import type { Component } from "solid-js";
import { Index, Show, createMemo } from "solid-js";
import type { MarkdownProps } from "./Markdown";
import TableCell from "./TableCell";
import { css } from "~/styled-system/css";

interface Props extends MarkdownProps {
	align: Array<"center" | "left" | "right" | null>;
	head?: boolean;
}

const TableRow: Component<Props> = (props) => {
	const memoizedNode = createMemo(() => props.node.type === "tableRow" ? props.node : undefined);

	return (
		<Show when={memoizedNode()}>
			{node => (
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
					<Index each={node().children}>
						{(cell, idx) => (
							<TableCell
								align={props.align[idx]}
								footnoteDefs={props.footnoteDefs}
								head={props.head ?? false}
								node={cell()}
							/>
						)}
					</Index>
				</tr>
			)}
		</Show>
	);
};

export default TableRow;
