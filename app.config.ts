import { defineConfig } from "@solidjs/start/config";
import contentCollections from "@content-collections/vite";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	server: {
		prerender: {
			autoSubfolderIndex: false,
			crawlLinks: true,
		},
		preset: "cloudflare-pages",
	},
	vite: {
		plugins: [
			tsconfigPaths(),
			contentCollections(),
		],
	},
});
