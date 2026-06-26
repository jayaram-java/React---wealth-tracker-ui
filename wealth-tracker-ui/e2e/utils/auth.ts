import type { Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { credentials } from '../fixtures/testData';

export async function loginAsUser(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials.user.username, credentials.user.password);
}

export async function loginAsAdmin(page: Page) {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(credentials.admin.username, credentials.admin.password);
}
