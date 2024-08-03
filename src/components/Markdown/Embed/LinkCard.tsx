import type { Component } from "solid-js";
import type { Metadata } from "unfurl.js/dist/types";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	node: A.Embed;
	meta: Metadata;
}

const LichCard: Component<Props> = (props) => {
	const url = new URL(props.node.src);

	return (
		<a
			class={css({
				display: "block",
			})}
			href={url.href}
			target="_blank"
			rel="noreferrer"
		>
			<article class={css({
				display: "flex",
				overflow: "hidden",
				border: "[1px solid {colors.border.main}]",
				borderRadius: "sm",
				transition: "[background-color 0.25s ease-in-out]",

				_hover: {
					backgroundColor: "bg.teriary",
				},

				_focus: {
					backgroundColor: "bg.teriary",
				},
			})}
			>
				<div class={css({
					display: "grid",
					gap: "2",
					padding: "4",
				})}
				>
					<h2 class={css({
						fontSize: "l",
						lineHeight: "tight",
						fontWeight: "bold",
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					})}
					>
						{props.meta.title}
					</h2>
					<p class={css({
						overflow: "hidden",
						textOverflow: "ellipsis",
						whiteSpace: "nowrap",
					})}
					>
						{props.meta.description}
					</p>
					<footer class={css({
						display: "flex",
						gap: "1",
						alignItems: "center",
					})}
					>
						<img
							src={props.meta.favicon ?? ""}
							width={16}
							height={16}
							alt=""
							class={css({
								maxHeight: "4",
								aspectRatio: "square",
							})}
						/>
						<span class={css({
							overflow: "hidden",
							textOverflow: "ellipsis",
							whiteSpace: "nowrap",
						})}
						>
							{url.hostname}
						</span>
					</footer>
				</div>
				{props.meta.open_graph.images && (
					<img
						src={props.meta.open_graph.images[0].url}
						alt={props.meta.open_graph.images[0].alt ?? ""}
						class={css({
							maxWidth: "[40%]",
							maxHeight: "32",
							objectFit: "cover",
							borderLeft: "[1px solid {colors.border.main}]",
						})}
					/>
				)}
			</article>
		</a>
	);
};

export default LichCard;
