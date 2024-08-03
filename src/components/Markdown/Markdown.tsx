import type { Component } from "solid-js";
import { Index } from "solid-js";
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

const Markdown: Component<MarkdownProps> = (props) => {
	switch (props.node.type) {
		case "text":
			return props.node.value;
		case "strong":
			return <Strong node={props.node} footnoteDefs={props.footnoteDefs} />;
		case "emphasis":
			return <Emphasis node={props.node} footnoteDefs={props.footnoteDefs} />;
		case "delete":
			return <Delete node={props.node} footnoteDefs={props.footnoteDefs} />;
		case "inlineCode":
			return <InlineCode node={props.node} />;
		case "link":
			return <Link node={props.node} footnoteDefs={props.footnoteDefs} />;
		case "image":
			return <Image node={props.node} />;
		case "break":
			return <Break />;
		case "thematicBreak":
			return <ThemanticBreak />;
		case "html":
			return <HTML node={props.node} />;
		case "heading":
			return <Heading node={props.node} footnoteDefs={props.footnoteDefs} />;
		case "paragraph":
			return <Paragraph node={props.node} footnoteDefs={props.footnoteDefs} />;
		case "blockquote":
			return <BlockQuote node={props.node} footnoteDefs={props.footnoteDefs} />;
		case "unorderedList":
			return <UnorderedList node={props.node} footnoteDefs={props.footnoteDefs} />;
		case "orderedList":
			return <OrderedList node={props.node} footnoteDefs={props.footnoteDefs} />;
		case "listItem":
			return <ListItem node={props.node} footnoteDefs={props.footnoteDefs} />;
		case "descriptionList":
			return <DescriptionList node={props.node} footnoteDefs={props.footnoteDefs} />;
		case "descriptionTerm":
			return <DescriptionTerm node={props.node} footnoteDefs={props.footnoteDefs} />;
		case "descriptionDetails":
			return <DescriptionDetails node={props.node} footnoteDefs={props.footnoteDefs} />;
		case "table":
			return <Table node={props.node} footnoteDefs={props.footnoteDefs} />;
		case "footnoteReference":
			return <FootnoteReference node={props.node} footnoteDefs={props.footnoteDefs} />;
		case "code":
			return <Code node={props.node} />;
		case "embed":
			return <Embed node={props.node} />;
		case "section":
			return <Section node={props.node} footnoteDefs={props.footnoteDefs} />;
		case "tableCell":
		case "tableRow":
			throw new Error(`Unexpected node type: ${props.node.type}`);
		default: {
			props.node satisfies never;

			throw new Error("Unreachable");
		}
	}
};

interface MarkdownChildrenProps {
	nodes: Array<Content>;
	footnoteDefs: Array<FootnoteDefinition>;
}

const MarkdownChildren: Component<MarkdownChildrenProps> = (props) => {
	return (
		<Index each={props.nodes}>
			{(node => (
				<Markdown node={node()} footnoteDefs={props.footnoteDefs} />
			))}
		</Index>
	);
};

export default MarkdownChildren;
