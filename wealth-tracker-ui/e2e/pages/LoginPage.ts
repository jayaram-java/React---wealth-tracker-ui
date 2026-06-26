import { expect, type Page } from '@playwright/test';

export class LoginPage {
  constructor(private readonly page: Page) {}

  async goto() {
    await this.page.goto('');
    await expect(this.page.getByTestId('login-page')).toBeVisible();
  }

  async login(username: string, password: string) {
    await this.page.getByTestId('login-username').fill(username);
    await this.page.getByTestId('login-password').fill(password);
    await this.page.getByTestId('login-submit').click();
  }

  async expectError(message: string) {
    await expect(this.page.getByTestId('login-error')).toContainText(message);
  }
}
