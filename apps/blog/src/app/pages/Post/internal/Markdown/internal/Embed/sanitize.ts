import DOMPurify from 'dompurify';

export const sanitize = (html: string): string => {
	return DOMPurify.sanitize(html, {
		ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling'],
		ADD_TAGS: ['iframe'],
	});
};
