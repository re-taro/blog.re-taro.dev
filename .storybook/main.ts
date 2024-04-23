import type { StorybookConfig } from "storybook-framework-qwik";

const config: StorybookConfig = {
	stories: ["../src/**/*.stories.@(ts|tsx)"],
	addons: [
		"@storybook/addon-links",
		"@storybook/addon-essentials",
		"@storybook/addon-interactions",
		"@storybook/addon-a11y",
		"@storybook/addon-actions",
		"@storybook/addon-backgrounds",
	],
	framework: {
		name: "storybook-framework-qwik",
	},
	core: {
		renderer: "storybook-framework-qwik",
	},
	docs: {
		autodocs: "tag",
	},
	staticDirs: ["../public"],
	viteFinal: (config) => {
		return config;
	},
};

export default config;
