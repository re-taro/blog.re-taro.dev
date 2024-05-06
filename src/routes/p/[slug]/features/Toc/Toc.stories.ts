import type { Meta, StoryObj } from "storybook-framework-qwik";
import Toc from "./Toc";
import type * as A from "~/libs/plugins/ast/ast";

type T = typeof Toc;

const meta: Meta = {
	title: "features/Toc",
	component: Toc,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<T>;

type Story = StoryObj<T>;

export const Default: Story = {
	args: {
		toc: [
			{
				type: "toc",
				plain: "test1",
				id: "test1",
				children: [
					{
						type: "toc",
						plain: "test1-2",
						id: "test1-2",
						children: [
							{
								type: "toc",
								plain: "test1-3",
								id: "test1-3",
								children: [],
							},
						],
					},
				],
			},
			{
				type: "toc",
				plain: "test2",
				id: "test2",
				children: [
					{
						type: "toc",
						plain: "test2-2",
						id: "test2-2",
						children: [],
					},
				],
			},
			{
				type: "toc",
				plain: "test3",
				id: "test3",
				children: [],
			},
		] satisfies Array<A.Toc>,
	},
};

export default meta;
