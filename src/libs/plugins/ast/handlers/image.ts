import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const image: Handler<M.Image> = (node): A.Image => {
	return {
		type: "image",
		alt: node.alt ?? "",
		url: node.url,
		title: node.title ?? undefined,
		position: node.position,
	};
};
