import { expect, test } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { loginAsAdmin, loginAsUser } from '../utils/auth';

test.describe('Login', () => {
  test('Successful user login', async ({ page }) => {
    await loginAsUser(page);
    await expect(page.getByTestId('app-header')).toBeVisible();
    await expect(page.getByRole('heading', { name: 'Dashboard Overview' })).toBeVisible();
  });

  test('Successful admin login', async ({ page }) => {
    await loginAsAdmin(page);
    await expect(page.getByTestId('nav-metrics')).toBeVisible();
    await expect(page.getByTestId('nav-service-health')).toBeVisible();
  });

  test('Invalid username/password validation', async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login('bad.user', 'wrong-password');
    await expect(page.getByTestId('login-error')).toBeVisible();
  });

  test('Logout functionality', async ({ page }) => {
    await loginAsUser(page);
    await page.getByTestId('logout-button').click();
    await expect(page.getByTestId('login-page')).toBeVisible();
    await expect(page.getByTestId('login-submit')).toBeVisible();
  });
});
