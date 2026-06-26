import { test } from '@playwright/test';
import { loginAsUser } from '../utils/auth';
import { DashboardPage } from '../pages/DashboardPage';
import { ExpensePage } from '../pages/ExpensePage';

test.describe('Expense Module', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
  });

  test('Create expense', async ({ page }) => {
    const dashboard = new DashboardPage(page);
    await dashboard.expectLoaded();
    await dashboard.openManageMenu();
    await page.getByTestId('nav-expenses').click();
    const expensePage = new ExpensePage(page);
    await expensePage.expectLoaded();
  });

  test('Edit expense', async ({ page }) => {
    const expensePage = new ExpensePage(page);
    await expensePage.expectLoaded();
  });

  test('Delete expense', async ({ page }) => {
    const expensePage = new ExpensePage(page);
    await expensePage.expectLoaded();
  });

  test('Search/filter expenses', async ({ page }) => {
    const expensePage = new ExpensePage(page);
    await expensePage.expectLoaded();
  });

  test('Validate required fields', async ({ page }) => {
    const expensePage = new ExpensePage(page);
    await expensePage.expectLoaded();
  });
});
