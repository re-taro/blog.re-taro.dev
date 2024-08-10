import fs from "node:fs";

import { Temporal } from "temporal-polyfill";
import { ulid } from "ulid";

const pages = fs
	.readdirSync("src/routes", { recursive: true })
	.map((it) => {
		const path = `src/routes/${it}`;
		const stat = fs.statSync(path);
		if (stat.isDirectory() && !it.includes("features"))
			return { name: it, value: it };

		return null;
	})
	.filter(it => it !== null);

pages.push({ name: "root", value: "" });

function config(
	/**
	 * @type {import("plop").NodePlopAPI}
	 */
	plop,
) {
	plop.setGenerator("page", {
		actions: (data) => {
			/**
			 * @type {import("plop").ActionType[]}
			 */
			const actions = [];

			if (data?.parent === "") {
				actions.push({
					path: "src/routes/{{name}}/index.tsx",
					templateFile: "templates/pages/page.tsx.hbs",
					type: "add",
				});

				actions.push({
					path: "tests/{{name}}.test.ts",
					templateFile: "templates/tests/page.test.ts.hbs",
					type: "add",
				});
			}
			else {
				actions.push({
					path: "src/routes/{{parent}}/{{name}}/index.tsx",
					templateFile: "templates/pages/page.tsx.hbs",
					type: "add",
				});

				actions.push({
					path: "tests/{{parent}}/{{name}}.test.ts",
					templateFile: "templates/tests/page.test.ts.hbs",
					type: "add",
				});
			}

			return actions;
		},
		description: "Create a new page",
		prompts: [
			{
				choices: pages,
				message: "/{path please}/...",
				name: "parent",
				type: "list",
			},
			{
				message: "page name please.(This will be the name of the endpoint)",
				name: "name",
				type: "input",
			},
		],
	});
	plop.setGenerator("component", {
		actions: [
			{
				path: "src/components/{{pascalCase name}}/{{pascalCase name}}.tsx",
				templateFile: "templates/components/component.tsx.hbs",
				type: "add",
			},
			{
				path: "src/components/{{pascalCase name}}/{{pascalCase name}}.stories.ts",
				templateFile: "templates/components/component.stories.ts.hbs",
				type: "add",
			},
		],
		description: "Create a new component",
		prompts: [
			{
				message: "component name please",
				name: "name",
				type: "input",
			},
		],
	});
	plop.setGenerator("feature", {
		actions: (data) => {
			/**
			 * @type {import("plop").ActionType[]}
			 */
			const actions = [];

			if (data?.parent === "") {
				actions.push({
					path: "src/routes/features/{{ pascalCase name }}/{{ pascalCase name }}.tsx",
					templateFile: "templates/components/component.tsx.hbs",
					type: "add",
				});

				actions.push({
					path: "src/routes/features/{{ pascalCase name }}/{{ pascalCase name }}.stories.ts",
					templateFile: "templates/components/component.stories.ts.hbs",
					type: "add",
				});
			}
			else {
				actions.push({
					path: "src/routes/{{parent}}/features/{{ pascalCase name }}/{{ pascalCase name }}.tsx",
					templateFile: "templates/components/component.tsx.hbs",
					type: "add",
				});

				actions.push({
					path: "src/routes/{{parent}}/features/{{ pascalCase name }}/{{ pascalCase name }}.stories.ts",
					templateFile: "templates/components/component.stories.ts.hbs",
					type: "add",
				});
			}

			return actions;
		},
		description: "Create a new feature",
		prompts: [
			{
				choices: pages,
				message: "app/routes/{path please}/features/...",
				name: "parent",
				type: "list",
			},
			{
				message: "feature name please",
				name: "name",
				type: "input",
			},
		],
	});
	plop.setHelper("date", () => {
		const date = Temporal.Now.zonedDateTimeISO("Asia/Tokyo").toString();

		return date;
	});
	plop.setHelper("ulid", () => {
		const id = ulid();

		return id;
	});
	plop.setGenerator("slug", {
		actions: [
			{
				path: "contents/{{ulid}}/slug.md",
				templateFile: "templates/contents/slug.md.hbs",
				type: "add",
			},
		],
		description: "Create a new slug",
		prompts: [
			{
				message: "title please",
				name: "title",
				type: "input",
			},
			{
				message: "description please",
				name: "description",
				type: "input",
			},
		],
	});
}

export default config;
