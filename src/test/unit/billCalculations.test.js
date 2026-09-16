/**
 * Unit tests — the pure calculation modules behind every generated document.
 *
 * These import the REAL functions the templates render with. An earlier
 * version of this file re-implemented calcTotal/fmtAmt/formatDate inline,
 * which meant it could pass green while production maths was broken; if a
 * formula changes now, these tests change with it or fail.
 */

import { describe, it, expect } from "vitest";

import {
  computeTotals as computeFuelTotals,
  computeQuantity,
  fmtAmt,
  fmtVol,
  formatDateShort,
  formatDateLong,
  formatINR as formatFuelINR,
  toNumber,
} from "../../components/fuel/billMath";

import {
  computeTotals as computeRestaurantTotals,
  formatINR,
} from "../../components/restaurant/billMath";

import {
  toAmount,
  formatRentFigure,
  amountToWords,
  formatReceiptDate,
  formatPeriod,
  formatPeriodRange,
} from "../../components/rent/receiptMath";

import { defaultFuelBillData } from "../../components/fuel/templates";
import { fitCanvasToPage } from "../../utils/pdfExport";

// ─── Fuel ────────────────────────────────────────────────────────────────────
describe("fuel/billMath", () => {
  describe("computeTotals", () => {
    it("uses the entered amount when present, ignoring qty x rate", () => {
      // 30.20 L x ₹104.29 would be ₹3,149.56, but the dispenser was preset to
      // an amount, so the entered ₹2,815.83 is authoritative.
      const { total, qty, rate } = computeFuelTotals({
        quantity: "30.20", pricePerLitre: "104.29", amount: "2815.83",
      });
      expect(total).toBeCloseTo(2815.83, 2);
      expect(qty).toBeCloseTo(30.2, 2);
      expect(rate).toBeCloseTo(104.29, 2);
    });

    it("falls back to qty x rate when no amount is set (bulk CSV path)", () => {
      const { total } = computeFuelTotals({ quantity: "9.52", pricePerLitre: "105.01" });
      expect(total).toBeCloseTo(999.70, 2);
    });

    it("returns 0 — never NaN — for garbage input, and flags it", () => {
      const r = computeFuelTotals({ quantity: "abc", pricePerLitre: "xyz", amount: "???" });
      expect(r.total).toBe(0);
      expect(Number.isNaN(r.total)).toBe(false);
      expect(r.hasInvalidInput).toBe(true);
    });

    it("flags a negative rate rather than printing it", () => {
      expect(computeFuelTotals({ pricePerLitre: "-104.29", amount: "500" }).hasInvalidInput).toBe(true);
    });

    it("is clean for an entirely empty bill", () => {
      const r = computeFuelTotals({});
      expect(r).toMatchObject({ qty: 0, rate: 0, total: 0, hasInvalidInput: false });
    });
  });

  describe("computeQuantity (amount ÷ rate)", () => {
    it("derives litres to 2dp", () => {
      expect(computeQuantity("992.00", "104.29")).toBe("9.51");
      expect(computeQuantity("3149.56", "104.29")).toBe("30.20");
    });

    it("is blank when either side is missing or zero", () => {
      expect(computeQuantity("", "104.29")).toBe("");
      expect(computeQuantity("500", "0")).toBe("");
      expect(computeQuantity("0", "104.29")).toBe("");
    });

    it("is blank rather than NaN for junk", () => {
      expect(computeQuantity("abc", "104.29")).toBe("");
    });
  });

  describe("toNumber", () => {
    it("parses numerics and falls back to 0 for anything else", () => {
      expect(toNumber("104.29")).toBeCloseTo(104.29, 2);
      expect(toNumber(42)).toBe(42);
      expect(toNumber("")).toBe(0);
      expect(toNumber(null)).toBe(0);
      expect(toNumber("not a number")).toBe(0);
    });
  });

  describe("thermal fixed-width columns", () => {
    it("pads to 9 characters with leading zeros", () => {
      expect(fmtAmt(1000)).toBe("001000.00");
      expect(fmtAmt(0)).toBe("000000.00");
      expect(fmtAmt(998.49)).toBe("000998.49");
      expect(fmtAmt(99999.99)).toBe("099999.99");
      expect(fmtVol(9.52)).toBe("000009.52");
    });

    it("degrades to a zero column instead of NaN for junk", () => {
      expect(fmtAmt("oops")).toBe("000000.00");
    });
  });

  describe("date formatting", () => {
    it("formats DD/MM/YY for thermal receipts", () => {
      expect(formatDateShort("2026-06-25")).toBe("25/06/26");
      expect(formatDateShort("2026-01-05")).toBe("05/01/26");
    });

    it("formats DD/MM/YYYY for the POS layout", () => {
      expect(formatDateLong("2026-06-25")).toBe("25/06/2026");
    });

    it("returns an empty string for blank or unparseable input", () => {
      expect(formatDateShort("")).toBe("");
      expect(formatDateLong("")).toBe("");
      expect(formatDateShort("not-a-date")).toBe("");
    });
  });

  it("formats rupees with two decimals", () => {
    expect(formatFuelINR(2815.8)).toBe("₹2,815.80");
    expect(formatFuelINR("bad")).toBe("₹0.00");
  });
});

