import { ORIGIN } from "~/constants";

function joinPath(...paths: Array<string>): string {
	return paths.join("/").replaceAll(/\/+/gu, "/").replaceAll("./", "");
}

function getUrl(...paths: Array<string>): URL {
	return new URL(joinPath(...paths), ORIGIN);
}

export function getPostUrl(slug: string): URL {
	return getUrl("/p", slug);
}

export function getEditPostUrl(slug: string): URL {
	return new URL(
		joinPath("re-taro/blog.re-taro.dev/blob/master/contents/", slug, "slug.md"),
		"https://github.com",
	);
}
