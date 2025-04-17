/* eslint-disable node/no-sync */
import { dedent } from '@qnighy/dedent';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { describe, expect, it } from 'vitest';
import type { List, Root } from 'mdast';
import { remarkEmbed } from '.';

describe('remarkEmbed', () => {
	it('should transform orphan `link` to `embed`', () => {
		const transformer = unified().use(remarkParse).use(remarkGfm).use(remarkEmbed).freeze();

		const markdown = dedent`\
			https://example.com

			https://www.youtube.com/watch?v=SHkF48SgiSA

			https://docs.google.com/presentation/d/1Jx4nQbzFk5BYTTZwuOMGQOd359G_orJU-OrG4Bg3ohg/edit?usp=sharing

		`;

		const result = transformer.runSync(transformer.parse(markdown));
		const expected = {
			children: [
				{
					oembed: true,
					position: {
						end: {
							column: 20,
							line: 1,
							offset: 19,
						},
						start: {
							column: 1,
							line: 1,
							offset: 0,
						},
					},
					src: 'https://example.com/',
					type: 'embed',
				},
				{
					height: '360',
					oembed: false,
					position: {
						end: {
							column: 44,
							line: 3,
							offset: 64,
						},
						start: {
							column: 1,
							line: 3,
							offset: 21,
						},
					},
					src: 'https://www.youtube.com/embed/SHkF48SgiSA',
					type: 'embed',
					width: '100%',
				},
				{
					allowFullScreen: true,
					oembed: false,
					position: {
						end: {
							column: 101,
							line: 5,
							offset: 166,
						},
						start: {
							column: 1,
							line: 5,
							offset: 66,
						},
					},
					src: 'https://docs.google.com/presentation/d/1Jx4nQbzFk5BYTTZwuOMGQOd359G_orJU-OrG4Bg3ohg/embed',
					type: 'embed',
					width: '100%',
				},
			],
			position: {
				end: {
					column: 1,
					line: 7,
					offset: 168,
				},
				start: {
					column: 1,
					line: 1,
					offset: 0,
				},
			},
			type: 'root',
		} satisfies Root;
		expect(result).toStrictEqual(expected);
	});
	it('should not transform `link` to `embed` if parent is not `root`', () => {
		const transformer = unified().use(remarkParse).use(remarkGfm).use(remarkEmbed).freeze();

		const markdown = dedent`\
			- https://example.com
		`;

		// eslint-disable-next-line ts/no-non-null-assertion
		const result = transformer.runSync(transformer.parse(markdown).children.at(0)!) as List;

		expect(result.children.at(0)?.type).not.toBe('embed');
	});
});
