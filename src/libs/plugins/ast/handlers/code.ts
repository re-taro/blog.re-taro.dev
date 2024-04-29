import type * as M from "mdast";
import { P, match } from "ts-pattern";

import { unreachable } from "../../error";
import type * as A from "../ast";
import type { Handler } from "../transform";

export const code: Handler<M.Code> = async (node): Promise<A.Code> => {
	const infoStr = [node.lang, node.lang]
		.filter(s => s !== undefined)
		.join(" ");

	const [langDiff, filename] = infoStr.split(":", 2);
	if (langDiff === undefined)
		unreachable();
	const lang = match(
		langDiff,
	)
		.returnType<string | undefined>()
		.with("", () => undefined)
		.with(P.string, lang => lang)
		.exhaustive();

	return {
		type: "code",
		lang,
		filename,
		value: node.value,
		position: node.position,
	};
};
