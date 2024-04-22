import { defineConfig } from "@pandacss/dev";

import { removeUnusedKeyframes } from "./removeUnusedKeyframse";
import { removeUnusedCssVars } from "./removeUnusedvars";

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
});
