import type { Component } from "solid-js";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.InlineCode;
}

const InlineCode: Component<Props> = (props) => {
	return (
		<code
			class={css({
				_after: {
					content: "'`'",
				},
				_before: {
					content: "'`'",
				},
				_supportsAlternativeTextAfter: {
					_after: {
						content: "'`' / ''",
					},
					_before: {
						content: "'`' / ''",
					},
				},
				fontFamily: "mono",
				paddingX: "[.4rem]",
				paddingY: "[.1rem]",
			})}
		>
			{props.node.value}
		</code>
	);
};

export default InlineCode;
