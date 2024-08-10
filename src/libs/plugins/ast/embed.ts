import type { Plugin } from "unified";
import { unfurl } from "unfurl.js";

import type { Embed as MEmbed } from "../remark/remarkEmbed";
import type { Embed } from "./ast";
import type { Handler } from "./transform";
import type { OEmbed } from "~/libs/oEmbedSchema";

const embed: Handler<MEmbed> = async (node): Promise<Embed> => {
	if (node.oembed) {
		const metadata = await unfurl(node.src);

		return {
			meta: metadata,
			oembed: metadata.oEmbed as OEmbed | undefined, // MEMO: This is a safety cast
			position: node.position,
			src: node.src,
			type: "embed",
		};
	}
	else {
		return {
			allowFullScreen:	node.allowFullScreen,
			height:	node.height,
			position:	node.position,
			src:	node.src,
			type:	"embed",
			width:	node.width,
		};
	}
};

export const astEmbed: Plugin = function () {
	const data = this.data();

	data.astFromMdastHandlers ??= {};
	data.astFromMdastHandlers.embed = embed;
};
