import type { Literal, Paragraph, Root } from "mdast";
import { isLink, isParagraph, isParent, isText } from "mdast-utils";
import { hasLength } from "ts-array-length";
import type { Plugin } from "unified";
import type { Node, Parent } from "unist";
import { visit } from "unist-util-visit";

class UnreachableError extends Error {
  public constructor() {
    super();
    this.name = "UnreachableError";
  }
}

type Embed = {
  type: "embed";
} & Literal;

export const remarkEmbed: Plugin<never[], Root> = () => (tree) => {
  visit(tree, isEmbed, visitor);
};

function visitor(
  node: Paragraph,
  idx: number | null,
  parent: Parent | null,
): void {
  if (!isParent(parent) || idx === null) throw new UnreachableError();

  const link = node.children[0];
  if (!isLink(link)) throw new UnreachableError();

  const { url } = link;

  const embed: Embed = {
    type: "embed",
    value: url,
  };
  parent.children[idx] = embed;
}

function isEmbed(node: Node): node is Paragraph {
  if (!isParagraph(node)) return false;

  const { children: paragraphChildren } = node;
  if (!hasLength(paragraphChildren, 1)) return false;

  const [paragraphChild] = paragraphChildren;
  if (!isLink(paragraphChild)) return false;

  const { children: linkChildren, url } = paragraphChild;
  if (!hasLength(linkChildren, 1)) return false;

  const [linkChild] = linkChildren;
  if (!isText(linkChild)) return false;

  const { value: text } = linkChild;

  return text === url && /^https?:\/\//u.test(url);
}

declare module "mdast" {
  interface BlockContentMap {
    embed: Embed;
  }
}

if (import.meta.vitest) {
  const { default: endent } = await import("endent");
  const { default: remarkGfm } = await import("remark-gfm");
  const { default: remarkParse } = await import("remark-parse");
  const { unified } = await import("unified");
  const { u } = await import("unist-builder");
  const { describe, expect, test } = import.meta.vitest;
  const { remarkRemovePosition } = await import("remark-remove-position");

  describe("remarkEmbed", () => {
    test("When the URL and text are same (from AST)", () => {
      const transformer = unified().use(remarkEmbed).freeze();
      const ast: Root = u("root", [
        u("paragraph", [
          u("link", { url: "https://example.com" }, [
            u("text", "https://example.com"),
          ]),
        ]),
      ]);

      const result = transformer.runSync(ast);
      expect(result).toEqual(u("root", [u("embed", "https://example.com")]));
    });

    test("When the URL and text are different (from AST)", () => {
      const transformer = unified().use(remarkEmbed).freeze();
      const ast: Root = u("root", [
        u("paragraph", [
          u("link", { url: "https://example.com" }, [u("text", "example")]),
        ]),
      ]);

      const result = transformer.runSync(ast);
      expect(result).toEqual(ast);
    });

    test("When the URL and text are same (from Markdown)", () => {
      const transformer = unified()
        .use(remarkParse)
        .use(remarkGfm)
        .use(remarkRemovePosition)
        .use(remarkEmbed)
        .freeze();

      const markdown = endent`
      https://example.com
    `;

      const result = transformer.runSync(transformer.parse(markdown));
      expect(result).toEqual(u("root", [u("embed", "https://example.com")]));
    });
  });
}
