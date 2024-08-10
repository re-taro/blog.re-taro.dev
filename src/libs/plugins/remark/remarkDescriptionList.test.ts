import { dedent } from "@qnighy/dedent";
import remarkParse from "remark-parse";
import type { RootContent } from "mdast";
import { unified } from "unified";
import { describe, expect, it } from "vitest";

import { remarkDescriptionList } from "./remarkDescriptionList";

describe("remarkDescriptionList", () => {
	it("should transform `list` to `descriptionList`", () => {
		const transformer = unified()
			.use(remarkParse)
			.use(remarkDescriptionList)
			.freeze();

		const markdown = dedent`\
			- term 1:
				- details 1
				- details 2
			- term 2:
				- details 3
		`;

		const result = transformer.runSync(transformer.parse(markdown).children[0]);
		const expected = {
			children: [
				{
					children: [
						{
							position: {
								end: { column: 9, line: 1, offset: 8 },
								start: { column: 3, line: 1, offset: 2 },
							},
							type: "text",
							value: "term 1",
						},
					],
					position: {
						end: { column: 10, line: 1, offset: 9 },
						start: { column: 1, line: 1, offset: 0 },
					},
					type: "descriptionTerm",
				},
				{
					children: [
						{
							children: [
								{
									position: {
										end: { column: 13, line: 2, offset: 22 },
										start: { column: 4, line: 2, offset: 13 },
									},
									type: "text",
									value: "details 1",
								},
							],
							position: {
								end: { column: 13, line: 2, offset: 22 },
								start: { column: 4, line: 2, offset: 13 },
							},
							type: "paragraph",
						},
					],
					position: {
						end: { column: 13, line: 2, offset: 22 },
						start: { column: 2, line: 2, offset: 11 },
					},
					type: "descriptionDetails",
				},
				{
					children: [
						{
							children: [
								{
									position: {
										end: { column: 13, line: 3, offset: 35 },
										start: { column: 4, line: 3, offset: 26 },
									},
									type: "text",
									value: "details 2",
								},
							],
							position: {
								end: { column: 13, line: 3, offset: 35 },
								start: { column: 4, line: 3, offset: 26 },
							},
							type: "paragraph",
						},
					],
					position: {
						end: { column: 13, line: 3, offset: 35 },
						start: { column: 2, line: 3, offset: 24 },
					},
					type: "descriptionDetails",
				},
				{
					children: [
						{
							position: {
								end: { column: 9, line: 4, offset: 44 },
								start: { column: 3, line: 4, offset: 38 },
							},
							type: "text",
							value: "term 2",
						},
					],
					position: {
						end: { column: 10, line: 4, offset: 45 },
						start: { column: 1, line: 4, offset: 36 },
					},
					type: "descriptionTerm",
				},
				{
					children: [
						{
							children: [
								{
									position: {
										end: { column: 13, line: 5, offset: 58 },
										start: { column: 4, line: 5, offset: 49 },
									},
									type: "text",
									value: "details 3",
								},
							],
							position: {
								end: { column: 13, line: 5, offset: 58 },
								start: { column: 4, line: 5, offset: 49 },
							},
							type: "paragraph",
						},
					],
					position: {
						end: { column: 13, line: 5, offset: 58 },
						start: { column: 2, line: 5, offset: 47 },
					},
					type: "descriptionDetails",
				},
			],
			position: {
				end: { column: 13, line: 5, offset: 58 },
				start: { column: 1, line: 1, offset: 0 },
			},
			type: "descriptionList",
		} satisfies RootContent;

		expect(result).toStrictEqual(expected);
	});

	it("should transform `list` to `descriptionList` with multiple terms", () => {
		const transformer = unified()
			.use(remarkParse)
			.use(remarkDescriptionList)
			.freeze();

		const markdown = dedent`\
			- term 1:
			- term 2:
				- details 1
				- details 2
		`;

		const result = transformer.runSync(transformer.parse(markdown).children[0]);
		const expected = {
			children: [
				{
					children: [
						{
							position: {
								end: { column: 9, line: 1, offset: 8 },
								start: { column: 3, line: 1, offset: 2 },
							},
							type: "text",
							value: "term 1",
						},
					],
					position: {
						end: { column: 10, line: 1, offset: 9 },
						start: { column: 1, line: 1, offset: 0 },
					},
					type: "descriptionTerm",
				},
				{
					children: [
						{
							position: {
								end: { column: 9, line: 2, offset: 18 },
								start: { column: 3, line: 2, offset: 12 },
							},
							type: "text",
							value: "term 2",
						},
					],
					position: {
						end: { column: 10, line: 2, offset: 19 },
						start: { column: 1, line: 2, offset: 10 },
					},
					type: "descriptionTerm",
				},
				{
					children: [
						{
							children: [
								{
									position: {
										end: { column: 13, line: 3, offset: 32 },
										start: { column: 4, line: 3, offset: 23 },
									},
									type: "text",
									value: "details 1",
								},
							],
							position: {
								end: { column: 13, line: 3, offset: 32 },
								start: { column: 4, line: 3, offset: 23 },
							},
							type: "paragraph",
						},
					],
					position: {
						end: { column: 13, line: 3, offset: 32 },
						start: { column: 2, line: 3, offset: 21 },
					},
					type: "descriptionDetails",
				},
				{
					children: [
						{
							children: [
								{
									position: {
										end: { column: 13, line: 4, offset: 45 },
										start: { column: 4, line: 4, offset: 36 },
									},
									type: "text",
									value: "details 2",
								},
							],
							position: {
								end: { column: 13, line: 4, offset: 45 },
								start: { column: 4, line: 4, offset: 36 },
							},
							type: "paragraph",
						},
					],
					position: {
						end: { column: 13, line: 4, offset: 45 },
						start: { column: 2, line: 4, offset: 34 },
					},
					type: "descriptionDetails",
				},
			],
			position: {
				end: { column: 13, line: 4, offset: 45 },
				start: { column: 1, line: 1, offset: 0 },
			},
			type: "descriptionList",
		} satisfies RootContent;

		expect(result).toStrictEqual(expected);
	});

	it("should not transform `list` to `descriptionList` if last term has not details", () => {
		const transformer = unified()
			.use(remarkParse)
			.use(remarkDescriptionList)
			.freeze();

		const markdown = dedent`\
			- term 1:
				- details 1
			- term 2:
				- details 2
			- term 3:
		`;

		const result = transformer.runSync(transformer.parse(markdown).children[0]);

		expect(result.type).toBe("list");
	});
});
