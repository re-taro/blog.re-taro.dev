import { component$ } from "@builder.io/qwik";
import { Temporal } from "temporal-polyfill";
import Tags from "../Tags/Tags";
import Heading from "~/components/Markdown/Heading";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";
import type { SystemStyleObject } from "~/styled-system/types";

interface Props {
	title: A.Heading;
	publishedAt: string;
	updatedAt?: string | undefined;
	tags: Array<string>;
	css?: SystemStyleObject | undefined;
}

export default component$<Props>(({ title, publishedAt, updatedAt, tags, css: cssStyle }) => {
	return (
		<header
			class={css({
				"display": "grid",
				"gridTemplateAreas": `"meta" "title"`,
				"gridTemplateRows": "[repeat(2, auto)]",
				"gap": "3",
				"paddingBottom": "8",

				"& > .markdown_heading": {
					gridArea: "title",
				},
			}, cssStyle)}
		>
			<dl
				class={css({
					display: "flex",
					flexWrap: "wrap",
					gridArea: "meta",
					columnGap: "4",
					alignItems: "center",
				})}
			>
				<div
					class={css({
						"display": "inline",
						"color": "text.main",

						"& > dt": {
							display: "inline",
							marginRight: "1",

							_after: {
								content: "':'",
							},

							_supportsAlternativeTextAfter: {
								_after: {
									content: "':' / ''",
								},
							},
						},

						"& > dd": {
							display: "inline",
						},
					})}
				>
					<dt>投稿日</dt>
					<dd>
						<time dateTime={Temporal.ZonedDateTime.from(publishedAt).toString({ timeZoneName: "never" })}>
							{Temporal.ZonedDateTime.from(publishedAt)
								.toPlainDate()
								.toLocaleString("ja-JP")}
						</time>
					</dd>
				</div>
				{typeof updatedAt !== "undefined" && (
					<div
						class={css({
							"display": "inline",
							"color": "text.main",

							"& > dt": {
								display: "inline",
								marginRight: "1",

								_after: {
									content: "':'",
								},

								_supportsAlternativeTextAfter: {
									_after: {
										content: "':' / ''",
									},
								},
							},

							"& > dd": {
								display: "inline",
							},
						})}
					>
						<dt>更新日</dt>
						<dd>
							<time dateTime={Temporal.ZonedDateTime.from(updatedAt).toString({ timeZoneName: "never" })}>
								{Temporal.ZonedDateTime.from(updatedAt)
									.toPlainDate()
									.toLocaleString("ja-JP")}
							</time>
						</dd>
					</div>
				)}
				<div
					class={css({
						"display": "inline",
						"color": "text.main",

						"& > dt": {
							display: "inline",
							marginRight: "1",

							_after: {
								content: "':'",
							},

							_supportsAlternativeTextAfter: {
								_after: {
									content: "':' / ''",
								},
							},
						},

						"& > dd": {
							display: "inline",
						},
					})}
				>
					<dt>タグ</dt>
					<dd>
						<Tags tags={tags} />
					</dd>
				</div>
			</dl>
			<Heading node={title} footnoteDefs={[]} />
		</header>
	);
});
