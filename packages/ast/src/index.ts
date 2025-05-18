import type { OEmbed } from 'oembed';
import type { unfurl } from 'unfurl.js';
import type { Node as UnistNode } from 'unist';

type Metadata = Awaited<ReturnType<typeof unfurl>>;

export type Node = UnistNode;

export interface Literal extends Node {
	value: string;
}

export interface Parent extends Node {
	children: Content[];
}

export type Nodes = Content | Root;

export type Content =
	| Blockquote
	| Break
	| Code
	| Delete
	| DescriptionDetails
	| DescriptionList
	| DescriptionTerm
	| Embed
	| Emphasis
	| FootnoteReference
	| Heading
	| Html
	| Image
	| InlineCode
	| Link
	| ListItem
	| OrderedList
	| Paragraph
	| Section
	| Strong
	| Table
	| TableCell
	| TableRow
	| Text
	| ThematicBreak
	| UnorderedList;

export interface Text extends Literal {
	type: 'text';
}

export interface Strong extends Parent {
	type: 'strong';
}

export interface Emphasis extends Parent {
	type: 'emphasis';
}

export interface Delete extends Parent {
	type: 'delete';
}

export interface InlineCode extends Literal {
	type: 'inlineCode';
}

export interface Link extends Parent {
	type: 'link';
	url: string;
	title?: string | undefined;
}

export interface Image extends Node {
	alt: string;
	type: 'image';
	url: string;
	title?: string | undefined;
}

export interface Break extends Node {
	type: 'break';
}

export interface ThematicBreak extends Node {
	type: 'thematicBreak';
}

export interface Html extends Literal {
	type: 'html';
}

export interface Heading extends Parent {
	id: string;
	level: 1 | 2 | 3 | 4 | 5 | 6;
	plain: string;
	type: 'heading';
}

export interface Paragraph extends Parent {
	type: 'paragraph';
}

export interface Blockquote extends Parent {
	type: 'blockquote';
}

export interface UnorderedList extends Parent {
	type: 'unorderedList';
}

export interface OrderedList extends Parent {
	start: number;
	type: 'orderedList';
}

export interface ListItem extends Parent {
	type: 'listItem';
}

export interface DescriptionList extends Parent {
	type: 'descriptionList';
}

export interface DescriptionTerm extends Parent {
	type: 'descriptionTerm';
}

export interface DescriptionDetails extends Parent {
	type: 'descriptionDetails';
}

export interface Table extends Parent {
	align: ('center' | 'left' | 'right' | null)[];
	type: 'table';
}

export interface TableRow extends Parent {
	type: 'tableRow';
}

export interface TableCell extends Parent {
	type: 'tableCell';
}

export interface FootnoteDefinition extends Parent {
	count: number;
	index: number;
	type: 'footnoteDefinition';
}

export interface FootnoteReference extends Node {
	footnoteIndex: number;
	referenceIndex: number;
	type: 'footnoteReference';
}

export interface Code extends Literal {
	type: 'code';
	filename?: string | undefined;
	lang?: string | undefined;
}

export interface Embed extends Node {
	src: string;
	type: 'embed';
	allowFullScreen?: boolean | undefined;
	height?: string | undefined;
	meta?: Metadata | undefined;
	oembed?: OEmbed | undefined;
	width?: string | undefined;
	filename?: string | undefined;
	lang?: string | undefined;
	commitHashOrBranch?: string | undefined;
	lines?:
		| {
				start: number;
				end?: number;
		  }
		| undefined;
	codeLines?: string | undefined;
}

export interface Section extends Parent {
	children: [Heading, ...Content[]];
	type: 'section';
}

export interface Root extends Parent {
	footnotes: FootnoteDefinition[];
	type: 'root';
}

export interface Toc extends Node {
	children: Toc[];
	id: string;
	plain: string;
	type: 'toc';
}

export interface Article extends Omit<Root, 'type'> {
	title: Heading;
	toc: Toc[];
	type: 'article';
}
