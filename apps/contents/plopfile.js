import { Temporal } from 'temporal-polyfill';
import { ulid } from 'ulid';

function config(
	/**
	 * @type {import('plop').NodePlopAPI}
	 */
	plop,
) {
	plop.setHelper('date', () => {
		const date = Temporal.Now.zonedDateTimeISO('Asia/Tokyo').toString();

		return date;
	});
	plop.setHelper('ulid', () => {
		const id = ulid();

		return id;
	});
	plop.setGenerator('slug', {
		actions: [
			{
				path: 'contents/{{ulid}}/slug.md',
				templateFile: 'templates/contents/slug.md.hbs',
				type: 'add',
			},
		],
		description: 'Create a new slug',
		prompts: [
			{
				message: 'title please',
				name: 'title',
				type: 'input',
			},
			{
				message: 'description please',
				name: 'description',
				type: 'input',
			},
		],
	});
}

export default config;
