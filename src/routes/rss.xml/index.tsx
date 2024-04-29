import type { RequestHandler } from "@builder.io/qwik-city";
import { allBlogs } from "content-collections";
import { Builder } from "xml2js";

function blog2xml(blog: (typeof allBlogs)[0]) {
	return {
		item: {
			title: blog.title,
			link: `https://blog.re-taro.dev/p/${blog._meta.path}`,
			guid: {
				$: {
					isPermaLink: true,
				},
				_: `https://blog.re-taro.dev/p/${blog._meta.path}`,
			},
			description: blog.description,
			pubDate: new Date(blog.publishedAt).toUTCString(),
		},
	};
}

function blogChannel() {
	return [
		{
			title: "blog.re-taro.dev",
		},
		{
			description: "Rintaro Itokawa(re-taro)のブログです。",
		},
		{
			link: "https://blog.re-taro.dev",
		},
		{
			lastBuildDate: new Date().toUTCString(),
		},
		{
			language: "ja",
		},
		...allBlogs.map(blog2xml),
	];
}

function generateXmlAst() {
	return {
		rss: {
			$: {
				"version": "2.0",
				"xmlns:atom": "http://www.w3.org/2005/Atom",
			},
			channel: [blogChannel()],
		},
	};
}

export const onGet: RequestHandler = async ({ send }) => {
	const builder = new Builder();
	const xml = builder.buildObject(generateXmlAst());
	send(200, xml);
};
