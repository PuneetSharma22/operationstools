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
  shift: "S-1", pumpNo: "P-05", nozzleNo: "N-02",
  fccId: "", fipNo: "07", txnNo: "6242805", invoiceNo: "927267", localId: "00024735",
  customerName: "", vehicleNumber: "", vehicleType: "4W", mobileNo: "", attendantId: "",
  fuelType: "Petrol", density: "745.0", amount: "", quantity: "", pricePerLitre: "104.29",
  presetType: "Amount", paymentMode: "Cash", atot: "", vtot: "",
};

const TEMPLATE_COMPONENTS = {
  pos: TemplatePOS, iocl: TemplateIOCL,
  "thermal-full": TemplateThermalFull, "thermal-compact": TemplateThermalCompact,
};

const CSV_TEMPLATE_HEADERS = "date,time,bill_number,vehicle_number,vehicle_type,fuel_type,quantity,price_per_litre,amount,payment_mode,customer_name,mobile_no";
const CSV_SAMPLE_ROW = "2026-07-10,14:30,G64695,MH12AB1234,4W,Petrol,9.52,104.29,992.00,Cash,Rajesh Sharma,9876543210";

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

// ─── Bulk Generation Modal ────────────────────────────────────────────────────
function BulkGenerateModal({ user, stationData, activeTemplate, onClose }) {
  const [step, setStep] = useState("upload"); // upload | preview | generating | done
  const [csvRows, setCsvRows] = useState([]);
  const [csvErrors, setCsvErrors] = useState([]);
  const [credits, setCredits] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const hiddenRefs = useRef([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    supabaseFull.from("user_credits").select("balance").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setCredits(data?.balance ?? 0));
  }, [user.id]);

  const parseCSV = (text) => {
    const lines = text.trim().split("\n").filter(l => l.trim());
    if (lines.length < 2) return { rows: [], errors: ["CSV must have a header row and at least one data row"] };
    const headers = lines[0].split(",").map(h => h.trim().toLowerCase());
    const required = ["date", "vehicle_number", "fuel_type", "quantity", "price_per_litre", "amount"];
    const missing = required.filter(r => !headers.includes(r));
    if (missing.length) return { rows: [], errors: [`Missing required columns: ${missing.join(", ")}`] };

    const rows = [];
    const errors = [];
    lines.slice(1).forEach((line, i) => {
      const vals = line.split(",").map(v => v.trim());
      const row = {};
      headers.forEach((h, j) => row[h] = vals[j] || "");
      const rowErrors = [];
      if (!row.date) rowErrors.push("date required");
      if (!row.vehicle_number) rowErrors.push("vehicle_number required");
      if (!row.amount || isNaN(Number(row.amount))) rowErrors.push("amount must be a number");
      if (!row.quantity || isNaN(Number(row.quantity))) rowErrors.push("quantity must be a number");
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
    const content = CSV_TEMPLATE_HEADERS + "\n" + CSV_SAMPLE_ROW;
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
      container.style.cssText = "position:fixed;left:-9999px;top:0;width:400px;background:#fff;";
      document.body.appendChild(container);

      for (let i = 0; i < validRows.length; i++) {
        setProgress(Math.round((i / validRows.length) * 100));
        const row = validRows[i];

        // Merge station data with row data
        const billData = {
          ...stationData,
          billDate: row.date || stationData.billDate,
          billTime: row.time || stationData.billTime,
          billNumber: row.bill_number || `BLK-${String(i + 1).padStart(4, "0")}`,
          vehicleNumber: row.vehicle_number || "",
          vehicleType: row.vehicle_type || "4W",
          fuelType: row.fuel_type || "Petrol",
          quantity: row.quantity || "",
          pricePerLitre: row.price_per_litre || "",
          atot: row.amount || "",
          paymentMode: row.payment_mode || "Cash",
          customerName: row.customer_name || "",
          mobileNo: row.mobile_no || "",
        };

        // Render component to DOM
        const { createRoot } = await import("react-dom/client");
        const wrapper = document.createElement("div");
        container.appendChild(wrapper);
        const root = createRoot(wrapper);

        await new Promise(resolve => {
          root.render(<PreviewComp data={billData} />);
          setTimeout(resolve, 300);
        });

        const canvas = await html2canvas(wrapper, { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false });
        const pxToMm = 25.4 / (96 * 2);
        const naturalW = canvas.width * pxToMm;
        const naturalH = canvas.height * pxToMm;
        const targetW = 105;
        const ratio = targetW / naturalW;
        const finalW = targetW;
        const finalH = naturalH * ratio;
        const x = (pageW - finalW) / 2;

        if (i > 0) pdf.addPage();
        pdf.addImage(canvas.toDataURL("image/png"), "PNG", x, 10, finalW, finalH);

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

      // Log saves
      const saveInserts = validRows.map((_, i) => ({
        template: `bulk-${activeTemplate}`,
        print_id: `BULK-${Date.now()}-${i}`,
        user_id: user.id,
      }));
      await supabaseFull.from("save_requests").insert(saveInserts);

      setProgress(100);
      pdf.save(`fuel-bills-bulk-${Date.now()}.pdf`);
      setStep("done");
    } catch (err) {
      console.error("Bulk generation failed:", err);
      alert("Generation failed: " + (err?.message || "Unknown error"));
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
                Required columns: <code style={{ background: "#EFF6FF", padding: "1px 6px", borderRadius: 4, color: "#2563EB" }}>date, vehicle_number, fuel_type, quantity, price_per_litre, amount</code><br/>
                Optional: <code style={{ background: "#F1F5F9", padding: "1px 6px", borderRadius: 4 }}>time, bill_number, vehicle_type, payment_mode, customer_name, mobile_no</code>
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

            {/* Table preview */}
            <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden", marginBottom: 16, maxHeight: 300, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead style={{ background: "#F8FAFC", position: "sticky", top: 0 }}>
                  <tr>{["#", "Date", "Vehicle", "Fuel Type", "Qty (L)", "Rate ₹", "Amount ₹", "Status"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #E2E8F0" }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {csvRows.map((row, i) => (
                    <tr key={i} style={{ borderBottom: "1px solid #F1F5F9", background: row._errors.length ? "#FEF2F2" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                      <td style={{ padding: "8px 12px", color: "#94A3B8" }}>{row._line}</td>
                      <td style={{ padding: "8px 12px" }}>{row.date}</td>
                      <td style={{ padding: "8px 12px", fontWeight: 600 }}>{row.vehicle_number}</td>
                      <td style={{ padding: "8px 12px" }}>{row.fuel_type}</td>
                      <td style={{ padding: "8px 12px" }}>{row.quantity}</td>
                      <td style={{ padding: "8px 12px" }}>₹{row.price_per_litre}</td>
                      <td style={{ padding: "8px 12px", fontWeight: 700 }}>₹{row.amount}</td>
                      <td style={{ padding: "8px 12px" }}>
                        {row._errors.length === 0
                          ? <span style={{ color: "#059669", fontWeight: 600 }}>✓ Valid</span>
                          : <span style={{ color: "#DC2626", fontSize: 11 }}>{row._errors.join(", ")}</span>}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

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

// ─── Mobile Preview Sheet ─────────────────────────────────────────────────────
function MobilePreviewSheet({ previewRef, PreviewComponent, data, onDownload, downloading, onClose }) {
  useEffect(() => { document.body.style.overflow = "hidden"; return () => { document.body.style.overflow = ""; }; }, []);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 800, display: "flex", flexDirection: "column" }}>
      <div onClick={onClose} style={{ position: "absolute", inset: 0, background: "rgba(7,1,31,0.6)" }} />
      <div style={{ position: "relative", marginTop: "auto", background: "#fff", borderRadius: "20px 20px 0 0", maxHeight: "90vh", display: "flex", flexDirection: "column", animation: "sheetUp 0.25s cubic-bezier(0.16,1,0.3,1)" }}>
        <style>{`@keyframes sheetUp{from{transform:translateY(100%)}to{transform:translateY(0)}}`}</style>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #F1F5F9", flexShrink: 0 }}>
          <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>Preview</span>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <SaveMenu onSave={onDownload} downloading={downloading} small />
            <button onClick={onClose} style={{ background: "#F1F5F9", border: "none", borderRadius: 8, width: 32, height: 32, cursor: "pointer", color: "#64748B", fontSize: 18, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
          </div>
        </div>
        <div style={{ overflowY: "auto", padding: "20px 16px 32px", flex: 1 }}>
          <div style={{ overflowX: "auto" }}>
            <div ref={previewRef} style={{ minWidth: 300 }}><PreviewComponent data={data} /></div>
          </div>
        </div>
      </div>
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
  const [showMobilePreview, setShowMobilePreview] = useState(false);
  const previewRef = useRef(null);
  const mobilePreviewRef = useRef(null);

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

  const doDownload = async (ref, format = "pdf") => {
    if (!ref.current || downloading) return;
    setDownloading(true);
    const { default: html2canvas } = await import("html2canvas");
    try {
      const printId = `PRINT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      try { const { data: { user } } = await supabaseFull.auth.getUser(); await supabaseFull.from("save_requests").insert({ template: activeTemplate, print_id: printId, user_id: user?.id ?? null }); } catch (_) {}
      const canvas = await html2canvas(ref.current, { scale: 2, useCORS: true, allowTaint: true, backgroundColor: "#ffffff", logging: false });

      if (format === "png") {
        // Just the preview section itself, as a flat image — no page layout.
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `fuel-bill-${Date.now()}.png`;
        link.click();
      } else {
        const { default: jsPDF } = await import("jspdf");
        const imgData = canvas.toDataURL("image/png");
        const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
        const pageW = pdf.internal.pageSize.getWidth();
        const pxToMm = 25.4 / (96 * 2);
        const targetW = 105;
        const ratio = targetW / (canvas.width * pxToMm);
        const finalH = (canvas.height * pxToMm) * ratio;
        pdf.addImage(imgData, "PNG", (pageW - targetW) / 2, 10, targetW, finalH);
        pdf.save(`fuel-bill-${Date.now()}.pdf`);
      }
    } catch (err) { alert("Save failed: " + (err?.message || "Unknown error")); }
    finally { setDownloading(false); }
  };

  const handleDownload = (format) => doDownload(showMobilePreview ? mobilePreviewRef : previewRef, format);

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
        @media(max-width:768px){.desktop-preview{display:none!important;}.mobile-preview-btn{display:flex!important;}.fuel-tool-padding{padding-left:16px!important;padding-right:16px!important;}.fuel-hero-padding{padding:28px 16px 24px!important;}.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}
        @media(min-width:769px){.mobile-preview-btn{display:none!important;}}

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

      {showMobilePreview && <MobilePreviewSheet previewRef={mobilePreviewRef} PreviewComponent={PreviewComponent} data={data} onDownload={handleDownload} downloading={downloading} onClose={() => setShowMobilePreview(false)} />}

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
            <div className="mobile-preview-btn" style={{ marginTop: 20, gap: 10 }}>
              <button onClick={() => setShowMobilePreview(true)} style={{ flex: 1, height: 48, borderRadius: 12, border: "2px solid #2563EB", background: "#EFF6FF", color: "#2563EB", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>Preview Bill
              </button>
              <button onClick={() => setShowMobilePreview(true)} style={{ flex: 1, height: 48, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#2563EB,#4F46E5)", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>Save Bill
              </button>
            </div>
          </div>

          {/* Right column: template picker stacked directly above the live
              preview, both as ordinary content in a single grid cell — this
              is what keeps the picker "right above the preview" without
              needing any row-spanning on the form column. */}
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

            <div className="desktop-preview">
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }} className="no-print">
                <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748B", margin: 0 }}>Live Preview</p>
                <SaveMenu onSave={(format) => doDownload(previewRef, format)} downloading={downloading} small />
              </div>
              <div ref={previewRef} style={{ transform: "scale(0.82)", transformOrigin: "top left", width: "122%", marginBottom: "-18%" }}>
                <PreviewComponent data={data} />
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
