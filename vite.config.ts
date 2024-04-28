import { join } from "node:path";
import { defineConfig } from "vite";
import { qwikVite } from "@builder.io/qwik/optimizer";
import { qwikCity } from "@builder.io/qwik-city/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { partytownVite } from "@builder.io/partytown/utils";
import { macroPlugin } from "@builder.io/vite-plugin-macro";

export default defineConfig(() => {
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
		],
		preview: {
			headers: {
				"Cache-Control": "public, max-age=600",
			},
		},
	};
});
