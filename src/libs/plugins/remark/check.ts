import type * as M from "mdast";

export function isParagraph(node?: M.Node | null): node is M.Paragraph {
	return node != null && node.type === "paragraph";
}

export function isLink(node?: M.Node | null): node is M.Link {
	return node != null && node.type === "link";
}

export function isText(node?: M.Node | null): node is M.Text {
	return node != null && node.type === "text";
}

export function isFootnoteDefinition(
	node: M.Node,
): node is M.FootnoteDefinition {
	return node.type === "footnoteDefinition";
}

export function isList(node: M.Node): node is M.List {
	return node.type === "list";
}

export function isListItem(node: M.Node): node is M.ListItem {
	return node.type === "listItem";
}
