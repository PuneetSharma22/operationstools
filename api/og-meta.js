// api/og-meta.js — Vercel Serverless Function
// Serves a minimal HTML page with correct OG tags for social crawlers
// LinkedIn, Twitter, WhatsApp hit this and get page-specific meta tags

const OG_IMAGE = "https://www.opstools.ai/og-image.png";

const PAGE_META = {
  "/documents/fuel-bill": { title: "Free Fuel Bill Generator Online — Petrol & Diesel Bill PDF | OpsTools", description: "Generate IOCL, POS and thermal petrol station receipts instantly. Free, no login, instant PDF. For reimbursement and expense claims." },
  "/documents/rent-receipt": { title: "Free Rent Receipt Generator India — HRA Compliant | OpsTools", description: "Generate HRA-compliant rent receipts with landlord PAN. Free, no login, instant PDF." },
  "/documents/ld-bill": { title: "Free L&D Tax Invoice Generator — Training & Courses | OpsTools", description: "Generate GST tax invoices for learning & development expenses. HSN 998433. Free, no login, instant PDF." },
  "/documents/gst-invoice": { title: "Free GST Invoice Generator India — Tax Invoice with HSN | OpsTools", description: "Generate GST-compliant tax invoices with CGST, SGST, IGST and HSN codes. Free, no login, instant PDF." },
  "/documents/salary-slip": { title: "Free Salary Slip Generator India — Payslip with CTC & Deductions | OpsTools", description: "Generate professional salary slips with basic pay, HRA, PF, TDS and net pay. Free, no login, instant PDF." },
  "/documents/restaurant-bill": { title: "Free Restaurant Bill Generator — Food Receipt with CGST/SGST | OpsTools", description: "Generate restaurant bills with table number, menu items, CGST and SGST. Free, no login, instant PDF." },
  "/documents/medical-bill": { title: "Free Medical Bill Generator — Hospital & Pharmacy Receipt | OpsTools", description: "Generate medical bills with patient details, medicines and consultation fees. Free, no login, instant PDF." },
  "/documents/hotel-bill": { title: "Free Hotel Bill Generator — Stay Receipt with GST | OpsTools", description: "Generate hotel bills with room charges, F&B, stay details and CGST/SGST. Free, no login, instant PDF." },
  "/documents/electricity-bill": { title: "Free Electricity Bill Generator — Utility Bill with Meter Reading | OpsTools", description: "Generate electricity bills with meter readings, energy charges and tax breakdown. Free, no login, instant PDF." },
  "/documents/invoice": { title: "Free Invoice Generator India — Professional Invoices with Tax | OpsTools", description: "Generate professional invoices with line items, tax, discounts and bank details. Free, no login, instant PDF." },
  "/documents/quotation": { title: "Free Quotation Generator India — Price Quotes with Validity | OpsTools", description: "Generate professional business quotations with line items and validity period. Free, no login, instant PDF." },
  "/documents/freelancer-invoice": { title: "Free Freelancer Invoice Generator India — Hourly & Fixed Price | OpsTools", description: "Generate freelancer invoices with hourly or fixed pricing and tax. Free, no login, instant PDF." },
  "/documents/service-invoice": { title: "Free Service Invoice Generator India — GST Service Bills | OpsTools", description: "Generate service invoices with GST and payment terms. Free, instant PDF." },
  "/documents/eway-bill": { title: "Free E-Way Bill Generator — GST E-Way Bill Reference | OpsTools", description: "Generate GST e-way bill reference documents with consignor and transport details. Free, no login, instant PDF." },
  "/documents/e-invoice": { title: "Free E-Invoice Generator India — GST E-Invoice with IRN | OpsTools", description: "Generate GST e-invoices with IRN and acknowledgement number. Free, no login, instant PDF." },
  "/documents/vehicle-expense": { title: "Free Vehicle Expense Report — Fleet & Employee Reimbursement | OpsTools", description: "Generate vehicle expense reports for employee reimbursement or fleet management. Free, no login, instant PDF." },
  "/documents/travel-expense": { title: "Free Travel Expense Report — Single Trip & Multi-Day | OpsTools", description: "Generate travel expense reports with flights, hotel, meals and per-day breakdown. Free, no login, instant PDF." },
  "/documents/book-invoice": { title: "Free Book & Periodical Invoice Generator — Retail GST Bill | OpsTools", description: "Generate a GST invoice for book, magazine and periodical sales. Multiple items, CGST/SGST breakdown. Free, no login, instant PDF." },
  "/documents/mobile-bill": { title: "Free Mobile & Telephone Bill Generator — Postpaid Invoice & Prepaid Receipt | OpsTools", description: "Generate a postpaid mobile tax invoice or a prepaid recharge receipt. Airtel, Jio, Vi and BSNL themes. Free, no login, instant PDF." },
  "/business/roi-calculator": { title: "ROI Calculator — Return on Investment Calculator India | OpsTools", description: "Free ROI calculator (return on investment calculator) for India. Compare FD, RD and savings account returns, run what-if scenarios, no login required." },
  "/business/gst-calculator": { title: "Free GST Calculator India — Add or Remove GST with CGST/SGST | OpsTools", description: "Calculate GST instantly. CGST, SGST and IGST breakdown for any rate. Free." },
  "/blogs/how-to-generate-fuel-bill-online-india": { title: "How to Generate a Fuel Bill Online for Free in India (2026) | OpsTools", description: "Complete guide to generating petrol and diesel receipts online for reimbursement and fleet management." },
  "/blogs/how-to-generate-ld-bill-online-india": { title: "How to Generate an L&D Tax Invoice Online in India (2026) | OpsTools", description: "Complete guide to generating GST tax invoices for training and L&D expenses." },
  "/blogs/how-to-generate-gst-invoice-online-india": { title: "How to Generate a GST Invoice Online in India for Free (2026) | OpsTools", description: "Complete guide to GST-compliant tax invoices — CGST, SGST, IGST, HSN codes and mandatory fields." },
  "/blogs/how-to-generate-salary-slip-online-india": { title: "How to Generate a Salary Slip Online in India for Free (2026) | OpsTools", description: "Complete guide to salary slips — CTC structure, basic pay, HRA, PF, TDS and net pay." },
  "/blogs/how-to-generate-rent-receipt-online-india": { title: "How to Generate a Rent Receipt Online for HRA Exemption in India (2026) | OpsTools", description: "Complete guide to rent receipts for HRA tax exemption — mandatory fields, landlord PAN and free PDF." },
  "/about": { title: "About OpsTools — Free Business Document Tools for India", description: "OpsTools is a free toolkit for Indian small business operators to generate professional documents without sign-ups." },
  "/documents": { title: "All Free Business Document Generators — OpsTools", description: "Browse free document generators for Indian small businesses — fuel bills, rent receipts, GST invoices, salary slips, expense reports and more. No login, instant PDF." },
  "/blogs": { title: "Blog — GST, Documents & Business Guides for India | OpsTools", description: "Practical guides for Indian small business owners on generating fuel bills, GST invoices, salary slips and more." },
};

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
  const meta = PAGE_META[path] || {
    title: "OpsTools — Free Business Document Generator for India",
    description: "Free online document generators and calculators for Indian small businesses. Fuel bills, rent receipts, GST invoices, salary slips, ROI calculator — no login, no cost, instant results.",
  };

  const url = `https://www.opstools.ai${path}`;

  const html = `<!doctype html>
<html lang="en-IN">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${meta.title}</title>
  <meta name="description" content="${meta.description}" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.description}" />
  <meta property="og:url" content="${url}" />
  <meta property="og:type" content="website" />
  <meta property="og:image" content="${OG_IMAGE}" />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:site_name" content="OpsTools" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${meta.title}" />
  <meta name="twitter:description" content="${meta.description}" />
  <meta name="twitter:image" content="${OG_IMAGE}" />
  <meta http-equiv="refresh" content="0; url=${url}" />
</head>
<body>
  <a href="${url}">${meta.title}</a>
</body>
</html>`;

  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.setHeader("Cache-Control", "public, max-age=3600");
  res.status(200).send(html);
}
