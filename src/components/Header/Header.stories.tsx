import type { Meta, StoryObj } from "storybook-framework-qwik";
import { QwikCityMockProvider } from "@builder.io/qwik-city";

import { Header } from "./Header";

type T = typeof Header;

const meta: Meta = {
	title: "Header",
	component: Header,
	parameters: {
		layout: "centered",
	},
	tags: ["autodocs"],
	decorators: [Story => <QwikCityMockProvider><Story /></QwikCityMockProvider>],
} satisfies Meta<T>;

type Story = StoryObj<T>;

export const Default: Story = {};

export default meta;
