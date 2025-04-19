import type { FC } from 'react';

type OgType =
	| 'article'
	| 'book'
	| 'music.album'
	| 'music.playlist'
	| 'music.radio_station'
	| 'music.song'
	| 'profile'
	| 'video.episode'
	| 'video.movie'
	| 'video.other'
	| 'video.tv_show'
	| 'website';

interface TwitterTagsSource {
	imgType: 'summary' | 'summary_large_image';
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

interface MetaTagsSource {
	description: string;
	imgUrl: string;
	title: string;
	type: OgType;
	twitter?: TwitterTagsSource;
}

const TwitterMetaTags: FC<{
	src: MetaTagsSource;
	twitter: TwitterTagsSource;
}> = (props) => {
	const site = typeof props.twitter.username === 'string' ? props.twitter.username : props.twitter.username.site;
	const creator = typeof props.twitter.username === 'string' ? props.twitter.username : props.twitter.username.creator;

	return (
		<>
			<meta content={props.twitter.imgType} name="twitter:card" />
			<meta content={`@${site}`} name="twitter:site" />
			<meta content={`@${creator}`} name="twitter:creator" />
			<meta content={props.twitter.title} name="twitter:title" />
			<meta content={props.twitter.description} name="twitter:description" />
			<meta content={props.twitter.imgUrl} name="twitter:image" />
			<meta content={props.twitter.description} name="twitter:image:alt" />
		</>
	);
};

export const OgMetaTags: FC<MetaTagsSource> = (props) => {
	return (
		<>
			<meta content={props.title} property="og:title" />
			<meta content={props.type} property="og:type" />
			<meta content={props.imgUrl} property="og:image" />
			<meta content={props.description} property="og:image:alt" />
			<meta content={props.description} property="og:description" />
			{props.twitter && <TwitterMetaTags src={props} twitter={props.twitter} />}
		</>
	);
};
