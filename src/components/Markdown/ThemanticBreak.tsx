import type { Component } from "solid-js";
import { css } from "~/styled-system/css";

const ThemanticBreak: Component = () => {
	return (
		<hr
			class={css({
				borderTop: "[1px solid {colors.border.main}]",
				height: "[1px]",
				marginY: "4",
				width: "full",
			})}
		/>
	);
};

export default ThemanticBreak;
