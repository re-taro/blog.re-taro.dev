import { css } from 'styled-system/css';
import { Layout } from '../../components/layout/Layout';
import type { JSX } from 'react';

export const Privacy = (): JSX.Element => {
	return (
		<Layout>
			<title>Privacy Policy</title>
			<section
				className={css({
					padding: '[5.25rem 1rem 0]',
				})}>
				<h1
					className={css({
						color: 'text.main',
						fontSize: '2xl',
						fontWeight: 'bold',
						lineHeight: 'tight',
					})}>
					Privacy Policy
				</h1>
				<ul
					className={css({
						color: 'text.main',
						fontSize: 'md',
						lineHeight: 'normal',
					})}>
					<li
						className={css({
							_before: {
								content: "'-'",
								left: '[-1em]',
								position: 'absolute',
							},
							marginLeft: '[1em]',
							position: 'relative',
						})}>
						本サイトは
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
							href="https://policies.google.com/technologies/partner-sites"
							rel="noreferrer"
							target="_blank">
							Google Analytics
						</a>
						を導入している。
					</li>
				</ul>
			</section>
		</Layout>
	);
};
