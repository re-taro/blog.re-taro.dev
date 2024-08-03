export function createOgpImageUrl(title: string, tags: Array<string>): URL {
	const url = new URL("https://og.re-taro.dev");
	url.searchParams.append("title", title);
	url.searchParams.append("text", tags.join(","));

	return url;
}
