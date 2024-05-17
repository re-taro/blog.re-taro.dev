import type { Parameters } from "storybook-framework-qwik";

import "../src/global.css";

export const parameters: Parameters = {
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
};
