import { test, expect } from "@playwright/test";

test.describe("Fuel Bill Generator", () => {

  test.beforeEach(async ({ page }) => {
    await page.goto("/documents/fuel-bill");
    // Wait for page to fully load
    await page.waitForLoadState("networkidle");
  });

  test("page loads with correct title", async ({ page }) => {
    await expect(page).toHaveTitle(/Fuel Bill/i);
  });

  test("hero heading is visible", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /Free Fuel Bill Generator/i })).toBeVisible();
  });

  test("all 4 templates are shown", async ({ page }) => {
    // Scope to the template picker section — buttons, not SEO content
    const picker = page.locator(".no-print").first();
    await expect(page.getByRole("button", { name: /Thermal Full/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Classic POS/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /IOCL Formal/i }).first()).toBeVisible();
    await expect(page.getByRole("button", { name: /Thermal Compact/i }).first()).toBeVisible();
  });

  test("Thermal Full is selected by default", async ({ page }) => {
    const thermalBtn = page.getByRole("button", { name: /Thermal Full Dot-matrix/i });
    await expect(thermalBtn).toBeVisible();
    await expect(thermalBtn).toHaveClass(/border-\[#2563EB\]/);
  });

  test("clicking Classic POS switches template", async ({ page }) => {
    await page.getByRole("button", { name: /Classic POS Monospace/i }).click();
    await expect(page.getByText("ORIGINAL")).toBeVisible();
  });

  test("clicking IOCL Formal switches template", async ({ page }) => {
    await page.getByRole("button", { name: /IOCL Formal Logo/i }).click();
    await expect(page.getByText("TOTAL AMOUNT:")).toBeVisible();
  });

  test("live preview updates when station name is changed", async ({ page }) => {
    const input = page.locator('input[name="stationName"]');
    await input.clear();
    await input.fill("MY TEST PUMP");
    await expect(page.getByText("MY TEST PUMP").first()).toBeVisible();
  });

  test("live preview updates when quantity is entered", async ({ page }) => {
    const qtyInput = page.locator('input[name="quantity"]');
    await qtyInput.fill("10");
    await expect(page.getByText(/1042/).first()).toBeVisible();
  });

  test("form sections are collapsible", async ({ page }) => {
    // Click the Bill Details section button to collapse it
    const billDetailsBtn = page.getByRole("button", { name: /🧾 Bill Details/i });
    await expect(billDetailsBtn).toBeVisible();
    await billDetailsBtn.click();
    // After collapse, the date input should be hidden (grid-template-rows: 0fr)
    // Check the parent container has collapsed
    await page.waitForTimeout(400); // wait for CSS transition
    const dateInput = page.locator('input[name="billDate"]');
    const box = await dateInput.boundingBox();
    expect(box?.height ?? 0).toBeLessThanOrEqual(1);
  });

  test("Save PDF button is visible next to Live Preview", async ({ page }) => {
    // Use exact label text scoped to the preview header
    await expect(page.getByText("Live Preview", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: /Save PDF/i })).toBeVisible();
  });

  test("Generate in Bulk button is visible in hero", async ({ page }) => {
    await expect(page.getByRole("button", { name: /Generate in Bulk/i })).toBeVisible();
  });

  test("Generate in Bulk shows login modal for guest", async ({ page }) => {
    await page.getByRole("button", { name: /Generate in Bulk/i }).click();
    await expect(page.getByRole("heading", { name: /Sign in to generate in bulk/i })).toBeVisible();
  });

  test("login modal has Log in and Sign up buttons", async ({ page }) => {
    await page.getByRole("button", { name: /Generate in Bulk/i }).click();
    // Scope to the modal — find the dialog/modal container
    const modal = page.locator('[style*="position: fixed"]').last();
    await expect(modal.getByRole("link", { name: "Log in" })).toBeVisible();
    await expect(modal.getByRole("link", { name: /Sign up free/i })).toBeVisible();
  });

  test("modal closes on backdrop click", async ({ page }) => {
    await page.getByRole("button", { name: /Generate in Bulk/i }).click();
    await expect(page.getByRole("heading", { name: /Sign in to generate in bulk/i })).toBeVisible();
    await page.mouse.click(10, 10);
    await expect(page.getByRole("heading", { name: /Sign in to generate in bulk/i })).not.toBeVisible();
  });

  test("modal closes on Escape key", async ({ page }) => {
    await page.getByRole("button", { name: /Generate in Bulk/i }).click();
    await expect(page.getByRole("heading", { name: /Sign in to generate in bulk/i })).toBeVisible();
    await page.keyboard.press("Escape");
    await expect(page.getByRole("heading", { name: /Sign in to generate in bulk/i })).not.toBeVisible();
  });

  test("SEO content section is present", async ({ page }) => {
    await expect(page.getByRole("heading", { name: /What is a Fuel Bill/i })).toBeVisible();
  });

  test("FAQ section is present and expandable", async ({ page }) => {
    const faqQ = page.getByText(/Is this fuel bill generator free/i).first();
    await expect(faqQ).toBeVisible();
    await faqQ.click();
    // After expanding, the answer div becomes visible — use exact answer text
    await expect(page.getByText("Yes, completely free with no login required.")).toBeVisible();
  });
});
