import type { Component } from "solid-js";
import { Show, createMemo } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { MarkdownProps } from "./Markdown";
import MarkdownChildren from "./Markdown";
import { cva } from "~/styled-system/css";

interface Props extends MarkdownProps {
	align: "center" | "left" | "right" | null;
	head: boolean;
}

const tabCell = cva({
	base: {
		"&:last-child": {
			borderRight: "[2px solid {colors.text.main}]",
		},
		"_supportsAlternativeTextAfter": {
			"&:last-child": {
				border: "none",
				padding: "[unset]",
			},
			"_before": {
				content: "'|' / ''",
				float: "[left]",
				fontWeight: "normal",
				marginInlineEnd: "[.8em]",
			},
			"border": "none",
			"clear": "left",
			"padding": "[unset]",
			"paddingInlineEnd": "[.8em]",
		},
		"lg": {
			paddingInlineEnd: "[1.6em]",
		},
	},
	compoundVariants: [
		{
			align: "left",
			css: {
				_supportsAlternativeTextAfter: {
					_after: {
						content: "':-----------------------------------------------------------------' / ''",
					},
				},
			},
			head: true,
		},
		{
			align: "right",
			css: {
				_supportsAlternativeTextAfter: {
					_after: {
						content: "':-----------------------------------------------------------------' / ''",
						direction: "rtl",
					},
				},
			},
			head: true,
		},
	],
	variants: {
		align: {
			center: {
				textAlign: "center",
			},
			left: {
				textAlign: "left",
			},
			right: {
				textAlign: "right",
			},
		},
		head: {
			false: {
				borderLeft: "[2px solid {colors.text.main}]",
				paddingX: "4",
				paddingY: "2",
			},
			true: {
				_supportsAlternativeTextAfter: {
					_after: {
						content: "'------------------------------------------------------------------' / ''",
						fontWeight: "normal",
						left: "[1.2em]",
						letterSpacing: "[.1em]",
						overflow: "hidden",
						position: "absolute",
						right: "[.4em]",
						textOverflow: "clip",
						top: "[100%]",
						transform: "translateY(-100%)",
						whiteSpace: "nowrap",
					},
					_before: {
						content: "'|\\A|' / ''",
						whiteSpace: "pre",
					},
					position: "relative",
				},
				borderBottom: "[2px dashed {colors.text.main}]",
				borderLeft: "[2px solid {colors.text.main}]",
				padding: "[0 1rem .5rem 1rem]",
			},
		},
	},
});

const TableCell: Component<Props> = (props) => {
	const memoizedNode = createMemo(() => props.node.type === "tableCell" ? props.node : undefined);

	return (
		<Show when={memoizedNode()}>
			{node => (
				<Dynamic class={tabCell({ align: props.align === null ? undefined	: props.align, head: props.head })} component={props.head ? "th" : "td"}>
					<MarkdownChildren footnoteDefs={props.footnoteDefs} nodes={node().children} />
				</Dynamic>
			)}
		</Show>
	);
};

export default TableCell;
