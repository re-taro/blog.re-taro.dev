import { IS_DEV } from 'rwsdk/constants';
import type { RouteMiddleware } from 'rwsdk/router';

export const setCommonHeaders =
	(): RouteMiddleware =>
	// eslint-disable-next-line unicorn/consistent-function-scoping
	({ headers }) => {
		if (!IS_DEV) {
			headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
		}
		headers.set('X-Content-Type-Options', 'nosniff');
		headers.set('Referrer-Policy', 'no-referrer');
		headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
	};
