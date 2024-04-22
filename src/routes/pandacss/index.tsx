import { component$ } from "@builder.io/qwik";
import { css } from "~/styled-system/css";

export default component$(() => {
	return (
		<div
			class={css({
				bg: "red.400",
				height: "dvh",
			})}
		>
			This box is styled with PandaCSS.
		</div>
	);
});
