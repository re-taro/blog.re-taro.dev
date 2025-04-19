import { Blockquote } from './internal/Blockquote';
import { Break } from './internal/Break';
import { Code } from './internal/Code';
import { Delete } from './internal/Delete';
import { DescriptionDetails } from './internal/DescriptionDetails';
import { DescriptionList } from './internal/DescriptionList';
import { DescriptionTerm } from './internal/DescriptionTerm';
import { Embed } from './internal/Embed/Embed';
import { Emphasis } from './internal/Emphasis';
import { FootnoteReference } from './internal/FootnoteReference';
import { Heading } from './internal/Heading';
import { HTML } from './internal/HTML';
import { Image } from './internal/Image';
import { InlineCode } from './internal/InlineCode';
import { Link } from './internal/Link';
import { ListItem } from './internal/ListItem';
import { OrderedList } from './internal/OrderedList';
import { Paragraph } from './internal/Paragraph';
import { Section } from './internal/Section';
import { Strong } from './internal/Strong';
import { Table } from './internal/Table';
import { ThemanticBreak } from './internal/ThemanticBreak';
import { UnorderedList } from './internal/UnorderedList';
import type { Content, FootnoteDefinition } from 'ast';
import type { FC } from 'react';

export interface MarkdownProps {
	footnoteDefs: FootnoteDefinition[];
	node: Content;
}

// eslint-disable-next-line complexity
const MarkdownInternal: FC<MarkdownProps> = ({ footnoteDefs, node }) => {
	// eslint-disable-next-line re-taro/switch-exhaustiveness-check
	switch (node.type) {
		case 'text': {
			return <>{node.value}</>;
		}
		case 'strong': {
			return <Strong footnoteDefs={footnoteDefs} node={node} />;
		}
		case 'emphasis': {
			return <Emphasis footnoteDefs={footnoteDefs} node={node} />;
		}
		case 'delete': {
			return <Delete footnoteDefs={footnoteDefs} node={node} />;
		}
		case 'inlineCode': {
			return <InlineCode node={node} />;
		}
		case 'link': {
			return <Link footnoteDefs={footnoteDefs} node={node} />;
		}
		case 'image': {
			return <Image node={node} />;
		}
		case 'break': {
			return <Break />;
		}
		case 'thematicBreak': {
			return <ThemanticBreak />;
		}
		case 'html': {
			return <HTML node={node} />;
		}
		case 'heading': {
			return <Heading footnoteDefs={footnoteDefs} node={node} />;
		}
		case 'paragraph': {
			return <Paragraph footnoteDefs={footnoteDefs} node={node} />;
		}
		case 'blockquote': {
			return <Blockquote footnoteDefs={footnoteDefs} node={node} />;
		}
		case 'unorderedList': {
			return <UnorderedList footnoteDefs={footnoteDefs} node={node} />;
		}
		case 'orderedList': {
			return <OrderedList footnoteDefs={footnoteDefs} node={node} />;
		}
		case 'listItem': {
			return <ListItem footnoteDefs={footnoteDefs} node={node} />;
		}
		case 'descriptionList': {
			return <DescriptionList footnoteDefs={footnoteDefs} node={node} />;
		}
		case 'descriptionTerm': {
			return <DescriptionTerm footnoteDefs={footnoteDefs} node={node} />;
		}
		case 'descriptionDetails': {
			return <DescriptionDetails footnoteDefs={footnoteDefs} node={node} />;
		}
		case 'table': {
			return <Table footnoteDefs={footnoteDefs} node={node} />;
		}
		case 'footnoteReference': {
			return <FootnoteReference footnoteDefs={footnoteDefs} node={node} />;
		}
		case 'code': {
			return <Code node={node} />;
		}
		case 'embed': {
			return <Embed node={node} />;
		}
		case 'section': {
			return <Section footnoteDefs={footnoteDefs} node={node} />;
		}
		// No default
	}
	return null;
};

interface MarkdownChildrenProps {
	footnoteDefs: FootnoteDefinition[];
	nodes: Content[];
}

export const Markdown: FC<MarkdownChildrenProps> = ({ footnoteDefs, nodes }) => {
	return (
		<>
			{nodes.map((node, idx) => (
				<MarkdownInternal footnoteDefs={footnoteDefs} node={node} key={idx} />
			))}
		</>
	);
};
