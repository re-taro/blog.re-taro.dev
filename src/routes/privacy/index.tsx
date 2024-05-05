import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { css } from "~/styled-system/css";

export default component$(() => {
	return (
		<section
			class={css({
				padding: "[5.25rem 1rem 0]",
			})}
		>
			<h1
				class={css({
					color: "text.main",
					fontSize: "2xl",
					fontWeight: "bold",
					lineHeight: "tight",
				})}
			>
				Privacy Policy
			</h1>
			<ul
				class={css({
					color: "text.main",
					fontSize: "md",
					lineHeight: "normal",
				})}
			>
				<li
					class={css({
						position: "relative",
						marginLeft: "[1em]",

						_before: {
							position: "absolute",
							content: "'-'",
							left: "[-1em]",
						},
					})}
				>
					本サイトは
					<a
						href="https://policies.google.com/technologies/partner-sites"
						rel="noreferrer"
						target="_blank"
						class={css({
							color: "blue.200",
							_hover: {
								color: "blue.400",
							},
							_focus: {
								color: "blue.400",
							},
						})}
					>
						Google Analytics
					</a>
					を導入している。
				</li>
			</ul>
		</section>
	);
});

export const head: DocumentHead = {
	title: "Privacy Policy",
};
