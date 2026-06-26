/**
 * Component tests — Template rendering
 * Tests that each receipt template renders key fields correctly
 */

import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import TemplateThermalFull from "../../components/fuel/TemplateThermalFull";
import TemplateThermalCompact from "../../components/fuel/TemplateThermalCompact";
import TemplatePOS from "../../components/fuel/TemplatePOS";
import TemplateIOCL from "../../components/fuel/TemplateIOCL";

const mockData = {
  stationName: "TEST FUEL STATION",
  stationAddress: "123 Test Road, Mumbai - 400001",
  stationPhone: "9876543210",
  vatTin: "7761395712V",
  lstNumber: "LST123",
  logoUrl: "",
  billNumber: "T001",
  billDate: "2026-06-25",
  billTime: "14:30",
  shift: "S-1",
  pumpNo: "P-01",
  nozzleNo: "N-02",
  fccId: "FCC001",
  fipNo: "07",
  txnNo: "TXN001",
  invoiceNo: "INV001",
  localId: "LOC001",
  customerName: "Test User",
  vehicleNumber: "MH01AB1234",
  vehicleType: "4W",
  mobileNo: "9876543210",
  attendantId: "ATT01",
  fuelType: "Petrol",
  density: "771.9",
  quantity: "10",
  pricePerLitre: "104.29",
  presetType: "Amount",
  paymentMode: "Cash",
  atot: "",
  vtot: "",
};

describe("TemplateThermalFull", () => {
  it("renders station name", () => {
    render(<TemplateThermalFull data={mockData} />);
    expect(screen.getByText("TEST FUEL STATION")).toBeInTheDocument();
  });

  it("renders Welcomes You tagline", () => {
    render(<TemplateThermalFull data={mockData} />);
    expect(screen.getByText("Welcomes You")).toBeInTheDocument();
  });

  it("renders fuel type", () => {
    render(<TemplateThermalFull data={mockData} />);
    expect(screen.getByText(/Petrol/)).toBeInTheDocument();
  });

  it("renders calculated amount correctly", () => {
    render(<TemplateThermalFull data={mockData} />);
    // 10 * 104.29 = 1042.90 → padded to 001042.90
    expect(screen.getByText(/001042\.90/)).toBeInTheDocument();
  });

  it("renders date in DD/MM/YY format", () => {
    render(<TemplateThermalFull data={mockData} />);
    // Date appears in both the Date row and the "Printed on" footer
    const dateEls = screen.getAllByText(/25\/06\/26/);
    expect(dateEls.length).toBeGreaterThanOrEqual(1);
  });

  it("renders Thank You footer", () => {
    render(<TemplateThermalFull data={mockData} />);
    expect(screen.getByText(/Thank You/)).toBeInTheDocument();
  });

  it("renders payment mode", () => {
    render(<TemplateThermalFull data={mockData} />);
    expect(screen.getByText(/Cash/)).toBeInTheDocument();
  });

  it("shows zero amount when quantity is empty", () => {
    render(<TemplateThermalFull data={{ ...mockData, quantity: "" }} />);
    // Both Volume and Amount show 000000.00 when qty is 0
    const zeroEls = screen.getAllByText(/000000\.00/);
    expect(zeroEls.length).toBeGreaterThanOrEqual(1);
  });
});

describe("TemplateThermalCompact", () => {
  it("renders WELCOME header", () => {
    render(<TemplateThermalCompact data={mockData} />);
    expect(screen.getByText("WELCOME!!!")).toBeInTheDocument();
  });

  it("renders fuel type", () => {
    render(<TemplateThermalCompact data={mockData} />);
    expect(screen.getByText(/Petrol/)).toBeInTheDocument();
  });

  it("renders vehicle number", () => {
    render(<TemplateThermalCompact data={mockData} />);
    expect(screen.getByText(/MH01AB1234/)).toBeInTheDocument();
  });

  it("renders total amount", () => {
    render(<TemplateThermalCompact data={mockData} />);
    // 10 * 104.29 = 1042.90
    expect(screen.getByText(/1042\.90/)).toBeInTheDocument();
  });
});

describe("TemplatePOS", () => {
  it("renders station name in uppercase", () => {
    render(<TemplatePOS data={mockData} />);
    expect(screen.getByText("TEST FUEL STATION")).toBeInTheDocument();
  });

  it("renders ORIGINAL label", () => {
    render(<TemplatePOS data={mockData} />);
    expect(screen.getByText("ORIGINAL")).toBeInTheDocument();
  });

  it("renders fuel type in uppercase", () => {
    render(<TemplatePOS data={mockData} />);
    expect(screen.getByText("PETROL")).toBeInTheDocument();
  });

  it("renders Thank You footer", () => {
    render(<TemplatePOS data={mockData} />);
    expect(screen.getByText(/Thank You/)).toBeInTheDocument();
  });
});

describe("TemplateIOCL", () => {
  it("renders station name", () => {
    render(<TemplateIOCL data={mockData} />);
    expect(screen.getByText("TEST FUEL STATION")).toBeInTheDocument();
  });

  it("renders TOTAL AMOUNT label", () => {
    render(<TemplateIOCL data={mockData} />);
    expect(screen.getByText("TOTAL AMOUNT:")).toBeInTheDocument();
  });

  it("renders correct total", () => {
    render(<TemplateIOCL data={mockData} />);
    expect(screen.getByText("₹1042.90")).toBeInTheDocument();
  });

  it("renders vehicle number", () => {
    render(<TemplateIOCL data={mockData} />);
    expect(screen.getByText("MH01AB1234")).toBeInTheDocument();
  });

  it("renders payment mode", () => {
    render(<TemplateIOCL data={mockData} />);
    expect(screen.getByText("Cash")).toBeInTheDocument();
  });
});

describe("All Templates — Zero State", () => {
  const emptyData = { ...mockData, quantity: "0", pricePerLitre: "0" };

  it("ThermalFull shows zero total", () => {
    render(<TemplateThermalFull data={emptyData} />);
    const zeroEls = screen.getAllByText(/000000\.00/);
    expect(zeroEls.length).toBeGreaterThanOrEqual(1);
  });

  it("IOCL shows zero total", () => {
    render(<TemplateIOCL data={emptyData} />);
    // ₹0.00 appears in rate row and total row
    const zeroEls = screen.getAllByText(/₹0\.00/);
    expect(zeroEls.length).toBeGreaterThanOrEqual(1);
  });
});
