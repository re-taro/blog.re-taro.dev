import { Suspense } from "solid-js";
import type { Component, JSX } from "solid-js";
import { Router } from "@solidjs/router";
import { FileRoutes } from "@solidjs/start/router";
import "./global.css";
import { MetaProvider } from "@solidjs/meta";
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
			<MetaProvider>
				<Layout>
					<Suspense fallback={null}>{props.children}</Suspense>
				</Layout>
			</MetaProvider>
		)}
		>
			<FileRoutes />
		</Router>
	);
}
