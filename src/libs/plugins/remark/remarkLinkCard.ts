import type * as M from "mdast";
import type { Extension } from "mdast-util-from-markdown";
import type { Plugin } from "unified";

import { isLink, isParagraph, isText } from "./check";
import { visit } from "./visit";

export interface LinkCard extends M.Literal {
	type: "link-card";
}

export const remarkLinkCard: Plugin = function () {
	const data = this.data();

	data.fromMarkdownExtensions ??= [];
	data.fromMarkdownExtensions.push(linkCard());
};

function linkCard(): Extension {
	const transformer = (tree: M.Root) => {
		visit(tree, isLinkCardLike, (node, idx, parent) => {
			if (idx === undefined || !parent)
				return;

			if (parent.type !== "root")
				return;

			const [link] = node.children;
			const linkCard: LinkCard = {
				type: "link-card",
				value: link.url,
				position: node.position,
			};
			parent.children[idx] = linkCard;
		});
	};

	return {
		transforms: [transformer],
	};
}

interface LinkCardLike extends M.Paragraph {
	children: [M.Link];
}

function isLinkCardLike(node: M.Node): node is LinkCardLike {
	if (!isParagraph(node))
		return false;

	const [link, ...paragraphRest] = node.children;
	if (paragraphRest.length > 0)
		return false;
	if (!link || !isLink(link))
		return false;

	const [linkText, ...linkRest] = link.children;
	if (linkRest.length > 0)
		return false;
	if (!linkText || !isText(linkText))
		return false;

	if (!/^https?:\/\//u.test(linkText.value))
		return false;

	return link.url === linkText.value;
}

declare module "mdast" {
	interface RootContentMap {
		"link-card": LinkCard;
	}
}