// ─── Restaurant ──────────────────────────────────────────────────────────────
describe("restaurant/billMath", () => {
  // Three items, 10% service charge, 2.5% CGST + 2.5% SGST — the app's own
  // default bill, worked through by hand:
  //   subtotal            299 + 349 + 279          = 927.00
  //   service charge      927 x 10%                =  92.70
  //   taxable             927 + 92.70              = 1019.70
  //   CGST / SGST         1019.70 x 2.5% each      =  25.4925 each
  //   raw total                                    = 1070.685
  //   grand total         round to nearest rupee   = 1071
  //   round-off           1071 - 1070.685          =   0.315
  const bill = {
    serviceChargePct: 10,
    cgstPct: 2.5,
    sgstPct: 2.5,
    items: [
      { name: "Bhatti Ka Chaap (Full)", qty: 1, price: 299 },
      { name: "Dal Makhni", qty: 1, price: 349 },
      { name: "Veg Hakka Noodles", qty: 1, price: 279 },
    ],
  };

  it("applies service charge before GST and rounds to the nearest rupee", () => {
    const t = computeRestaurantTotals(bill);
    expect(t.subTotal).toBeCloseTo(927, 2);
    expect(t.serviceCharge).toBeCloseTo(92.7, 2);
    expect(t.cgst).toBeCloseTo(25.4925, 4);
    expect(t.sgst).toBeCloseTo(25.4925, 4);
    expect(t.grandTotal).toBe(1071);
    expect(t.roundOff).toBeCloseTo(0.315, 3);
  });

  it("totals quantities and per-item amounts", () => {
    const t = computeRestaurantTotals({
      ...bill,
      items: [{ name: "Thali", qty: 3, price: 150 }, { name: "Lassi", qty: 2, price: 60 }],
    });
    expect(t.qtyTotal).toBe(5);
    expect(t.items.map((i) => i.amt)).toEqual([450, 120]);
    expect(t.subTotal).toBe(570);
  });

  it("charges nothing extra when every rate is zero", () => {
    const t = computeRestaurantTotals({
      serviceChargePct: 0, cgstPct: 0, sgstPct: 0,
      items: [{ name: "Chai", qty: 2, price: 25 }],
    });
    expect(t.serviceCharge).toBe(0);
    expect(t.cgst).toBe(0);
    expect(t.grandTotal).toBe(50);
  });

  it("treats blank/invalid item fields as zero rather than NaN", () => {
    const t = computeRestaurantTotals({ items: [{ name: "Mystery", qty: "", price: "" }] });
    expect(t.subTotal).toBe(0);
    expect(t.grandTotal).toBe(0);
    expect(Number.isNaN(t.grandTotal)).toBe(false);
  });

  it("handles an empty bill", () => {
    const t = computeRestaurantTotals({});
    expect(t.subTotal).toBe(0);
    expect(t.grandTotal).toBe(0);
  });

  it("formats rupees with two decimals", () => {
    expect(formatINR(1071)).toBe("₹1,071.00");
    expect(formatINR(0)).toBe("₹0.00");
  });
});

