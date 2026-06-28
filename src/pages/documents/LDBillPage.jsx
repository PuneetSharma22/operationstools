import { useState, useRef } from "react";
import { supabase } from "../../supabase-public.js";

// ─── Number to words ──────────────────────────────────────────────────────────
function numberToWords(n) {
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  if (n === 0) return "Zero";
  const convert = (num) => {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num / 10)] + (num % 10 ? " " + ones[num % 10] : "");
    if (num < 1000) return ones[Math.floor(num / 100)] + " Hundred" + (num % 100 ? " " + convert(num % 100) : "");
    if (num < 100000) return convert(Math.floor(num / 1000)) + " Thousand" + (num % 1000 ? " " + convert(num % 1000) : "");
    if (num < 10000000) return convert(Math.floor(num / 100000)) + " Lakh" + (num % 100000 ? " " + convert(num % 100000) : "");
    return convert(Math.floor(num / 10000000)) + " Crore" + (n % 10000000 ? " " + convert(n % 10000000) : "");
  };
  const rupees = Math.floor(n);
  const paise = Math.round((n - rupees) * 100);
  let words = convert(rupees) + " Rupees";
  if (paise > 0) words += " and " + convert(paise) + " Paise";
  return words + " Only";
}

// ─── Default data ─────────────────────────────────────────────────────────────
const defaultSupplier = {
  name: "",
  address: "",
  gstin: "",
  email: "",
  phone: "",
};

const defaultRecipient = {
  name: "",
  email: "",
  address: "",
  phone: "",
  gstin: "",
};

const defaultItem = () => ({
  id: Date.now(),
  description: "",
  hsn: "998433",
  qty: 1,
  rate: 0,
  cgst: 9,
  sgst: 9,
  igst: 0,
});

const defaultBill = {
  invoiceNumber: `IN${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`,
  invoiceDate: new Date().toISOString().split("T")[0],
  logoUrl: "",
  gstType: "cgst_sgst", // or "igst"
  notes: "This is a system generated receipt and does not require signature.",
};

