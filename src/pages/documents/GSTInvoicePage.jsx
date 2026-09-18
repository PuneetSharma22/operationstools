import { useState } from "react";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";
import SaveMenu from "../../components/common/SaveMenu";
import { exportSingleDocument } from "../../utils/documentExport";
import { logSaveRequest } from "../../utils/saveLog";

const TAINTED_HINT = "the logo image doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again.";

// Neutral document palette — a printed tax invoice should read like a normal
// statutory document, not a brand-colour showcase. BRAND is reserved for
// interactive form chrome (focus rings, "+ Add" buttons), never for the
// invoice preview itself.
const INK = "#0F172A";
const INK_SOFT = "#475569";
const INK_MUTED = "#64748B";
const BORDER = "#E2E8F0";
const SURFACE = "#F8FAFC";
const SURFACE_ALT = "#F1F5F9";
const BRAND = "#2563EB";

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

const todayISO = () => new Date().toISOString().split("T")[0];
const daysFromNowISO = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().split("T")[0]; };

// ─── SEO ─────────────────────────────────────────────────────────────────────
const SEO_TITLE = "Free GST Invoice Generator Online — Tax Invoice with HSN Codes (2026)";
const SEO_DESCRIPTION = "Generate a GST-compliant tax invoice online for free. HSN codes, CGST/SGST/IGST, place of supply, and amount in words. No login. Instant PDF.";
const CANONICAL = "https://www.opstools.ai/documents/gst-invoice";
const softwareAppSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "OpsTools GST Invoice Generator", operatingSystem: "Web", applicationCategory: "BusinessApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, description: SEO_DESCRIPTION, url: CANONICAL, provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" } };
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "Is this GST invoice generator free?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no login required. Generate unlimited invoices at no cost." } },
  { "@type": "Question", name: "What is an HSN code?", acceptedAnswer: { "@type": "Answer", text: "HSN (Harmonized System of Nomenclature) codes classify goods for GST purposes, and SAC codes classify services. Both are entered per line item on this generator." } },
  { "@type": "Question", name: "When do I use CGST+SGST vs IGST?", acceptedAnswer: { "@type": "Answer", text: "CGST + SGST apply when supplier and buyer are in the same state. IGST applies when they're in different states. Set the GST rate per item and the split is handled automatically based on place of supply." } },
  { "@type": "Question", name: "Does this generate amount in words?", acceptedAnswer: { "@type": "Answer", text: "Yes, the total is automatically converted to words, as required on a valid GST tax invoice." } },
] };
const INTRO = (<><p style={{ marginBottom: 16 }}>Issuing a GST-compliant tax invoice usually means either paying for accounting software or manually formatting one in Excel every time. OpsTools GST Invoice Generator gets you a proper tax invoice — HSN codes, GST breakdown, and amount in words — in under a minute, for free.</p><p style={{ marginBottom: 16 }}>Every field a valid GST invoice needs is here: supplier and buyer GSTIN, place of supply, HSN/SAC codes per line item, and the tax breakdown. The total converts to words automatically, as required for a valid tax invoice.</p><p>The preview updates live as you type. Download directly as a PDF — your data never leaves your browser.</p></>);
const WHAT_IS = `A GST invoice (tax invoice) is the document a GST-registered business issues for the supply of goods or services, showing the taxable value, applicable GST (CGST/SGST or IGST), and total amount. It's a mandatory record for both the supplier and buyer for GST compliance and input tax credit claims.`;
const WHY_USE = [
  { title: "GST-registered businesses", body: "Issue compliant tax invoices for every sale, with HSN codes and correct tax breakdown." },
  { title: "Small business owners", body: "Generate professional invoices without accounting software." },
  { title: "Freelancers & consultants", body: "Bill clients with a properly formatted GST invoice when registered." },
  { title: "Accounts teams", body: "Produce consistent, audit-ready invoices for every transaction." },
];
const FEATURES = [
  { icon: "🧾", title: "GST-compliant format", body: "GSTIN, HSN codes, place of supply, and tax breakdown — everything a valid invoice needs." },
  { icon: "🔀", title: "CGST/SGST or IGST", body: "Automatically split or apply GST based on your item-level rates." },
  { icon: "🔢", title: "Amount in words", body: "Total automatically converted to words." },
  { icon: "👁️", title: "Live preview", body: "See the invoice update in real time as you fill the form." },
  { icon: "⬇️", title: "Direct PDF download", body: "One click downloads the invoice as a PDF." },
  { icon: "🏷️", title: "Custom logo", body: "Paste any image URL to add your company logo." },
  { icon: "🔒", title: "100% private", body: "No data is stored or transmitted. Everything happens in your browser." },
];
const HOW_TO_STEPS = [
  { step: 1, title: "Enter invoice details", body: "Invoice number, date, due date, and place of supply." },
  { step: 2, title: "Add supplier & buyer", body: "Enter both parties' details, including GSTIN." },
  { step: 3, title: "Add line items", body: "List each item with HSN code, quantity, rate, and GST rate." },
  { step: 4, title: "Preview", body: "Check the live preview — the tax breakdown updates instantly." },
  { step: 5, title: "Download PDF", body: "Click Save and choose PDF to download the invoice." },
];
const BENEFITS = [
  "Generate unlimited GST invoices — no caps or credit limits.",
  "HSN codes and GST breakdown included on every line item.",
  "Amount in words auto-generated.",
  "No registration or sign-up required.",
  "All data stays in your browser — zero privacy risk.",
  "Completely free — no subscription.",
];
const FORMAT_FIELDS = [
  { field: "GSTIN", description: "15-character GST registration number", example: "27AABCU9603R1ZX" },
  { field: "HSN/SAC Code", description: "Classification code for the goods or service", example: "998314" },
  { field: "Place of Supply", description: "State where the supply is deemed to occur", example: "Maharashtra" },
  { field: "Taxable Value", description: "Pre-tax value of the line item", example: "₹10,000.00" },
  { field: "GST Rate", description: "Applicable GST percentage on the item", example: "18%" },
];
const FAQS = faqSchema.mainEntity.map((i) => ({ q: i.name, a: i.acceptedAnswer.text }));
const RELATED_DOCS = [
  { name: "E-Invoice Generator", href: "/documents/e-invoice", description: "GST e-invoice with IRN." },
  { name: "L&D Bill Generator", href: "/documents/ld-bill", description: "Tax invoices for training & courses." },
  { name: "Service Invoice Generator", href: "/documents/service-invoice", description: "Invoices for service-based businesses." },
];

