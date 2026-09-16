import TemplatePOS from "./TemplatePOS";
import TemplateIOCL from "./TemplateIOCL";
import TemplateThermalFull from "./TemplateThermalFull";
import TemplateThermalCompact from "./TemplateThermalCompact";

// The fuel-bill template registry: which layouts exist, what they are called
// in the picker, and which component renders each one.

export const TEMPLATES = [
  { id: "thermal-full",    label: "Thermal Full",    desc: "Dot-matrix with all fields" },
  { id: "pos",             label: "Classic POS",     desc: "Monospace receipt style" },
  { id: "iocl",            label: "IOCL Formal",     desc: "Logo + dashed separators" },
  { id: "thermal-compact", label: "Thermal Compact", desc: "Minimal thermal print" },
];

export const TEMPLATE_COMPONENTS = {
  pos: TemplatePOS,
  iocl: TemplateIOCL,
  "thermal-full": TemplateThermalFull,
  "thermal-compact": TemplateThermalCompact,
};

/** Starting values for a fresh fuel bill. */
export const defaultFuelBillData = {
  stationName: "PK FUEL STATION",
  stationAddress: "PAREKH NAGAR S V RD, KANDIVALI W, MUMBAI - 400067",
  stationPhone: "38055913",
  vatTin: "27AABCU9603R1ZX",
  logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Indian_Oil_Logo.svg/500px-Indian_Oil_Logo.svg.png",
  bankLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/3840px-HDFC_Bank_Logo.svg.png",
  billNumber: "G64695",
  billDate: new Date().toISOString().split("T")[0],
  billTime: new Date().toTimeString().slice(0, 5),
  nozzleNo: "N-02",
  invoiceNo: "927267",
  customerName: "", vehicleNumber: "", vehicleType: "4W", mobileNo: "", attendantId: "",
  fuelType: "Petrol", density: "745.0", amount: "", quantity: "", pricePerLitre: "104.29",
  presetType: "Amount", paymentMode: "Cash",
};
