import { P, match } from 'ts-pattern';
import { unreachable } from 'utils';
import type { Handler } from '..';
import type * as A from 'ast';
import type * as M from 'mdast';

// eslint-disable-next-line ts/require-await
export const code: Handler<M.Code> = async (node): Promise<A.Code> => {
	const infoStr = [node.lang, node.lang].filter((s) => s !== undefined).join(' ');

	const [langDiff, filename] = infoStr.split(':', 2);
	if (langDiff === undefined) unreachable();
	const lang = match(langDiff)
		.returnType<string | undefined>()
		// eslint-disable-next-line unicorn/no-useless-undefined
		.with('', () => undefined)
		.with(P.string, (lang) => lang)
		.exhaustive();

	return {
		filename,
		lang,
		position: node.position,
		type: 'code',
		value: node.value,
	};
};
