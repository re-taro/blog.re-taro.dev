import { component$ } from "@builder.io/qwik";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.InlineCode;
}

export default component$<Props>(({ node }) => {
	return (
		<code class={css({
			paddingY: "[.1rem]",
			paddingX: "[.4rem]",
			fontFamily: "mono",
			border: "[1px solid {colors.border.main}]",
			borderRadius: "[.2rem]",

			_before: {
				content: "'`'",
			},

			_after: {
				content: "'`'",
			},

			_supportsAlternativeTextAfter: {
				_before: {
					content: "'`' / ''",
				},

				_after: {
					content: "'`' / ''",
				},
			},
		})}
		>
			{node.value}
		</code>
	);
});
