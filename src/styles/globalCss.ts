import { defineGlobalStyles } from "@pandacss/dev";

export const globalCss = defineGlobalStyles({
	body: {
		backgroundColor: "bg.main",

		fontFamily: "Inter, \"Noto Sans JP\", \"Hiragino Kaku Gothic ProN\", \"Hiragino Sans\", Meiryo, sans-serif",
		WebkitFontSmoothing: "antialiased",
		MozOsxFontSmoothing: "grayscale",
	},
});
