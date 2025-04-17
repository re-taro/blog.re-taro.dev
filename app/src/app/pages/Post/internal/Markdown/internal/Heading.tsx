import { cva, cx } from 'styled-system/css';
import { Markdown } from '..';
import type * as A from 'ast';
import type { FC } from 'react';

interface Props {
	footnoteDefs: A.FootnoteDefinition[];
	node: A.Heading;
}

const heading = cva({
	base: {
		color: 'text.main',
		fontWeight: 'bold',
		lineHeight: 'tight',
	},
	variants: {
		level: {
			1: {
				_before: {
					_supportsAlternativeTextAfter: {
						content: "'#' / ''",
					},
					content: "'#'",
					marginLeft: '[-1em]',
					position: 'absolute',
				},
				fontSize: 'xl',
				marginLeft: '[1em]',
				md: {
					fontSize: '2xl',
				},
				position: 'relative',
			},
			2: {
				_before: {
					_supportsAlternativeTextAfter: {
						content: "'##' / ''",
					},
					content: "'##'",
					marginLeft: '[-1.8em]',
					position: 'absolute',
				},
				fontSize: 'xl',
				marginLeft: '[1.8em]',
				md: {
					fontSize: '2xl',
				},
				position: 'relative',
			},
			3: {
				_before: {
					_supportsAlternativeTextAfter: {
						content: "'###' / ''",
					},
					content: "'###'",
					marginLeft: '[-2.4em]',
					position: 'absolute',
				},
				fontSize: 'l',
				marginLeft: '[2.4em]',
				md: {
					fontSize: 'xl',
				},
				position: 'relative',
			},
			4: {
				_before: {
					_supportsAlternativeTextAfter: {
						content: "'####' / ''",
					},
					content: "'####'",
					marginLeft: '[-3em]',
					position: 'absolute',
				},
				fontSize: 'sl',
				marginLeft: '[3em]',
				md: {
					fontSize: 'ml',
				},
				position: 'relative',
			},
			5: {
				fontSize: 'l',
				md: {
					fontSize: 'sl',
				},
			},
			6: {
				fontSize: 'm',
				md: {
					fontSize: 'l',
				},
			},
		},
	},
});

export const Heading: FC<Props> = ({ node, footnoteDefs }) => {
	// eslint-disable-next-line ts/restrict-template-expressions
	const Tag = `h${node.level}` as const;

	return (
		<Tag className={cx(heading({ level: node.level }), 'markdown_heading')} id={node.id} title={node.id}>
			{node.level === 1 ?
				<Markdown footnoteDefs={footnoteDefs} nodes={node.children} />
			:	<a aria-hidden="true" href={`#${node.id}`} tabIndex={-1}>
					<Markdown footnoteDefs={footnoteDefs} nodes={node.children} />
				</a>
			}
		</Tag>
	);
};
