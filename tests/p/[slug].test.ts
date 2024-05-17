import { AxeBuilder } from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { violationFingerprints } from "../utils";

test.describe("/p/01HXEV0G1DXQR91W6G90M7CKGR", () => {
	test.beforeEach(async ({ page }) => {
		await page.goto("http://localhost:8788/p/01HXEV0G1DXQR91W6G90M7CKGR");
	});
	test.describe("rendering", () => {});
	test.describe("action", () => {});
	test.describe("validation", () => {});
	test.describe("a11y", () => {
		test("should not have any automatically detectable accessibility issues", async ({
			page,
		}) => {
			const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

			expect(violationFingerprints(accessibilityScanResults)).toMatchSnapshot();
		});
	});
});
