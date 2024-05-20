import { component$ } from "@builder.io/qwik";
import {
	QwikCityProvider,
	RouterOutlet,
	ServiceWorkerRegister,
} from "@builder.io/qwik-city";
import { QwikPartytown } from "~/components/Partytown/Partytown";
import RouterHead from "~/components/router-head/router-head";
import styles from "~/global.css?url";

export default component$(() => {
	return (
		<QwikCityProvider>
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<QwikPartytown forward={["gtag", "dataLayer.push"]} />
				<script
					async
					type="text/partytown"
					src="https://www.googletagmanager.com/gtag/js?id=G-048WY1ZY4E"
				>
				</script>
				<script
					type="text/partytown"
					dangerouslySetInnerHTML="
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());

						gtag('config', 'G-048WY1ZY4E');
					"
				>
				</script>
				<link rel="icon" href="/favicon.ico" sizes="any" />
				<link rel="icon" href="/favicon.svg" type="image/svg+xml" />
				<link rel="stylesheet" href={styles} />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
				<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Noto+Sans+JP:wght@400;600&display=swap" />
				<RouterHead />
				<ServiceWorkerRegister />
			</head>
			<body lang="ja">
				<RouterOutlet />
			</body>
		</QwikCityProvider>
	);
});
