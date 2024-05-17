import { component$ } from "@builder.io/qwik";
import { sanitize } from "./sanitize";
import type { OEmbedVideo } from "~/libs/oEmbedSchema";
import { css } from "~/styled-system/css";

interface Props {
	node: OEmbedVideo;
}

export default component$<Props>(({ node }) => {
	return (
		<div class={css({ width: "full" })} dangerouslySetInnerHTML={sanitize(node.html)} data-oembed />
	);
});
