import { component$ } from "@builder.io/qwik";
import Table from "./Table";
import Strong from "./Strong";
import Emphasis from "./Emphasis";
import Delete from "./Delete";
import InlineCode from "./InlineCode";
import Link from "./Link";
import Image from "./Image";
import Break from "./Break";
import ThemanticBreak from "./ThemanticBreak";
import HTML from "./HTML";
import Heading from "./Heading";
import Paragraph from "./Paragraph";
import BlockQuote from "./Blockquote";
import UnorderedList from "./UnorderedList";
import OrderedList from "./OrderedList";
import ListItem from "./ListItem";
import DescriptionList from "./DescriptionList";
import DescriptionTerm from "./DescriptionTerm";
import DescriptionDetails from "./DescriptionDetails";
import FootnoteReference from "./FootnoteReference";
import Code from "./Code";
import Embed from "./Embed/Embed";
import Section from "./Section";
import type { Content, FootnoteDefinition } from "~/libs/plugins/ast/ast";

export interface MarkdownProps {
	node: Content;
	footnoteDefs: Array<FootnoteDefinition>;
}

function Markdown({ node, footnoteDefs }: MarkdownProps) {
	switch (node.type) {
		case "text":
			return node.value;
		case "strong":
			return <Strong node={node} footnoteDefs={footnoteDefs} />;
		case "emphasis":
			return <Emphasis node={node} footnoteDefs={footnoteDefs} />;
		case "delete":
			return <Delete node={node} footnoteDefs={footnoteDefs} />;
		case "inlineCode":
			return <InlineCode node={node} />;
		case "link":
			return <Link node={node} footnoteDefs={footnoteDefs} />;
		case "image":
			return <Image node={node} />;
		case "break":
			return <Break />;
		case "thematicBreak":
			return <ThemanticBreak />;
		case "html":
			return <HTML node={node} />;
		case "heading":
			return <Heading node={node} footnoteDefs={footnoteDefs} />;
		case "paragraph":
			return <Paragraph node={node} footnoteDefs={footnoteDefs} />;
		case "blockquote":
			return <BlockQuote node={node} footnoteDefs={footnoteDefs} />;
		case "unorderedList":
			return <UnorderedList node={node} footnoteDefs={footnoteDefs} />;
		case "orderedList":
			return <OrderedList node={node} footnoteDefs={footnoteDefs} />;
		case "listItem":
			return <ListItem node={node} footnoteDefs={footnoteDefs} />;
		case "descriptionList":
			return <DescriptionList node={node} footnoteDefs={footnoteDefs} />;
		case "descriptionTerm":
			return <DescriptionTerm node={node} footnoteDefs={footnoteDefs} />;
		case "descriptionDetails":
			return <DescriptionDetails node={node} footnoteDefs={footnoteDefs} />;
		case "table":
			return <Table node={node} footnoteDefs={footnoteDefs} />;
		case "footnoteReference":
			return <FootnoteReference node={node} footnoteDefs={footnoteDefs} />;
		case "code":
			return <Code node={node} />;
		case "embed":
			return <Embed node={node} />;
		case "section":
			return <Section node={node} footnoteDefs={footnoteDefs} />;
		case "tableCell":
		case "tableRow":
			throw new Error(`Unexpected node type: ${node.type}`);
	}
}

interface MarkdownChildrenProps {
	nodes: Array<Content>;
	footnoteDefs: Array<FootnoteDefinition>;
}

export default component$<MarkdownChildrenProps>(({ nodes, footnoteDefs }) => {
	return (
		<>
			{nodes.map((node, idx) => (
				<Markdown node={node} footnoteDefs={footnoteDefs} key={idx} />
			))}
		</>
	);
});
