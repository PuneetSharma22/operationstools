// Static SEO / marketing copy for the Fuel Bill Generator page.
// Pulled out of FuelBillPage.jsx so the page file is about behaviour and this
// file is about words — the two change for completely different reasons.

export const SEO_TITLE = "Free Fuel Bill Generator Online — Petrol & Diesel Bill PDF (2026)";
export const SEO_DESCRIPTION = "Generate a fuel bill online for free. Create IOCL, POS & thermal receipt formats for petrol & diesel reimbursement. No login. Instant PDF. India-compliant.";
export const CANONICAL = "https://www.opstools.ai/documents/fuel-bill";

export const softwareAppSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "OpsTools Fuel Bill Generator", operatingSystem: "Web", applicationCategory: "BusinessApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, description: SEO_DESCRIPTION, url: CANONICAL, provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" } };

export const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "Is this fuel bill generator free to use?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no login required." } }, { "@type": "Question", name: "Can I use this fuel bill for office reimbursement?", acceptedAnswer: { "@type": "Answer", text: "Yes. All fields required for reimbursement claims are included." } }, { "@type": "Question", name: "Does this generate a PDF?", acceptedAnswer: { "@type": "Answer", text: "Yes. Click Save PDF to directly download the receipt as a PDF file." } }] };

export const INTRO = (<><p style={{ marginBottom: 16 }}>Need a fuel bill for office reimbursement? Generating one used to mean hunting for Word templates, wrestling with formatting, or waiting for your accounts team. OpsTools Fuel Bill Generator changes that. Fill in your details, pick a template, and have a print-ready petrol or diesel receipt in under a minute — no login, no subscription, no hassle.</p><p style={{ marginBottom: 16 }}>The generator supports four formats based on actual Indian petrol station receipts: the formal IOCL layout used by Indian Oil outlets, the Classic POS format common at private stations, and two thermal dot-matrix formats (full and compact) used at smaller pumps across the country.</p><p>Every field that appears on a real petrol pump receipt is available. The preview updates live as you type. When you are ready, click Save PDF to download your receipt directly. Your data never leaves your device.</p></>);

export const WHAT_IS = `A fuel bill is the receipt issued by a petrol station when you purchase fuel. It serves as proof of purchase and is commonly used in India for employee travel reimbursement claims, business expense records, and tax documentation.`;

export const WHY_USE = [{ title: "Reimbursement claims", body: "Most Indian employers require a fuel receipt for travel or conveyance reimbursement." }, { title: "Petrol station operators", body: "Run a small pump without a POS system? Generate receipts manually using the thermal formats." }, { title: "Vehicle fleet management", body: "Track fuel spend across multiple vehicles with consistent, structured receipts." }, { title: "Business expense records", body: "Self-employed professionals can maintain clean fuel expense records." }, { title: "Quick replacement for lost receipts", body: "Misplaced your petrol pump receipt? Generate a replacement before your reimbursement deadline." }];

export const FEATURES = [{ icon: "🧾", title: "4 Indian receipt templates", body: "IOCL Formal, Classic POS, Thermal Full, and Thermal Compact — all modelled on real Indian pump receipts." }, { icon: "👁️", title: "Live preview", body: "See your bill update in real time as you fill the form." }, { icon: "⬇️", title: "Direct PDF download", body: "One click downloads the receipt as a PDF — no print dialog needed." }, { icon: "🏷️", title: "Custom logo", body: "Paste any image URL to add your station's logo to the bill." }, { icon: "📱", title: "Mobile-friendly", body: "Works on iPhone, Android, and any tablet." }, { icon: "🔒", title: "100% private", body: "No data is stored or transmitted. Everything happens in your browser." }, { icon: "🆓", title: "No login needed", body: "No account, no email, no credit card." }, { icon: "✏️", title: "Fully editable fields", body: "Every field on the receipt is customisable." }];

export const HOW_TO_STEPS = [{ step: 1, title: "Choose a template", body: "Select from Thermal Full, Classic POS, IOCL Formal, or Thermal Compact." }, { step: 2, title: "Fill in station details", body: "Enter the petrol station name, address, and branding details." }, { step: 3, title: "Enter transaction details", body: "Add date, time, fuel type, quantity, rate per litre." }, { step: 4, title: "Add vehicle info", body: "Enter vehicle registration number and attendant details." }, { step: 5, title: "Preview your bill", body: "Check the live preview. Every field updates instantly." }, { step: 6, title: "Download PDF", body: "Click Save PDF to download the receipt directly to your device." }];

export const BENEFITS = ["Generate unlimited fuel bills — no caps or credit limits.", "No registration or sign-up required.", "Direct PDF download — no print dialog.", "Four templates match actual Indian petrol station formats.", "All data stays in your browser — zero privacy risk.", "Completely free — no subscription."];

export const FORMAT_FIELDS = [{ field: "Station Name", description: "Name of the petrol pump", example: "Indian Oil — Verma Fuels" }, { field: "Station Address", description: "Full address of the petrol station", example: "Plot 12, MG Road, Pune 411001" }, { field: "Date & Time", description: "Date and time of the transaction", example: "20/06/2026 — 14:35" }, { field: "Fuel Type", description: "Type of fuel dispensed", example: "Petrol / Diesel / CNG" }, { field: "Quantity", description: "Volume dispensed in litres", example: "5.00 L" }, { field: "Rate per Litre", description: "Price per litre at time of transaction", example: "₹103.44" }, { field: "Total Amount", description: "Total value of the transaction", example: "₹517.20" }, { field: "Vehicle Number", description: "Registration number of the vehicle", example: "MH 12 AB 1234" }];

export const FAQS = faqSchema.mainEntity.map((i) => ({ q: i.name, a: i.acceptedAnswer.text }));

export const RELATED_DOCS = [{ name: "Rent Receipt Generator", href: "/documents/rent-receipt", description: "HRA-compliant rent receipts." }, { name: "GST Invoice Generator", href: "/documents/gst-invoice", description: "Tax-compliant GST invoices." }, { name: "Salary Slip Generator", href: "/documents/salary-slip", description: "Professional payslips." }];

export const BREADCRUMBS = [
  { name: "Home", url: "https://www.opstools.ai" },
  { name: "Documents", url: "https://www.opstools.ai/documents" },
  { name: "Fuel Bill Generator", url: CANONICAL },
];
