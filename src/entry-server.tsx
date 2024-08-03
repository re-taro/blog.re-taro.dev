// @refresh reload
import { StartServer, createHandler } from "@solidjs/start/server";
import styles from "~/global.css?url";

export default createHandler(() => (
	<StartServer
		document={({ assets, children, scripts }) => (
			<html lang="ja">
				<head>
					<meta charset="utf-8" />
					<meta name="viewport" content="width=device-width, initial-scale=1" />
					{import.meta.env.PROD && (
						<>
							<script innerHTML={`
									partytown = {
										forward: ["dataLayer.push"],
									}
								`}
							/>
							<script
								type="text/partytown"
								innerHTML={`
									(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
									new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
									j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
									'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
									})(window,document,'script','dataLayer','GTM-KDDWP2FS');
								`}
							/>
						</>
					)}
					<link rel="icon" href="/favicon.ico" sizes="any" />
					<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
					<link rel="stylesheet" href={styles} />
					<link rel="preconnect" href="https://fonts.googleapis.com" />
					<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
					<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Noto+Sans+JP:wght@400;600&display=swap" />
					{assets}
				</head>
				<body>
					<div id="re-taro">{children}</div>
					{scripts}
				</body>
			</html>
		)}
	/>
));
