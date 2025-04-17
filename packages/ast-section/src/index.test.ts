import { dedent } from '@qnighy/dedent';
import { astTransform } from 'ast-transform';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { describe, expect, it } from 'vitest';
import type * as A from 'ast';
import { astSection } from '.';

describe('astSection', () => {
	it('when nested heading is found (from AST)', async () => {
		const transformer = unified().use(remarkParse).use(astTransform).use(astSection).freeze();
		const markdown = dedent`\
      # Heading 1

      Paragraph 1

      ## Heading 2

      Paragraph 2

      Paragraph 3
    `;

		const result = await transformer.run(transformer.parse(markdown));
		const expected = {
			children: [
				{
					children: [
						{
							children: [
								{
									position: {
										end: {
											column: 12,
											line: 1,
											offset: 11,
										},
										start: {
											column: 3,
											line: 1,
											offset: 2,
										},
									},
									type: 'text',
									value: 'Heading 1',
								},
							],
							id: 'heading-1',
							level: 1,
							plain: 'Heading 1',
							position: {
								end: {
									column: 12,
									line: 1,
									offset: 11,
								},
								start: {
									column: 1,
									line: 1,
									offset: 0,
								},
							},
							type: 'heading',
						},
						{
							children: [
								{
									position: {
										end: {
											column: 12,
											line: 3,
											offset: 24,
										},
										start: {
											column: 1,
											line: 3,
											offset: 13,
										},
									},
									type: 'text',
									value: 'Paragraph 1',
								},
							],
							position: {
								end: {
									column: 12,
									line: 3,
									offset: 24,
								},
								start: {
									column: 1,
									line: 3,
									offset: 13,
								},
							},
							type: 'paragraph',
						},
						{
							children: [
								{
									children: [
										{
											position: {
												end: {
													column: 13,
													line: 5,
													offset: 38,
												},
												start: {
													column: 4,
													line: 5,
													offset: 29,
												},
											},
											type: 'text',
											value: 'Heading 2',
										},
									],
									id: 'heading-2',
									level: 2,
									plain: 'Heading 2',
									position: {
										end: {
											column: 13,
											line: 5,
											offset: 38,
										},
										start: {
											column: 1,
											line: 5,
											offset: 26,
										},
									},
									type: 'heading',
								},
								{
									children: [
										{
											position: {
												end: {
													column: 12,
													line: 7,
													offset: 51,
												},
												start: {
													column: 1,
													line: 7,
													offset: 40,
												},
											},
											type: 'text',
											value: 'Paragraph 2',
										},
									],
									position: {
										end: {
											column: 12,
											line: 7,
											offset: 51,
										},
										start: {
											column: 1,
											line: 7,
											offset: 40,
										},
									},
									type: 'paragraph',
								},
								{
									children: [
										{
											position: {
												end: {
													column: 12,
													line: 9,
													offset: 64,
												},
												start: {
													column: 1,
													line: 9,
													offset: 53,
												},
											},
											type: 'text',
											value: 'Paragraph 3',
										},
									],
									position: {
										end: {
											column: 12,
											line: 9,
											offset: 64,
										},
										start: {
											column: 1,
											line: 9,
											offset: 53,
										},
									},
									type: 'paragraph',
								},
							],
							position: {
								end: {
									column: 12,
									line: 9,
									offset: 64,
								},
								start: {
									column: 1,
									line: 5,
									offset: 26,
								},
							},
							type: 'section',
						},
					],
					position: {
						end: {
							column: 12,
							line: 9,
							offset: 64,
						},
						start: {
							column: 1,
							line: 1,
							offset: 0,
						},
					},
					type: 'section',
				},
			],
			footnotes: [],
			position: {
				end: {
					column: 1,
					line: 10,
					offset: 65,
				},
				start: {
					column: 1,
					line: 1,
					offset: 0,
				},
			},
			type: 'root',
		} satisfies A.Root;

		expect(result).toStrictEqual(expected);
	});
});
