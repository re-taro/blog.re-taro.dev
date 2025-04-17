import GitHubSlugger from 'github-slugger';
import { isFootnoteDefinition } from 'remark-check';
import { visit } from 'visit';
import { defaultHandlers } from './handlers';
import type * as A from 'ast';
import type * as M from 'mdast';
import type { Plugin } from 'unified';

export const astTransform: Plugin<never[], M.Root, A.Root> = function () {
	return async (tree) => {
		const additionalHandlers = this.data('astFromMdastHandlers') ?? {};
		const state = createState(tree, additionalHandlers);

		const children = await state.transformAll(tree);

		const footnotes = [...state.astFootnoteDefinition.values()].sort((a, b) => a.index - b.index);

		const root: A.Root = {
			children,
			footnotes,
			position: tree.position,
			type: 'root',
		};

		return root;
	};
};

interface State {
	astFootnoteDefinition: Map<string, A.FootnoteDefinition>;
	headingSlugger: GitHubSlugger;
	mdastFootnoteDefinition: Map<string, M.FootnoteDefinition>;
	transformAll: (node: M.Parent) => Promise<A.Content[]>;
	transformOne: (node: M.Node) => Promise<A.Content | undefined>;
}

export type Handler<T extends M.Node> = (node: T, state: State) => Promise<A.Content | undefined>;

// eslint-disable-next-line ts/no-explicit-any
export type Handlers = Record<string, Handler<any>>;

const createState = (tree: M.Root, additionalHandlers: Handlers): State => {
	const handlers: Handlers = { ...defaultHandlers, ...additionalHandlers };

	const transformOne = async (node: M.Node): Promise<A.Content | undefined> => {
		const handler = handlers[node.type];
		if (!handler) throw new Error(`Cannot handle node type: ${node.type}`);

		return await handler(node, state);
	};

	const transformAll = async (node: M.Parent): Promise<A.Content[]> => {
		const results: A.Content[] = [];

		for (const n of node.children) {
			const result = await transformOne(n);
			if (result !== undefined) results.push(result);
		}

		return results;
	};

	const mdastFootnoteDefinition = new Map<string, M.FootnoteDefinition>();

	visit(tree, isFootnoteDefinition, (node) => {
		mdastFootnoteDefinition.set(node.identifier, node);
	});

	const state: State = {
		astFootnoteDefinition: new Map(),
		headingSlugger: new GitHubSlugger(),
		mdastFootnoteDefinition,
		transformAll,
		transformOne,
	};

	return state;
};

declare module 'unified' {
	interface Data {
		astFromMdastHandlers?: Handlers;
	}
}
