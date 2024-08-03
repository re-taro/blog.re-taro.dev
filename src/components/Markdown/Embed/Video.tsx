import type { Component } from "solid-js";
import { sanitize } from "./sanitize";
import type { OEmbedVideo } from "~/libs/oEmbedSchema";
import { css } from "~/styled-system/css";

interface Props {
	node: OEmbedVideo;
}

const Video: Component<Props> = (props) => {
	return (
		<div class={css({ width: "full" })} innerHTML={sanitize(props.node.html)} data-oembed />
	);
};

export default Video;
