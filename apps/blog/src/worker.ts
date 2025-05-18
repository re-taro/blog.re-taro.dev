import { env } from 'cloudflare:workers';
import { index, render, route } from 'rwsdk/router';
import { defineApp } from 'rwsdk/worker';
import { Builder } from 'xml2js';
import { generateXmlAst } from './app/context/rss';
import { createUrlSet } from './app/context/sitemap';
import { Document } from './app/Document';
import { setCommonHeaders } from './app/headers';
import { Post } from './app/pages/Post';
import { Privacy } from './app/pages/Privacy';
import { Tags } from './app/pages/Tags';
import { Top } from './app/pages/Top';
import type { Blog } from 'contents';

export default defineApp([
	setCommonHeaders(),
	render(Document, [
		index(Top),
		route('/privacy', Privacy),
		route('/tags', Tags),
		route('/p', async ({ request }) => {
			const url = new URL(request.url);
			const { blogs } = await env.CONTENTS.fetch(url.origin).then(async (res) => await res.json<{ blogs: Blog[] }>());

			const latestPost = blogs.at(0);

			return new Response(null, {
				status: 307,
				headers: {
					// eslint-disable-next-line ts/restrict-template-expressions
					Location: `/p/${latestPost?._meta.directory}`,
				},
			});
		}),
		route('/p/:slug', Post),
		route('/rss.xml', async ({ request }) => {
			const url = new URL(request.url);
			const { blogs } = await env.CONTENTS.fetch(url.origin).then(async (res) => await res.json<{ blogs: Blog[] }>());
			const builder = new Builder();
			const xml = builder.buildObject(generateXmlAst(blogs));

			return new Response(xml, { headers: { 'Content-Type': 'application/xml' }, status: 200 });
		}),
		route('/sitemap.xml', async ({ request }) => {
			const url = new URL(request.url);
			const { blogs } = await env.CONTENTS.fetch(url.origin).then(async (res) => await res.json<{ blogs: Blog[] }>());
			const builder = new Builder();
			const xml = builder.buildObject(createUrlSet(blogs));

			return new Response(xml, { headers: { 'Content-Type': 'application/xml' }, status: 200 });
		}),
	]),
]);
