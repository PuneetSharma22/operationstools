import { test, expect } from "@playwright/test";

test.describe("Navigation", () => {

  test("home page loads", async ({ page }) => {
    await page.goto("/");
    // Use the header logo link — unique and specific
    await expect(page.getByRole("banner").getByRole("link", { name: "OpsTools" })).toBeVisible();
  });

  test("documents page loads", async ({ page }) => {
    await page.goto("/documents");
    await expect(page.getByRole("heading").first()).toBeVisible();
  });

  test("about page loads", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: /Tools built for people/i })).toBeVisible();
  });

  test("about page has roadmap section", async ({ page }) => {
    await page.goto("/about");
    await expect(page.getByRole("heading", { name: /What's coming next/i })).toBeVisible();
  });

  test("roadmap shows live fuel bill", async ({ page }) => {
    await page.goto("/about");
    // Use exact: true to match the LIVE badge span, not surrounding text
    await expect(page.getByText("LIVE", { exact: true })).toBeVisible();
  });

  test("header shows 0 credits for guest", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/Guest · 0 credits/i)).toBeVisible();
  });

  test("header has Log in and Sign up links", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("banner").getByRole("link", { name: "Log in" })).toBeVisible();
    await expect(page.getByRole("banner").getByRole("link", { name: "Sign up" })).toBeVisible();
  });
});

test.describe("Login Page", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/login");
  });

  test("login page loads", async ({ page }) => {
    await expect(page.getByRole("heading", { name: "Welcome back" })).toBeVisible();
  });

  test("email and password fields are present", async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator('input[type="password"]')).toBeVisible();
  });

  test("login button is present", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Log in/i })).toBeVisible();
  });

  test("shows error on wrong credentials", async ({ page }) => {
    await page.locator('input[type="email"]').fill("wrong@test.com");
    await page.locator('input[type="password"]').fill("wrongpassword");
    await page.getByRole("button", { name: /Log in/i }).click();
    await expect(page.locator(".bg-red-50")).toBeVisible({ timeout: 5000 });
  });

  test("sign up link navigates to signup page", async ({ page }) => {
    await page.getByRole("link", { name: /Sign up free/i }).click();
    await expect(page).toHaveURL(/signup/);
  });
});

test.describe("Signup Page", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/signup");
  });

  test("signup page loads", async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
  });

  test("email and password fields are present", async ({ page }) => {
    await expect(page.locator('input[type="email"]')).toBeVisible();
    // Use first() — signup may have password + confirm password fields
    await expect(page.locator('input[type="password"]').first()).toBeVisible();
  });

  test("log in link navigates to login page", async ({ page }) => {
    // Scope to the form area, not the header
    await page.locator("main, .min-h-\\[80vh\\], form").getByRole("link", { name: /Log in/i }).click();
    await expect(page).toHaveURL(/login/);
  });
});

test.describe("Account Page — Guest Redirect", () => {

  test("account page redirects guest to login", async ({ page }) => {
    await page.goto("/account");
    await expect(page).toHaveURL(/login/, { timeout: 5000 });
  });
});
