import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { css } from "~/styled-system/css";

export const Footer = component$(() => {
	return (
		<footer
			class={css({
				width: "full",
				marginTop: "4",
				padding: "[1rem .5rem]",
				borderTopWidth: "1px",
				borderTopStyle: "solid",
				borderTopColor: "border.main",
				gridArea: "footer",
			})}
		>
			<p class={css({
				marginBlockStart: "0",
				marginBlockEnd: "0",
				marginInlineStart: "auto",
				marginInlineEnd: "auto",
				fontSize: "l",
				lineHeight: "normal",
				textAlign: "center",
				color: "text.secondary",
			})}
			>
				<a
					href="https://creativecommons.org/licenses/by-nc-sa/4.0"
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
					CC BY-NC-SA 4.0
				</a>
				{" "}
				Copyright &copy; 2022
				{" "}
				<a
					href="https://re-taro.dev"
					rel="noreferrer"
					target="_blank"
				>
					Rintaro Itokawa
				</a>
				{" "}
				See
				{" "}
				<Link
					href="/privacy"
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
					Privacy Policy
				</Link>
				.
			</p>
		</footer>
	);
});
