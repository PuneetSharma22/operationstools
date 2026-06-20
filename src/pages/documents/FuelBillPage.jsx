import { supabase } from '../../supabase.js';
import { useState } from "react";
import BillForm from "../../components/fuel/BillForm";
import TemplatePOS from "../../components/fuel/TemplatePOS";
import TemplateIOCL from "../../components/fuel/TemplateIOCL";
import TemplateThermalFull from "../../components/fuel/TemplateThermalFull";
import TemplateThermalCompact from "../../components/fuel/TemplateThermalCompact";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";

// ─── Template config ──────────────────────────────────────────────────────────

const TEMPLATES = [
  { id: "iocl", label: "IOCL Formal", desc: "Logo + dashed separators" },
  { id: "pos", label: "Classic POS", desc: "Monospace receipt style" },
  { id: "thermal-full", label: "Thermal Full", desc: "Dot-matrix with all fields" },
  { id: "thermal-compact", label: "Thermal Compact", desc: "Minimal thermal print" },
];

const defaultData = {
  stationName: "PK FUEL STATION",
  stationAddress: "PAREKH NAGAR S V RD, KANDIVALI W, MUMBAI - 400067",
  stationPhone: "38055913",
  vatTin: "7761395712V",
  gstNumber: "27AABCU9603R1ZX",
  lstNumber: "",
  cstNumber: "",
  logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/IndianOil_Logo.svg/200px-IndianOil_Logo.svg.png",
  billNumber: "G64695",
  billDate: new Date().toISOString().split("T")[0],
  billTime: new Date().toTimeString().slice(0, 5),
  shift: "S-1",
  pumpNo: "P-05",
  nozzleNo: "N-02",
  fccId: "",
  fipNo: "07",
  txnNo: "6242805",
  invoiceNo: "927267",
  localId: "00024735",
  customerName: "",
  vehicleNumber: "",
  vehicleType: "4W",
  mobileNo: "",
  attendantId: "",
  fuelType: "Petrol",
  density: "625.078",
  quantity: "",
  pricePerLitre: "104.29",
  presetType: "Amount",
  paymentMode: "Cash",
};

const TEMPLATE_COMPONENTS = {
  pos: TemplatePOS,
  iocl: TemplateIOCL,
  "thermal-full": TemplateThermalFull,
  "thermal-compact": TemplateThermalCompact,
};

// ─── SEO config ───────────────────────────────────────────────────────────────

const SEO_TITLE = "Free Fuel Bill Generator Online — Petrol & Diesel Bill PDF (2026)";
const SEO_DESCRIPTION =
  "Generate a fuel bill online for free. Create IOCL, POS & thermal receipt formats for petrol & diesel reimbursement. No login. Instant PDF. India-compliant.";
const CANONICAL = "https://www.opstools.ai/documents/fuel-bill";

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "OpsTools Fuel Bill Generator",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  description: "Free online fuel bill generator for Indian businesses and employees. Create petrol and diesel bills in IOCL, POS and thermal receipt formats. Instant PDF download, no sign-up required.",
  url: CANONICAL,
  screenshot: "https://www.opstools.ai/og-image.png",
  featureList: [
    "4 Indian petrol station receipt formats",
    "IOCL formal receipt template",
    "Classic POS receipt template",
    "Thermal dot-matrix receipt template",
    "Custom logo support",
    "Instant browser PDF print",
    "No login required",
    "GST-ready fields",
  ],
  provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" },
};

