// @ts-check

import { re_taro } from "@re-taro/eslint-config";
import qwikPlugin from "eslint-plugin-qwik";

export default re_taro({
	typescript: true,
	formatters: true,
	ignores: ["src/styled-system"],
}, {
	files: ["src/**/*.tsx"],
	plugins: {
		qwik: qwikPlugin,
	},
	languageOptions: {
		parserOptions: {
			project: ["./tsconfig.json"],
		},
	},
	rules: {
		...qwikPlugin.configs.recommended.rules,
	},
});
