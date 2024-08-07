import { A } from "@solidjs/router";
import type { Component } from "solid-js";
import { css } from "~/styled-system/css";
import type { SystemStyleObject } from "~/styled-system/types";

export interface Props {
	css?: SystemStyleObject;
}

const Header: Component<Props> = (props) => {
	return (
		<header class={css({
			position: "fixed",
			top: "0",
			insetInline: "0",
			display: "flex",
			alignItems: "center",
			width: "full",
			padding: "6",
			backgroundColor: "bg.main",
			zIndex: "calc(infinity)",
		}, props.css)}
		>
			<A
				class={css({
					color: "text.main",
					fontSize: "xl",
					fontWeight: "bold",
					opacity: "0.6",
					transition: "[opacity 0.3s ease-in]",

					_hover: {
						opacity: "1",
					},

					_focus: {
						opacity: "1",
					},
				})}
				href="/"
			>
				blog.re-taro.dev
			</A>
		</header>
	);
};

export default Header;
