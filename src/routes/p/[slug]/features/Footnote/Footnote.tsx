import { component$ } from "@builder.io/qwik";
import Markdown from "~/components/Markdown/Markdown";
import { getFootnoteDefId, getFootnoteRefId } from "~/components/Markdown/helper";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface FootnoteProps {
	footnotes: Array<A.FootnoteDefinition>;
}

export default component$<FootnoteProps>(({ footnotes }) => {
	if (footnotes.length === 0)
		return null;

	return (
		<>
			<hr
				class={css({
					marginY: "4",
					width: "full",
					height: "[1px]",
					borderTop: "[1px solid {colors.border.main}]",
				})}
			/>
			<section aria-labelledby="footnote">
				<h2
					aria-hidden
					class={css({
						position: "absolute",
						width: "[1px]",
						height: "[1px]",
						padding: "0",
						margin: "[-1px]",
						overflow: "hidden",
						clip: "rect(0 0 0 0)",
						whiteSpace: "nowrap",
						borderWidth: "0",
					})}
				>
					脚注
				</h2>
				<FootnoteDefinitionList footnotes={footnotes} />
			</section>
		</>
	);
});

export function FootnoteDefinitionList({ footnotes }: FootnoteProps) {
	return (
		<ol
			class={css({
				"color": "text.main",
				"paddingLeft": "6",
				"counterReset": "list",

				"& > li": {
					position: "relative",
					marginLeft: "[1em]",
					marginY: "2",

					_before: {
						position: "absolute",
						content: "counter(list) '.'",
						marginLeft: "[-1em]",
						counterIncrement: "list",

						_supportsAlternativeTextAfter: {
							content: "counter(list) '.' / ''",
						},
					},
				},
			})}
		>
			{footnotes.map((footnote, idx) => (
				<FootnoteDefinition footnote={footnote} footnoteDefs={footnotes} idx={idx} key={idx} />
			))}
		</ol>
	);
}

interface FootnoteDefinitionProps {
	footnote: A.FootnoteDefinition;
	footnoteDefs: Array<A.FootnoteDefinition>;
	idx: number;
}

export function FootnoteDefinition({ footnote, footnoteDefs, idx }: FootnoteDefinitionProps) {
	return (
		<li id={getFootnoteDefId(idx + 1)}>
			<div
				class={css({
					"display": "grid",
					"gridTemplateAreas": "'content link noop'",
					"gridTemplateColumns": "[auto auto 1fr]",
					"gap": "2",

					"& > *": {
						margin: "0",
					},
				})}
			>
				<Markdown nodes={footnote.children} footnoteDefs={footnoteDefs} />
				<a
					href={`#${getFootnoteRefId(idx + 1)}`}
					class={css({
						gridArea: "link",
						alignSelf: "end",
						color: "accent.secondary",

						_hover: {
							color: "accent.main",
						},

						_focus: {
							color: "accent.main",
						},
					})}
					aria-label="Back to content"
				>
					↵
				</a>
			</div>
		</li>
	);
}
