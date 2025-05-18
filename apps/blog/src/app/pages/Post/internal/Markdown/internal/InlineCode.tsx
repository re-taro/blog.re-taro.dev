import { css } from 'styled-system/css';
import type * as A from 'ast';
import type { FC } from 'react';

interface Props {
	node: A.InlineCode;
}

export const InlineCode: FC<Props> = ({ node }) => {
	return (
		<code
			className={css({
				_after: {
					content: "'`'",
				},
				_before: {
					content: "'`'",
				},
				_supportsAlternativeTextAfter: {
					_after: {
						content: "'`' / ''",
					},
					_before: {
						content: "'`' / ''",
					},
				},
				fontFamily: 'mono',
				paddingX: '[.4rem]',
				paddingY: '[.1rem]',
			})}>
			{node.value}
		</code>
	);
};