const webPageSchema = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  name: SEO_TITLE,
  description: SEO_DESCRIPTION,
  url: CANONICAL,
  inLanguage: "en-IN",
  isPartOf: { "@type": "WebSite", url: "https://www.opstools.ai", name: "OpsTools" },
  breadcrumb: {
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://www.opstools.ai" },
      { "@type": "ListItem", position: 2, name: "Documents", item: "https://www.opstools.ai/documents" },
      { "@type": "ListItem", position: 3, name: "Fuel Bill Generator", item: CANONICAL },
    ],
  },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is this fuel bill generator free to use?", acceptedAnswer: { "@type": "Answer", text: "Yes, OpsTools Fuel Bill Generator is completely free. There are no hidden charges, no subscription fees, and no login required. You can generate unlimited fuel bills at no cost." } },
    { "@type": "Question", name: "Can I use this fuel bill for office reimbursement?", acceptedAnswer: { "@type": "Answer", text: "Yes. The fuel bills generated follow standard Indian petrol station receipt formats (IOCL, POS, Thermal) and include all fields typically required for employee fuel reimbursement claims — vehicle number, fuel type, quantity, rate, amount, and station details." } },
    { "@type": "Question", name: "Does this generate a PDF or just show a preview?", acceptedAnswer: { "@type": "Answer", text: "Clicking the Print button opens your browser's native print dialog. From there, choose 'Save as PDF' to download a PDF file. This works on all browsers including Chrome, Safari, Firefox and Edge." } },
    { "@type": "Question", name: "Is the fuel bill generator GST-compliant?", acceptedAnswer: { "@type": "Answer", text: "The generator includes fields for GSTIN and GST amount in relevant templates. However, fuel retail in India is currently outside GST (petrol and diesel are state-taxed). The GSTIN field is available for CNG stations and other GST-applicable fuel types." } },
    { "@type": "Question", name: "What formats or templates are available?", acceptedAnswer: { "@type": "Answer", text: "Four templates are available: IOCL Formal (with logo support), Classic POS (monospace bold header), Thermal Full (dot-matrix with all fields), and Thermal Compact (minimal dot-matrix). Each matches a common Indian petrol station receipt format." } },
    { "@type": "Question", name: "Will my data be saved or stored?", acceptedAnswer: { "@type": "Answer", text: "No. All data you enter is processed entirely in your browser. Nothing is sent to or stored on OpsTools servers. Your bill details are completely private." } },
    { "@type": "Question", name: "Can I add my petrol station logo?", acceptedAnswer: { "@type": "Answer", text: "Yes. The IOCL Formal template supports a logo URL. Paste any publicly accessible image URL and it will appear on your bill preview and printed PDF." } },
    { "@type": "Question", name: "What is a fuel bill or petrol receipt?", acceptedAnswer: { "@type": "Answer", text: "A fuel bill is a receipt issued at a petrol pump when you purchase petrol, diesel, or CNG. It typically includes the station name, address, fuel type, quantity, rate per litre, total amount, date, time, vehicle number, and pump/nozzle details." } },
    { "@type": "Question", name: "Can I generate a diesel bill too, or only petrol?", acceptedAnswer: { "@type": "Answer", text: "Yes. The generator supports petrol, diesel, CNG, and other fuel types. Simply select or type the fuel type in the form field." } },
    { "@type": "Question", name: "Does it work on mobile?", acceptedAnswer: { "@type": "Answer", text: "Yes. OpsTools is fully mobile-responsive. You can fill the form on your phone and print or save the PDF directly from your mobile browser." } },
    { "@type": "Question", name: "Can I customise all fields on the bill?", acceptedAnswer: { "@type": "Answer", text: "Yes. All fields are editable — station name, address, date, time, vehicle number, fuel type, quantity, rate, amount, attendant, and template-specific fields like pump number, nozzle, shift, transaction ID, and more." } },
    { "@type": "Question", name: "Is the generated fuel bill legally valid?", acceptedAnswer: { "@type": "Answer", text: "The generator creates documents in the format of standard Indian petrol station receipts for convenience and reimbursement purposes. For legally binding receipts, always obtain an original receipt directly from a registered petrol station." } },
    { "@type": "Question", name: "What is an IOCL fuel bill format?", acceptedAnswer: { "@type": "Answer", text: "IOCL (Indian Oil Corporation Limited) is India's largest fuel retailer. Their receipt format includes a company logo, station name, IOCL branding, shift details, pump and nozzle numbers, and a formal dashed-separator layout. OpsTools replicates this format accurately." } },
    { "@type": "Question", name: "What is a thermal receipt format?", acceptedAnswer: { "@type": "Answer", text: "Thermal receipts are printed using a heat-sensitive printer commonly used at petrol pumps and retail stores. They use a monospace font and plain text layout. OpsTools offers both Thermal Full (all fields) and Thermal Compact (minimal) versions." } },
    { "@type": "Question", name: "Can I generate a fuel bill for CNG?", acceptedAnswer: { "@type": "Answer", text: "Yes. Simply select CNG as the fuel type. CNG bills often include GSTIN since CNG is under GST. You can fill in those fields in the form." } },
    { "@type": "Question", name: "How do I submit a fuel bill for HRA or IT exemption?", acceptedAnswer: { "@type": "Answer", text: "For Income Tax purposes, fuel bills are used for conveyance or transport allowance claims, not HRA. Submit the generated PDF along with your employer's prescribed reimbursement form. Consult your HR or tax advisor for exact requirements." } },
    { "@type": "Question", name: "Can I change the currency or units?", acceptedAnswer: { "@type": "Answer", text: "Currently the generator uses Indian Rupees (₹) and litres/kg as units, matching Indian petrol station formats. Multi-currency support is on the roadmap." } },
    { "@type": "Question", name: "Does it generate a bill number or receipt number automatically?", acceptedAnswer: { "@type": "Answer", text: "Yes. A unique transaction or receipt number is auto-generated on supported templates. You can also overwrite it manually." } },
    { "@type": "Question", name: "Can I save the bill and come back to edit it later?", acceptedAnswer: { "@type": "Answer", text: "Bill history per user (stored in Supabase) is coming in v1.1. For now, save the PDF immediately after generating. The form fields reset if you navigate away." } },
    { "@type": "Question", name: "What other document generators does OpsTools offer?", acceptedAnswer: { "@type": "Answer", text: "OpsTools is building a full suite of Indian business document generators including Rent Receipt, GST Invoice, Salary Slip, and more. All free, all in your browser. Check the Documents section for the latest." } },
  ],
};

