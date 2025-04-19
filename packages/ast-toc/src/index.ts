import { isSection } from 'ast-check';
import type * as A from 'ast';
import type { Plugin } from 'unified';

export const astToc: Plugin<never[], A.Root> = function () {
	const data = this.data();

	return (tree) => {
		const toc = process(tree);

		data.toc ??= toc;
	};
};

function process(tree: A.Parent): A.Toc[] {
	return tree.children.filter(isSection).map(
		(section): A.Toc => ({
			children: process(section),
			id: section.children[0].id,
			plain: section.children[0].plain,
			type: 'toc',
		}),
	);
}

declare module 'unified' {
	interface Data {
		toc?: A.Toc[];
	}
}
