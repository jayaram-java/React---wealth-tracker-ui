export const credentials = {
  user: {
    username: 'jram.user',
    password: 'Password@123',
  },
  admin: {
    username: 'admin',
    password: 'Password@123',
  },
} as const;

export const e2eData = {
  expense: {
    name: 'E2E Lunch',
    category: 'Food',
    amount: '250',
  },
  websiteLink: {
    url: 'https://example.com/products/wealth-tracker',
    description: 'Reference docs',
    remarks: 'Created by Playwright',
  },
  checklist: {
    title: 'E2E checklist item',
    description: 'Created in test',
    status: 'PENDING',
    referenceLink: 'https://example.com/checklist',
  },
  report: {
    startDate: '2026-01-01',
    endDate: '2026-12-31',
  },
} as const;
