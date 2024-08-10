// @ts-check

import { re_taro } from "@re-taro/eslint-config";

export default re_taro({
	formatters: true,
	ignores: ["src/styled-system"],
	markdown: false,
}, {
	files: ["**/*.tsx"],
	rules: {
		"solid/reactivity": "off",
	},
});
