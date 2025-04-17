import { defineTokens } from '@pandacss/dev';
import { colors } from './colors';

export const tokens = defineTokens({
	colors,
	fonts: {
		mono: {
			value: "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace",
		},
	},
	fontSizes: {
		'2xl': {
			value: '2rem',
		},
		'2xs': {
			value: '0.625rem',
		},
		'3xl': {
			value: '2.5rem',
		},
		'4xl': {
			value: '3rem',
		},
		'l': {
			value: '1.125rem',
		},
		'm': {
			value: '1rem',
		},
		'ml': {
			value: '1.3rem',
		},
		's': {
			value: '0.875rem',
		},
		'sl': {
			value: '1.2rem',
		},
		'xl': {
			value: '1.5rem',
		},
		'xs': {
			value: '0.75rem',
		},
	},
	fontWeights: {
		bold: {
			value: 600,
		},
		normal: {
			value: 400,
		},
	},
	lineHeights: {
		none: {
			value: 1,
		},
		normal: {
			value: 1.5,
		},
		tight: {
			value: 1.25,
		},
	},
});
