import { ORIGIN } from '../../../../constants';

const joinPath = (...paths: string[]): string => {
	return paths.join('/').replaceAll(/\/+/gu, '/').replaceAll('./', '');
};

const getUrl = (...paths: string[]): URL => {
	return new URL(joinPath(...paths), ORIGIN);
};

export const getPostUrl = (slug: string): URL => {
	return getUrl('/p', slug);
};

export const getEditPostUrl = (slug: string): URL => {
	return new URL(joinPath('re-taro/blog.re-taro.dev/blob/main/contents/', slug, 'slug.md'), 'https://github.com');
};
