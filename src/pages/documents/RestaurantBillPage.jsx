import { Helmet } from 'react-helmet-async';
import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { supabase } from "../../supabase";
import RestaurantTemplate1 from "../../components/restaurant/RestaurantTemplate1";
import RestaurantTemplate2 from "../../components/restaurant/RestaurantTemplate2";
import RestaurantTemplate3 from "../../components/restaurant/RestaurantTemplate3";

const today = new Date();
const nowTime = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;

const TEMPLATES = [
  { id: "1", label: "Clean Modern", desc: "Simple itemized receipt" },
  { id: "2", label: "Bold Total", desc: "Emphasized total, thermal-style" },
  { id: "3", label: "POS Thermal", desc: "Monospace, ALL CAPS, tax breakdown" },
];
const TEMPLATE_COMPONENTS = { "1": RestaurantTemplate1, "2": RestaurantTemplate2, "3": RestaurantTemplate3 };

const defaultItem = () => ({ id: Date.now() + Math.random(), name: "", qty: 1, rate: 0 });

const defaultData = {
  restaurantName: "", address: "", phone: "", gstin: "", logoUrl: "",
  billNo: `BILL-${String(Math.floor(Math.random() * 9000) + 1000)}`,
  date: today.toISOString().split("T")[0],
  time: nowTime,
  tableNo: "", customerName: "", covers: "", waiter: "",
  paymentMode: "Cash",
  cgst: "2.5", sgst: "2.5", serviceCharge: "0",
  footer: "Thank you for dining with us!",
};

// ─── Field / Section (matches the styling convention used across the app) ──
const inputClass = "w-full h-11 px-4 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all duration-150 placeholder:text-[#94a3b8]";
const labelClass = "block text-[#0F172A] text-[13px] font-medium mb-1.5";

function Field({ label, children }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      {children}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 24px", marginBottom: 16 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, color: "#EA580C", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</h2>
      {children}
    </div>
  );
}

// ─── Bulk CSV ─────────────────────────────────────────────────────────────────
// Items are packed into a single cell using "Name:Qty:Rate|Name:Qty:Rate"
// syntax, since a bill can have any number of line items and a normal CSV
// row can't hold a variable-length nested list any other way without either
// a fixed max-items-per-row limit or a much more complex multi-row-per-bill
// format. This keeps one row = one complete bill.
const CSV_REQUIRED_COLUMNS = ["date", "items"];
const CSV_COLUMN_ORDER = [
  "date", "time", "bill_no", "table_no", "customer_name",
  "items", "payment_mode",
  "restaurant_name", "restaurant_address", "phone", "gstin",
  "cgst", "sgst", "service_charge",
];
const CSV_OPTIONAL_COLUMNS = CSV_COLUMN_ORDER.filter((c) => !CSV_REQUIRED_COLUMNS.includes(c));
const CSV_TEMPLATE_HEADERS = CSV_COLUMN_ORDER.join(",");
const CSV_SAMPLE_ROW = '2026-07-24,19:30,BILL-1001,12,Rajesh Sharma,"Paneer Butter Masala:2:220|Naan:4:40|Coke:2:60",Cash,,,,,,,';

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

function resolveOptional(raw, fallback) {
  const trimmed = (raw || "").trim();
  if (trimmed.toUpperCase() === "NA") return { value: "", isDefault: false, isNA: true };
  if (trimmed === "") return { value: fallback, isDefault: true, isNA: false };
  return { value: trimmed, isDefault: false, isNA: false };
}

// Parses "Name:Qty:Rate|Name:Qty:Rate" into an items array. Malformed
// segments (wrong number of parts, non-numeric qty/rate) are collected as
// errors rather than silently dropped, so a typo shows up in the preview
// instead of quietly producing a bill with a missing item.
function parseItemsCell(raw) {
  const errors = [];
  const segments = (raw || "").split("|").map((s) => s.trim()).filter(Boolean);
  if (segments.length === 0) return { items: [], errors: ["items cell is empty"] };
  const items = [];
  segments.forEach((seg) => {
    const parts = seg.split(":");
    if (parts.length !== 3) { errors.push(`"${seg}" must be Name:Qty:Rate`); return; }
    const [name, qtyStr, rateStr] = parts;
    const qty = Number(qtyStr);
    const rate = Number(rateStr);
    if (!name.trim()) { errors.push(`"${seg}" missing item name`); return; }
    if (isNaN(qty) || qty <= 0) { errors.push(`"${seg}" qty must be a positive number`); return; }
    if (isNaN(rate) || rate < 0) { errors.push(`"${seg}" rate must be a number`); return; }
    items.push({ id: Date.now() + Math.random(), name: name.trim(), qty, rate });
  });
  return { items, errors };
}

