import { Meta } from "@solidjs/meta";
import type { Component } from "solid-js";
import { Index } from "solid-js";

export type OgType =
	| "article"
	| "book"
	| "music.album"
	| "music.playlist"
	| "music.radio_station"
	| "music.song"
	| "profile"
	| "video.episode"
	| "video.movie"
	| "video.other"
	| "video.tv_show"
	| "website";

export interface TwitterTagsSource {
	imgType: "summary" | "summary_large_image";
	username:
		| {
			creator: string;
			site: string;
		}
		| string;
	description?: string;
	imgUrl?: string;
	title?: string;
}

export interface MetaTagsSource {
	description: string;
	imgUrl: string;
	title: string;
	type: OgType;
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
			<Meta content={props.twitter.imgType} name="twitter:card" />
			<Meta content={`@${site}`} name="twitter:site" />
			<Meta content={`@${creator}`} name="twitter:creator" />
			<Meta content={props.twitter.title} name="twitter:title" />
			<Meta content={props.twitter.description} name="twitter:description" />
			<Meta content={props.twitter.imgUrl} name="twitter:image" />
			<Meta content={props.twitter.description} name="twitter:image:alt" />
		</>
	);
};

export const OgMetaTags: Component<MetaTagsSource> = (props) => {
	return (
		<>
			<Meta content={props.title} property="og:title" />
			<Meta content={props.type} property="og:type" />
			<Meta content={props.imgUrl} property="og:image" />
			<Meta content={props.description} property="og:image:alt" />
			<Meta content={props.description} property="og:description" />
			{props.twitter && <TwitterMetaTags src={props} twitter={props.twitter} />}
		</>
	);
};

export const ArticleTags: Component<{ tags: Array<string> }> = (props) => {
	return (
		<Index each={props.tags}>
			{tag => (
				<Meta content={tag()} property="article:tag" />
			)}
		</Index>
	);
};
