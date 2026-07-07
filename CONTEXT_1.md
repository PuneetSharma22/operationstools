# OpsTools — Project Context & Build Summary

**Last Updated:** 8 July 2026
**Developer:** Puneet Sharma (GitHub: PuneetSharma22)
**Live URL:** https://www.opstools.ai
**GitHub:** https://github.com/PuneetSharma22/operationstools
**Local Path:** /Users/puneetsharma/Fuel_Bill_Generator
**Vercel Project:** project-8j23l

---

## What Is OpsTools?

A free React web application — a toolkit for Indian small business operators to generate professional business documents without sign-ups or subscriptions. Live at opstools.ai.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 |
| Build Tool | Vite v8 |
| Styling | Tailwind CSS v4 (via @tailwindcss/vite plugin) |
| Routing | React Router v6 |
| Auth | Supabase Auth (email-based) |
| Database | Supabase (PostgreSQL) |
| Analytics | Vercel Analytics + Speed Insights |
| Hosting | Vercel (deploy via `vercel --prod` CLI) |
| Repo | GitHub |
| Language | JavaScript (JSX) |
| SEO | react-helmet-async |

**Important Tailwind note:** Configured via `@tailwindcss/vite` plugin — NOT traditional tailwind.config.js. `src/index.css` contains only `@import "tailwindcss";`

**Deployment note:** Vercel webhook is NOT connected to GitHub. Must deploy manually with `vercel --prod` from the project directory.

---

## Project File Structure

```
/Users/puneetsharma/Fuel_Bill_Generator/
├── src/
│   ├── App.jsx                              # BrowserRouter + AuthProvider + lazy routes
│   ├── App.css                              # Print styles only (@media print)
│   ├── index.css                            # @import "tailwindcss" + main { contain: layout style }
│   ├── main.jsx                             # React entry + HelmetProvider + Vercel analytics
│   ├── supabase.js                          # Full Supabase client (auth — Login/Signup/Account only)
│   ├── supabase-public.js                   # Lightweight anon client (all other pages use this)
│   ├── context/
│   │   └── AuthContext.jsx                  # Auth state, signIn, signUp, signOut
│   ├── components/
│   │   ├── TopHeader.jsx                    # Sticky dark nav, mega dropdown, mobile drawer
│   │   ├── Footer.jsx                       # Dark footer, hello@opstools.ai, LinkedIn, links
│   │   └── fuel/
│   │       ├── BillForm.jsx                 # Dynamic fuel bill form
│   │       ├── TemplateIOCL.jsx
│   │       ├── TemplatePOS.jsx
│   │       ├── TemplateThermalFull.jsx
│   │       └── TemplateThermalCompact.jsx
│   └── pages/
│       ├── Home.jsx                         # Hero + carousel + stats (uses supabase-public)
│       ├── DocumentsPage.jsx                # All documents hub with LIVE/NEW/SOON badges
│       ├── AboutPage.jsx                    # Mission + values + roadmap + request form
│       ├── LoginPage.jsx
│       ├── SignupPage.jsx
│       ├── AccountPage.jsx
│       ├── BlogsPage.jsx                    # ALL_BLOGS array — magazine listing
│       ├── blogs/
│       │   ├── FuelBillBlog.jsx             # /blogs/how-to-generate-fuel-bill-online-india
│       │   └── LDBillBlog.jsx               # /blogs/how-to-generate-ld-bill-online-india
│       ├── business/
│       │   ├── ROICalculatorPage.jsx        # /business/roi-calculator
│       │   └── GSTCalculatorPage.jsx        # /business/gst-calculator
│       └── documents/
│           ├── FuelBillPage.jsx             # /documents/fuel-bill
│           ├── RentReceiptPage.jsx          # /documents/rent-receipt
│           ├── LDBillPage.jsx               # /documents/ld-bill
│           ├── GSTInvoicePage.jsx           # /documents/gst-invoice
│           ├── SalarySlipPage.jsx           # /documents/salary-slip
│           ├── InvoiceGeneratorPage.jsx     # /documents/invoice
│           ├── QuotationGeneratorPage.jsx   # /documents/quotation
│           ├── RestaurantBillPage.jsx       # /documents/restaurant-bill
│           ├── MedicalBillPage.jsx          # /documents/medical-bill
│           ├── FreelancerInvoicePage.jsx    # /documents/freelancer-invoice
│           ├── HotelBillPage.jsx            # /documents/hotel-bill
│           ├── ServiceInvoicePage.jsx       # /documents/service-invoice
│           ├── EWayBillPage.jsx             # /documents/eway-bill
│           ├── ElectricityBillPage.jsx      # /documents/electricity-bill
│           ├── EInvoicePage.jsx             # /documents/e-invoice
│           ├── VehicleExpensePage.jsx       # /documents/vehicle-expense
│           └── TravelExpensePage.jsx        # /documents/travel-expense
├── public/
│   ├── favicon.svg
│   ├── robots.txt                           # SEO robots (fixed — was returning HTML)
│   ├── llms.txt                             # AI agent accessibility (Markdown with H1 + links)
│   ├── pwa-192.png
│   ├── pwa-512.png
│   └── og-image.png                         # 1200x630 social share image
├── index.html                               # Full HTML with OG meta tags + noscript SEO fallback
├── vercel.json                              # SPA routing rewrite
├── vite.config.js                           # Vite + Tailwind + PWA config
├── .env                                     # Local env vars (NOT in git)
├── .gitignore
└── package.json
```