function resolveRow(row, stationData, index) {
  return {
    date: row.date,
    itemsParsed: parseItemsCell(row.items),
    billNo: resolveOptional(row.bill_no, `BULK-${String(index + 1).padStart(4, "0")}`),
    time: resolveOptional(row.time, stationData.time),
    tableNo: resolveOptional(row.table_no, stationData.tableNo),
    customerName: resolveOptional(row.customer_name, ""),
    paymentMode: resolveOptional(row.payment_mode, stationData.paymentMode),
    restaurantName: resolveOptional(row.restaurant_name, stationData.restaurantName),
    restaurantAddress: resolveOptional(row.restaurant_address, stationData.address),
    phone: resolveOptional(row.phone, stationData.phone),
    gstin: resolveOptional(row.gstin, stationData.gstin),
    cgst: resolveOptional(row.cgst, stationData.cgst),
    sgst: resolveOptional(row.sgst, stationData.sgst),
    serviceCharge: resolveOptional(row.service_charge, stationData.serviceCharge),
  };
}

// ─── Modal shell ──────────────────────────────────────────────────────────────
function Modal({ onClose, children, wide }) {
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => { document.removeEventListener("keydown", onKey); document.body.style.overflow = ""; };
  }, [onClose]);
  return createPortal(
    <div style={{ position: "fixed", inset: 0, zIndex: 9999, background: "rgba(7,1,31,0.6)", display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={onClose}>
      <style>{`@keyframes slideUp{from{opacity:0;transform:translateY(20px) scale(0.97)}to{opacity:1;transform:translateY(0) scale(1)}}`}</style>
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
        <div style={{ width: 56, height: 56, borderRadius: 16, margin: "0 auto 20px", background: "linear-gradient(135deg,#FFF7ED,#FFEDD5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 26 }}>⚡</div>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: "0 0 10px" }}>Sign in to generate in bulk</h2>
        <p style={{ fontSize: 14, color: "#64748B", lineHeight: 1.65, margin: "0 0 28px" }}>Bulk generation uses credits. Create a free account to get started.<br/>Single receipts are always free — no login needed.</p>
        <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
          <a href="/login" style={{ flex: 1, height: 44, borderRadius: 10, border: "1.5px solid #E2E8F0", background: "#fff", color: "#0F172A", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Log in</a>
          <a href="/signup" style={{ flex: 1, height: 44, borderRadius: 10, border: "none", background: "linear-gradient(135deg,#F97316,#EA580C)", color: "#fff", fontSize: 14, fontWeight: 600, display: "flex", alignItems: "center", justifyContent: "center", textDecoration: "none" }}>Sign up free →</a>
        </div>
        <button onClick={onClose} style={{ background: "none", border: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer" }}>Continue without account</button>
      </div>
    </Modal>
  );
}

// Scales content down only when it's genuinely wider than the space
// actually available — measured live via ResizeObserver on both the
// container and the content, rather than assuming a fixed target width.
// This matters specifically for mobile: a hardcoded "shrink to 320px"
// constant (tuned for Fuel Bill's narrow desktop sidebar) was being
// applied even on mobile, where the full viewport width is available and
// usually close to or wider than the template itself — forcing a needless
// scale-down and, worse, a CSS transform composite on every keystroke,
// which is genuinely expensive on mobile GPUs. Measuring the real
// available width means mobile naturally resolves to scale=1, and the
// transform is skipped entirely in that case rather than just being
// disabled via a separate CSS override.
function ScaledPreview({ children }) {
  const outerRef = useRef(null);
  const innerRef = useRef(null);
  const [availableW, setAvailableW] = useState(0);
  const [natural, setNatural] = useState({ w: 0, h: 0 });

  useEffect(() => {
    if (!outerRef.current) return;
    const measure = () => setAvailableW(outerRef.current.offsetWidth);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(outerRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (!innerRef.current) return;
    const measure = () => setNatural({ w: innerRef.current.offsetWidth, h: innerRef.current.offsetHeight });
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(innerRef.current);
    return () => ro.disconnect();
  }, [children]);

  const scale = natural.w > 0 && availableW > 0 ? Math.min(1, availableW / natural.w) : 1;
  const needsScale = scale < 0.999;

  return (
    <div ref={outerRef} style={{ width: "100%" }}>
      <div style={{ width: needsScale ? natural.w * scale || undefined : undefined, height: needsScale ? natural.h * scale || undefined : undefined, overflow: needsScale ? "hidden" : "visible" }}>
        <div
          ref={innerRef}
          style={needsScale
            ? { transform: `scale(${scale})`, transformOrigin: "top left", display: "inline-block" }
            : { display: "inline-block" }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

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
      <button onClick={() => setOpen((v) => !v)} disabled={downloading} style={{ background: "linear-gradient(135deg,#F97316,#EA580C)", border: "none", borderRadius: 8, padding: small ? "6px 12px" : "8px 16px", color: "#fff", fontSize: small ? 12 : 13, fontWeight: 600, cursor: downloading ? "wait" : "pointer", opacity: downloading ? 0.7 : 1, display: "flex", alignItems: "center", gap: 6 }}>
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
      if (!row.date) rowErrors.push("date required");
      const { items, errors: itemErrors } = parseItemsCell(row.items);
      if (itemErrors.length) rowErrors.push(...itemErrors);
      rows.push({ ...row, _line: i + 2, _errors: rowErrors, _items: items });
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
    a.download = "restaurant-bill-bulk-template.csv"; a.click();
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
      const { createRoot } = await import("react-dom/client");
      const PreviewComp = TEMPLATE_COMPONENTS[activeTemplate];

      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      const container = document.createElement("div");
      container.style.cssText = "position:fixed;left:-9999px;top:0;width:400px;background:#FBFAF6;";
      document.body.appendChild(container);

      const generatedBills = [];

      for (let i = 0; i < validRows.length; i++) {
        setProgress(Math.round((i / validRows.length) * 100));
        const row = validRows[i];
        const resolved = resolveRow(row, stationData, i);
        const billData = {
          ...stationData,
          date: resolved.date || stationData.date,
          billNo: resolved.billNo.value,
          time: resolved.time.value,
          tableNo: resolved.tableNo.value,
          customerName: resolved.customerName.value,
          paymentMode: resolved.paymentMode.value,
          restaurantName: resolved.restaurantName.value,
          address: resolved.restaurantAddress.value,
          phone: resolved.phone.value,
          gstin: resolved.gstin.value,
          cgst: resolved.cgst.value,
          sgst: resolved.sgst.value,
          serviceCharge: resolved.serviceCharge.value,
        };
        const billItems = row._items;
        const printId = `BULK-${Date.now()}-${i}`;
        generatedBills.push({ printId, billData: { ...billData, items: billItems } });

        const wrapper = document.createElement("div");
        wrapper.style.display = "inline-block";
        container.appendChild(wrapper);
        const root = createRoot(wrapper);

        await new Promise(resolve => {
          root.render(<PreviewComp data={billData} items={billItems} />);
          setTimeout(resolve, 300);
        });
        if (document.fonts && document.fonts.ready) {
          try { await document.fonts.ready; } catch (_) {}
        }

        const canvas = await html2canvas(wrapper, { scale: 2, useCORS: true, backgroundColor: "#FBFAF6", logging: false });
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
        description: `Bulk restaurant bill generation — ${validRows.length} bills`,
      });

      const saveInserts = generatedBills.map(({ printId, billData }) => ({
        template: `bulk-${activeTemplate}`,
        print_id: printId,
        user_id: user.id,
        bill_data: billData,
      }));
      await supabase.from("save_requests").insert(saveInserts);

      setProgress(100);
      pdf.save(`restaurant-bills-bulk-${Date.now()}.pdf`);
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
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 4 }}>Bulk Generation</div>
            <h2 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: 0 }}>Generate Multiple Restaurant Bills</h2>
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
              <div style={{ width: 24, height: 24, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, background: step === s ? "#EA580C" : ["preview","generating","done"].indexOf(step) > ["upload","preview","generating","done"].indexOf(s) ? "#FED7AA" : "#F1F5F9", color: step === s ? "#fff" : "#64748B" }}>{i + 1}</div>
              <span style={{ fontSize: 12, color: step === s ? "#EA580C" : "#94A3B8", fontWeight: step === s ? 700 : 400, textTransform: "capitalize" }}>{s === "generating" ? "Generating" : s}</span>
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
              style={{ border: `2px dashed ${dragOver ? "#EA580C" : "#E2E8F0"}`, borderRadius: 16, padding: "40px 24px", textAlign: "center", cursor: "pointer", background: dragOver ? "#FFF7ED" : "#FAFAFA", transition: "all 0.15s", marginBottom: 16 }}
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
                Required columns: <code style={{ background: "#FFF7ED", padding: "1px 6px", borderRadius: 4, color: "#EA580C" }}>date, items</code><br/>
                Optional: <code style={{ background: "#F1F5F9", padding: "1px 6px", borderRadius: 4 }}>{CSV_OPTIONAL_COLUMNS.join(", ")}</code><br/>
                <span style={{ display: "inline-block", marginTop: 6 }}>
                  <strong>items</strong> format: <code style={{ background: "#FFF7ED", padding: "1px 6px", borderRadius: 4 }}>Name:Qty:Rate|Name:Qty:Rate</code> — e.g. <code style={{ background: "#F1F5F9", padding: "1px 6px", borderRadius: 4 }}>Naan:4:40|Coke:2:60</code> for 4 Naan at ₹40 each and 2 Coke at ₹60 each, all in one bill.
                </span><br/>
                <span style={{ display: "inline-block", marginTop: 6 }}>Blank restaurant/tax fields default to the main form's current value. Type <code style={{ background: "#FEF9C3", padding: "1px 6px", borderRadius: 4 }}>NA</code> to force a field blank instead of defaulting.</span>
              </div>
              <button onClick={downloadTemplate} style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "8px 16px", borderRadius: 8, background: "#fff", border: "1.5px solid #EA580C", color: "#EA580C", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
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

            <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden", marginBottom: 16, maxHeight: 360, overflowY: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead style={{ background: "#F8FAFC", position: "sticky", top: 0 }}>
                  <tr>{["#", "Date", "Customer", "Items", "Status"].map(h => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #E2E8F0" }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {(() => {
                    let validIndex = -1;
                    return csvRows.map((row, i) => {
                      if (row._errors.length === 0) validIndex += 1;
                      const resolved = row._errors.length === 0 ? resolveRow(row, stationData, validIndex) : null;
                      const cell = (r) => !r ? "—" : r.isNA
                        ? <span style={{ color: "#CBD5E1" }} title="Explicitly left blank (NA)">—</span>
                        : r.isDefault
                          ? <span style={{ color: "#94A3B8", fontStyle: "italic" }} title="Not entered — using default">{r.value || "—"}</span>
                          : <span>{r.value}</span>;
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid #F1F5F9", background: row._errors.length ? "#FEF2F2" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                          <td style={{ padding: "8px 12px", color: "#94A3B8" }}>{row._line}</td>
                          <td style={{ padding: "8px 12px" }}>{row.date}</td>
                          <td style={{ padding: "8px 12px", fontWeight: 600 }}>{resolved ? cell(resolved.customerName) : "—"}</td>
                          <td style={{ padding: "8px 12px", maxWidth: 220, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }} title={row.items}>{row._items?.length ? `${row._items.length} item(s)` : "—"}</td>
                          <td style={{ padding: "8px 12px" }}>
                            {row._errors.length === 0
                              ? <span style={{ color: "#059669", fontWeight: 600 }}>✓ Valid</span>
                              : <span style={{ color: "#DC2626", fontSize: 11 }}>{row._errors.join("; ")}</span>}
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
                <span style={{ fontSize: 13, color: "#64748B" }}>Bills to generate</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#0F172A" }}>{validRows.length}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>Credits required</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: "#EA580C" }}>{validRows.length} credits</span>
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
              style={{ width: "100%", height: 48, borderRadius: 12, border: "none", cursor: hasEnoughCredits && validRows.length > 0 ? "pointer" : "not-allowed", background: hasEnoughCredits && validRows.length > 0 ? "linear-gradient(135deg,#F97316,#EA580C)" : "#F1F5F9", color: hasEnoughCredits && validRows.length > 0 ? "#fff" : "#94A3B8", fontSize: 15, fontWeight: 700 }}
            >
              Generate {validRows.length} Bills — {validRows.length} Credits
            </button>
          </div>
        )}

        {step === "generating" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>⚙️</div>
            <h3 style={{ fontSize: 18, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>Generating your bills…</h3>
            <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 28px" }}>Processing bill {Math.round((progress / 100) * validRows.length)} of {validRows.length}</p>
            <div style={{ background: "#F1F5F9", borderRadius: 999, height: 8, overflow: "hidden", maxWidth: 320, margin: "0 auto" }}>
              <div style={{ background: "linear-gradient(135deg,#F97316,#EA580C)", height: "100%", width: `${progress}%`, borderRadius: 999, transition: "width 0.3s" }} />
            </div>
            <div style={{ fontSize: 13, color: "#64748B", marginTop: 12 }}>{progress}% complete</div>
          </div>
        )}

        {step === "done" && (
          <div style={{ textAlign: "center", padding: "32px 0" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px" }}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
            </div>
            <h3 style={{ fontSize: 20, fontWeight: 800, color: "#0F172A", margin: "0 0 8px" }}>All bills generated!</h3>
            <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 8px" }}>{validRows.length} restaurant bills saved as a single PDF.</p>
            <p style={{ fontSize: 13, color: "#94A3B8", margin: "0 0 28px" }}>Remaining credits: {credits - validRows.length}</p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button onClick={onClose} style={{ padding: "12px 28px", borderRadius: 10, background: "linear-gradient(135deg,#F97316,#EA580C)", color: "#fff", fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer" }}>Done</button>
              <button onClick={() => { setStep("upload"); setCsvRows([]); setCsvErrors([]); setProgress(0); }} style={{ padding: "12px 28px", borderRadius: 10, background: "#F8FAFC", color: "#374151", fontSize: 14, fontWeight: 600, border: "1px solid #E2E8F0", cursor: "pointer" }}>Generate another batch</button>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function RestaurantBillPage() {
  const [data, setData] = useState(defaultData);
  const [items, setItems] = useState([defaultItem(), defaultItem()]);
  const [activeTemplate, setActiveTemplate] = useState("1");
  const [modal, setModal] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const [downloading, setDownloading] = useState(false);

  const upd = (k, v) => setData(p => ({ ...p, [k]: v }));
  const updItem = (id, k, v) => setItems(p => p.map(i => i.id === id ? { ...i, [k]: v } : i));

  const PreviewComponent = TEMPLATE_COMPONENTS[activeTemplate];

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
      const printId = `REST-${Date.now()}`;
      try {
        const { data: { user } } = await supabase.auth.getUser();
        await supabase.from("save_requests").insert({ template: activeTemplate, print_id: printId, user_id: user?.id ?? null, bill_data: { ...data, items } });
      } catch (_) {}

      await new Promise((resolve) => {
        root.render(<PreviewComponent data={data} items={items} />);
        setTimeout(resolve, 300);
      });
      if (document.fonts && document.fonts.ready) {
        try { await document.fonts.ready; } catch (_) {}
      }

      const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: "#FBFAF6", logging: false });

      if (format === "png") {
        const link = document.createElement("a");
        link.href = canvas.toDataURL("image/png");
        link.download = `restaurant-bill-${data.billNo}.png`;
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
        pdf.save(`restaurant-bill-${data.billNo}.pdf`);
      }
    } catch (err) {
      alert("Save failed: " + (err?.message || "Unknown error"));
    } finally {
      root.unmount();
      document.body.removeChild(container);
      setDownloading(false);
    }
  };

  const handleBulkClick = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setModal("login"); }
      else { setModalUser(user); setModal("bulk"); }
    } catch (err) {
      setModal("login");
    }
  };

  return (
    <>
      <Helmet>
        <title>Free Restaurant Bill Generator — Food Receipt with CGST/SGST | OpsTools</title>
        <meta name="description" content="Generate restaurant bills with table number, menu items, CGST and SGST. Free, no login, instant PDF." />
      </Helmet>
      <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
        <style>{`
          @media(max-width:1023px){.preview-col{position:static!important;}}
          @media(max-width:768px){.rb-tool-padding{padding-left:16px!important;padding-right:16px!important;}.rb-hero-padding{padding:28px 16px 24px!important;}}
          .rb-tool-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
          @media(min-width:1024px){ .rb-tool-grid { grid-template-columns: 1fr 320px; gap: 28px; } }
          @media print{.no-print{display:none!important;}}
        `}</style>

        {modal === "login" && <LoginPromptModal onClose={() => setModal(null)} />}
        {modal === "bulk" && modalUser && <BulkGenerateModal user={modalUser} stationData={data} activeTemplate={activeTemplate} onClose={() => setModal(null)} />}

        <section style={{ background: "linear-gradient(160deg,#07011F 0%,#431407 100%)" }} className="rb-hero-padding no-print">
          <div style={{ padding: "40px 24px 36px", maxWidth: 1280, margin: "0 auto" }} className="rb-hero-padding">
            <nav style={{ marginBottom: 16, fontSize: 13, color: "#FDBA74" }}>
              <a href="/" style={{ color: "#FDBA74", textDecoration: "none" }}>Home</a><span style={{ margin: "0 8px" }}>›</span>
              <a href="/documents" style={{ color: "#FDBA74", textDecoration: "none" }}>Documents</a><span style={{ margin: "0 8px" }}>›</span>
              <span style={{ color: "#FED7AA" }}>Restaurant Bill</span>
            </nav>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Restaurant Bill Generator</h1>
                <p style={{ fontSize: 14, color: "#FDBA74", margin: 0 }}>Choose a template, fill details — bill updates live.</p>
              </div>
              <button onClick={handleBulkClick} style={{ background: "rgba(255,255,255,0.08)", color: "#fff", border: "1.5px solid rgba(255,255,255,0.18)", padding: "10px 18px", borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: "pointer", display: "inline-flex", alignItems: "center", gap: 7, backdropFilter: "blur(8px)" }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></svg>
                Generate in Bulk
              </button>
            </div>
          </div>
        </section>

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }} className="rb-tool-padding no-print">
          <div className="rb-tool-grid">
            <div>
              <Section title="Restaurant Details">
                <Field label="Restaurant Name">
                  <input className={inputClass} value={data.restaurantName} onChange={e => upd("restaurantName", e.target.value)} placeholder="The Grand Restaurant" />
                </Field>
                <div style={{ height: 12 }} />
                <Field label="Address">
                  <input className={inputClass} value={data.address} onChange={e => upd("address", e.target.value)} />
                </Field>
                <div style={{ height: 12 }} />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <Field label="Phone"><input className={inputClass} value={data.phone} onChange={e => upd("phone", e.target.value)} /></Field>
                  <Field label="GSTIN"><input className={inputClass} value={data.gstin} onChange={e => upd("gstin", e.target.value)} /></Field>
                  <Field label="Logo URL"><input className={inputClass} value={data.logoUrl} onChange={e => upd("logoUrl", e.target.value)} placeholder="https://..." /></Field>
                </div>
              </Section>

              <Section title="Bill Details">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <Field label="Bill No."><input className={inputClass} value={data.billNo} onChange={e => upd("billNo", e.target.value)} /></Field>
                  <Field label="Date"><input className={inputClass} type="date" value={data.date} onChange={e => upd("date", e.target.value)} /></Field>
                  <Field label="Time"><input className={inputClass} type="time" value={data.time} onChange={e => upd("time", e.target.value)} /></Field>
                  <Field label="Table No."><input className={inputClass} value={data.tableNo} onChange={e => upd("tableNo", e.target.value)} placeholder="T-05" /></Field>
                  <Field label="Customer Name"><input className={inputClass} value={data.customerName} onChange={e => upd("customerName", e.target.value)} placeholder="Rajesh Sharma" /></Field>
                  <Field label="Payment Mode">
                    <select className={inputClass} value={data.paymentMode} onChange={e => upd("paymentMode", e.target.value)}>
                      <option>Cash</option><option>Card</option><option>UPI</option><option>Online</option>
                    </select>
                  </Field>
                  <Field label="Covers (pax)"><input className={inputClass} type="number" value={data.covers} onChange={e => upd("covers", e.target.value)} placeholder="2" /></Field>
                  <Field label="Waiter Name"><input className={inputClass} value={data.waiter} onChange={e => upd("waiter", e.target.value)} placeholder="Ramesh" /></Field>
                </div>
              </Section>

              <Section title="Tax & Charges">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12 }}>
                  <Field label="CGST %"><input className={inputClass} type="number" value={data.cgst} onChange={e => upd("cgst", e.target.value)} /></Field>
                  <Field label="SGST %"><input className={inputClass} type="number" value={data.sgst} onChange={e => upd("sgst", e.target.value)} /></Field>
                  <Field label="Service Charge %"><input className={inputClass} type="number" value={data.serviceCharge} onChange={e => upd("serviceCharge", e.target.value)} /></Field>
                </div>
              </Section>

              <Section title="Menu Items">
                {items.map((item, idx) => (
                  <div key={item.id} style={{ background: "#F8FAFC", borderRadius: 12, padding: "12px 14px", marginBottom: 10, border: "1px solid #E2E8F0", position: "relative" }}>
                    {items.length > 1 && (
                      <button onClick={() => setItems(p => p.filter(i => i.id !== item.id))} style={{ position: "absolute", top: 8, right: 8, background: "#FEF2F2", border: "none", borderRadius: 6, width: 24, height: 24, cursor: "pointer", color: "#DC2626", fontSize: 14 }}>×</button>
                    )}
                    <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr", gap: 8 }}>
                      <Field label={`Item ${idx + 1}`}><input className={inputClass} style={{ height: 38 }} value={item.name} onChange={e => updItem(item.id, "name", e.target.value)} placeholder="Paneer Butter Masala" /></Field>
                      <Field label="Qty"><input className={inputClass} style={{ height: 38 }} type="number" value={item.qty} onChange={e => updItem(item.id, "qty", Number(e.target.value))} /></Field>
                      <Field label="Rate ₹"><input className={inputClass} style={{ height: 38 }} type="number" value={item.rate} onChange={e => updItem(item.id, "rate", Number(e.target.value))} /></Field>
                    </div>
                  </div>
                ))}
                <button onClick={() => setItems(p => [...p, defaultItem()])} style={{ width: "100%", padding: 10, borderRadius: 10, border: "1.5px dashed #F97316", background: "#FFF7ED", color: "#EA580C", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add Item</button>
              </Section>

              <Section title="Footer Message">
                <Field label="Footer Note"><input className={inputClass} value={data.footer} onChange={e => upd("footer", e.target.value)} /></Field>
              </Section>
            </div>

            <div className="preview-col" style={{ position: "sticky", top: 96 }}>
              <div style={{ marginBottom: 20 }}>
                <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748B", marginBottom: 10 }}>Choose Template</p>
                <div style={{ display: "flex", gap: 8 }}>
                  {TEMPLATES.map((t, i) => (
                    <button key={t.id} onClick={() => setActiveTemplate(t.id)} title={t.label}
                      style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, border: activeTemplate === t.id ? "2px solid #EA580C" : "2px solid #E2E8F0", background: activeTemplate === t.id ? "#EA580C" : "#fff", color: activeTemplate === t.id ? "#fff" : "#0F172A", boxShadow: activeTemplate === t.id ? "0 2px 8px rgba(234,88,12,0.35)" : "none", fontSize: 15, fontWeight: 700, cursor: "pointer", transition: "all 0.15s" }}>
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
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                  <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748B", margin: 0 }}>Live Preview</p>
                  <SaveMenu onSave={doDownload} downloading={downloading} small />
                </div>
                <ScaledPreview>
                  <PreviewComponent data={data} items={items} />
                </ScaledPreview>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
