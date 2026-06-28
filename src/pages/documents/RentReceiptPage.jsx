import { supabase } from "../../supabase-public";

import { useState, useRef } from "react";
import RentReceiptForm from "../../components/rent/RentReceiptForm";
import TemplateRentReceipt from "../../components/rent/TemplateRentReceipt";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";

const today = new Date();
const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

const defaultData = {
  receiptNo: "001",
  receiptDate: today.toISOString().split("T")[0],
  periodFrom: thisMonth,
  periodTo: thisMonth,
  rentAmount: "",
  paymentMethod: "Cash",
  paymentRef: "",
  propertyAddress: "",
  tenantName: "",
  landlordName: "",
  landlordPan: "",
};

// ─── SEO ──────────────────────────────────────────────────────────────────────

const SEO_TITLE = "Free Rent Receipt Generator Online — HRA Claim PDF (2026)";
const SEO_DESCRIPTION = "Generate a rent receipt online for free. Create HRA-compliant rent receipts with landlord PAN, tenant name, property address and payment details. No login. Instant PDF. India-compliant.";
const CANONICAL = "https://www.opstools.ai/documents/rent-receipt";

const softwareAppSchema = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "OpsTools Rent Receipt Generator", operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  description: SEO_DESCRIPTION, url: CANONICAL,
  provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" },
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is this rent receipt generator free?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no login required. Generate unlimited rent receipts at no cost." } },
    { "@type": "Question", name: "Is the rent receipt valid for HRA exemption?", acceptedAnswer: { "@type": "Answer", text: "Yes. The receipt includes all fields required for HRA exemption claims — tenant name, landlord name, PAN, property address, rent amount, and period." } },
    { "@type": "Question", name: "Is landlord PAN mandatory on rent receipt?", acceptedAnswer: { "@type": "Answer", text: "Landlord PAN is mandatory if annual rent exceeds ₹1 lakh (i.e. monthly rent above ₹8,333). It is always good practice to include it for HRA claims." } },
    { "@type": "Question", name: "What is a revenue stamp on rent receipt?", acceptedAnswer: { "@type": "Answer", text: "A revenue stamp of ₹1 is required on rent receipts when the rent amount exceeds ₹5,000 per month and payment is made in cash. For digital/cheque payments, a revenue stamp is not required." } },
    { "@type": "Question", name: "Can I download the rent receipt as PDF?", acceptedAnswer: { "@type": "Answer", text: "Yes. Click Save PDF to directly download the receipt as a PDF file — no print dialog needed." } },
    { "@type": "Question", name: "How many months of rent receipts do I need for HRA?", acceptedAnswer: { "@type": "Answer", text: "Most employers require month-wise rent receipts for each month you are claiming HRA. Generate one receipt per month with the correct period." } },
  ],
};

const INTRO = (<>
  <p style={{ marginBottom: 16 }}>Generating a rent receipt in India used to mean downloading a Word template, formatting it manually, or asking your landlord to write one. OpsTools Rent Receipt Generator makes it instant — fill in the details, see the receipt live, and download a PDF in seconds. No login, no subscription.</p>
  <p style={{ marginBottom: 16 }}>The receipt is designed for HRA (House Rent Allowance) exemption claims and includes all fields that Indian employers and the Income Tax department require: tenant name, landlord name and PAN, property address, rent amount in figures and words, payment method, and period.</p>
  <p>Whether you are a salaried employee claiming HRA at year-end or a landlord issuing receipts to tenants, this tool covers you. Your data never leaves your browser.</p>
</>);

const WHAT_IS = `A rent receipt is a document issued by a landlord acknowledging that rent has been received from a tenant. In India, rent receipts are primarily used by salaried employees to claim House Rent Allowance (HRA) exemption under Section 10(13A) of the Income Tax Act. A valid rent receipt must include the tenant's name, the landlord's name and PAN (if annual rent exceeds ₹1 lakh), the property address, the rent amount, the period, and the date of payment.`;

