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
		description: "Create a new page",
		prompts: [
			{
				type: "list",
				name: "parent",
				message: "/{path please}/...",
				choices: pages,
			},
			{
				type: "input",
				name: "name",
				message: "page name please.(This will be the name of the endpoint)",
			},
		],
		actions: (data) => {
			/**
			 * @type {import("plop").ActionType[]}
			 */
			const actions = [];

			if (data?.parent === "") {
				actions.push({
					type: "add",
					path: "src/routes/{{name}}/index.tsx",
					templateFile: "templates/pages/page.tsx.hbs",
				});

				actions.push({
					type: "add",
					path: "tests/{{name}}.test.ts",
					templateFile: "templates/tests/page.test.ts.hbs",
				});
			}
			else {
				actions.push({
					type: "add",
					path: "src/routes/{{parent}}/{{name}}/index.tsx",
					templateFile: "templates/pages/page.tsx.hbs",
				});

				actions.push({
					type: "add",
					path: "tests/{{parent}}/{{name}}.test.ts",
					templateFile: "templates/tests/page.test.ts.hbs",
				});
			}

			return actions;
		},
	});
	plop.setGenerator("component", {
		description: "Create a new component",
		prompts: [
			{
				type: "input",
				name: "name",
				message: "component name please",
			},
		],
		actions: [
			{
				type: "add",
				path: "src/components/{{pascalCase name}}/{{pascalCase name}}.tsx",
				templateFile: "templates/components/component.tsx.hbs",
			},
			{
				type: "add",
				path: "src/components/{{pascalCase name}}/{{pascalCase name}}.stories.ts",
				templateFile: "templates/components/component.stories.ts.hbs",
			},
		],
	});
	plop.setGenerator("feature", {
		description: "Create a new feature",
		prompts: [
			{
				type: "list",
				name: "parent",
				message: "app/routes/{path please}/features/...",
				choices: pages,
			},
			{
				type: "input",
				name: "name",
				message: "feature name please",
			},
		],
		actions: (data) => {
			/**
			 * @type {import("plop").ActionType[]}
			 */
			const actions = [];

			if (data?.parent === "") {
				actions.push({
					type: "add",
					path: "src/routes/features/{{ pascalCase name }}/{{ pascalCase name }}.tsx",
					templateFile: "templates/components/component.tsx.hbs",
				});

				actions.push({
					type: "add",
					path: "src/routes/features/{{ pascalCase name }}/{{ pascalCase name }}.stories.ts",
					templateFile: "templates/components/component.stories.ts.hbs",
				});
			}
			else {
				actions.push({
					type: "add",
					path: "src/routes/{{parent}}/features/{{ pascalCase name }}/{{ pascalCase name }}.tsx",
					templateFile: "templates/components/component.tsx.hbs",
				});

				actions.push({
					type: "add",
					path: "src/routes/{{parent}}/features/{{ pascalCase name }}/{{ pascalCase name }}.stories.ts",
					templateFile: "templates/components/component.stories.ts.hbs",
				});
			}

			return actions;
		},
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
		description: "Create a new slug",
		prompts: [
			{
				type: "input",
				name: "title",
				message: "title please",
			},
			{
				type: "input",
				name: "description",
				message: "description please",
			},
		],
		actions: [
			{
				type: "add",
				path: "contents/{{ulid}}/slug.md",
				templateFile: "templates/contents/slug.md.hbs",
			},
		],
	});
}

export default config;
