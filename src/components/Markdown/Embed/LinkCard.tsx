import type { Component } from "solid-js";
import type { Metadata } from "unfurl.js/dist/types";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface Props {
	meta: Metadata;
	node: A.Embed;
}

const LichCard: Component<Props> = (props) => {
	const url = new URL(props.node.src);

	return (
		<a
			class={css({
				display: "block",
			})}
			href={url.href}
			rel="noreferrer"
			target="_blank"
		>
			<article class={css({
				_focus: {
					backgroundColor: "bg.teriary",
				},
				_hover: {
					backgroundColor: "bg.teriary",
				},
				border: "[1px solid {colors.border.main}]",
				borderRadius: "sm",
				display: "flex",
				overflow: "hidden",
				transition: "[background-color 0.25s ease-in-out]",
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
						fontWeight: "bold",
						lineHeight: "tight",
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
						alignItems: "center",
						display: "flex",
						gap: "1",
					})}
					>
						<img
							class={css({
								aspectRatio: "square",
								maxHeight: "4",
							})}
							alt=""
							height={16}
							src={props.meta.favicon ?? ""}
							width={16}
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
						class={css({
							borderLeft: "[1px solid {colors.border.main}]",
							maxHeight: "32",
							maxWidth: "[40%]",
							objectFit: "cover",
						})}
						alt={props.meta.open_graph.images[0].alt ?? ""}
						src={props.meta.open_graph.images[0].url}
					/>
				)}
			</article>
		</a>
	);
};

export default LichCard;
