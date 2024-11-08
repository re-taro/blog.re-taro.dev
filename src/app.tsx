import { Suspense } from "solid-js";
import type { Component, JSX } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./global.css";
import { MetaProvider } from "@solidjs/meta";
import { Assets } from "solid-js/web";
import { partytownSnippet } from "@builder.io/partytown/integration";
import { css } from "./styled-system/css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

interface Props {
	children: JSX.Element;
}

const Layout: Component<Props> = (props) => {
	return (
		<div class={css({
			display: "grid",
			gridTemplateAreas: `
        "header"
        "main"
        "footer"`,
			gridTemplateRows: "[auto 1fr auto]",
			minHeight: "[100lvh]",
		})}
		>
			<Header css={css.raw({ gridArea: "header" })} />
			<main class={css({ gridArea: "main" })}>
				{props.children}
			</main>
			<Footer css={css.raw({ gridArea: "footer" })} />
		</div>
	);
};

export default function App() {
	return (
		<Router root={props => (
			<>
				{import.meta.env.PROD && (
					<Assets>
						<script>{partytownSnippet({ forward: ["dataLayer.push"] })}</script>
						<script
							type="text/partytown"
						>
							{`
							(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
							new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
							j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
							'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
							})(window,document,'script','dataLayer','GTM-KDDWP2FS');
						`}
						</script>
					</Assets>
				)}
				<MetaProvider>
					<Layout>
						<Suspense fallback={null}>{props.children}</Suspense>
					</Layout>
				</MetaProvider>
			</>
		)}
		>
			<FileRoutes />
		</Router>
	);
}
