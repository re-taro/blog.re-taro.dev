import type { Meta, StoryObj } from "storybook-framework-qwik";
import { QwikCityMockProvider } from "@builder.io/qwik-city";
import Tags from "./Tags";

type T = typeof Tags;

const meta: Meta = {
	title: "features/Tags",
	component: Tags,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [Story => <QwikCityMockProvider><Story /></QwikCityMockProvider>],
} satisfies Meta<T>;

type Story = StoryObj<T>;

export const Default: Story = {
	args: {
		tags: ["test", "tag", "example"],
	},
};

export default meta;
