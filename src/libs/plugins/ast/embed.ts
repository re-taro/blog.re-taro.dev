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
			type: "embed",
			position: node.position,
			src: node.src,
			oembed: metadata.oEmbed as OEmbed | undefined, // MEMO: This is a safety cast
			meta: metadata,
		};
	}
	else {
		return {
			type:	"embed",
			position:	node.position,
			src:	node.src,
			width:	node.width,
			height:	node.height,
			allowFullScreen:	node.allowFullScreen,
			style:	node.style,
		};
	}
};

export const astEmbed: Plugin = function () {
	const data = this.data();

	data.astFromMdastHandlers ??= {};
	data.astFromMdastHandlers.embed = embed;
};
