import crypto from 'node:crypto';
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { defineCollection, defineConfig } from '@content-collections/core';
import { transformerNotationDiff } from '@shikijs/transformers';
import { astArticle } from 'ast-article';
import { astDescriptionList } from 'ast-description-list';
import { astEmbed } from 'ast-embed';
import { astSection } from 'ast-section';
import { astToc } from 'ast-toc';
import { astTransform } from 'ast-transform';
import { remarkDescriptionList } from 'remark-description-list';
import { remarkEmbed } from 'remark-embed';
import remarkGfm from 'remark-gfm';
import remarkParse from 'remark-parse';
import remarkRetext from 'remark-retext';
import retextEnglish from 'retext-english';
import retextEquality from 'retext-equality';
import retextStringify from 'retext-stringify';
import sharp from 'sharp';
import { codeToHast } from 'shiki';
import { Temporal } from 'temporal-polyfill';
import { unified } from 'unified';
import type * as A from 'ast';
import type * as H from 'hast';

interface TransformedImage {
	dim: {
		h: number;
		w: number;
	};
	path: string;
}

export interface WithTransformedImage {
	transformed?: TransformedImage[];
}

interface ImageTransformationConfig {
	readonly outputRoot: string;
	readonly outputSubDir: string;
	readonly scaling: number;
	readonly sourceBaseDir: string;
}

interface TransformContext {
	readonly filePath: string;
}

const isAbslutePath = (imgUrl: string): boolean => {
	return /^https?:\/\//u.test(imgUrl) || imgUrl.startsWith('/');
};

const srcImgPath = (config: ImageTransformationConfig, ctx: TransformContext, imgUrl: string): string => {
	if (isAbslutePath(imgUrl)) return imgUrl;

	const contentDir = /^.+$/u.exec(config.sourceBaseDir)?.[0];
	if (contentDir === undefined) return imgUrl;

	const srcPath = path.parse(ctx.filePath);

	if (srcPath.dir === '') return `${contentDir}/${imgUrl}`;
	return `${contentDir}/${srcPath.dir}/${imgUrl}`;
};

const generateImgDistFileName = (
	imgUrl: string,
	dim?: {
		height: number;
		width: number;
	},
) => {
	if (isAbslutePath(imgUrl)) return imgUrl;

	const baseNameHash = crypto.createHash('sha256').update(imgUrl).digest('base64').slice(0, 8);
	const baseName = path.parse(imgUrl).name;
	// eslint-disable-next-line ts/restrict-template-expressions
	if (dim) return `${baseName}-${baseNameHash}-${Math.round(dim.width)}x${Math.round(dim.height)}.webp`;
	return `${baseName}-${baseNameHash}.webp`;
};

const exists = async (path: string): Promise<boolean> => {
	try {
		await access(path);
		return true;
	} catch {
		return false;
	}
};

