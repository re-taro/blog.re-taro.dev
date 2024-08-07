import type { Component } from "solid-js";
import type { WithTransformedImage } from "../../../content-collections";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.Image;
}

const Image: Component<Props> = (props) => {
	const data = (props.node as (WithTransformedImage | undefined) & A.Image).transformed;

	if (data) {
		const srcs = data.sort((a, b) => b.dim.w - a.dim.w);
		const srcset = srcs.map(src => `${src.path} ${src.dim.w}w`).join(" ");

		return (
			<img
				loading="lazy"
				decoding="async"
				src={srcs[0].path}
				width={srcs[0].dim.w}
				height={srcs[0].dim.h}
				srcset={srcset}
				alt={props.node.alt}
			/>
		);
	}
	else {
		return (
			<img
				loading="lazy"
				class={css({
					width: "full",
					height: "auto",
				})}
				src={props.node.url}
				alt={props.node.alt}
			/>
		);
	}
};

export default Image;
