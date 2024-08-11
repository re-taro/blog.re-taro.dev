import type { Component } from "solid-js";
import { Match, Switch, createMemo } from "solid-js";
import type { WithTransformedImage } from "../../../content-collections";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.Image;
}

const Image: Component<Props> = (props) => {
	const memoizedTransformed = createMemo(() => typeof (props.node as A.Image & (WithTransformedImage | undefined)).transformed !== "undefined" ? (props.node as A.Image & WithTransformedImage).transformed : undefined);

	return (
		<Switch fallback={(
			<img
				class={css({
					height: "auto",
					width: "full",
				})}
				alt={props.node.alt}
				loading="lazy"
				src={props.node.url}
			/>
		)}
		>
			<Match when={memoizedTransformed()}>
				{(data) => {
					const srcs = data().sort((a, b) => b.dim.w - a.dim.w);
					const srcset = srcs.map(src => `${src.path} ${src.dim.w}w`).join(" ");

					return (
						<img
							alt={props.node.alt}
							decoding="async"
							height={srcs[0].dim.h}
							loading="lazy"
							src={srcs[0].path}
							srcset={srcset}
							width={srcs[0].dim.w}
						/>
					);
				}}
			</Match>
		</Switch>
	);
};

export default Image;
