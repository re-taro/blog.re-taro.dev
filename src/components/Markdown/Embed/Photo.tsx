import type { Component } from "solid-js";
import { css } from "~/styled-system/css";
import type { OEmbedPhoto } from "~/libs/oEmbedSchema";

interface Props {
	node: OEmbedPhoto;
}

const Photo: Component<Props> = (props) => {
	return (
		<img
			class={css({
				marginX: "auto",
				maxHeight: "full",
				maxWidth: "full",
			})}
			width={props.node.width}
			height={props.node.height}
			src={props.node.url}
			alt={props.node.title}
			loading="lazy"
			decoding="async"
			data-oembed
		/>
	);
};

export default Photo;
