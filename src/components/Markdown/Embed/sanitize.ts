import DOMPurify from "dompurify";

export function sanitize(html: string) {
	return DOMPurify.sanitize(html, {
		ADD_ATTR: ["allow", "allowfullscreen", "frameborder", "scrolling"],
		ADD_TAGS: ["iframe"],
	});
}
