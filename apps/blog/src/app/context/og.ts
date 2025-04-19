export const createOgpImageUrl = (title: string, tags: string[]): URL => {
	const url = new URL('https://og.re-taro.dev');
	url.searchParams.append('title', title);
	url.searchParams.append('text', tags.join(','));

	return url;
};
