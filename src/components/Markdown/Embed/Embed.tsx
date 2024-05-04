import { component$ } from "@builder.io/qwik";
import Rich from "./Rich";
import Photo from "./Photo";
import Video from "./Video";
import LinkCard from "./LinkCard";
import type * as A from "~/libs/plugins/ast/ast";

interface Props {
	node: A.Embed;
}

export default component$<Props>(({ node }) => {
	if (typeof node.oembed !== "undefined") {
		if (node.oembed.type === "photo" && node.oembed.url) {
			return (
				<Photo node={node.oembed} />
			);
		}
		else if (node.oembed.type === "video" && node.oembed.html) {
			return (
				<Video node={node.oembed} />
			);
		}
		else if (node.oembed.type === "rich" && node.oembed.html) {
			return (
				<Rich node={node.oembed} />
			);
		}
	}
	else if (typeof node.meta !== "undefined") {
		return (
			<LinkCard node={node} meta={node.meta} />
		);
	}
	else {
		return null;
	}
});
