import type { Meta, StoryObj } from "storybook-framework-qwik";
import Footnote from "./Footnote";
import type * as A from "~/libs/plugins/ast/ast";

type T = typeof Footnote;

const meta: Meta = {
	title: "Footnote",
	component: Footnote,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<T>;

type Story = StoryObj<T>;

export const Default: Story = {
	args: {
		footnotes: [
			{
				type: "footnoteDefinition",
				index: 0,
				count: 1,
				children: [
					{
						type: "paragraph",
						children: [
							{
								type: "inlineCode",
								value: "test",
								position: {
									start: {
										line: 11,
										column: 7,
										offset: 65,
									},
									end: {
										line: 11,
										column: 13,
										offset: 71,
									},
								},
							},
						],
						position: {
							start: {
								line: 11,
								column: 7,
								offset: 65,
							},
							end: {
								line: 11,
								column: 13,
								offset: 71,
							},
						},
					},
				],
				position: {
					start: {
						line: 11,
						column: 1,
						offset: 59,
					},
					end: {
						line: 11,
						column: 13,
						offset: 71,
					},
				},
			},
			{
				type: "footnoteDefinition",
				index: 0,
				count: 1,
				children: [
					{
						type: "paragraph",
						children: [
							{
								type: "text",
								value: "test ",
								position: {
									start: {
										line: 5,
										column: 7,
										offset: 28,
									},
									end: {
										line: 5,
										column: 12,
										offset: 33,
									},
								},
							},
							{
								type: "strong",
								children: [
									{
										type: "text",
										value: "1",
										position: {
											start: {
												line: 5,
												column: 14,
												offset: 35,
											},
											end: {
												line: 5,
												column: 15,
												offset: 36,
											},
										},
									},
								],
								position: {
									start: {
										line: 5,
										column: 12,
										offset: 33,
									},
									end: {
										line: 5,
										column: 17,
										offset: 38,
									},
								},
							},
						],
						position: {
							start: {
								line: 5,
								column: 7,
								offset: 28,
							},
							end: {
								line: 5,
								column: 17,
								offset: 38,
							},
						},
					},
				],
				position: {
					start: {
						line: 5,
						column: 1,
						offset: 22,
					},
					end: {
						line: 5,
						column: 17,
						offset: 38,
					},
				},
			},
		] satisfies Array<A.FootnoteDefinition>,
	},
};

export default meta;
