# OpsTools — Regression Testing Guide

## Setup (one-time)

```bash
cd /Users/puneetsharma/Fuel_Bill_Generator

# Install test dependencies
npm install -D vitest @vitest/ui jsdom @testing-library/react @testing-library/jest-dom @testing-library/user-event @playwright/test

# Install Playwright browsers
npx playwright install chromium
```

Add these scripts to your `package.json` under `"scripts"`:
```json
"test":        "vitest run",
"test:watch":  "vitest",
"test:ui":     "vitest --ui",
"test:e2e":    "playwright test",
"test:e2e:ui": "playwright test --ui",
"test:all":    "vitest run && playwright test"
```

For authenticated E2E tests, add to your `.env`:
```
TEST_PASSWORD=your_actual_password
```

---

## Running Tests

### Unit + Component Tests (fast, ~5 seconds)
```bash
npm run test
```

### E2E Tests (requires dev server, ~30 seconds)
```bash
# Terminal 1 — start dev server (if not already running)
npm run dev

# Terminal 2 — run E2E tests
npm run test:e2e
```

### All tests
```bash
npm run test:all
```

---

## What's covered

### Unit Tests (`src/test/unit/`)

| Test File | What it tests |
|-----------|--------------|
| `billCalculations.test.js` | Total calculation, amount/volume formatting, date formatting, promo code math |
| `templateRendering.test.jsx` | All 4 receipt templates render correct fields, amounts, station name |

### E2E Tests (`tests/e2e/`)

| Test File | What it tests |
|-----------|--------------|
| `fuelBill.spec.js` | Template switching, live preview updates, form collapse, modal open/close, FAQ |
| `auth.spec.js` | Login page, signup page, wrong credentials error, guest redirect from /account |
| `account.spec.js` | Account page structure, promo code validation, sign out, credits summary |

---

## Regression checklist — run before every deploy

```bash
npm run test:all
```

Expected: all unit tests pass, all E2E tests pass (authenticated tests skip if TEST_PASSWORD not set).

---

## Adding new tests

- **New tool/template** → add component test in `src/test/unit/templateRendering.test.jsx`
- **New page** → add E2E spec in `tests/e2e/`
- **New calculation logic** → add unit test in `src/test/unit/billCalculations.test.js`
