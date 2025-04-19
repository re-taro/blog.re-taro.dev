import { defineConfig } from '@pandacss/dev';
import { removeUnusedKeyframes } from './removeUnusedKeyframse';
import { removeUnusedCssVars } from './removeUnusedvars';
import { globalCss } from './src/app/styles/globalCss';
import { tokens } from './src/app/styles/tokens';

export default defineConfig({
	browserslist: ['defaults and > 0.3%'],
	clean: true,
	conditions: {
		extend: {
			supportsAlternativeTextAfter: '@supports (content: "a" / "b")',
		},
	},
	exclude: [],
	globalCss,
	hash: true,
	hooks: {
		// @ts-expect-error Not all code paths return a value.ts(7030)
		'cssgen:done': ({ artifact, content }) => {
			if (artifact === 'styles.css') return removeUnusedCssVars(removeUnusedKeyframes(content));
		},
	},
	include: ['./src/**/*.tsx'],
	jsxFramework: 'qwik',
	lightningcss: true,
	minify: true,
	preflight: true,
	strictPropertyValues: true,
	strictTokens: true,
	theme: {
		extend: {
			breakpoints: {
				md: '768px',
			},
			tokens,
		},
	},
});
