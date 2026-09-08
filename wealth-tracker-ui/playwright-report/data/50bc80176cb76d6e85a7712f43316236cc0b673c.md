# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: expense.spec.ts >> Expense Module - Receipts Upload and View >> Receipt list displays correctly in dialog
- Location: e2e\tests\expense.spec.ts:239:3

# Error details

```
Error: expect(locator).toBeVisible() failed

Locator: getByRole('heading', { name: 'Receipts for Team Lunch' })
Expected: visible
Error: strict mode violation: getByRole('heading', { name: 'Receipts for Team Lunch' }) resolved to 2 elements:
    1) <h2 id="_r_h_" class="MuiTypography-root MuiTypography-h6 MuiDialogTitle-root css-1bhoqty-MuiTypography-root-MuiDialogTitle-root">…</h2> aka locator('[id="_r_h_"]')
    2) <h6 class="MuiTypography-root MuiTypography-h6 css-h9fkkg-MuiTypography-root">Receipts for Team Lunch</h6> aka getByText('Receipts for Team Lunch')

Call log:
  - Expect "toBeVisible" with timeout 5000ms
  - waiting for getByRole('heading', { name: 'Receipts for Team Lunch' })

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - generic [ref=e2]:
    - banner [ref=e3]:
      - generic [ref=e4]:
        - button [ref=e5] [cursor=pointer]:
          - generic [ref=e6]: 💰
          - generic [ref=e7]: Wealth Tracker
        - navigation [ref=e8]:
          - button [ref=e9] [cursor=pointer]:
            - img [ref=e10]
            - text: Dashboard
          - button [ref=e16] [cursor=pointer]:
            - img [ref=e17]
            - text: Manage
          - button [ref=e22] [cursor=pointer]:
            - img [ref=e23]
            - text: Reports
        - button [ref=e27] [cursor=pointer]:
          - generic [ref=e28]: J
    - generic [ref=e30]:
      - generic [ref=e33]:
        - generic [ref=e34]:
          - text: Personal Finance Hub
          - heading [level=4] [ref=e35]: Expense Details
          - paragraph [ref=e36]: Track your expenses and savings efficiently.
        - generic [ref=e37]:
          - button [ref=e38] [cursor=pointer]:
            - img [ref=e40]
            - text: Refresh
          - button [ref=e42] [cursor=pointer]:
            - img [ref=e44]
            - text: Add New Expense
      - generic [ref=e46]:
        - generic [ref=e48]:
          - paragraph [ref=e49]: Total Expenses
          - heading [level=5] [ref=e50]: ₹2,950
        - generic [ref=e52]:
          - paragraph [ref=e53]: Monthly Spend
          - heading [level=5] [ref=e54]: ₹2,950
        - generic [ref=e56]:
          - paragraph [ref=e57]: Categories
          - heading [level=5] [ref=e58]: "2"
        - generic [ref=e60]:
          - paragraph [ref=e61]: This Month
          - heading [level=5] [ref=e62]: 2 Expenses
      - generic [ref=e64]:
        - generic [ref=e66]:
          - img [ref=e68]
          - textbox [ref=e70]:
            - /placeholder: Search by name, category or payment...
          - group
        - generic [ref=e71]:
          - button [ref=e72] [cursor=pointer]:
            - generic [ref=e73]: All
          - button [ref=e74] [cursor=pointer]:
            - generic [ref=e75]: Food
          - button [ref=e76] [cursor=pointer]:
            - generic [ref=e77]: Travel
      - generic [ref=e81]:
        - generic [ref=e82]:
          - generic [ref=e83]:
            - heading [level=6] [ref=e84]: Saved Expenses
            - paragraph [ref=e85]: Review, filter, and update the expenses in your ledger.
          - paragraph [ref=e86]: Showing 2 of 2 records
        - generic [ref=e87]:
          - button [ref=e88] [cursor=pointer]:
            - generic [ref=e89]: All
          - button [ref=e90] [cursor=pointer]:
            - generic [ref=e91]: Food
        - generic [ref=e93]:
          - generic [ref=e95]:
            - img [ref=e97]
            - textbox [ref=e99]:
              - /placeholder: Search expenses...
            - group
          - generic [ref=e100]:
            - generic: Category
            - generic [ref=e101]:
              - combobox [ref=e102] [cursor=pointer]
              - textbox
              - img
              - group:
                - generic: Category
          - generic [ref=e103]:
            - generic [ref=e104]: Sort
            - generic [ref=e105]:
              - combobox [ref=e106] [cursor=pointer]: Recently Added
              - textbox: recentlyAdded
              - img
              - group:
                - generic: Sort
        - table [ref=e108]:
          - rowgroup [ref=e109]:
            - row [ref=e110]:
              - columnheader [ref=e111]: Expense
              - columnheader [ref=e112]: Amount
              - columnheader [ref=e113]: Category
              - columnheader [ref=e114]: Payment
              - columnheader [ref=e115]: Date
              - columnheader [ref=e116]: Receipt URL
              - columnheader [ref=e117]: Receipts
              - columnheader [ref=e118]: Actions
          - rowgroup [ref=e119]:
            - row [ref=e120]:
              - cell [ref=e121]:
                - generic [ref=e122]:
                  - paragraph [ref=e123]: Taxi to airport
                  - generic [ref=e124]: "Ref #EXP-101 - row 1"
              - cell [ref=e125]:
                - paragraph [ref=e126]: 450.00 INR
              - cell [ref=e127]: Travel
              - cell [ref=e128]: UPI
              - cell [ref=e129]: 2026-08-27
              - cell [ref=e130]:
                - link [ref=e131] [cursor=pointer]:
                  - /url: ""
                  - img [ref=e132]
              - cell [ref=e134]:
                - paragraph [ref=e135]: —
              - cell [ref=e136]:
                - generic [ref=e137]:
                  - button [ref=e138] [cursor=pointer]:
                    - img [ref=e139]
                  - button [ref=e141] [cursor=pointer]:
                    - img [ref=e142]
            - row [ref=e144]:
              - cell [ref=e145]:
                - generic [ref=e146]:
                  - paragraph [ref=e147]: Team Lunch
                  - generic [ref=e148]: "Ref #EXP-102 - row 2"
              - cell [ref=e149]:
                - paragraph [ref=e150]: 2500.00 INR
              - cell [ref=e151]: Food
              - cell [ref=e152]: Credit card
              - cell [ref=e153]: 2026-08-27
              - cell [ref=e154]:
                - link [ref=e155] [cursor=pointer]:
                  - /url: ""
                  - img [ref=e156]
              - cell [ref=e158]:
                - button [ref=e159] [cursor=pointer]:
                  - img [ref=e161]
                  - text: 2 Receipts
              - cell [ref=e163]:
                - generic [ref=e164]:
                  - button [ref=e165] [cursor=pointer]:
                    - img [ref=e166]
                  - button [ref=e168] [cursor=pointer]:
                    - img [ref=e169]
        - generic [ref=e171]:
          - paragraph [ref=e172]: Page 1 of 1
          - generic [ref=e174]:
            - paragraph [ref=e175]: Rows
            - generic [ref=e176]:
              - combobox [ref=e177] [cursor=pointer]: "10"
              - textbox: "10"
              - img
            - paragraph [ref=e178]: 1–2 of 2
            - generic [ref=e179]:
              - button [disabled]:
                - img
              - button [disabled]:
                - img
      - button [ref=e180] [cursor=pointer]:
        - img [ref=e181]
    - button [ref=e184] [cursor=pointer]:
      - img [ref=e185]
      - generic [ref=e187]: Chat
  - dialog "Receipts for Team Lunch" [active] [ref=e190]:
    - heading "Receipts for Team Lunch" [level=2] [ref=e191]:
      - heading "Receipts for Team Lunch" [level=6] [ref=e192]
      - button [ref=e193] [cursor=pointer]:
        - img [ref=e194]
    - separator [ref=e196]
    - list [ref=e198]:
      - listitem [ref=e200]:
        - generic [ref=e201]:
          - paragraph [ref=e203]: food-bill.png
          - paragraph [ref=e204]: PNG • 125 KB
        - generic [ref=e205]:
          - button "View" [ref=e206] [cursor=pointer]:
            - img [ref=e208]
            - text: View
          - button "Download" [ref=e210] [cursor=pointer]:
            - img [ref=e212]
            - text: Download
      - generic [ref=e214]:
        - separator [ref=e215]
        - listitem [ref=e216]:
          - generic [ref=e217]:
            - paragraph [ref=e219]: taxi-bill.pdf
            - paragraph [ref=e220]: PDF • 240 KB
          - generic [ref=e221]:
            - button "View" [ref=e222] [cursor=pointer]:
              - img [ref=e224]
              - text: View
            - button "Download" [ref=e226] [cursor=pointer]:
              - img [ref=e228]
              - text: Download
    - button "Close" [ref=e231] [cursor=pointer]
```

