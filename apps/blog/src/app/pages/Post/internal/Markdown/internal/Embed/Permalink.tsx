/* eslint-disable ts/restrict-template-expressions */
import { css } from 'styled-system/css';
import type * as A from 'ast';
import type * as H from 'hast';
import type { FC } from 'react';

interface Props {
	node: A.Embed;
}

export const Permalink: FC<Props> = async ({ node }) => {
	const { hastToHtml } = await import('shiki');
	const styled = (node as unknown as { hast: H.Root | undefined }).hast; // MEMO: This is a safety cast
	// eslint-disable-next-line ts/no-non-null-assertion, ts/no-non-null-asserted-optional-chain
	const html = hastToHtml(styled?.children!); // MEMO: This is a safety cast `styled.children` is `Array<H.RootContent>`
	const [org, repo, ...rest] = node.filename?.split('/') ?? [];

	const commitLink = `https://github.com/${org}/${repo}/commit/${node.commitHashOrBranch}`;

	let codeLink = `https://github.com/${org}/${repo}/blob/${node.commitHashOrBranch}/${rest.join('/')}`;
	if (node.lines) {
		codeLink += `#L${node.lines.start + 1}`;
		if (node.lines.end && node.lines.end !== node.lines.start) {
			codeLink += `-L${node.lines.end}`;
		}
	}

	return (
		<div>
			<span
				className={css({
					display: 'flex',
					flexDirection: 'column',
					gap: '1',
					borderTop: '[1px solid {colors.border.main}]',
					borderRight: '[1px solid {colors.border.main}]',
					borderLeft: '[1px solid {colors.border.main}]',
					paddingX: '1',
				})}>
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
					href={codeLink}
					rel="noreferrer"
					target="_blank">
					<span
						className={css({
							fontWeight: 'bold',
						})}>
						{node.filename}
					</span>
				</a>
				<span>
					Lines {node.lines?.start ? node.lines.start + 1 : 1} to {node.lines?.end} in{' '}
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
						href={commitLink}
						rel="noreferrer"
						target="_blank">
						<span>{node.commitHashOrBranch?.slice(0, 10)}</span>
					</a>
				</span>
			</span>
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
					'marginBottom': '2',
					'overflow': 'auto',
					'paddingY': '2',
				})}
				dangerouslySetInnerHTML={{ __html: html }}
			/>
		</div>
	);
};
