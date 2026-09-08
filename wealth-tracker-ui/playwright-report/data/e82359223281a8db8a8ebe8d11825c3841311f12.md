# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: expense.spec.ts >> Expense Module - Receipts Upload and View >> Expense can be submitted without receipts
- Location: e2e\tests\expense.spec.ts:172:3

# Error details

```
Error: POST data is not a valid JSON object: 3lOCZ6P7aSFaM7epau7tfZzl9MmUsGd5j9TRHEQzLDssNzWqowHkEUkGRcPR6FG6VOOFOsVNg/a99AogHrPlfq7HmcICHCQHDioUum01guz2j0GjTIGJs2rLZc4OBPLXHMO/b/bqyvJGPxsWFF2crQrOt3rfEEvvpoLZiGCRmlHZyaJZJC0UoOMTXdGog4CXLX/spanEEIDSjvScAFJspInDzNjgkNrf41FH9V5CjjNcMnZBHY+Lyv+Yu5vPryhKdDGe6Um8wRttYL9f4hLIvw4HOgbDK+/tEXNmfNG6dkzl74ZuKFAHaHJ389utKPTiqJQHxqlJvk/jGzXqw9oKW5AwaFY2Y4X9zFepzbCBYL7i3Q==
```

```
Error: expect(locator).toBeVisible() failed

Locator: getByText('Expense created successfully.')
Expected: visible
Error: element(s) not found

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByText('Expense created successfully.')

```

```yaml
- dialog:
  - heading "Create Expense" [level=6]
  - text: Expense Name
  - textbox "Expense Name": No receipt
  - text: Amount
  - spinbutton "Amount": "150"
  - text: Category
  - combobox "Category"
  - text: Payment Method
  - combobox "Payment Method": UPI
  - text: Date
  - textbox "Date": 2026-08-27
  - text: Receipt
  - textbox "Receipt"
  - text: Description
  - textbox "Description"
  - heading "Receipts (Optional)" [level=6]
  - button "Upload Receipts"
  - button "Cancel"
  - button "Saving..." [disabled]
```

# Test source

