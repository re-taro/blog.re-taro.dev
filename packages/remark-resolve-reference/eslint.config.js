import { re_taro } from "@re-taro/eslint-config";

export default re_taro(
  {
    parserOptions: {
      project: "./tsconfig.json",
    },
  },
  {
    ignores: [
      "dist",
      "lib",
      "src/*.js",
      "rollup.config.mjs",
      "vitest.config.ts",
    ],
  },
);
