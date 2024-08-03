import { Title } from "@solidjs/meta";
import { css } from "~/styled-system/css";

export default function Page() {
	return (
		<>
			<Title>Privacy Policy</Title>
			<section
				class={css({
					padding: "[5.25rem 1rem 0]",
				})}
			>
				<h1
					class={css({
						color: "text.main",
						fontSize: "2xl",
						fontWeight: "bold",
						lineHeight: "tight",
					})}
				>
					Privacy Policy
				</h1>
				<ul
					class={css({
						color: "text.main",
						fontSize: "md",
						lineHeight: "normal",
					})}
				>
					<li
						class={css({
							position: "relative",
							marginLeft: "[1em]",

							_before: {
								position: "absolute",
								content: "'-'",
								left: "[-1em]",
							},
						})}
					>
						本サイトは
						<a
							href="https://policies.google.com/technologies/partner-sites"
							rel="noreferrer"
							target="_blank"
							class={css({
								color: "accent.secondary",
								_hover: {
									color: "accent.main",
								},
								_focus: {
									color: "accent.main",
								},
							})}
						>
							Google Analytics
						</a>
						を導入している。
					</li>
				</ul>
			</section>
		</>
	);
}
