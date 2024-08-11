import type * as M from "mdast";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const image: Handler<M.Image> = async (node): Promise<A.Image> => {
	return {
		alt: node.alt ?? "",
		position: node.position,
		title: node.title ?? undefined,
		type: "image",
		url: node.url,
	};
};
