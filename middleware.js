// middleware.js — Vercel Edge Middleware
// Intercepts social crawler requests and injects page-specific OG tags
// into the HTML before it's served. Works with React SPA on Vercel.

import { next } from "@vercel/edge";

const OG_IMAGE = "https://www.opstools.ai/og-image.png";
const SITE_NAME = "OpsTools";

const PAGE_META = {
  "/": {
    title: "OpsTools — Free Business Document Generator for India",
    description: "Free online document generators for Indian small businesses. Fuel bills, rent receipts, GST invoices, salary slips — no login, no cost, instant PDF.",
  },
  "/documents/fuel-bill": {
    title: "Free Fuel Bill Generator Online — Petrol & Diesel Bill PDF | OpsTools",
    description: "Generate IOCL, POS and thermal petrol station receipts instantly. Free, no login, instant PDF. For reimbursement and expense claims.",
  },
  "/documents/rent-receipt": {
    title: "Free Rent Receipt Generator India — HRA Compliant | OpsTools",
    description: "Generate HRA-compliant rent receipts with landlord PAN, stamp and signature. Free, no login, instant PDF download.",
  },
  "/documents/ld-bill": {
    title: "Free L&D Tax Invoice Generator — Training & Courses | OpsTools",
    description: "Generate GST tax invoices for learning & development expenses. HSN code 998433, CGST/SGST/IGST support, instant PDF.",
  },
  "/documents/gst-invoice": {
    title: "Free GST Invoice Generator India — Tax Invoice with HSN | OpsTools",
    description: "Generate GST-compliant tax invoices with CGST, SGST, IGST and HSN codes. Free, no login, instant PDF.",
  },
  "/documents/salary-slip": {
    title: "Free Salary Slip Generator India — Payslip with CTC & Deductions | OpsTools",
    description: "Generate professional salary slips with basic pay, HRA, PF, TDS and net pay. Free, no login, instant PDF.",
  },
  "/documents/restaurant-bill": {
    title: "Free Restaurant Bill Generator — Food Receipt with CGST/SGST | OpsTools",
    description: "Generate restaurant bills with table number, menu items, CGST and SGST. Free, no login, instant PDF.",
  },
  "/documents/medical-bill": {
    title: "Free Medical Bill Generator — Hospital & Pharmacy Receipt | OpsTools",
    description: "Generate medical bills with patient details, medicines and consultation fees. Free, no login, instant PDF.",
  },
  "/documents/hotel-bill": {
    title: "Free Hotel Bill Generator — Stay Receipt with GST | OpsTools",
    description: "Generate hotel bills with room charges, F&B, stay details and CGST/SGST. Free, no login, instant PDF.",
  },
  "/documents/electricity-bill": {
    title: "Free Electricity Bill Generator — Utility Bill with Meter Reading | OpsTools",
    description: "Generate electricity bills with meter readings, energy charges and tax breakdown. Free, no login, instant PDF.",
  },
  "/documents/invoice": {
    title: "Free Invoice Generator India — Professional Invoices with Tax | OpsTools",
    description: "Generate professional invoices with line items, tax, discounts and bank details. Free, no login, instant PDF.",
  },
  "/documents/quotation": {
    title: "Free Quotation Generator India — Price Quotes with Validity | OpsTools",
    description: "Generate professional business quotations with line items and validity period. Free, no login, instant PDF.",
  },
  "/documents/freelancer-invoice": {
    title: "Free Freelancer Invoice Generator India — Hourly & Fixed Price | OpsTools",
    description: "Generate freelancer invoices with hourly or fixed pricing and tax. Free, no login, instant PDF.",
  },
  "/documents/service-invoice": {
    title: "Free Service Invoice Generator India — GST Service Bills | OpsTools",
    description: "Generate service invoices with GST and payment terms for contractors and agencies. Free, instant PDF.",
  },
  "/documents/eway-bill": {
    title: "Free E-Way Bill Generator — GST E-Way Bill Reference | OpsTools",
    description: "Generate GST e-way bill reference documents with consignor and transport details. Free, no login, instant PDF.",
  },
  "/documents/e-invoice": {
    title: "Free E-Invoice Generator India — GST E-Invoice with IRN | OpsTools",
    description: "Generate GST e-invoices with IRN, acknowledgement number and line items. Free, no login, instant PDF.",
  },
  "/documents/vehicle-expense": {
    title: "Free Vehicle Expense Report — Fleet & Employee Reimbursement | OpsTools",
    description: "Generate vehicle expense reports for employee reimbursement or fleet management. Free, no login, instant PDF.",
  },
  "/documents/travel-expense": {
    title: "Free Travel Expense Report — Single Trip & Multi-Day | OpsTools",
    description: "Generate travel expense reports with flights, hotel, meals and per-day breakdown. Free, no login, instant PDF.",
  },
  "/business/roi-calculator": {
    title: "Free ROI Calculator India — Return on Investment Tool | OpsTools",
    description: "Calculate ROI, compare investments, run what-if scenarios. FD, RD and savings account comparisons. Free.",
  },
  "/business/gst-calculator": {
    title: "Free GST Calculator India — Add or Remove GST with CGST/SGST | OpsTools",
    description: "Calculate GST instantly. Add or remove GST. CGST, SGST and IGST breakdown for any rate. Free.",
  },
  "/blogs": {
    title: "Blog — GST, Documents & Business Guides for India | OpsTools",
    description: "Practical guides for Indian small business owners — how to generate fuel bills, L&D invoices, GST documents and more.",
  },
  "/blogs/how-to-generate-fuel-bill-online-india": {
    title: "How to Generate a Fuel Bill Online for Free in India (2026) | OpsTools",
    description: "Complete guide to generating petrol and diesel receipts online for reimbursement, expense tracking and fleet management.",
  },
  "/blogs/how-to-generate-ld-bill-online-india": {
    title: "How to Generate an L&D Tax Invoice Online in India (2026) | OpsTools",
    description: "Complete guide to generating professional tax invoices for training, courses and learning & development expenses.",
  },
  "/about": {
    title: "About OpsTools — Free Business Document Tools for India",
    description: "OpsTools is a free toolkit for Indian small business operators to generate professional documents without sign-ups or subscriptions.",
  },
};

