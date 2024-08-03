import type { Component } from "solid-js";
import Rich from "./Rich";
import Photo from "./Photo";
import Video from "./Video";
import LinkCard from "./LinkCard";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.Embed;
}

const Embed: Component<Props> = (props) => {
	const url = new URL(props.node.src);
	if (typeof props.node.oembed !== "undefined") {
		if (props.node.oembed.type === "photo" && props.node.oembed.url) {
			return (
				<Photo node={props.node.oembed} />
			);
		}
		else if (props.node.oembed.type === "video" && props.node.oembed.html) {
			return (
				<Video node={props.node.oembed} />
			);
		}
		else if (props.node.oembed.type === "rich" && props.node.oembed.html) {
			return (
				<Rich node={props.node.oembed} />
			);
		}
	}
	else if (typeof props.node.meta !== "undefined") {
		return (
			<LinkCard node={props.node} meta={props.node.meta} />
		);
	}
	else if (url.hostname === "www.youtube.com") {
		return (
			<div
				class={css({
					position: "relative",
					width: "full",
					paddingBottom: "[56.25%]",
				})}
			>
				<iframe
					class={css({
						position: "absolute",
						top: "0",
						left: "0",
						width: "full",
						height: "full",
					})}
					src={props.node.src}
					width={props.node.width}
					height={props.node.height}
					title="Youtube Embed"
				/>
			</div>
		);
	}
	else if (url.hostname === "docs.google.com" && url.pathname.startsWith("/presentation/d/")) {
		return (
			<div
				class={css({
					position: "relative",
					width: "full",
					paddingBottom: "[59.27%]",
				})}
			>
				<iframe
					class={css({
						position: "absolute",
						top: "0",
						left: "0",
						width: "full",
						height: "full",
					})}
					src={props.node.src}
					width={props.node.width}
					allowfullscreen={props.node.allowFullScreen}
					title="Google Slides Embed"
				/>
			</div>
		);
	}
	else {
		return null;
	}
};

export default Embed;
