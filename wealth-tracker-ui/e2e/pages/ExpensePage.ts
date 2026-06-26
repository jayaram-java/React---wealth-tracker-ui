import { expect, type Page } from '@playwright/test';

export class ExpensePage {
  constructor(private readonly page: Page) {}

  async expectLoaded() {
    await expect(this.page.getByTestId('app-header')).toBeVisible();
  }
}
