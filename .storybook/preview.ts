import type { Parameters } from "storybook-framework-qwik";

import "../src/global.css";

export const parameters: Parameters = {
	a11y: {
		config: {},
		options: {
			checks: { "color-contrast": { options: { noScroll: true } } },
			restoreScroll: true,
		},
	},
	backgrounds: {
		default: "main",
		values: [
			{
				name: "main",
				value: "#0b1215",
			},
			{
				name: "secondary",
				value: "#232a2c",
			},
			{
				name: "teriary",
				value: "#3c4144",
			},
		],
	},
	options: {
		showRoots: true,
	},
};
