// Default form state for the Book & Periodical Invoice generator.

export const todayISO = () => new Date().toISOString().split("T")[0];

export const defaultItem = () => ({
  id: Date.now() + Math.random(),
  description: "",
  author: "",
  hsn: "4901",
  qty: 1,
  rate: 0,
  gstRate: 5,
});

export const defaultBookInvoiceData = () => ({
  invoiceNo: `BK-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  invoiceDate: todayISO(),
  paymentMode: "UPI",
  logoUrl: "",
  store: {
    name: "Nandan Book Store",
    address: "G-45, Punchkuia Marg, Sector 46, Gurugram, Haryana - 122003",
    gstin: "06AABCU9603R1Z5",
    phone: "+91 98200 11223",
    email: "",
  },
  customer: {
    name: "Rajesh Verma",
    address: "",
    phone: "",
  },
  items: [
    { id: 3001, description: "Best of Indian Mythology", author: "Amar Chitra Katha", hsn: "4901", qty: 1, rate: 499, gstRate: 5 },
    { id: 3002, description: "India Today — Monthly Subscription", author: "Living Media India Ltd", hsn: "4902", qty: 1, rate: 150, gstRate: 0 },
  ],
});

export const PAYMENT_MODES = ["Cash", "UPI", "Card", "Net Banking"];
