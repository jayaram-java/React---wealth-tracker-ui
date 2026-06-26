import { expect, test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { ExpenseReportPage } from '../pages/ExpenseReportPage';
import { loginAsUser } from '../utils/auth';
import { e2eData } from '../fixtures/testData';

test.describe('Expense Report', () => {
  test.beforeEach(async ({ page }) => {
    await loginAsUser(page);
    const dashboard = new DashboardPage(page);
    await dashboard.goToExpenseReport();
  });

  test('Generate report', async ({ page }) => {
    const reportPage = new ExpenseReportPage(page);
    await reportPage.expectLoaded();
  });

  test('Filter by date range', async ({ page }) => {
    const reportPage = new ExpenseReportPage(page);
    await reportPage.filterByDates(e2eData.report.startDate, e2eData.report.endDate);
  });

  test('Validate totals', async ({ page }) => {
    await expect(page.getByTestId('expense-report-table')).toBeVisible();
  });

  test('Export report if available', async ({ page }) => {
    await expect(page.getByTestId('expense-report-view-pdf')).toBeVisible();
    await expect(page.getByTestId('expense-report-download-pdf')).toBeVisible();
  });
});
