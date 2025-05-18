/* eslint-disable node/no-sync */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';

const __dirname = path.dirname(new URL(import.meta.url).pathname);
const CACHE_FILE = path.resolve(__dirname, '../../../apps/contents/cache/ast-embed.cache.json');

/**
 * Url(string) - content(string)
 */
type Cache = Record<string, string>;
// eslint-disable-next-line ts/no-unsafe-assignment
const cache: Cache = JSON.parse(
	(() => {
		try {
			mkdirSync(path.dirname(CACHE_FILE), { recursive: true });
			return readFileSync(CACHE_FILE, 'utf8');
		} catch {
			return '{}';
		}
	})(),
);

export const fetchHtml = async (url: string): Promise<string> => {
	const c = cache[url];
	if (c != null) {
		return c;
	}
	const res = await fetch(url);
	const html = await res.text().then((html) => {
		cache[url] = html;
		writeFileSync(CACHE_FILE, JSON.stringify(cache));

		return html;
	});

	return html;
};
