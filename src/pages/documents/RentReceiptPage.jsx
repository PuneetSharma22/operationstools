import { supabase } from "../../supabase-public";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import RentReceiptForm from "../../components/rent/RentReceiptForm";
import TemplateRentReceipt1 from "../../components/rent/TemplateRentReceipt1";
import TemplateRentReceipt2 from "../../components/rent/TemplateRentReceipt2";
import TemplateRentReceipt3 from "../../components/rent/TemplateRentReceipt3";
import TemplateRentReceipt4 from "../../components/rent/TemplateRentReceipt4";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";

const today = new Date();
const thisMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

const TEMPLATES = [
  { id: "1", label: "Certificate", desc: "Formal paragraph-style receipt" },
  { id: "2", label: "Duplicate Book", desc: "Main receipt + tear-off acknowledgement" },
  { id: "3", label: "Minimal", desc: "Clean modern card layout" },
  { id: "4", label: "Formal Table", desc: "Tabular format with terms & signature" },
];

const TEMPLATE_COMPONENTS = {
  "1": TemplateRentReceipt1,
  "2": TemplateRentReceipt2,
  "3": TemplateRentReceipt3,
  "4": TemplateRentReceipt4,
};

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

// ─── Bulk CSV ─────────────────────────────────────────────────────────────────
// Same required/optional philosophy as the Fuel Bill bulk flow: only the
// facts that can't be sensibly defaulted are required. Property/landlord
// details default to the main form's current values (one landlord/property
// per batch is the common case); genuinely per-receipt fields (tenant name,
// receipt no, period, amount) default to blank or auto-generated instead.
const CSV_REQUIRED_COLUMNS = ["receipt_date", "rent_amount"];
const CSV_COLUMN_ORDER = [
  "receipt_date", "receipt_no", "period_from", "period_to",
  "tenant_name", "rent_amount", "payment_method", "payment_ref",
  "property_address", "landlord_name", "landlord_pan",
];
const CSV_OPTIONAL_COLUMNS = CSV_COLUMN_ORDER.filter((c) => !CSV_REQUIRED_COLUMNS.includes(c));
const CSV_TEMPLATE_HEADERS = CSV_COLUMN_ORDER.join(",");
const CSV_MANDATORY_ROW = CSV_COLUMN_ORDER.map((c) => (CSV_REQUIRED_COLUMNS.includes(c) ? "Mandatory" : "Optional")).join(",");
const CSV_SAMPLE_ROW = "2026-07-01,001,2026-07,2026-07,Rajesh Sharma,15000,Cash,,\"Flat 4B, Sunrise Apartments, Andheri West, Mumbai\",Ramesh Kumar,ABCDE1234F";

// Parses raw CSV text into rows of fields, respecting RFC4180-style quoting
// (quoted fields can contain commas or literal line breaks without ending
// the row) — splitting on "\n" before understanding quotes breaks the
// moment any field (e.g. a multi-line address) spans more than one line.
function parseCSVText(text) {
  const normalized = text.replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];
    if (inQuotes) {
      if (ch === '"') {
        if (normalized[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else field += ch;
    } else if (ch === '"') inQuotes = true;
    else if (ch === ",") { row.push(field); field = ""; }
    else if (ch === "\n") { row.push(field); rows.push(row); row = []; field = ""; }
    else field += ch;
  }
  if (field.length > 0 || row.length > 0) { row.push(field); rows.push(row); }
  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ""));
}

// Resolves one optional CSV cell: blank -> the default; literal "NA"
// (case-insensitive) -> explicitly blank, skipping the default; anything
// else -> the typed value as-is.
function resolveOptional(raw, fallback) {
  const trimmed = (raw || "").trim();
  if (trimmed.toUpperCase() === "NA") return { value: "", isDefault: false, isNA: true };
  if (trimmed === "") return { value: fallback, isDefault: true, isNA: false };
  return { value: trimmed, isDefault: false, isNA: false };
}

function resolveRow(row, stationData, index) {
  return {
    receiptDate: row.receipt_date,
    rentAmount: parseFloat(row.rent_amount) || 0,
    receiptNo: resolveOptional(row.receipt_no, `REC-${String(index + 1).padStart(4, "0")}`),
    periodFrom: resolveOptional(row.period_from, stationData.periodFrom),
    periodTo: resolveOptional(row.period_to, stationData.periodTo),
    tenantName: resolveOptional(row.tenant_name, ""),
    paymentMethod: resolveOptional(row.payment_method, "Cash"),
    paymentRef: resolveOptional(row.payment_ref, ""),
    propertyAddress: resolveOptional(row.property_address, stationData.propertyAddress),
    landlordName: resolveOptional(row.landlord_name, stationData.landlordName),
    landlordPan: resolveOptional(row.landlord_pan, stationData.landlordPan),
  };
}

