import { component$ } from "@builder.io/qwik";
import { getEditPostUrl, getPostUrl } from "./helper";
import { css } from "~/styled-system/css";

interface Props {
	plainTitle: string;
	slug: string;
}

export default component$<Props>(({ plainTitle, slug }) => {
	const editUrl = getEditPostUrl(slug);

	const title = `${plainTitle} | blog.re-taro.dev`;
	const url = getPostUrl(slug).href;

	const twitterUrl = new URL("https://twitter.com/share");
	twitterUrl.searchParams.set("text", title);
	twitterUrl.searchParams.set("url", url);
	twitterUrl.searchParams.set("via", "re_taro_");
	twitterUrl.searchParams.set("related", "re_taro_");

	return (
		<footer
			class={css({
				marginTop: "8",
				textAlign: "end",
			})}
		>
			<ul
				class={css({
					display: "flex",
					flexWrap: "wrap",
					gap: "4",
					justifyContent: "flex-end",
				})}
			>
				<li
					class={css({
						marginRight: "auto",
					})}
				>
					<a
						href={editUrl.href}
						target="_blank"
						rel="noreferrer"
						class={css({
							paddingX: "4",
							paddingY: "2",
							color: "text.secondary",
							border: "[1px solid {colors.border.main}]",
							borderRadius: "full",

							_hover: {
								color: "text.main",
							},

							_focus: {
								color: "text.main",
							},
						})}
					>
						編集の提案をする
					</a>
				</li>
				<li>
					<a
						href={twitterUrl.toString()}
						target="_blank"
						rel="noreferrer"
						class={css({
							paddingX: "4",
							paddingY: "2",
							backgroundColor: "[unset]",
							color: "text.main",
							border: "[1px solid {colors.accent.main}]",
							borderRadius: "full",
							transition: "[background-color 0.2s ease-in-out, color 0.2s ease-in-out]",

							_hover: {
								color: "bg.main",
								backgroundColor: "accent.main",
							},

							_focus: {
								color: "bg.main",
								backgroundColor: "accent.main",
							},
						})}
					>
						Twitterにポスト
					</a>
				</li>
			</ul>
		</footer>
	);
});
