import { env } from 'cloudflare:workers';
import { Hono } from 'hono/tiny';
import { Temporal } from 'temporal-polyfill';
import type { Blog } from 'content-collections';

const app = new Hono();

app.get('/', async (c) => {
	const { allBlogs } = await import('content-collections');
	const blogs = allBlogs
		.filter((blog) => env.ENVIRONMENT === 'dev' || blog.published)
		.sort((a, b) =>
			Temporal.ZonedDateTime.compare(
				Temporal.ZonedDateTime.from(b.publishedAt),
				Temporal.ZonedDateTime.from(a.publishedAt),
			),
		);

	return c.json({
		blogs,
	});
});

app.get('/p/:slug', async (c) => {
	const { allBlogs } = await import('content-collections');
	const slug = c.req.param('slug');
	const blog = allBlogs.find((blog) => blog._meta.directory === slug);

	if (!blog) {
		return c.text('Not Found', 404);
	}

	return c.json({
		blog,
	});
});

app.get('/tags', async (c) => {
	const { allBlogs } = await import('content-collections');
	const tags = [
		...allBlogs
			.filter((blog) => env.ENVIRONMENT === 'dev' || blog.published)
			.sort((a, b) =>
				Temporal.ZonedDateTime.compare(
					Temporal.ZonedDateTime.from(b.publishedAt),
					Temporal.ZonedDateTime.from(a.publishedAt),
				),
			)
			.reduce((acc, blog) => {
				for (const tag of blog.tags) {
					if (acc.has(tag))
						acc.get(tag)?.push(blog); // MEMO: This is an safe operation because the tag is already in the map.
					else acc.set(tag, [blog]);
				}

				return acc;
			}, new Map<string, Blog[]>())
			.entries(),
	].sort((a, b) => (a[0] > b[0] ? 1 : -1));

	return c.json({
		tags,
	});
});

export default app;
