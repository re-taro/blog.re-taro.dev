import type {
  Content,
  Definition,
  Image,
  ImageReference,
  Link,
  LinkReference,
  Root,
  StaticPhrasingContent,
  Text,
} from "mdast";
import { compact } from "mdast-util-compact";
import {
  isDefinition,
  isImageReference,
  isLinkReference,
  isParent,
} from "mdast-utils";
import type { Plugin } from "unified";
import type { Visitor } from "unist-util-visit";
import { visit } from "unist-util-visit";

class UnreachableError extends Error {
  public constructor() {
    super();
    this.name = "UnreachableError";
  }
}

const definitionVisitorBuilder =
  (definitionMap: Map<string, Definition>): Visitor<Definition> =>
  (node, idx, parent) => {
    if (!isParent(parent) || idx === null) throw new UnreachableError();
    definitionMap.set(node.identifier, node);
    parent.children.splice(idx, 1);
  };

const linkReferenceVisitorBuilder =
  (definitionMap: Map<string, Definition>): Visitor<LinkReference> =>
  (node, idx, parent) => {
    if (!isParent(parent) || idx === null) throw new UnreachableError();
    const definition = definitionMap.get(node.identifier);
    if (!definition) {
      const nodes: StaticPhrasingContent[] = [
        { type: "text", value: "[" },
        ...node.children,
        { type: "text", value: "]" },
        { type: "text", value: `[${node.identifier}]` },
      ];
      parent.children.splice(idx, 1, ...nodes);
      compact(parent as Root | Content);

      return;
    }

    const link: Link = {
      type: "link",
      url: definition.url,
      title: definition.title,
      children: node.children,
    };
    parent.children[idx] = link;
  };

const imageReferenceVisitorBuilder =
  (definitionMap: Map<string, Definition>): Visitor<ImageReference> =>
  (node, idx, parent) => {
    if (!isParent(parent) || idx === null) throw new UnreachableError();
    const definition = definitionMap.get(node.identifier);
    if (!definition) {
      const text: Text = {
        type: "text",
        value: `![${node.alt ?? ""}][${node.identifier}]`,
      };
      parent.children[idx] = text;
      compact(parent as Root | Content);

      return;
    }

    const image: Image = {
      type: "image",
      alt: node.alt,
      url: definition.url,
      title: definition.title,
    };
    parent.children[idx] = image;
  };

export const remarkResolveReference: Plugin<never[], Root> = () => (tree) => {
  const definitionMap = new Map<string, Definition>();

  const definitionVisitor = definitionVisitorBuilder(definitionMap);
  const linkReferenceVisitor = linkReferenceVisitorBuilder(definitionMap);
  const imageReferenceVisitor = imageReferenceVisitorBuilder(definitionMap);

  visit(tree, isDefinition, definitionVisitor);
  visit(tree, isLinkReference, linkReferenceVisitor);
  visit(tree, isImageReference, imageReferenceVisitor);
};

if (import.meta.vitest) {
  const { describe, expect, test } = import.meta.vitest;
  const { default: endent } = await import("endent");
  const { default: remarkParse } = await import("remark-parse");
  const { unified } = await import("unified");
  const { u } = await import("unist-builder");
  const { remarkRemovePosition } = await import("remark-remove-position");

  describe("remarkResolveReference", () => {
    test("When a link ref is found (fron AST)", () => {
      const transformer = unified().use(remarkResolveReference).freeze();
      const ast: Root = u("root", [
        u("paragraph", [
          u(
            "linkReference",
            { identifier: "example", referenceType: "full" as const },
            [u("text", "example site")],
          ),
        ]),
        u("definition", { identifier: "example", url: "https://example.com" }),
      ]);

      const result = transformer.runSync(ast);
      expect(result).toEqual(
        u("root", [
          u("paragraph", [
            u("link", { url: "https://example.com" }, [
              u("text", "example site"),
            ]),
          ]),
        ]),
      );
    });

    test("When a link ref is not found (from AST)", () => {
      const transformer = unified().use(remarkResolveReference).freeze();
      const ast: Root = u("root", [
        u("paragraph", [
          u(
            "linkReference",
            { identifier: "example", referenceType: "full" as const },
            [u("text", "example site")],
          ),
        ]),
        u("definition", { identifier: "invalid", url: "https://example.com" }),
      ]);

      const result = transformer.runSync(ast);
      expect(result).toEqual(
        u("root", [u("paragraph", [u("text", "[example site][example]")])]),
      );
    });

    test("When a link ref is found (from Markdown)", () => {
      const transformer = unified()
        .use(remarkParse)
        .use(remarkRemovePosition)
        .use(remarkResolveReference)
        .freeze();

      const markdown = endent`
        [example site][example]

        [example]: https://example.com
      `;

      const result = transformer.runSync(transformer.parse(markdown));
      expect(result).toEqual(
        u("root", [
          u("paragraph", [
            u("link", { url: "https://example.com", title: null }, [
              u("text", "example site"),
            ]),
          ]),
        ]),
      );
    });
  });
}