# Test source

```ts
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
  193 |     await expect(page.getByText('Expense created successfully.')).toBeVisible();
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
> 243 |     await expect(page.getByRole('heading', { name: 'Receipts for Team Lunch' })).toBeVisible();
      |                                                                                  ^ Error: expect(locator).toBeVisible() failed
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
  294 | 
  295 |     await expect(page.getByText('Receipt not found.')).toBeVisible();
  296 |   });
  297 | 
  298 |   test('Error handling for 413 on expense submission', async ({ page }) => {
  299 |     await mockBackendAndLogin(page);
  300 | 
  301 |     await page.route('**/expenseservice/api/v1/expense-details', async (route: any) => {
  302 |       if (route.request().method() === 'POST') {
  303 |         await route.fulfill({
  304 |           status: 413,
  305 |           contentType: 'application/json',
  306 |           body: JSON.stringify({ message: 'The uploaded file is too large.' }),
  307 |         });
  308 |       } else {
  309 |         await route.continue();
  310 |       }
  311 |     });
  312 | 
  313 |     await page.getByRole('button', { name: 'Add New Expense' }).click();
  314 |     await page.getByLabel('Expense Name').fill('Huge receipt');
  315 |     await page.getByLabel('Amount').fill('150');
  316 | 
  317 |     const fileChooserPromise = page.waitForEvent('filechooser');
  318 |     await page.getByRole('button', { name: 'Upload Receipts' }).click();
  319 |     const fileChooser = await fileChooserPromise;
  320 |     await fileChooser.setFiles([
  321 |       { name: 'huge-file.pdf', mimeType: 'application/pdf', buffer: Buffer.alloc(10 * 1024) },
  322 |     ]);
  323 | 
  324 |     await page.getByRole('button', { name: 'Save Expense' }).click();
  325 |     await expect(page.getByText('The uploaded file is too large.')).toBeVisible();
  326 |   });
  327 | });
  328 | 
```