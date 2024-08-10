import type { Component } from "solid-js";
import { Index, Show } from "solid-js";
import Markdown from "~/components/Markdown/Markdown";
import { getFootnoteDefId, getFootnoteRefId } from "~/components/Markdown/helper";
import type * as A from "~/libs/plugins/ast/ast";
import { css } from "~/styled-system/css";

interface FootnoteProps {
	footnotes: Array<A.FootnoteDefinition>;
}

interface FootnoteDefinitionProps {
	footnote: A.FootnoteDefinition;
	footnoteDefs: Array<A.FootnoteDefinition>;
	idx: number;
}

const FootnoteDefinition: Component<FootnoteDefinitionProps> = (props) => {
	return (
		<li id={getFootnoteDefId(props.idx + 1)}>
			<div
				class={css({
					"& > *": {
						margin: "0",
					},
					"display": "grid",
					"gap": "2",
					"gridTemplateAreas": "'content link noop'",
					"gridTemplateColumns": "[auto auto 1fr]",
				})}
			>
				<Markdown footnoteDefs={props.footnoteDefs} nodes={props.footnote.children} />
				<a
					class={css({
						_focus: {
							color: "accent.main",
						},
						_hover: {
							color: "accent.main",
						},
						alignSelf: "end",
						color: "accent.secondary",
						gridArea: "link",
					})}
					aria-label="Back to content"
					href={`#${getFootnoteRefId(props.idx + 1)}`}
				>
					↵
				</a>
			</div>
		</li>
	);
};

const FootnoteDefinitionList: Component<FootnoteProps> = (props) => {
	return (
		<ol
			class={css({
				"& > li": {
					_before: {
						_supportsAlternativeTextAfter: {
							content: "counter(list) '.' / ''",
						},
						content: "counter(list) '.'",
						counterIncrement: "list",
						marginLeft: "[-1em]",
						position: "absolute",
					},
					marginLeft: "[1em]",
					marginY: "2",
					position: "relative",
				},
				"color": "text.main",
				"counterReset": "list",
				"paddingLeft": "6",
			})}
		>
			<Index each={props.footnotes}>
				{(footnote, idx) => (
					<FootnoteDefinition footnote={footnote()} footnoteDefs={props.footnotes} idx={idx} />
				)}
			</Index>
		</ol>
	);
};

const Footnote: Component<FootnoteProps> = (props) => {
	return (
		<Show when={props.footnotes.length !== 0}>
			<hr
				class={css({
					borderTop: "[1px solid {colors.border.main}]",
					height: "[1px]",
					marginY: "4",
					width: "full",
				})}
			/>
			<section aria-labelledby="footnote">
				<h2
					class={css({
						borderWidth: "0",
						clip: "rect(0 0 0 0)",
						height: "[1px]",
						margin: "[-1px]",
						overflow: "hidden",
						padding: "0",
						position: "absolute",
						whiteSpace: "nowrap",
						width: "[1px]",
					})}
					aria-hidden
				>
					脚注
				</h2>
				<FootnoteDefinitionList footnotes={props.footnotes} />
			</section>
		</Show>
	);
};

export default Footnote;
