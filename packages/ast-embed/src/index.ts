import { unfurl } from 'unfurl.js';
import { fetchHtml } from './fetchHtml';
import { parseHtml } from './parseHtml';
import type * as A from 'ast';
import type { Handler } from 'ast-transform';
import type { OEmbed } from 'oembed';
import type * as M from 'remark-embed';
import type { Plugin } from 'unified';

const embed: Handler<M.Embed> = async (node): Promise<A.Embed> => {
	if (node.oembed) {
		const metadata = await unfurl(node.src);

		return {
			meta: metadata,
			oembed: metadata.oEmbed as OEmbed | undefined, // MEMO: This is a safety cast
			position: node.position,
			src: node.src,
			type: 'embed',
		};
	} else if (node.isGitHubPermalink) {
		const html = await fetchHtml(node.src);
		const data = parseHtml(html, node.src);

		return {
			filename: data.filename,
			lang: data.lang,
			commitHashOrBranch: data.commitHashOrBranch,
			lines: data.lines,
			codeLines: data.codeLines,
			src: node.src,
			type: 'embed',
		};
	}

	return {
		allowFullScreen: node.allowFullScreen,
		height: node.height,
		position: node.position,
		src: node.src,
		type: 'embed',
		width: node.width,
	};
};

export const astEmbed: Plugin = function () {
	const data = this.data();

	data.astFromMdastHandlers ??= {};
	data.astFromMdastHandlers['embed'] = embed;
};
