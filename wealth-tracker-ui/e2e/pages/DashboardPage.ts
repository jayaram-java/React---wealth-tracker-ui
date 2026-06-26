import { expect, type Page } from '@playwright/test';

export class DashboardPage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(this.page.getByTestId('app-header')).toBeVisible();
    await expect(this.page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();
  }

  async logout() {
    await this.page.getByTestId('logout-button').click();
    await expect(this.page.getByTestId('login-page')).toBeVisible();
  }

  async openManageMenu() {
    await this.page.getByTestId('nav-manage').click();
  }

  async openReportMenu() {
    await this.page.getByTestId('nav-report').click();
  }

  async goToWebsiteLinks() {
    await this.openManageMenu();
    await this.page.getByTestId('nav-website-links').click();
  }

  async goToChecklists() {
    await this.openManageMenu();
    await this.page.getByTestId('nav-checklists').click();
  }

  async goToExpenseReport() {
    await this.openReportMenu();
    await this.page.getByTestId('nav-expense-report').click();
  }
}
