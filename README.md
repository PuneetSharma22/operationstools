# OpsTools

**Free business operations tools. No sign-up. No cost. Just open and use.**

OpsTools is a web application built for small business owners, freelancers, and operators in India who need fast, professional documents without the friction of paid software or complex sign-ups.

---

## 🚀 Live Tools

| Tool | Status | Description |
|------|--------|-------------|
| Fuel Bill Generator | ✅ Live | 4 real templates — IOCL, Classic POS, Thermal Full, Thermal Compact |
| Rent Receipt Generator | 🔜 Coming Soon | GST-ready rent receipts |
| ROI Calculator | 🔜 Coming Soon | Business investment calculator |

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18 |
| Build Tool | Vite |
| Styling | Tailwind CSS v4 (Vite plugin) |
| Routing | React Router v6 |
| Language | JavaScript (JSX) |

---

## 📁 Project Structure

```
src/
├── App.jsx                          # Root with BrowserRouter + layout
├── App.css                          # Print styles
│
├── components/
│   ├── TopHeader.jsx                # Sticky nav with dropdown menus
│   ├── Footer.jsx                   # Dark footer with links + donate
│   └── fuel/
│       ├── BillForm.jsx             # Dynamic form (fields change per template)
│       ├── TemplateIOCL.jsx         # IOCL Formal receipt
│       ├── TemplatePOS.jsx          # Classic POS monospace receipt
│       ├── TemplateThermalFull.jsx  # Thermal dot-matrix full fields
│       └── TemplateThermalCompact.jsx # Thermal minimal
│
└── pages/
    ├── Home.jsx                     # Landing page
    ├── DocumentsPage.jsx            # Document hub + sub-nav
    ├── AboutPage.jsx                # About + mission + contact
    └── documents/
        ├── FuelBillPage.jsx         # Fuel bill tool page
        └── RentReceiptPage.jsx      # Rent receipt (coming soon)
```

---

## ⚙️ Getting Started

### Prerequisites

- Node.js v20 or higher
- npm

### Installation

```bash
# Clone the repo
git clone https://github.com/your-username/opstools.git
cd opstools

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for Production

```bash
npm run build
```

Output goes to the `dist/` folder. Deploy to Vercel, Netlify, or any static host.

---

## 🧾 Fuel Bill Generator — Templates

### 1. IOCL Formal
Replicates the official IndianOil receipt format. Supports a logo via any public image URL. Fields: station info, receipt no, shift, pump, nozzle, product, rate, qty, customer, vehicle, payment mode, total.

### 2. Classic POS
Monospace thermal printer style used at most petrol stations. Fields: TXN no, invoice no, vehicle no, preset type, nozzle, product, density, rate, volume, amount.

### 3. Thermal Full
Dot-matrix style with all extended fields. Fields: FCC ID, FIP no, nozzle no, product, rate, amount, volume, vehicle type/no, customer name, date/time, payment mode, LST no, VAT no, attendant ID.

### 4. Thermal Compact
Minimal thermal receipt. Fields: receipt no, product, rate, amount, volume, vehicle type/no, customer name, date/time, payment mode.

---

## 🖨️ Printing / Saving as PDF

Click **Print / Save PDF** on any tool page. In the print dialog:
- Set **Destination** to "Save as PDF"
- Set **Margins** to "None" or "Minimum"
- Disable **Headers and footers**
- Enable **Background graphics** if using the IOCL template

---

## 🤝 Contributing

Contributions are welcome! To add a new tool:

1. Create a new page in `src/pages/`
2. Add it to the nav in `TopHeader.jsx`
3. Add it to the tools grid in `Home.jsx`
4. Submit a pull request

---

## 💛 Support

OpsTools is free forever. If it saves you time, consider [buying us a coffee](https://buymeacoffee.com).

---

## 📄 License

MIT License — free to use, modify, and distribute.
