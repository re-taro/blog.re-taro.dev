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
