import { supabase as supabaseFull } from "../../supabase";
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import BillForm from "../../components/fuel/BillForm";
import TemplatePOS from "../../components/fuel/TemplatePOS";
import TemplateIOCL from "../../components/fuel/TemplateIOCL";
import TemplateThermalFull from "../../components/fuel/TemplateThermalFull";
import TemplateThermalCompact from "../../components/fuel/TemplateThermalCompact";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";

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
  vatTin: "27AABCU9603R1ZX",
  logoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a3/Indian_Oil_Logo.svg/500px-Indian_Oil_Logo.svg.png",
  bankLogoUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/28/HDFC_Bank_Logo.svg/3840px-HDFC_Bank_Logo.svg.png",
  billNumber: "G64695",
  billDate: new Date().toISOString().split("T")[0],
  billTime: new Date().toTimeString().slice(0, 5),
  nozzleNo: "N-02",
  invoiceNo: "927267",
  customerName: "", vehicleNumber: "", vehicleType: "4W", mobileNo: "", attendantId: "",
  fuelType: "Petrol", density: "745.0", amount: "", quantity: "", pricePerLitre: "104.29",
  presetType: "Amount", paymentMode: "Cash",
};

const TEMPLATE_COMPONENTS = {
  pos: TemplatePOS, iocl: TemplateIOCL,
  "thermal-full": TemplateThermalFull, "thermal-compact": TemplateThermalCompact,
};

// Required: date, price_per_litre, amount — these are the only facts that
// can't be sensibly defaulted. Volume/quantity is NOT a column at all — like
// the single-bill form, it's derived from amount ÷ rate rather than typed.
// Everything else is optional: a blank cell gets a sensible default (falling
// back to whatever the main form currently has — including station_name,
// logo_url, etc., so you can leave them blank for a normal same-station batch,
// or fill them in per-row to generate bills for a different station on
// specific rows). The bulk preview table shows exactly what default will be
// used, and typing the literal text "NA" explicitly means "leave this blank"
// and skips the default entirely.
const CSV_REQUIRED_COLUMNS = ["date", "price_per_litre", "amount"];
const CSV_COLUMN_ORDER = [
  "station_name", "station_address", "station_phone", "gst_no", "logo_url", "bank_logo_url",
  "date", "time", "bill_number", "invoice_no",
  "vehicle_number", "vehicle_type", "customer_name", "mobile_no",
  "fuel_type", "price_per_litre", "amount", "density", "preset_type", "payment_mode",
  "nozzle_no", "attendant_id",
];
const CSV_OPTIONAL_COLUMNS = CSV_COLUMN_ORDER.filter((c) => !CSV_REQUIRED_COLUMNS.includes(c));
const CSV_TEMPLATE_HEADERS = CSV_COLUMN_ORDER.join(",");
const CSV_SAMPLE_ROW = "PK FUEL STATION,\"PAREKH NAGAR S V RD, KANDIVALI W, MUMBAI - 400067\",38055913,27AABCU9603R1ZX,https://example.com/logo.png,https://example.com/bank-logo.png,2026-07-10,14:30,G64695,927267,MH12AB1234,4W,Rajesh Sharma,9876543210,Petrol,104.29,992.00,745.0,Amount,Cash,N-02,AT-102";

