import { css } from 'styled-system/css';
import { Markdown } from '..';
import type * as A from 'ast';
import type { FC } from 'react';

interface Props {
	footnoteDefs: A.FootnoteDefinition[];
	node: A.Link;
}

export const Link: FC<Props> = ({ footnoteDefs, node }) => {
	return (
		<a
			className={css({
				_focus: {
					color: 'accent.main',
				},
				_hover: {
					color: 'accent.main',
				},
				color: 'accent.secondary',
			})}
			href={node.url}
			rel="noreferrer"
			target="_blank"
			title={node.title ?? undefined}>
			<Markdown footnoteDefs={footnoteDefs} nodes={node.children} />
		</a>
	);
};
