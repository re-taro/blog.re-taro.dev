import { defineConfig } from "@pandacss/dev";

import { removeUnusedKeyframes } from "./removeUnusedKeyframse";
import { removeUnusedCssVars } from "./removeUnusedvars";
import { tokens } from "~/styles/tokens";
import { globalCss } from "~/styles/globalCss";

export default defineConfig({
	browserslist: ["defaults and > 0.3%"],
	clean: true,
	conditions: {
		extend: {
			supportsAlternativeTextAfter: "@supports (content: \"a\" / \"b\")",
		},
	},
	exclude: [],
	globalCss,
	hash: true,
	hooks: {
		"cssgen:done": ({ artifact, content }) => {
			if (artifact === "styles.css")
				return removeUnusedCssVars(removeUnusedKeyframes(content));
		},
	},
	include: ["./src/**/*.tsx"],
	jsxFramework: "qwik",
	lightningcss: true,
	minify: true,
	outdir: "src/styled-system",
	preflight: true,
	strictPropertyValues: true,
	strictTokens: true,
	theme: {
		extend: {
			breakpoints: {
				md: "768px",
			},
			tokens,
		},
	},
});
