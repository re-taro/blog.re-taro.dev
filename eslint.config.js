import { re_taro } from '@re-taro/configs/eslint';

export default re_taro(
	{
		css: {
			rules: {
				'css/use-baseline': 'off',
			},
		},
	},
	{
		ignores: ['apps/blog/worker-configuration.d.ts','apps/contents/worker-configuration.d.ts', 'packages/rollup/index.d.ts', 'apps/contents/**/*.md'],
	},
);
