import { allBlogs } from "content-collections";
import { Builder } from "xml2js";
import { GET as SolidGET } from "@solidjs/start";
import { Temporal } from "temporal-polyfill";

function createUrlSet() {
	const staticUrls = [
		{ loc: "https://blog.re-taro.dev/" },
		{ loc: "https://blog.re-taro.dev/privacy" },
		{ loc: "https://blog.re-taro.dev/tags" },
	];

	const blogUrls = allBlogs.filter(blog => import.meta.env.DEV || blog.published).map(blog => ({
		lastmod: Temporal.ZonedDateTime.from(blog.updatedAt ?? blog.publishedAt).toString({
			timeZoneName: "never",
		}),
		loc: `https://blog.re-taro.dev/p/${blog._meta.directory}`,
	}));

	return {
		urlset: {
			$: {
				xmlns: "http://www.sitemaps.org/schemas/sitemap/0.9",
			},
			url: [...staticUrls, ...blogUrls],
		},
	};
}

export const GET = SolidGET(() => {
	"use server";

	const builder = new Builder();
	const xml = builder.buildObject(createUrlSet());

	return new Response(xml, { headers: { "Content-Type": "application/xml" }, status: 200 });
});