// ─── SEO ─────────────────────────────────────────────────────────────────────
const SEO_TITLE = "Free Fuel Bill Generator Online — Petrol & Diesel Bill PDF (2026)";
const SEO_DESCRIPTION = "Generate a fuel bill online for free. Create IOCL, POS & thermal receipt formats for petrol & diesel reimbursement. No login. Instant PDF. India-compliant.";
const CANONICAL = "https://www.opstools.ai/documents/fuel-bill";
const softwareAppSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "OpsTools Fuel Bill Generator", operatingSystem: "Web", applicationCategory: "BusinessApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, description: SEO_DESCRIPTION, url: CANONICAL, provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" } };
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [{ "@type": "Question", name: "Is this fuel bill generator free to use?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no login required." } }, { "@type": "Question", name: "Can I use this fuel bill for office reimbursement?", acceptedAnswer: { "@type": "Answer", text: "Yes. All fields required for reimbursement claims are included." } }, { "@type": "Question", name: "Does this generate a PDF?", acceptedAnswer: { "@type": "Answer", text: "Yes. Click Save PDF to directly download the receipt as a PDF file." } }] };
const INTRO = (<><p style={{ marginBottom: 16 }}>Need a fuel bill for office reimbursement? Generating one used to mean hunting for Word templates, wrestling with formatting, or waiting for your accounts team. OpsTools Fuel Bill Generator changes that. Fill in your details, pick a template, and have a print-ready petrol or diesel receipt in under a minute — no login, no subscription, no hassle.</p><p style={{ marginBottom: 16 }}>The generator supports four formats based on actual Indian petrol station receipts: the formal IOCL layout used by Indian Oil outlets, the Classic POS format common at private stations, and two thermal dot-matrix formats (full and compact) used at smaller pumps across the country.</p><p>Every field that appears on a real petrol pump receipt is available. The preview updates live as you type. When you are ready, click Save PDF to download your receipt directly. Your data never leaves your device.</p></>);
const WHAT_IS = `A fuel bill is the receipt issued by a petrol station when you purchase fuel. It serves as proof of purchase and is commonly used in India for employee travel reimbursement claims, business expense records, and tax documentation.`;
const WHY_USE = [{ title: "Reimbursement claims", body: "Most Indian employers require a fuel receipt for travel or conveyance reimbursement." }, { title: "Petrol station operators", body: "Run a small pump without a POS system? Generate receipts manually using the thermal formats." }, { title: "Vehicle fleet management", body: "Track fuel spend across multiple vehicles with consistent, structured receipts." }, { title: "Business expense records", body: "Self-employed professionals can maintain clean fuel expense records." }, { title: "Quick replacement for lost receipts", body: "Misplaced your petrol pump receipt? Generate a replacement before your reimbursement deadline." }];
const FEATURES = [{ icon: "🧾", title: "4 Indian receipt templates", body: "IOCL Formal, Classic POS, Thermal Full, and Thermal Compact — all modelled on real Indian pump receipts." }, { icon: "👁️", title: "Live preview", body: "See your bill update in real time as you fill the form." }, { icon: "⬇️", title: "Direct PDF download", body: "One click downloads the receipt as a PDF — no print dialog needed." }, { icon: "🏷️", title: "Custom logo", body: "Paste any image URL to add your station's logo to the bill." }, { icon: "📱", title: "Mobile-friendly", body: "Works on iPhone, Android, and any tablet." }, { icon: "🔒", title: "100% private", body: "No data is stored or transmitted. Everything happens in your browser." }, { icon: "🆓", title: "No login needed", body: "No account, no email, no credit card." }, { icon: "✏️", title: "Fully editable fields", body: "Every field on the receipt is customisable." }];
const HOW_TO_STEPS = [{ step: 1, title: "Choose a template", body: "Select from Thermal Full, Classic POS, IOCL Formal, or Thermal Compact." }, { step: 2, title: "Fill in station details", body: "Enter the petrol station name, address, and branding details." }, { step: 3, title: "Enter transaction details", body: "Add date, time, fuel type, quantity, rate per litre." }, { step: 4, title: "Add vehicle info", body: "Enter vehicle registration number and attendant details." }, { step: 5, title: "Preview your bill", body: "Check the live preview. Every field updates instantly." }, { step: 6, title: "Download PDF", body: "Click Save PDF to download the receipt directly to your device." }];
const BENEFITS = ["Generate unlimited fuel bills — no caps or credit limits.", "No registration or sign-up required.", "Direct PDF download — no print dialog.", "Four templates match actual Indian petrol station formats.", "All data stays in your browser — zero privacy risk.", "Completely free — no subscription."];
const FORMAT_FIELDS = [{ field: "Station Name", description: "Name of the petrol pump", example: "Indian Oil — Sharma Fuels" }, { field: "Station Address", description: "Full address of the petrol station", example: "Plot 12, MG Road, Pune 411001" }, { field: "Date & Time", description: "Date and time of the transaction", example: "20/06/2026 — 14:35" }, { field: "Fuel Type", description: "Type of fuel dispensed", example: "Petrol / Diesel / CNG" }, { field: "Quantity", description: "Volume dispensed in litres", example: "5.00 L" }, { field: "Rate per Litre", description: "Price per litre at time of transaction", example: "₹103.44" }, { field: "Total Amount", description: "Total value of the transaction", example: "₹517.20" }, { field: "Vehicle Number", description: "Registration number of the vehicle", example: "MH 12 AB 1234" }];
const FAQS = faqSchema.mainEntity.map((i) => ({ q: i.name, a: i.acceptedAnswer.text }));
const RELATED_DOCS = [{ name: "Rent Receipt Generator", href: "/documents/rent-receipt", description: "HRA-compliant rent receipts." }, { name: "GST Invoice Generator", href: "/documents/gst-invoice", description: "Tax-compliant GST invoices." }, { name: "Salary Slip Generator", href: "/documents/salary-slip", description: "Professional payslips." }];

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({ onClose, children, wide }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);
  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(7,1,31,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16, animation: "fadeIn 0.18s ease" }} onClick={onClose}>
      <style>{`@keyframes fadeIn{from{opacity:0}to{opacity:1}} @keyframes slideUp{from{opacity:0;transform:translateY(20px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
      <div style={{ background: "#fff", borderRadius: 20, maxWidth: wide ? 820 : 480, width: "100%", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 32px 80px rgba(0,0,0,0.25)", animation: "slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1)" }} onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>,
    document.body
  );
}

// ─── Login prompt ─────────────────────────────────────────────────────────────
function LoginPromptModal({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <div style={{ padding: "32px 28px", textAlign: "center" }}>
        <div style={{ width: 56, height: 56, borderRadius: 16, margin: "0 auto 20px", background: "linear-gradient(135deg,#EFF6FF,#EEF2FF)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>⚡</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: "0 0 10px" }}>Sign in to generate in bulk</h2>
        <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.65, margin: "0 0 28px" }}>Bulk generation uses credits. Create a free account to get started.<br/>Single bills are always free — no login needed.</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <a href="/login" style={{ flex: 1, height: 44, borderRadius: 10, border: "1.5px solid #E2E8F0", background: "#fff", color: "#0F172A", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Log in</a>
          <a href="/signup" style={{ flex: 1, height: 44, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#2563EB,#4F46E5)", color: "#fff", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Sign up free →</a>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>Continue without account</button>
      </div>
    </Modal>
  );
}

// Resolves one optional CSV cell against its default:
//  - blank/missing  -> use the default (flagged isDefault so the preview can show it distinctly)
//  - literal "NA"   -> explicitly blank, default is skipped entirely (flagged isNA)
//  - anything else  -> the typed value, used as-is
// Parses raw CSV text into rows of fields, respecting RFC4180-style quoting:
// a quoted field can contain commas AND actual line breaks (e.g. a spreadsheet
// export wrapping a multi-line address in quotes) without ending the row.
// Splitting on "\n" before understanding quotes — the previous approach —
// breaks the moment any field spans more than one physical line, since it
// chops that one row into several fake ones and misaligns every column
// after it. This scans the whole text char-by-char instead, only starting a
// new row on a newline that's genuinely outside a quoted field.
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
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  // Drop blank trailing lines.
  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ""));
}

function resolveOptional(raw, fallback) {
  const trimmed = (raw || "").trim();
  if (trimmed.toUpperCase() === "NA") return { value: "", isDefault: false, isNA: true };
  if (trimmed === "") return { value: fallback, isDefault: true, isNA: false };
  return { value: trimmed, isDefault: false, isNA: false };
}

// Builds the full resolved field set for one row — used identically by the
// preview table (so what you see is what you get) and by handleGenerate.
function resolveRow(row, stationData, index) {
  const rate = parseFloat(row.price_per_litre) || 0;
  const amount = parseFloat(row.amount) || 0;
  // Volume is derived (amount ÷ rate), same as the single-bill form — never
  // a raw CSV column, since a user typing it independently risks it not
  // matching amount/rate at all.
  const quantity = amount > 0 && rate > 0 ? (amount / rate).toFixed(2) : "";
  return {
    date: row.date,
    rate,
    amount,
    quantity,
    // Station identity — defaults to the main form's current value, so a
    // normal same-station batch can leave these blank entirely, while a
    // specific row can still override to generate for a different station.
    stationName: resolveOptional(row.station_name, stationData.stationName),
    stationAddress: resolveOptional(row.station_address, stationData.stationAddress),
    stationPhone: resolveOptional(row.station_phone, stationData.stationPhone),
    vatTin: resolveOptional(row.gst_no, stationData.vatTin),
    logoUrl: resolveOptional(row.logo_url, stationData.logoUrl),
    bankLogoUrl: resolveOptional(row.bank_logo_url, stationData.bankLogoUrl),
    time: resolveOptional(row.time, stationData.billTime),
    billNumber: resolveOptional(row.bill_number, `BLK-${String(index + 1).padStart(4, "0")}`),
    // Genuinely unique-per-transaction identifier — default to blank rather
    // than duplicating the main form's single value across the whole batch.
    invoiceNo: resolveOptional(row.invoice_no, ""),
    // Vehicle / customer — no shared default makes sense across a batch.
    vehicleNumber: resolveOptional(row.vehicle_number, ""),
    vehicleType: resolveOptional(row.vehicle_type, "4W"),
    customerName: resolveOptional(row.customer_name, ""),
    mobileNo: resolveOptional(row.mobile_no, ""),
    // Fuel / payment.
    fuelType: resolveOptional(row.fuel_type, "Petrol"),
    density: resolveOptional(row.density, stationData.density),
    presetType: resolveOptional(row.preset_type, stationData.presetType),
    paymentMode: resolveOptional(row.payment_mode, "Cash"),
    // Dispenser info — typically stable across one station's batch.
    nozzleNo: resolveOptional(row.nozzle_no, stationData.nozzleNo),
    attendantId: resolveOptional(row.attendant_id, stationData.attendantId),
  };
}

// Post-processes a captured canvas to look like a real scanned/printed
// thermal receipt rather than a crisp digital render: pulls dark pixels
// toward gray + warm tint (print/scan fading), adds blotchy grain (coarser
// 3x3px blocks rather than per-pixel noise, so it survives JPEG compression
// instead of being smoothed away by quantization), darkens/smudges each
// corner independently (radius capped by the shorter dimension so it stays
// a corner effect even on a tall narrow receipt, never a broad band), a
// slight blur for scan softness, and a clearly visible random tilt (±2.5°)
// onto a padded canvas filled with the paper color. Tuned and visually
// verified against both tall/narrow and normal receipt proportions before
// shipping — the first version of this was too subtle to notice at all.
function applyRealisticScanLook(sourceCanvas, paperColor = "#FBFAF6") {
  const w = sourceCanvas.width, h = sourceCanvas.height;
  const ctx = sourceCanvas.getContext("2d");

  // Fade + warm tint
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

  // Blotchy grain
  const blockSize = 3;
  for (let y = 0; y < h; y += blockSize) {
    for (let x = 0; x < w; x += blockSize) {
      const v = Math.random() * 44 - 22;
      const alpha = Math.min(0.5, Math.abs(v) / 60);
      ctx.fillStyle = v > 0 ? `rgba(0,0,0,${alpha})` : `rgba(255,255,255,${alpha})`;
      ctx.fillRect(x, y, blockSize, blockSize);
    }
  }

  // Corner smudges
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

  // Slight blur (scan softness)
  const blurred = document.createElement("canvas");
  blurred.width = w;
  blurred.height = h;
  const bctx = blurred.getContext("2d");
  try { bctx.filter = "blur(0.7px)"; } catch (_) {}
  bctx.drawImage(sourceCanvas, 0, 0);

  // Rotation onto a padded canvas — clearly visible tilt
  const angle = (Math.random() * 5 - 2.5) * (Math.PI / 180); // -2.5° to 2.5°
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

// ─── Bulk Generation Modal ────────────────────────────────────────────────────
function BulkGenerateModal({ user, stationData, activeTemplate, onClose }) {
  const [step, setStep] = useState("upload"); // upload | preview | generating | done
  const [csvRows, setCsvRows] = useState([]);
  const [csvErrors, setCsvErrors] = useState([]);
  const [credits, setCredits] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [realisticLook, setRealisticLook] = useState(false);
  const hiddenRefs = useRef([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    supabaseFull.from("user_credits").select("balance").eq("user_id", user.id).maybeSingle()
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
      if (!row.date) rowErrors.push("date required");
      if (!row.price_per_litre || isNaN(Number(row.price_per_litre))) rowErrors.push("price_per_litre must be a number");
      if (!row.amount || isNaN(Number(row.amount))) rowErrors.push("amount must be a number");
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
    const content = [CSV_TEMPLATE_HEADERS, CSV_SAMPLE_ROW].join("\n");
    const blob = new Blob([content], { type: "text/csv" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob);
    a.download = "fuel-bill-bulk-template.csv"; a.click();
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

      // Create a hidden container for rendering
      const container = document.createElement("div");
      container.style.cssText = "position:fixed;left:-9999px;top:0;width:400px;background:#FBFAF6;";
      document.body.appendChild(container);

      // Collects { printId, billData } per row as we go, so the full bill
      // content (not just template/print_id) can be recorded afterward.
      const generatedBills = [];

      for (let i = 0; i < validRows.length; i++) {
        setProgress(Math.round((i / validRows.length) * 100));
        const row = validRows[i];

        // Merge station data with the row's resolved (defaulted/NA-aware) fields
        const resolved = resolveRow(row, stationData, i);
        const billData = {
          ...stationData,
          stationName: resolved.stationName.value,
          stationAddress: resolved.stationAddress.value,
          stationPhone: resolved.stationPhone.value,
          vatTin: resolved.vatTin.value,
          logoUrl: resolved.logoUrl.value,
          bankLogoUrl: resolved.bankLogoUrl.value,
          billDate: resolved.date || stationData.billDate,
          billTime: resolved.time.value,
          billNumber: resolved.billNumber.value,
          invoiceNo: resolved.invoiceNo.value,
          vehicleNumber: resolved.vehicleNumber.value,
          vehicleType: resolved.vehicleType.value,
          customerName: resolved.customerName.value,
          mobileNo: resolved.mobileNo.value,
          fuelType: resolved.fuelType.value,
          density: resolved.density.value,
          presetType: resolved.presetType.value,
          paymentMode: resolved.paymentMode.value,
          nozzleNo: resolved.nozzleNo.value,
          attendantId: resolved.attendantId.value,
          pricePerLitre: resolved.rate || "",
          amount: resolved.amount || "",
          quantity: resolved.quantity,
        };
        const printId = `BULK-${Date.now()}-${i}`;
        generatedBills.push({ printId, billData });

        // Render component to DOM
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
        // Fit within half the page height (not a fixed width) — a tall,
        // narrow receipt was otherwise stretching to fill the entire page.
        const maxW = pageW - 20;
        const maxH = pdf.internal.pageSize.getHeight() / 2 - 10;
        const fitScale = Math.min(maxW / naturalW, maxH / naturalH);
        const finalW = naturalW * fitScale;
        const finalH = naturalH * fitScale;
        const x = (pageW - finalW) / 2;

        if (i > 0) pdf.addPage();
        // JPEG at high quality instead of PNG — PNG is lossless and produces
        // multi-MB files for this kind of image (text + a color logo over a
        // solid background); JPEG compresses it far better with no visible
        // quality loss at this quality setting.
        pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", x, 10, finalW, finalH);

        root.unmount();
        container.removeChild(wrapper);
      }

      document.body.removeChild(container);

      // Deduct credits
      await supabaseFull.from("user_credits").update({
        balance: credits - validRows.length,
        updated_at: new Date().toISOString(),
      }).eq("user_id", user.id);

      await supabaseFull.from("credit_transactions").insert({
        user_id: user.id,
        type: "bulk_generation",
        amount: -validRows.length,
        description: `Bulk fuel bill generation — ${validRows.length} bills`,
      });

      // Log saves — includes the full bill content (bill_data), not just
      // which template/print_id was used, so every generated bill's data
      // is recorded.
      const saveInserts = generatedBills.map(({ printId, billData }) => ({
        template: `bulk-${activeTemplate}`,
        print_id: printId,
        user_id: user.id,
        bill_data: billData,
      }));
      await supabaseFull.from("save_requests").insert(saveInserts);

      setProgress(100);
      pdf.save(`fuel-bills-bulk-${Date.now()}.pdf`);
      setStep("done");
    } catch (err) {
      console.error("Bulk generation failed:", err);
      const isTainted = /tainted|cross-origin|SecurityError/i.test(err?.message || err?.name || "");
      alert(isTainted
        ? "Generation failed: one of the logo/bank-strip image URLs doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again."
        : "Generation failed: " + (err?.message || "Unknown error"));
      setStep("preview");
    }
    setGenerating(false);
  };

  return (
    <Modal onClose={onClose} wide>
      <div style={{ padding: "28px 32px" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Bulk Generation</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: 0 }}>Generate Multiple Fuel Bills</h2>
          </div>
          <button onClick={onClose} style={{ background: "#F1F5F9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#64748B", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
        </div>

        {/* Credits bar */}
        <div style={{ background: credits !== null && credits > 0 ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${credits !== null && credits > 0 ? "#BBF7D0" : "#FCA5A5"}`, borderRadius: 10, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: "#374151" }}>Your credit balance</span>
          <span style={{ fontSize: 15, fontWeight: 800, color: credits !== null && credits > 0 ? "#059669" : "#DC2626" }}>
            {credits === null ? "Loading..." : `${credits} credits`}
          </span>
        </div>

        {/* Steps indicator */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {["upload", "preview", "generating", "done"].map((s, i) => (
            <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: step === s ? "#2563EB" : ["preview","generating","done"].indexOf(step) > ["upload","preview","generating","done"].indexOf(s) ? "#D1FAE5" : "#F1F5F9", color: step === s ? "#fff" : "#64748B" }}>{i + 1}</div>
              <span style={{ fontSize: 12, color: step === s ? "#2563EB" : "#94A3B8", fontWeight: step === s ? 700 : 400, textTransform: "capitalize" }}>{s === "generating" ? "Generating" : s}</span>
              {i < 3 && <div style={{ width: 20, height: 1, background: "#E2E8F0" }} />}
            </div>
          ))}
        </div>

        {/* Step: Upload */}
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
                Required columns: <code style={{ background: "#EFF6FF", padding: "1px 6px", borderRadius: 4, color: "#2563EB" }}>date, price_per_litre, amount</code><br/>
                Optional: <code style={{ background: "#F1F5F9", padding: "1px 6px", borderRadius: 4 }}>{CSV_OPTIONAL_COLUMNS.join(", ")}</code><br/>
                <span style={{ display: "inline-block", marginTop: 6 }}>Blank station/dispenser fields (station_name, station_address, station_phone, gst_no, logo_url, bank_logo_url, nozzle_no, density, preset_type, attendant_id) default to the main form's current value — leave them blank for a normal same-station batch. Blank invoice_no defaults to blank, since it's unique per transaction.</span><br/>
                <span style={{ display: "inline-block", marginTop: 6 }}>Volume isn't a column — it's calculated automatically from amount ÷ rate.</span><br/>
                Leave an optional cell <b>blank</b> to use a sensible default (shown in italics in the preview table), or type <code style={{ background: "#FEF9C3", padding: "1px 6px", borderRadius: 4 }}>NA</code> to force it blank instead of defaulting.
              </div>
              <button onClick={downloadTemplate} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "#fff", border: "1.5px solid #2563EB", color: "#2563EB", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                ⬇ Download CSV Template
              </button>
            </div>
          </div>
        )}

        {/* Step: Preview */}
        {step === "preview" && (
          <div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>
                {validRows.length} valid rows
                {csvRows.length - validRows.length > 0 && <span style={{ color: "#DC2626", marginLeft: 8 }}>· {csvRows.length - validRows.length} with errors</span>}
              </div>
              <button onClick={() => { setStep("upload"); setCsvRows([]); setCsvErrors([]); }} style={{ fontSize: 12, color: "#64748B", background: "none", border: "none", cursor: "pointer" }}>← Upload different file</button>
            </div>

            {/* Table preview — shows the *resolved* values (after defaults
                and NA-overrides are applied), computed with the exact same
                resolveRow() function used at generation time, so nothing
                shown here can drift from what actually gets produced. */}
            <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead style={{ background: "#F8FAFC", position: "sticky", top: 0 }}>
                  <tr>{["#", "Date", "Vehicle", "Fuel Type", "Qty (L)", "Rate ₹", "Amount ₹", "Status"].map(h => (
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
                          <td style={{ padding: "8px 12px" }}>{row.date}</td>
                          <td style={{ padding: "8px 12px", fontWeight: 600 }}>{cell(resolved.vehicleNumber)}</td>
                          <td style={{ padding: "8px 12px" }}>{cell(resolved.fuelType)}</td>
                          <td style={{ padding: "8px 12px" }}>{resolved.quantity || "—"}</td>
                          <td style={{ padding: "8px 12px" }}>₹{row.price_per_litre}</td>
                          <td style={{ padding: "8px 12px", fontWeight: 700 }}>₹{row.amount}</td>
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

            {/* Credit cost */}
            <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "16px 20px", border: "1px solid #E2E8F0", marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>Bills to generate</span>
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
                <b>Make it look real</b> — faded print, slight paper grain, and a small scan-like tilt on each bill, instead of a crisp digital render
              </span>
            </label>

            <button
              onClick={handleGenerate}
              disabled={!hasEnoughCredits || validRows.length === 0}
              style={{ width: "100%", height: 48, borderRadius: 12, border: "none", cursor: hasEnoughCredits && validRows.length > 0 ? "pointer" : "not-allowed", background: hasEnoughCredits && validRows.length > 0 ? "linear-gradient(135deg,#2563EB,#4F46E5)" : "#F1F5F9", color: hasEnoughCredits && validRows.length > 0 ? "#fff" : "#94A3B8", fontSize: 15, fontWeight: 700 }}
            >
              Generate {validRows.length} Bills — {validRows.length} Credits
            </button>
          </div>
        )}

        {/* Step: Generating */}
        {step === "generating" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚙️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>Generating your bills…</h3>
            <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 28px" }}>Processing bill {Math.round((progress / 100) * validRows.length)} of {validRows.length}</p>
            <div style={{ background: "#F1F5F9", borderRadius: 999, height: 8, overflow: "hidden", maxWidth: 320, margin: "0 auto" }}>
              <div style={{ background: "linear-gradient(135deg,#2563EB,#4F46E5)", height: "100%", width: `${progress}%`, borderRadius: 999, transition: "width 0.3s" }} />
            </div>
            <div style={{ fontSize: 13, color: "#64748B", marginTop: 12 }}>{progress}% complete</div>
          </div>
        )}

        {/* Step: Done */}
        {step === "done" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: "0 0 8px" }}>All bills generated!</h3>
            <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 8px" }}>{validRows.length} fuel bills saved as a single PDF.</p>
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
      <button
        onClick={() => setOpen((v) => !v)}
        disabled={downloading}
        style={{
          background: "linear-gradient(135deg,#2563EB,#4F46E5)", border: "none",
          borderRadius: 8, padding: small ? "6px 12px" : "8px 16px", color: "#fff",
          fontSize: small ? 12 : 13, fontWeight: 600, cursor: downloading ? "wait" : "pointer",
          opacity: downloading ? 0.7 : 1, display: "flex", alignItems: "center", gap: 6,
        }}
      >
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
    setData((prev) => {
      const next = { ...prev, [name]: value };
      // Volume is derived from Amount ÷ Rate (matches how a real dispenser
      // preset to an amount works) — recompute whenever either changes.
      if (name === "amount" || name === "pricePerLitre") {
        const amt = parseFloat(next.amount);
        const rate = parseFloat(next.pricePerLitre);
        next.quantity = amt > 0 && rate > 0 ? (amt / rate).toFixed(2) : "";
      }
      return next;
    });
  };

  // Renders a fresh, unscaled, off-screen copy of the current receipt
  // specifically for capture, instead of capturing the on-screen preview
  // directly. The on-screen preview is wrapped in a CSS scale() transform
  // purely so it fits the sidebar column — html2canvas doesn't reliably
  // handle capturing through that transform (it was the source of both a
  // persistent off-white "bleed" past the card's real edge, and dividers
  // that render fine on-screen but don't paint at all in the export). A
  // dedicated off-screen render sidesteps the whole problem, and mirrors
  // the bulk-generation path, which never had either issue.
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
      const printId = `PRINT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      try { const { data: { user } } = await supabaseFull.auth.getUser(); await supabaseFull.from("save_requests").insert({ template: activeTemplate, print_id: printId, user_id: user?.id ?? null, bill_data: data }); } catch (_) {}

      await new Promise((resolve) => {
        root.render(<PreviewComponent data={data} />);
        setTimeout(resolve, 300);
      });
      if (document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch (_) {}
      }

      const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: "#FBFAF6", logging: false });

      if (format === "png") {
        // Just the preview section itself, as a flat image — no page layout.
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `fuel-bill-${Date.now()}.png`;
        link.click();
      } else {
        const { default: jsPDF } = await import("jspdf");
        // JPEG at high quality instead of PNG — PNG is lossless and
        // produces multi-MB files for this kind of image (text + a color
        // logo over a solid background); JPEG compresses it far better
        // with no visible quality loss at this quality setting.
        const imgData = canvas.toDataURL("image/jpeg", 0.92);
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageW = pdf.internal.pageSize.getWidth();
        const pxToMm = 25.4 / (96 * 2);
        const naturalW = canvas.width * pxToMm;
        const naturalH = canvas.height * pxToMm;
        // Fit within half the page height (not a fixed width) — a tall,
        // narrow receipt was otherwise stretching to fill the entire page.
        const maxW = pageW - 20;
        const maxH = pdf.internal.pageSize.getHeight() / 2 - 10;
        const fitScale = Math.min(maxW / naturalW, maxH / naturalH);
        const finalW = naturalW * fitScale;
        const finalH = naturalH * fitScale;
        pdf.addImage(imgData, "JPEG", (pageW - finalW) / 2, 10, finalW, finalH);
        pdf.save(`fuel-bill-${Date.now()}.pdf`);
      }
    } catch (err) {
      const isTainted = /tainted|cross-origin|SecurityError/i.test(err?.message || err?.name || "");
      alert(isTainted
        ? "Save failed: one of the logo/bank-strip image URLs doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again."
        : "Save failed: " + (err?.message || "Unknown error"));
    } finally {
      root.unmount();
      document.body.removeChild(container);
      setDownloading(false);
    }
  };

  const handleBulkClick = async () => {
    try {
      const { data: { user }, error } = await supabaseFull.auth.getUser();
      if (!user) { setModal("login"); }
      else { setModalUser(user); setModal("bulk"); }
    } catch(err) {
      setModal("login");
    }
  };

  const PreviewComponent = TEMPLATE_COMPONENTS[activeTemplate];

  useSEO({ title: SEO_TITLE, description: SEO_DESCRIPTION, canonical: CANONICAL, breadcrumbs: [{ name: "Home", url: "https://www.opstools.ai" }, { name: "Documents", url: "https://www.opstools.ai/documents" }, { name: "Fuel Bill Generator", url: CANONICAL }], schemas: [softwareAppSchema, faqSchema] });

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <style>{`
        @media(max-width:1023px){.preview-col{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;}}
        @media(max-width:768px){.fuel-tool-padding{padding-left:16px!important;padding-right:16px!important;}.fuel-hero-padding{padding:28px 16px 24px!important;}.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}

        /* Simple two-column layout — no grid-template-areas / row-spanning.
           Spanning the tall "form" column across two rows was what broke
           the layout: browsers size spanned row tracks in a way that
           doesn't match "sidebar stacks two blocks beside a much taller
           column", producing the big misaligned gap. A plain two-column
           grid with the picker + preview simply stacked as ordinary
           content inside column 2 avoids that entirely. */
        .tool-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media(min-width:1024px){
          .tool-grid {
            grid-template-columns: 1fr 320px;
            gap: 28px;
          }
        }
      `}</style>

      {modal === "login" && <LoginPromptModal onClose={() => setModal(null)} />}
      {modal === "bulk" && modalUser && <BulkGenerateModal user={modalUser} stationData={data} activeTemplate={activeTemplate} onClose={() => setModal(null)} />}

      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0D0630 60%,#1e1b4b 100%)" }} className="fuel-hero-padding">
        <div style={{ padding: "40px 24px 36px", maxWidth: 1280, margin: "0 auto" }} className="fuel-hero-padding">
          <nav style={{ marginBottom: 16, fontSize: 13, color: "#475569" }}>
            <a href="/" style={{ color: "#475569", textDecoration: "none" }}>Home</a><span style={{ margin: "0 8px" }}>›</span>
            <a href="/documents" style={{ color: "#475569", textDecoration: "none" }}>Documents</a><span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Fuel Bill Generator</span>
          </nav>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 8px", letterSpacing: "-0.02em" }}>Free Fuel Bill Generator</h1>
              <p style={{ fontSize: 14, color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>Choose a template, fill details — receipt updates live.</p>
            </div>
            <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }} className="no-print">
              <button onClick={handleBulkClick} style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.18)", padding: "10px 18px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7, backdropFilter: "blur(8px)", transition: "background 0.15s" }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.08)"}>
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
            <BillForm data={data} onChange={handleChange} />
          </div>

          {/* Right column: template picker stacked directly above the live
              preview, both as ordinary content in a single grid cell — this
              is what keeps the picker "right above the preview" without
              needing any row-spanning on the form column. */}
          <div className="preview-col" style={{ position: "sticky", top: 96 }}>
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
              {/* The outer div's scale/width/margin combo is purely a visual
                  on-screen fit trick — html2canvas captures the untransformed
                  box, which is 22% wider than the actual card. display:
                  inline-block on the ref'd inner div makes it shrink-wrap to
                  the card's own rendered width instead of filling its full
                  block-level parent — without this, ThermalFull specifically
                  (whose card self-centers via maxWidth+margin:auto, narrower
                  than the other three templates) leaves blank space on both
                  sides that gets exported filled with the background color,
                  reading as an off-white bleed past the card's real edge. */}
              <div className="preview-scale-wrap" style={{ transform: "scale(0.82)", transformOrigin: "top left", width: "122%", marginBottom: "-18%" }}>
                <div ref={previewRef} style={{ display: "inline-block" }}>
                  <PreviewComponent data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0" }}>
        <div className="seo-section" style={{ maxWidth: "80%", margin: "0 auto", width: "80%" }}>
          <DocumentPageSEO documentName="Fuel Bill" documentSlug="fuel-bill" intro={INTRO} whatIs={WHAT_IS} whyUse={WHY_USE} features={FEATURES} howToSteps={HOW_TO_STEPS} benefits={BENEFITS} formatFields={FORMAT_FIELDS} faqs={FAQS} relatedDocs={RELATED_DOCS} />
        </div>
      </div>
    </div>
  );
}
