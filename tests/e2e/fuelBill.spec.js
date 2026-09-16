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

  // The picker (components/common/TemplatePicker) renders numbered chips whose
  // only label is the template name in `title`, so locate them by title
  // rather than by accessible name.
  test("all 4 templates are shown", async ({ page }) => {
    await expect(page.getByTitle("Thermal Full")).toBeVisible();
    await expect(page.getByTitle("Classic POS")).toBeVisible();
    await expect(page.getByTitle("IOCL Formal")).toBeVisible();
    await expect(page.getByTitle("Thermal Compact")).toBeVisible();
  });

  test("Thermal Full is selected by default", async ({ page }) => {
    const thermalBtn = page.getByTitle("Thermal Full");
    await expect(thermalBtn).toBeVisible();
    // Active chip is the filled blue one (#2563EB border + background).
    await expect(thermalBtn).toHaveCSS("border-top-color", "rgb(37, 99, 235)");
    await expect(thermalBtn).toHaveCSS("background-color", "rgb(37, 99, 235)");
    // …and the caption under the picker names it.
    await expect(page.getByText("Dot-matrix with all fields")).toBeVisible();
  });

  test("clicking Classic POS switches template", async ({ page }) => {
    await page.getByTitle("Classic POS").click();
    await expect(page.getByText("ORIGINAL")).toBeVisible();
  });

  test("clicking IOCL Formal switches template", async ({ page }) => {
    await page.getByTitle("IOCL Formal").click();
    await expect(page.getByText("TOTAL AMOUNT:")).toBeVisible();
  });

  test("live preview updates when station name is changed", async ({ page }) => {
    const input = page.locator('input[name="stationName"]');
    await input.clear();
    await input.fill("MY TEST PUMP");
    await expect(page.getByText("MY TEST PUMP").first()).toBeVisible();
  });

  // Volume/Qty is derived (amount ÷ rate) and read-only — see
  // components/fuel/billMath.js — so the amount field is what drives it.
  test("live preview updates when the amount is entered", async ({ page }) => {
    await page.locator('input[name="amount"]').fill("1042.90");
    // Default rate is ₹104.29/L, so 1042.90 ÷ 104.29 = 10.00 L.
    await expect(page.locator('input[name="quantity"]')).toHaveValue("10.00");
    await expect(page.getByText(/1042\.90/).first()).toBeVisible();
  });

  test("form sections are collapsible", async ({ page }) => {
    const billDetailsBtn = page.getByRole("button", { name: /🧾 Bill Details/i });
    await expect(billDetailsBtn).toBeVisible();

    // The panel animates via grid-template-rows 1fr→0fr and clips its contents
    // with overflow:hidden. The input keeps its own layout box either way, so
    // measure the clipping wrapper rather than the input itself.
    const dateInput = page.locator('input[name="billDate"]');
    const panel = dateInput.locator('xpath=ancestor::div[contains(@style,"overflow")][1]');
    const panelHeight = async () => (await panel.boundingBox())?.height ?? -1;

    expect(await panelHeight()).toBeGreaterThan(1);
    await billDetailsBtn.click();
    // Polls instead of sleeping through the 0.28s transition.
    await expect.poll(panelHeight).toBeLessThanOrEqual(1);
  });

  test("Save menu offers PDF and PNG next to Live Preview", async ({ page }) => {
    // Use exact label text scoped to the preview header
    await expect(page.getByText("Live Preview", { exact: true })).toBeVisible();
    const saveBtn = page.getByRole("button", { name: "Save", exact: true });
    await expect(saveBtn).toBeVisible();
    await saveBtn.click();
    await expect(page.getByRole("button", { name: "Save as PDF" })).toBeVisible();
    await expect(page.getByRole("button", { name: "Save as PNG" })).toBeVisible();
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
