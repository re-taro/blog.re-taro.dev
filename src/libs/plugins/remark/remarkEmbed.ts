import type * as M from "mdast";
import type { Extension } from "mdast-util-from-markdown";
import type { Plugin } from "unified";

import { isLink, isParagraph, isText } from "./check";
import { visit } from "./visit";

export interface Embed extends M.Node {
	type: "embed";
	src: string;
	width?: string | undefined;
	height?: string | undefined;
	allowFullScreen?: boolean | undefined;
	oembed: boolean;
}

export const remarkEmbed: Plugin = function () {
	const data = this.data();

	data.fromMarkdownExtensions ??= [];
	data.fromMarkdownExtensions.push(embed());
};

function embed(): Extension {
	const transformer = (tree: M.Root) => {
		visit(tree, isEmbedLike, (node, idx, parent) => {
			if (idx === undefined || !parent)
				return;

			if (parent.type !== "root")
				return;

			const [link] = node.children;

			const url = new URL(link.url);
			if (url.hostname === "www.youtube.com") {
				const convertToEmbedUrl = (url: string): string => {
					const regExp = /^.*(watch\?v=|embed\/)([^#&?]*).*/;
					const match = url.match(regExp);

					if (match && match[2])
						return `https://www.youtube.com/embed/${match[2]}`;
					else
						throw new Error("Invalid YouTube URL");
				};

				const embed: Embed = {
					type: "embed",
					position: node.position,
					src: convertToEmbedUrl(url.href),
					width: "100%",
					height: "360",
					oembed: false,
				};

				parent.children[idx] = embed;
			}
			else if (url.hostname === "docs.google.com" && url.pathname.startsWith("/presentation/d/")) {
				const getEmbedUrl = (isWeb: boolean) => {
					const path = url.pathname.split("/");

					if (isWeb) {
						// [ファイル] > [共有] > [ウェブに公開] で生成されたリンクである場合は、そのまま埋め込み用のURLを返す
						// e.g. https://docs.google.com/presentation/d/e/XXXXXXXX/pub -> https://docs.google.com/presentation/d/e/XXXXXXXX/embed
						path[path.length - 1] = "embed";
						return new URL(path.join("/"), url.origin);
					}

					if (path.length <= 3) {
						// URLの末尾がpresentation IDで終わっている場合は、末尾にembedを追加する
						// e.g. https://docs.google.com/presentation/d/XXXXXXXX/ -> https://docs.google.com/presentation/d/XXXXXXXX/embed
						path.push("embed");
					}
					else {
						// URLの末尾が`/edit`など、presentation ID以外で終わっている場合は、末尾をembedに置き換える
						// e.g. https://docs.google.com/presentation/d/XXXXXXXX/edit -> https://docs.google.com/presentation/d/XXXXXXXX/embed
						path[path.length - 1] = "embed";
					}
					return new URL(path.join("/"), url.origin);
				};

				// [ファイル] > [共有] > [ウェブに公開] で生成されたリンクであるかどうか
				const isWeb = url.pathname.startsWith("/presentation/d/e/");

				const embed: Embed = {
					type: "embed",
					position: node.position,
					src: getEmbedUrl(isWeb).href,
					width: "100%",
					allowFullScreen: true,
					oembed: false,
				};

				parent.children[idx] = embed;
			}
			else {
				const embed: Embed = {
					type: "embed",
					position: node.position,
					src: url.href,
					oembed: true,
				};

				parent.children[idx] = embed;
			}
		});
	};

	return {
		transforms: [transformer],
	};
}

interface EmbedLike extends M.Paragraph {
	children: [M.Link];
}

function isEmbedLike(node: M.Node): node is EmbedLike {
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
		embed: Embed;
	}
}
