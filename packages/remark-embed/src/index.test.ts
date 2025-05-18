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

			https://github.com/swc-project/swc/blob/f960d52364e72fa7548cc8aaaf6367dfdf7b9a8f/packages/core/postinstall.js

			https://github.com/styled-components/styled-components/blob/ef548a2fd1d8b7766a273084edb33caf7d8a37df/packages/styled-components/src/sheet/dom.ts#L13-L31
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
					isGitHubPermalink: false,
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
					isGitHubPermalink: false,
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
					isGitHubPermalink: false,
				},
				{
					oembed: false,
					position: {
						end: {
							column: 110,
							line: 7,
							offset: 277,
						},
						start: {
							column: 1,
							line: 7,
							offset: 168,
						},
					},
					src: 'https://github.com/swc-project/swc/blob/f960d52364e72fa7548cc8aaaf6367dfdf7b9a8f/packages/core/postinstall.js',
					type: 'embed',
					isGitHubPermalink: true,
				},
				{
					oembed: false,
					position: {
						end: {
							column: 153,
							line: 9,
							offset: 431,
						},
						start: {
							column: 1,
							line: 9,
							offset: 279,
						},
					},
					src: 'https://github.com/styled-components/styled-components/blob/ef548a2fd1d8b7766a273084edb33caf7d8a37df/packages/styled-components/src/sheet/dom.ts#L13-L31',
					type: 'embed',
					isGitHubPermalink: true,
				},
			],
			position: {
				end: {
					column: 1,
					line: 10,
					offset: 432,
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
