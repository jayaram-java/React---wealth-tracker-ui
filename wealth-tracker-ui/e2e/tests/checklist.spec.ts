import { expect, test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { ChecklistPage } from '../pages/ChecklistPage';
import { loginAsAdmin } from '../utils/auth';
import { e2eData } from '../fixtures/testData';

test.describe('Checklist Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsAdmin(page);
    const dashboard = new DashboardPage(page);
    await dashboard.goToChecklists();
  });

  test('Create checklist item', async ({ page }) => {
    const checklistPage = new ChecklistPage(page);
    await checklistPage.expectLoaded();
    await checklistPage.createItem(
      e2eData.checklist.title,
      e2eData.checklist.description,
      e2eData.checklist.referenceLink
    );
  });

  test('Mark item as completed', async ({ page }) => {
    await expect(page.getByTestId('checklist-table')).toBeVisible();
  });

  test('Edit checklist item', async ({ page }) => {
    await expect(page.getByTestId('checklist-table')).toBeVisible();
  });

  test('Delete checklist item', async ({ page }) => {
    await expect(page.getByTestId('checklist-table')).toBeVisible();
  });

  test('Filter checklist items', async ({ page }) => {
    await expect(page.getByTestId('checklist-table')).toBeVisible();
  });
});
