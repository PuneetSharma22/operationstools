# OpsTools — Project Context & Build Summary

**Last Updated:** 20 June 2026  
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
| Hosting | Vercel (auto-deploys on git push) |
| Repo | GitHub |
| Language | JavaScript (JSX) |

**Important Tailwind note:** Configured via `@tailwindcss/vite` plugin — NOT traditional tailwind.config.js. `src/index.css` contains only `@import "tailwindcss";`

---

## Project File Structure

```
/Users/puneetsharma/Fuel_Bill_Generator/
├── src/
│   ├── App.jsx                          # BrowserRouter + AuthProvider + layout
│   ├── App.css                          # Print styles only (@media print)
│   ├── index.css                        # @import "tailwindcss"
│   ├── main.jsx                         # React entry + Vercel analytics inject
│   ├── supabase.js                      # Supabase client (uses env vars)
│   ├── context/
│   │   └── AuthContext.jsx              # Auth state, signIn, signUp, signOut
│   ├── components/
│   │   ├── TopHeader.jsx                # Sticky dark nav, dropdowns, auth state
│   │   ├── Footer.jsx                   # Dark footer, links, donate button
│   │   └── fuel/
│   │       ├── BillForm.jsx             # Dynamic form (fields change per template)
│   │       ├── TemplateIOCL.jsx         # IOCL Formal receipt template
│   │       ├── TemplatePOS.jsx          # Classic POS monospace template
│   │       ├── TemplateThermalFull.jsx  # Thermal dot-matrix full fields
│   │       └── TemplateThermalCompact.jsx # Thermal minimal
│   └── pages/
│       ├── Home.jsx                     # Landing page with hero + tools grid
│       ├── DocumentsPage.jsx            # Document hub + sub-nav bar
│       ├── AboutPage.jsx                # About + mission + contact
│       ├── LoginPage.jsx                # Email login form
│       ├── SignupPage.jsx               # Email signup + confirmation screen
│       └── documents/
│           ├── FuelBillPage.jsx         # Fuel bill tool + print tracking
│           └── RentReceiptPage.jsx      # Coming soon placeholder
├── public/
│   ├── favicon.svg                      # OpsTools logo SVG
│   ├── pwa-192.png                      # PWA icon 192x192
│   ├── pwa-512.png                      # PWA icon 512x512
│   └── og-image.png                     # Social share image 1200x630
├── index.html                           # Full HTML with OG meta tags
├── vercel.json                          # SPA routing fix
├── vite.config.js                       # Vite + Tailwind + PWA config
├── README.md
├── PRODUCT.md
├── .env                                 # Local env vars (NOT in git)
├── .gitignore
└── package.json
```

---

## Routes

```
/                          → Home (landing page)
/documents                 → Document hub with sub-nav
/documents/fuel-bill       → Fuel Bill Generator
/documents/rent-receipt    → Rent Receipt (coming soon)
/about                     → About page
/login                     → Login page
/signup                    → Signup page
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

---

## Fuel Bill Generator — 4 Templates

Based on real Indian petrol station receipts:

| Template ID | Name | Style | Unique Fields |
|-------------|------|-------|---------------|
| `iocl` | IOCL Formal | Logo + dashed separators | Shift, Pump No, Nozzle, Logo URL |
| `pos` | Classic POS | Bold monospace header | TXN No, Invoice No, Density, Preset Type |
| `thermal-full` | Thermal Full | Dot-matrix all fields | FCC ID, FIP No, LST No, Attendant ID |
| `thermal-compact` | Thermal Compact | Minimal dot-matrix | Core fields only |

**Logo support:** User pastes any public image URL → live preview → renders on bill.
**Print:** `window.print()` → browser print dialog → Save as PDF.

---

## Authentication

- **Provider:** Supabase Auth
- **Method:** Email + Password only
- **Flow:** Sign up → email confirmation → login
- **State management:** `AuthContext.jsx` using React Context
- **Header behaviour:** Shows email + sign out dropdown when logged in, shows Log in / Sign up when guest

---

## Database (Supabase)

**Project ID:** ihodvebprqaqphdnfobn  
**Region:** ap-northeast-1 (Tokyo)  
**Project URL:** https://ihodvebprqaqphdnfobn.supabase.co  

### Tables

**print_requests**
| Column | Type | Description |
|--------|------|-------------|
| id | bigint | Auto-increment primary key |
| created_at | timestamp | Auto-set on insert |
| template | text | Template used (iocl, pos, etc.) |
| print_id | text | Unique print ID (PRINT-timestamp-random) |
| user_id | uuid | FK to auth.users — null if guest |

**RLS Policy:** Anonymous inserts allowed (so guests can also log prints).

---

## Environment Variables

### Local (`.env` — never committed to git)
```
VITE_SUPABASE_URL=https://ihodvebprqaqphdnfobn.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

### Vercel (set in project settings)
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

---

## PWA Setup

- Plugin: `vite-plugin-pwa`
- Icons: `public/pwa-192.png` and `public/pwa-512.png`
- Theme color: `#07011F`
- Display: `standalone`
- Start URL: `/`

---

## Deployment Workflow

```bash
git add .
git commit -m "your message"
git push
# Vercel auto-deploys to www.opstools.ai
```

---

## OpsTools Logo

SVG — 32x32px, blue-to-indigo gradient background with 3×3 grid of rounded white squares in varying opacities. Defined inline in `TopHeader.jsx` and `Footer.jsx`.

---

## What's Planned Next

### v1.1
- Rent Receipt Generator
- Credits system (guest = 0 credits, logged in = credits balance)
- Bill history per user (stored in Supabase)

### v2.0
- ROI Calculator
- GST Invoice Generator
- Salary Slip Generator
- Cloud save + share via link
- WhatsApp share button
- Multi-language (Hindi, Marathi, Tamil)

---

## Key Technical Decisions

1. **Tailwind v4** via Vite plugin — no tailwind.config.js needed
2. **Supabase** for both auth and database — no separate backend
3. **Email-only auth** — no social login in v1
4. **Browser print** for PDF — no server-side PDF generation
5. **Env variables** for all secrets — never hardcoded
6. **vercel.json rewrite** for React Router SPA routing
7. **Razorpay color inspiration** — dark navy (#07011F) not pure black

---

## Issues Solved

- Node.js v19 → upgraded to v24 via nodejs.org
- Tailwind not loading → needed `@import "tailwindcss"` in index.css
- Git push rejected → used `git push --force origin main`
- GitHub password auth → Personal Access Token
- Vercel 404 → added vercel.json with SPA rewrite rule
- index.html missing body tag → page was blank
- Supabase RLS blocking inserts → added anonymous insert policy
- Supabase missing columns → added via ALTER TABLE in SQL editor
- Supabase anon key exposed → moved to .env + Vercel env vars
