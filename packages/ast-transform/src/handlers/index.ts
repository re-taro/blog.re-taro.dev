import { blockquote } from './blockquote';
import { hardBreak } from './break';
import { code } from './code';
import { strikethrough } from './delete';
import { emphasis } from './emphasis';
import { footnoteReference } from './footnoteReference';
import { heading } from './heading';
import { html } from './html';
import { image } from './image';
import { inlineCode } from './inlineCode';
import { link } from './link';
import { list } from './list';
import { listItem } from './listItem';
import { paragraph } from './paragraph';
import { strong } from './strong';
import { table } from './table';
import { tableCell } from './tableCell';
import { tableRow } from './tableRow';
import { text } from './text';
import { thematicBreak } from './thematicBreak';
import type { Handler, Handlers } from '..';
import type * as M from 'mdast';

const ignore: Handler<M.Node> = async (): Promise<undefined> => {
	// noop
};

export const defaultHandlers: Handlers = {
	blockquote,
	break: hardBreak,
	code,
	definition: ignore,
	delete: strikethrough,
	emphasis,
	footnoteDefinition: ignore,
	footnoteReference,
	heading,
	html,
	image,
	inlineCode,
	link,
	list,
	listItem,
	paragraph,
	strong,
	table,
	tableCell,
	tableRow,
	text,
	thematicBreak,
};
