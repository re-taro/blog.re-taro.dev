import type * as M from 'mdast';

export const isParagraph = (node?: M.Node | null): node is M.Paragraph => {
	return node != null && node.type === 'paragraph';
};

export const isLink = (node?: M.Node | null): node is M.Link => {
	return node != null && node.type === 'link';
};

export const isText = (node?: M.Node | null): node is M.Text => {
	return node != null && node.type === 'text';
};

export const isFootnoteDefinition = (node: M.Node): node is M.FootnoteDefinition => {
	return node.type === 'footnoteDefinition';
};

export const isList = (node: M.Node): node is M.List => {
	return node.type === 'list';
};

export const isListItem = (node: M.Node): node is M.ListItem => {
	return node.type === 'listItem';
};
