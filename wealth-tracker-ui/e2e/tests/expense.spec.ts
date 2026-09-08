import { expect, test } from '@playwright/test';
import { DashboardPage } from '../pages/DashboardPage';
import { LoginPage } from '../pages/LoginPage';

// A structural JWT with payload {"userId":1,"roles":["ROLE_USER"]} - properly base64url-encoded
// header: {"alg":"HS256","typ":"JWT"}  -> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
// payload: {"userId":1,"roles":["ROLE_USER"]} -> eyJ1c2VySWQiOjEsInJvbGVzIjpbIlJPTEVfVVNFUiJdfQ
// signature: mock
const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInJvbGVzIjpbIlJPTEVfVVNFUiJdfQ.mocksignature';

async function mockBackendAndLogin(page: any) {
  // Mock auth login
  await page.route('**/authservice/api/auth/login', async (route: any) => {
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

  // Mock dashboard summaries (with wildcard for query params)
  await page.route(/.*expenseservice\/api\/v1\/expense-reports\/summary.*/, async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ totalAmount: 2950.00, expenseCount: 2, averageAmount: 1475.00 }),
    });
  });

  // Mock dashboard trends
  await page.route(/.*expenseservice\/api\/v1\/expense-reports\/trends.*/, async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({ dates: ['2026-08-27'], amounts: [2950.00] }),
    });
  });

  // Mock expense categories
  await page.route('**/expenseservice/api/v1/expense-categories', async (route: any) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify([
        { id: 1, name: 'Food', isDeleted: false },
        { id: 2, name: 'Travel', isDeleted: false },
      ]),
    });
  });

  // Mock expense details GET
  await page.route('**/expenseservice/api/v1/expense-details', async (route: any) => {
    if (route.request().method() === 'GET') {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify([
          {
            id: 101,
            expenseName: 'Taxi to airport',
            expenseDate: '2026-08-27',
            amount: 450.0,
            description: 'Taxi ride',
            paymentMethod: 'UPI',
            expenseCode: 'EXP-101',
            referenceNumber: 'REF-101',
            receiptUrl: '',
            currency: 'INR',
            userId: 1,
            status: 'ACTIVE',
            categoryId: 2,
            receipts: [],
          },
          {
            id: 102,
            expenseName: 'Team Lunch',
            expenseDate: '2026-08-27',
            amount: 2500.0,
            description: 'Lunch at restaurant',
            paymentMethod: 'Credit card',
            expenseCode: 'EXP-102',
            referenceNumber: 'REF-102',
            receiptUrl: '',
            currency: 'INR',
            userId: 1,
            status: 'ACTIVE',
            categoryId: 1,
            receipts: [
              {
                id: 456,
                fileName: 'food-bill.png',
                contentType: 'image/png',
                fileSize: 128000,
                viewUrl: '/api/v1/expense-details/102/receipts/456',
              },
              {
                id: 457,
                fileName: 'taxi-bill.pdf',
                contentType: 'application/pdf',
                fileSize: 245760,
                viewUrl: '/api/v1/expense-details/102/receipts/457',
              },
            ],
          },
        ]),
      });
    } else {
      await route.continue();
    }
  });

  // Navigate, login, and reach the dashboard
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login('jram.user', 'Password@123');

  const dashboard = new DashboardPage(page);
  await dashboard.expectLoaded();
  await dashboard.openManageMenu();
  await page.getByTestId('nav-expenses').click();
  await expect(page.getByRole('heading', { name: 'Expense Details' })).toBeVisible();
}

