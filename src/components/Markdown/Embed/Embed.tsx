import type { Component } from "solid-js";
import { Match, Switch, createMemo } from "solid-js";
import Rich from "./Rich";
import Photo from "./Photo";
import Video from "./Video";
import LinkCard from "./LinkCard";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";
import type { OEmbed as OEmbedT } from "~/libs/oEmbedSchema";

interface OEmbedProps {
	oembed: OEmbedT;
}

interface EmbedProps {
	node: A.Embed;
}

const OEmbed: Component<OEmbedProps> = (props) => {
	const memoizedPhoto = createMemo(() => props.oembed.type === "photo" && props.oembed.url ? props.oembed : undefined);
	const memoizedVideo = createMemo(() => props.oembed.type === "video" && props.oembed.html ? props.oembed : undefined);
	const memoizedRich = createMemo(() => props.oembed.type === "rich" && props.oembed.html ? props.oembed : undefined);

	return (
		<Switch>
			<Match when={memoizedPhoto()}>
				{photo => (
					<Photo node={photo()} />
				)}
			</Match>
			<Match when={memoizedVideo()}>
				{video => (
					<Video node={video()} />
				)}
			</Match>
			<Match when={memoizedRich()}>
				{rich => (
					<Rich node={rich()} />
				)}
			</Match>
		</Switch>
	);
};

const Embed: Component<EmbedProps> = (props) => {
	const memoizedOEmbed = createMemo(() => typeof props.node.oembed !== "undefined" ? props.node.oembed : undefined);
	const memoizedMeta = createMemo(() => typeof props.node.meta !== "undefined" ? props.node.meta : undefined);
	const memoizedYoutube = createMemo(() => {
		const url = new URL(props.node.src);

		return url.hostname === "www.youtube.com" ? props.node : undefined;
	});
	const memoizedGoogleSlides = createMemo(() => {
		const url = new URL(props.node.src);

		return url.hostname === "docs.google.com" && url.pathname.startsWith("/presentation/d/") ? props.node : undefined;
	});

	return (
		<Switch>
			<Match when={memoizedOEmbed()}>
				{oembed => (
					<OEmbed oembed={oembed()} />
				)}
			</Match>
			<Match when={memoizedMeta()}>
				{meta => (
					<LinkCard meta={meta()} node={props.node} />
				)}
			</Match>
			<Match when={memoizedYoutube()}>
				{youtube => (
					<div
						class={css({
							paddingBottom: "[56.25%]",
							position: "relative",
							width: "full",
						})}
					>
						<iframe
							class={css({
								height: "full",
								left: "0",
								position: "absolute",
								top: "0",
								width: "full",
							})}
							height={youtube().height}
							src={youtube().src}
							title="Youtube Embed"
							width={youtube().width}
						/>
					</div>
				)}
			</Match>
			<Match when={memoizedGoogleSlides()}>
				{googleSlides => (
					<div
						class={css({
							paddingBottom: "[59.27%]",
							position: "relative",
							width: "full",
						})}
					>
						<iframe
							class={css({
								height: "full",
								left: "0",
								position: "absolute",
								top: "0",
								width: "full",
							})}
							allowfullscreen={googleSlides().allowFullScreen}
							src={googleSlides().src}
							title="Google Slides Embed"
							width={googleSlides().width}
						/>
					</div>
				)}
			</Match>
		</Switch>
	);
};

export default Embed;