// ─── Rent ────────────────────────────────────────────────────────────────────
describe("rent/receiptMath", () => {
  describe("toAmount / formatRentFigure", () => {
    it("parses and Indian-groups a normal rent", () => {
      expect(toAmount("15000")).toBe(15000);
      expect(formatRentFigure("15000")).toBe("15,000");
      expect(formatRentFigure(125000)).toBe("1,25,000");
    });

    it("drops paise when printing figures", () => {
      expect(formatRentFigure("15000.99")).toBe("15,000");
    });

    it("prints 0, not NaN, for junk; stays blank for an empty box", () => {
      expect(formatRentFigure("abc")).toBe("0");
      expect(formatRentFigure("-500")).toBe("0");
      expect(formatRentFigure("")).toBe("");
    });
  });

  describe("amountToWords", () => {
    it("converts with Indian place names", () => {
      expect(amountToWords(15000)).toBe("Fifteen Thousand Rupees Only");
      expect(amountToWords(8333)).toBe("Eight Thousand Three Hundred Thirty Three Rupees Only");
      expect(amountToWords(100000)).toBe("One Lakh Rupees Only");
      expect(amountToWords(123456)).toBe("One Lakh Twenty Three Thousand Four Hundred Fifty Six Rupees Only");
      expect(amountToWords(10000000)).toBe("One Crore Rupees Only");
    });

    it("omits the line entirely for zero, blank or invalid amounts", () => {
      expect(amountToWords(0)).toBe("");
      expect(amountToWords("")).toBe("");
      expect(amountToWords("abc")).toBe("");
      expect(amountToWords(-5000)).toBe("");
    });
  });

  describe("formatReceiptDate", () => {
    it("supports the three template styles", () => {
      expect(formatReceiptDate("2026-06-25", { style: "numeric" })).toBe("25/06/2026");
      expect(formatReceiptDate("2026-06-25", { style: "long" })).toMatch(/25 June 2026/);
      expect(formatReceiptDate("2026-06-25", { style: "short" })).toMatch(/25 Jun 2026/);
    });

    it("falls back to the caller's placeholder", () => {
      expect(formatReceiptDate("", { placeholder: "___________" })).toBe("___________");
      expect(formatReceiptDate("garbage", { style: "numeric", placeholder: "—" })).toBe("—");
    });
  });

  describe("formatPeriod", () => {
    it("reads a YYYY-MM month input without slipping into the previous month", () => {
      expect(formatPeriod("2026-06")).toMatch(/June 2026/);
      expect(formatPeriod("2026-01")).toMatch(/January 2026/);
      expect(formatPeriod("2026-06", { withYear: false })).toMatch(/^June$/);
    });

    it("collapses a single-month range to one label", () => {
      expect(formatPeriodRange("2026-06", "2026-06")).toMatch(/^June 2026$/);
      expect(formatPeriodRange("2026-06", "")).toMatch(/^June 2026$/);
      expect(formatPeriodRange("2026-06", "2026-08")).toMatch(/June 2026 – August 2026/);
    });
  });
});

// ─── Export geometry ─────────────────────────────────────────────────────────
describe("utils/pdfExport — fitCanvasToPage", () => {
  const A4_W = 210, A4_H = 297;

  it("centres the receipt horizontally on the page", () => {
    const box = fitCanvasToPage(800, 1200, A4_W, A4_H);
    expect(box.x).toBeCloseTo((A4_W - box.width) / 2, 6);
    expect(box.y).toBe(10);
  });

  it("never exceeds half the page height, even for a tall narrow receipt", () => {
    const box = fitCanvasToPage(300, 4000, A4_W, A4_H);
    expect(box.height).toBeLessThanOrEqual(A4_H / 2 - 10 + 1e-9);
    expect(box.width).toBeLessThanOrEqual(A4_W - 20 + 1e-9);
  });

  it("is width-constrained for a wide receipt", () => {
    const box = fitCanvasToPage(4000, 500, A4_W, A4_H);
    expect(box.width).toBeCloseTo(A4_W - 20, 6);
  });

  it("preserves the aspect ratio", () => {
    const box = fitCanvasToPage(800, 1200, A4_W, A4_H);
    expect(box.width / box.height).toBeCloseTo(800 / 1200, 6);
  });
});

// ─── Defaults ────────────────────────────────────────────────────────────────
describe("fuel default bill data", () => {
  it("ships a station name and a positive rate", () => {
    expect(defaultFuelBillData.stationName).toBeTruthy();
    expect(parseFloat(defaultFuelBillData.pricePerLitre)).toBeGreaterThan(0);
  });

  it("defaults to Petrol paid in cash", () => {
    expect(defaultFuelBillData.fuelType).toBe("Petrol");
    expect(defaultFuelBillData.paymentMode).toBe("Cash");
  });

  it("leaves amount and the derived quantity empty for the user to fill", () => {
    expect(defaultFuelBillData.amount).toBe("");
    expect(defaultFuelBillData.quantity).toBe("");
  });

  it("produces a zero — not NaN — total before anything is typed", () => {
    expect(computeFuelTotals(defaultFuelBillData).total).toBe(0);
  });
});
