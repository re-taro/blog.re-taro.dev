import type * as M from "mdast";
import { P, match } from "ts-pattern";

import { unreachable } from "../../error";
import type * as A from "../ast";
import type { Handler } from "../transform";

export const code: Handler<M.Code> = (node): A.Code => {
	const infoStr = [node.lang, node.lang]
		.filter(s => s !== undefined)
		.join(" ");

	const [langDiff, filename] = infoStr.split(":", 2);
	if (langDiff === undefined)
		unreachable();
	const [lang, diff] = match(
		langDiff.split(" ", 2) as [string, string] | [string],
	)
		.returnType<[lang: string | undefined, diff: boolean]>()
		.with(["diff", P.string], ([_, lang]) => [lang, true])
		.with([P.string, P.string], ([lang1, lang2]) => [
      `${lang1} ${lang2}`,
      false,
		])
		.with([""], () => [undefined, false])
		.with([P.string], ([lang]) => [lang, false])
		.exhaustive();

	return {
		type: "code",
		lang,
		filename,
		diff,
		value: node.value,
		position: node.position,
	};
};
