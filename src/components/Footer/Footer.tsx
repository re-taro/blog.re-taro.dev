import { component$ } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { css } from "~/styled-system/css";
import type { SystemStyleObject } from "~/styled-system/types";

export interface Props {
	css?: SystemStyleObject;
}

export default component$<Props>(({ css: cssStyle }) => {
	return (
		<footer
			class={css({
				width: "full",
				marginTop: "4",
				paddingY: "4",
				paddingX: "6",
				borderTopWidth: "1px",
				borderTopStyle: "solid",
				borderTopColor: "border.main",
			}, cssStyle)}
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