---

## All Routes

```
/                                    → Home
/documents                           → DocumentsPage
/documents/fuel-bill                 → FuelBillPage (4 templates: iocl, pos, thermal-full, thermal-compact)
/documents/rent-receipt              → RentReceiptPage
/documents/ld-bill                   → LDBillPage
/documents/gst-invoice               → GSTInvoicePage
/documents/salary-slip               → SalarySlipPage
/documents/invoice                   → InvoiceGeneratorPage
/documents/quotation                 → QuotationGeneratorPage
/documents/restaurant-bill           → RestaurantBillPage
/documents/medical-bill              → MedicalBillPage
/documents/freelancer-invoice        → FreelancerInvoicePage
/documents/hotel-bill                → HotelBillPage
/documents/service-invoice           → ServiceInvoicePage
/documents/eway-bill                 → EWayBillPage
/documents/electricity-bill          → ElectricityBillPage
/documents/e-invoice                 → EInvoicePage
/documents/vehicle-expense           → VehicleExpensePage
/documents/travel-expense            → TravelExpensePage
/business/roi-calculator             → ROICalculatorPage
/business/gst-calculator             → GSTCalculatorPage
/blogs                               → BlogsPage
/blogs/how-to-generate-fuel-bill-online-india  → FuelBillBlog
/blogs/how-to-generate-ld-bill-online-india    → LDBillBlog
/about                               → AboutPage
/login                               → LoginPage
/signup                              → SignupPage
/account                             → AccountPage
```

---

## Design System

**Inspired by:** Razorpay.com (dark navy, electric blue gradients)

| Token | Value | Usage |
|-------|-------|-------|
| Navy Dark | #07011F | Header, footer, hero bg |
| Navy Mid | #0D0630 | Dropdowns, dark surfaces |
| Blue Primary | #2563EB | CTAs, active states |
| Indigo | #4F46E5 | Gradient endpoint |
| Surface | #F8FAFC | Page background |
| Border | #E2E8F0 | Cards, dividers |
| Text Primary | #0F172A | Headings |
| Text Secondary | #64748B | Labels, captions |

**Primary button:** `linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)`

