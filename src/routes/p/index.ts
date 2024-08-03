import { redirect } from "@solidjs/router";
import { GET as SolidGET } from "@solidjs/start";
import { allBlogs } from "content-collections";
import { Temporal } from "temporal-polyfill";

export const GET = SolidGET(() => {
	"use server";

	const latestPost = allBlogs.filter(b => import.meta.env.DEV || b.published).sort((a, b) => Temporal.ZonedDateTime.compare(
		Temporal.ZonedDateTime.from(b.publishedAt),
		Temporal.ZonedDateTime.from(a.publishedAt),
	))[0];

	return redirect(`/p/${latestPost._meta.directory}`);
});
