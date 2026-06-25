import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { supabase } from '../../supabase.js';
import { useState, useRef, useEffect } from "react";
import BillForm from "../../components/fuel/BillForm";
import TemplatePOS from "../../components/fuel/TemplatePOS";
import TemplateIOCL from "../../components/fuel/TemplateIOCL";
import TemplateThermalFull from "../../components/fuel/TemplateThermalFull";
import TemplateThermalCompact from "../../components/fuel/TemplateThermalCompact";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";

// ─── Template config ──────────────────────────────────────────────────────────

const TEMPLATES = [
  { id: "thermal-full",    label: "Thermal Full",    desc: "Dot-matrix with all fields" },
  { id: "pos",             label: "Classic POS",     desc: "Monospace receipt style" },
  { id: "iocl",            label: "IOCL Formal",     desc: "Logo + dashed separators" },
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
  logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Indian_Oil_Logo.svg/500px-Indian_Oil_Logo.svg.png",
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
  atot: "",
  vtot: "",
};

const TEMPLATE_COMPONENTS = {
  pos: TemplatePOS,
  iocl: TemplateIOCL,
  "thermal-full": TemplateThermalFull,
  "thermal-compact": TemplateThermalCompact,
};

// ─── SEO ──────────────────────────────────────────────────────────────────────

const SEO_TITLE = "Free Fuel Bill Generator Online — Petrol & Diesel Bill PDF (2026)";
const SEO_DESCRIPTION = "Generate a fuel bill online for free. Create IOCL, POS & thermal receipt formats for petrol & diesel reimbursement. No login. Instant PDF. India-compliant.";
const CANONICAL = "https://www.opstools.ai/documents/fuel-bill";

const softwareAppSchema = {
  "@context": "https://schema.org", "@type": "SoftwareApplication",
  name: "OpsTools Fuel Bill Generator", operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  description: SEO_DESCRIPTION, url: CANONICAL,
  provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" },
};

const faqSchema = {
  "@context": "https://schema.org", "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is this fuel bill generator free to use?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no login required." } },
    { "@type": "Question", name: "Can I use this fuel bill for office reimbursement?", acceptedAnswer: { "@type": "Answer", text: "Yes. All fields required for reimbursement claims are included." } },
    { "@type": "Question", name: "Does this generate a PDF?", acceptedAnswer: { "@type": "Answer", text: "Yes. Click Save PDF to directly download the receipt as a PDF file." } },
  ],
};

const INTRO = (<>
  <p style={{ marginBottom: 16 }}>Need a fuel bill for office reimbursement? Generating one used to mean hunting for Word templates, wrestling with formatting, or waiting for your accounts team. OpsTools Fuel Bill Generator changes that. Fill in your details, pick a template, and have a print-ready petrol or diesel receipt in under a minute — no login, no subscription, no hassle.</p>
  <p style={{ marginBottom: 16 }}>The generator supports four formats based on actual Indian petrol station receipts: the formal IOCL layout used by Indian Oil outlets, the Classic POS format common at private stations, and two thermal dot-matrix formats (full and compact) used at smaller pumps across the country.</p>
  <p>Every field that appears on a real petrol pump receipt is available. The preview updates live as you type. When you are ready, click Save PDF to download your receipt directly. Your data never leaves your device.</p>
</>);

const WHAT_IS = `A fuel bill is the receipt issued by a petrol station when you purchase fuel. It serves as proof of purchase and is commonly used in India for employee travel reimbursement claims, business expense records, and tax documentation.`;

const WHY_USE = [
  { title: "Reimbursement claims", body: "Most Indian employers require a fuel receipt for travel or conveyance reimbursement." },
  { title: "Petrol station operators", body: "Run a small pump without a POS system? Generate receipts manually using the thermal formats." },
  { title: "Vehicle fleet management", body: "Track fuel spend across multiple vehicles with consistent, structured receipts." },
  { title: "Business expense records", body: "Self-employed professionals can maintain clean fuel expense records." },
  { title: "Quick replacement for lost receipts", body: "Misplaced your petrol pump receipt? Generate a replacement before your reimbursement deadline." },
];

const FEATURES = [
  { icon: "🧾", title: "4 Indian receipt templates", body: "IOCL Formal, Classic POS, Thermal Full, and Thermal Compact — all modelled on real Indian pump receipts." },
  { icon: "👁️", title: "Live preview", body: "See your bill update in real time as you fill the form." },
  { icon: "⬇️", title: "Direct PDF download", body: "One click downloads the receipt as a PDF — no print dialog needed." },
  { icon: "🏷️", title: "Custom logo", body: "Paste any image URL to add your station's logo to the bill." },
  { icon: "📱", title: "Mobile-friendly", body: "Works on iPhone, Android, and any tablet." },
  { icon: "🔒", title: "100% private", body: "No data is stored or transmitted. Everything happens in your browser." },
  { icon: "🆓", title: "No login needed", body: "No account, no email, no credit card." },
  { icon: "✏️", title: "Fully editable fields", body: "Every field on the receipt is customisable." },
];

