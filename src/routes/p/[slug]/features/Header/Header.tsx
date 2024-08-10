import { Temporal } from "temporal-polyfill";
import type { Component } from "solid-js";
import { Show } from "solid-js";
import Tags from "../Tags/Tags";
import Heading from "~/components/Markdown/Heading";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";
import type { SystemStyleObject } from "~/styled-system/types";

interface Props {
	publishedAt: string;
	tags: Array<string>;
	title: A.Heading;
	css?: SystemStyleObject;
	updatedAt?: string;
}

const Header: Component<Props> = (props) => {
	return (
		<header
			class={css({
				"& > .markdown_heading": {
					gridArea: "title",
				},
				"display": "grid",
				"gap": "3",
				"gridTemplateAreas": `"meta" "title"`,
				"gridTemplateRows": "[repeat(2, auto)]",
				"paddingBottom": "8",
			}, props.css)}
		>
			<dl
				class={css({
					alignItems: "center",
					columnGap: "4",
					display: "flex",
					flexWrap: "wrap",
					gridArea: "meta",
				})}
			>
				<div
					class={css({
						"& > dd": {
							display: "inline",
						},
						"& > dt": {
							_after: {
								content: "':'",
							},
							_supportsAlternativeTextAfter: {
								_after: {
									content: "':' / ''",
								},
							},
							display: "inline",
							marginRight: "1",
						},
						"color": "text.main",
						"display": "inline",
					})}
				>
					<dt>投稿日</dt>
					<dd>
						<time dateTime={Temporal.ZonedDateTime.from(props.publishedAt).toString({ timeZoneName: "never" })}>
							{Temporal.ZonedDateTime.from(props.publishedAt)
								.toPlainDate()
								.toLocaleString("ja-JP")}
						</time>
					</dd>
				</div>
				<Show when={props.updatedAt}>
					{updatedAt => (
						<div
							class={css({
								"& > dd": {
									display: "inline",
								},
								"& > dt": {
									_after: {
										content: "':'",
									},
									_supportsAlternativeTextAfter: {
										_after: {
											content: "':' / ''",
										},
									},
									display: "inline",
									marginRight: "1",
								},
								"color": "text.main",
								"display": "inline",
							})}
						>
							<dt>更新日</dt>
							<dd>
								<time dateTime={Temporal.ZonedDateTime.from(updatedAt()).toString({ timeZoneName: "never" })}>
									{Temporal.ZonedDateTime.from(updatedAt())
										.toPlainDate()
										.toLocaleString("ja-JP")}
								</time>
							</dd>
						</div>
					)}
				</Show>
				<div
					class={css({
						"& > dd": {
							display: "inline",
						},
						"& > dt": {
							_after: {
								content: "':'",
							},
							_supportsAlternativeTextAfter: {
								_after: {
									content: "':' / ''",
								},
							},
							display: "inline",
							marginRight: "1",
						},
						"color": "text.main",
						"display": "inline",
					})}
				>
					<dt>タグ</dt>
					<dd>
						<Tags tags={props.tags} />
					</dd>
				</div>
			</dl>
			<Heading footnoteDefs={[]} node={props.title} />
		</header>
	);
};

export default Header;
