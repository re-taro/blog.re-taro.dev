import { defineTokens } from "@pandacss/dev";

import { colors } from "./colors";

export const tokens = defineTokens({
	lineHeights: {
		normal: {
			value: 1.5,
		},
		tight: {
			value: 1.25,
		},
		none: {
			value: 1,
		},
	},
	fontWeights: {
		normal: {
			value: 400,
		},
		bold: {
			value: 600,
		},
	},
	fontSizes: {
		"4xl": {
			value: "3rem",
		},
		"3xl": {
			value: "2.5rem",
		},
		"2xl": {
			value: "2rem",
		},
		"xl": {
			value: "1.5rem",
		},
		"l": {
			value: "1.125rem",
		},
		"m": {
			value: "1rem",
		},
		"s": {
			value: "0.875rem",
		},
		"xs": {
			value: "0.75rem",
		},
		"2xs": {
			value: "0.625rem",
		},
	},
	colors,
});
