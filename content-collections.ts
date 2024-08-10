import { parse } from "node:path";
import crypto from "node:crypto";
import { access, mkdir, readFile, writeFile } from "node:fs/promises";

import { codeToHast } from "shiki";
import {
	transformerNotationDiff,
} from "@shikijs/transformers";
import sharp from "sharp";
import type * as H from "hast";
import { defineCollection, defineConfig } from "@content-collections/core";
import { unified } from "unified";
import { Temporal } from "temporal-polyfill";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRetext from "remark-retext";
import retextEnglish from "retext-english";
import retextEquality from "retext-equality";
import retextStringify from "retext-stringify";
import type * as A from "~/libs/plugins/ast/ast";

import { remarkEmbed } from "~/libs/plugins/remark/remarkEmbed";
import { remarkDescriptionList } from "~/libs/plugins/remark/remarkDescriptionList";
import { astTransform } from "~/libs/plugins/ast/transform";
import { astEmbed } from "~/libs/plugins/ast/embed";
import { astSection } from "~/libs/plugins/ast/section";
import { astToc } from "~/libs/plugins/ast/toc";
import { astArticle } from "~/libs/plugins/ast/article";
import { astDescriptionList } from "~/libs/plugins/ast/descriptionList";

interface TransformedImage {
	dim: {
		h: number;
		w: number;
	};
	path: string;
}

export interface WithTransformedImage {
	transformed?: Array<TransformedImage>;
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

function isAbslutePath(imgUrl: string): boolean {
	return /^https?:\/\//.test(imgUrl) || imgUrl.startsWith("/");
}

function srcImgPath(
	config: ImageTransformationConfig,
	ctx: TransformContext,
	imgUrl: string,
): string {
	if (isAbslutePath(imgUrl))
		return imgUrl;

	const contentDir = /^.+$/.exec(config.sourceBaseDir)?.[0];
	if (contentDir === undefined)
		return imgUrl;

	const srcPath = parse(ctx.filePath);

	if (srcPath.dir === "")
		return `${contentDir}/${imgUrl}`;
	else
		return `${contentDir}/${srcPath.dir}/${imgUrl}`;
}

function generateImgDistFileName(
	imgUrl: string,
	dim?: {
		height: number;
		width: number;
	},
) {
	if (isAbslutePath(imgUrl))
		return imgUrl;

	const baseNameHash = crypto
		.createHash("sha256")
		.update(imgUrl)
		.digest("base64")
		.slice(0, 8);
	const baseName = parse(imgUrl).name;
	if (dim)
		return `${baseName}-${baseNameHash}-${Math.round(dim.width)}x${Math.round(dim.height)}.webp`;
	else
		return `${baseName}-${baseNameHash}.webp`;
}

async function exists(path: string): Promise<boolean> {
	try {
		await access(path);
		return true;
	}
	catch {
		return false;
	}
}

async function traverseMdAst<T extends A.Content>(
	config: ImageTransformationConfig,
	ctx: TransformContext,
	ast: T,
) {
	switch (ast.type) {
		case "code":
			if (ast.lang) {
				const styled = await codeToHast(ast.value, {
					lang: ast.lang,
					theme: "vitesse-dark",
					transformers: [
						transformerNotationDiff(),
						{
							pre(node) {
								node.properties.style = "color: #dbd7cacc;";
							},
						},
					],
				});
				// @ts-expect-error - This is a safty cast
				(ast as unknown as { hast: H.Root }).hast = styled;
			}
			return;
		case "break":
		case "html":
		case "footnoteReference":
		case "inlineCode":
		case "text":
		case "thematicBreak":
		case "embed":
			return;
		case "image": {
			if (
				ast.url.startsWith("https://")
				|| ast.url.startsWith("http://")
				|| ast.url.startsWith("/")
			) {
				return;
			}

			const buffer = await readFile(srcImgPath(config, ctx, ast.url));
			const image = sharp(buffer);
			let { height, width } = await image.metadata();
			if (!(width && height))
				return;

			const images: TransformedImage[] = [];

			while (width > 300) {
				const fileName = generateImgDistFileName(ast.url, { height, width });
				const distPath = `${config.outputSubDir}/${fileName}`;
				const distPathOnFs = `${config.outputRoot}/${distPath}`;

				if (!(await exists(distPathOnFs))) {
					const resized = await image
						.resize(Math.round(width), Math.round(height))
						.toBuffer();
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
		default:
			await Promise.all(
				ast.children.map(child => traverseMdAst(config, ctx, child)),
			);
	}
}

async function generateImages(
	config: ImageTransformationConfig,
	ctx: TransformContext,
	ast: A.Article,
) {
	await mkdir(`${config.outputRoot}/${config.outputSubDir}`, {
		recursive: true,
	});
	await Promise.all(
		ast.children.map(child => traverseMdAst(config, ctx, child)),
	);
}

const blog = defineCollection({
	directory: "contents",
	include: "**/*.md",
	name: "blog",
	schema: z => ({
		description: z.string({ message: "Value of \"description\" must be a string." }),
		published: z.boolean({ message: "Value of \"published\" must be a boolean." }),
		publishedAt: z.string({ message: "Value of \"publishedAt\" must be a date." }).refine((v) => {
			try {
				Temporal.ZonedDateTime.from(v);

				return true;
			}
			catch {
				return false;
			}
		}, { message: "Value of \"publishedAt\" must be a valid date." }),
		tags: z.array(z.string(), { message: "Value of \"tags\" must be an array of strings." }),
		title: z.string({ message: "Value of \"title\" must be a string." }),
		updatedAt: z.string({ message: "Value of \"updatedAt\" must be a date." }).refine((v) => {
			try {
				Temporal.ZonedDateTime.from(v);

				return true;
			}
			catch {
				return false;
			}
		}, { message: "Value of \"updatedAt\" must be a valid date." }).optional(),
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
			outputRoot: "public",
			outputSubDir: "img",
			scaling: 0.7,
			sourceBaseDir: "contents",
		};
		const ctx = {
			filePath: document._meta.filePath,
		};
		await generateImages(config, ctx, mdast);
		const abstract = await unified()
			.use(remarkParse)
			.use(
				remarkRetext,
				unified().use(retextEnglish).use(retextEquality) as any,
			)
			.use(retextStringify)
			.process(document.content);

		return {
			...document,
			abstract: String(abstract).slice(0, 400),
			mdast: mdast as any, // MEMO: This cast is an escape hatch for serializable type
		};
	},
});

export default defineConfig({
	collections: [blog],
});
