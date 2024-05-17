import type { DocumentMeta } from "@builder.io/qwik-city";

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

function twitterMetaTags(
	src: MetaTagsSource,
	twitter: TwitterTagsSource,
): Array<DocumentMeta> {
	const site
		= typeof twitter.username === "string"
			? twitter.username
			: twitter.username.site;
	const creator
		= typeof twitter.username === "string"
			? twitter.username
			: twitter.username.creator;
	return [
		{
			name: "twitter:card",
			content: twitter.imgType,
		},
		{
			name: "twitter:site",
			content: `@${site}`,
		},
		{
			name: "twitter:creator",
			content: `@${creator}`,
		},
		{
			name: "twitter:title",
			content: twitter.title ? twitter.title : src.title,
		},
		{
			name: "twitter:description",
			content: twitter.description ? twitter.description : src.description,
		},
		{
			name: "twitter:image",
			content: twitter.imgUrl ? twitter.imgUrl : src.imgUrl,
		},
		{
			name: "twitter:image:alt",
			content: twitter.description ? twitter.description : src.description,
		},
	];
}

export function ogMetaTags(src: MetaTagsSource): Array<DocumentMeta> {
	return [
		{
			property: "og:title",
			content: src.title,
		},
		{
			property: "og:type",
			content: src.type,
		},
		{
			property: "og:image:url",
			content: src.imgUrl,
		},
		{
			property: "og:image:alt",
			content: src.description,
		},
		...(src.twitter ? twitterMetaTags(src, src.twitter) : []),
	];
}

export function createOgpImageUrl(title: string, tags: Array<string>): URL {
	const url = new URL("https://og.re-taro.dev");
	url.searchParams.append("title", title);
	url.searchParams.append("text", tags.join(","));

	return url;
}

export function articleTags(tags: Array<string>): Array<DocumentMeta> {
	return tags.map(tag => ({
		name: "article:tag",
		content: tag,
	}));
}
