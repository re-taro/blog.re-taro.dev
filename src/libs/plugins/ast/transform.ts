import type * as M from "mdast";
import type { Plugin } from "unified";
import GitHubSlugger from "github-slugger";

import { isFootnoteDefinition } from "../remark/check";
import { visit } from "../remark/visit";
import type * as A from "./ast";
import { defaultHandlers } from "./handlers";

export const astTransform: Plugin<
  Array<never>,
  M.Root,
  A.Root
> = function () {
	return async (tree) => {
		const additionalHandlers = this.data("astFromMdastHandlers") ?? {};
		const state = createState(tree, additionalHandlers);

		const children = await state.transformAll(tree);

		const footnotes = Array.from(state.astFootnoteDefinition.values()).sort(
			(a, b) => a.index - b.index,
		);

		const root: A.Root = {
			type: "root",
			footnotes,
			children,
			position: tree.position,
		};

		return root;
	};
};

interface State {
	transformOne: (node: M.Node) => Promise<A.Content | undefined>;
	transformAll: (node: M.Parent) => Promise<Array<A.Content>>;
	headingSlugger: GitHubSlugger;
	mdastFootnoteDefinition: Map<string, M.FootnoteDefinition>;
	astFootnoteDefinition: Map<string, A.FootnoteDefinition>;
}

export type Handler<T extends M.Node> = (
	node: T,
	state: State,
) => Promise<A.Content | undefined>;

export type Handlers = Record<string, Handler<any>>;

function createState(tree: M.Root, additionalHandlers: Handlers): State {
	const handlers: Handlers = { ...defaultHandlers, ...additionalHandlers };

	const transformOne = async (node: M.Node): Promise<A.Content | undefined> => {
		const handler = handlers[node.type];
		if (!handler)
			throw new Error(`Cannot handle node type: ${node.type}`);

		// eslint-disable-next-line ts/no-use-before-define
		return await handler(node, state);
	};

	const transformAll = async (node: M.Parent): Promise<Array<A.Content>> => {
		const results = await Promise.all(node.children.map(n => transformOne(n)));
		return results.filter((n): n is A.Content => n !== undefined);
	};

	const mdastFootnoteDefinition = new Map<string, M.FootnoteDefinition>();

	visit(tree, isFootnoteDefinition, (node) => {
		mdastFootnoteDefinition.set(node.identifier, node);
	});

	const state: State = {
		transformOne,
		transformAll,
		headingSlugger: new GitHubSlugger(),
		mdastFootnoteDefinition,
		astFootnoteDefinition: new Map(),
	};

	return state;
}

declare module "unified" {
	interface Data {
		astFromMdastHandlers?: Handlers;
	}
}
