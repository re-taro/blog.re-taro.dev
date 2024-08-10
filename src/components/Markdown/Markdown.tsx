import type { Component } from "solid-js";
import { Index, Match, Switch } from "solid-js";
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
	footnoteDefs: Array<FootnoteDefinition>;
	node: Content;
}

const Markdown: Component<MarkdownProps> = (props) => {
	return (
		<Switch>
			<Match when={(() => props.node.type === "text" ? props.node : undefined)()}>
				{node => node().value}
			</Match>
			<Match when={(() => props.node.type === "strong" ? props.node : undefined)()}>
				{node => <Strong footnoteDefs={props.footnoteDefs} node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "emphasis" ? props.node : undefined)()}>
				{node => <Emphasis footnoteDefs={props.footnoteDefs} node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "delete" ? props.node : undefined)()}>
				{node => <Delete footnoteDefs={props.footnoteDefs} node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "inlineCode" ? props.node : undefined)()}>
				{node => <InlineCode node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "link" ? props.node : undefined)()}>
				{node => <Link footnoteDefs={props.footnoteDefs} node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "image" ? props.node : undefined)()}>
				{node => <Image node={node()} />}
			</Match>
			<Match when={props.node.type === "break"}>
				<Break />
			</Match>
			<Match when={props.node.type === "thematicBreak"}>
				<ThemanticBreak />
			</Match>
			<Match when={(() => props.node.type === "html" ? props.node : undefined)()}>
				{node => <HTML node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "heading" ? props.node : undefined)()}>
				{node => <Heading footnoteDefs={props.footnoteDefs} node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "paragraph" ? props.node : undefined)()}>
				{node => <Paragraph footnoteDefs={props.footnoteDefs} node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "blockquote" ? props.node : undefined)()}>
				{node => <BlockQuote footnoteDefs={props.footnoteDefs} node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "unorderedList" ? props.node : undefined)()}>
				{node => <UnorderedList footnoteDefs={props.footnoteDefs} node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "orderedList" ? props.node : undefined)()}>
				{node => <OrderedList footnoteDefs={props.footnoteDefs} node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "listItem" ? props.node : undefined)()}>
				{node => <ListItem footnoteDefs={props.footnoteDefs} node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "descriptionList" ? props.node : undefined)()}>
				{node => <DescriptionList footnoteDefs={props.footnoteDefs} node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "descriptionTerm" ? props.node : undefined)()}>
				{node => <DescriptionTerm footnoteDefs={props.footnoteDefs} node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "descriptionDetails" ? props.node : undefined)()}>
				{node => <DescriptionDetails footnoteDefs={props.footnoteDefs} node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "table" ? props.node : undefined)()}>
				{node => <Table footnoteDefs={props.footnoteDefs} node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "footnoteReference" ? props.node : undefined)()}>
				{node => <FootnoteReference footnoteDefs={props.footnoteDefs} node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "code" ? props.node : undefined)()}>
				{node => <Code node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "embed" ? props.node : undefined)()}>
				{node => <Embed node={node()} />}
			</Match>
			<Match when={(() => props.node.type === "section" ? props.node : undefined)()}>
				{node => <Section footnoteDefs={props.footnoteDefs} node={node()} />}
			</Match>
		</Switch>
	);
};

interface MarkdownChildrenProps {
	footnoteDefs: Array<FootnoteDefinition>;
	nodes: Array<Content>;
}

const MarkdownChildren: Component<MarkdownChildrenProps> = (props) => {
	return (
		<Index each={props.nodes}>
			{(node => (
				<Markdown footnoteDefs={props.footnoteDefs} node={node()} />
			))}
		</Index>
	);
};

export default MarkdownChildren;
