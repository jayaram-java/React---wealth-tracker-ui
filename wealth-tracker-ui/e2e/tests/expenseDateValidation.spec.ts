import { expect, test, type Page, type Route } from '@playwright/test';
import {
  getTodayLocalDateString,
  isFutureExpenseDate,
  validateExpenseDate,
  FUTURE_EXPENSE_DATE_ERROR,
} from '../../src/features/ExpenseDetails/utils/expenseDateValidation';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';

// =========================================================
// 1. Unit Tests for Date Utility and Validation Logic
// =========================================================
test.describe('Unit Tests: Expense Date Validation', () => {
  test('1. Today local date formatted as YYYY-MM-DD correctly without UTC drift', () => {
    const customDate = new Date(2026, 9, 8); // Oct 8, 2026
    const formatted = getTodayLocalDateString(customDate);
    expect(formatted).toBe('2026-10-08');
  });

  test('2. Today date is accepted (not future)', () => {
    const fixedNow = new Date(2026, 9, 8); // Oct 8, 2026
    const todayStr = '2026-10-08';

    expect(isFutureExpenseDate(todayStr, fixedNow)).toBe(false);
    expect(validateExpenseDate(todayStr, fixedNow)).toBeNull();
  });

  test('3. Yesterday date is accepted (not future)', () => {
    const fixedNow = new Date(2026, 9, 8); // Oct 8, 2026
    const yesterdayStr = '2026-10-07';

    expect(isFutureExpenseDate(yesterdayStr, fixedNow)).toBe(false);
    expect(validateExpenseDate(yesterdayStr, fixedNow)).toBeNull();
  });

  test('4. Past dates (past month, past year) are accepted', () => {
    const fixedNow = new Date(2026, 9, 8);
    const pastMonthStr = '2026-09-15';
    const pastYearStr = '2025-12-31';

    expect(isFutureExpenseDate(pastMonthStr, fixedNow)).toBe(false);
    expect(validateExpenseDate(pastMonthStr, fixedNow)).toBeNull();
    expect(isFutureExpenseDate(pastYearStr, fixedNow)).toBe(false);
    expect(validateExpenseDate(pastYearStr, fixedNow)).toBeNull();
  });

  test('5. Future dates (tomorrow, future date, next year) are rejected with clear error message', () => {
    const fixedNow = new Date(2026, 9, 8); // Oct 8, 2026
    const tomorrowStr = '2026-10-09';
    const futureDateStr = '2026-10-21';
    const nextYearStr = '2027-01-01';

    expect(isFutureExpenseDate(tomorrowStr, fixedNow)).toBe(true);
    expect(validateExpenseDate(tomorrowStr, fixedNow)).toBe(FUTURE_EXPENSE_DATE_ERROR);
    expect(validateExpenseDate(tomorrowStr, fixedNow)).toBe('Expense date cannot be in the future.');

    expect(isFutureExpenseDate(futureDateStr, fixedNow)).toBe(true);
    expect(validateExpenseDate(futureDateStr, fixedNow)).toBe('Expense date cannot be in the future.');

    expect(isFutureExpenseDate(nextYearStr, fixedNow)).toBe(true);
    expect(validateExpenseDate(nextYearStr, fixedNow)).toBe(FUTURE_EXPENSE_DATE_ERROR);
  });

  test('6. Empty or whitespace date returns required error', () => {
    expect(validateExpenseDate('')).toBe('Expense date is required.');
    expect(validateExpenseDate('   ')).toBe('Expense date is required.');
  });
});

// =========================================================
// 2. Integration / E2E Tests: Expense Form Date & API Guard
// =========================================================
const MOCK_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGVzIjpbIlJPTEVfVVNFUiJdfQ.mocksignature';

