import { useState } from "react";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";
import SaveMenu from "../../components/common/SaveMenu";
import { exportSingleDocument } from "../../utils/documentExport";
import { logSaveRequest } from "../../utils/saveLog";

const TAINTED_HINT = "the logo image doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again.";

// Neutral document palette — a printed invoice should read like a normal
// business document, not a brand-colour showcase. Brand blue is reserved for
// interactive form chrome (field focus, the dashed "+ Add" button) below,
// never for the invoice preview itself.
const INK = "#0F172A";
const INK_SOFT = "#475569";
const INK_MUTED = "#64748B";
const BORDER = "#E2E8F0";
const SURFACE = "#F8FAFC";
const SURFACE_ALT = "#F1F5F9";
const BRAND = "#2563EB";

// ─── SEO ─────────────────────────────────────────────────────────────────────
const SEO_TITLE = "Free Invoice Generator India — Professional Invoices with Tax (2026)";
const SEO_DESCRIPTION = "Generate professional invoices online for free. Line items, tax, discounts, and bank details. No login. Instant PDF. India-compliant.";
const CANONICAL = "https://www.opstools.ai/documents/invoice";
const softwareAppSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "OpsTools Invoice Generator", operatingSystem: "Web", applicationCategory: "BusinessApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, description: SEO_DESCRIPTION, url: CANONICAL, provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" } };
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "Is this invoice generator free?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no login required." } },
  { "@type": "Question", name: "Can I add bank details for payment?", acceptedAnswer: { "@type": "Answer", text: "Yes, optional bank name, account number, IFSC, and UPI ID fields appear on the invoice for easy payment." } },
  { "@type": "Question", name: "Does it support discounts and tax?", acceptedAnswer: { "@type": "Answer", text: "Yes, you can apply a tax percentage per item and an overall discount, both reflected in the final total." } },
  { "@type": "Question", name: "Is this suitable for any business type?", acceptedAnswer: { "@type": "Answer", text: "Yes, this is a general-purpose invoice suitable for any business — for GST-specific invoices with HSN codes, see the GST Invoice Generator instead." } },
] };
const INTRO = (<><p style={{ marginBottom: 16 }}>Need a clean, professional invoice without wrestling with a spreadsheet template? OpsTools Invoice Generator gets you there in under a minute — line items, tax, discount, and bank details, all in one print-ready document.</p><p style={{ marginBottom: 16 }}>Add as many line items as needed, apply tax and an overall discount, and include your bank details or UPI ID so clients know exactly how to pay. The total, including amount in words, calculates itself.</p><p>The preview updates live as you type. Download directly as a PDF — your data never leaves your browser.</p></>);
const WHAT_IS = `An invoice is a document a business issues to a customer requesting payment for goods or services provided, itemizing what was sold, the price, applicable tax, and total due. It serves as both a payment request and a business record.`;
const WHY_USE = [
  { title: "Small business owners", body: "Issue professional invoices without accounting software." },
  { title: "Service providers", body: "Bill clients clearly with itemized line items and tax." },
  { title: "One-off sales", body: "Generate a quick invoice for a single transaction without setting up a system." },
];
const FEATURES = [
  { icon: "🧾", title: "Itemized line items", body: "Add as many items as needed, each with quantity, rate, and tax." },
  { icon: "💳", title: "Bank details", body: "Optional bank account, IFSC, and UPI ID fields for easy payment." },
  { icon: "🔢", title: "Amount in words", body: "Total automatically converted to words." },
  { icon: "👁️", title: "Live preview", body: "See the invoice update in real time as you fill the form." },
  { icon: "⬇️", title: "Direct PDF download", body: "One click downloads the invoice as a PDF." },
  { icon: "🏷️", title: "Custom logo", body: "Paste any image URL to add your business logo." },
  { icon: "🔒", title: "100% private", body: "No data is stored or transmitted. Everything happens in your browser." },
];
const HOW_TO_STEPS = [
  { step: 1, title: "Enter invoice details", body: "Invoice number, date, due date, and discount." },
  { step: 2, title: "Add your business details", body: "Name, address, GSTIN, and contact info." },
  { step: 3, title: "Add client details", body: "Name, address, and contact info for the client." },
  { step: 4, title: "Add line items", body: "List each item with quantity, rate, and tax." },
  { step: 5, title: "Add bank details", body: "Optional — include account details or UPI ID for payment." },
  { step: 6, title: "Download PDF", body: "Click Save to download the invoice as a PDF or PNG." },
];
const BENEFITS = [
  "Unlimited line items per invoice.",
  "Tax and discount calculated automatically.",
  "Bank details and UPI ID for easy payment.",
  "Amount in words auto-generated.",
  "All data stays in your browser — zero privacy risk.",
  "Completely free — no subscription.",
];
const FORMAT_FIELDS = [
  { field: "Invoice No.", description: "Unique identifier for the invoice", example: "INV-2026-1042" },
  { field: "Line Items", description: "Description, quantity, rate, and tax per item", example: "Consulting — 5 hrs @ ₹2,000/hr" },
  { field: "Discount", description: "Overall discount applied to the invoice", example: "₹500" },
  { field: "Bank Details", description: "Account info for the client to make payment", example: "HDFC Bank, A/C 1234567890" },
];
const FAQS = faqSchema.mainEntity.map((i) => ({ q: i.name, a: i.acceptedAnswer.text }));
const RELATED_DOCS = [
  { name: "GST Invoice Generator", href: "/documents/gst-invoice", description: "Tax-compliant GST invoices with HSN codes." },
  { name: "Quotation Generator", href: "/documents/quotation", description: "Price quotes with validity and terms." },
  { name: "Freelancer Invoice", href: "/documents/freelancer-invoice", description: "Hourly & fixed price invoices." },
];

