import { findNodeAfter, isHeadingOfDepth } from "mdast-utils";
import type { Content, Heading, Parent, Root } from "mdast";
import type { Plugin } from "unified";

type Section = {
  type: "section";
  children: [Heading, ...Array<Content>];
} & Parent;

export const remarkSection: Plugin<Array<never>, Root> = () => {
  return (tree) => {
    process(tree, 1);
  };
};

function process(tree: Parent, depth: number): void {
  if (depth > 6) return;

  let index = 0;
  while (index < tree.children.length) {
    const [startHeading, startHeadingIdx] = findNodeAfter(
      tree,
      index,
      isHeadingOfDepth(depth),
    );
    if (!startHeading) break;

    const [, endHeadingIdx] = findNodeAfter(
      tree,
      startHeadingIdx + 1,
      isHeadingOfDepth(depth),
    );

    const section: Section = {
      type: "section",
      children: [
        startHeading,
        ...tree.children.slice(startHeadingIdx + 1, endHeadingIdx),
      ],
    };
    process(section, depth + 1);
    tree.children.splice(
      startHeadingIdx,
      (endHeadingIdx ?? tree.children.length) - startHeadingIdx,
      section,
    );

    index = startHeadingIdx + 1;
  }
}

declare module "mdast" {
  // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
  interface BlockContentMap {
    section: Section;
  }
}

if (import.meta.vitest) {
  const { default: endent } = await import("endent");
  const { default: remarkParse } = await import("remark-parse");
  const { unified } = await import("unified");
  const { u } = await import("unist-builder");
  const { describe, expect, test } = import.meta.vitest;
  const { remarkRemovePosition } = await import("remark-remove-position");

  describe("remarkSection", () => {
    test("When two heading is found (from AST)", () => {
      const transformer = unified().use(remarkSection).freeze();
      const ast: Root = u("root", [
        u("paragraph", [u("text", "Paragraph 1")]),
        u("paragraph", [u("text", "Paragraph 2")]),
        u("heading", { depth: 1 as const }, [u("text", "Heading 1")]),
        u("paragraph", [u("text", "Paragraph 3")]),
        u("heading", { depth: 1 as const }, [u("text", "Heading 2")]),
        u("paragraph", [u("text", "Paragraph 4")]),
        u("paragraph", [u("text", "Paragraph 5")]),
      ]);

      const result = transformer.runSync(ast);

      expect(result).toEqual(
        u("root", [
          u("paragraph", [u("text", "Paragraph 1")]),
          u("paragraph", [u("text", "Paragraph 2")]),
          u("section", [
            u("heading", { depth: 1 as const }, [u("text", "Heading 1")]),
            u("paragraph", [u("text", "Paragraph 3")]),
          ]),
          u("section", [
            u("heading", { depth: 1 as const }, [u("text", "Heading 2")]),
            u("paragraph", [u("text", "Paragraph 4")]),
            u("paragraph", [u("text", "Paragraph 5")]),
          ]),
        ]),
      );
    });

    test("When nested heading is found (from AST)", () => {
      const transformer = unified().use(remarkSection).freeze();
      const ast: Root = u("root", [
        u("heading", { depth: 1 as const }, [u("text", "Heading 1")]),
        u("paragraph", [u("text", "Paragraph 1")]),
        u("heading", { depth: 2 as const }, [u("text", "Heading 2")]),
        u("paragraph", [u("text", "Paragraph 2")]),
        u("paragraph", [u("text", "Paragraph 3")]),
      ]);

      const result = transformer.runSync(ast);

      expect(result).toEqual(
        u("root", [
          u("section", [
            u("heading", { depth: 1 as const }, [u("text", "Heading 1")]),
            u("paragraph", [u("text", "Paragraph 1")]),
            u("section", [
              u("heading", { depth: 2 as const }, [u("text", "Heading 2")]),
              u("paragraph", [u("text", "Paragraph 2")]),
              u("paragraph", [u("text", "Paragraph 3")]),
            ]),
          ]),
        ]),
      );
    });

    test("When nested heading is found (from AST)", () => {
      const transformer = unified()
        .use(remarkParse)
        .use(remarkRemovePosition)
        .use(remarkSection)
        .freeze();
      const markdown = endent`
      # Heading 1

      Paragraph 1

      ## Heading 2

      Paragraph 2

      Paragraph 3
    `;

      const result = transformer.runSync(transformer.parse(markdown));

      expect(result).toEqual(
        u("root", [
          u("section", [
            u("heading", { depth: 1 as const }, [u("text", "Heading 1")]),
            u("paragraph", [u("text", "Paragraph 1")]),
            u("section", [
              u("heading", { depth: 2 as const }, [u("text", "Heading 2")]),
              u("paragraph", [u("text", "Paragraph 2")]),
              u("paragraph", [u("text", "Paragraph 3")]),
            ]),
          ]),
        ]),
      );
    });
  });
}