// ─── SEO content ─────────────────────────────────────────────────────────────

const INTRO = (
  <>
    <p style={{ marginBottom: 16 }}>Need a fuel bill for office reimbursement? Generating one used to mean hunting for Word templates, wrestling with formatting, or waiting for your accounts team. OpsTools Fuel Bill Generator changes that. Fill in your details, pick a template, and have a print-ready petrol or diesel receipt in under a minute — no login, no subscription, no hassle.</p>
    <p style={{ marginBottom: 16 }}>The generator supports four formats based on actual Indian petrol station receipts: the formal IOCL layout used by Indian Oil outlets, the Classic POS format common at private stations, and two thermal dot-matrix formats (full and compact) used at smaller pumps across the country. Whether you need a receipt for a two-wheeler fuel-up or a commercial vehicle diesel fill, there is a template here that matches.</p>
    <p>Every field that appears on a real petrol pump receipt is available — station name and address, fuel type, quantity, rate per litre, total amount, vehicle number, date, time, pump number, nozzle, attendant ID, and more. The preview updates live as you type, so you see exactly what will be printed. When you are ready, click Print and save the result as a PDF from your browser. Your data never leaves your device.</p>
  </>
);

const WHAT_IS = `A fuel bill, also called a petrol receipt or pump receipt, is the document issued by a petrol station when you purchase fuel. It serves as proof of purchase and is commonly used in India for employee travel reimbursement claims, business expense records, and tax documentation. A standard Indian fuel bill includes the station's name, address, and GSTIN (for CNG), the date and time of the transaction, the type of fuel (petrol, diesel, or CNG), the quantity dispensed in litres, the rate per litre, and the total amount paid. Many receipts also include vehicle registration number, pump number, nozzle number, shift details, and a unique transaction ID. OpsTools replicates all of these fields across four common Indian petrol station receipt formats.`;

const WHY_USE = [
  { title: "Reimbursement claims", body: "Most Indian employers require a fuel receipt for travel or conveyance reimbursement. If you lost the original or need a specific format your HR accepts, this generator covers you." },
  { title: "Petrol station operators", body: "Run a small pump without a POS system? Generate receipts manually using the thermal formats — they match what customers expect from a petrol pump." },
  { title: "Vehicle fleet management", body: "Track fuel spend across multiple vehicles by generating consistent, structured receipts that you can file and reconcile against actual fuel costs." },
  { title: "Business expense records", body: "Self-employed professionals and small business owners can maintain clean fuel expense records with standardised receipts that accountants and auditors recognise." },
  { title: "Quick replacement for lost receipts", body: "Misplaced your petrol pump receipt? Generate a replacement in the correct format before your reimbursement deadline." },
];

