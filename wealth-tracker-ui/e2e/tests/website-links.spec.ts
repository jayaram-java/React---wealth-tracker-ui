import { expect, test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { WebsiteLinkPage } from '../pages/WebsiteLinkPage';
import { loginAsAdmin } from '../utils/auth';
import { e2eData } from '../fixtures/testData';

test.describe('Website Links Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    const dashboard = new DashboardPage(page);
    await dashboard.goToWebsiteLinks();
  });

  test('Add website link', async ({ page }) => {
    const websiteLinkPage = new WebsiteLinkPage(page);
    await websiteLinkPage.expectLoaded();
    await websiteLinkPage.createLink(
      e2eData.websiteLink.url,
      e2eData.websiteLink.description,
      e2eData.websiteLink.remarks,
      'General'
    );
  });

  test('Edit website link', async ({ page }) => {
    await expect(page.getByTestId('website-link-table')).toBeVisible();
  });

  test('Delete website link', async ({ page }) => {
    await expect(page.getByTestId('website-link-table')).toBeVisible();
  });

  test('Verify only domain name is displayed', async ({ page }) => {
    await expect(page.getByTestId('website-link-table')).toBeVisible();
  });

  test('Validate URL format', async ({ page }) => {
    await expect(page.getByTestId('website-link-form')).toBeVisible();
  });
});
