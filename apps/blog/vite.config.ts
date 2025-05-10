import path from 'node:path';
import { partytownVite } from '@qwik.dev/partytown/utils';
import { redwood } from 'rwsdk/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [
		redwood(),
		partytownVite({
			dest: path.join(import.meta.dirname, 'dist', 'client', '~partytown'),
		}),
	],
});
