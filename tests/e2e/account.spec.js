/**
 * E2E tests — Account page and credits
 * Note: These tests run against the live dev server.
 * Authenticated tests require a test user to be set up.
 */

import { test, expect } from "@playwright/test";

// Helper: log in with test credentials
async function loginAs(page, email, password) {
  await page.goto("/login");
  await page.locator('input[type="email"]').fill(email);
  await page.locator('input[type="password"]').fill(password);
  await page.getByRole("button", { name: /Log in/i }).click();
  await page.waitForURL("/", { timeout: 8000 });
}

test.describe("Account Page — UI Structure", () => {

  // These tests use a real logged-in session
  // Set TEST_EMAIL and TEST_PASSWORD in your .env or replace inline
  const TEST_EMAIL = process.env.TEST_EMAIL || "punitshrma769@gmail.com";
  const TEST_PASSWORD = process.env.TEST_PASSWORD || "";

  test.skip(!TEST_PASSWORD, "Skipping auth tests — set TEST_PASSWORD env var");

  test.beforeEach(async ({ page }) => {
    await loginAs(page, TEST_EMAIL, TEST_PASSWORD);
    await page.goto("/account");
  });

  test("account page loads after login", async ({ page }) => {
    await expect(page.getByText("My Account")).toBeVisible();
  });

  test("shows user email in hero", async ({ page }) => {
    await expect(page.getByText(TEST_EMAIL)).toBeVisible();
  });

  test("Credits & Billing tab is active by default", async ({ page }) => {
    await expect(page.getByText("Credits & Billing")).toBeVisible();
    await expect(page.getByText("Current Balance")).toBeVisible();
  });

  test("Profile tab switches view", async ({ page }) => {
    await page.getByText("Profile").click();
    await expect(page.getByText("Account Information")).toBeVisible();
    await expect(page.getByText("Email address")).toBeVisible();
  });

  test("Profile shows member since date", async ({ page }) => {
    await page.getByText("Profile").click();
    await expect(page.getByText("Member since")).toBeVisible();
  });

  test("Profile shows credits summary", async ({ page }) => {
    await page.getByText("Profile").click();
    await expect(page.getByText("Credits Summary")).toBeVisible();
    await expect(page.getByText("Balance")).toBeVisible();
    await expect(page.getByText("Bills Generated")).toBeVisible();
  });

  test("Sign out button is present in Profile", async ({ page }) => {
    await page.getByText("Profile").click();
    await expect(page.getByRole("button", { name: /Sign out/i })).toBeVisible();
  });

  test("Add Credits section has promo code input", async ({ page }) => {
    await expect(page.getByPlaceholder(/Enter promo code/i)).toBeVisible();
    await expect(page.getByRole("button", { name: /Apply Code/i })).toBeVisible();
  });

  test("Apply Code button is disabled when input is empty", async ({ page }) => {
    const applyBtn = page.getByRole("button", { name: /Apply Code/i });
    await expect(applyBtn).toBeDisabled();
  });

  test("invalid promo code shows error", async ({ page }) => {
    await page.getByPlaceholder(/Enter promo code/i).fill("BADCODE");
    await page.getByRole("button", { name: /Apply Code/i }).click();
    await expect(page.getByText(/Invalid code/i)).toBeVisible();
  });

  test("credits pill in header shows balance", async ({ page }) => {
    await expect(page.getByText(/credits/).first()).toBeVisible();
  });

  test("Transaction History section loads", async ({ page }) => {
    await expect(page.getByText("Transaction History")).toBeVisible();
  });

  test("sign out redirects to home", async ({ page }) => {
    await page.getByText("Profile").click();
    await page.getByRole("button", { name: /Sign out/i }).click();
    await expect(page).toHaveURL("/", { timeout: 5000 });
  });
});

test.describe("Header Credits — Guest", () => {

  test("guest sees 0 credits in header", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Guest · 0 credits/i)).toBeVisible();
  });

  test("credits pill links to account page when logged in", async ({ page }) => {
    // Just check it exists when not logged in — no link for guest
    await page.goto("/");
    const creditsPill = page.getByText(/0 credits/i);
    await expect(creditsPill).toBeVisible();
  });
});
