import type { Meta, StoryObj } from "storybook-framework-qwik";

import Footer from "./Footer";

type T = typeof Footer;

const meta: Meta = {
	title: "features/Footer",
	component: Footer,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
} satisfies Meta<T>;

type Story = StoryObj<T>;

export const Default: Story = {
	args: {
		plainTitle: "plainTitle",
		slug: "01HX6M7FGF5ZKG6KC28SG5V1AW",
	},
};

export default meta;
