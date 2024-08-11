import type { Plugin } from "unified";

import type * as A from "./ast";
import { isSection } from "./check";

export const astArticle: Plugin<Array<never>, A.Root, A.Article> = function () {
	return (tree) => {
		assertValidSectioning(tree);
		const [section] = tree.children;
		const [title, ...children] = section.children;

		const rawToc = this.data("toc");
		assertValidToc(rawToc);
		const [{ children: toc }] = rawToc;

		const article: A.Article = {
			children,
			footnotes: tree.footnotes,
			title,
			toc,
			type: "article",
		};

		return article;
	};
};

interface ValidSectioning extends A.Root {
	children: [A.Section];
}

function assertValidSectioning(tree: A.Root): asserts tree is ValidSectioning {
	const [section] = tree.children;
	if (!section || !isSection(section)) {
		throw new Error(
			"Invalid sectioning: you must have exactly one level-1 heading.",
		);
	}

	if (section.children[0].level !== 1) {
		throw new Error(
			"Invalid sectioning: you must start with a level-1 heading.",
		);
	}
}

function assertValidToc(toc: Array<A.Toc> | undefined): asserts toc is [A.Toc] {
	if (!toc || toc.length !== 1) {
		throw new Error(
			"Invalid table of contents: you must have exactly one top-level section.",
		);
	}
}
