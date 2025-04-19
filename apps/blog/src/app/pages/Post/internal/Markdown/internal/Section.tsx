import { css, cx } from 'styled-system/css';
import { Markdown } from '..';
import type * as A from 'ast';
import type { FC } from 'react';

interface Props {
	footnoteDefs: A.FootnoteDefinition[];
	node: A.Section;
}

export const Section: FC<Props> = ({ footnoteDefs, node }) => {
	return (
		<section
			className={cx(
				css({
					'& > * + *': {
						marginTop: '6',
					},
					'& > .markdown_heading': {
						fontWeight: 'bold',
						marginTop: '8',
						paddingBottom: '1',
						scrollMarginTop: '[6.25rem]',
					},
				}),
				'markdown_section',
			)}
			aria-labelledby={node.children[0].id}>
			<Markdown footnoteDefs={footnoteDefs} nodes={node.children} />
		</section>
	);
};