// Social media crawlers that don't execute JavaScript
const CRAWLER_UA = [
  "linkedinbot",
  "twitterbot",
  "facebookexternalhit",
  "whatsapp",
  "telegrambot",
  "slackbot",
  "discordbot",
  "googlebot",
  "bingbot",
  "applebot",
];

function isCrawler(userAgent) {
  if (!userAgent) return false;
  const ua = userAgent.toLowerCase();
  return CRAWLER_UA.some((bot) => ua.includes(bot));
}

function buildOGTags(meta, url) {
  const { title, description } = meta;
  return `
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="${OG_IMAGE}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:site_name" content="${SITE_NAME}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${OG_IMAGE}" />
    <title>${title}</title>
    <meta name="description" content="${description}" />`;
}

export default async function middleware(request) {
  const url = new URL(request.url);
  const pathname = url.pathname;
  const userAgent = request.headers.get("user-agent") || "";

  // Only intercept crawlers — regular users get normal SPA
  if (!isCrawler(userAgent)) {
    return next();
  }

  const meta = PAGE_META[pathname];
  if (!meta) return next();

  // Fetch the original HTML
  const response = await next();
  const html = await response.text();

  // Replace the default <title> and inject OG tags
  const ogTags = buildOGTags(meta, request.url);
  const injected = html.replace(
    /<title>.*?<\/title>/s,
    ogTags
  );

  return new Response(injected, {
    status: response.status,
    headers: {
      ...Object.fromEntries(response.headers),
      "content-type": "text/html; charset=utf-8",
    },
  });
}

export const config = {
  matcher: [
    "/",
    "/documents/:path*",
    "/business/:path*",
    "/blogs/:path*",
    "/about",
  ],
};