// eslint-disable-next-line complexity
const traverseMdAst = async (config: ImageTransformationConfig, ctx: TransformContext, ast: A.Content) => {
	switch (ast.type) {
		case 'code': {
			if (ast.lang) {
				const styled = await codeToHast(ast.value, {
					lang: ast.lang,
					theme: 'vitesse-dark',
					transformers: [
						transformerNotationDiff(),
						{
							pre(node) {
								node.properties['style'] = 'color: #dbd7cacc;';
							},
						},
					],
				});
				// eslint-disable-next-line ts/ban-ts-comment
				// @ts-ignore - This is a safty cast
				(ast as unknown as { hast: H.Root }).hast = styled;
			}
			return;
		}
		case 'break':
		case 'html':
		case 'footnoteReference':
		case 'inlineCode':
		case 'text':
		case 'thematicBreak':
		case 'embed': {
			return;
		}
		case 'image': {
			if (ast.url.startsWith('https://') || ast.url.startsWith('http://') || ast.url.startsWith('/')) {
				return;
			}

			const buffer = await readFile(srcImgPath(config, ctx, ast.url));
			const image = sharp(buffer);
			let { height, width } = await image.metadata();
			if (!(width && height)) return;

			const images: TransformedImage[] = [];

			while (width > 300) {
				const fileName = generateImgDistFileName(ast.url, { height, width });
				const distPath = `${config.outputSubDir}/${fileName}`;
				const distPathOnFs = `${config.outputRoot}/${distPath}`;

				if (!(await exists(distPathOnFs))) {
					const resized = await image.resize(Math.round(width), Math.round(height)).toBuffer();
					await writeFile(distPathOnFs, resized);
					// eslint-disable-next-line no-console
					console.log(`INFO: transformed markdown image: ${fileName}`);
				}

				images.push({
					dim: {
						h: Math.round(height),
						w: Math.round(width),
					},
					path: `/${distPath}`,
				});
				width *= config.scaling;
				height *= config.scaling;
			}
			(ast as WithTransformedImage).transformed = images;
			return;
		}
		// eslint-disable-next-line re-taro/switch-exhaustiveness-check
		default: {
			await Promise.all(
				ast.children.map(async (child) => {
					await traverseMdAst(config, ctx, child);
				}),
			);
		}
	}
};

const generateImages = async (config: ImageTransformationConfig, ctx: TransformContext, ast: A.Article) => {
	await mkdir(`${config.outputRoot}/${config.outputSubDir}`, {
		recursive: true,
	});
	await Promise.all(
		ast.children.map(async (child) => {
			await traverseMdAst(config, ctx, child);
		}),
	);
};

const blog = defineCollection({
	directory: 'contents',
	include: '**/*.md',
	name: 'blog',
	schema: (z) => ({
		description: z.string({ message: 'Value of "description" must be a string.' }),
		published: z.boolean({ message: 'Value of "published" must be a boolean.' }),
		publishedAt: z.string({ message: 'Value of "publishedAt" must be a date.' }).refine(
			(v) => {
				try {
					Temporal.ZonedDateTime.from(v);

					return true;
				} catch {
					return false;
				}
			},
			{ message: 'Value of "publishedAt" must be a valid date.' },
		),
		tags: z.array(z.string(), { message: 'Value of "tags" must be an array of strings.' }),
		title: z.string({ message: 'Value of "title" must be a string.' }),
		updatedAt: z
			.string({ message: 'Value of "updatedAt" must be a date.' })
			.refine(
				(v) => {
					try {
						Temporal.ZonedDateTime.from(v);

						return true;
					} catch {
						return false;
					}
				},
				{ message: 'Value of "updatedAt" must be a valid date.' },
			)
			.optional(),
	}),
	transform: async (document) => {
		const processor = unified()
			.use(remarkParse)
			.use(remarkGfm)
			.use(remarkEmbed)
			.use(remarkDescriptionList)
			.use(astTransform)
			.use(astDescriptionList)
			.use(astEmbed)
			.use(astSection)
			.use(astToc)
			.use(astArticle)
			.freeze();

		const mdast = await processor.run(processor.parse(document.content));

		const config = {
			outputRoot: path.join(import.meta.dirname, '..', '..', '..', 'app', 'public'),
			outputSubDir: 'img',
			scaling: 0.7,
			sourceBaseDir: 'contents',
		};
		const ctx = {
			filePath: document._meta.filePath,
		};
		await generateImages(config, ctx, mdast);
		const abstract = await unified()
			.use(remarkParse)
			// eslint-disable-next-line ts/no-unsafe-argument, ts/no-explicit-any
			.use(remarkRetext, unified().use(retextEnglish).use(retextEquality) as any)
			.use(retextStringify)
			.process(document.content);

		return {
			...document,
			abstract: String(abstract).slice(0, 400),
			// eslint-disable-next-line ts/no-unsafe-assignment, ts/no-explicit-any
			mdast: mdast as any, // MEMO: This cast is an escape hatch for serializable type
		};
	},
});

export default defineConfig({
	collections: [blog],
});
