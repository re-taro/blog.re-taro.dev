import { Temporal } from 'temporal-polyfill';
import type { Blog } from 'contents';

const blog2xml = (blog: Blog) => {
	return {
		item: {
			description: blog.description,
			guid: {
				_: `https://blog.re-taro.dev/p/${blog._meta.directory}`,
				$: {
					isPermaLink: true,
				},
			},
			link: `https://blog.re-taro.dev/p/${blog._meta.directory}`,
			pubDate: new Date(
				Temporal.ZonedDateTime.from(blog.publishedAt).toString({
					timeZoneName: 'never',
				}),
			).toUTCString(),
			title: blog.title,
		},
	};
};

const blogChannel = (blogs: Blog[]) => {
	return [
		{
			title: 'blog.re-taro.dev',
		},
		{
			description: 'Rintaro Itokawa(re-taro)のブログです。',
		},
		{
			link: 'https://blog.re-taro.dev',
		},
		{
			lastBuildDate: new Date().toUTCString(),
		},
		{
			language: 'ja',
		},
		...blogs.map(blog2xml),
	];
};

// eslint-disable-next-line ts/explicit-module-boundary-types
export const generateXmlAst = (blogs: Blog[]) => {
	return {
		rss: {
			$: {
				'version': '2.0',
				'xmlns:atom': 'http://www.w3.org/2005/Atom',
			},
			channel: [blogChannel(blogs)],
		},
	};
};
