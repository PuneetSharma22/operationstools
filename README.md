# OpsTools — Free Business Document Generator for India

> Generate fuel bills, rent receipts, GST invoices, salary slips and more — free, no login, instant PDF.

**Live:** [opstools.ai](https://www.opstools.ai) · **Built by:** Puneet Sharma · **Stack:** React 19 + Vite 8 + Supabase + Vercel

---

## What Is OpsTools?

OpsTools is a free browser-based toolkit for Indian small business operators to generate professional business documents without sign-ups, subscriptions, or software installations. Fill in the form, download the PDF. That's it.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite` plugin) |
| Routing | React Router v7 (`react-router-dom`) |
| Auth | Supabase Auth (email + password) |
| Database | Supabase (PostgreSQL) |
| Analytics | Vercel Analytics + Speed Insights |
| Hosting | Vercel |
| SEO | react-helmet-async + useSEO hook |
| PDF | jsPDF + html2canvas (lazy loaded) |

> **Tailwind note:** Uses `@tailwindcss/vite` plugin — no `tailwind.config.js`. `src/index.css` contains only `@import "tailwindcss";`

---

## Live Tools (19)

### Retail Documents
| Tool | URL |
|------|-----|
| Fuel Bill Generator | `/documents/fuel-bill` |
| Rent Receipt Generator | `/documents/rent-receipt` |
| L&D Tax Invoice | `/documents/ld-bill` |
| GST Invoice | `/documents/gst-invoice` |
| Salary Slip | `/documents/salary-slip` |
| Restaurant Bill | `/documents/restaurant-bill` |
| Medical Bill | `/documents/medical-bill` |
| Hotel Bill | `/documents/hotel-bill` |
| Electricity Bill | `/documents/electricity-bill` |
| Invoice Generator | `/documents/invoice` |
| Quotation Generator | `/documents/quotation` |
| Freelancer Invoice | `/documents/freelancer-invoice` |
| Service Invoice | `/documents/service-invoice` |
| E-Way Bill | `/documents/eway-bill` |
| E-Invoice (IRN) | `/documents/e-invoice` |
| Vehicle Expense Report | `/documents/vehicle-expense` |
| Travel Expense Report | `/documents/travel-expense` |

### Business Tools
| Tool | URL |
|------|-----|
| ROI Calculator | `/business/roi-calculator` |
| GST Calculator | `/business/gst-calculator` |

---

## Project Structure

```
src/
├── App.jsx                          # Routes (all lazy loaded)
├── main.jsx                         # Entry + HelmetProvider + Analytics
├── supabase.js                      # Single shared Supabase client (auth + data)
├── context/
│   └── AuthContext.jsx
├── components/
│   ├── TopHeader.jsx
│   ├── Footer.jsx
│   ├── fuel/                        # Fuel bill templates
│   ├── rent/                        # Rent receipt templates
│   └── restaurant/                  # Restaurant bill templates + billMath.js
├── pages/
│   ├── Home.jsx
│   ├── DocumentsPage.jsx
│   ├── AboutPage.jsx
│   ├── AccountPage.jsx
│   ├── AdminPage.jsx
│   ├── EmailVerifiedPage.jsx
│   ├── BlogsPage.jsx
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── blogs/                       # 5 blog posts
│   ├── business/                    # ROI + GST calculators
│   └── documents/                   # 17 document generators
└── seo/
    ├── useSEO.js                    # SEO hook (FuelBillPage)
    ├── DocumentPageSEO.jsx
    └── programmaticPages.js         # Registry for programmatic SEO pages
public/
├── sitemap.xml                      # 28 URLs
├── robots.txt
├── llms.txt
├── og-image.png
└── favicon.svg
api/
└── og-meta.js                       # OG tags serverless function
```

---

## Getting Started

### Prerequisites
- Node.js v24+
- A Supabase project
- Vercel CLI (`npm i -g vercel`)

### Local Development

```bash
git clone https://github.com/PuneetSharma22/operationstools.git
cd operationstools
npm install
cp .env.example .env  # add your Supabase keys
npm run dev
```

### Environment Variables

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Set the same variables in Vercel project settings.

---

## Deployment

> **Important:** Vercel webhook is NOT connected to GitHub. Always deploy manually.

```bash
git add .
git commit -m "your message"
git push
vercel --prod
```

---

## Database Schema (Supabase)

| Table | Purpose |
|-------|---------|
| `save_requests` | Tracks every PDF save — template, print_id, user_id |
| `documents` | Drives nav dropdown and home carousel |
| `user_credits` | Credit balance per user |
| `credit_transactions` | Credit history (grants, usage) |
| `credit_requests` | User credit requests pending admin approval |
| `profiles` | User profile (email, name) |

### Credits System

- Guests: use all tools freely, Save PDF works
- Logged-in: same + can request credits (10/15/25/100 per request)
- Max 100 credits requestable per month
- Admin approves at `/admin` → credits added to balance
- For >100/month: email hello@opstools.ai

---

## Key Technical Decisions

1. **Single shared Supabase client** — `src/supabase.js` exports one `createClient()` instance (default + named export `supabase`), imported everywhere (auth, document pages, admin). Avoids duplicate GoTrueClient instances.
2. **Lazy routes** — all pages lazy loaded via `React.lazy()` for fast initial load
3. **Browser PDF** — jsPDF + html2canvas, lazy imported inside the save handler
4. **vercel.json rewrite** — excludes `sitemap.xml`, `robots.txt` and static files from SPA rewrite
5. **useSEO hook** — FuelBillPage uses a custom hook that sets OG tags via `document.head`. All other pages use `react-helmet-async`
6. **Shared client in document pages** — `save_requests` inserts use the shared client so `auth.uid()` is captured correctly for logged-in users, and null for guests

---

## Blog Posts

| Post | URL |
|------|-----|
| How to Generate a Fuel Bill Online | `/blogs/how-to-generate-fuel-bill-online-india` |
| How to Generate an L&D Invoice | `/blogs/how-to-generate-ld-bill-online-india` |
| How to Generate a GST Invoice | `/blogs/how-to-generate-gst-invoice-online-india` |
| How to Generate a Salary Slip | `/blogs/how-to-generate-salary-slip-online-india` |
| How to Generate a Rent Receipt | `/blogs/how-to-generate-rent-receipt-online-india` |

---

## Design System

| Token | Value | Usage |
|-------|-------|-------|
| Navy Dark | `#07011F` | Header, footer, hero |
| Navy Mid | `#0D0630` | Dropdowns |
| Blue Primary | `#2563EB` | CTAs, active states |
| Indigo | `#4F46E5` | Gradient endpoint |
| Surface | `#F8FAFC` | Page background |
| Border | `#E2E8F0` | Cards, dividers |
| Text Primary | `#0F172A` | Headings |
| Text Secondary | `#64748B` | Labels |

Primary button: `linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)`

---

## Roadmap

### Next
- Bill history UI (data already tracked in `save_requests`)
- WhatsApp share button on each tool
- Purchase Order generator
- Delivery Challan generator

### Future
- Credits monetisation with Razorpay
- Multi-language support (Hindi, Marathi, Tamil)
- Cloud save + share via link
- Mobile app (PWA already configured)

---

## Contact

- **Email:** hello@opstools.ai
- **GitHub:** [PuneetSharma22](https://github.com/PuneetSharma22)
- **Live:** [opstools.ai](https://www.opstools.ai)
