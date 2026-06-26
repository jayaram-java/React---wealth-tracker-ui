# Playwright E2E

## Setup

1. Install dependencies:

```bash
npm install
npx playwright install --with-deps chromium
```

2. Ensure the app can start at:

`http://localhost:5173/wealth-tracker`

## Run

```bash
npm run test:e2e
npm run test:e2e:headed
npm run test:e2e:ui
npm run test:e2e:report
```

## Test Structure

- `e2e/tests/` contains spec files
- `e2e/pages/` contains Page Object Model classes
- `e2e/fixtures/` contains reusable data
- `e2e/utils/` contains shared helpers

## Notes

- Tests use Chromium only.
- Screenshots, videos, and traces are captured on failure/retry.
- Stable selectors should prefer `data-testid` where possible.