**Status badges:** LIVE (blue dot), NEW (green #10B981), SOON (grey)

---

## Database (Supabase)

**Project ID:** ihodvebprqaqphdnfobn
**Region:** ap-northeast-1 (Tokyo)
**URL:** https://ihodvebprqaqphdnfobn.supabase.co

### Tables

**save_requests** (renamed from print_requests on 2 July 2026)
| Column | Type | Notes |
|--------|------|-------|
| id | bigint | Auto PK |
| created_at | timestamp | Auto |
| template | text | e.g. "fuel-bill", "gst-invoice" |
| print_id | text | Unique ID e.g. PRINT-timestamp-random |
| user_id | uuid | FK to auth.users — null for guests |

RLS: Anonymous inserts allowed.

**documents** — drives nav dropdown, home carousel, documents page. Columns: slug, name, href, description, category (retail/business), bundle, status (live/new/soon), sort_order.

**user_credits, profiles, credit_transactions** — ready for credits system (not yet wired to UI).

---

## Authentication

- Provider: Supabase Auth (email + password only)
- Flow: signup → email confirmation → login
- State: AuthContext.jsx (React Context)
- Header: shows email + sign out when logged in, Log in / Sign up when guest
- supabase.js = full auth client (Login/Signup/Account/AuthContext only)
- supabase-public.js = anon-only client (all document pages — avoids multiple GoTrueClient warning)

---

## Environment Variables

### Local (.env — never committed)
```
VITE_SUPABASE_URL=https://ihodvebprqaqphdnfobn.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Vercel (set in project settings)
- VITE_SUPABASE_URL
- VITE_SUPABASE_ANON_KEY

---

## PDF Generation

All document pages use **jsPDF + html2canvas** loaded dynamically (lazy import inside handlePDF). Pattern:
```js
const { default: jsPDF } = await import("jspdf");
const { default: html2canvas } = await import("html2canvas");
```
Every Save PDF click also logs to `save_requests` table via supabase-public.

---

## Email

- Address: hello@opstools.ai
- Provider: Cloudflare Email Routing
- Forwards to: punitshrma769@gmail.com
- DNS: MX records locked on Cloudflare, SPF/DKIM configured
- Status: Live and verified

---

## Performance (as of 2 July 2026)

- PageSpeed Desktop: Performance 99, Accessibility 95, Best Practices 100, SEO 92
- CLS: 0.005 (desktop Lighthouse) / 0.15 (Vercel real-user P75 — improving)
- FCP: 0.4s, LCP: 0.5s
- Bundle: ~265KB (down from 1,212KB via lazy routes + supabase split)

### CLS fixes applied
- `min-height: calc(100vh - 64px)` on `<main>` and PageLoader
- `minHeight: 200` on carousel scroll div
- `minHeight: 260` on carousel section wrappers
- `contain: layout style` on main in index.css

---

## SEO

- robots.txt: `public/robots.txt` (plain text — fixed after it was returning HTML)
- llms.txt: `public/llms.txt` (Markdown with H1 + tool links for AI crawlers)
- OG tags: in index.html (homepage only — individual pages need Helmet tags added)
- noscript fallback: in index.html body for crawler content
- react-helmet-async: installed, HelmetProvider in main.jsx, used in Home.jsx

---

## PWA

- Plugin: vite-plugin-pwa
- Icons: public/pwa-192.png, public/pwa-512.png
- Theme: #07011F
- Display: standalone

---

## Deployment

```bash
cd /Users/puneetsharma/Fuel_Bill_Generator
git add .
git commit -m "your message"
git push
vercel --prod
```

Note: `git push` alone does NOT deploy. Vercel webhook is not connected. Must run `vercel --prod` separately.

---

## Key Technical Decisions

1. **Tailwind v4** via Vite plugin — no tailwind.config.js
2. **Supabase** for auth + database — no separate backend
3. **supabase-public.js** split to avoid multiple GoTrueClient instances
4. **Email-only auth** — no social login
5. **jsPDF + html2canvas** for PDF — browser-side, no server
6. **vercel.json rewrite** for React Router SPA
7. **FALLBACK arrays** in TopHeader + Home as backup when Supabase is slow — Supabase `documents` table is the source of truth
8. **save_requests table** (renamed from print_requests 2 July 2026) tracks every PDF save

---

## What's Next (Roadmap)

### Pending document generators
- Purchase Order (`/documents/purchase-order`) — Sept 2026
- Delivery Challan (`/documents/delivery-challan`) — Sept 2026

### Product features
- Credits system — `user_credits` table exists, UI not wired
- Bill history per user — `save_requests` has user_id, UI not built
- OG meta tags per tool page — needs `<Helmet>` on each document page
- Google Search Console — submit sitemap, verify domain
- More blog posts — GST invoice guide, salary slip guide, rent receipt guide

### Known issues
- DocumentsPage count ("6 live · 12 coming soon") is outdated — needs update to reflect 19 live tools
- Some tool pages missing breadcrumb "Documents" middle step
- Vercel auto-deploy webhook missing — manual `vercel --prod` required