// Post-processes a captured canvas to look like a real scanned/printed
// receipt: pulls dark pixels toward gray + warm tint, adds blotchy grain
// (coarser blocks so it survives JPEG compression rather than being
// smoothed away by quantization), darkens/smudges each corner, a slight
// blur for scan softness, and a visible random tilt onto a padded canvas.
function applyRealisticScanLook(sourceCanvas, paperColor = "#FBFAF6") {
  const w = sourceCanvas.width, h = sourceCanvas.height;
  const ctx = sourceCanvas.getContext("2d");
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  const fadeAmount = 0.22;
  const warmR = 10, warmG = 3, warmB = -14;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = Math.min(255, Math.max(0, d[i] + (205 - d[i]) * fadeAmount + warmR));
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + (205 - d[i + 1]) * fadeAmount + warmG));
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + (205 - d[i + 2]) * fadeAmount + warmB));
  }
  ctx.putImageData(imageData, 0, 0);

  const blockSize = 3;
  for (let y = 0; y < h; y += blockSize) {
    for (let x = 0; x < w; x += blockSize) {
      const v = Math.random() * 44 - 22;
      const alpha = Math.min(0.5, Math.abs(v) / 60);
      ctx.fillStyle = v > 0 ? `rgba(0,0,0,${alpha})` : `rgba(255,255,255,${alpha})`;
      ctx.fillRect(x, y, blockSize, blockSize);
    }
  }

  const cornerR = Math.min(w, h) * 0.28;
  [[0, 0], [w, 0], [0, h], [w, h]].forEach(([cx, cy]) => {
    const r = cornerR * (0.75 + Math.random() * 0.4);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, `rgba(55,42,28,${0.38 + Math.random() * 0.15})`);
    grad.addColorStop(0.6, "rgba(55,42,28,0.15)");
    grad.addColorStop(1, "rgba(55,42,28,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  });

  const blurred = document.createElement("canvas");
  blurred.width = w;
  blurred.height = h;
  const bctx = blurred.getContext("2d");
  try { bctx.filter = "blur(0.7px)"; } catch (_) {}
  bctx.drawImage(sourceCanvas, 0, 0);

  const angle = (Math.random() * 5 - 2.5) * (Math.PI / 180);
  const pad = Math.ceil(Math.max(w, h) * 0.04) + 14;
  const outCanvas = document.createElement("canvas");
  outCanvas.width = w + pad * 2;
  outCanvas.height = h + pad * 2;
  const outCtx = outCanvas.getContext("2d");
  outCtx.fillStyle = paperColor;
  outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);
  outCtx.translate(outCanvas.width / 2, outCanvas.height / 2);
  outCtx.rotate(angle);
  outCtx.drawImage(blurred, -w / 2, -h / 2);
  return outCanvas;
}

