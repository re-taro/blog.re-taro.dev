import { component$ } from "@builder.io/qwik";
import type { WithTransformedImage } from "../../../content-collections";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.Image;
}

export default component$<Props>(({ node }) => {
	const data = (node as (WithTransformedImage | undefined) & A.Image).transformed;

	if (data) {
		const srcs = data.sort((a, b) => b.dim.w - a.dim.w);
		const srcset = srcs.map(src => `${src.path} ${src.dim.w}w`).join(" ");

		return (
			<img
				loading="lazy"
				decoding="async"
				class={css({
					width: "full",
					maxWidth: "full",
					height: "auto",
				})}
				src={srcs[0].path}
				width={srcs[0].dim.w}
				height={srcs[0].dim.h}
				srcset={srcset}
				alt={node.alt}
			/>
		);
	}
	else {
		return (
			<>
				{/* eslint-disable-next-line qwik/jsx-img */}
				<img
					loading="lazy"
					class={css({
						width: "full",
						height: "auto",
					})}
					src={node.url}
					alt={node.alt}
				/>
			</>
		);
	}
});