function Field({ label, value, onChange, placeholder, type = "text", small }) {
  return (
    <div style={{ marginBottom: small ? 8 : 12 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: INK_MUTED, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder}
        onChange={e => onChange && onChange(e.target.value)}
        style={{ width: "100%", height: small ? 32 : 38, border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: "0 10px", fontSize: 13, color: INK, outline: "none", boxSizing: "border-box", background: "#fff" }}
        onFocus={e => e.target.style.borderColor = BRAND}
        onBlur={e => e.target.style.borderColor = BORDER} />
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

function numberToWords(n) {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  if (n === 0) return "Zero";
  const convert = num => {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num/10)] + (num%10 ? " "+ones[num%10] : "");
    if (num < 1000) return ones[Math.floor(num/100)] + " Hundred" + (num%100 ? " "+convert(num%100) : "");
    if (num < 100000) return convert(Math.floor(num/1000)) + " Thousand" + (num%1000 ? " "+convert(num%1000) : "");
    return convert(Math.floor(num/100000)) + " Lakh" + (num%100000 ? " "+convert(num%100000) : "");
  };
  return convert(Math.floor(n)) + " Rupees Only";
}

const defaultItem = () => ({ id: Date.now()+Math.random(), description: "", qty: 1, rate: 0, tax: 18 });

const todayISO = () => new Date().toISOString().split("T")[0];
const daysFromNowISO = (n) => { const d = new Date(); d.setDate(d.getDate()+n); return d.toISOString().split("T")[0]; };

const invoiceTotals = (items, discount) => {
  const subtotal = items.reduce((s,i) => s + Number(i.qty||0)*Number(i.rate||0), 0);
  const tax = items.reduce((s,i) => s + Number(i.qty||0)*Number(i.rate||0)*Number(i.tax||0)/100, 0);
  return { subtotal, tax, total: subtotal + tax - (Number(discount)||0) };
};

function InvoicePreview({ data }) {
  const { from, to, items } = data;
  const { subtotal, tax, total } = invoiceTotals(items, data.discount);
  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:12, color:"#1a1a1a", padding:"32px 40px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, paddingBottom:20, borderBottom:`2px solid ${INK}` }}>
        <div>
          {data.logoUrl && <img src={data.logoUrl} alt="logo" style={{ maxHeight:52, maxWidth:160, objectFit:"contain", marginBottom:8, display:"block" }} />}
          <div style={{ fontSize:20, fontWeight:800, color:INK }}>{from.name || "Your Business"}</div>
          <div style={{ fontSize:11, color:INK_SOFT, marginTop:4, lineHeight:1.7 }}>
            {from.address && <div>{from.address}</div>}
            {from.gstin && <div>GSTIN: {from.gstin}</div>}
            {from.email && <div>{from.email}</div>}
            {from.phone && <div>{from.phone}</div>}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:24, fontWeight:900, color:INK, letterSpacing:"0.06em" }}>INVOICE</div>
          <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 16px", marginTop:8, fontSize:12 }}>
            <div style={{ display:"flex", gap:16, justifyContent:"flex-end" }}><span style={{ color:INK_MUTED }}>Invoice No.</span><strong style={{ color:INK }}>{data.invoiceNo||"—"}</strong></div>
            <div style={{ display:"flex", gap:16, justifyContent:"flex-end", marginTop:4 }}><span style={{ color:INK_MUTED }}>Date</span><strong style={{ color:INK }}>{data.date ? new Date(data.date+"T00:00:00").toLocaleDateString("en-IN") : "—"}</strong></div>
            {data.dueDate && <div style={{ display:"flex", gap:16, justifyContent:"flex-end", marginTop:4 }}><span style={{ color:INK_MUTED }}>Due</span><strong style={{ color:INK }}>{new Date(data.dueDate+"T00:00:00").toLocaleDateString("en-IN")}</strong></div>}
          </div>
        </div>
      </div>
      <div style={{ background:SURFACE, borderRadius:8, padding:"12px 16px", marginBottom:20, border:`1px solid ${BORDER}` }}>
        <div style={{ fontSize:10, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Bill To</div>
        <div style={{ fontWeight:700, fontSize:13, color:INK }}>{to.name||"Client Name"}</div>
        <div style={{ fontSize:11, color:INK_SOFT, lineHeight:1.7, marginTop:2 }}>
          {to.address && <span>{to.address}<br/></span>}
          {to.email && <span>{to.email}</span>}
          {to.phone && <span>  ·  {to.phone}</span>}
        </div>
      </div>
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:16 }}>
        <thead><tr style={{ background:INK, color:"#fff" }}>
          {["#","Description","Qty","Rate (₹)","Tax %","Amount (₹)"].map(h => <th key={h} style={{ padding:"8px 10px", fontSize:10, fontWeight:700, textAlign:h==="Description"?"left":"right" }}>{h}</th>)}
        </tr></thead>
        <tbody>{items.map((item,i) => {
          const amt = Number(item.qty||0)*Number(item.rate||0)*(1+Number(item.tax||0)/100);
          return <tr key={item.id} style={{ borderBottom:`1px solid ${BORDER}`, background:i%2===0?"#fff":SURFACE }}>
            <td style={{ padding:"9px 10px", textAlign:"right", color:INK_MUTED }}>{i+1}</td>
            <td style={{ padding:"9px 10px" }}>{item.description||"—"}</td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{item.qty}</td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{Number(item.rate||0).toFixed(2)}</td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{item.tax}%</td>
            <td style={{ padding:"9px 10px", textAlign:"right", fontWeight:700 }}>{amt.toFixed(2)}</td>
          </tr>;
        })}</tbody>
      </table>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <div style={{ width:240 }}>
          {[["Subtotal", subtotal],["Tax", tax],["Discount", -(Number(data.discount)||0)]].filter(([,v])=>v!==0).map(([l,v]) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${SURFACE_ALT}`, fontSize:12 }}>
              <span style={{ color:INK_MUTED }}>{l}</span><span style={{ color:INK }}>{v<0?`-₹${Math.abs(v).toFixed(2)}`:`₹${v.toFixed(2)}`}</span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 12px", background:INK, color:"#fff", borderRadius:8, marginTop:8, fontSize:14, fontWeight:800 }}>
            <span>Total</span><span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div style={{ background:SURFACE_ALT, border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:11, color:INK_SOFT }}>
        <strong style={{ color:INK }}>Amount in words:</strong> {numberToWords(Math.round(total))}
      </div>
      {data.notes && <div style={{ border:`1px solid ${BORDER}`, borderRadius:8, padding:"12px 14px", fontSize:11, color:INK_SOFT }}><strong style={{ color:INK }}>Notes: </strong>{data.notes}</div>}
      {(data.bankName||data.accountNo||data.ifsc) && (
        <div style={{ marginTop:12, border:`1px solid ${BORDER}`, borderRadius:8, padding:"12px 14px", fontSize:11, color:INK_SOFT }}>
          <div style={{ fontWeight:700, color:INK_MUTED, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em", fontSize:10 }}>Bank Details</div>
          {data.bankName && <div><span style={{ color:INK_MUTED }}>Bank: </span>{data.bankName}</div>}
          {data.accountNo && <div><span style={{ color:INK_MUTED }}>A/C: </span>{data.accountNo}</div>}
          {data.ifsc && <div><span style={{ color:INK_MUTED }}>IFSC: </span>{data.ifsc}</div>}
          {data.upi && <div><span style={{ color:INK_MUTED }}>UPI: </span>{data.upi}</div>}
        </div>
      )}
      <div style={{ marginTop:20, display:"flex", justifyContent:"flex-end" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ width:120, height:40, borderBottom:"1px solid #CBD5E1", marginBottom:6 }}/>
          <div style={{ fontSize:10, color:"#94A3B8" }}>Authorised Signatory</div>
        </div>
      </div>
    </div>
  );
}

export default function InvoiceGeneratorPage() {
  const [invoice, setInvoice] = useState(() => ({
    invoiceNo: `INV-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`,
    date: todayISO(),
    dueDate: daysFromNowISO(15),
    logoUrl: "",
    discount: 2000,
    bankName: "HDFC Bank",
    accountNo: "50200012345678",
    ifsc: "HDFC0001234",
    upi: "vermaconsulting@hdfcbank",
    notes: "Thank you for your business. Payment is due within 15 days of the invoice date.",
  }));
  const [from, setFrom] = useState({
    name: "Verma Consulting Services",
    address: "412, Nirmal Tower, Barakhamba Road, New Delhi - 110001",
    gstin: "07ABCDE1234F1Z5",
    email: "billing@vermaconsulting.in",
    phone: "+91 98100 45210",
  });
  const [to, setTo] = useState({
    name: "Vega Retail Pvt Ltd",
    address: "Plot 22, Sector 44, Gurugram, Haryana - 122003",
    email: "accounts@vegaretail.in",
    phone: "+91 98111 23456",
  });
  const [items, setItems] = useState(() => [
    { id: 1001, description: "Website design & development — Phase 1", qty: 1, rate: 45000, tax: 18 },
    { id: 1002, description: "Monthly maintenance retainer (3 months)", qty: 3, rate: 8000, tax: 18 },
    { id: 1003, description: "Domain & SSL renewal (annual)", qty: 1, rate: 2400, tax: 18 },
  ]);
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");

  const upd = setter => (k,v) => setter(p=>({...p,[k]:v}));
  const updItem = (id,k,v) => setItems(p=>p.map(i=>i.id===id?{...i,[k]:v}:i));

  const { subtotal, tax, total } = invoiceTotals(items, invoice.discount);

  const doDownload = async (format = "pdf") => {
    if (downloading) return;
    setDownloading(true);
    setNotice("");

    const data = { ...invoice, from, to, items };
    const printId = `INV-${Date.now()}`;
    const logged = await logSaveRequest({ template: "invoice", printId, billData: data });
    if (!logged.ok) setNotice("Your invoice downloaded fine, but we couldn't record it on our side.");

    await exportSingleDocument({
      Template: InvoicePreview,
      data,
      format,
      fileBase: `invoice-${invoice.invoiceNo || Date.now()}`,
      taintedHint: TAINTED_HINT,
    });
    setDownloading(false);
  };

  useSEO({
    title: SEO_TITLE, description: SEO_DESCRIPTION, canonical: CANONICAL,
    breadcrumbs: [
      { name: "Home", url: "https://www.opstools.ai" },
      { name: "Documents", url: "https://www.opstools.ai/documents" },
      { name: "Invoice Generator", url: CANONICAL },
    ],
    schemas: [softwareAppSchema, faqSchema],
  });

  return (
    <div style={{ backgroundColor:SURFACE, minHeight:"100vh" }}>
      <style>{`@media(max-width:1023px){.inv-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .inv-grid{grid-template-columns:1fr!important;}}@media(max-width:768px){.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#0c2340 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#7DD3FC" }}>
            <a href="/" style={{ color:"#7DD3FC", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span>
            <a href="/documents" style={{ color:"#7DD3FC", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span>
            <span style={{ color:"#BAE6FD" }}>Invoice Generator</span>
          </nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Invoice Generator</h1>
          <p style={{ fontSize:14, color:"#7DD3FC", margin:0 }}>Professional invoices with line items, tax, discounts and bank details.</p>
        </div>
      </section>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div className="inv-grid" style={{ display:"grid", gridTemplateColumns:"1fr 500px", gap:28, alignItems:"start" }}>
          <div>
            <Section title="Invoice Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Invoice No." value={invoice.invoiceNo} onChange={v=>upd(setInvoice)("invoiceNo",v)} />
                <Field label="Invoice Date" value={invoice.date} onChange={v=>upd(setInvoice)("date",v)} type="date" />
                <Field label="Due Date" value={invoice.dueDate} onChange={v=>upd(setInvoice)("dueDate",v)} type="date" />
                <Field label="Discount (₹)" value={invoice.discount} onChange={v=>upd(setInvoice)("discount",v)} type="number" placeholder="0" />
              </div>
              <Field label="Logo URL" value={invoice.logoUrl} onChange={v=>upd(setInvoice)("logoUrl",v)} placeholder="https://..." />
            </Section>
            <Section title="From (Your Business)">
              <Field label="Business Name" value={from.name} onChange={v=>upd(setFrom)("name",v)} placeholder="Your Company" />
              <Field label="Address" value={from.address} onChange={v=>upd(setFrom)("address",v)} placeholder="City, State - PIN" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="GSTIN" value={from.gstin} onChange={v=>upd(setFrom)("gstin",v)} placeholder="27ABCDE1234F1Z5" />
                <Field label="Email" value={from.email} onChange={v=>upd(setFrom)("email",v)} />
                <Field label="Phone" value={from.phone} onChange={v=>upd(setFrom)("phone",v)} />
              </div>
            </Section>
            <Section title="Bill To (Client)">
              <Field label="Client Name" value={to.name} onChange={v=>upd(setTo)("name",v)} placeholder="Client / Company" />
              <Field label="Address" value={to.address} onChange={v=>upd(setTo)("address",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Email" value={to.email} onChange={v=>upd(setTo)("email",v)} />
                <Field label="Phone" value={to.phone} onChange={v=>upd(setTo)("phone",v)} />
              </div>
            </Section>
            <Section title="Line Items">
              {items.map((item,idx) => (
                <div key={item.id} style={{ background:SURFACE, borderRadius:12, padding:"14px 16px", marginBottom:10, border:`1px solid ${BORDER}`, position:"relative" }}>
                  {items.length>1 && <button onClick={()=>setItems(p=>p.filter(i=>i.id!==item.id))} style={{ position:"absolute", top:10, right:10, background:"#FEF2F2", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:"#DC2626", fontSize:14 }}>×</button>}
                  <div style={{ fontSize:11, fontWeight:700, color:INK_MUTED, marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em" }}>Item {idx+1}</div>
                  <Field label="Description" value={item.description} onChange={v=>updItem(item.id,"description",v)} placeholder="Service or product" small />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                    <Field label="Qty" value={item.qty} onChange={v=>updItem(item.id,"qty",Number(v))} type="number" small />
                    <Field label="Rate ₹" value={item.rate} onChange={v=>updItem(item.id,"rate",Number(v))} type="number" small />
                    <Field label="Tax %" value={item.tax} onChange={v=>updItem(item.id,"tax",Number(v))} type="number" small />
                  </div>
                  <div style={{ fontSize:12, color:INK, fontWeight:700, marginTop:6 }}>= ₹{(Number(item.qty||0)*Number(item.rate||0)*(1+Number(item.tax||0)/100)).toFixed(2)}</div>
                </div>
              ))}
              <button onClick={()=>setItems(p=>[...p,defaultItem()])} style={{ width:"100%", padding:10, borderRadius:10, border:`1.5px dashed ${BRAND}`, background:SURFACE, color:BRAND, fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Item</button>
              <div style={{ marginTop:12, border:`1px solid ${BORDER}`, borderRadius:10, overflow:"hidden" }}>
                {[["Subtotal", `₹${subtotal.toFixed(2)}`],["Tax", `₹${tax.toFixed(2)}`],["Discount", `-₹${(Number(invoice.discount)||0).toFixed(2)}`]].map(([l,v]) => (
                  <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"8px 16px", fontSize:12, color:INK_SOFT, borderBottom:`1px solid ${SURFACE_ALT}`, background:"#fff" }}>
                    <span>{l}</span><span style={{ fontWeight:600, color:INK }}>{v}</span>
                  </div>
                ))}
                <div style={{ background:INK, color:"#fff", padding:"12px 16px", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                  <span style={{ fontSize:14, fontWeight:700 }}>Total</span>
                  <span style={{ fontSize:18, fontWeight:900 }}>₹{total.toFixed(2)}</span>
                </div>
              </div>
            </Section>
            <Section title="Bank Details (Optional)">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Bank Name" value={invoice.bankName} onChange={v=>upd(setInvoice)("bankName",v)} placeholder="HDFC Bank" />
                <Field label="Account No." value={invoice.accountNo} onChange={v=>upd(setInvoice)("accountNo",v)} />
                <Field label="IFSC" value={invoice.ifsc} onChange={v=>upd(setInvoice)("ifsc",v)} placeholder="HDFC0001234" />
                <Field label="UPI ID" value={invoice.upi} onChange={v=>upd(setInvoice)("upi",v)} placeholder="name@upi" />
              </div>
            </Section>
            <Section title="Notes">
              <textarea value={invoice.notes} onChange={e=>upd(setInvoice)("notes",e.target.value)} rows={2}
                style={{ width:"100%", border:`1.5px solid ${BORDER}`, borderRadius:8, padding:"8px 12px", fontSize:13, color:INK, resize:"vertical", boxSizing:"border-box", outline:"none" }}
                onFocus={e=>e.target.style.borderColor=BRAND} onBlur={e=>e.target.style.borderColor=BORDER} />
            </Section>
          </div>
          <div className="inv-prev" style={{ position:"sticky", top:88 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:INK_MUTED, margin:0 }}>Live Preview</p>
              <SaveMenu onSave={doDownload} downloading={downloading} small />
            </div>

            {notice && (
              <div style={{ background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:8, padding:"8px 12px", marginBottom:10, fontSize:12, color:"#92400E", display:"flex", justifyContent:"space-between", gap:8 }}>
                <span>⚠ {notice}</span>
                <button onClick={()=>setNotice("")} style={{ background:"none", border:"none", color:"#92400E", cursor:"pointer", fontSize:14, lineHeight:1 }} aria-label="Dismiss">×</button>
              </div>
            )}

            <div className="preview-scale-wrap" style={{ transform:"scale(0.68)", transformOrigin:"top left", width:"147%", marginBottom:"-32%" }}>
              <InvoicePreview data={{ ...invoice, from, to, items }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderTop: `1px solid ${BORDER}` }}>
        <div className="seo-section" style={{ maxWidth: "80%", margin: "0 auto", width: "80%" }}>
          <DocumentPageSEO documentName="Invoice Generator" documentSlug="invoice" intro={INTRO} whatIs={WHAT_IS} whyUse={WHY_USE} features={FEATURES} howToSteps={HOW_TO_STEPS} benefits={BENEFITS} formatFields={FORMAT_FIELDS} faqs={FAQS} relatedDocs={RELATED_DOCS} />
        </div>
      </div>
    </div>
  );
}
