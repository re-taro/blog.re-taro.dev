// @refresh reload
import { StartServer, createHandler } from "@solidjs/start/server";
import styles from "~/global.css?url";

export default createHandler(() => (
	<StartServer
		document={({ assets, children, scripts }) => (
			<html lang="ja">
				<head>
					<meta charset="utf-8" />
					<meta content="width=device-width, initial-scale=1" name="viewport" />
					<link href="/favicon.ico" rel="icon" sizes="any" />
					<link href="/favicon.svg" rel="icon" type="image/svg+xml" />
					<link href={styles} rel="stylesheet" />
					<link href="https://fonts.googleapis.com" rel="preconnect" />
					<link crossOrigin="anonymous" href="https://fonts.gstatic.com" rel="preconnect" />
					<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Noto+Sans+JP:wght@400;600&display=swap" rel="stylesheet" />
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
