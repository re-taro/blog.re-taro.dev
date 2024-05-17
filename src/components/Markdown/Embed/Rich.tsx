import { component$ } from "@builder.io/qwik";
import { fromHtml } from "hast-util-from-html";
import { select } from "hast-util-select";
import { toHtml } from "hast-util-to-html";
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

export default component$<Props>(({ node }) => {
	return (
		<div class={css({ width: "full" })} dangerouslySetInnerHTML={transform(sanitize(node.html))} data-oembed />
	);
});