const HOW_TO_STEPS = [
  { step: 1, title: "Choose a template", body: "Select from Thermal Full, Classic POS, IOCL Formal, or Thermal Compact." },
  { step: 2, title: "Fill in station details", body: "Enter the petrol station name, address, and branding details." },
  { step: 3, title: "Enter transaction details", body: "Add date, time, fuel type, quantity, rate per litre." },
  { step: 4, title: "Add vehicle info", body: "Enter vehicle registration number and attendant details." },
  { step: 5, title: "Preview your bill", body: "Check the live preview. Every field updates instantly." },
  { step: 6, title: "Download PDF", body: "Click Save PDF to download the receipt directly to your device." },
];

const BENEFITS = [
  "Generate unlimited fuel bills — no caps or credit limits.",
  "No registration or sign-up required.",
  "Direct PDF download — no print dialog.",
  "Four templates match actual Indian petrol station formats.",
  "All data stays in your browser — zero privacy risk.",
  "Completely free — no subscription.",
];

const FORMAT_FIELDS = [
  { field: "Station Name", description: "Name of the petrol pump", example: "Indian Oil — Sharma Fuels" },
  { field: "Station Address", description: "Full address of the petrol station", example: "Plot 12, MG Road, Pune 411001" },
  { field: "Date & Time", description: "Date and time of the transaction", example: "20/06/2026 — 14:35" },
  { field: "Fuel Type", description: "Type of fuel dispensed", example: "Petrol / Diesel / CNG" },
  { field: "Quantity", description: "Volume dispensed in litres", example: "5.00 L" },
  { field: "Rate per Litre", description: "Price per litre at time of transaction", example: "₹103.44" },
  { field: "Total Amount", description: "Total value of the transaction", example: "₹517.20" },
  { field: "Vehicle Number", description: "Registration number of the vehicle", example: "MH 12 AB 1234" },
];

const FAQS = faqSchema.mainEntity.map((i) => ({ q: i.name, a: i.acceptedAnswer.text }));

const RELATED_DOCS = [
  { name: "Rent Receipt Generator", href: "/documents/rent-receipt", description: "HRA-compliant rent receipts." },
  { name: "GST Invoice Generator", href: "/documents/gst-invoice", description: "Tax-compliant GST invoices." },
  { name: "Salary Slip Generator", href: "/documents/salary-slip", description: "Professional payslips." },
];

// ─── Modal backdrop + container ───────────────────────────────────────────────

function Modal({ onClose, children }) {
  // Trap escape key
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Prevent body scroll
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  return (
    <div
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(7,1,31,0.55)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: 16,
        animation: "fadeIn 0.18s ease",
      }}
      onClick={onClose}
    >
      <style>{`
        @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.97) } to { opacity: 1; transform: translateY(0) scale(1) } }
      `}</style>
      <div
        style={{
          background: "#fff",
          borderRadius: 20,
          maxWidth: 440,
          width: "100%",
          boxShadow: "0 32px 80px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.06)",
          animation: "slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

// ─── Login prompt ─────────────────────────────────────────────────────────────

function LoginPromptModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ padding: "32px 28px", textAlign: "center" }}>
        <div style={{
          width: 56, height: 56, borderRadius: 16, margin: "0 auto 20px",
          background: "linear-gradient(135deg, #EFF6FF, #EEF2FF)",
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26,
        }}>⚡</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: "0 0 10px", letterSpacing: "-0.02em" }}>
          Sign in to generate in bulk
        </h2>
        <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.65, margin: "0 0 28px" }}>
          Bulk generation uses credits. Create a free account to get started.<br />
          Single bills are always free — no login needed.
        </p>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <a href="/login" style={{
            flex: 1, height: 44, borderRadius: 10, border: "1.5px solid #E2E8F0",
            background: "#fff", color: "#0F172A", fontSize: 14, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none",
          }}>Log in</a>
          <a href="/signup" style={{
            flex: 1, height: 44, borderRadius: 10, border: "none",
            background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
            color: "#fff", fontSize: 14, fontWeight: 600,
            display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none",
          }}>Sign up free →</a>
        </div>
        <button onClick={onClose} style={{
          background: "none", border: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer",
        }}>Continue without account</button>
      </div>
    </Modal>
  );
}

// ─── Credits modal ────────────────────────────────────────────────────────────

