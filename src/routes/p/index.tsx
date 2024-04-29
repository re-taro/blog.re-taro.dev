import type { RequestHandler } from "@builder.io/qwik-city";
import { allBlogs } from "content-collections";
import { Temporal } from "temporal-polyfill";

export const onGet: RequestHandler = ({ redirect }) => {
	const latestPost = allBlogs.filter(b => b.published).sort((a, b) => Temporal.PlainDate.compare(
		Temporal.PlainDate.from(a.publishedAt),
		Temporal.PlainDate.from(b.publishedAt),
	))[0];

	redirect(301, `/p/${latestPost._meta.path}`);
};
