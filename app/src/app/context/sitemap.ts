import { allBlogs } from 'content-collections';
import { Temporal } from 'temporal-polyfill';

// eslint-disable-next-line ts/explicit-module-boundary-types
export const createUrlSet = () => {
	const staticUrls = [
		{ loc: 'https://blog.re-taro.dev/' },
		{ loc: 'https://blog.re-taro.dev/privacy' },
		{ loc: 'https://blog.re-taro.dev/tags' },
	];

	const blogUrls = allBlogs
		.filter((blog) => import.meta.env.DEV || blog.published)
		.map((blog) => ({
			lastmod: Temporal.ZonedDateTime.from(blog.updatedAt ?? blog.publishedAt).toString({
				timeZoneName: 'never',
			}),
			loc: `https://blog.re-taro.dev/p/${blog._meta.directory}`,
		}));

	return {
		urlset: {
			$: {
				xmlns: 'http://www.sitemaps.org/schemas/sitemap/0.9',
			},
			url: [...staticUrls, ...blogUrls],
		},
	};
};
