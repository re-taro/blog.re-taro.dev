import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('/privacy', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:8787/privacy');
	});
	test.describe('rendering', () => {
		test('should render heading', async ({ page }) => {
			const heading = await page.$('h1');
			const headingText = await heading?.textContent();

			expect(headingText).toBe('Privacy Policy');
		});
		test('should render policy link', async ({ page }) => {
			const link = await page.$('a[href="https://policies.google.com/technologies/partner-sites"]');
			const text = await link?.textContent();

			expect(text).toEqual('Google Analytics');
		});
	});
	test.describe('a11y', () => {
		test('should not have any automatically detectable accessibility issues', async ({ page }) => {
			const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

			expect(accessibilityScanResults.violations).toEqual([]);
		});
	});
});
