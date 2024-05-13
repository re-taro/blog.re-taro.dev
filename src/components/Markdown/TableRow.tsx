import { component$ } from "@builder.io/qwik";

import type { MarkdownProps } from "./Markdown";
import TableCell from "./TableCell";
import { css } from "~/styled-system/css";

interface Props extends MarkdownProps {
	align: Array<"left" | "center" | "right" | null>;
	head?: boolean;
}

export default component$<Props>(({ node, footnoteDefs, head = false, align }) => {
	if (node.type === "tableRow") {
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
				{node.children.map((cell, idx) => (
					<TableCell
						node={cell}
						footnoteDefs={footnoteDefs}
						align={align[idx]}
						head={head}
						key={idx}
					/>
				))}
			</tr>
		);
	}
	else {
		return null;
	}
});
