import type * as M from "mdast";
import type { Extension } from "mdast-util-from-markdown";
import type { Plugin } from "unified";
import type { Position } from "unist";

import { unreachable } from "../error";
import { addColumn } from "./point";
import { isList, isListItem, isParagraph, isText } from "./check";
import { visit } from "./visit";

export interface DescriptionList extends M.Parent {
	children: Array<DescriptionContent>;
	type: "descriptionList";
}

export interface DescriptionTerm extends M.Parent {
	children: Array<M.PhrasingContent>;
	type: "descriptionTerm";
}

export interface DescriptionDetails extends M.Parent {
	children: Array<M.BlockContent | M.DefinitionContent>;
	type: "descriptionDetails";
}

export interface DescriptionContentMap {
	descriptionDetails: DescriptionDetails;
	descriptionTerm: DescriptionTerm;
}
export type DescriptionContent =
  DescriptionContentMap[keyof DescriptionContentMap];

export const remarkDescriptionList: Plugin = function () {
	const data = this.data();

	data.fromMarkdownExtensions ??= [];
	data.fromMarkdownExtensions.push(descriptionList());
};

function descriptionList(): Extension {
	const transformer = (tree: M.Root) => {
		visit(tree, isDescriptionListLike, (node, idx, parent) => {
			if (idx === undefined || !parent)
				unreachable();

			const descriptionChildren = node.children.flatMap((listItem) => {
				const [termLike, ...detailsLikeList] = listItem.children;

				const termLikeLastChild = termLike.children.at(-1) as M.Text;
				// termの最後の文字`:`を削除
				termLikeLastChild.value = termLikeLastChild.value.slice(0, -1);
				// termの最後のtextの位置情報を更新
				termLikeLastChild.position = termLikeLastChild.position
					? {
							end: addColumn(termLikeLastChild.position.end, -1),
							start: termLikeLastChild.position.start,
						}
					: undefined;
				// termの最後のtextが空文字列になった場合は削除
				if (termLikeLastChild.value.length === 0)
					termLike.children.pop();

				const termPosition: Position | undefined
				= listItem.position && termLike.position
					? {
							end: termLike.position.end,
							start: listItem.position.start,
						}
					: undefined;

				const descriptionTerm: DescriptionTerm = {
					children: termLike.children,
					position: termPosition,
					type: "descriptionTerm",
				};

				const descriptionDetails: Array<DescriptionDetails> = detailsLikeList
					.flatMap(details => details.children)
					.map((details) => {
						return {
							children: details.children,
							position: details.position,
							type: "descriptionDetails",
						};
					});

				return [descriptionTerm, ...descriptionDetails];
			});

			const descriptionList: DescriptionList = {
				children: descriptionChildren,
				position: node.position,
				type: "descriptionList",
			};

			parent.children[idx] = descriptionList;
		});
	};

	return {
		transforms: [transformer],
	};
}

interface DescriptionListLike extends M.List {
	children: Array<DescriptionTermLike>;
	ordered: false;
}

interface DescriptionTermLike extends M.ListItem {
	children: [DescriptionTermLikeParagraph, ...Array<M.List>];
}

interface DescriptionTermLikeParagraph extends M.Paragraph {
	children: [...Array<M.PhrasingContent>, DescriptionTermLikeParagraphText];
}

interface DescriptionTermLikeParagraphText extends M.Text {
	value: `${string}:`;
}

function isDescriptionListLike(node: M.Node): node is DescriptionListLike {
	if (!isList(node))
		return false;
	if (node.ordered ?? true)
		return false;

	if (!node.children.every(isDescriptionTermLike))
		return false;

	// 最後の要素はdetailsを1つ以上持っている必要がある(dtで終わることはない)
	const lastChild = node.children.at(-1);
	if (!lastChild)
		return false;

	const [_term, ...details] = lastChild.children;
	if (details.length === 0)
		return false;

	return true;
}

function isDescriptionTermLike(node: M.Node): node is DescriptionTermLike {
	if (!isListItem(node))
		return false;

	const [term, ...detailsList] = node.children;
	if (!term || !isParagraph(term))
		return false;
	if (!detailsList.every(l => isList(l) && !(l.ordered ?? true)))
		return false;

	const termLastChild = term.children.at(-1);
	if (!termLastChild || !isText(termLastChild))
		return false;

	const termLastChildText = termLastChild.value;
	return termLastChildText.endsWith(":") && !termLastChildText.endsWith("\\:");
}

declare module "mdast" {
	interface RootContentMap {
		descriptionDetails: DescriptionDetails;
		descriptionList: DescriptionList;
		descriptionTerm: DescriptionTerm;
	}

	interface BlockContentMap {
		descriptionList: DescriptionList;
	}
}
