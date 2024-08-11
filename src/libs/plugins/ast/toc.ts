import type { Plugin } from "unified";

import { isSection } from "./check";
import type * as A from "./ast";

export const astToc: Plugin<Array<never>, A.Root> = function () {
	const data = this.data();

	return (tree) => {
		const toc = process(tree);

		data.toc ??= toc;
	};
};

function process(tree: A.Parent): Array<A.Toc> {
	return tree.children.filter(isSection).map(
		(section): A.Toc => ({
			children: process(section),
			id: section.children[0].id,
			plain: section.children[0].plain,
			type: "toc",
		}),
	);
}

declare module "unified" {
	interface Data {
		toc?: Array<A.Toc>;
	}
}
