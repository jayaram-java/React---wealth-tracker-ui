import { expect, type Page } from '@playwright/test';

export class ExpenseReportPage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(this.page.getByTestId('expense-report-page')).toBeVisible();
  }

  async filterByDates(startDate: string, endDate: string) {
    await this.page.getByTestId('expense-report-start-date').fill(startDate);
    await this.page.getByTestId('expense-report-end-date').fill(endDate);
    await this.page.getByTestId('expense-report-apply').click();
  }
}
