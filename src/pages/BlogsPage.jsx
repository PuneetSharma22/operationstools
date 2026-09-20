import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { cloneElement } from "react";

// Same pastel line-icon style used across Home/DocumentsPage/TopHeader —
// reused here (scaled up) instead of a generic document-wireframe mockup.
const BLOG_ICONS = {
  "fuel-bill": { bg: "#DBEAFE", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="5" y="3" width="14" height="19" rx="2" fill="#BFDBFE"/><rect x="8" y="7" width="8" height="1.5" rx="0.75" fill="#3B82F6"/><rect x="8" y="10.5" width="6" height="1.5" rx="0.75" fill="#3B82F6"/><rect x="8" y="14" width="8" height="1.5" rx="0.75" fill="#3B82F6"/><circle cx="20" cy="19" r="5" fill="#FDE68A"/><path d="M19 17.5l1.5 1.5-1.5 1.5" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 17.5v3" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  "ld-bill": { bg: "#EDE9FE", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#DDD6FE"/><path d="M8 10h12M8 14h8M8 18h10" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  "gst-invoice": { bg: "#EDE9FE", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="4" y="3" width="20" height="22" rx="2.5" fill="#DDD6FE"/><rect x="7" y="7" width="14" height="2" rx="1" fill="#7C3AED"/><rect x="7" y="11" width="9" height="1.5" rx="0.75" fill="#A78BFA"/><rect x="7" y="14" width="11" height="1.5" rx="0.75" fill="#A78BFA"/><rect x="7" y="17" width="7" height="1.5" rx="0.75" fill="#A78BFA"/><rect x="15" y="20" width="6" height="2" rx="1" fill="#7C3AED"/></svg> },
  "salary-slip": { bg: "#FCE7F3", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="3" y="6" width="22" height="16" rx="2.5" fill="#FBCFE8"/><circle cx="10" cy="14" r="4" fill="#F9A8D4"/><path d="M9 14h2M10 13v2" stroke="#DB2777" strokeWidth="1.3" strokeLinecap="round"/><rect x="16" y="11" width="6" height="1.5" rx="0.75" fill="#F9A8D4"/><rect x="16" y="14" width="4" height="1.5" rx="0.75" fill="#F9A8D4"/></svg> },
  "rent-receipt": { bg: "#D1FAE5", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="4" y="5" width="20" height="18" rx="2.5" fill="#A7F3D0"/><path d="M9 10h10M9 14h6" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 17l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  "hotel-bill": { bg: "#DBEAFE", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BFDBFE"/><rect x="7" y="12" width="6" height="10" rx="1" fill="#2563EB"/><rect x="15" y="12" width="6" height="10" rx="1" fill="#2563EB"/><rect x="5" y="10" width="18" height="3" rx="1" fill="#3B82F6"/><rect x="11" y="6" width="6" height="4" rx="1" fill="#60A5FA"/></svg> },
  "restaurant-bill": { bg: "#FCE7F3", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FBCFE8"/><path d="M9 8v5a3 3 0 0 0 6 0V8" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="13" x2="12" y2="20" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/><line x1="18" y1="8" x2="18" y2="20" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  "medical-bill": { bg: "#DCFCE7", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BBF7D0"/><rect x="12" y="8" width="4" height="12" rx="2" fill="#16A34A"/><rect x="8" y="12" width="12" height="4" rx="2" fill="#16A34A"/></svg> },
  "electricity-bill": { bg: "#FEF3C7", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FDE68A"/><polygon points="16,4 9,15 14,15 12,24 19,13 14,13" fill="#D97706"/></svg> },
  "invoice": { bg: "#EEF2FF", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="4" y="3" width="20" height="22" rx="2.5" fill="#C7D2FE"/><rect x="7" y="7" width="14" height="2" rx="1" fill="#4F46E5"/><rect x="7" y="11" width="9" height="1.5" rx="0.75" fill="#818CF8"/><rect x="7" y="14" width="11" height="1.5" rx="0.75" fill="#818CF8"/><rect x="15" y="20" width="6" height="2" rx="1" fill="#4F46E5"/></svg> },
  "quotation": { bg: "#D1FAE5", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="4" y="3" width="20" height="22" rx="2.5" fill="#A7F3D0"/><rect x="7" y="7" width="14" height="2" rx="1" fill="#059669"/><rect x="7" y="11" width="10" height="1.5" rx="0.75" fill="#6EE7B7"/><rect x="7" y="14" width="12" height="1.5" rx="0.75" fill="#6EE7B7"/><rect x="7" y="17" width="8" height="1.5" rx="0.75" fill="#6EE7B7"/></svg> },
  "freelancer-invoice": { bg: "#DBEAFE", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="3" y="5" width="22" height="18" rx="2.5" fill="#BFDBFE"/><rect x="6" y="9" width="16" height="2" rx="1" fill="#3B82F6"/><rect x="6" y="13" width="10" height="1.5" rx="0.75" fill="#93C5FD"/><rect x="6" y="16" width="12" height="1.5" rx="0.75" fill="#93C5FD"/></svg> },
  "service-invoice": { bg: "#FEF3C7", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FDE68A"/><circle cx="14" cy="14" r="5" fill="#F59E0B" opacity="0.4"/><circle cx="14" cy="14" r="2" fill="#D97706"/><path d="M14 7v2M14 19v2M7 14h2M19 14h2" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  "eway-bill": { bg: "#DBEAFE", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BFDBFE"/><rect x="5" y="11" width="18" height="8" rx="2" fill="#2563EB"/><rect x="8" y="8" width="12" height="5" rx="1.5" fill="#60A5FA"/><circle cx="9" cy="20" r="2" fill="#1D4ED8"/><circle cx="19" cy="20" r="2" fill="#1D4ED8"/></svg> },
  "e-invoice": { bg: "#CFFAFE", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="3" y="6" width="22" height="16" rx="2.5" fill="#A5F3FC"/><path d="M3 10l11 7 11-7" stroke="#0891B2" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  "vehicle-expense": { bg: "#E0F2FE", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BAE6FD"/><rect x="5" y="11" width="18" height="8" rx="2" fill="#0284C7"/><rect x="8" y="8" width="12" height="5" rx="1.5" fill="#38BDF8"/><circle cx="9" cy="20" r="2" fill="#0369A1"/><circle cx="19" cy="20" r="2" fill="#0369A1"/></svg> },
  "travel-expense": { bg: "#EDE9FE", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#DDD6FE"/><path d="M14 6l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" fill="#7C3AED"/></svg> },
  "book-invoice": { bg: "#FEF3C7", svg: <svg viewBox="0 0 28 28" fill="none"><path d="M5 5a2 2 0 0 1 2-2h9v22H7a2 2 0 0 1-2-2V5z" fill="#FDE68A"/><path d="M16 3h5a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2h-5V3z" fill="#FCD34D"/><rect x="8" y="7" width="6" height="1.4" rx="0.7" fill="#D97706"/><rect x="8" y="10" width="5" height="1.4" rx="0.7" fill="#D97706"/></svg> },
  "mobile-bill": { bg: "#FCE7F3", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="8" y="2" width="12" height="24" rx="2.5" fill="#FBCFE8"/><rect x="10.5" y="5" width="7" height="14" rx="0.8" fill="#fff"/><circle cx="14" cy="22" r="1.4" fill="#DB2777"/></svg> },
  "roi-calculator": { bg: "#FEF3C7", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FDE68A"/><path d="M7 18l4-5 4 3 5-7" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="21" cy="9" r="2" fill="#F59E0B"/></svg> },
  "gst-calculator": { bg: "#CCFBF1", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#5EEAD4"/><rect x="7" y="7" width="14" height="5" rx="1" fill="#0F766E"/><rect x="7" y="15" width="4" height="4" rx="1" fill="#0F766E"/><rect x="13" y="15" width="4" height="4" rx="1" fill="#0F766E"/><rect x="19" y="15" width="4" height="4" rx="1" fill="#0F766E"/><rect x="7" y="20" width="4" height="3" rx="1" fill="#0F766E"/><rect x="13" y="20" width="4" height="3" rx="1" fill="#0F766E"/><rect x="19" y="20" width="4" height="3" rx="1" fill="#0F766E"/></svg> },
};

const ALL_BLOGS = [
  {
    slug: "how-to-generate-fuel-bill-online-india",
    title: "How to Generate a Fuel Bill Online for Free in India (2026)",
    excerpt: "A complete guide to generating petrol and diesel receipts online — for reimbursement, HRA claims, and fleet management. No login needed.",
    date: "June 20, 2026",
    author: "Prakash Jha",
    readTime: "7 min read",
    category: "Guide",
    categoryColor: "#2563EB",
    categoryBg: "#EFF6FF",
    docIcon: "fuel-bill",
    gradientFrom: "#1e3a8a",
    gradientTo: "#312e81",
    tool: { name: "Try Fuel Bill Generator →", href: "/documents/fuel-bill" },
  },
  {
    slug: "how-to-generate-ld-bill-online-india",
    title: "How to Generate an L&D Tax Invoice Online in India (2026)",
    excerpt: "A complete guide to generating professional tax invoices for training, courses, and learning & development expenses — with CGST/SGST and instant PDF.",
    date: "July 2, 2026",
    author: "Arijit Sawant",
    readTime: "6 min read",
    category: "Guide",
    categoryColor: "#7C3AED",
    categoryBg: "#F5F3FF",
    docIcon: "ld-bill",
    gradientFrom: "#1e1b4b",
    gradientTo: "#312e81",
    tool: { name: "Try L&D Bill Generator →", href: "/documents/ld-bill" },
  },
  {
    slug: "how-to-generate-gst-invoice-online-india",
    title: "How to Generate a GST Invoice Online in India for Free (2026)",
    excerpt: "Complete guide to GST-compliant tax invoices — CGST, SGST, IGST, HSN codes, mandatory fields, and instant PDF download. No login, no cost.",
    date: "July 9, 2026",
    author: "Prajay Bangar",
    readTime: "8 min read",
    category: "Guide",
    categoryColor: "#7C3AED",
    categoryBg: "#EDE9FE",
    docIcon: "gst-invoice",
    gradientFrom: "#1e1b4b",
    gradientTo: "#4c1d95",
    tool: { name: "Try GST Invoice Generator →", href: "/documents/gst-invoice" },
  },
  {
    slug: "how-to-generate-salary-slip-online-india",
    title: "How to Generate a Salary Slip Online in India for Free (2026)",
    excerpt: "Complete guide to salary slips — CTC structure, basic pay, HRA, PF, TDS, deductions and net pay. Generate a professional payslip instantly.",
    date: "July 16, 2026",
    author: "Gulnaaz",
    readTime: "7 min read",
    category: "Guide",
    categoryColor: "#DB2777",
    categoryBg: "#FCE7F3",
    docIcon: "salary-slip",
    gradientFrom: "#1a0a1e",
    gradientTo: "#3b0764",
    tool: { name: "Try Salary Slip Generator →", href: "/documents/salary-slip" },
  },
  {
    slug: "how-to-generate-rent-receipt-online-india",
    title: "How to Generate a Rent Receipt Online for HRA Exemption in India (2026)",
    excerpt: "Complete guide to rent receipts for HRA tax exemption — mandatory fields, landlord PAN requirement, monthly vs annual receipts, and free PDF.",
    date: "July 23, 2026",
    author: "Prakash Jha",
    readTime: "6 min read",
    category: "Guide",
    categoryColor: "#059669",
    categoryBg: "#D1FAE5",
    docIcon: "rent-receipt",
    gradientFrom: "#052e16",
    gradientTo: "#14532d",
    tool: { name: "Try Rent Receipt Generator →", href: "/documents/rent-receipt" },
  },
  {
    slug: "how-to-generate-hotel-bill-online-india",
    title: "How to Generate a Hotel Bill Online in India for Free (2026)",
    excerpt: "Complete guide to hotel bills — check-in/check-out dates, room and additional charges, GSTIN, CGST/SGST, and instant PDF download.",
    date: "August 20, 2026",
    author: "Arijit Sawant",
    readTime: "7 min read",
    category: "Guide",
    categoryColor: "#0284C7",
    categoryBg: "#E0F2FE",
    docIcon: "hotel-bill",
    gradientFrom: "#07011F",
    gradientTo: "#0c2340",
    tool: { name: "Try Hotel Bill Generator →", href: "/documents/hotel-bill" },
  },
  {
    slug: "how-to-generate-restaurant-bill-online-india",
    title: "How to Generate a Restaurant Bill Online in India for Free (2026)",
    excerpt: "Generate a restaurant or cafe bill online for free — itemised dishes, service charge, CGST/SGST, and table/dine-in number, in 4 receipt formats with instant PDF download.",
    date: "August 23, 2026",
    author: "Prajay Bangar",
    readTime: "6 min read",
    category: "Guide",
    categoryColor: "#DB2777",
    categoryBg: "#FCE7F3",
    docIcon: "restaurant-bill",
    gradientFrom: "#07011F",
    gradientTo: "#831843",
    tool: { name: "Try Restaurant Bill Generator →", href: "/documents/restaurant-bill" },
  },
  {
    slug: "how-to-generate-medical-bill-online-india",
    title: "How to Generate a Medical Bill Online in India for Free (2026)",
    excerpt: "Complete guide to generating medical and pharmacy bills — patient details, itemized medicines and charges, hospital GSTIN, and instant free PDF download.",
    date: "August 26, 2026",
    author: "Gulnaaz",
    readTime: "6 min read",
    category: "Guide",
    categoryColor: "#16A34A",
    categoryBg: "#DCFCE7",
    docIcon: "medical-bill",
    gradientFrom: "#07011F",
    gradientTo: "#065f46",
    tool: { name: "Try Medical Bill Generator →", href: "/documents/medical-bill" },
  },
  {
    slug: "how-to-generate-electricity-bill-online-india",
    title: "How to Generate an Electricity Bill Online in India for Free (2026)",
    excerpt: "Complete guide to generating an electricity bill — meter readings, units consumed, energy charges, and tax breakdown, calculated automatically. Free, no login, instant PDF.",
    date: "August 29, 2026",
    author: "Prakash Jha",
    readTime: "6 min read",
    category: "Guide",
    categoryColor: "#D97706",
    categoryBg: "#FEF3C7",
    docIcon: "electricity-bill",
    gradientFrom: "#07011F",
    gradientTo: "#92400e",
    tool: { name: "Try Electricity Bill Generator →", href: "/documents/electricity-bill" },
  },
  {
    slug: "how-to-generate-invoice-online-india",
    title: "How to Generate a Professional Invoice Online in India for Free (2026)",
    excerpt: "Learn how to create a professional invoice with itemized line items, tax, discounts, and bank details for free, with no login and instant PDF download.",
    date: "September 1, 2026",
    author: "Arijit Sawant",
    readTime: "7 min read",
    category: "Guide",
    categoryColor: "#4F46E5",
    categoryBg: "#EEF2FF",
    docIcon: "invoice",
    gradientFrom: "#07011F",
    gradientTo: "#3730a3",
    tool: { name: "Try Invoice Generator →", href: "/documents/invoice" },
  },
  {
    slug: "how-to-generate-quotation-online-india",
    title: "How to Generate a Business Quotation Online in India for Free (2026)",
    excerpt: "Complete guide to creating a business quotation — itemized pricing, validity period, and terms & conditions. Free, no login, instant PDF download.",
    date: "September 4, 2026",
    author: "Prajay Bangar",
    readTime: "6 min read",
    category: "Guide",
    categoryColor: "#059669",
    categoryBg: "#D1FAE5",
    docIcon: "quotation",
    gradientFrom: "#07011F",
    gradientTo: "#047857",
    tool: { name: "Try Quotation Generator →", href: "/documents/quotation" },
  },
  {
    slug: "how-to-generate-freelancer-invoice-online-india",
    title: "How to Generate a Freelancer Invoice Online in India for Free (2026)",
    excerpt: "Complete guide to generating a freelancer invoice — hourly or fixed-price billing, project details, tax and discount, free PDF download with no login.",
    date: "September 7, 2026",
    author: "Gulnaaz",
    readTime: "7 min read",
    category: "Guide",
    categoryColor: "#2563EB",
    categoryBg: "#DBEAFE",
    docIcon: "freelancer-invoice",
    gradientFrom: "#07011F",
    gradientTo: "#1d4ed8",
    tool: { name: "Try Freelancer Invoice Generator →", href: "/documents/freelancer-invoice" },
  },
  {
    slug: "how-to-generate-service-invoice-online-india",
    title: "How to Generate a Service Invoice Online in India for Free (2026)",
    excerpt: "Complete guide to service invoices for consultants, agencies and freelancers — GST and SAC codes for services, per-line tax, payment terms, and free instant PDF download.",
    date: "September 10, 2026",
    author: "Prakash Jha",
    readTime: "6 min read",
    category: "Guide",
    categoryColor: "#D97706",
    categoryBg: "#FEF3C7",
    docIcon: "service-invoice",
    gradientFrom: "#07011F",
    gradientTo: "#b45309",
    tool: { name: "Try Service Invoice Generator →", href: "/documents/service-invoice" },
  },
  {
    slug: "how-to-generate-eway-bill-online-india",
    title: "How to Generate an E-Way Bill Reference Online in India (2026)",
    excerpt: "Guide to generating an e-way bill reference document with consignor, consignee, and transport details — HSN code, vehicle number, distance, and GST breakup.",
    date: "September 13, 2026",
    author: "Arijit Sawant",
    readTime: "7 min read",
    category: "Guide",
    categoryColor: "#2563EB",
    categoryBg: "#DBEAFE",
    docIcon: "eway-bill",
    gradientFrom: "#07011F",
    gradientTo: "#1e40af",
    tool: { name: "Try E-Way Bill Generator →", href: "/documents/eway-bill" },
  },
  {
    slug: "how-to-generate-e-invoice-online-india",
    title: "How to Generate a GST E-Invoice Reference Online in India (2026)",
    excerpt: "Learn how to lay out a GST e-invoice with IRN and acknowledgement number fields on a properly formatted reference document — free, no login, instant PDF.",
    date: "September 16, 2026",
    author: "Prajay Bangar",
    readTime: "7 min read",
    category: "Guide",
    categoryColor: "#0891B2",
    categoryBg: "#CFFAFE",
    docIcon: "e-invoice",
    gradientFrom: "#07011F",
    gradientTo: "#0e7490",
    tool: { name: "Try E-Invoice Generator →", href: "/documents/e-invoice" },
  },
  {
    slug: "how-to-generate-vehicle-expense-report-online-india",
    title: "How to Generate a Vehicle Expense Report Online in India (2026)",
    excerpt: "Complete guide to generating a vehicle expense report — track fuel, tolls, parking and maintenance for employee reimbursement or fleet management.",
    date: "September 19, 2026",
    author: "Gulnaaz",
    readTime: "6 min read",
    category: "Guide",
    categoryColor: "#0284C7",
    categoryBg: "#E0F2FE",
    docIcon: "vehicle-expense",
    gradientFrom: "#07011F",
    gradientTo: "#0369a1",
    tool: { name: "Try Vehicle Expense Report →", href: "/documents/vehicle-expense" },
  },
  {
    slug: "how-to-generate-travel-expense-report-online-india",
    title: "How to Generate a Travel Expense Report Online in India (2026)",
    excerpt: "Complete guide to generating a travel expense report — flights, hotels, meals, per-day breakdown, and advance reconciliation.",
    date: "September 22, 2026",
    author: "Prakash Jha",
    readTime: "7 min read",
    category: "Guide",
    categoryColor: "#7C3AED",
    categoryBg: "#EDE9FE",
    docIcon: "travel-expense",
    gradientFrom: "#07011F",
    gradientTo: "#5b21b6",
    tool: { name: "Try Travel Expense Report →", href: "/documents/travel-expense" },
  },
  {
    slug: "how-to-generate-book-invoice-online-india",
    title: "How to Generate a Book & Periodical Invoice Online in India (2026)",
    excerpt: "Complete guide to GST invoices for book, magazine and periodical sales — HSN codes, GST rates, multi-item billing, and CGST/SGST breakdown.",
    date: "September 25, 2026",
    author: "Arijit Sawant",
    readTime: "6 min read",
    category: "Guide",
    categoryColor: "#D97706",
    categoryBg: "#FEF3C7",
    docIcon: "book-invoice",
    gradientFrom: "#07011F",
    gradientTo: "#78350f",
    tool: { name: "Try Book & Periodical Invoice →", href: "/documents/book-invoice" },
  },
  {
    slug: "how-to-generate-mobile-bill-online-india",
    title: "How to Generate a Mobile & Telephone Bill Online in India (2026)",
    excerpt: "How to generate a postpaid mobile tax invoice or a prepaid recharge receipt online, with Airtel, Jio, Vi and BSNL themes.",
    date: "September 28, 2026",
    author: "Prajay Bangar",
    readTime: "7 min read",
    category: "Guide",
    categoryColor: "#DB2777",
    categoryBg: "#FCE7F3",
    docIcon: "mobile-bill",
    gradientFrom: "#07011F",
    gradientTo: "#9d174d",
    tool: { name: "Try Mobile & Telephone Bill →", href: "/documents/mobile-bill" },
  },
  {
    slug: "how-to-calculate-roi-online-india",
    title: "How to Calculate ROI Online — Return on Investment Guide (2026)",
    excerpt: "Step-by-step guide to calculating ROI, annualized (CAGR) returns, and inflation-adjusted real ROI, with benchmarks against FD, Gold and Nifty 50.",
    date: "September 30, 2026",
    author: "Gulnaaz",
    readTime: "7 min read",
    category: "Guide",
    categoryColor: "#D97706",
    categoryBg: "#FEF3C7",
    docIcon: "roi-calculator",
    gradientFrom: "#07011F",
    gradientTo: "#a16207",
    tool: { name: "Try ROI Calculator →", href: "/business/roi-calculator" },
  },
  {
    slug: "how-to-calculate-gst-online-india",
    title: "How to Calculate GST Online in India — Add or Remove GST (2026)",
    excerpt: "Step-by-step guide to calculating GST — add GST to a base price or remove it from a GST-inclusive price, with a full CGST/SGST/IGST breakdown for any rate.",
    date: "October 1, 2026",
    author: "Prakash Jha",
    readTime: "6 min read",
    category: "Guide",
    categoryColor: "#0F766E",
    categoryBg: "#CCFBF1",
    docIcon: "gst-calculator",
    gradientFrom: "#07011F",
    gradientTo: "#0f766e",
    tool: { name: "Try GST Calculator →", href: "/business/gst-calculator" },
  },
];

function BlogCard({ blog }) {
  return (
    <Link to={`/blogs/${blog.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <article style={{
        background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0",
        overflow: "hidden", transition: "box-shadow 0.18s, transform 0.18s",
        height: "100%",
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        {/* Illustration */}
        <div style={{
          height: 160,
          background: `linear-gradient(160deg, ${blog.gradientFrom}, ${blog.gradientTo})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.16), transparent 55%), radial-gradient(circle at 78% 75%, rgba(255,255,255,0.10), transparent 55%)" }} />
          {/* Concentric rings for depth */}
          <div style={{ position: "absolute", width: 210, height: 210, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", width: 150, height: 150, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)" }} />
          {/* Floating accent dots */}
          <div style={{ position: "absolute", top: "22%", left: "20%", width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
          <div style={{ position: "absolute", bottom: "26%", right: "22%", width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.28)" }} />
          <div style={{ position: "absolute", top: "32%", right: "24%", width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.32)" }} />
          {/* Icon badge — same pastel icon used for this doc type elsewhere on the site, scaled up */}
          <div style={{
            position: "relative", zIndex: 1,
            width: 80, height: 80, borderRadius: 22,
            background: BLOG_ICONS[blog.docIcon].bg,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 20px 40px -12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.4)",
          }}>
            {cloneElement(BLOG_ICONS[blog.docIcon].svg, { width: 42, height: 42 })}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: blog.categoryColor, background: blog.categoryBg, padding: "2px 10px", borderRadius: 999 }}>
              {blog.category}
            </span>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>{blog.readTime}</span>
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 10px", lineHeight: 1.35, letterSpacing: "-0.01em" }}>
            {blog.title}
          </h2>
          <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.65, margin: "0 0 16px" }}>
            {blog.excerpt}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>{blog.author} · {blog.date}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#2563EB" }}>Read more →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogsPage() {
  return (
    <>
    <Helmet>
      <title>Blog — GST, Documents & Business Guides for India | OpsTools</title>
      <meta name="description" content="Practical guides for Indian small business owners on generating fuel bills, GST invoices, salary slips and more." />
      <meta property="og:title" content="Blog — GST, Documents & Business Guides for India | OpsTools" />
      <meta property="og:description" content="Practical guides for Indian small business owners on generating fuel bills, GST invoices, salary slips and more." />
      <meta property="og:url" content="https://www.opstools.ai/blogs" />
      <link rel="canonical" href="https://www.opstools.ai/blogs" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0D0630 55%,#1e1b4b 100%)", padding: "72px 24px 64px", overflow: "hidden" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ marginBottom: 16, fontSize: 13, color: "#64748B" }}>
            <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px", color: "#334155" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Blog</span>
          </nav>
          <h1 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            OpsTools Blog
          </h1>
          <p style={{ fontSize: 15, color: "#94A3B8", margin: 0, maxWidth: 520, lineHeight: 1.7 }}>
            Guides, tips, and resources for Indian small business operators — documents, reimbursements, and more.
          </p>
        </div>
      </section>

      {/* Blog grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {/* ALL_BLOGS is in publish order (oldest first) — reverse so newest shows first */}
          {[...ALL_BLOGS].reverse().map(blog => <BlogCard key={blog.slug} blog={blog} />)}
        </div>
      </div>
    </div>
    </>
  );
}