function BulkCreditsModal({ user, onClose }) {
  const [credits, setCredits] = useState(100);
  const amount = Math.max(10, Math.ceil(credits / 10));
  const presets = [100, 500, 1000, 5000];

  return (
    <Modal onClose={onClose}>
      <div style={{ padding: "28px 28px 24px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", color: "#64748B", textTransform: "uppercase", margin: "0 0 4px" }}>Bulk Generation</p>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: 0, letterSpacing: "-0.02em" }}>Add Credits</h2>
          </div>
          <button onClick={onClose} style={{
            background: "#F1F5F9", border: "none", borderRadius: 8,
            width: 32, height: 32, cursor: "pointer", color: "#64748B",
            display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, lineHeight: 1,
          }}>×</button>
        </div>

        {/* User */}
        <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "9px 13px", marginBottom: 20, fontSize: 13, color: "#475569" }}>
          Signed in as <strong style={{ color: "#0F172A" }}>{user.email}</strong>
        </div>

        {/* Info pill */}
        <div style={{
          background: "linear-gradient(135deg, #EFF6FF, #EEF2FF)",
          borderRadius: 10, padding: "12px 14px", marginBottom: 20,
          fontSize: 13, color: "#374151", lineHeight: 1.6,
        }}>
          <strong style={{ color: "#2563EB" }}>1 credit = 1 bill</strong> · Minimum ₹10 = 100 credits
        </div>

        {/* Presets */}
        <p style={{ fontSize: 11, fontWeight: 700, color: "#64748B", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>Choose credits</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 14 }}>
          {presets.map((p) => (
            <button key={p} onClick={() => setCredits(p)} style={{
              padding: "9px 4px", borderRadius: 10, fontSize: 13, fontWeight: 700, cursor: "pointer",
              border: credits === p ? "2px solid #2563EB" : "2px solid #E2E8F0",
              background: credits === p ? "#EFF6FF" : "#fff",
              color: credits === p ? "#2563EB" : "#0F172A",
              transition: "all 0.15s",
            }}>{p.toLocaleString()}</button>
          ))}
        </div>

        {/* Custom */}
        <div style={{ marginBottom: 20 }}>
          <label style={{ fontSize: 12, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 6 }}>Or enter custom amount</label>
          <input
            type="number" min={100} step={100} value={credits}
            onChange={(e) => setCredits(Math.max(100, parseInt(e.target.value) || 100))}
            style={{
              width: "100%", height: 44, padding: "0 14px", borderRadius: 10,
              border: "1.5px solid #E2E8F0", outline: "none", fontSize: 14,
              color: "#0F172A", boxSizing: "border-box",
            }}
          />
        </div>

        {/* Summary */}
        <div style={{
          background: "#F8FAFC", borderRadius: 10, padding: "13px 16px",
          display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20,
        }}>
          <span style={{ fontSize: 14, color: "#374151" }}>{credits.toLocaleString()} credits</span>
          <span style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>₹{amount}</span>
        </div>

        {/* CTA */}
        <button
          onClick={() => alert(`Integrate Razorpay here — ₹${amount} for ${credits} credits`)}
          style={{
            width: "100%", height: 48, borderRadius: 12, border: "none", cursor: "pointer",
            background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
            color: "#fff", fontSize: 15, fontWeight: 700, letterSpacing: "-0.01em",
          }}
        >Pay ₹{amount} · Get {credits.toLocaleString()} Credits</button>
        <p style={{ textAlign: "center", fontSize: 11, color: "#94A3B8", margin: "10px 0 0" }}>
          Credits added instantly after payment
        </p>
      </div>
    </Modal>
  );
}


// ─── Main page ────────────────────────────────────────────────────────────────

