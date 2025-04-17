import { unfurl } from 'unfurl.js';
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
