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
				borderTopColor: "border.main",
				borderTopStyle: "solid",
				borderTopWidth: "1px",
				marginTop: "4",
				paddingX: "6",
				paddingY: "4",
				width: "full",
			}, props.css)}
		>
			<p
				class={css({
					color: "text.secondary",
					fontSize: "l",
					lineHeight: "normal",
					marginBlockEnd: "0",
					marginBlockStart: "0",
					marginInlineEnd: "auto",
					marginInlineStart: "auto",
					textAlign: "center",
				})}
			>
				<a
					class={css({
						_focus: {
							color: "accent.main",
						},
						_hover: {
							color: "accent.main",
						},
						color: "accent.secondary",
					})}
					href="https://creativecommons.org/licenses/by-nc-sa/4.0"
					rel="noreferrer"
					target="_blank"
				>
					CC BY-NC-SA 4.0
				</a>
				{" "}
				Copyright &copy; 2021
				{" "}
				<a
					class={css({
						_focus: {
							color: "accent.main",
						},
						_hover: {
							color: "accent.main",
						},
						color: "accent.secondary",
					})}
					href="https://re-taro.dev"
					rel="noreferrer"
					target="_blank"
				>
					Rintaro Itokawa
				</a>
				{" "}
				See
				{" "}
				<A
					class={css({
						_focus: {
							color: "accent.main",
						},
						_hover: {
							color: "accent.main",
						},
						color: "accent.secondary",
					})}
					href="/privacy"
				>
					Privacy Policy
				</A>
				.
			</p>
		</footer>
	);
};

export default Footer;
