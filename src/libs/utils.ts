import { ORIGIN } from "~/constants";

function joinPath(...paths: Array<string>): string {
	return paths.join("/").replaceAll(/\/+/gu, "/").replaceAll("./", "");
}

export function getUrl(...paths: Array<string>): URL {
	return new URL(joinPath(...paths), ORIGIN);
}
