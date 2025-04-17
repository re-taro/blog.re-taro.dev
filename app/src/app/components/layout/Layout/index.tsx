import { css } from 'styled-system/css';
import { Footer } from '../Footer';
import { Header } from '../Header';
import type { FC, ReactNode } from 'react';

export const Layout: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<div
			className={css({
				display: 'grid',
				gridTemplateAreas: `
				"header"
				"main"
				"footer"`,
				gridTemplateRows: '[auto 1fr auto]',
				minHeight: '[100lvh]',
			})}>
			<Header css={css.raw({ gridArea: 'header' })} />
			<main className={css({ gridArea: 'main' })}>{children}</main>
			<Footer css={css.raw({ gridArea: 'footer' })} />
		</div>
	);
};