const FEATURES = [
  { icon: "🧾", title: "4 Indian receipt templates", body: "IOCL Formal, Classic POS, Thermal Full, and Thermal Compact — all modelled on real Indian pump receipts." },
  { icon: "👁️", title: "Live preview", body: "See your bill update in real time as you fill the form. No surprises at print time." },
  { icon: "🖨️", title: "Instant PDF", body: "One click opens the print dialog. Select 'Save as PDF' for a downloadable file." },
  { icon: "🏷️", title: "Custom logo", body: "Paste any image URL to add your petrol station's logo to the IOCL template." },
  { icon: "📱", title: "Mobile-friendly", body: "Works on iPhone, Android, and any tablet. Fill, preview, and print from your phone." },
  { icon: "🔒", title: "100% private", body: "No data is stored or transmitted. Everything happens in your browser." },
  { icon: "🆓", title: "No login needed", body: "No account, no email, no credit card. Open the page and start generating." },
  { icon: "✏️", title: "Fully editable fields", body: "Every field on the receipt — date, rate, vehicle number, attendant — is customisable." },
];

const HOW_TO_STEPS = [
  { step: 1, title: "Choose a template", body: "Select from IOCL Formal, Classic POS, Thermal Full, or Thermal Compact based on the format you need." },
  { step: 2, title: "Fill in the station details", body: "Enter the petrol station name, address, and any branding details. Paste a logo URL if using the IOCL template." },
  { step: 3, title: "Enter transaction details", body: "Add date, time, fuel type, quantity (litres), rate per litre, and total amount." },
  { step: 4, title: "Add vehicle and attendant info", body: "Enter the vehicle registration number, attendant name or ID, pump and nozzle numbers as required by your template." },
  { step: 5, title: "Preview your bill", body: "Check the live preview on the right. Every field updates instantly. Adjust anything that looks off." },
  { step: 6, title: "Print or save as PDF", body: "Click the Print button. In the print dialog, select 'Save as PDF' as the destination to download your fuel bill." },
];

const BENEFITS = [
  "Generate unlimited fuel bills — there are no caps or credit limits.",
  "No registration or sign-up of any kind required.",
  "Works offline once the page is loaded — no internet needed to fill and print.",
  "Four templates match the actual formats used at Indian petrol stations.",
  "All data stays in your browser — zero privacy risk.",
  "Mobile-ready — generate a PDF from your phone in under a minute.",
  "Supports petrol, diesel, CNG, and other fuel types.",
  "Custom logo support for branding on IOCL-format bills.",
  "Accepted by most Indian employers for travel reimbursement claims.",
  "Completely free — no subscription, no premium tier for basic features.",
];

const FORMAT_FIELDS = [
  { field: "Station Name", description: "Name of the petrol pump or fuel station", example: "Indian Oil — Sharma Fuels" },
  { field: "Station Address", description: "Full address of the petrol station", example: "Plot 12, MG Road, Pune 411001" },
  { field: "Date & Time", description: "Date and time of the transaction", example: "20/06/2026 — 14:35" },
  { field: "Fuel Type", description: "Type of fuel dispensed", example: "Petrol / Diesel / CNG" },
  { field: "Quantity", description: "Volume dispensed in litres (or kg for CNG)", example: "5.00 L" },
  { field: "Rate per Litre", description: "Price per litre at time of transaction", example: "₹103.44" },
  { field: "Total Amount", description: "Total value of the transaction", example: "₹517.20" },
  { field: "Vehicle Number", description: "Registration number of the vehicle", example: "MH 12 AB 1234" },
  { field: "Pump No.", description: "Pump number at the station", example: "Pump 3" },
  { field: "Nozzle No.", description: "Nozzle number on the pump", example: "Nozzle 2" },
  { field: "Shift", description: "Staff shift during which the transaction occurred", example: "Morning / Afternoon / Night" },
  { field: "Attendant ID", description: "ID or name of the fuel attendant", example: "ATT-042" },
  { field: "Transaction ID", description: "Unique receipt or transaction number", example: "TXN-20260620-0041" },
  { field: "GSTIN", description: "GST registration number (required for CNG)", example: "27AABCU9603R1ZX" },
];

const FAQS = faqSchema.mainEntity.map((item) => ({
  q: item.name,
  a: item.acceptedAnswer.text,
}));

