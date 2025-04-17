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
		ignores: ['app/worker-configuration.d.ts', 'packages/rollup/index.d.ts', 'app/contents/**/*.md'],
	},
);
