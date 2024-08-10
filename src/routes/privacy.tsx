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
							_before: {
								content: "'-'",
								left: "[-1em]",
								position: "absolute",
							},
							marginLeft: "[1em]",
							position: "relative",
						})}
					>
						本サイトは
						<a
							class={css({
								_focus: {
									color: "accent.main",
								},
								_hover: {
									color: "accent.main",
								},
								color: "accent.secondary",
							})}
							href="https://policies.google.com/technologies/partner-sites"
							rel="noreferrer"
							target="_blank"
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
