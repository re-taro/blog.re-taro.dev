// @ts-check

import { re_taro } from "@re-taro/eslint-config";

export default re_taro({
	typescript: true,
	formatters: true,
	markdown: false,
	ignores: ["src/styled-system"],
});
