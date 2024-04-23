import { component$ } from "@builder.io/qwik";
import { useDocumentHead, useLocation } from "@builder.io/qwik-city";

export const RouterHead = component$(() => {
	const head = useDocumentHead();
	const loc = useLocation();

	return (
		<>
			<title>{head.title}</title>
			<link rel="canonical" href={loc.url.href} />
			{head.meta.map(m => (
				<meta key={m.key} {...m} />
			))}
			{head.links.map(l => (
				<link key={l.key} {...l} />
			))}
			{head.styles.map(s => (
				<style key={s.key} {...s.props} dangerouslySetInnerHTML={s.style} />
			))}
		</>
	);
});
