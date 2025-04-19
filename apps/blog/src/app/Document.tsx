import { Partytown } from '@qwik.dev/partytown/react';
import styles from './global.css?url';
import type { FC, ReactNode } from 'react';

export const Document: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<html lang="ja">
			<head>
				<meta charSet="utf-8" />
				<meta content="width=device-width, initial-scale=1" name="viewport" />
				<link href="/favicon.ico" rel="icon" sizes="any" />
				<link href="/favicon.svg" rel="icon" type="image/svg+xml" />
				<link href={styles} rel="stylesheet" />
				<script type="module" src="/src/client.tsx"></script>
				{import.meta.env.PROD && (
					<>
						<Partytown forward={['gtag', 'dataLayer.push']} />
						<script src="https://www.googletagmanager.com/gtag/js?id=GTM-KDDWP2FS" type="text/partytown" />
						<script type="text/partytown">
							{`
								window.dataLayer = window.dataLayer || [];
      					window.gtag = function () {
        					dataLayer.push(arguments);
    						};
    						window.gtag('js', new Date());
   							window. gtag('config', 'GTM-KDDWP2FS');
							`.trim()}
						</script>
					</>
				)}
			</head>
			<body>
				<div id="root">{children}</div>
			</body>
		</html>
	);
};
