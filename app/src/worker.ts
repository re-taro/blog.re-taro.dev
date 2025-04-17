import { index, render, route } from '@redwoodjs/sdk/router';
import { defineApp } from '@redwoodjs/sdk/worker';
import { Temporal } from 'temporal-polyfill';
import { Builder } from 'xml2js';
import { generateXmlAst } from './app/context/rss';
import { createUrlSet } from './app/context/sitemap';
import { Document } from './app/Document';
import { setCommonHeaders } from './app/headers';
import { Post } from './app/pages/Post';
import { Privacy } from './app/pages/Privacy';
import { Tags } from './app/pages/Tags';
import { Top } from './app/pages/Top';

export default defineApp([
	setCommonHeaders(),
	render(Document, [
		index(Top),
		route('/privacy', Privacy),
		route('/tags', Tags),
		route('/p', async () => {
			const { allBlogs } = await import('content-collections');

			const latestPost = allBlogs
				.filter((b) => import.meta.env.DEV || b.published)
				.sort((a, b) =>
					Temporal.ZonedDateTime.compare(
						Temporal.ZonedDateTime.from(b.publishedAt),
						Temporal.ZonedDateTime.from(a.publishedAt),
					),
				)[0];

			return new Response(null, {
				status: 307,
				headers: {
					// eslint-disable-next-line ts/restrict-template-expressions
					Location: `/p/${latestPost?._meta.directory}`,
				},
			});
		}),
		route('/p/:slug', Post),
		route('/rss.xml', () => {
			const builder = new Builder();
			const xml = builder.buildObject(generateXmlAst());

			return new Response(xml, { headers: { 'Content-Type': 'application/xml' }, status: 200 });
		}),
		route('/sitemap.xml', () => {
			const builder = new Builder();
			const xml = builder.buildObject(createUrlSet());

			return new Response(xml, { headers: { 'Content-Type': 'application/xml' }, status: 200 });
		}),
	]),
]);