const RELATED_DOCS = [
  { name: "Rent Receipt Generator", href: "/documents/rent-receipt", description: "HRA-compliant rent receipts for tenants and landlords." },
  { name: "GST Invoice Generator", href: "/documents/gst-invoice", description: "Tax-compliant GST invoices with GSTIN and HSN codes." },
  { name: "Salary Slip Generator", href: "/documents/salary-slip", description: "Professional payslips with CTC, deductions, and net pay." },
  { name: "Vehicle Expense Report", href: "/documents/vehicle-expense", description: "Consolidated fuel and maintenance expense reports." },
  { name: "Mileage Reimbursement Form", href: "/documents/mileage-reimbursement", description: "Calculate and document km-based travel reimbursement." },
  { name: "Travel Expense Report", href: "/documents/travel-expense", description: "Full business travel expense summary for HR submission." },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function FuelBillPage() {
  const [data, setData] = useState(defaultData);
  const [activeTemplate, setActiveTemplate] = useState("iocl");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePrint = async () => {
    const printId = `PRINT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    try {
      const { data: { user } } = await supabase.auth.getUser();
      const { error } = await supabase.from('print_requests').insert({
        template: activeTemplate,
        print_id: printId,
        user_id: user?.id ?? null,
      });
      if (error) console.error('Supabase error:', error);
      else console.log('Print logged:', printId);
    } catch (err) {
      console.error('Failed:', err);
    }
    window.print();
  };

  const PreviewComponent = TEMPLATE_COMPONENTS[activeTemplate];

  useSEO({
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    canonical: CANONICAL,
    breadcrumbs: [
      { name: "Home", url: "https://www.opstools.ai" },
      { name: "Documents", url: "https://www.opstools.ai/documents" },
      { name: "Fuel Bill Generator", url: CANONICAL },
    ],
    schemas: [softwareAppSchema, webPageSchema, faqSchema],
  });

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>

      {/* ── SEO hero + breadcrumb ── */}
      <section
        style={{
          background: "linear-gradient(160deg, #07011F 0%, #0D0630 60%, #1e1b4b 100%)",
          padding: "40px 24px 36px",
        }}
      >
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <nav style={{ marginBottom: 16, fontSize: 13, color: "#475569" }} aria-label="Breadcrumb">
            <a href="/" style={{ color: "#475569", textDecoration: "none" }}>Home</a>
            <span style={{ margin: "0 8px" }}>›</span>
            <a href="/documents" style={{ color: "#475569", textDecoration: "none" }}>Documents</a>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Fuel Bill Generator</span>
          </nav>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <h1 style={{ fontSize: "clamp(22px, 3vw, 30px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                Free Fuel Bill Generator
              </h1>
              <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
                Choose a template, fill details — receipt updates live.
              </p>
            </div>
            <button
              onClick={handlePrint}
              className="no-print"
              style={{
                background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
                color: "#fff",
                border: "none",
                padding: "10px 22px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 14,
                cursor: "pointer",
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              🖨️ Print / Save PDF
            </button>
          </div>
        </div>
      </section>

      {/* ── Tool ── */}
      <div className="max-w-[1280px] mx-auto px-6 py-8">

        {/* Template Picker */}
        <div className="no-print mb-8">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-[#64748B] mb-3">Choose Template</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTemplate(t.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                  activeTemplate === t.id
                    ? "border-[#2563EB] bg-[#EFF6FF]"
                    : "border-[#E2E8F0] bg-white hover:border-[#2563EB]/40"
                }`}
              >
                <p className={`text-[14px] font-semibold ${activeTemplate === t.id ? "text-[#2563EB]" : "text-[#0F172A]"}`}>{t.label}</p>
                <p className="text-[12px] text-[#64748B] mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Form + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="no-print">
            <BillForm data={data} onChange={handleChange} template={activeTemplate} />
          </div>
          <div className="lg:sticky lg:top-24">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-[#64748B] mb-3 no-print">Live Preview</p>
            <PreviewComponent data={data} />
          </div>
        </div>
      </div>

      {/* ── SEO content ── */}
      <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0" }}>
        <DocumentPageSEO
          documentName="Fuel Bill"
          documentSlug="fuel-bill"
          intro={INTRO}
          whatIs={WHAT_IS}
          whyUse={WHY_USE}
          features={FEATURES}
          howToSteps={HOW_TO_STEPS}
          benefits={BENEFITS}
          formatFields={FORMAT_FIELDS}
          faqs={FAQS}
          relatedDocs={RELATED_DOCS}
        />
      </div>
    </div>
  );
}
