import TemplateRentReceipt1 from "./TemplateRentReceipt1";
import TemplateRentReceipt2 from "./TemplateRentReceipt2";
import TemplateRentReceipt3 from "./TemplateRentReceipt3";
import TemplateRentReceipt4 from "./TemplateRentReceipt4";

// The rent-receipt template registry: which layouts exist, what they are
// called in the picker, and which component renders each one.

export const TEMPLATES = [
  { id: "1", label: "Certificate",    desc: "Formal paragraph-style receipt" },
  { id: "2", label: "Duplicate Book", desc: "Main receipt + tear-off acknowledgement" },
  { id: "3", label: "Minimal",        desc: "Clean modern card layout" },
  { id: "4", label: "Formal Table",   desc: "Tabular format with terms & signature" },
];

export const TEMPLATE_COMPONENTS = {
  "1": TemplateRentReceipt1,
  "2": TemplateRentReceipt2,
  "3": TemplateRentReceipt3,
  "4": TemplateRentReceipt4,
};

/** Starting values for a fresh rent receipt: this month, everything blank. */
export function makeDefaultRentReceiptData() {
  const today = new Date();
  const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  return {
    receiptNo: "001",
    receiptDate: today.toISOString().split("T")[0],
    periodFrom: thisMonth,
    periodTo: thisMonth,
    rentAmount: "",
    paymentMethod: "Cash",
    paymentRef: "",
    propertyAddress: "",
    tenantName: "",
    landlordName: "",
    landlordPan: "",
  };
}
