import type { Plugin } from "unified";

import type { LinkCard as MLinkCard } from "../remark/remarkLinkCard";
import type { LinkCard } from "./ast";
import type { Handler } from "./transform";

const linkCard: Handler<MLinkCard> = (node): LinkCard => {
	return {
		type: "link-card",
		value: node.value,
		position: node.position,
	};
};

export const astLinkCard: Plugin = function () {
	const data = this.data();

	data.astFromMdastHandlers ??= {};
	data.astFromMdastHandlers["link-card"] = linkCard;
};
