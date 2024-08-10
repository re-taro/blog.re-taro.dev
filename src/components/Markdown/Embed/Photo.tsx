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
			data-oembed
			alt={props.node.title}
			decoding="async"
			height={props.node.height}
			loading="lazy"
			src={props.node.url}
			width={props.node.width}
		/>
	);
};

export default Photo;
