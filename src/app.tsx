import { Suspense } from "solid-js";
import type { Component, JSX } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./global.css";
import { MetaProvider } from "@solidjs/meta";
import { Assets } from "solid-js/web";
import { partytownSnippet } from "@qwik.dev/partytown/integration";
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
						<script>{partytownSnippet()}</script>
						<script type="text/partytown">{`partytown = { forward: ['gtag', 'dataLayer.push'] }`}</script>
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
