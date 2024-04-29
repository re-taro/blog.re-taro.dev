import type { Math } from "mdast-util-math";

import type * as A from "../ast";
import type { Handler } from "../transform";

export const math: Handler<Math> = (node): A.Math => {
	return {
		type: "math",
		value: node.value,
		position: node.position,
	};
};
