import type { Component } from "solid-js";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.InlineCode;
}

const InlineCode: Component<Props> = (props) => {
	return (
		<code class={css({
			paddingY: "[.1rem]",
			paddingX: "[.4rem]",
			fontFamily: "mono",

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
			{props.node.value}
		</code>
	);
};

export default InlineCode;
