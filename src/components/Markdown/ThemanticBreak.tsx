import { component$ } from "@builder.io/qwik";
import { css } from "~/styled-system/css";

export default component$(() => {
	return (
		<hr class={css({
			marginY: "4",
			width: "full",
			height: "[1px]",
			borderTop: "[1px solid {colors.border.main}]",
		})}
		/>
	);
});
