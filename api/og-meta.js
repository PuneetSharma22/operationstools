// api/og-meta.js — Vercel Serverless Function
// Serves a static, page-specific HTML snapshot (title, meta, H1, H2, and a
// short paragraph of real body text) for crawlers that don't execute
// JavaScript — social scrapers (LinkedIn, Twitter, WhatsApp) and any SEO
// audit tool that only reads raw HTML. The React app is a pure client-side
// SPA, so without this, every route resolves to the same static index.html
// shell and every crawler that can't run JS sees identical title/meta/H1
// content on every page. vercel.json rewrites bot user-agents here instead
// of index.html; everyone else still gets the real SPA.
//
// The h1/h2/body text here must match what a real visitor sees once the
// page hydrates (DocumentToolHero, ROICalculatorPage, etc.) — showing
// crawlers meaningfully different content than users get is cloaking.

const OG_IMAGE = "https://www.opstools.ai/og-image.png";

const TRUST_POINTS = [
  "Free to use, no login or sign-up required.",
  "Every document is generated instantly as a downloadable PDF.",
  "Built for Indian formats — GSTIN, HSN codes, CGST/SGST, PAN.",
];

const PAGE_META = {
  "/documents/fuel-bill": { h1: "Free Fuel Bill Generator", title: "Free Fuel Bill Generator Online — Petrol & Diesel Bill PDF | OpsTools", description: "Generate IOCL, POS and thermal petrol station receipts instantly. Free, no login, instant PDF. For reimbursement and expense claims." },
  "/documents/rent-receipt": { h1: "Free Rent Receipt Generator", title: "Free Rent Receipt Generator India — HRA Compliant | OpsTools", description: "Generate HRA-compliant rent receipts with landlord PAN. Free, no login, instant PDF." },
  "/documents/ld-bill": { h1: "Learning & Development Bill Generator", title: "Free L&D Tax Invoice Generator — Training & Courses | OpsTools", description: "Generate GST tax invoices for learning & development expenses. HSN 998433. Free, no login, instant PDF." },
  "/documents/gst-invoice": { h1: "GST Invoice Generator", title: "Free GST Invoice Generator India — Tax Invoice with HSN | OpsTools", description: "Generate GST-compliant tax invoices with CGST, SGST, IGST and HSN codes. Free, no login, instant PDF." },
  "/documents/salary-slip": { h1: "Salary Slip Generator", title: "Free Salary Slip Generator India — Payslip with CTC & Deductions | OpsTools", description: "Generate professional salary slips with basic pay, HRA, PF, TDS and net pay. Free, no login, instant PDF." },
  "/documents/restaurant-bill": { h1: "Restaurant Bill Generator", title: "Free Restaurant Bill Generator — Food Receipt with CGST/SGST | OpsTools", description: "Generate restaurant bills with table number, menu items, CGST and SGST. Free, no login, instant PDF." },
  "/documents/medical-bill": { h1: "Medical Bill Generator", title: "Free Medical Bill Generator — Hospital & Pharmacy Receipt | OpsTools", description: "Generate medical bills with patient details, medicines and consultation fees. Free, no login, instant PDF." },
  "/documents/hotel-bill": { h1: "Hotel Bill Generator", title: "Free Hotel Bill Generator — Stay Receipt with GST | OpsTools", description: "Generate hotel bills with room charges, F&B, stay details and CGST/SGST. Free, no login, instant PDF." },
  "/documents/electricity-bill": { h1: "Electricity Bill Generator", title: "Free Electricity Bill Generator — Utility Bill with Meter Reading | OpsTools", description: "Generate electricity bills with meter readings, energy charges and tax breakdown. Free, no login, instant PDF." },
  "/documents/invoice": { h1: "Invoice Generator", title: "Free Invoice Generator India — Professional Invoices with Tax | OpsTools", description: "Generate professional invoices with line items, tax, discounts and bank details. Free, no login, instant PDF." },
  "/documents/quotation": { h1: "Quotation Generator", title: "Free Quotation Generator India — Price Quotes with Validity | OpsTools", description: "Generate professional business quotations with line items and validity period. Free, no login, instant PDF." },
  "/documents/freelancer-invoice": { h1: "Freelancer Invoice Generator", title: "Free Freelancer Invoice Generator India — Hourly & Fixed Price | OpsTools", description: "Generate freelancer invoices with hourly or fixed pricing and tax. Free, no login, instant PDF." },
  "/documents/service-invoice": { h1: "Service Invoice Generator", title: "Free Service Invoice Generator India — GST Service Bills | OpsTools", description: "Generate service invoices with GST and payment terms. Free, instant PDF." },
  "/documents/eway-bill": { h1: "E-Way Bill Generator", title: "Free E-Way Bill Generator — GST E-Way Bill Reference | OpsTools", description: "Generate GST e-way bill reference documents with consignor and transport details. Free, no login, instant PDF." },
  "/documents/e-invoice": { h1: "E-Invoice Generator", title: "Free E-Invoice Generator India — GST E-Invoice with IRN | OpsTools", description: "Generate GST e-invoices with IRN and acknowledgement number. Free, no login, instant PDF." },
  "/documents/vehicle-expense": { h1: "Vehicle Expense Report", title: "Free Vehicle Expense Report — Fleet & Employee Reimbursement | OpsTools", description: "Generate vehicle expense reports for employee reimbursement or fleet management. Free, no login, instant PDF." },
  "/documents/travel-expense": { h1: "Travel Expense Report", title: "Free Travel Expense Report — Single Trip & Multi-Day | OpsTools", description: "Generate travel expense reports with flights, hotel, meals and per-day breakdown. Free, no login, instant PDF." },
  "/documents/book-invoice": { h1: "Book & Periodical Invoice Generator", title: "Free Book & Periodical Invoice Generator — Retail GST Bill | OpsTools", description: "Generate a GST invoice for book, magazine and periodical sales. Multiple items, CGST/SGST breakdown. Free, no login, instant PDF." },
  "/documents/mobile-bill": { h1: "Mobile & Telephone Bill Generator", title: "Free Mobile & Telephone Bill Generator — Postpaid Invoice & Prepaid Receipt | OpsTools", description: "Generate a postpaid mobile tax invoice or a prepaid recharge receipt. Airtel, Jio, Vi and BSNL themes. Free, no login, instant PDF." },
  "/business/roi-calculator": { h1: "ROI Calculator", title: "ROI Calculator — Return on Investment Calculator India | OpsTools", description: "Free ROI calculator (return on investment calculator) for India. Compare FD, RD and savings account returns, run what-if scenarios, no login required." },
  "/business/gst-calculator": { h1: "GST Calculator", title: "Free GST Calculator India — Add or Remove GST with CGST/SGST | OpsTools", description: "Calculate GST instantly. CGST, SGST and IGST breakdown for any rate. Free." },
  "/blogs/how-to-generate-fuel-bill-online-india": { h1: "How to Generate a Fuel Bill Online for Free in India (2026)", title: "How to Generate a Fuel Bill Online for Free in India (2026) | OpsTools", description: "Complete guide to generating petrol and diesel receipts online for reimbursement and fleet management." },
  "/blogs/how-to-generate-ld-bill-online-india": { h1: "How to Generate an L&D Tax Invoice Online in India (2026)", title: "How to Generate an L&D Tax Invoice Online in India (2026) | OpsTools", description: "Complete guide to generating GST tax invoices for training and L&D expenses." },
  "/blogs/how-to-generate-gst-invoice-online-india": { h1: "How to Generate a GST Invoice Online in India for Free (2026)", title: "How to Generate a GST Invoice Online in India for Free (2026) | OpsTools", description: "Complete guide to GST-compliant tax invoices — CGST, SGST, IGST, HSN codes and mandatory fields." },
  "/blogs/how-to-generate-salary-slip-online-india": { h1: "How to Generate a Salary Slip Online in India for Free (2026)", title: "How to Generate a Salary Slip Online in India for Free (2026) | OpsTools", description: "Complete guide to salary slips — CTC structure, basic pay, HRA, PF, TDS and net pay." },
  "/blogs/how-to-generate-rent-receipt-online-india": { h1: "How to Generate a Rent Receipt Online for HRA Exemption in India (2026)", title: "How to Generate a Rent Receipt Online for HRA Exemption in India (2026) | OpsTools", description: "Complete guide to rent receipts for HRA tax exemption — mandatory fields, landlord PAN and free PDF." },
  "/blogs/how-to-generate-hotel-bill-online-india": { h1: "How to Generate a Hotel Bill Online in India for Free (2026)", title: "How to Generate a Hotel Bill Online in India for Free (2026) | OpsTools", description: "Complete guide to hotel bills — check-in/check-out dates, room charges, GSTIN, CGST/SGST and instant PDF download." },
  "/blogs/how-to-generate-restaurant-bill-online-india": { h1: "How to Generate a Restaurant Bill Online in India for Free (2026)", title: "How to Generate a Restaurant Bill Online in India for Free (2026) | OpsTools", description: "Generate a restaurant or cafe bill online for free — itemised dishes, service charge, CGST/SGST, and table/dine-in number, with instant PDF download." },
  "/blogs/how-to-generate-medical-bill-online-india": { h1: "How to Generate a Medical Bill Online in India for Free (2026)", title: "How to Generate a Medical Bill Online in India for Free (2026) | OpsTools", description: "Complete guide to generating medical and pharmacy bills — patient details, itemized medicines and charges, hospital GSTIN, and instant free PDF download." },
  "/blogs/how-to-generate-electricity-bill-online-india": { h1: "How to Generate an Electricity Bill Online in India for Free (2026)", title: "How to Generate an Electricity Bill Online in India for Free (2026) | OpsTools", description: "Complete guide to generating an electricity bill — meter readings, units consumed, energy charges, and tax breakdown, calculated automatically." },
  "/blogs/how-to-generate-invoice-online-india": { h1: "How to Generate a Professional Invoice Online in India for Free (2026)", title: "How to Generate a Professional Invoice Online in India for Free (2026) | OpsTools", description: "Learn how to create a professional invoice with itemized line items, tax, discounts, and bank details for free, with instant PDF download." },
  "/blogs/how-to-generate-quotation-online-india": { h1: "How to Generate a Business Quotation Online in India for Free (2026)", title: "How to Generate a Business Quotation Online in India for Free (2026) | OpsTools", description: "Complete guide to creating a business quotation — itemized pricing, validity period, and terms & conditions. Free, no login, instant PDF." },
  "/blogs/how-to-generate-freelancer-invoice-online-india": { h1: "How to Generate a Freelancer Invoice Online in India for Free (2026)", title: "How to Generate a Freelancer Invoice Online in India for Free (2026) | OpsTools", description: "Complete guide to generating a freelancer invoice — hourly or fixed-price billing, project details, tax and discount, free PDF download." },
  "/blogs/how-to-generate-service-invoice-online-india": { h1: "How to Generate a Service Invoice Online in India for Free (2026)", title: "How to Generate a Service Invoice Online in India for Free (2026) | OpsTools", description: "Complete guide to service invoices for consultants, agencies and freelancers — GST and SAC codes, per-line tax, payment terms, and free instant PDF." },
  "/blogs/how-to-generate-eway-bill-online-india": { h1: "How to Generate an E-Way Bill Reference Online in India (2026)", title: "How to Generate an E-Way Bill Reference Online in India (2026) | OpsTools", description: "Guide to generating an e-way bill reference document with consignor, consignee, and transport details — HSN code, vehicle number, distance, and GST breakup." },
  "/blogs/how-to-generate-e-invoice-online-india": { h1: "How to Generate a GST E-Invoice Reference Online in India (2026)", title: "How to Generate a GST E-Invoice Reference Online in India (2026) | OpsTools", description: "Learn how to lay out a GST e-invoice with IRN and acknowledgement number fields on a properly formatted reference document." },
  "/blogs/how-to-generate-vehicle-expense-report-online-india": { h1: "How to Generate a Vehicle Expense Report Online in India (2026)", title: "How to Generate a Vehicle Expense Report Online in India (2026) | OpsTools", description: "Complete guide to generating a vehicle expense report — track fuel, tolls, parking and maintenance for employee reimbursement or fleet management." },
  "/blogs/how-to-generate-travel-expense-report-online-india": { h1: "How to Generate a Travel Expense Report Online in India (2026)", title: "How to Generate a Travel Expense Report Online in India (2026) | OpsTools", description: "Complete guide to generating a travel expense report — flights, hotels, meals, per-day breakdown, and advance reconciliation." },
  "/blogs/how-to-generate-book-invoice-online-india": { h1: "How to Generate a Book & Periodical Invoice Online in India (2026)", title: "How to Generate a Book & Periodical Invoice Online in India (2026) | OpsTools", description: "Complete guide to GST invoices for book, magazine and periodical sales — HSN codes, GST rates, multi-item billing, and CGST/SGST breakdown." },
  "/blogs/how-to-generate-mobile-bill-online-india": { h1: "How to Generate a Mobile & Telephone Bill Online in India (2026)", title: "How to Generate a Mobile & Telephone Bill Online in India (2026) | OpsTools", description: "How to generate a postpaid mobile tax invoice or a prepaid recharge receipt online, with Airtel, Jio, Vi and BSNL themes." },
  "/blogs/how-to-calculate-roi-online-india": { h1: "How to Calculate ROI Online — A Step-by-Step Guide (2026)", title: "How to Calculate ROI Online — Return on Investment Guide (2026) | OpsTools", description: "Step-by-step guide to calculating ROI, annualized (CAGR) returns, and inflation-adjusted real ROI, with benchmarks against FD, Gold and Nifty 50." },
  "/blogs/how-to-calculate-gst-online-india": { h1: "How to Calculate GST Online in India (2026)", title: "How to Calculate GST Online in India — Add or Remove GST (2026) | OpsTools", description: "Step-by-step guide to calculating GST — add GST to a base price or remove it from a GST-inclusive price, with a full CGST/SGST/IGST breakdown." },
  "/about": { h1: "Tools built for people who just want to get things done", title: "About OpsTools — Free Business Document Tools for India", description: "OpsTools is a free toolkit for Indian small business operators to generate professional documents without sign-ups." },
  "/documents": { h1: "Every document your business needs, in one place", title: "All Free Business Document Generators — OpsTools", description: "Browse free document generators for Indian small businesses — fuel bills, rent receipts, GST invoices, salary slips, expense reports and more. No login, instant PDF." },
  "/blogs": { h1: "OpsTools Blog", title: "Blog — GST, Documents & Business Guides for India | OpsTools", description: "Practical guides for Indian small business owners on generating fuel bills, GST invoices, salary slips and more." },
};

