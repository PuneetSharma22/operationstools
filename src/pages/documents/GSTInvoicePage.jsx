import { useState, useRef } from "react";
import { supabase } from "../../supabase-public.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function numberToWords(n) {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  if (n === 0) return "Zero";
  const convert = (num) => {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num/10)] + (num%10 ? " "+ones[num%10] : "");
    if (num < 1000) return ones[Math.floor(num/100)] + " Hundred" + (num%100 ? " "+convert(num%100) : "");
    if (num < 100000) return convert(Math.floor(num/1000)) + " Thousand" + (num%1000 ? " "+convert(num%1000) : "");
    if (num < 10000000) return convert(Math.floor(num/100000)) + " Lakh" + (num%100000 ? " "+convert(num%100000) : "");
    return convert(Math.floor(num/10000000)) + " Crore" + (n%10000000 ? " "+convert(n%10000000) : "");
  };
  const rupees = Math.floor(n);
  const paise = Math.round((n - rupees) * 100);
  return convert(rupees) + " Rupees" + (paise > 0 ? " and " + convert(paise) + " Paise" : "") + " Only";
}

function Field({ label, value, onChange, placeholder, type="text", small, readOnly }) {
  return (
    <div style={{ marginBottom: small ? 8 : 12 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder} readOnly={readOnly}
        onChange={e => onChange && onChange(e.target.value)}
        style={{ width: "100%", height: small ? 32 : 38, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 10px", fontSize: 13, color: "#0F172A", outline: "none", boxSizing: "border-box", background: readOnly ? "#F8FAFC" : "#fff" }}
        onFocus={e => { if (!readOnly) e.target.style.borderColor = "#10B981"; }}
        onBlur={e => { if (!readOnly) e.target.style.borderColor = "#E2E8F0"; }}
      />
    </div>
  );
}

const defaultItem = () => ({ id: Date.now() + Math.random(), description: "", hsn: "", qty: 1, rate: 0, gstRate: 18 });

// ─── GST Invoice Preview ──────────────────────────────────────────────────────
function GSTPreview({ data, supplier, buyer, items }) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const totalTax = items.reduce((s, i) => s + i.qty * i.rate * i.gstRate / 100, 0);
  const grandTotal = subtotal + totalTax;

  return (
    <div style={{ background: "#fff", fontFamily: "Arial, sans-serif", fontSize: 12, color: "#1a1a1a", padding: "32px 40px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 16, borderBottom: "2px solid #059669" }}>
        <div>
          {data.logoUrl ? <img src={data.logoUrl} alt="logo" style={{ maxHeight: 52, maxWidth: 160, objectFit: "contain", marginBottom: 8, display: "block" }} /> : null}
          <div style={{ fontSize: 18, fontWeight: 800, color: "#059669", letterSpacing: "-0.01em" }}>{supplier.name || "Your Business Name"}</div>
          <div style={{ fontSize: 11, color: "#475569", marginTop: 3, lineHeight: 1.6 }}>
            {supplier.address && <div>{supplier.address}</div>}
            {supplier.gstin && <div>GSTIN: <strong>{supplier.gstin}</strong></div>}
            {supplier.pan && <div>PAN: {supplier.pan}</div>}
            {supplier.email && <div>{supplier.email}</div>}
            {supplier.phone && <div>{supplier.phone}</div>}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: "#0F172A", letterSpacing: "-0.02em", marginBottom: 8 }}>TAX INVOICE</div>
          <div style={{ background: "#ECFDF5", border: "1px solid #6EE7B7", borderRadius: 8, padding: "10px 16px", fontSize: 12 }}>
            <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
              <span style={{ color: "#64748B" }}>Invoice No.</span>
              <strong>{data.invoiceNo || "—"}</strong>
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "flex-end", marginTop: 4 }}>
              <span style={{ color: "#64748B" }}>Date</span>
              <strong>{data.invoiceDate ? new Date(data.invoiceDate).toLocaleDateString("en-IN") : "—"}</strong>
            </div>
            {data.dueDate && <div style={{ display: "flex", gap: 16, justifyContent: "flex-end", marginTop: 4 }}>
              <span style={{ color: "#64748B" }}>Due Date</span>
              <strong>{new Date(data.dueDate).toLocaleDateString("en-IN")}</strong>
            </div>}
            <div style={{ display: "flex", gap: 16, justifyContent: "flex-end", marginTop: 4 }}>
              <span style={{ color: "#64748B" }}>Place of Supply</span>
              <strong>{data.placeOfSupply || "—"}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Buyer */}
      <div style={{ background: "#F8FAFC", borderRadius: 8, padding: "12px 16px", marginBottom: 20, border: "1px solid #E2E8F0" }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Bill To</div>
        <div style={{ fontWeight: 700, fontSize: 13 }}>{buyer.name || "Buyer Name"}</div>
        <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.7, marginTop: 2 }}>
          {buyer.address && <span>{buyer.address}<br/></span>}
          {buyer.gstin && <span>GSTIN: {buyer.gstin}<br/></span>}
          {buyer.email && <span>{buyer.email}</span>}
          {buyer.phone && <span>  ·  {buyer.phone}</span>}
        </div>
      </div>

      {/* Items table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
        <thead>
          <tr style={{ background: "#059669", color: "#fff" }}>
            {["#","Description","HSN/SAC","Qty","Rate (₹)","Taxable Amt","GST %","GST Amt","Total (₹)"].map(h => (
              <th key={h} style={{ padding: "8px 10px", fontSize: 10, fontWeight: 700, textAlign: h==="Description" ? "left" : "right", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const taxable = item.qty * item.rate;
            const gstAmt = taxable * item.gstRate / 100;
            const total = taxable + gstAmt;
            return (
              <tr key={item.id} style={{ borderBottom: "1px solid #E2E8F0", background: i%2===0 ? "#fff" : "#F8FAFC" }}>
                <td style={{ padding: "9px 10px", textAlign: "right", color: "#94A3B8" }}>{i+1}</td>
                <td style={{ padding: "9px 10px" }}>{item.description || "—"}</td>
                <td style={{ padding: "9px 10px", textAlign: "right", color: "#64748B" }}>{item.hsn || "—"}</td>
                <td style={{ padding: "9px 10px", textAlign: "right" }}>{item.qty}</td>
                <td style={{ padding: "9px 10px", textAlign: "right" }}>{item.rate.toFixed(2)}</td>
                <td style={{ padding: "9px 10px", textAlign: "right" }}>{taxable.toFixed(2)}</td>
                <td style={{ padding: "9px 10px", textAlign: "right" }}>{item.gstRate}%</td>
                <td style={{ padding: "9px 10px", textAlign: "right" }}>{gstAmt.toFixed(2)}</td>
                <td style={{ padding: "9px 10px", textAlign: "right", fontWeight: 700 }}>{total.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <div style={{ width: 260 }}>
          {[["Subtotal", subtotal], ["Total GST", totalTax]].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: "1px solid #F1F5F9", fontSize: 12 }}>
              <span style={{ color: "#64748B" }}>{label}</span>
              <span>₹{val.toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: "#059669", color: "#fff", borderRadius: 8, marginTop: 8, fontSize: 14, fontWeight: 800 }}>
            <span>Grand Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Amount in words */}
      <div style={{ background: "#ECFDF5", borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 11, color: "#065F46" }}>
        <strong>Amount in words:</strong> {numberToWords(Math.round(grandTotal * 100) / 100)}
      </div>

      {/* Bank details + notes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {(data.bankName || data.accountNo || data.ifsc) && (
          <div style={{ border: "1px solid #E2E8F0", borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Bank Details</div>
            {data.bankName && <div style={{ fontSize: 11, marginBottom: 3 }}><span style={{ color: "#64748B" }}>Bank: </span>{data.bankName}</div>}
            {data.accountNo && <div style={{ fontSize: 11, marginBottom: 3 }}><span style={{ color: "#64748B" }}>A/C No: </span>{data.accountNo}</div>}
            {data.ifsc && <div style={{ fontSize: 11, marginBottom: 3 }}><span style={{ color: "#64748B" }}>IFSC: </span>{data.ifsc}</div>}
            {data.upi && <div style={{ fontSize: 11 }}><span style={{ color: "#64748B" }}>UPI: </span>{data.upi}</div>}
          </div>
        )}
        {data.notes && (
          <div style={{ border: "1px solid #E2E8F0", borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: "#059669", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Notes</div>
            <div style={{ fontSize: 11, color: "#475569", lineHeight: 1.7 }}>{data.notes}</div>
          </div>
        )}
      </div>

      {/* Signature */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 140, height: 48, borderBottom: "1px solid #CBD5E1", marginBottom: 6 }} />
          <div style={{ fontSize: 11, color: "#64748B" }}>Authorised Signatory</div>
          <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2 }}>{supplier.name || ""}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GSTInvoicePage() {
  const [data, setData] = useState({
    invoiceNo: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`,
    invoiceDate: new Date().toISOString().split("T")[0],
    dueDate: "", placeOfSupply: "", logoUrl: "",
    bankName: "", accountNo: "", ifsc: "", upi: "", notes: "Thank you for your business.",
  });
  const [supplier, setSupplier] = useState({ name: "", address: "", gstin: "", pan: "", email: "", phone: "" });
  const [buyer, setBuyer] = useState({ name: "", address: "", gstin: "", email: "", phone: "" });
  const [items, setItems] = useState([defaultItem()]);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);

  const upd = (setter) => (k, v) => setter(p => ({ ...p, [k]: v }));
  const updItem = (id, k, v) => setItems(p => p.map(i => i.id === id ? { ...i, [k]: v } : i));

  const handlePDF = async () => {
    if (!previewRef.current || downloading) return;
    setDownloading(true);
    try {
      try { await supabase.from("print_requests").insert({ template: "gst-invoice", print_id: `GST-${Date.now()}`, user_id: null }); } catch (_) {}
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(previewRef.current, { scale: 2, useCORS: true, backgroundColor: "#ffffff", logging: false });
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight();
      const pxmm = 25.4/(96*2);
      const scale = Math.min(pw/(canvas.width*pxmm), ph/(canvas.height*pxmm));
      const fw = canvas.width*pxmm*scale, fh = canvas.height*pxmm*scale;
      pdf.addImage(canvas.toDataURL("image/png"), "PNG", (pw-fw)/2, 0, fw, fh);
      pdf.save(`gst-invoice-${data.invoiceNo}.pdf`);
    } catch (e) { alert("PDF failed: " + e?.message); }
    finally { setDownloading(false); }
  };

  const Section = ({ title, children, accent = "#10B981" }) => (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 24px", marginBottom: 16 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, color: accent, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <style>{`@media(max-width:768px){.gst-grid{grid-template-columns:1fr !important;}.gst-prev{display:none !important;}}@media print{.no-print{display:none !important;}}`}</style>

      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#064e3b 100%)", padding: "40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <nav style={{ marginBottom: 16, fontSize: 13, color: "#6EE7B7" }}>
            <a href="/" style={{ color: "#6EE7B7", textDecoration: "none" }}>Home</a>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#A7F3D0" }}>GST Invoice</span>
          </nav>
          <h1 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.02em" }}>GST Invoice Generator</h1>
          <p style={{ fontSize: 14, color: "#6EE7B7", margin: 0 }}>Generate GST-compliant tax invoices with CGST/SGST, line items, bank details and PDF download.</p>
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }} className="no-print">
        <div className="gst-grid" style={{ display: "grid", gridTemplateColumns: "1fr 500px", gap: 28, alignItems: "start" }}>
          <div>
            <Section title="Invoice Details">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Invoice No." value={data.invoiceNo} onChange={v => upd(setData)("invoiceNo",v)} />
                <Field label="Invoice Date" value={data.invoiceDate} onChange={v => upd(setData)("invoiceDate",v)} type="date" />
                <Field label="Due Date" value={data.dueDate} onChange={v => upd(setData)("dueDate",v)} type="date" />
                <Field label="Place of Supply" value={data.placeOfSupply} onChange={v => upd(setData)("placeOfSupply",v)} placeholder="e.g. Maharashtra" />
              </div>
              <Field label="Logo URL" value={data.logoUrl} onChange={v => upd(setData)("logoUrl",v)} placeholder="https://..." />
            </Section>

            <Section title="Your Business (Supplier)" accent="#10B981">
              <Field label="Business Name" value={supplier.name} onChange={v => upd(setSupplier)("name",v)} placeholder="Your Company Pvt Ltd" />
              <Field label="Address" value={supplier.address} onChange={v => upd(setSupplier)("address",v)} placeholder="Street, City, State - PIN" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="GSTIN" value={supplier.gstin} onChange={v => upd(setSupplier)("gstin",v)} placeholder="27ABCDE1234F1Z5" />
                <Field label="PAN" value={supplier.pan} onChange={v => upd(setSupplier)("pan",v)} placeholder="ABCDE1234F" />
                <Field label="Email" value={supplier.email} onChange={v => upd(setSupplier)("email",v)} placeholder="billing@company.com" />
                <Field label="Phone" value={supplier.phone} onChange={v => upd(setSupplier)("phone",v)} placeholder="+91 98765 43210" />
              </div>
            </Section>

            <Section title="Bill To (Buyer)" accent="#10B981">
              <Field label="Buyer Name" value={buyer.name} onChange={v => upd(setBuyer)("name",v)} placeholder="Client Company / Person" />
              <Field label="Address" value={buyer.address} onChange={v => upd(setBuyer)("address",v)} placeholder="Street, City, State - PIN" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="GSTIN" value={buyer.gstin} onChange={v => upd(setBuyer)("gstin",v)} placeholder="27ABCDE1234F1Z5" />
                <Field label="Email" value={buyer.email} onChange={v => upd(setBuyer)("email",v)} placeholder="client@company.com" />
              </div>
            </Section>

            <Section title="Line Items">
              {items.map((item, idx) => (
                <div key={item.id} style={{ background: "#F8FAFC", borderRadius: 12, padding: "14px 16px", marginBottom: 10, border: "1px solid #E2E8F0", position: "relative" }}>
                  {items.length > 1 && <button onClick={() => setItems(p => p.filter(i => i.id !== item.id))} style={{ position: "absolute", top: 10, right: 10, background: "#FEF2F2", border: "none", borderRadius: 6, width: 24, height: 24, cursor: "pointer", color: "#DC2626", fontSize: 14 }}>×</button>}
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 8, textTransform: "uppercase" }}>Item {idx + 1}</div>
                  <Field label="Description" value={item.description} onChange={v => updItem(item.id,"description",v)} placeholder="Service / Product name" small />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                    <Field label="HSN/SAC" value={item.hsn} onChange={v => updItem(item.id,"hsn",v)} placeholder="998311" small />
                    <Field label="Qty" value={item.qty} onChange={v => updItem(item.id,"qty",Number(v))} type="number" small />
                    <Field label="Rate ₹" value={item.rate} onChange={v => updItem(item.id,"rate",Number(v))} type="number" small />
                    <Field label="GST %" value={item.gstRate} onChange={v => updItem(item.id,"gstRate",Number(v))} type="number" small />
                  </div>
                  <div style={{ fontSize: 12, color: "#10B981", fontWeight: 700, marginTop: 6 }}>
                    Total: ₹{(item.qty * item.rate * (1 + item.gstRate/100)).toFixed(2)}
                  </div>
                </div>
              ))}
              <button onClick={() => setItems(p => [...p, defaultItem()])} style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1.5px dashed #10B981", background: "#ECFDF5", color: "#059669", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                + Add Line Item
              </button>
            </Section>

            <Section title="Bank Details (Optional)">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Bank Name" value={data.bankName} onChange={v => upd(setData)("bankName",v)} placeholder="HDFC Bank" />
                <Field label="Account No." value={data.accountNo} onChange={v => upd(setData)("accountNo",v)} placeholder="1234567890" />
                <Field label="IFSC Code" value={data.ifsc} onChange={v => upd(setData)("ifsc",v)} placeholder="HDFC0001234" />
                <Field label="UPI ID" value={data.upi} onChange={v => upd(setData)("upi",v)} placeholder="yourname@upi" />
              </div>
            </Section>

            <Section title="Notes">
              <textarea value={data.notes} onChange={e => upd(setData)("notes",e.target.value)} rows={2}
                style={{ width: "100%", border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "8px 12px", fontSize: 13, color: "#0F172A", resize: "vertical", boxSizing: "border-box", outline: "none" }} />
            </Section>
          </div>

          <div className="gst-prev" style={{ position: "sticky", top: 88 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748B", margin: 0 }}>Live Preview</p>
              <button onClick={handlePDF} disabled={downloading} style={{ background: "linear-gradient(135deg,#059669,#10B981)", border: "none", borderRadius: 8, padding: "6px 16px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: downloading ? "wait" : "pointer", opacity: downloading ? 0.7 : 1 }}>
                {downloading ? "Saving…" : "Save PDF"}
              </button>
            </div>
            <div style={{ transform: "scale(0.68)", transformOrigin: "top left", width: "147%", marginBottom: "-32%" }}>
              <div ref={previewRef}><GSTPreview data={data} supplier={supplier} buyer={buyer} items={items} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
