import type { InlineMath } from "mdast-util-math";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const inilneMath: Handler<InlineMath> = (node): A.InlineMath => {
	return {
		type: "inlineMath",
		value: node.value,
		position: node.position,
	};
};
