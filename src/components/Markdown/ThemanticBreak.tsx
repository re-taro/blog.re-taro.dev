import { component$ } from "@builder.io/qwik";
import { css } from "~/styled-system/css";

export default component$(() => {
	return (
		<hr class={css({
			marginY: "4",
			width: "full",
			borderTop: "[1px solid {colors.border.main}]",
		})}
		/>
	);
});