test.describe('Expense Module - Receipts Upload and View', () => {
  test('Expense form renders receipt upload control', async ({ page }) => {
    await mockBackendAndLogin(page);
    await page.getByRole('button', { name: 'Add New Expense' }).click();
    await expect(page.getByRole('heading', { name: 'Create Expense' })).toBeVisible();
    await expect(page.getByText('Receipts (Optional)')).toBeVisible();
    await expect(page.locator('input[type="file"]')).toBeAttached();
  });

  test('User can select and remove receipts', async ({ page }) => {
    await mockBackendAndLogin(page);
    await page.getByRole('button', { name: 'Add New Expense' }).click();

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Upload Receipts' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([
      { name: 'hotel-bill.pdf', mimeType: 'application/pdf', buffer: Buffer.from('pdf') },
      { name: 'food-bill.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('jpg') },
    ]);

    await expect(page.getByText('hotel-bill.pdf')).toBeVisible();
    await expect(page.getByText('food-bill.jpg')).toBeVisible();

    await page.locator('li').filter({ hasText: 'food-bill.jpg' }).getByRole('button', { name: 'delete' }).click();
    await expect(page.getByText('food-bill.jpg')).not.toBeVisible();
    await expect(page.getByText('hotel-bill.pdf')).toBeVisible();
  });

  test('Invalid file type is rejected', async ({ page }) => {
    await mockBackendAndLogin(page);
    await page.getByRole('button', { name: 'Add New Expense' }).click();

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Upload Receipts' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([
      { name: 'document.txt', mimeType: 'text/plain', buffer: Buffer.from('txt') },
    ]);

    await expect(page.getByText('Unsupported receipt content type. Only PDF, JPEG, and PNG are allowed.')).toBeVisible();
    await expect(page.getByText('document.txt')).not.toBeVisible();
  });

  test('Expense can be submitted without receipts', async ({ page }) => {
    await mockBackendAndLogin(page);

    await page.route('**/expenseservice/api/v1/expense-details', async (route: any) => {
      if (route.request().method() === 'POST') {
        const payload = route.request().postDataJSON();
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 103, expenseName: payload?.expenseName }),
        });
      } else {
        await route.continue();
      }
    });

    await page.getByRole('button', { name: 'Add New Expense' }).click();
    await page.getByLabel('Expense Name').fill('No receipt');
    await page.getByLabel('Amount').fill('150');
    await page.getByRole('button', { name: 'Save Expense' }).click();

    await expect(page.getByText('Expense created successfully.')).toBeVisible();
  });

  test('FormData submission works with receipts', async ({ page }) => {
    await mockBackendAndLogin(page);

    let multipartDataSent = false;
    await page.route('**/expenseservice/api/v1/expense-details', async (route: any) => {
      if (route.request().method() === 'POST') {
        const contentType = route.request().headers()['content-type'] ?? '';
        multipartDataSent = contentType.includes('multipart/form-data');
        await route.fulfill({
          status: 201,
          contentType: 'application/json',
          body: JSON.stringify({ id: 104, expenseName: 'With receipts' }),
        });
      } else {
        await route.continue();
      }
    });

    await page.getByRole('button', { name: 'Add New Expense' }).click();
    await page.getByLabel('Expense Name').fill('With receipts');
    await page.getByLabel('Amount').fill('120');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Upload Receipts' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([
      { name: 'hotel-bill.pdf', mimeType: 'application/pdf', buffer: Buffer.from('pdf') },
    ]);

    await page.getByRole('button', { name: 'Save Expense' }).click();
    await expect(page.getByText('Expense created successfully.')).toBeVisible();
    expect(multipartDataSent).toBe(true);
  });

  test('Receipt count displays in the table', async ({ page }) => {
    await mockBackendAndLogin(page);

    // Taxi to airport has 0 receipts — shows dash
    await expect(page.locator('tr').filter({ hasText: 'Taxi to airport' }).getByText('—')).toBeVisible();
    // Team Lunch has 2 receipts — shows button
    await expect(page.locator('tr').filter({ hasText: 'Team Lunch' }).getByRole('button', { name: '2 Receipts' })).toBeVisible();
  });

  test('Receipt list displays correctly in dialog', async ({ page }) => {
    await mockBackendAndLogin(page);
    await page.locator('tr').filter({ hasText: 'Team Lunch' }).getByRole('button', { name: '2 Receipts' }).click();

    await expect(page.getByRole('heading', { name: 'Receipts for Team Lunch' })).toBeVisible();
    await expect(page.getByText('food-bill.png')).toBeVisible();
    await expect(page.getByText('taxi-bill.pdf')).toBeVisible();
    await expect(page.getByText('PNG • 125 KB')).toBeVisible();
    await expect(page.getByText('PDF • 240 KB')).toBeVisible();
  });

  test('Download receipt calls correct API', async ({ page }) => {
    await mockBackendAndLogin(page);

    let apiCalledForReceipt = false;
    await page.route(/.*expenseservice\/api\/v1\/expense-details\/102\/receipts\/457.*/, async (route: any) => {
      apiCalledForReceipt = true;
      await route.fulfill({ status: 200, contentType: 'application/pdf', body: Buffer.from('mock pdf') });
    });

    await page.locator('tr').filter({ hasText: 'Team Lunch' }).getByRole('button', { name: '2 Receipts' }).click();
    await page.locator('li').filter({ hasText: 'taxi-bill.pdf' }).getByRole('button', { name: 'Download' }).click();
    expect(apiCalledForReceipt).toBe(true);
  });

  test('Error handling for 403 on receipt view', async ({ page }) => {
    await mockBackendAndLogin(page);

    await page.route(/.*expenseservice\/api\/v1\/expense-details\/102\/receipts\/457.*/, async (route: any) => {
      await route.fulfill({
        status: 403,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'You do not have permission to access this receipt.' }),
      });
    });

    await page.locator('tr').filter({ hasText: 'Team Lunch' }).getByRole('button', { name: '2 Receipts' }).click();
    await page.locator('li').filter({ hasText: 'taxi-bill.pdf' }).getByRole('button', { name: 'View' }).click();

    await expect(page.getByText('You do not have permission to access this receipt.')).toBeVisible();
  });

  test('Error handling for 404 on receipt view', async ({ page }) => {
    await mockBackendAndLogin(page);

    await page.route(/.*expenseservice\/api\/v1\/expense-details\/102\/receipts\/457.*/, async (route: any) => {
      await route.fulfill({
        status: 404,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Receipt not found.' }),
      });
    });

    await page.locator('tr').filter({ hasText: 'Team Lunch' }).getByRole('button', { name: '2 Receipts' }).click();
    await page.locator('li').filter({ hasText: 'taxi-bill.pdf' }).getByRole('button', { name: 'View' }).click();

    await expect(page.getByText('Receipt not found.')).toBeVisible();
  });

  test('Error handling for 413 on expense submission', async ({ page }) => {
    await mockBackendAndLogin(page);

    await page.route('**/expenseservice/api/v1/expense-details', async (route: any) => {
      if (route.request().method() === 'POST') {
        await route.fulfill({
          status: 413,
          contentType: 'application/json',
          body: JSON.stringify({ message: 'The uploaded file is too large.' }),
        });
      } else {
        await route.continue();
      }
    });

    await page.getByRole('button', { name: 'Add New Expense' }).click();
    await page.getByLabel('Expense Name').fill('Huge receipt');
    await page.getByLabel('Amount').fill('150');

    const fileChooserPromise = page.waitForEvent('filechooser');
    await page.getByRole('button', { name: 'Upload Receipts' }).click();
    const fileChooser = await fileChooserPromise;
    await fileChooser.setFiles([
      { name: 'huge-file.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(10 * 1024) },
    ]);

    await page.getByRole('button', { name: 'Save Expense' }).click();
    await expect(page.getByText('The uploaded file is too large.')).toBeVisible();
  });
});
