import path from 'node:path';
import { partytownVite } from '@qwik.dev/partytown/utils';
import { redwood } from 'rwsdk/vite';
import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
	plugins: [
		redwood({
			// @ts-expect-error Type 'string' is not assignable to type '"development" | "production" | undefined'.ts(2322)
			mode,
		}),
		partytownVite({
			dest: path.join(import.meta.dirname, 'dist', 'client', '~partytown'),
		}),
	],
}));
