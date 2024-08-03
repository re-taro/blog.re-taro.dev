import type { Component } from "solid-js";
import { Dynamic } from "solid-js/web";
import type { MarkdownProps } from "./Markdown";
import MarkdownChildren from "./Markdown";
import { cva } from "~/styled-system/css";

interface Props extends MarkdownProps {
	align: "left" | "center" | "right" | null;
	head: boolean;
}

const tabCell = cva({
	base: {
		"&:last-child": {
			borderRight: "[2px solid {colors.text.main}]",
		},

		"lg": {
			paddingInlineEnd: "[1.6em]",
		},

		"_supportsAlternativeTextAfter": {
			"padding": "[unset]",
			"border": "none",
			"paddingInlineEnd": "[.8em]",
			"clear": "left",

			"_before": {
				content: "'|' / ''",
				fontWeight: "normal",
				marginInlineEnd: "[.8em]",
				float: "[left]",
			},

			"&:last-child": {
				padding: "[unset]",
				border: "none",
			},
		},
	},
	variants: {
		head: {
			true: {
				padding: "[0 1rem .5rem 1rem]",
				borderLeft: "[2px solid {colors.text.main}]",
				borderBottom: "[2px dashed {colors.text.main}]",

				_supportsAlternativeTextAfter: {
					position: "relative",

					_before: {
						content: "'|\\A|' / ''",
						whiteSpace: "pre",
					},

					_after: {
						content: "'------------------------------------------------------------------' / ''",
						whiteSpace: "nowrap",
						overflow: "hidden",
						textOverflow: "clip",
						position: "absolute",
						letterSpacing: "[.1em]",
						fontWeight: "normal",
						top: "[100%]",
						transform: "translateY(-100%)",
						left: "[1.2em]",
						right: "[.4em]",
					},
				},
			},
			false: {
				paddingY: "2",
				paddingX: "4",
				borderLeft: "[2px solid {colors.text.main}]",
			},
		},
		align: {
			left: {
				textAlign: "left",
			},
			center: {
				textAlign: "center",
			},
			right: {
				textAlign: "right",
			},
		},
	},
	compoundVariants: [
		{
			head: true,
			align: "left",
			css: {
				_supportsAlternativeTextAfter: {
					_after: {
						content: "':-----------------------------------------------------------------' / ''",
					},
				},
			},
		},
		{
			head: true,
			align: "right",
			css: {
				_supportsAlternativeTextAfter: {
					_after: {
						content: "':-----------------------------------------------------------------' / ''",
						direction: "rtl",
					},
				},
			},
		},
	],
});

const TableCell: Component<Props> = (props) => {
	if (props.node.type === "tableCell") {
		const tag = props.head ? "th" : "td";
		return (
			<Dynamic component={tag} class={tabCell({ head: props.head, align: props.align === null ? undefined : props.align })}>
				<MarkdownChildren nodes={props.node.children} footnoteDefs={props.footnoteDefs} />
			</Dynamic>
		);
	}
	else {
		return null;
	}
};

export default TableCell;