function Field({ label, value, onChange, placeholder, type="text", small, readOnly }) {
  return (
    <div style={{ marginBottom: small ? 8 : 12 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: INK_MUTED, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder} readOnly={readOnly}
        onChange={e => onChange && onChange(e.target.value)}
        style={{ width: "100%", height: small ? 32 : 38, border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: "0 10px", fontSize: 13, color: INK, outline: "none", boxSizing: "border-box", background: readOnly ? SURFACE : "#fff" }}
        onFocus={e => { if (!readOnly) e.target.style.borderColor = BRAND; }}
        onBlur={e => { if (!readOnly) e.target.style.borderColor = BORDER; }}
      />
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${BORDER}`, padding: "20px 24px", marginBottom: 16 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, color: INK, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</h2>
      {children}
    </div>
  );
}

const defaultItem = () => ({ id: Date.now() + Math.random(), description: "", hsn: "", qty: 1, rate: 0, gstRate: 18 });

// ─── GST Invoice Preview ──────────────────────────────────────────────────────
function GSTPreview({ data }) {
  const { invoice, supplier, buyer, items } = data;
  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const totalTax = items.reduce((s, i) => s + i.qty * i.rate * i.gstRate / 100, 0);
  const grandTotal = subtotal + totalTax;

  return (
    <div style={{ background: "#fff", fontFamily: "Arial, sans-serif", fontSize: 12, color: "#1a1a1a", padding: "32px 40px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 16, borderBottom: `2px solid ${INK}` }}>
        <div>
          {invoice.logoUrl ? <img src={invoice.logoUrl} alt="logo" style={{ maxHeight: 52, maxWidth: 160, objectFit: "contain", marginBottom: 8, display: "block" }} /> : null}
          <div style={{ fontSize: 18, fontWeight: 800, color: INK, letterSpacing: "-0.01em" }}>{supplier.name || "Your Business Name"}</div>
          <div style={{ fontSize: 11, color: INK_SOFT, marginTop: 3, lineHeight: 1.6 }}>
            {supplier.address && <div>{supplier.address}</div>}
            {supplier.gstin && <div>GSTIN: <strong>{supplier.gstin}</strong></div>}
            {supplier.pan && <div>PAN: {supplier.pan}</div>}
            {supplier.email && <div>{supplier.email}</div>}
            {supplier.phone && <div>{supplier.phone}</div>}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: INK, letterSpacing: "-0.02em", marginBottom: 8 }}>TAX INVOICE</div>
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 16px", fontSize: 12 }}>
            <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
              <span style={{ color: INK_MUTED }}>Invoice No.</span>
              <strong>{invoice.invoiceNo || "—"}</strong>
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "flex-end", marginTop: 4 }}>
              <span style={{ color: INK_MUTED }}>Date</span>
              <strong>{invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString("en-IN") : "—"}</strong>
            </div>
            {invoice.dueDate && <div style={{ display: "flex", gap: 16, justifyContent: "flex-end", marginTop: 4 }}>
              <span style={{ color: INK_MUTED }}>Due Date</span>
              <strong>{new Date(invoice.dueDate).toLocaleDateString("en-IN")}</strong>
            </div>}
            <div style={{ display: "flex", gap: 16, justifyContent: "flex-end", marginTop: 4 }}>
              <span style={{ color: INK_MUTED }}>Place of Supply</span>
              <strong>{invoice.placeOfSupply || "—"}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Buyer */}
      <div style={{ background: SURFACE, borderRadius: 8, padding: "12px 16px", marginBottom: 20, border: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Bill To</div>
        <div style={{ fontWeight: 700, fontSize: 13, color: INK }}>{buyer.name || "Buyer Name"}</div>
        <div style={{ fontSize: 11, color: INK_SOFT, lineHeight: 1.7, marginTop: 2 }}>
          {buyer.address && <span>{buyer.address}<br/></span>}
          {buyer.gstin && <span>GSTIN: {buyer.gstin}<br/></span>}
          {buyer.email && <span>{buyer.email}</span>}
          {buyer.phone && <span>  ·  {buyer.phone}</span>}
        </div>
      </div>

      {/* Items table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
        <thead>
          <tr style={{ background: INK, color: "#fff" }}>
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
              <tr key={item.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i%2===0 ? "#fff" : SURFACE }}>
                <td style={{ padding: "9px 10px", textAlign: "right", color: "#94A3B8" }}>{i+1}</td>
                <td style={{ padding: "9px 10px" }}>{item.description || "—"}</td>
                <td style={{ padding: "9px 10px", textAlign: "right", color: INK_MUTED }}>{item.hsn || "—"}</td>
                <td style={{ padding: "9px 10px", textAlign: "right" }}>{item.qty}</td>
                <td style={{ padding: "9px 10px", textAlign: "right" }}>{Number(item.rate).toFixed(2)}</td>
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
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${SURFACE_ALT}`, fontSize: 12 }}>
              <span style={{ color: INK_MUTED }}>{label}</span>
              <span>₹{val.toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: INK, color: "#fff", borderRadius: 8, marginTop: 8, fontSize: 14, fontWeight: 800 }}>
            <span>Grand Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Amount in words */}
      <div style={{ background: SURFACE_ALT, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 11, color: INK_SOFT }}>
        <strong style={{ color: INK }}>Amount in words:</strong> {numberToWords(Math.round(grandTotal * 100) / 100)}
      </div>

      {/* Bank details + notes */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
        {(invoice.bankName || invoice.accountNo || invoice.ifsc) && (
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Bank Details</div>
            {invoice.bankName && <div style={{ fontSize: 11, marginBottom: 3 }}><span style={{ color: INK_MUTED }}>Bank: </span>{invoice.bankName}</div>}
            {invoice.accountNo && <div style={{ fontSize: 11, marginBottom: 3 }}><span style={{ color: INK_MUTED }}>A/C No: </span>{invoice.accountNo}</div>}
            {invoice.ifsc && <div style={{ fontSize: 11, marginBottom: 3 }}><span style={{ color: INK_MUTED }}>IFSC: </span>{invoice.ifsc}</div>}
            {invoice.upi && <div style={{ fontSize: 11 }}><span style={{ color: INK_MUTED }}>UPI: </span>{invoice.upi}</div>}
          </div>
        )}
        {invoice.notes && (
          <div style={{ border: `1px solid ${BORDER}`, borderRadius: 8, padding: "12px 14px" }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>Notes</div>
            <div style={{ fontSize: 11, color: INK_SOFT, lineHeight: 1.7 }}>{invoice.notes}</div>
          </div>
        )}
      </div>

      {/* Signature */}
      <div style={{ marginTop: 24, display: "flex", justifyContent: "flex-end" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ width: 140, height: 48, borderBottom: "1px solid #CBD5E1", marginBottom: 6 }} />
          <div style={{ fontSize: 11, color: INK_MUTED }}>Authorised Signatory</div>
          <div style={{ fontSize: 12, fontWeight: 700, marginTop: 2, color: INK }}>{supplier.name || ""}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function GSTInvoicePage() {
  const [invoice, setInvoice] = useState(() => ({
    invoiceNo: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`,
    invoiceDate: todayISO(),
    dueDate: daysFromNowISO(15),
    placeOfSupply: "Maharashtra",
    logoUrl: "",
    bankName: "HDFC Bank",
    accountNo: "50200012345678",
    ifsc: "HDFC0000123",
    upi: "nimbustech@hdfcbank",
    notes: "Payment due within 15 days. Thank you for your business.",
  }));
  const [supplier, setSupplier] = useState({
    name: "Nimbus Technologies Pvt Ltd",
    address: "402, Marathon Futurex, Lower Parel, Mumbai, Maharashtra - 400013",
    gstin: "27AABCN1234M1Z5",
    pan: "AABCN1234M",
    email: "billing@nimbustech.in",
    phone: "+91 98765 43210",
  });
  const [buyer, setBuyer] = useState({
    name: "Skyline Retail Solutions Pvt Ltd",
    address: "7th Floor, Nirlon Knowledge Park, Goregaon East, Mumbai, Maharashtra - 400063",
    gstin: "27AAECS5678K1Z9",
    email: "accounts@skylineretail.in",
    phone: "+91 22 4012 8890",
  });
  const [items, setItems] = useState([
    { id: 1001, description: "Ops Suite annual software subscription (10 seats)", hsn: "997331", qty: 10, rate: 12000, gstRate: 18 },
    { id: 1002, description: "Implementation & onboarding services", hsn: "998314", qty: 1, rate: 35000, gstRate: 18 },
    { id: 1003, description: "Wireless barcode scanner — Model BX-200", hsn: "847160", qty: 4, rate: 4500, gstRate: 18 },
  ]);
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");

  const upd = (setter) => (k, v) => setter(p => ({ ...p, [k]: v }));
  const updItem = (id, k, v) => setItems(p => p.map(i => i.id === id ? { ...i, [k]: v } : i));

  const doDownload = async (format = "pdf") => {
    if (downloading) return;
    setDownloading(true);
    setNotice("");

    const data = { invoice, supplier, buyer, items };
    const printId = `GST-${Date.now()}`;
    const logged = await logSaveRequest({ template: "gst-invoice", printId, billData: data });
    if (!logged.ok) setNotice("Your invoice downloaded fine, but we couldn't record it on our side.");

    await exportSingleDocument({
      Template: GSTPreview,
      data,
      format,
      fileBase: `gst-invoice-${invoice.invoiceNo || Date.now()}`,
      taintedHint: TAINTED_HINT,
    });
    setDownloading(false);
  };

  useSEO({
    title: SEO_TITLE, description: SEO_DESCRIPTION, canonical: CANONICAL,
    breadcrumbs: [
      { name: "Home", url: "https://www.opstools.ai" },
      { name: "Documents", url: "https://www.opstools.ai/documents" },
      { name: "GST Invoice Generator", url: CANONICAL },
    ],
    schemas: [softwareAppSchema, faqSchema],
  });

  return (
    <div style={{ backgroundColor: SURFACE, minHeight: "100vh" }}>
      <style>{`@media(max-width:1023px){.gst-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .gst-grid{grid-template-columns:1fr !important;}}@media(max-width:768px){.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}@media print{.no-print{display:none !important;}}`}</style>

      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0c2340 100%)", padding: "40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <nav style={{ marginBottom: 16, fontSize: 13, color: "#7DD3FC" }}>
            <a href="/" style={{ color: "#7DD3FC", textDecoration: "none" }}>Home</a>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#BAE6FD" }}>GST Invoice</span>
          </nav>
          <h1 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.02em" }}>GST Invoice Generator</h1>
          <p style={{ fontSize: 14, color: "#7DD3FC", margin: 0 }}>Generate GST-compliant tax invoices with CGST/SGST, line items, bank details and PDF download.</p>
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }} className="no-print">
        <div className="gst-grid" style={{ display: "grid", gridTemplateColumns: "1fr 500px", gap: 28, alignItems: "start" }}>
          <div>
            <Section title="Invoice Details">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Invoice No." value={invoice.invoiceNo} onChange={v => upd(setInvoice)("invoiceNo",v)} />
                <Field label="Invoice Date" value={invoice.invoiceDate} onChange={v => upd(setInvoice)("invoiceDate",v)} type="date" />
                <Field label="Due Date" value={invoice.dueDate} onChange={v => upd(setInvoice)("dueDate",v)} type="date" />
                <Field label="Place of Supply" value={invoice.placeOfSupply} onChange={v => upd(setInvoice)("placeOfSupply",v)} placeholder="e.g. Maharashtra" />
              </div>
              <Field label="Logo URL" value={invoice.logoUrl} onChange={v => upd(setInvoice)("logoUrl",v)} placeholder="https://..." />
            </Section>

            <Section title="Your Business (Supplier)">
              <Field label="Business Name" value={supplier.name} onChange={v => upd(setSupplier)("name",v)} placeholder="Your Company Pvt Ltd" />
              <Field label="Address" value={supplier.address} onChange={v => upd(setSupplier)("address",v)} placeholder="Street, City, State - PIN" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="GSTIN" value={supplier.gstin} onChange={v => upd(setSupplier)("gstin",v)} placeholder="27ABCDE1234F1Z5" />
                <Field label="PAN" value={supplier.pan} onChange={v => upd(setSupplier)("pan",v)} placeholder="ABCDE1234F" />
                <Field label="Email" value={supplier.email} onChange={v => upd(setSupplier)("email",v)} placeholder="billing@company.com" />
                <Field label="Phone" value={supplier.phone} onChange={v => upd(setSupplier)("phone",v)} placeholder="+91 98765 43210" />
              </div>
            </Section>

            <Section title="Bill To (Buyer)">
              <Field label="Buyer Name" value={buyer.name} onChange={v => upd(setBuyer)("name",v)} placeholder="Client Company / Person" />
              <Field label="Address" value={buyer.address} onChange={v => upd(setBuyer)("address",v)} placeholder="Street, City, State - PIN" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="GSTIN" value={buyer.gstin} onChange={v => upd(setBuyer)("gstin",v)} placeholder="27ABCDE1234F1Z5" />
                <Field label="Email" value={buyer.email} onChange={v => upd(setBuyer)("email",v)} placeholder="client@company.com" />
              </div>
            </Section>

            <Section title="Line Items">
              {items.map((item, idx) => (
                <div key={item.id} style={{ background: SURFACE, borderRadius: 12, padding: "14px 16px", marginBottom: 10, border: `1px solid ${BORDER}`, position: "relative" }}>
                  {items.length > 1 && <button onClick={() => setItems(p => p.filter(i => i.id !== item.id))} style={{ position: "absolute", top: 10, right: 10, background: "#FEF2F2", border: "none", borderRadius: 6, width: 24, height: 24, cursor: "pointer", color: "#DC2626", fontSize: 14 }}>×</button>}
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 8, textTransform: "uppercase" }}>Item {idx + 1}</div>
                  <Field label="Description" value={item.description} onChange={v => updItem(item.id,"description",v)} placeholder="Service / Product name" small />
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                    <Field label="HSN/SAC" value={item.hsn} onChange={v => updItem(item.id,"hsn",v)} placeholder="998311" small />
                    <Field label="Qty" value={item.qty} onChange={v => updItem(item.id,"qty",Number(v))} type="number" small />
                    <Field label="Rate ₹" value={item.rate} onChange={v => updItem(item.id,"rate",Number(v))} type="number" small />
                    <Field label="GST %" value={item.gstRate} onChange={v => updItem(item.id,"gstRate",Number(v))} type="number" small />
                  </div>
                  <div style={{ fontSize: 12, color: INK, fontWeight: 700, marginTop: 6 }}>
                    Total: ₹{(item.qty * item.rate * (1 + item.gstRate/100)).toFixed(2)}
                  </div>
                </div>
              ))}
              <button onClick={() => setItems(p => [...p, defaultItem()])} style={{ width: "100%", padding: "10px", borderRadius: 10, border: `1.5px dashed ${BRAND}`, background: "#fff", color: BRAND, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                + Add Line Item
              </button>
              <div style={{ background: INK, color: "#fff", borderRadius: 10, padding: "12px 16px", marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Grand Total</span>
                <span style={{ fontSize: 18, fontWeight: 900 }}>₹{items.reduce((s, i) => s + i.qty * i.rate * (1 + i.gstRate/100), 0).toFixed(2)}</span>
              </div>
            </Section>

            <Section title="Bank Details (Optional)">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Bank Name" value={invoice.bankName} onChange={v => upd(setInvoice)("bankName",v)} placeholder="HDFC Bank" />
                <Field label="Account No." value={invoice.accountNo} onChange={v => upd(setInvoice)("accountNo",v)} placeholder="1234567890" />
                <Field label="IFSC Code" value={invoice.ifsc} onChange={v => upd(setInvoice)("ifsc",v)} placeholder="HDFC0001234" />
                <Field label="UPI ID" value={invoice.upi} onChange={v => upd(setInvoice)("upi",v)} placeholder="yourname@upi" />
              </div>
            </Section>

            <Section title="Notes">
              <textarea value={invoice.notes} onChange={e => upd(setInvoice)("notes",e.target.value)} rows={2}
                onFocus={e => { e.target.style.borderColor = BRAND; }}
                onBlur={e => { e.target.style.borderColor = BORDER; }}
                style={{ width: "100%", border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: "8px 12px", fontSize: 13, color: INK, resize: "vertical", boxSizing: "border-box", outline: "none", fontFamily: "inherit" }} />
            </Section>
          </div>

          <div className="gst-prev" style={{ position: "sticky", top: 88 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: INK_MUTED, margin: 0 }}>Live Preview</p>
              <SaveMenu onSave={doDownload} downloading={downloading} small />
            </div>

            {notice && (
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 12, color: "#92400E", display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span>⚠ {notice}</span>
                <button onClick={() => setNotice("")} style={{ background: "none", border: "none", color: "#92400E", cursor: "pointer", fontSize: 14, lineHeight: 1 }} aria-label="Dismiss">×</button>
              </div>
            )}

            <div className="preview-scale-wrap" style={{ transform: "scale(0.68)", transformOrigin: "top left", width: "147%", marginBottom: "-32%" }}>
              <GSTPreview data={{ invoice, supplier, buyer, items }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderTop: `1px solid ${BORDER}` }}>
        <div className="seo-section" style={{ maxWidth: "80%", margin: "0 auto", width: "80%" }}>
          <DocumentPageSEO documentName="GST Invoice" documentSlug="gst-invoice" intro={INTRO} whatIs={WHAT_IS} whyUse={WHY_USE} features={FEATURES} howToSteps={HOW_TO_STEPS} benefits={BENEFITS} formatFields={FORMAT_FIELDS} faqs={FAQS} relatedDocs={RELATED_DOCS} />
        </div>
      </div>
    </div>
  );
}
