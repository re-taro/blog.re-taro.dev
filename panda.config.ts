import { defineConfig } from "@pandacss/dev";

import { removeUnusedKeyframes } from "./removeUnusedKeyframse";
import { removeUnusedCssVars } from "./removeUnusedvars";
import { tokens } from "~/styles/tokens";
import { globalCss } from "~/styles/globalCss";

export default defineConfig({
	jsxFramework: "qwik",
	include: ["./src/**/*.tsx"],
	exclude: [],
	outdir: "src/styled-system",
	minify: true,
	hash: true,
	clean: true,
	lightningcss: true,
	browserslist: ["defaults and > 0.3%"],
	strictTokens: true,
	strictPropertyValues: true,
	preflight: true,
	hooks: {
		"cssgen:done": ({ artifact, content }) => {
			if (artifact === "styles.css")
				return removeUnusedCssVars(removeUnusedKeyframes(content));
		},
	},
	conditions: {
		extend: {
			supportsAlternativeTextAfter: "@supports (content: \"a\" / \"b\")",
		},
	},
	theme: {
		extend: {
			breakpoints: {
				md: "768px",
			},
			tokens,
		},
	},
	globalCss,
});
