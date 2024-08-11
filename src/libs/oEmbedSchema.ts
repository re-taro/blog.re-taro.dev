/**
 * oEmbed Schema
 * @see https://oembed.com/#section2
 */
export type OEmbed = OEmbedLink | OEmbedPhoto | OEmbedRich | OEmbedVideo;

interface OEmbedBase {
	type: "link" | "photo" | "rich" | "video";
	version: string;
	author_name?: string;
	author_url?: string;
	cache_age?: string;
	provider_name?: string;
	provider_url?: string;
	thumbnail_height?: number;
	thumbnail_url?: string;
	thumbnail_width?: number;
	title?: string;
};

export type OEmbedPhoto = {
	height: number;
	type: "photo";
	url: string;
	width: number;
} & OEmbedBase;

export type OEmbedVideo = {
	height: number;
	html: string;
	type: "video";
	width: number;
} & OEmbedBase;

export type OEmbedLink = {
	type: "link";
} & OEmbedBase;

export type OEmbedRich = {
	height: number;
	html: string;
	type: "rich";
	width: number;
} & OEmbedBase;
