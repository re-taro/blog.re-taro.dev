import { AxeBuilder } from '@axe-core/playwright';
import { expect, test } from '@playwright/test';

test.describe('/tags', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('http://localhost:8787/tags');
	});
	test.describe('a11y', () => {
		test('should not have any automatically detectable accessibility issues', async ({ page }) => {
			const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

			expect(accessibilityScanResults.violations).toEqual([]);
		});
	});
});
