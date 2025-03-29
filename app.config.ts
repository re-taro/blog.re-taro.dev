import { join } from "node:path";
import { defineConfig } from "@solidjs/start/config";
import contentCollections from "@content-collections/vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { partytownVite } from "@qwik.dev/partytown/utils";

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
			partytownVite({
				dest: join(import.meta.dirname, "dist", "~partytown"),
			}),
		],
	},
});
