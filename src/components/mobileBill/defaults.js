// Default form state for the Mobile / Telephone Bill generator.

export const todayISO = () => new Date().toISOString().split("T")[0];
export const daysFromNowISO = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().split("T")[0]; };
export const daysAgoISO = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d.toISOString().split("T")[0]; };

export const BILL_TYPES = [
  { id: "postpaid", label: "Postpaid — Tax Invoice" },
  { id: "prepaid", label: "Prepaid — Recharge Receipt" },
];

export const PAYMENT_MODES = ["UPI", "Card", "Net Banking", "Cash", "Wallet"];

export const defaultMobileBillData = () => ({
  operator: "airtel",
  operatorName: "Airtel",
  logoUrl: "",
  billType: "postpaid",

  customerName: "Rajesh Verma",
  mobileNumber: "9876543210",
  customerAddress: "",

  // Postpaid — invoice-style
  invoiceNo: `IDL_${Math.floor(Math.random() * 90000000) + 10000000}`,
  invoiceDate: todayISO(),
  dueDate: daysFromNowISO(8),
  billingPeriod: "",
  planName: "Unlimited 4999 Plan",
  gstin: "",
  pan: "",
  planRental: 4999,
  gstRate: 18,
  lateFee: 0,
  previousBalance: 0,

  // Prepaid — receipt-style
  receiptNo: `${Math.floor(Math.random() * 9000000000000) + 1000000000000}`,
  paymentDate: todayISO(),
  orderNo: "",
  paymentMode: "UPI",
  rechargeAmount: 599,
  rechargePlan: "599 Unlimited Pack — 28 Days",
  validity: "28 Days",
});