export default function FuelBillPage() {
  const [data, setData] = useState(defaultData);
  const [activeTemplate, setActiveTemplate] = useState("thermal-full");
  const [modal, setModal] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleDownloadPDF = async () => {
    if (!previewRef.current || downloading) return;
    setDownloading(true);
    try {
      const printId = `PRINT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from("print_requests").insert({
          template: activeTemplate, print_id: printId, user_id: user?.id ?? null,
        });
      } catch (_) {}

      // Templates now use pure inline styles — no Tailwind oklch
      const canvas = await html2canvas(previewRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: "#ffffff",
        logging: false,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      // Target receipt width: 90mm (like a real thermal receipt on A4)
      const targetW = 90;
      const pxToMm = 25.4 / (96 * 2); // scale:2
      const naturalW = canvas.width * pxToMm;
      const naturalH = canvas.height * pxToMm;
      const ratio = targetW / naturalW;
      const finalW = targetW;
      const finalH = naturalH * ratio;
      const x = (pageW - finalW) / 2;
      pdf.addImage(imgData, "PNG", x, 10, finalW, finalH);
      pdf.save(`fuel-bill-${Date.now()}.pdf`);
    } catch (err) {
      console.error("PDF failed:", err);
      alert("PDF failed: " + (err?.message || "Unknown error"));
    } finally {
      setDownloading(false);
    }
  };

  const handleBulkClick = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setModal("login"); }
      else { setModalUser(user); setModal("credits"); }
    } catch { setModal("login"); }
  };

  const PreviewComponent = TEMPLATE_COMPONENTS[activeTemplate];

  useSEO({
    title: SEO_TITLE, description: SEO_DESCRIPTION, canonical: CANONICAL,
    breadcrumbs: [
      { name: "Home", url: "https://www.opstools.ai" },
      { name: "Documents", url: "https://www.opstools.ai/documents" },
      { name: "Fuel Bill Generator", url: CANONICAL },
    ],
    schemas: [softwareAppSchema, faqSchema],
  });

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>

      {/* Modals */}
      {modal === "login" && <LoginPromptModal onClose={() => setModal(null)} />}
      {modal === "credits" && modalUser && <BulkCreditsModal user={modalUser} onClose={() => setModal(null)} />}

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #07011F 0%, #0D0630 60%, #1e1b4b 100%)", padding: "40px 24px 36px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <nav style={{ marginBottom: 16, fontSize: 13, color: "#475569" }}>
            <a href="/" style={{ color: "#475569", textDecoration: "none" }}>Home</a>
            <span style={{ margin: "0 8px" }}>›</span>
            <a href="/documents" style={{ color: "#475569", textDecoration: "none" }}>Documents</a>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Fuel Bill Generator</span>
          </nav>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: "clamp(22px,3vw,30px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 8px", letterSpacing: "-0.02em" }}>
                Free Fuel Bill Generator
              </h1>
              <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>
                Choose a template, fill details — receipt updates live.
              </p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }} className="no-print">
              <button onClick={handleBulkClick} style={{
                background: "rgba(255,255,255,0.08)", color: "#fff",
                border: "1.5px solid rgba(255,255,255,0.18)",
                padding: "10px 18px", borderRadius: 10, fontWeight: 600, fontSize: 14,
                cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7,
                backdropFilter: "blur(8px)", transition: "background 0.15s",
              }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
                  <line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/>
                </svg>
                Generate in Bulk
              </button>

            </div>
          </div>
        </div>
      </section>

      {/* Tool */}
      <div className="max-w-[1280px] mx-auto px-6 py-8">

        {/* Template Picker */}
        <div className="no-print mb-8">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-[#64748B] mb-3">Choose Template</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TEMPLATES.map((t) => (
              <button key={t.id} onClick={() => setActiveTemplate(t.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                  activeTemplate === t.id ? "border-[#2563EB] bg-[#EFF6FF]" : "border-[#E2E8F0] bg-white hover:border-[#2563EB]/40"
                }`}>
                <p className={`text-[14px] font-semibold ${activeTemplate === t.id ? "text-[#2563EB]" : "text-[#0F172A]"}`}>{t.label}</p>
                <p className="text-[12px] text-[#64748B] mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Form + Preview */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8 items-start">
          <div className="no-print">
            <BillForm data={data} onChange={handleChange} template={activeTemplate} />
          </div>
          <div className="lg:sticky lg:top-24">
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }} className="no-print mb-3">
              <p className="text-[12px] font-semibold uppercase tracking-widest text-[#64748B]">Live Preview</p>
              <button onClick={handleDownloadPDF} disabled={downloading} className="no-print" style={{
                background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
                border: "none", borderRadius: 8, padding: "5px 12px",
                color: "#fff", fontSize: 12, fontWeight: 600,
                cursor: downloading ? "wait" : "pointer",
                display: "flex", alignItems: "center", gap: 5,
                opacity: downloading ? 0.7 : 1,
              }}>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {downloading ? "Saving…" : "Save PDF"}
              </button>

            </div>
            <div ref={previewRef} style={{ transform: "scale(0.82)", transformOrigin: "top left", width: "122%", marginBottom: "-18%" }}>
              <PreviewComponent data={data} />
            </div>
          </div>
        </div>
      </div>

      {/* SEO content — wider layout */}
      <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0" }}>
        {/* Force 80% width — overrides any inner maxWidth in DocumentPageSEO */}
        <style>{`
          .seo-content-wrap > * { max-width: 100% !important; width: 100% !important; }
          .seo-content-wrap section, .seo-content-wrap div[style] { max-width: 100% !important; }
        `}</style>
        <div className="seo-content-wrap" style={{ maxWidth: "80%", margin: "0 auto", width: "80%" }}>
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
    </div>
  );
}
