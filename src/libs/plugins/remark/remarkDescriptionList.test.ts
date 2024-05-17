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
			type: "descriptionList",
			children: [
				{
					type: "descriptionTerm",
					children: [
						{
							type: "text",
							value: "term 1",
							position: {
								start: { line: 1, column: 3, offset: 2 },
								end: { line: 1, column: 9, offset: 8 },
							},
						},
					],
					position: {
						start: { line: 1, column: 1, offset: 0 },
						end: { line: 1, column: 10, offset: 9 },
					},
				},
				{
					type: "descriptionDetails",
					children: [
						{
							type: "paragraph",
							children: [
								{
									type: "text",
									value: "details 1",
									position: {
										start: { line: 2, column: 4, offset: 13 },
										end: { line: 2, column: 13, offset: 22 },
									},
								},
							],
							position: {
								start: { line: 2, column: 4, offset: 13 },
								end: { line: 2, column: 13, offset: 22 },
							},
						},
					],
					position: {
						start: { line: 2, column: 2, offset: 11 },
						end: { line: 2, column: 13, offset: 22 },
					},
				},
				{
					type: "descriptionDetails",
					children: [
						{
							type: "paragraph",
							children: [
								{
									type: "text",
									value: "details 2",
									position: {
										start: { line: 3, column: 4, offset: 26 },
										end: { line: 3, column: 13, offset: 35 },
									},
								},
							],
							position: {
								start: { line: 3, column: 4, offset: 26 },
								end: { line: 3, column: 13, offset: 35 },
							},
						},
					],
					position: {
						start: { line: 3, column: 2, offset: 24 },
						end: { line: 3, column: 13, offset: 35 },
					},
				},
				{
					type: "descriptionTerm",
					children: [
						{
							type: "text",
							value: "term 2",
							position: {
								start: { line: 4, column: 3, offset: 38 },
								end: { line: 4, column: 9, offset: 44 },
							},
						},
					],
					position: {
						start: { line: 4, column: 1, offset: 36 },
						end: { line: 4, column: 10, offset: 45 },
					},
				},
				{
					type: "descriptionDetails",
					children: [
						{
							type: "paragraph",
							children: [
								{
									type: "text",
									value: "details 3",
									position: {
										start: { line: 5, column: 4, offset: 49 },
										end: { line: 5, column: 13, offset: 58 },
									},
								},
							],
							position: {
								start: { line: 5, column: 4, offset: 49 },
								end: { line: 5, column: 13, offset: 58 },
							},
						},
					],
					position: {
						start: { line: 5, column: 2, offset: 47 },
						end: { line: 5, column: 13, offset: 58 },
					},
				},
			],
			position: {
				start: { line: 1, column: 1, offset: 0 },
				end: { line: 5, column: 13, offset: 58 },
			},
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
			type: "descriptionList",
			children: [
				{
					type: "descriptionTerm",
					children: [
						{
							type: "text",
							value: "term 1",
							position: {
								start: { line: 1, column: 3, offset: 2 },
								end: { line: 1, column: 9, offset: 8 },
							},
						},
					],
					position: {
						start: { line: 1, column: 1, offset: 0 },
						end: { line: 1, column: 10, offset: 9 },
					},
				},
				{
					type: "descriptionTerm",
					children: [
						{
							type: "text",
							value: "term 2",
							position: {
								start: { line: 2, column: 3, offset: 12 },
								end: { line: 2, column: 9, offset: 18 },
							},
						},
					],
					position: {
						start: { line: 2, column: 1, offset: 10 },
						end: { line: 2, column: 10, offset: 19 },
					},
				},
				{
					type: "descriptionDetails",
					children: [
						{
							type: "paragraph",
							children: [
								{
									type: "text",
									value: "details 1",
									position: {
										start: { line: 3, column: 4, offset: 23 },
										end: { line: 3, column: 13, offset: 32 },
									},
								},
							],
							position: {
								start: { line: 3, column: 4, offset: 23 },
								end: { line: 3, column: 13, offset: 32 },
							},
						},
					],
					position: {
						start: { line: 3, column: 2, offset: 21 },
						end: { line: 3, column: 13, offset: 32 },
					},
				},
				{
					type: "descriptionDetails",
					children: [
						{
							type: "paragraph",
							children: [
								{
									type: "text",
									value: "details 2",
									position: {
										start: { line: 4, column: 4, offset: 36 },
										end: { line: 4, column: 13, offset: 45 },
									},
								},
							],
							position: {
								start: { line: 4, column: 4, offset: 36 },
								end: { line: 4, column: 13, offset: 45 },
							},
						},
					],
					position: {
						start: { line: 4, column: 2, offset: 34 },
						end: { line: 4, column: 13, offset: 45 },
					},
				},
			],
			position: {
				start: { line: 1, column: 1, offset: 0 },
				end: { line: 4, column: 13, offset: 45 },
			},
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
