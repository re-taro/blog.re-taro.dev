import type * as H from "hast";
import { hastToHtml } from "shiki";
import type { Component } from "solid-js";
import { Show, createMemo } from "solid-js";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.Code;
}

const Code: Component<Props> = (props) => {
	const memoizedStyled = createMemo(() => {
		const styled = (props.node as unknown as { hast: H.Root | undefined }).hast; // MEMO: This is a safety cast

		return typeof styled !== "undefined" ? styled : undefined;
	});

	return (
		<Show when={memoizedStyled()}>
			{(styled) => {
				const html = hastToHtml(styled().children as any); // MEMO: This is a safety cast `styled.children` is `Array<H.RootContent>`

				return (
					<div
						class={css({
							"& > pre.shiki > code": {
								counterReset: "line-number",
							},
							"& > pre.shiki > code > span.line": {
								_before: {
									color: "text.secondary",
									content: "counter(line-number)",
									display: "inline-block",
									marginRight: "5",
									textAlign: "end",
									width: "6",
								},
								counterIncrement: "line-number",
							},
							"borderBottom": "[1px solid {colors.border.main}]",
							"borderTop": "[1px solid {colors.border.main}]",
							"fontFamily": "mono",
							"fontSize": "s",
							"marginY": "2",
							"overflow": "auto",
							"paddingY": "2",
						})}
						// eslint-disable-next-line solid/no-innerhtml
						innerHTML={html}
					/>
				);
			}}
		</Show>
	);
};

export default Code;
