// @ts-check

import cjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import nodeResolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import terser from '@rollup/plugin-terser';
import typescript from '@rollup/plugin-typescript';
import { defineConfig } from 'rollup';
import outputSize, { summarize } from 'rollup-plugin-output-size';

/**
 * @param {import('rollup').RollupOptions} options
 */
export const createRollupConfig = (options) =>
	defineConfig({
		...options,

		input: 'src/index.ts',
		output: {
			file: 'dist/index.js',
			format: 'esm',
			sourcemap: true,
		},
		plugins: [
			cjs(),
			nodeResolve({
				preferBuiltins: true,
			}),
			json(),
			replace({
				preventAssignment: true,
				values: {
					'import.meta.env.NODE_ENV': JSON.stringify('production'),
					'process.env.NODE_ENV': JSON.stringify('production'),
				},
			}),
			typescript({
				outputToFilesystem: true,
				declaration: true,
				declarationDir: 'dist',
				emitDeclarationOnly: true,
				isolatedDeclarations: true,
				rootDir: 'src',
			}),
			terser({
				compress: {
					passes: 5,
				},
				mangle: true,
			}),
			outputSize({
				summary(summary) {
					// eslint-disable-next-line no-console
					console.log(summarize(summary));
				},
			}),
		],
	});
