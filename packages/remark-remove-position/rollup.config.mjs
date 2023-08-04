import typescript from "@rollup/plugin-typescript";
import pkg from "./package.json" assert { type: "json" };
import terser from "@rollup/plugin-terser";
import analyzed from "./_packelyze-analyzed.json" assert { type: "json" };

const externals = [
  ...Object.keys(pkg.dependencies),
  ...Object.keys(pkg.devDependencies),
];

/** @type {import('rollup').RollupOptions} */
const options = {
  input: "src/index.ts",
  output: [
    {
      file: pkg.main,
      format: "es",
      sourcemap: false,
    },
  ],
  external: (id) => externals.some((d) => id.startsWith(d)),
  plugins: [
    typescript({
      tsconfig: "./tsconfig.json",
      outDir: ".",
      declaration: true,
    }),
    terser({
      mangle: {
        properties: {
          reserved: analyzed.reserved,
          regex: /.*/,
        },
      },
    }),
  ],
};

export default options;