```ts
  93  |               {
  94  |                 id: 456,
  95  |                 fileName: 'food-bill.png',
  96  |                 contentType: 'image/png',
  97  |                 fileSize: 128000,
  98  |                 viewUrl: '/api/v1/expense-details/102/receipts/456',
  99  |               },
  100 |               {
  101 |                 id: 457,
  102 |                 fileName: 'taxi-bill.pdf',
  103 |                 contentType: 'application/pdf',
  104 |                 fileSize: 245760,
  105 |                 viewUrl: '/api/v1/expense-details/102/receipts/457',
  106 |               },
  107 |             ],
  108 |           },
  109 |         ]),
  110 |       });
  111 |     } else {
  112 |       await route.continue();
  113 |     }
  114 |   });
  115 | 
  116 |   // Navigate, login, and reach the dashboard
  117 |   const loginPage = new LoginPage(page);
  118 |   await loginPage.goto();
  119 |   await loginPage.login('jram.user', 'Password@123');
  120 | 
  121 |   const dashboard = new DashboardPage(page);
  122 |   await dashboard.expectLoaded();
  123 |   await dashboard.openManageMenu();
  124 |   await page.getByTestId('nav-expenses').click();
  125 |   await expect(page.getByRole('heading', { name: 'Expense Details' })).toBeVisible();
  126 | }
  127 | 
  128 | test.describe('Expense Module - Receipts Upload and View', () => {
  129 |   test('Expense form renders receipt upload control', async ({ page }) => {
  130 |     await mockBackendAndLogin(page);
  131 |     await page.getByRole('button', { name: 'Add New Expense' }).click();
  132 |     await expect(page.getByRole('heading', { name: 'Create Expense' })).toBeVisible();
  133 |     await expect(page.getByText('Receipts (Optional)')).toBeVisible();
  134 |     await expect(page.locator('input[type="file"]')).toBeAttached();
  135 |   });
  136 | 
  137 |   test('User can select and remove receipts', async ({ page }) => {
  138 |     await mockBackendAndLogin(page);
  139 |     await page.getByRole('button', { name: 'Add New Expense' }).click();
  140 | 
  141 |     const fileChooserPromise = page.waitForEvent('filechooser');
  142 |     await page.getByRole('button', { name: 'Upload Receipts' }).click();
  143 |     const fileChooser = await fileChooserPromise;
  144 |     await fileChooser.setFiles([
  145 |       { name: 'hotel-bill.pdf', mimeType: 'application/pdf', buffer: Buffer.from('pdf') },
  146 |       { name: 'food-bill.jpg', mimeType: 'image/jpeg', buffer: Buffer.from('jpg') },
  147 |     ]);
  148 | 
  149 |     await expect(page.getByText('hotel-bill.pdf')).toBeVisible();
  150 |     await expect(page.getByText('food-bill.jpg')).toBeVisible();
  151 | 
  152 |     await page.locator('li').filter({ hasText: 'food-bill.jpg' }).getByRole('button', { name: 'delete' }).click();
  153 |     await expect(page.getByText('food-bill.jpg')).not.toBeVisible();
  154 |     await expect(page.getByText('hotel-bill.pdf')).toBeVisible();
  155 |   });
  156 | 
  157 |   test('Invalid file type is rejected', async ({ page }) => {
  158 |     await mockBackendAndLogin(page);
  159 |     await page.getByRole('button', { name: 'Add New Expense' }).click();
  160 | 
  161 |     const fileChooserPromise = page.waitForEvent('filechooser');
  162 |     await page.getByRole('button', { name: 'Upload Receipts' }).click();
  163 |     const fileChooser = await fileChooserPromise;
  164 |     await fileChooser.setFiles([
  165 |       { name: 'document.txt', mimeType: 'text/plain', buffer: Buffer.from('txt') },
  166 |     ]);
  167 | 
  168 |     await expect(page.getByText('Unsupported receipt content type. Only PDF, JPEG, and PNG are allowed.')).toBeVisible();
  169 |     await expect(page.getByText('document.txt')).not.toBeVisible();
  170 |   });
  171 | 
  172 |   test('Expense can be submitted without receipts', async ({ page }) => {
  173 |     await mockBackendAndLogin(page);
  174 | 
  175 |     await page.route('**/expenseservice/api/v1/expense-details', async (route: any) => {
  176 |       if (route.request().method() === 'POST') {
  177 |         const payload = route.request().postDataJSON();
  178 |         await route.fulfill({
  179 |           status: 201,
  180 |           contentType: 'application/json',
  181 |           body: JSON.stringify({ id: 103, expenseName: payload?.expenseName }),
  182 |         });
  183 |       } else {
  184 |         await route.continue();
  185 |       }
  186 |     });
  187 | 
  188 |     await page.getByRole('button', { name: 'Add New Expense' }).click();
  189 |     await page.getByLabel('Expense Name').fill('No receipt');
  190 |     await page.getByLabel('Amount').fill('150');
  191 |     await page.getByRole('button', { name: 'Save Expense' }).click();
  192 | 
> 193 |     await expect(page.getByText('Expense created successfully.')).toBeVisible();
      |                                                                   ^ Error: expect(locator).toBeVisible() failed
  194 |   });
  195 | 
  196 |   test('FormData submission works with receipts', async ({ page }) => {
  197 |     await mockBackendAndLogin(page);
  198 | 
  199 |     let multipartDataSent = false;
  200 |     await page.route('**/expenseservice/api/v1/expense-details', async (route: any) => {
  201 |       if (route.request().method() === 'POST') {
  202 |         const contentType = route.request().headers()['content-type'] ?? '';
  203 |         multipartDataSent = contentType.includes('multipart/form-data');
  204 |         await route.fulfill({
  205 |           status: 201,
  206 |           contentType: 'application/json',
  207 |           body: JSON.stringify({ id: 104, expenseName: 'With receipts' }),
  208 |         });
  209 |       } else {
  210 |         await route.continue();
  211 |       }
  212 |     });
  213 | 
  214 |     await page.getByRole('button', { name: 'Add New Expense' }).click();
  215 |     await page.getByLabel('Expense Name').fill('With receipts');
  216 |     await page.getByLabel('Amount').fill('120');
  217 | 
  218 |     const fileChooserPromise = page.waitForEvent('filechooser');
  219 |     await page.getByRole('button', { name: 'Upload Receipts' }).click();
  220 |     const fileChooser = await fileChooserPromise;
  221 |     await fileChooser.setFiles([
  222 |       { name: 'hotel-bill.pdf', mimeType: 'application/pdf', buffer: Buffer.from('pdf') },
  223 |     ]);
  224 | 
  225 |     await page.getByRole('button', { name: 'Save Expense' }).click();
  226 |     await expect(page.getByText('Expense created successfully.')).toBeVisible();
  227 |     expect(multipartDataSent).toBe(true);
  228 |   });
  229 | 
  230 |   test('Receipt count displays in the table', async ({ page }) => {
  231 |     await mockBackendAndLogin(page);
  232 | 
  233 |     // Taxi to airport has 0 receipts — shows dash
  234 |     await expect(page.locator('tr').filter({ hasText: 'Taxi to airport' }).getByText('—')).toBeVisible();
  235 |     // Team Lunch has 2 receipts — shows button
  236 |     await expect(page.locator('tr').filter({ hasText: 'Team Lunch' }).getByRole('button', { name: '2 Receipts' })).toBeVisible();
  237 |   });
  238 | 
  239 |   test('Receipt list displays correctly in dialog', async ({ page }) => {
  240 |     await mockBackendAndLogin(page);
  241 |     await page.locator('tr').filter({ hasText: 'Team Lunch' }).getByRole('button', { name: '2 Receipts' }).click();
  242 | 
  243 |     await expect(page.getByRole('heading', { name: 'Receipts for Team Lunch' })).toBeVisible();
  244 |     await expect(page.getByText('food-bill.png')).toBeVisible();
  245 |     await expect(page.getByText('taxi-bill.pdf')).toBeVisible();
  246 |     await expect(page.getByText('PNG • 125 KB')).toBeVisible();
  247 |     await expect(page.getByText('PDF • 240 KB')).toBeVisible();
  248 |   });
  249 | 
  250 |   test('Download receipt calls correct API', async ({ page }) => {
  251 |     await mockBackendAndLogin(page);
  252 | 
  253 |     let apiCalledForReceipt = false;
  254 |     await page.route(/.*expenseservice\/api\/v1\/expense-details\/102\/receipts\/457.*/, async (route: any) => {
  255 |       apiCalledForReceipt = true;
  256 |       await route.fulfill({ status: 200, contentType: 'application/pdf', body: Buffer.from('mock pdf') });
  257 |     });
  258 | 
  259 |     await page.locator('tr').filter({ hasText: 'Team Lunch' }).getByRole('button', { name: '2 Receipts' }).click();
  260 |     await page.locator('li').filter({ hasText: 'taxi-bill.pdf' }).getByRole('button', { name: 'Download' }).click();
  261 |     expect(apiCalledForReceipt).toBe(true);
  262 |   });
  263 | 
  264 |   test('Error handling for 403 on receipt view', async ({ page }) => {
  265 |     await mockBackendAndLogin(page);
  266 | 
  267 |     await page.route(/.*expenseservice\/api\/v1\/expense-details\/102\/receipts\/457.*/, async (route: any) => {
  268 |       await route.fulfill({
  269 |         status: 403,
  270 |         contentType: 'application/json',
  271 |         body: JSON.stringify({ message: 'You do not have permission to access this receipt.' }),
  272 |       });
  273 |     });
  274 | 
  275 |     await page.locator('tr').filter({ hasText: 'Team Lunch' }).getByRole('button', { name: '2 Receipts' }).click();
  276 |     await page.locator('li').filter({ hasText: 'taxi-bill.pdf' }).getByRole('button', { name: 'View' }).click();
  277 | 
  278 |     await expect(page.getByText('You do not have permission to access this receipt.')).toBeVisible();
  279 |   });
  280 | 
  281 |   test('Error handling for 404 on receipt view', async ({ page }) => {
  282 |     await mockBackendAndLogin(page);
  283 | 
  284 |     await page.route(/.*expenseservice\/api\/v1\/expense-details\/102\/receipts\/457.*/, async (route: any) => {
  285 |       await route.fulfill({
  286 |         status: 404,
  287 |         contentType: 'application/json',
  288 |         body: JSON.stringify({ message: 'Receipt not found.' }),
  289 |       });
  290 |     });
  291 | 
  292 |     await page.locator('tr').filter({ hasText: 'Team Lunch' }).getByRole('button', { name: '2 Receipts' }).click();
  293 |     await page.locator('li').filter({ hasText: 'taxi-bill.pdf' }).getByRole('button', { name: 'View' }).click();
```