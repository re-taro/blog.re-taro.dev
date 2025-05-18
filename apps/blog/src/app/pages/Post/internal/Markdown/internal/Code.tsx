import { css } from 'styled-system/css';
import type * as A from 'ast';
import type * as H from 'hast';
import type { FC } from 'react';

interface Props {
	node: A.Code;
}

export const Code: FC<Props> = async ({ node }) => {
	const { hastToHtml } = await import('shiki');
	const styled = (node as unknown as { hast: H.Root | undefined }).hast; // MEMO: This is a safety cast
	// eslint-disable-next-line ts/no-non-null-assertion, ts/no-non-null-asserted-optional-chain
	const html = hastToHtml(styled?.children!); // MEMO: This is a safety cast `styled.children` is `Array<H.RootContent>`

	return (
		<div
			className={css({
				'& > pre.shiki > code': {
					counterReset: 'line-number',
				},
				'& > pre.shiki > code > span.line': {
					_before: {
						color: 'text.secondary',
						content: 'counter(line-number)',
						display: 'inline-block',
						marginRight: '5',
						textAlign: 'end',
						width: '6',
					},
					counterIncrement: 'line-number',
				},
				'borderBottom': '[1px solid {colors.border.main}]',
				'borderTop': '[1px solid {colors.border.main}]',
				'fontFamily': 'mono',
				'fontSize': 's',
				'marginY': '2',
				'overflow': 'auto',
				'paddingY': '2',
			})}
			dangerouslySetInnerHTML={{ __html: html }}
		/>
	);
};
