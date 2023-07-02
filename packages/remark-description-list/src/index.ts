import { hasMinLength } from "ts-array-length";
import { isList, isListItem, isParagraph, isParent, isText } from "mdast-utils";
import { visit } from "unist-util-visit";
import type {
  BlockContent,
  DefinitionContent,
  List,
  ListItem,
  Parent,
  PhrasingContent,
  Root,
} from "mdast";
import type { Plugin } from "unified";
import type { Node, Parent as UnistParent } from "unist";

class UnreachableError extends Error {
  constructor() {
    super();
    this.name = "UnreachableError";
  }
}

type DescriptionList = {
  type: "descriptionList";
  children: Array<DescriptionListContent>;
} & Parent;

type DescriptionTerm = {
  type: "descriptionTerm";
  children: Array<PhrasingContent>;
} & Parent;

type DescriptionDescription = {
  type: "descriptionDescription";
  children: Array<BlockContent | DefinitionContent>;
} & Parent;

type DescriptionListContent = DescriptionTerm | DescriptionDescription;

const isDescriptionTerm = (node: Node): node is ListItem => {
  if (!isListItem(node)) return false;
  const { children: listItemChildren } = node;
  if (!hasMinLength(listItemChildren, 1)) return false;
  const [term, description] = listItemChildren;
  if (!isParagraph(term)) return false;
  if (description && !isList(description)) return false;
  const termLastChild = term.children.at(-1);
  if (!isText(termLastChild)) return false;
  const termLastChildText = termLastChild.value;

  return termLastChildText.endsWith(":") && !termLastChildText.endsWith("\\:");
};

const isDescription = (node: Node): node is List => {
  if (!isList(node)) return false;
  const { children: listChildren } = node;

  return listChildren.every(isDescriptionTerm);
};

const convertListItemToDescriptionDescription = (
  node: ListItem,
): DescriptionDescription => {
  return {
    type: "descriptionDescription",
    children: node.children,
  };
};

const convertListItemToDescriptionListContent = (
  node: ListItem,
): Array<DescriptionListContent> => {
  const { children: listItemChildren } = node;
  const [term, description] = listItemChildren;
  if (!isParagraph(term)) throw new UnreachableError();
  if (description && !isList(description)) throw new UnreachableError();
  const termLastChild = term.children.at(-1);
  if (!isText(termLastChild)) throw new UnreachableError();
  termLastChild.value = termLastChild.value.slice(0, -1);
  const descriptionTerm: DescriptionTerm = {
    type: "descriptionTerm",
    children: term.children,
  };
  const descriptionDescriptions: Array<DescriptionDescription> = (
    description?.children ?? []
  ).map(convertListItemToDescriptionDescription);

  return [descriptionTerm, ...descriptionDescriptions];
};

const visitor = (
  node: List,
  idx: number | null,
  parent: UnistParent | null,
): void => {
  if (!isParent(parent) || idx === null) throw new UnreachableError();
  const { children: listChildren } = node;
  const descriptionListChildren = listChildren.flatMap(
    convertListItemToDescriptionListContent,
  );
  const descriptionList: DescriptionList = {
    type: "descriptionList",
    children: descriptionListChildren,
  };
  parent.children[idx] = descriptionList;
};

export const remarkDescriptionList: Plugin<Array<never>, Root> = () => {
  return (tree) => {
    visit(tree, isDescription, visitor);
  };
};

declare module "mdast" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface BlockContentMap {
    descriptionList: DescriptionList;
  }

  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface DefinitionContentMap {
    descriptionTerm: DescriptionTerm;
    descriptionDescription: DescriptionDescription;
  }
}

if (import.meta.vitest) {
  const { default: endent } = await import("endent");
  const { default: remarkParse } = await import("remark-parse");
  const { unified } = await import("unified");
  const { u } = await import("unist-builder");
  const { describe, expect, test } = import.meta.vitest;
  const { remarkRemovePosition } = await import("remark-remove-position");

  describe("remarkDescriptionList", () => {
    test("When a description list is found (fron AST)", () => {
      const transformer = unified().use(remarkDescriptionList).freeze();
      const ast: Root = u("root", [
        u("list", [
          u("listItem", [
            u("paragraph", [u("text", "term 1:")]),
            u("list", [
              u("listItem", [
                u("paragraph", [
                  u("text", "definition 1"),
                  u("text", "definition 2"),
                ]),
              ]),
            ]),
          ]),
          u("listItem", [
            u("paragraph", [u("text", "term 2:")]),
            u("list", [
              u("listItem", [u("paragraph", [u("text", "definition 3")])]),
            ]),
          ]),
        ]),
      ]);

      const result = transformer.runSync(ast);
      expect(result).toEqual(
        u("root", [
          u("descriptionList", [
            u("descriptionTerm", [u("text", "term 1")]),
            u("descriptionDescription", [
              u("paragraph", [
                u("text", "definition 1"),
                u("text", "definition 2"),
              ]),
            ]),
            u("descriptionTerm", [u("text", "term 2")]),
            u("descriptionDescription", [
              u("paragraph", [u("text", "definition 3")]),
            ]),
          ]),
        ]),
      );
    });

    test("When a description list is not found (from AST)", () => {
      const transformer = unified().use(remarkDescriptionList).freeze();
      const ast: Root = u("root", [
        u("list", [
          u("listItem", [
            u("paragraph", [u("text", "term 1:")]),
            u("list", [
              u("listItem", [
                u("paragraph", [
                  u("text", "definition 1"),
                  u("text", "definition 2"),
                ]),
              ]),
            ]),
          ]),
          u("listItem", [
            u("paragraph", [u("text", "term 2")]),
            u("list", [
              u("listItem", [u("paragraph", [u("text", "definition 3")])]),
            ]),
          ]),
        ]),
      ]);

      const result = transformer.runSync(ast);
      expect(result).toEqual(
        u("root", [
          u("list", [
            u("listItem", [
              u("paragraph", [u("text", "term 1:")]),
              u("list", [
                u("listItem", [
                  u("paragraph", [
                    u("text", "definition 1"),
                    u("text", "definition 2"),
                  ]),
                ]),
              ]),
            ]),
            u("listItem", [
              u("paragraph", [u("text", "term 2")]),
              u("list", [
                u("listItem", [u("paragraph", [u("text", "definition 3")])]),
              ]),
            ]),
          ]),
        ]),
      );
    });

    test("When a link ref is found (from Markdown)", () => {
      const transformer = unified()
        .use(remarkParse)
        .use(remarkRemovePosition)
        .use(remarkDescriptionList)
        .freeze();

      const markdown = endent`
      - term 1:
        - definition 1
        - definition 2
      - term 2:
        - definition 3
    `;

      const result = transformer.runSync(transformer.parse(markdown));
      expect(result).toEqual(
        u("root", [
          u("descriptionList", [
            u("descriptionTerm", [u("text", "term 1")]),
            u("descriptionDescription", [
              u("paragraph", [u("text", "definition 1")]),
            ]),
            u("descriptionDescription", [
              u("paragraph", [u("text", "definition 2")]),
            ]),
            u("descriptionTerm", [u("text", "term 2")]),
            u("descriptionDescription", [
              u("paragraph", [u("text", "definition 3")]),
            ]),
          ]),
        ]),
      );
    });
  });
}