const WHY_USE = [
  { title: "HRA tax exemption", body: "Salaried employees need rent receipts to claim HRA exemption from income tax. Submit receipts to your employer's payroll team before the financial year deadline." },
  { title: "Landlords issuing receipts", body: "Issue professional, properly formatted receipts to tenants. Includes PAN field for compliance with Income Tax rules on rental income." },
  { title: "Proof of residence", body: "Rent receipts serve as address proof for various KYC purposes including bank accounts, government IDs, and visa applications." },
  { title: "Reimbursement claims", body: "Some companies reimburse rent as part of CTC. A properly formatted receipt with all required fields speeds up the HR approval process." },
];

const FEATURES = [
  { icon: "🧾", title: "HRA-compliant format", body: "Includes all fields required by Indian employers and the Income Tax department." },
  { icon: "🔢", title: "Amount in words", body: "Automatically converts rent amount to words — required on all valid Indian receipts." },
  { icon: "⬇️", title: "Direct PDF download", body: "One click downloads the receipt as a PDF — no print dialog needed." },
  { icon: "📅", title: "Month-wise generation", body: "Set the period for any month. Generate one receipt per month for full-year HRA claims." },
  { icon: "🔒", title: "100% private", body: "No data is stored or transmitted. Everything stays in your browser." },
  { icon: "🆓", title: "No login needed", body: "No account, no email, no credit card." },
];

const HOW_TO_STEPS = [
  { step: 1, title: "Fill receipt details", body: "Enter the receipt number, date, and the rental period (month and year)." },
  { step: 2, title: "Enter rent amount", body: "Type the monthly rent. The amount in words is generated automatically." },
  { step: 3, title: "Add property address", body: "Enter the full address of the rented property." },
  { step: 4, title: "Enter tenant and landlord details", body: "Add tenant name, landlord name, and landlord PAN." },
  { step: 5, title: "Preview your receipt", body: "Check the live preview. Every field updates instantly." },
  { step: 6, title: "Download PDF", body: "Click Save PDF to download the receipt directly to your device." },
];

const BENEFITS = [
  "Generate month-wise rent receipts for full-year HRA claims.",
  "Amount in words auto-generated — no manual conversion needed.",
  "Landlord PAN field for Income Tax compliance.",
  "Revenue stamp placeholder for cash payments above ₹5,000.",
  "All data stays in your browser — zero privacy risk.",
  "Completely free — no subscription.",
];

const FORMAT_FIELDS = [
  { field: "Receipt No.", description: "Unique serial number for the receipt", example: "001" },
  { field: "Date", description: "Date of payment / receipt issue", example: "01 June 2026" },
  { field: "Tenant Name", description: "Full name of the person paying rent", example: "Rajesh Sharma" },
  { field: "Rent Amount", description: "Monthly rent in figures and words", example: "₹15,000 / Fifteen Thousand Rupees Only" },
  { field: "Property Address", description: "Full address of the rented property", example: "Flat 4B, Sunrise Apartments, Andheri West, Mumbai - 400053" },
  { field: "Period", description: "Month and year of rent payment", example: "June 2026" },
  { field: "Payment Method", description: "How rent was paid", example: "Cash / Cheque / NEFT / UPI" },
  { field: "Landlord Name", description: "Full name of the property owner", example: "Ramesh Kumar" },
  { field: "Landlord PAN", description: "PAN of landlord (mandatory if annual rent > ₹1 lakh)", example: "ABCDE1234F" },
];

const FAQS = faqSchema.mainEntity.map(i => ({ q: i.name, a: i.acceptedAnswer.text }));

const RELATED_DOCS = [
  { name: "Fuel Bill Generator", href: "/documents/fuel-bill", description: "Petrol & diesel receipts for reimbursement." },
  { name: "GST Invoice Generator", href: "/documents/gst-invoice", description: "Tax-compliant GST invoices." },
  { name: "Salary Slip Generator", href: "/documents/salary-slip", description: "Professional payslips with CTC breakup." },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function RentReceiptPage() {
  const [data, setData] = useState(defaultData);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: name === "landlordPan" ? value.toUpperCase() : value }));
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current || downloading) return;
    setDownloading(true);
    const { default: jsPDF } = await import("jspdf");
