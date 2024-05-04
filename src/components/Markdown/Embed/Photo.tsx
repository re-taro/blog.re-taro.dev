import { component$ } from "@builder.io/qwik";
import { css } from "~/styled-system/css";
import type { OEmbedPhoto } from "~/libs/oEmbedSchema";

interface Props {
	node: OEmbedPhoto;
}

export default component$<Props>(({ node }) => {
	return (
		<img
			class={css({
				marginX: "auto",
				maxHeight: "full",
				maxWidth: "full",
			})}
			width={node.width}
			height={node.height}
			src={node.url}
			alt={node.title}
			loading="lazy"
			decoding="async"
			data-oembed
		/>
	);
});
