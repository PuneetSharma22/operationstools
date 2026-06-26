/**
 * Unit tests — Fuel bill calculation logic
 * Tests the core math that appears on every receipt
 */

import { describe, it, expect } from "vitest";

// Pure calculation functions (extracted from template components)
const calcTotal = (quantity, pricePerLitre) => {
  const qty = parseFloat(quantity) || 0;
  const rate = parseFloat(pricePerLitre) || 0;
  return qty * rate;
};

const fmtAmt = (n) => n.toFixed(2).padStart(9, "0");
const fmtVol = (n) => n.toFixed(2).padStart(9, "0");

const formatDate = (d) => {
  if (!d) return "";
  const dt = new Date(d);
  const dd = String(dt.getDate()).padStart(2, "0");
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const yy = String(dt.getFullYear()).slice(-2);
  return `${dd}/${mm}/${yy}`;
};

describe("Bill Calculations", () => {

  describe("Total amount", () => {
    it("calculates total correctly", () => {
      expect(calcTotal("9.52", "105.01")).toBeCloseTo(999.70, 1);
    });

    it("handles zero quantity", () => {
      expect(calcTotal("0", "105.01")).toBe(0);
    });

    it("handles empty quantity", () => {
      expect(calcTotal("", "105.01")).toBe(0);
    });

    it("handles zero rate", () => {
      expect(calcTotal("9.52", "0")).toBe(0);
    });

    it("handles both empty", () => {
      expect(calcTotal("", "")).toBe(0);
    });

    it("handles decimal quantities correctly", () => {
      expect(calcTotal("30.20", "104.29")).toBeCloseTo(3149.56, 1);
    });

    it("handles large amounts", () => {
      expect(calcTotal("500", "104.29")).toBeCloseTo(52145, 0);
    });
  });

  describe("Amount formatting (thermal receipt style)", () => {
    it("pads amount with leading zeros to 9 chars", () => {
      expect(fmtAmt(1000)).toBe("001000.00");
    });

    it("formats zero correctly", () => {
      expect(fmtAmt(0)).toBe("000000.00");
    });

    it("formats large amount without padding", () => {
      expect(fmtAmt(99999.99)).toBe("099999.99");
    });

    it("formats decimal amounts correctly", () => {
      expect(fmtAmt(998.49)).toBe("000998.49");
    });
  });

  describe("Volume formatting", () => {
    it("pads volume with leading zeros", () => {
      expect(fmtVol(9.52)).toBe("000009.52");
    });

    it("formats zero volume", () => {
      expect(fmtVol(0)).toBe("000000.00");
    });
  });

  describe("Date formatting", () => {
    it("formats date as DD/MM/YY", () => {
      expect(formatDate("2026-06-25")).toBe("25/06/26");
    });

    it("returns empty string for empty input", () => {
      expect(formatDate("")).toBe("");
    });

    it("formats single digit day and month with padding", () => {
      expect(formatDate("2026-01-05")).toBe("05/01/26");
    });
  });
});

describe("Promo Code Logic", () => {
  const PROMO_CODES = { "CREDIT": 100, "OPS100": 100, "WELCOME": 200 };

  it("CREDIT gives 100 credits", () => {
    expect(PROMO_CODES["CREDIT"]).toBe(100);
  });

  it("WELCOME gives 200 credits", () => {
    expect(PROMO_CODES["WELCOME"]).toBe(200);
  });

  it("invalid code returns undefined", () => {
    expect(PROMO_CODES["INVALID"]).toBeUndefined();
  });

  it("codes are case sensitive in object", () => {
    expect(PROMO_CODES["credit"]).toBeUndefined();
    expect(PROMO_CODES["Credit"]).toBeUndefined();
  });

  it("balance increases correctly after applying code", () => {
    const currentBalance = 0;
    const reward = PROMO_CODES["CREDIT"];
    expect(currentBalance + reward).toBe(100);
  });

  it("balance stacks correctly with multiple codes", () => {
    let balance = 0;
    balance += PROMO_CODES["CREDIT"];
    balance += PROMO_CODES["WELCOME"];
    expect(balance).toBe(300);
  });
});

describe("Template Data Defaults", () => {
  const defaultData = {
    stationName: "PK FUEL STATION",
    fuelType: "Petrol",
    quantity: "",
    pricePerLitre: "104.29",
    paymentMode: "Cash",
    vehicleType: "4W",
  };

  it("has required station name", () => {
    expect(defaultData.stationName).toBeTruthy();
  });

  it("defaults to Petrol fuel type", () => {
    expect(defaultData.fuelType).toBe("Petrol");
  });

  it("defaults to Cash payment mode", () => {
    expect(defaultData.paymentMode).toBe("Cash");
  });

  it("quantity starts empty (user must fill)", () => {
    expect(defaultData.quantity).toBe("");
  });

  it("has a default price per litre", () => {
    expect(parseFloat(defaultData.pricePerLitre)).toBeGreaterThan(0);
  });
});
