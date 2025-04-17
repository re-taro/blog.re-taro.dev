import { defineGlobalStyles } from '@pandacss/dev';

export const globalCss = defineGlobalStyles({
	body: {
		backgroundColor: 'bg.main',

		fontFamily: "Inter, Roboto, 'Helvetica Neue', 'Arial Nova', 'Nimbus Sans', Arial, sans-serif",
		MozOsxFontSmoothing: 'grayscale',
		WebkitFontSmoothing: 'antialiased',
	},
});
