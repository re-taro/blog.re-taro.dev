import { dedent } from "@qnighy/dedent";
import type { List, RootContent } from "mdast";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { describe, expect, it } from "vitest";

import { remarkLinkCard } from "./remarkLinkCard";

describe("remarkLinkCard", () => {
	it("when the URL and text are same (from Markdown)", () => {
		const transformer = unified()
			.use(remarkParse)
			.use(remarkGfm)
			.use(remarkLinkCard)
			.freeze();

		const markdown = dedent`\
      https://example.com
    `;

		const result = transformer.runSync(transformer.parse(markdown).children[0]);
		const expected = {
			type: "link-card",
			value: "https://example.com",
			position: {
				start: { line: 1, column: 1, offset: 0 },
				end: { line: 1, column: 20, offset: 19 },
			},
		} satisfies RootContent;

		expect(result).toStrictEqual(expected);
	});
	it("should not transform `link` to `embed` if parent is not `root`", () => {
		const transformer = unified()
			.use(remarkParse)
			.use(remarkGfm)
			.use(remarkLinkCard)
			.freeze();

		const markdown = dedent`\
      - https://example.com
    `;

		const result = transformer.runSync(transformer.parse(markdown).children[0]) as List;

		expect(result.children[0].type).not.toBe("link-card");
	});
});
