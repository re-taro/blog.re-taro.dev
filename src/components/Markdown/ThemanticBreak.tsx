import type { Component } from "solid-js";
import { css } from "~/styled-system/css";

const ThemanticBreak: Component = () => {
	return (
		<hr class={css({
			marginY: "4",
			width: "full",
			height: "[1px]",
			borderTop: "[1px solid {colors.border.main}]",
		})}
		/>
	);
};

export default ThemanticBreak;
