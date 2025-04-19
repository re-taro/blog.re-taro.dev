import { isSection } from 'ast-check';
import type * as A from 'ast';
import type { Plugin } from 'unified';

export const astArticle: Plugin<never[], A.Root, A.Article> = function () {
	return (tree) => {
		assertValidSectioning(tree);
		const [section] = tree.children;
		const [title, ...children] = section.children;

		const rawToc = this.data('toc');
		assertValidToc(rawToc);
		const [{ children: toc }] = rawToc;

		const article: A.Article = {
			children,
			footnotes: tree.footnotes,
			title,
			toc,
			type: 'article',
		};

		return article;
	};
};

interface ValidSectioning extends A.Root {
	children: [A.Section];
}

const assertValidSectioning: (tree: A.Root) => asserts tree is ValidSectioning = (tree) => {
	const [section] = tree.children;
	if (!section || !isSection(section)) {
		throw new Error('Invalid sectioning: you must have exactly one level-1 heading.');
	}

	if (section.children[0].level !== 1) {
		throw new Error('Invalid sectioning: you must start with a level-1 heading.');
	}
};

const assertValidToc: (toc: A.Toc[] | undefined) => asserts toc is [A.Toc] = (toc) => {
	if (!toc || toc.length !== 1) {
		throw new Error('Invalid table of contents: you must have exactly one top-level section.');
	}
};

declare module 'unified' {
	interface Data {
		toc?: A.Toc[];
	}
}
