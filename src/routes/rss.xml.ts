import type { Blog } from "content-collections";
import { allBlogs } from "content-collections";
import { Temporal } from "temporal-polyfill";
import { Builder } from "xml2js";
import { GET as SolidGET } from "@solidjs/start";

function blog2xml(blog: Blog) {
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
			pubDate: new Date(Temporal.ZonedDateTime.from(blog.publishedAt).toString({
				timeZoneName: "never",
			})).toUTCString(),
			title: blog.title,
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
		...allBlogs.filter(blog => import.meta.env.DEV || blog.published).map(blog2xml),
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

export const GET = SolidGET(() => {
	"use server";

	const builder = new Builder();
	const xml = builder.buildObject(generateXmlAst());

	return new Response(xml, { headers: { "Content-Type": "application/xml" }, status: 200 });
});
