import { configDefaults, defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
	plugins: [
		tsconfigPaths(),
	],
	test: {
		testTransformMode: {
			ssr: ["**/*"],
		},
		exclude: [...configDefaults.exclude, "tests/**/*"],
	},
});
