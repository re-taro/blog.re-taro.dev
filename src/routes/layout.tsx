import { Slot, component$ } from "@builder.io/qwik";
import type { RequestHandler } from "@builder.io/qwik-city";
import { Footer } from "~/components/Footer/Footer";
import { Header } from "~/components/Header/Header";
import { css } from "~/styled-system/css";

export const onGet: RequestHandler = async ({ cacheControl }) => {
	cacheControl({
		staleWhileRevalidate: 60 * 60 * 24 * 7,
		maxAge: 5,
	});
};

export default component$(() => {
	return (
		<div class={css({
			display: "grid",
			gridTemplateRows: "[auto 1fr auto]",
			gridTemplateAreas: `
        "header"
        "main"
        "footer"`,
			minHeight: "[100lvh]",
		})}
		>
			<Header css={css.raw({ gridArea: "header" })} />
			<main class={css({ gridArea: "main" })}>
				<Slot />
			</main>
			<Footer css={css.raw({ gridArea: "footer" })} />
		</div>
	);
});
