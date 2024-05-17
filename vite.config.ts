/// <reference types="vitest" />

import { join } from "node:path";
import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { partytownVite } from "@builder.io/partytown/utils";
import { macroPlugin } from "@builder.io/vite-plugin-macro";
import contentCollections from "@content-collections/vite";
import { configDefaults } from "vitest/config";

export default defineConfig(({ mode }) => {
	return {
		plugins: [
			macroPlugin({
				preset: "pandacss",
				filter: (ident, id) => {
					return (
						["css", "jsx", "patterns", "tokens", "types"].includes(ident)
						&& !!id.match(/\/styled-system\/{css,jsx,patterns,tokens,types}\Z/g)
						&& (id.startsWith(".") || id.startsWith("~"))
					);
				},
			}),
			qwikCity(),
			qwikVite(),
			tsconfigPaths(),
			partytownVite({ dest: join(__dirname, "dist", "~partytown") }),
			mode !== "test" && contentCollections(),
		],
		preview: {
			headers: {
				"Cache-Control": "public, max-age=600",
			},
		},
		test: {
			testTransformMode: {
				ssr: ["**/*"],
			},
			exclude: [...configDefaults.exclude, "tests/**/*"],
		},
	};
});
