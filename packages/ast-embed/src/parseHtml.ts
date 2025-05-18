/* eslint-disable ts/no-unused-vars */
import { parse } from 'node-html-parser';
import type { HTMLElement } from 'node-html-parser';

interface GitHubSourceDescriptor {
	filename: string;
	lang: string;
	commitHashOrBranch: string;
	lines?: {
		start: number;
		end?: number;
	};
	codeLines: string;
}

interface Lines {
	start: number;
	end?: number;
}

interface Title {
	filename: string;
	commitHashOrBranch?: string | undefined;
}

interface Payload {
	blob: {
		rawLines: string[];
	};
}

export const parseHtml = (html: string, url: string): GitHubSourceDescriptor => {
	const lines = parseLines(url);

	const dom = parse(html);
	const title = dom.querySelector('title')?.textContent;
	if (!title) {
		throw new Error('Title not found');
	}
	const { filename, commitHashOrBranch } = parseTitle(title);
	const lang = detectLang(filename);
	const payload = getEmbeddedCodePayload(dom);
	if (!payload) {
		throw new Error('Payload not found');
	}
	const { rawLines: codeLines } = payload.blob;
	const c = codeLines.slice(lines.start, lines.end).join('\n');

	return {
		filename,
		lang,
		commitHashOrBranch: commitHashOrBranch ?? 'main',
		lines,
		codeLines: c,
	};
};

const parseLines = (url: string): Lines => {
	// eslint-disable-next-line prefer-named-capture-group
	const [_, start, end] = /#L(\d+)(?:-L(\d+))?/u.exec(url) ?? ['', '1', ''];
	const s = Number.parseInt(start, 10);
	const e = Number.parseInt(end, 10);

	return { start: s - 1, end: Number.isNaN(e) ? s : e };
};

const parseTitle = (raw: string): Title => {
	// format: path/to/file.ext at commitHash(or branch) ・ repositoryName ・ GitHub
	const [filename, _at, commitHashOrBranch, _dot, repoName, _dot2, _github] = raw.split(' ');

	return {
		// eslint-disable-next-line ts/restrict-template-expressions
		filename: `${repoName?.split('/').at(0)}/${filename}`,
		commitHashOrBranch,
	};
};

const detectLang = (fileName: string): string => {
	return fileName.split('.').pop() ?? 'plaintext';
};

const getEmbeddedCodePayload = (dom: HTMLElement): Payload | null => {
	try {
		const content = dom.querySelector("[data-target='react-app.embeddedData']")?.innerHTML;
		if (!content) {
			return null;
		}

		// eslint-disable-next-line ts/no-unsafe-return, ts/no-unsafe-member-access
		return JSON.parse(content).payload;
	} catch {
		return null;
	}
};
