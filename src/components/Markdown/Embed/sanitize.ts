import DOMPurify from "isomorphic-dompurify";

export function sanitize(html: string) {
	return DOMPurify.sanitize(html, {
		ADD_TAGS: ["iframe"],
		ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
	});
}