const { default: html2canvas } = await import("html2canvas");
    try {
      const printId = `RENT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from("print_requests").insert({
          template: "rent-receipt", print_id: printId, user_id: user?.id ?? null,
        });
      } catch (_) {}

      const canvas = await html2canvas(previewRef.current, {
        scale: 2, useCORS: true, allowTaint: true,
        backgroundColor: "#f5f0e8", logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const targetW = 150;
      const pxToMm = 25.4 / (96 * 2);
      const naturalW = canvas.width * pxToMm;
      const naturalH = canvas.height * pxToMm;
      const ratio = targetW / naturalW;
      const finalW = targetW;
      const finalH = naturalH * ratio;
      const x = (pageW - finalW) / 2;
      pdf.addImage(imgData, "PNG", x, 20, finalW, finalH);
      pdf.save(`rent-receipt-${data.periodFrom || Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF failed:", err);
      alert("PDF failed: " + (err?.message || "Unknown error"));
    } finally {
      setDownloading(false);
    }
  };

  useSEO({
    title: SEO_TITLE, description: SEO_DESCRIPTION, canonical: CANONICAL,
    breadcrumbs: [
      { name: "Home", url: "https://www.opstools.ai" },
      { name: "Documents", url: "https://www.opstools.ai/documents" },
      { name: "Rent Receipt Generator", url: CANONICAL },
    ],
    schemas: [softwareAppSchema, faqSchema],
  });

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #07011F 0%, #0D0630 60%, #1e1b4b 100%)", padding: "40px 24px 36px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <nav style={{ marginBottom: 16, fontSize: 13, color: "#475569" }}>
            <a href="/" style={{ color: "#475569", textDecoration: "none" }}>Home</a>
            <span style={{ margin: "0 8px" }}>›</span>
            <a href="/documents" style={{ color: "#475569", textDecoration: "none" }}>Documents</a>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Rent Receipt Generator</span>
          </nav>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                Free Rent Receipt Generator
              </h1>
              <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
                HRA-compliant rent receipts — fill details, download PDF instantly.
              </p>
            </div>
            <button
              onClick={handleDownloadPDF}
              disabled={downloading}
              className="no-print"
              style={{
                background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
                color: "#fff", border: "none", padding: "10px 22px", borderRadius: 10,
                fontWeight: 600, fontSize: 14, cursor: downloading ? "wait" : "pointer",
                display: "inline-flex", alignItems: "center", gap: 8, opacity: downloading ? 0.8 : 1,
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                <polyline points="7 10 12 15 17 10"/>
                <line x1="12" y1="15" x2="12" y2="3"/>
              </svg>
              {downloading ? "Saving…" : "Save PDF"}
            </button>
          </div>
        </div>
      </section>

      {/* Tool */}
      <div className="max-w-[1280px] mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8 items-start">

          {/* Form */}
          <div className="no-print">
            <RentReceiptForm data={data} onChange={handleChange} />
          </div>

          {/* Preview */}
          <div className="lg:sticky lg:top-24">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} className="no-print mb-3">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-[#64748B]">Live Preview</p>
              <button
                onClick={handleDownloadPDF}
                disabled={downloading}
                className="no-print"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
                  border: "none", borderRadius: 8, padding: "5px 12px",
                  color: "#fff", fontSize: 12, fontWeight: 600,
                  cursor: downloading ? "wait" : "pointer",
                  display: "flex", alignItems: "center", gap: 5,
                  opacity: downloading ? 0.7 : 1,
                }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {downloading ? "Saving…" : "Save PDF"}
              </button>
            </div>
            <div ref={previewRef} style={{ transform: "scale(0.78)", transformOrigin: "top left", width: "128%", marginBottom: "-22%" }}>
              <TemplateRentReceipt data={data} />
            </div>
          </div>
        </div>
      </div>

      {/* SEO content */}
      <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0" }}>
        <div style={{ maxWidth: "80%", margin: "0 auto" }}>
          <DocumentPageSEO
            documentName="Rent Receipt"
            documentSlug="rent-receipt"
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
    </div>
  );
}