async function setupAndNavigateToExpenses(page: Page) {
  await page.route('**/authservice/api/auth/login', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        accessToken: MOCK_TOKEN,
        tokenType: 'Bearer',
        username: 'testuser',
      }),
    });
  });

  await page.route(/.*expenseservice\/api\/v1\/expense-reports\/summary.*/, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ totalAmount: 0, expenseCount: 0, averageAmount: 0 }),
    });
  });

  await page.route(/.*expenseservice\/api\/v1\/expense-reports\/trends.*/, async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ dates: [], amounts: [] }),
    });
  });

  await page.route('**/expenseservice/api/v1/expense-categories', async (route: Route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Food', isDeleted: false },
        { id: 2, name: 'Travel', isDeleted: false },
      ]),
    });
  });

  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('jram.user', 'Password@123');

  const dashboard = new DashboardPage(page);
  await dashboard.expectLoaded();
  await dashboard.openManageMenu();
  await page.getByTestId('nav-expenses').click();
  await expect(page.getByRole('heading', { name: 'Expense Details' })).toBeVisible();
}

test.describe('Expense Form Date UI & API Submission Guard', () => {
  test('Date picker component has max attribute set to today local date', async ({ page }) => {
    await page.route('**/expenseservice/api/v1/expense-details', async (route: Route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([]),
      });
    });

    await setupAndNavigateToExpenses(page);
    await page.getByRole('button', { name: 'Add New Expense' }).click();
    await expect(page.getByRole('heading', { name: 'Create Expense' })).toBeVisible();

    const dateInput = page.locator('input[type="date"]');
    await expect(dateInput).toBeVisible();

    const maxAttr = await dateInput.getAttribute('max');
    const expectedToday = getTodayLocalDateString();
    expect(maxAttr).toBe(expectedToday);
  });

  test("Today's date is accepted and successfully submits to create API", async ({ page }) => {
    let createApiCalled = false;

    await page.route('**/expenseservice/api/v1/expense-details', async (route: Route) => {
      if (route.request().method() === 'POST') {
        createApiCalled = true;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 201, expenseName: 'Today Lunch' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    await setupAndNavigateToExpenses(page);
    await page.getByRole('button', { name: 'Add New Expense' }).click();
    await page.getByLabel('Expense Name').fill('Today Lunch');
    await page.getByLabel('Amount').fill('250');
    // Date is automatically initialized to today's local date
    await page.getByRole('button', { name: 'Save Expense' }).click();

    await expect(page.getByText('Expense created successfully.')).toBeVisible();
    expect(createApiCalled).toBe(true);
  });

  test("Yesterday's date is accepted and successfully submits to create API", async ({ page }) => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    const yesterdayStr = getTodayLocalDateString(yesterday);

    let createApiCalled = false;

    await page.route('**/expenseservice/api/v1/expense-details', async (route: Route) => {
      if (route.request().method() === 'POST') {
        createApiCalled = true;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 202, expenseName: 'Yesterday Train' }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    await setupAndNavigateToExpenses(page);
    await page.getByRole('button', { name: 'Add New Expense' }).click();
    await page.getByLabel('Expense Name').fill('Yesterday Train');
    await page.getByLabel('Amount').fill('450');
    await page.locator('input[type="date"]').fill(yesterdayStr);
    await page.getByRole('button', { name: 'Save Expense' }).click();

    await expect(page.getByText('Expense created successfully.')).toBeVisible();
    expect(createApiCalled).toBe(true);
  });

  test('Future date is rejected at submit-time, blocks create API, and shows error message', async ({
    page,
  }) => {
    let createApiCalled = false;

    await page.route('**/expenseservice/api/v1/expense-details', async (route: Route) => {
      if (route.request().method() === 'POST') {
        createApiCalled = true;
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 203 }),
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([]),
        });
      }
    });

    await setupAndNavigateToExpenses(page);
    await page.getByRole('button', { name: 'Add New Expense' }).click();
    await page.getByLabel('Expense Name').fill('Future Gadget');
    await page.getByLabel('Amount').fill('1200');

    // Enter a future date (10 days ahead)
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    const futureDateStr = getTodayLocalDateString(futureDate);
    await page.locator('input[type="date"]').fill(futureDateStr);

    // Attempt to submit
    await page.getByRole('button', { name: 'Save Expense' }).click();

    // Verify error validation message is displayed to user
    await expect(page.getByText('Expense date cannot be in the future.')).toBeVisible();

    // Verify expense creation API was never called
    expect(createApiCalled).toBe(false);
  });
});
