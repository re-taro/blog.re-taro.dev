import { Meta } from "@solidjs/meta";
import type { Component } from "solid-js";
import { Index } from "solid-js";

export type OgType =
	| "music.song"
	| "music.album"
	| "music.playlist"
	| "music.radio_station"
	| "video.movie"
	| "video.episode"
	| "video.tv_show"
	| "video.other"
	| "article"
	| "book"
	| "profile"
	| "website";

export interface TwitterTagsSource {
	imgType: "summary" | "summary_large_image";
	imgUrl?: string;
	username:
		| string
		| {
			site: string;
			creator: string;
		};
	description?: string;
	title?: string;
}

export interface MetaTagsSource {
	title: string;
	type: OgType;
	imgUrl: string;
	description: string;
	twitter?: TwitterTagsSource;
}

const TwitterMetaTags: Component<{
	src: MetaTagsSource;
	twitter: TwitterTagsSource;
}> = (props) => {
	const site
		= typeof props.twitter.username === "string"
			? props.twitter.username
			: props.twitter.username.site;
	const creator
		= typeof props.twitter.username === "string"
			? props.twitter.username
			: props.twitter.username.creator;

	return (
		<>
			<Meta name="twitter:card" content={props.twitter.imgType} />
			<Meta name="twitter:site" content={`@${site}`} />
			<Meta name="twitter:creator" content={`@${creator}`} />
			<Meta name="twitter:title" content={props.twitter.title} />
			<Meta name="twitter:description" content={props.twitter.description} />
			<Meta name="twitter:image" content={props.twitter.imgUrl} />
			<Meta name="twitter:image:alt" content={props.twitter.description} />
		</>
	);
};

export const OgMetaTags: Component<MetaTagsSource> = (props) => {
	return (
		<>
			<Meta property="og:title" content={props.title} />
			<Meta property="og:type" content={props.type} />
			<Meta property="og:image" content={props.imgUrl} />
			<Meta property="og:image:alt" content={props.description} />
			<Meta property="og:description" content={props.description} />
			{props.twitter && <TwitterMetaTags src={props} twitter={props.twitter} />}
		</>
	);
};

export const ArticleTags: Component<{ tags: Array<string> }> = (props) => {
	return (
		<Index each={props.tags}>
			{tag => (
				<Meta property="article:tag" content={tag()} />
			)}
		</Index>
	);
};
