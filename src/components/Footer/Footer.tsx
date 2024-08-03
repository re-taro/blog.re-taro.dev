import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import { css } from "~/styled-system/css";
import type { SystemStyleObject } from "~/styled-system/types";

export interface Props {
	css?: SystemStyleObject;
}

const Footer: Component<Props> = (props) => {
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
			}, props.css)}
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
						color: "accent.secondary",

						_hover: {
							color: "accent.main",
						},

						_focus: {
							color: "accent.main",
						},
					})}
				>
					CC BY-NC-SA 4.0
				</a>
				{" "}
				Copyright &copy; 2021
				{" "}
				<a
					href="https://re-taro.dev"
					rel="noreferrer"
					target="_blank"
					class={css({
						color: "accent.secondary",

						_hover: {
							color: "accent.main",
						},

						_focus: {
							color: "accent.main",
						},
					})}
				>
					Rintaro Itokawa
				</a>
				{" "}
				See
				{" "}
				<A
					href="/privacy"
					class={css({
						color: "accent.secondary",

						_hover: {
							color: "accent.main",
						},

						_focus: {
							color: "accent.main",
						},
					})}
				>
					Privacy Policy
				</A>
				.
			</p>
		</footer>
	);
};

export default Footer;
