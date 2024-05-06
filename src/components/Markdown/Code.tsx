import { component$ } from "@builder.io/qwik";
import type * as H from "hast";
import { hastToHtml } from "shiki";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.Code;
}

export default component$<Props>(({ node }) => {
	const styled = (node as unknown as { hast: H.Root | undefined }).hast; // MEMO: This is a safety cast

	if (typeof styled !== "undefined") {
		const html = hastToHtml(styled.children as any); // MEMO: This is a safety cast `styled.children` is `Array<H.RootContent>`

		return (
			<div
				class={css({
					"marginY": "2",
					"paddingY": "2",
					"overflowX": "scroll",
					"fontFamily": "mono",
					"fontSize": "s",
					"borderTop": "[1px solid {colors.border.main}]",
					"borderBottom": "[1px solid {colors.border.main}]",

					"& > pre.shiki > code": {
						counterReset: "line-number",
					},

					"& > pre.shiki > code > span.line": {
						counterIncrement: "line-number",

						_before: {
							content: "counter(line-number)",
							display: "inline-block",
							width: "6",
							color: "text.secondary",
							textAlign: "end",
							marginRight: "5",
						},
					},
				})}
				dangerouslySetInnerHTML={html}
			/>
		);
	}
	else {
		return null;
	}
});