const DEFAULT_META = {
  h1: "Professional documents, ready in seconds",
  title: "OpsTools — Free Business Document Generator for India",
  description: "Free online document generators and calculators for Indian small businesses. Fuel bills, rent receipts, GST invoices, salary slips, ROI calculator — no login, no cost, instant results.",
};

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export default function handler(req, res) {
  // `path` must be an exact match against the known PAGE_META keys — never
  // reflected into the response otherwise. It used to be interpolated
  // straight into HTML/meta attributes and a redirect URL with no
  // validation, which allowed both reflected XSS (breaking out of the
  // content="..." attribute with a raw ") and an open-redirect/phishing
  // vector (a path starting with "@" turns opstools.ai into a URL userinfo
  // segment, sending the browser to an attacker-controlled host instead).
  const rawPath = req.query.path;
  const path = typeof rawPath === "string" && Object.prototype.hasOwnProperty.call(PAGE_META, rawPath)
    ? rawPath
    : "/";
  const meta = PAGE_META[path] || DEFAULT_META;

  const url = `https://www.opstools.ai${path}`;
  const title = escapeHtml(meta.title);
  const description = escapeHtml(meta.description);
  const h1 = escapeHtml(meta.h1);

  const html = `<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title}</title>
  <meta name="description" content="${description}" />
  <meta property="og:title" content="${title}" />
  <meta property="og:description" content="${description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="OpsTools" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${title}" />
  <meta name="twitter:description" content="${description}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  <link rel="canonical" href="${url}" />
  <meta http-equiv="refresh" content="0; url=${url}" />
</head>
<body>
  <h1>${h1}</h1>
  <p>${description}</p>
  <h2>Why use OpsTools</h2>
  <ul>
    ${TRUST_POINTS.map((point) => `<li>${escapeHtml(point)}</li>`).join("\n    ")}
  </ul>
  <p><a href="${url}">Open ${h1} →</a></p>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).send(html);
}
