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
			alignItems: "center",
			backgroundColor: "bg.main",
			display: "flex",
			insetInline: "0",
			padding: "6",
			position: "fixed",
			top: "0",
			width: "full",
			zIndex: "calc(infinity)",
		}, props.css)}
		>
			<A
				class={css({
					_focus: {
						opacity: "1",
					},
					_hover: {
						opacity: "1",
					},
					color: "text.main",
					fontSize: "xl",
					fontWeight: "bold",
					opacity: "0.6",
					transition: "[opacity 0.3s ease-in]",
				})}
				href="/"
			>
				blog.re-taro.dev
			</A>
		</header>
	);
};

export default Header;
