import type {
  Definition,
  FootnoteDefinition,
  FootnoteReference,
  Heading,
  Image,
  ImageReference,
  Link,
  LinkReference,
  List,
  ListItem,
  Paragraph,
  Parent,
  Text,
  YAML,
} from "mdast";
import type { Node } from "unist";

export function findNodeAfter<T extends Node>(
  tree: Parent,
  after: number,
  predicate: (node: Node) => node is T,
): [T, number] | [undefined, undefined] {
  const idx = tree.children.slice(after).findIndex(predicate);
  if (idx === -1) return [undefined, undefined];
  const index = idx + after;

  return [tree.children[index] as T, index];
}

export const isParent = (node?: Node | null): node is Parent =>
  node != null && Object.hasOwn(node, "children");

export const isYAML = (node?: Node | null): node is YAML =>
  node != null && node.type === "yaml";

export const isHeading = (node?: Node | null): node is Heading =>
  node != null && node.type === "heading";

export const isHeadingOfDepth =
  (depth: number) =>
  (node?: Node | null): node is Heading =>
    isHeading(node) && node.depth === depth;

export const isParagraph = (node?: Node | null): node is Paragraph =>
  node != null && node.type === "paragraph";

export const isList = (node?: Node | null): node is List =>
  node != null && node.type === "list";

export const isListItem = (node?: Node | null): node is ListItem =>
  node != null && node.type === "listItem";

export const isText = (node?: Node | null): node is Text =>
  node != null && node.type === "text";

export const isLink = (node?: Node | null): node is Link =>
  node != null && node.type === "link";

export const isImage = (node?: Node | null): node is Image =>
  node != null && node.type === "image";

export const isLinkReference = (node?: Node | null): node is LinkReference =>
  node != null && node.type === "linkReference";

export const isImageReference = (node?: Node | null): node is ImageReference =>
  node != null && node.type === "imageReference";

export const isDefinition = (node?: Node | null): node is Definition =>
  node != null && node.type === "definition";

export const isFootnoteDefinition = (
  node?: Node | null,
): node is FootnoteDefinition =>
  node != null && node.type === "footnoteDefinition";

export const isFootnoteReference = (
  node?: Node | null,
): node is FootnoteReference =>
  node != null && node.type === "footnoteReference";
