import { fromHtml } from "hast-util-from-html";
import { select } from "hast-util-select";
import { toHtml } from "hast-util-to-html";
import type { Component } from "solid-js";
import { sanitize } from "./sanitize";
import { css } from "~/styled-system/css";
import type { OEmbedRich } from "~/libs/oEmbedSchema";

interface Props {
	node: OEmbedRich;
}

function transform(html: string) {
	const hast = fromHtml(html);
	const iframe = select("iframe", hast);
	if (iframe?.properties.style?.toString().includes("aspect-ratio:")) {
		iframe.properties.width = "100%";
		iframe.properties.height = "100%";
	}

	return toHtml(hast);
}

const Rich: Component<Props> = (props) => {
	return (
		<div class={css({ width: "full" })} innerHTML={transform(sanitize(props.node.html))} data-oembed />
	);
};

export default Rich;
