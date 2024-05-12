import type { Meta, StoryObj } from "storybook-framework-qwik";
import { QwikCityMockProvider } from "@builder.io/qwik-city";
import Header from "./Header";
import type * as A from "~/libs/plugins/ast/ast";

type T = typeof Header;

const meta: Meta = {
	title: "features/Header",
	component: Header,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [Story => <QwikCityMockProvider><Story /></QwikCityMockProvider>],
} satisfies Meta<T>;

type Story = StoryObj<T>;

export const Default: Story = {
	args: {
		title: {
			type: "heading",
			level: 1,
			id: "initial",
			plain: "initial",
			children: [
				{
					type: "text",
					value: "initial",
					position: {
						start: {
							line: 1,
							column: 3,
							offset: 2,
						},
						end: {
							line: 1,
							column: 10,
							offset: 9,
						},
					},
				},
			],
			position: {
				start: {
					line: 1,
					column: 1,
					offset: 0,
				},
				end: {
					line: 1,
					column: 10,
					offset: 9,
				},
			},
		} satisfies A.Heading,
		publishedAt: "2004-04-25T05:52:00.000+09:00[Asia/Tokyo]",
		tags: ["tag1", "tag2"],
	},
};

export const WithUpdatedAt: Story = {
	args: {
		title: {
			type: "heading",
			level: 1,
			id: "initial",
			plain: "initial",
			children: [
				{
					type: "text",
					value: "initial",
					position: {
						start: {
							line: 1,
							column: 3,
							offset: 2,
						},
						end: {
							line: 1,
							column: 10,
							offset: 9,
						},
					},
				},
			],
			position: {
				start: {
					line: 1,
					column: 1,
					offset: 0,
				},
				end: {
					line: 1,
					column: 10,
					offset: 9,
				},
			},
		} satisfies A.Heading,
		publishedAt: "2004-04-25T05:52:00.000+09:00[Asia/Tokyo]",
		updatedAt: "2004-04-25T05:52:00.000+09:00[Asia/Tokyo]",
		tags: ["tag1", "tag2"],
	},
};

export default meta;