// ─── SEO ─────────────────────────────────────────────────────────────────────
const SEO_TITLE = "Free Rent Receipt Generator Online — HRA Claim PDF (2026)";
const SEO_DESCRIPTION = "Generate a rent receipt online for free. Create HRA-compliant rent receipts with landlord PAN, tenant name, property address and payment details. No login. Instant PDF. India-compliant.";
const CANONICAL = "https://www.opstools.ai/documents/rent-receipt";
const softwareAppSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "OpsTools Rent Receipt Generator", operatingSystem: "Web", applicationCategory: "BusinessApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, description: SEO_DESCRIPTION, url: CANONICAL, provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" } };
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "Is this rent receipt generator free?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no login required. Generate unlimited rent receipts at no cost." } }, { "@type": "Question", name: "Is the rent receipt valid for HRA exemption?", acceptedAnswer: { "@type": "Answer", text: "Yes. The receipt includes all fields required for HRA exemption claims — tenant name, landlord name, PAN, property address, rent amount, and period." } }, { "@type": "Question", name: "Is landlord PAN mandatory on rent receipt?", acceptedAnswer: { "@type": "Answer", text: "Landlord PAN is mandatory if annual rent exceeds ₹1 lakh (i.e. monthly rent above ₹8,333). It is always good practice to include it for HRA claims." } }, { "@type": "Question", name: "What is a revenue stamp on rent receipt?", acceptedAnswer: { "@type": "Answer", text: "A revenue stamp of ₹1 is required on rent receipts when the rent amount exceeds ₹5,000 per month and payment is made in cash. For digital/cheque payments, a revenue stamp is not required." } }, { "@type": "Question", name: "Can I download the rent receipt as PDF?", acceptedAnswer: { "@type": "Answer", text: "Yes. Click Save PDF to directly download the receipt as a PDF file — no print dialog needed." } }, { "@type": "Question", name: "How many months of rent receipts do I need for HRA?", acceptedAnswer: { "@type": "Answer", text: "Most employers require month-wise rent receipts for each month you are claiming HRA. Generate one receipt per month with the correct period." } }] };
const INTRO = (<><p style={{ marginBottom: 16 }}>Generating a rent receipt in India used to mean downloading a Word template, formatting it manually, or asking your landlord to write one. OpsTools Rent Receipt Generator makes it instant — pick a template, fill in the details, see the receipt live, and download a PDF in seconds. No login, no subscription.</p><p style={{ marginBottom: 16 }}>The receipt is designed for HRA (House Rent Allowance) exemption claims and includes all fields that Indian employers and the Income Tax department require: tenant name, landlord name and PAN, property address, rent amount in figures and words, payment method, and period.</p><p>Whether you are a salaried employee claiming HRA at year-end or a landlord issuing receipts to tenants, this tool covers you. Your data never leaves your browser.</p></>);
const WHAT_IS = `A rent receipt is a document issued by a landlord acknowledging that rent has been received from a tenant. In India, rent receipts are primarily used by salaried employees to claim House Rent Allowance (HRA) exemption under Section 10(13A) of the Income Tax Act.`;
const WHY_USE = [{ title: "HRA tax exemption", body: "Salaried employees need rent receipts to claim HRA exemption from income tax." }, { title: "Landlords issuing receipts", body: "Issue professional, properly formatted receipts to tenants." }, { title: "Proof of residence", body: "Rent receipts serve as address proof for various KYC purposes." }, { title: "Reimbursement claims", body: "A properly formatted receipt speeds up the HR approval process." }];
const FEATURES = [{ icon: "🧾", title: "4 receipt templates", body: "Certificate, Duplicate Book, Minimal, and Formal Table — pick the style that fits." }, { icon: "🔢", title: "Amount in words", body: "Automatically converts rent amount to words on supported templates." }, { icon: "⬇️", title: "Direct PDF download", body: "One click downloads the receipt as a PDF." }, { icon: "📦", title: "Bulk generation", body: "Upload a CSV to generate many receipts at once." }, { icon: "🔒", title: "100% private", body: "No data is stored or transmitted." }, { icon: "🆓", title: "No login needed", body: "Single receipts are always free." }];
const HOW_TO_STEPS = [{ step: 1, title: "Choose a template", body: "Pick from 4 receipt styles." }, { step: 2, title: "Fill receipt details", body: "Enter the receipt number, date, and rental period." }, { step: 3, title: "Enter rent amount", body: "Type the monthly rent." }, { step: 4, title: "Add property & parties", body: "Enter property address, tenant, and landlord details." }, { step: 5, title: "Preview your receipt", body: "Check the live preview." }, { step: 6, title: "Download PDF", body: "Click Save to download." }];
const BENEFITS = ["4 templates to choose from.", "Bulk generation via CSV upload.", "Amount in words auto-generated.", "Landlord PAN field for Income Tax compliance.", "All data stays in your browser.", "Completely free — no subscription."];
const FORMAT_FIELDS = [{ field: "Receipt No.", description: "Unique serial number for the receipt", example: "001" }, { field: "Date", description: "Date of payment / receipt issue", example: "01 June 2026" }, { field: "Tenant Name", description: "Full name of the person paying rent", example: "Rajesh Sharma" }, { field: "Rent Amount", description: "Monthly rent in figures and words", example: "₹15,000" }, { field: "Property Address", description: "Full address of the rented property", example: "Flat 4B, Sunrise Apartments, Andheri West, Mumbai" }, { field: "Period", description: "Month and year of rent payment", example: "June 2026" }, { field: "Payment Method", description: "How rent was paid", example: "Cash / Cheque / NEFT / UPI" }, { field: "Landlord Name", description: "Full name of the property owner", example: "Ramesh Kumar" }, { field: "Landlord PAN", description: "PAN of landlord (mandatory if annual rent > ₹1 lakh)", example: "ABCDE1234F" }];
const FAQS = faqSchema.mainEntity.map((i) => ({ q: i.name, a: i.acceptedAnswer.text }));
const RELATED_DOCS = [{ name: "Fuel Bill Generator", href: "/documents/fuel-bill", description: "Petrol & diesel receipts for reimbursement." }, { name: "GST Invoice Generator", href: "/documents/gst-invoice", description: "Tax-compliant GST invoices." }, { name: "Salary Slip Generator", href: "/documents/salary-slip", description: "Professional payslips." }];

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ onClose, children, wide }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);
  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(7,1,31,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes slideUp{from{opacity:0;transform:translateY(20px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
      <div style={{ background: "#fff", borderRadius: 20, maxWidth: wide ? 820 : 480, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.25)", animation: "slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)" }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}

function LoginPromptModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ padding: "32px 28px", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, margin: "0 auto 20px", background: "linear-gradient(135deg,#EFF6FF,#EEF2FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>⚡</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: "0 0 10px" }}>Sign in to generate in bulk</h2>
        <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.65, margin: "0 0 28px" }}>Bulk generation uses credits. Create a free account to get started.<br/>Single receipts are always free — no login needed.</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <a href="/login" style={{ flex: 1, height: 44, borderRadius: 10, border: "1.5px solid #E2E8F0", background: "#fff", color: "#0F172A", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Log in</a>
          <a href="/signup" style={{ flex: 1, height: 44, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#2563EB,#4F46E5)", color: "#fff", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Sign up free →</a>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>Continue without account</button>
      </div>
    </Modal>
  );
}

// ─── Save-as dropdown (PDF / PNG) ────────────────────────────────────────────
function SaveMenu({ onSave, downloading, small }) {
  const [open, setOpen] = useState(false);
  const wrapRef = useRef(null);
  useEffect(() => {
    const onClickOutside = (e) => { if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);
  const choose = (format) => { setOpen(false); onSave(format); };
  return (
    <div ref={wrapRef} className="no-print" style={{ position: "relative", display: "inline-block" }}>
      <button onClick={() => setOpen((v) => !v)} disabled={downloading} style={{ background: "linear-gradient(135deg,#2563EB,#4F46E5)", border: "none", borderRadius: 8, padding: small ? "6px 12px" : "8px 16px", color: "#fff", fontSize: small ? 12 : 13, fontWeight: 600, cursor: downloading ? "wait" : "pointer", opacity: downloading ? 0.7 : 1, display: "flex", alignItems: "center", gap: 6 }}>
        <svg width={small ? 12 : 13} height={small ? 12 : 13} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
        {downloading ? "Saving…" : "Save"}
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" style={{ transform: open ? "rotate(180deg)" : "none", transition: "transform 0.15s" }}><polyline points="6 9 12 15 18 9" /></svg>
      </button>
      {open && (
        <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 10, boxShadow: "0 12px 28px rgba(0,0,0,0.14)", overflow: "hidden", zIndex: 30, minWidth: 150 }}>
          <button onClick={() => choose("pdf")} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "#fff", border: "none", borderBottom: "1px solid #F1F5F9", fontSize: 13, color: "#0F172A", cursor: "pointer" }}>Save as PDF</button>
          <button onClick={() => choose("png")} style={{ width: "100%", textAlign: "left", padding: "10px 14px", background: "#fff", border: "none", fontSize: 13, color: "#0F172A", cursor: "pointer" }}>Save as PNG</button>
        </div>
      )}
    </div>
  );
}

// ─── Bulk Generation Modal ────────────────────────────────────────────────────
function BulkGenerateModal({ user, stationData, activeTemplate, onClose }) {
  const [step, setStep] = useState("upload");
  const [csvRows, setCsvRows] = useState([]);
  const [csvErrors, setCsvErrors] = useState([]);
  const [credits, setCredits] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [realisticLook, setRealisticLook] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    supabase.from("user_credits").select("balance").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setCredits(data?.balance ?? 0));
  }, [user.id]);

  const parseCSV = (text) => {
    const allRows = parseCSVText(text);
    if (allRows.length < 2) return { rows: [], errors: ["CSV must have a header row and at least one data row"] };
    const headers = allRows[0].map((h) => h.trim().toLowerCase());
    const missing = CSV_REQUIRED_COLUMNS.filter(r => !headers.includes(r));
    if (missing.length) return { rows: [], errors: [`Missing required columns: ${missing.join(", ")}`] };

    const rows = [];
    const errors = [];
    allRows.slice(1).forEach((vals, i) => {
      const row = {};
      headers.forEach((h, j) => row[h] = (vals[j] || "").trim());
      const rowErrors = [];
      if (!row.receipt_date) rowErrors.push("receipt_date required");
      if (!row.rent_amount || isNaN(Number(row.rent_amount))) rowErrors.push("rent_amount must be a number");
      rows.push({ ...row, _line: i + 2, _errors: rowErrors });
      if (rowErrors.length) errors.push(`Row ${i + 2}: ${rowErrors.join(", ")}`);
    });
    return { rows, errors };
  };

  const handleFile = (file) => {
    if (!file || !file.name.endsWith(".csv")) { setCsvErrors(["Please upload a .csv file"]); return; }
    const reader = new FileReader();
    reader.onload = (e) => {
      const { rows, errors } = parseCSV(e.target.result);
      setCsvRows(rows);
      setCsvErrors(errors);
      if (rows.length > 0) setStep("preview");
    };
    reader.readAsText(file);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); };

  const downloadTemplate = () => {
    const content = [CSV_TEMPLATE_HEADERS, CSV_MANDATORY_ROW, CSV_SAMPLE_ROW].join("\n");
    const blob = new Blob([content], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "rent-receipt-bulk-template.csv"; a.click();
  };

  const validRows = csvRows.filter(r => r._errors.length === 0);
  const hasEnoughCredits = credits !== null && credits >= validRows.length;

  const handleGenerate = async () => {
    if (!hasEnoughCredits || generating) return;
    setGenerating(true);
    setStep("generating");

    try {
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const PreviewComp = TEMPLATE_COMPONENTS[activeTemplate];

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      const container = document.createElement("div");
      container.style.cssText = "position:fixed;left:-9999px;top:0;width:400px;background:#FBFAF6;";
      document.body.appendChild(container);

      const generatedReceipts = [];

      for (let i = 0; i < validRows.length; i++) {
        setProgress(Math.round((i / validRows.length) * 100));
        const row = validRows[i];
        const resolved = resolveRow(row, stationData, i);
        const billData = {
          ...stationData,
          receiptDate: resolved.receiptDate || stationData.receiptDate,
          rentAmount: resolved.rentAmount || "",
          receiptNo: resolved.receiptNo.value,
          periodFrom: resolved.periodFrom.value,
          periodTo: resolved.periodTo.value,
          tenantName: resolved.tenantName.value,
          paymentMethod: resolved.paymentMethod.value,
          paymentRef: resolved.paymentRef.value,
          propertyAddress: resolved.propertyAddress.value,
          landlordName: resolved.landlordName.value,
          landlordPan: resolved.landlordPan.value,
        };
        const printId = `BULK-${Date.now()}-${i}`;
        generatedReceipts.push({ printId, billData });

        const { createRoot } = await import("react-dom/client");
        const wrapper = document.createElement("div");
        wrapper.style.display = "inline-block";
        container.appendChild(wrapper);
        const root = createRoot(wrapper);

        await new Promise(resolve => {
          root.render(<PreviewComp data={billData} />);
          setTimeout(resolve, 300);
        });
        if (document.fonts && document.fonts.ready) {
          try { await document.fonts.ready; } catch (_) {}
        }

        const rawCanvas = await html2canvas(wrapper, { scale: 2, useCORS: true, backgroundColor: "#FBFAF6", logging: false });
        const canvas = realisticLook ? applyRealisticScanLook(rawCanvas, "#FBFAF6") : rawCanvas;
        const pxToMm = 25.4 / (96 * 2);
        const naturalW = canvas.width * pxToMm;
        const naturalH = canvas.height * pxToMm;
        const maxW = pageW - 20;
        const maxH = pageH / 2 - 10;
        const fitScale = Math.min(maxW / naturalW, maxH / naturalH);
        const finalW = naturalW * fitScale;
        const finalH = naturalH * fitScale;
        const x = (pageW - finalW) / 2;

        if (i > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", x, 10, finalW, finalH);

        root.unmount();
        container.removeChild(wrapper);
      }

      document.body.removeChild(container);

      await supabase.from("user_credits").update({
        balance: credits - validRows.length,
        updated_at: new Date().toISOString(),
      }).eq("user_id", user.id);

      await supabase.from("credit_transactions").insert({
        user_id: user.id,
        type: "bulk_generation",
        amount: -validRows.length,
        description: `Bulk rent receipt generation — ${validRows.length} receipts`,
      });

      const saveInserts = generatedReceipts.map(({ printId, billData }) => ({
        template: `bulk-${activeTemplate}`,
        print_id: printId,
        user_id: user.id,
        bill_data: billData,
      }));
      await supabase.from("save_requests").insert(saveInserts);

      setProgress(100);
      pdf.save(`rent-receipts-bulk-${Date.now()}.pdf`);
      setStep("done");
    } catch (err) {
      console.error("Bulk generation failed:", err);
      const isTainted = /tainted|cross-origin|SecurityError/i.test(err?.message || err?.name || "");
      alert(isTainted
        ? "Generation failed: one of the logo/image URLs doesn't allow cross-origin access, which blocks export."
        : "Generation failed: " + (err?.message || "Unknown error"));
      setStep("preview");
    }
    setGenerating(false);
  };

  return (
    <Modal onClose={onClose} wide>
      <div style={{ padding: "28px 32px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Bulk Generation</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: 0 }}>Generate Multiple Rent Receipts</h2>
          </div>
          <button onClick={onClose} style={{ background: "#F1F5F9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#64748B", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        <div style={{ background: credits !== null && credits > 0 ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${credits !== null && credits > 0 ? "#BBF7D0" : "#FCA5A5"}`, borderRadius: 10, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "#374151" }}>Your credit balance</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: credits !== null && credits > 0 ? "#059669" : "#DC2626" }}>
            {credits === null ? "Loading..." : `${credits} credits`}
          </span>
        </div>

        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {["upload", "preview", "generating", "done"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: step === s ? "#2563EB" : ["preview","generating","done"].indexOf(step) > ["upload","preview","generating","done"].indexOf(s) ? "#D1FAE5" : "#F1F5F9", color: step === s ? "#fff" : "#64748B" }}>{i + 1}</div>
              <span style={{ fontSize: 12, color: step === s ? "#2563EB" : "#94A3B8", fontWeight: step === s ? 700 : 400, textTransform: "capitalize" }}>{s === "generating" ? "Generating" : s}</span>
              {i < 3 && <div style={{ width: 20, height: 1, background: "#E2E8F0" }} />}
            </div>
          ))}
        </div>

        {step === "upload" && (
          <div>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ border: `2px dashed ${dragOver ? "#2563EB" : "#E2E8F0"}`, borderRadius: 16, padding: "40px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? "#EFF6FF" : "#FAFAFA", transition: "all 0.15s", marginBottom: 16 }}
            >
              <div style={{ fontSize: 32, marginBottom: 12 }}>📂</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>Drop your CSV here or click to browse</div>
              <div style={{ fontSize: 13, color: "#64748B" }}>Only .csv files accepted</div>
              <input ref={fileInputRef} type="file" accept=".csv" style={{ display: "none" }} onChange={(e) => handleFile(e.target.files[0])} />
            </div>

            {csvErrors.length > 0 && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "12px 16px", marginBottom: 16 }}>
                {csvErrors.map((e, i) => <div key={i} style={{ fontSize: 13, color: "#DC2626" }}>⚠ {e}</div>)}
              </div>
            )}

            <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "16px 20px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>CSV Format</div>
              <div style={{ fontSize: 12, color: "#64748B", marginBottom: 10, lineHeight: 1.6 }}>
                Required columns: <code style={{ background: "#EFF6FF", padding: "1px 6px", borderRadius: 4, color: "#2563EB" }}>receipt_date, rent_amount</code><br/>
                Optional: <code style={{ background: "#F1F5F9", padding: "1px 6px", borderRadius: 4 }}>{CSV_OPTIONAL_COLUMNS.join(", ")}</code><br/>
                <span style={{ display: "inline-block", marginTop: 6 }}>Blank property/landlord fields default to the main form's current value — leave them blank for a normal same-landlord batch. Type <code style={{ background: "#FEF9C3", padding: "1px 6px", borderRadius: 4 }}>NA</code> to force a field blank instead of defaulting.</span>
              </div>
              <button onClick={downloadTemplate} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "#fff", border: "1.5px solid #2563EB", color: "#2563EB", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                ⬇ Download CSV Template
              </button>
            </div>
          </div>
        )}

        {step === "preview" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                {validRows.length} valid rows
                {csvRows.length - validRows.length > 0 && <span style={{ color: "#DC2626", marginLeft: 8 }}>· {csvRows.length - validRows.length} with errors</span>}
              </div>
              <button onClick={() => { setStep("upload"); setCsvRows([]); setCsvErrors([]); }} style={{ fontSize: 12, color: "#64748B", background: "none", border: "none", cursor: "pointer" }}>← Upload different file</button>
            </div>

            <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead style={{ background: "#F8FAFC", position: "sticky", top: 0 }}>
                  <tr>{["#", "Date", "Tenant", "Rent ₹", "Period From", "Status"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #E2E8F0" }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {(() => {
                    let validIndex = -1;
                    return csvRows.map((row, i) => {
                      if (row._errors.length === 0) validIndex += 1;
                      const resolved = resolveRow(row, stationData, validIndex);
                      const cell = (r) => r.isNA
                        ? <span style={{ color: "#CBD5E1" }} title="Explicitly left blank (NA)">—</span>
                        : r.isDefault
                          ? <span style={{ color: "#94A3B8", fontStyle: "italic" }} title="Not entered — using default">{r.value || "—"}</span>
                          : <span>{r.value}</span>;
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid #F1F5F9", background: row._errors.length ? "#FEF2F2" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                          <td style={{ padding: "8px 12px", color: "#94A3B8" }}>{row._line}</td>
                          <td style={{ padding: "8px 12px" }}>{row.receipt_date}</td>
                          <td style={{ padding: "8px 12px", fontWeight: 600 }}>{cell(resolved.tenantName)}</td>
                          <td style={{ padding: "8px 12px", fontWeight: 700 }}>₹{row.rent_amount}</td>
                          <td style={{ padding: "8px 12px" }}>{cell(resolved.periodFrom)}</td>
                          <td style={{ padding: "8px 12px" }}>
                            {row._errors.length === 0
                              ? <span style={{ color: "#059669", fontWeight: 600 }}>✓ Valid</span>
                              : <span style={{ color: "#DC2626", fontSize: 11 }}>{row._errors.join(", ")}</span>}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
            <p style={{ fontSize: 11.5, color: "#94A3B8", margin: "-10px 0 16px" }}>
              <span style={{ fontStyle: "italic" }}>Italic</span> = left blank, default value shown · <span style={{ color: "#CBD5E1" }}>—</span> = "NA" entered, left blank on purpose
            </p>

            <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "16px 20px", border: "1px solid #E2E8F0", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>Receipts to generate</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{validRows.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>Credits required</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#2563EB" }}>{validRows.length} credits</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid #E2E8F0" }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>Your balance after</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: hasEnoughCredits ? "#059669" : "#DC2626" }}>
                  {credits !== null ? `${credits - validRows.length} credits` : "—"}
                </span>
              </div>
            </div>

            {!hasEnoughCredits && credits !== null && (
              <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 10, padding: "12px 16px", marginBottom: 16, fontSize: 13, color: "#DC2626" }}>
                Not enough credits. You need {validRows.length} but have {credits}.{" "}
                <a href="/account" style={{ color: "#DC2626", fontWeight: 700 }}>Request more credits →</a>
              </div>
            )}

            <label style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 16px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 10, marginBottom: 16, cursor: "pointer" }}>
              <input type="checkbox" checked={realisticLook} onChange={(e) => setRealisticLook(e.target.checked)} style={{ width: 16, height: 16, accentColor: "#2563EB" }} />
              <span style={{ fontSize: 13, color: "#374151" }}>
                <b>Make it look real</b> — faded print, slight paper grain, and a small scan-like tilt, instead of a crisp digital render
              </span>
            </label>

            <button
              onClick={handleGenerate}
              disabled={!hasEnoughCredits || validRows.length === 0}
              style={{ width: "100%", height: 48, borderRadius: 12, border: "none", cursor: hasEnoughCredits && validRows.length > 0 ? "pointer" : "not-allowed", background: hasEnoughCredits && validRows.length > 0 ? "linear-gradient(135deg,#2563EB,#4F46E5)" : "#F1F5F9", color: hasEnoughCredits && validRows.length > 0 ? "#fff" : "#94A3B8", fontSize: 15, fontWeight: 700 }}
            >
              Generate {validRows.length} Receipts — {validRows.length} Credits
            </button>
          </div>
        )}

        {step === "generating" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚙️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>Generating your receipts…</h3>
            <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 28px" }}>Processing receipt {Math.round((progress / 100) * validRows.length)} of {validRows.length}</p>
            <div style={{ background: "#F1F5F9", borderRadius: 999, height: 8, overflow: "hidden", maxWidth: 320, margin: "0 auto" }}>
              <div style={{ background: "linear-gradient(135deg,#2563EB,#4F46E5)", height: "100%", width: `${progress}%`, borderRadius: 999, transition: "width 0.3s" }} />
            </div>
            <div style={{ fontSize: 13, color: "#64748B", marginTop: 12 }}>{progress}% complete</div>
          </div>
        )}

        {step === "done" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: "0 0 8px" }}>All receipts generated!</h3>
            <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 8px" }}>{validRows.length} rent receipts saved as a single PDF.</p>
            <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 28px" }}>Remaining credits: {credits - validRows.length}</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={onClose} style={{ padding: "12px 28px", borderRadius: 10, background: "linear-gradient(135deg,#2563EB,#4F46E5)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>Done</button>
              <button onClick={() => { setStep("upload"); setCsvRows([]); setCsvErrors([]); setProgress(0); }} style={{ padding: "12px 28px", borderRadius: 10, background: "#F8FAFC", color: "#374151", fontSize: 14, fontWeight: 600, border: "1px solid #E2E8F0", cursor: "pointer" }}>Generate another batch</button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function RentReceiptPage() {
  const [data, setData] = useState(defaultData);
  const [activeTemplate, setActiveTemplate] = useState("1");
  const [modal, setModal] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: name === "landlordPan" ? value.toUpperCase() : value }));
  };

  const PreviewComponent = TEMPLATE_COMPONENTS[activeTemplate];

  // Renders a fresh, unscaled, off-screen copy of the current receipt
  // specifically for capture, instead of capturing the on-screen preview
  // directly (which is wrapped in a CSS scale() transform purely for
  // layout fit — capturing through that transform reliably produces
  // export artifacts, learned the hard way on the Fuel Bill page).
  const doDownload = async (format = "pdf") => {
    if (downloading) return;
    setDownloading(true);
    const { default: html2canvas } = await import("html2canvas");
    const { createRoot } = await import("react-dom/client");
    const container = document.createElement("div");
    container.style.cssText = "position:fixed;left:-9999px;top:0;background:#FBFAF6;display:inline-block;";
    document.body.appendChild(container);
    const root = createRoot(container);
    try {
      const printId = `RENT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from("save_requests").insert({ template: activeTemplate, print_id: printId, user_id: user?.id ?? null, bill_data: data });
      } catch (_) {}

      await new Promise((resolve) => {
        root.render(<PreviewComponent data={data} />);
        setTimeout(resolve, 300);
      });
      if (document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch (_) {}
      }

      const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: "#FBFAF6", logging: false });

      if (format === "png") {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `rent-receipt-${data.periodFrom || Date.now()}.png`;
        link.click();
      } else {
        const { default: jsPDF } = await import("jspdf");
        const imgData = canvas.toDataURL("image/jpeg", 0.92);
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageW = pdf.internal.pageSize.getWidth();
        const pageH = pdf.internal.pageSize.getHeight();
        const pxToMm = 25.4 / (96 * 2);
        const naturalW = canvas.width * pxToMm;
        const naturalH = canvas.height * pxToMm;
        const maxW = pageW - 20;
        const maxH = pageH / 2 - 10;
        const fitScale = Math.min(maxW / naturalW, maxH / naturalH);
        const finalW = naturalW * fitScale;
        const finalH = naturalH * fitScale;
        pdf.addImage(imgData, "JPEG", (pageW - finalW) / 2, 10, finalW, finalH);
        pdf.save(`rent-receipt-${data.periodFrom || Date.now()}.pdf`);
      }
    } catch (err) {
      const isTainted = /tainted|cross-origin|SecurityError/i.test(err?.message || err?.name || "");
      alert(isTainted
        ? "Save failed: the revenue stamp image doesn't allow cross-origin access, which blocks export."
        : "Save failed: " + (err?.message || "Unknown error"));
    } finally {
      root.unmount();
      document.body.removeChild(container);
      setDownloading(false);
    }
  };

  const handleBulkClick = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (!user) { setModal("login"); }
      else { setModalUser(user); setModal("bulk"); }
    } catch (err) {
      setModal("login");
    }
  };

  useSEO({
    title: SEO_TITLE, description: SEO_DESCRIPTION, canonical: CANONICAL,
    breadcrumbs: [{ name: "Home", url: "https://www.opstools.ai" }, { name: "Documents", url: "https://www.opstools.ai/documents" }, { name: "Rent Receipt Generator", url: CANONICAL }],
    schemas: [softwareAppSchema, faqSchema],
  });

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <style>{`
        @media(max-width:768px){.fuel-tool-padding{padding-left:16px!important;padding-right:16px!important;}.fuel-hero-padding{padding:28px 16px 24px!important;}.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}
        .tool-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media(min-width:1160px){ .tool-grid { grid-template-columns: 1fr 580px; gap: 28px; } }
      `}</style>

      {modal === "login" && <LoginPromptModal onClose={() => setModal(null)} />}
      {modal === "bulk" && modalUser && <BulkGenerateModal user={modalUser} stationData={data} activeTemplate={activeTemplate} onClose={() => setModal(null)} />}

      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0D0630 60%,#1e1b4b 100%)" }} className="fuel-hero-padding">
        <div style={{ padding: "40px 24px 36px", maxWidth: 1280, margin: "0 auto" }} className="fuel-hero-padding">
          <nav style={{ marginBottom: 16, fontSize: 13, color: "#475569" }}>
            <a href="/" style={{ color: "#475569", textDecoration: "none" }}>Home</a><span style={{ margin: "0 8px" }}>›</span>
            <a href="/documents" style={{ color: "#475569", textDecoration: "none" }}>Documents</a><span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Rent Receipt Generator</span>
          </nav>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 8px", letterSpacing: "-0.02em" }}>Free Rent Receipt Generator</h1>
              <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>Choose a template, fill details — receipt updates live.</p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }} className="no-print">
              <button onClick={handleBulkClick} style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.18)", padding: "10px 18px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7, backdropFilter: "blur(8px)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
                Generate in Bulk
              </button>
            </div>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }} className="fuel-tool-padding no-print">
        <div className="tool-grid">
          <div className="no-print">
            <RentReceiptForm data={data} onChange={handleChange} />
          </div>

          <div style={{ position: "sticky", top: 96 }}>
            <div className="no-print" style={{ marginBottom: 20 }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748B", marginBottom: 10 }}>Choose Template</p>
              <div style={{ display: "flex", gap: 8 }}>
                {TEMPLATES.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveTemplate(t.id)}
                    title={t.label}
                    style={{
                      width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                      border: activeTemplate === t.id ? "2px solid #2563EB" : "2px solid #E2E8F0",
                      background: activeTemplate === t.id ? "#2563EB" : "#fff",
                      color: activeTemplate === t.id ? "#fff" : "#0F172A",
                      boxShadow: activeTemplate === t.id ? "0 2px 8px rgba(37,99,235,0.35)" : "none",
                      fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.15s",
                    }}
                  >
                    {i + 1}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: 13, marginTop: 10, marginBottom: 0 }}>
                <span style={{ fontWeight: 700, color: "#0F172A" }}>{TEMPLATES.find(t => t.id === activeTemplate)?.label}</span>
                <span style={{ color: "#94A3B8" }}> — {TEMPLATES.find(t => t.id === activeTemplate)?.desc}</span>
              </p>
            </div>

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }} className="no-print">
                <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748B", margin: 0 }}>Live Preview</p>
                <SaveMenu onSave={doDownload} downloading={downloading} small />
              </div>
              <div style={{ maxWidth: "100%", overflowX: "auto" }}>
                <PreviewComponent data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0" }}>
        <div className="seo-section" style={{ maxWidth: "80%", margin: "0 auto", width: "80%" }}>
          <DocumentPageSEO documentName="Rent Receipt" documentSlug="rent-receipt" intro={INTRO} whatIs={WHAT_IS} whyUse={WHY_USE} features={FEATURES} howToSteps={HOW_TO_STEPS} benefits={BENEFITS} formatFields={FORMAT_FIELDS} faqs={FAQS} relatedDocs={RELATED_DOCS} />
        </div>
      </div>
    </div>
  );
}