// ─── Input component ──────────────────────────────────────────────────────────
function Field({ label, value, onChange, placeholder, type = "text", small }) {
  return (
    <div style={{ marginBottom: small ? 8 : 12 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
      <input
        type={type} value={value} placeholder={placeholder}
        onChange={e => onChange(e.target.value)}
        style={{ width: "100%", height: small ? 32 : 38, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 10px", fontSize: 13, color: "#0F172A", outline: "none", boxSizing: "border-box", background: "#fff" }}
        onFocus={e => e.target.style.borderColor = "#2563EB"}
        onBlur={e => e.target.style.borderColor = "#E2E8F0"}
      />
    </div>
  );
}

// ─── Bill Preview ─────────────────────────────────────────────────────────────
function BillPreview({ bill, supplier, recipient, items }) {
  const subtotal = items.reduce((s, item) => s + item.qty * item.rate, 0);
  const totalTax = items.reduce((s, item) => {
    const base = item.qty * item.rate;
    return s + (base * (item.cgst + item.sgst + item.igst) / 100);
  }, 0);
  const grandTotal = subtotal + totalTax;

  return (
    <div style={{ background: "#fff", fontFamily: "Georgia, serif", fontSize: 13, color: "#1a1a1a", padding: "40px 48px", minHeight: 900 }}>

      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        {/* Logo */}
        <div style={{ maxWidth: 200 }}>
          {bill.logoUrl ? (
            <img src={bill.logoUrl} alt="Logo" style={{ maxHeight: 60, maxWidth: 180, objectFit: "contain" }} />
          ) : (
            <div style={{ width: 160, height: 52, background: "#F1F5F9", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, color: "#94A3B8", fontFamily: "sans-serif" }}>
              Logo URL in form
            </div>
          )}
        </div>
        {/* Invoice type */}
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 10, fontWeight: 700, color: "#64748B", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "sans-serif", marginBottom: 4 }}>Original for Recipient</div>
          <div style={{ fontSize: 26, fontWeight: 900, color: "#1a1a1a", letterSpacing: "-0.01em", fontFamily: "sans-serif" }}>TAX INVOICE</div>
          <div style={{ fontSize: 12, color: "#374151", marginTop: 8, fontFamily: "sans-serif" }}>
            <div><strong>Invoice #</strong> : {bill.invoiceNumber}</div>
            <div><strong>Invoice date</strong> : {bill.invoiceDate ? new Date(bill.invoiceDate).toLocaleDateString("en-IN") : "—"}</div>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div style={{ borderTop: "1.5px solid #E2E8F0", marginBottom: 24 }} />

      {/* Supplier + Recipient */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#7C3AED", marginBottom: 10, fontFamily: "sans-serif" }}>Supplier details</div>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{supplier.name || "Supplier Name"}</div>
          <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-line" }}>
            {supplier.address}{supplier.address && "\n"}
            {supplier.gstin && `GSTIN: ${supplier.gstin}`}{supplier.gstin && "\n"}
            {supplier.email}{supplier.phone && " | " + supplier.phone}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 16, fontWeight: 700, color: "#7C3AED", marginBottom: 10, fontFamily: "sans-serif" }}>Recipient details:</div>
          <div style={{ fontWeight: 700, fontSize: 13, marginBottom: 4 }}>{recipient.name || "Recipient Name"}</div>
          <div style={{ fontSize: 12, color: "#374151", lineHeight: 1.7, whiteSpace: "pre-line" }}>
            {recipient.email}{recipient.email && "\n"}
            {recipient.address}{recipient.address && "\n"}
            {recipient.gstin && `GSTIN: ${recipient.gstin}\n`}
            {recipient.phone}
          </div>
        </div>
      </div>

      {/* Line items table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 24, fontFamily: "sans-serif" }}>
        <thead>
          <tr style={{ background: "#F8FAFC", borderBottom: "1.5px solid #E2E8F0" }}>
            {["Description", "HSN code", "Qty.", "Taxable Value", bill.gstType === "igst" ? "IGST" : "CGST", bill.gstType === "igst" ? "" : "SGST/UGST", "Total amount"].filter(Boolean).map(h => (
              <th key={h} style={{ padding: "10px 12px", fontSize: 12, fontWeight: 700, color: "#374151", textAlign: h === "Description" ? "left" : "right" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const base = item.qty * item.rate;
            const cgstAmt = base * item.cgst / 100;
            const sgstAmt = base * item.sgst / 100;
            const igstAmt = base * item.igst / 100;
            const total = base + cgstAmt + sgstAmt + igstAmt;
            return (
              <tr key={item.id} style={{ borderBottom: "1px solid #F1F5F9", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                <td style={{ padding: "14px 12px", fontSize: 13 }}>{item.description || "—"}</td>
                <td style={{ padding: "14px 12px", fontSize: 13, textAlign: "right" }}>{item.hsn}</td>
                <td style={{ padding: "14px 12px", fontSize: 13, textAlign: "right" }}>{item.qty}.0</td>
                <td style={{ padding: "14px 12px", fontSize: 13, textAlign: "right" }}>{base.toFixed(2)}</td>
                {bill.gstType === "igst" ? (
                  <td style={{ padding: "14px 12px", fontSize: 13, textAlign: "right" }}>{igstAmt.toFixed(2)}</td>
                ) : (
                  <>
                    <td style={{ padding: "14px 12px", fontSize: 13, textAlign: "right" }}>{cgstAmt.toFixed(2)}</td>
                    <td style={{ padding: "14px 12px", fontSize: 13, textAlign: "right" }}>{sgstAmt.toFixed(2)}</td>
                  </>
                )}
                <td style={{ padding: "14px 12px", fontSize: 13, fontWeight: 600, textAlign: "right" }}>{total.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Subtotal */}
      <div style={{ borderTop: "1.5px solid #E2E8F0", paddingTop: 16, display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, fontFamily: "sans-serif", marginBottom: 4 }}>SUBTOTAL</div>
          <div style={{ fontSize: 12, color: "#475569", fontFamily: "sans-serif" }}>
            (in words): {numberToWords(Math.round(grandTotal * 100) / 100)}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 13, color: "#475569", marginBottom: 4, fontFamily: "sans-serif" }}>Subtotal: {subtotal.toFixed(2)}</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: "#1a1a1a", fontFamily: "sans-serif" }}>INR {grandTotal.toFixed(1)}</div>
        </div>
      </div>

      {/* Notes */}
      {bill.notes && (
        <>
          <div style={{ borderTop: "1px solid #E2E8F0", marginBottom: 16 }} />
          <p style={{ fontSize: 11, color: "#64748B", textAlign: "center", lineHeight: 1.7, fontFamily: "sans-serif" }}>{bill.notes}</p>
          <div style={{ borderBottom: "1px solid #E2E8F0", marginBottom: 16 }} />
        </>
      )}

      {/* Footer address */}
      {supplier.address && (
        <p style={{ fontSize: 11, color: "#64748B", textAlign: "center", fontFamily: "sans-serif" }}>
          {supplier.address}{supplier.gstin ? `  GSTIN: ${supplier.gstin}` : ""}
        </p>
      )}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function LDBillPage() {
  const [bill, setBill] = useState(defaultBill);
  const [supplier, setSupplier] = useState(defaultSupplier);
  const [recipient, setRecipient] = useState(defaultRecipient);
  const [items, setItems] = useState([defaultItem()]);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);

  const updateBill = (k, v) => setBill(p => ({ ...p, [k]: v }));
  const updateSupplier = (k, v) => setSupplier(p => ({ ...p, [k]: v }));
  const updateRecipient = (k, v) => setRecipient(p => ({ ...p, [k]: v }));
  const updateItem = (id, k, v) => setItems(p => p.map(i => i.id === id ? { ...i, [k]: v } : i));
  const addItem = () => setItems(p => [...p, defaultItem()]);
  const removeItem = (id) => setItems(p => p.filter(i => i.id !== id));

  const handleDownloadPDF = async () => {
    if (!previewRef.current || downloading) return;
    setDownloading(true);
    try {
      const printId = `LD-${Date.now()}-${Math.random().toString(36).substr(2,6).toUpperCase()}`;
      try { await supabase.from("print_requests").insert({ template: "ld-bill", print_id: printId, user_id: null }); } catch (_) {}
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false });
      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const pxToMm = 25.4 / (96 * 2);
      const naturalW = canvas.width * pxToMm;
      const naturalH = canvas.height * pxToMm;
      const scale = Math.min(pageW / naturalW, pageH / naturalH);
      const finalW = naturalW * scale;
      const finalH = naturalH * scale;
      const x = (pageW - finalW) / 2;
      pdf.addImage(imgData, "PNG", x, 0, finalW, finalH);
      pdf.save(`ld-invoice-${bill.invoiceNumber}.pdf`);
    } catch (err) {
      alert("PDF failed: " + err?.message);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <style>{`
        @media(max-width:768px){.ld-grid{grid-template-columns:1fr !important;} .ld-preview{display:none !important;} .ld-mobile-pdf{display:flex !important;}}
        @media(min-width:769px){.ld-mobile-pdf{display:none !important;}}
        @media print{.no-print{display:none !important;} body{background:#fff !important;}}
      `}</style>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0D0630 60%,#1e1b4b 100%)", padding: "40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <nav style={{ marginBottom: 16, fontSize: 13, color: "#475569" }}>
            <a href="/" style={{ color: "#475569", textDecoration: "none" }}>Home</a>
            <span style={{ margin: "0 8px" }}>›</span>
            <a href="/documents" style={{ color: "#475569", textDecoration: "none" }}>Documents</a>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#94A3B8" }}>L&D Bill Generator</span>
          </nav>
          <h1 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.02em" }}>
            Learning & Development Bill Generator
          </h1>
          <p style={{ fontSize: 14, color: "#94A3B8", margin: 0 }}>
            Generate professional tax invoices for training, courses, and L&D expenses — with CGST/SGST/IGST.
          </p>
        </div>
      </section>

      {/* Tool */}
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }} className="no-print">
        <div className="ld-grid" style={{ display: "grid", gridTemplateColumns: "1fr 520px", gap: 28, alignItems: "start" }}>

          {/* LEFT — Form */}
          <div>

            {/* Invoice meta */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 24px", marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Invoice Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Invoice Number" value={bill.invoiceNumber} onChange={v => updateBill("invoiceNumber", v)} placeholder="IN2026-123456" />
                <Field label="Invoice Date" value={bill.invoiceDate} onChange={v => updateBill("invoiceDate", v)} type="date" />
              </div>
              <Field label="Logo URL (paste public image URL)" value={bill.logoUrl} onChange={v => updateBill("logoUrl", v)} placeholder="https://example.com/logo.png" />
              <div>
                <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>GST Type</label>
                <div style={{ display: "flex", gap: 8 }}>
                  {[{ key: "cgst_sgst", label: "CGST + SGST (Intra-state)" }, { key: "igst", label: "IGST (Inter-state)" }].map(opt => (
                    <button key={opt.key} onClick={() => updateBill("gstType", opt.key)} style={{
                      flex: 1, padding: "9px 12px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
                      border: bill.gstType === opt.key ? "1.5px solid #7C3AED" : "1.5px solid #E2E8F0",
                      background: bill.gstType === opt.key ? "#F5F3FF" : "#fff",
                      color: bill.gstType === opt.key ? "#7C3AED" : "#64748B",
                    }}>{opt.label}</button>
                  ))}
                </div>
              </div>
            </div>

            {/* Supplier */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 24px", marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#7C3AED", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Supplier Details</h2>
              <Field label="Company / Institute Name" value={supplier.name} onChange={v => updateSupplier("name", v)} placeholder="e.g. Udemy India LLP" />
              <Field label="Address" value={supplier.address} onChange={v => updateSupplier("address", v)} placeholder="Floor, Building, City, State - PIN" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="GSTIN" value={supplier.gstin} onChange={v => updateSupplier("gstin", v)} placeholder="06AAFFU9763M1ZE" />
                <Field label="Email" value={supplier.email} onChange={v => updateSupplier("email", v)} placeholder="billing@company.com" />
              </div>
              <Field label="Phone" value={supplier.phone} onChange={v => updateSupplier("phone", v)} placeholder="+91 98765 43210" />
            </div>

            {/* Recipient */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 24px", marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#7C3AED", margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Recipient Details</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Full Name" value={recipient.name} onChange={v => updateRecipient("name", v)} placeholder="Rajesh Sharma" />
                <Field label="Email" value={recipient.email} onChange={v => updateRecipient("email", v)} placeholder="rajesh@company.com" />
              </div>
              <Field label="Address" value={recipient.address} onChange={v => updateRecipient("address", v)} placeholder="Block, Area, City, State - PIN" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Phone" value={recipient.phone} onChange={v => updateRecipient("phone", v)} placeholder="+91 98765 43210" />
                <Field label="GSTIN (optional)" value={recipient.gstin} onChange={v => updateRecipient("gstin", v)} placeholder="29ABCDE1234F1Z5" />
              </div>
            </div>

            {/* Line items */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 24px", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Line Items</h2>
                <button onClick={addItem} style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 14px", borderRadius: 8, border: "1.5px solid #7C3AED", background: "#F5F3FF", color: "#7C3AED", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                  + Add Item
                </button>
              </div>
              {items.map((item, idx) => (
                <div key={item.id} style={{ background: "#F8FAFC", borderRadius: 12, padding: "16px", marginBottom: 12, position: "relative", border: "1px solid #E2E8F0" }}>
                  {items.length > 1 && (
                    <button onClick={() => removeItem(item.id)} style={{ position: "absolute", top: 10, right: 10, background: "#FEF2F2", border: "none", borderRadius: 6, width: 24, height: 24, cursor: "pointer", color: "#DC2626", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center" }}>×</button>
                  )}
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 10, textTransform: "uppercase", letterSpacing: "0.06em" }}>Item {idx + 1}</div>
                  <Field label="Description" value={item.description} onChange={v => updateItem(item.id, "description", v)} placeholder="e.g. Leadership with AI" small />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    <Field label="HSN Code" value={item.hsn} onChange={v => updateItem(item.id, "hsn", v)} placeholder="998433" small />
                    <Field label="Qty" value={item.qty} onChange={v => updateItem(item.id, "qty", Number(v))} type="number" small />
                    <Field label="Rate (₹)" value={item.rate} onChange={v => updateItem(item.id, "rate", Number(v))} type="number" small />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                    {bill.gstType === "cgst_sgst" ? (
                      <>
                        <Field label="CGST %" value={item.cgst} onChange={v => updateItem(item.id, "cgst", Number(v))} type="number" small />
                        <Field label="SGST %" value={item.sgst} onChange={v => updateItem(item.id, "sgst", Number(v))} type="number" small />
                      </>
                    ) : (
                      <Field label="IGST %" value={item.igst} onChange={v => updateItem(item.id, "igst", Number(v))} type="number" small />
                    )}
                    <div style={{ paddingTop: 20, fontSize: 13, fontWeight: 700, color: "#7C3AED" }}>
                      = ₹{(item.qty * item.rate * (1 + (bill.gstType === "igst" ? item.igst : item.cgst + item.sgst) / 100)).toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 24px", marginBottom: 16 }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Footer Note</h2>
              <textarea value={bill.notes} onChange={e => updateBill("notes", e.target.value)}
                rows={2} style={{ width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#0F172A", resize: "vertical", boxSizing: "border-box", outline: "none" }} />
            </div>

            {/* Mobile PDF button */}
            <button onClick={handleDownloadPDF} disabled={downloading} className="ld-mobile-pdf"
              style={{ width: "100%", height: 48, borderRadius: 12, border: "none", background: "linear-gradient(135deg,#7C3AED,#4F46E5)", color: "#fff", fontSize: 15, fontWeight: 700, cursor: downloading ? "wait" : "pointer", opacity: downloading ? 0.7 : 1, alignItems: "center", justifyContent: "center", gap: 8 }}>
              {downloading ? "Saving…" : "Save PDF"}
            </button>
          </div>

          {/* RIGHT — Preview */}
          <div className="ld-preview" style={{ position: "sticky", top: 88 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748B", margin: 0 }}>Live Preview</p>
              <button onClick={handleDownloadPDF} disabled={downloading} style={{
                background: "linear-gradient(135deg,#7C3AED,#4F46E5)", border: "none", borderRadius: 8, padding: "6px 16px",
                color: "#fff", fontSize: 13, fontWeight: 600, cursor: downloading ? "wait" : "pointer", opacity: downloading ? 0.7 : 1,
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="7 10 12 15 17 10"/>
                  <line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                {downloading ? "Saving…" : "Save PDF"}
              </button>
            </div>
            <div style={{ transform: "scale(0.72)", transformOrigin: "top left", width: "139%", marginBottom: "-28%" }}>
              <div ref={previewRef}>
                <BillPreview bill={bill} supplier={supplier} recipient={recipient} items={items} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
