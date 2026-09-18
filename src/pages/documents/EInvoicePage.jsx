import { useState } from "react";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";
import SaveMenu from "../../components/common/SaveMenu";
import { exportSingleDocument } from "../../utils/documentExport";
import { logSaveRequest } from "../../utils/saveLog";

const TAINTED_HINT = "one of the invoice's fields couldn't be captured due to a cross-origin image restriction. Try again, or contact support if this persists.";

// Neutral document palette — a printed e-invoice should read like a normal
// business document, not a brand-colour showcase. Brand blue is reserved for
// interactive form chrome (field focus, active toggle, "+ Add" buttons),
// never for the invoice preview itself.
const INK = "#0F172A";
const INK_SOFT = "#475569";
const INK_MUTED = "#64748B";
const BORDER = "#E2E8F0";
const SURFACE = "#F8FAFC";
const SURFACE_ALT = "#F1F5F9";
const BRAND = "#2563EB";

// ─── SEO ─────────────────────────────────────────────────────────────────────
const SEO_TITLE = "Free E-Invoice Generator Online — IRN & QR Code Format (2026)";
const SEO_DESCRIPTION = "Generate a GST e-invoice online for free, with IRN, acknowledgement number, and QR code fields. No login. Instant PDF. India-compliant.";
const CANONICAL = "https://www.opstools.ai/documents/e-invoice";
const softwareAppSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "OpsTools E-Invoice Generator", operatingSystem: "Web", applicationCategory: "BusinessApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, description: SEO_DESCRIPTION, url: CANONICAL, provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" } };
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "What is an e-invoice under GST?", acceptedAnswer: { "@type": "Answer", text: "An e-invoice is a standard invoice that has been registered on the government's Invoice Registration Portal (IRP), which returns a unique Invoice Reference Number (IRN) and a QR code. It's mandatory for businesses above a certain turnover threshold." } },
  { "@type": "Question", name: "Where do I get the IRN and QR code?", acceptedAnswer: { "@type": "Answer", text: "The IRN, acknowledgement number, and QR code are issued by the government's IRP after you submit your invoice there — this tool lets you lay them out on a properly formatted invoice once you have them, it doesn't generate or register them itself." } },
  { "@type": "Question", name: "What is reverse charge on an invoice?", acceptedAnswer: { "@type": "Answer", text: "Reverse charge means the recipient, not the supplier, is liable to pay GST on that transaction. Mark it accordingly if applicable to your invoice." } },
  { "@type": "Question", name: "Is this generator free?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no login required." } },
] };
const INTRO = (<><p style={{ marginBottom: 16 }}>Once you've registered an invoice on the government's e-invoicing portal and received an IRN, acknowledgement number, and QR code back, you still need somewhere to lay all of that out on a proper invoice. OpsTools E-Invoice Generator does exactly that — fill in your details plus the IRN/QR data, and get a print-ready, properly formatted e-invoice in under a minute.</p><p style={{ marginBottom: 16 }}>This tool doesn't generate or register the IRN itself — that has to come from the government's Invoice Registration Portal (IRP) — but once you have it, this handles the formatting: place of supply, reverse charge flag, and the IRN/acknowledgement/QR block laid out the way e-invoices are expected to look.</p><p>Every field updates live in the preview. When ready, download directly as a PDF. Your data never leaves your browser.</p></>);
const WHAT_IS = `An e-invoice (electronic invoice) is a GST invoice that has been registered on the government's Invoice Registration Portal, which validates it and returns an Invoice Reference Number (IRN) and a QR code. E-invoicing is mandatory for businesses above a specified annual turnover under Indian GST rules.`;
const WHY_USE = [
  { title: "Businesses under e-invoicing mandate", body: "Lay out your registered invoice with IRN, ack number, and QR code in the expected format." },
  { title: "Accounts teams", body: "Generate consistent, properly formatted e-invoices for every transaction." },
  { title: "GST compliance records", body: "Keep a clean, print-ready copy of every e-invoice issued." },
];
const FEATURES = [
  { icon: "🧾", title: "IRN & QR fields", body: "Dedicated fields for IRN, acknowledgement number, ack date, and QR code data." },
  { icon: "🔄", title: "Reverse charge flag", body: "Mark reverse-charge transactions correctly on the invoice." },
  { icon: "📍", title: "Place of supply", body: "Include the place of supply as required for GST invoices." },
  { icon: "👁️", title: "Live preview", body: "See the invoice update in real time as you fill the form." },
  { icon: "⬇️", title: "Direct PDF download", body: "One click downloads the invoice as a PDF." },
  { icon: "🔒", title: "100% private", body: "No data is stored or transmitted. Everything happens in your browser." },
];
const HOW_TO_STEPS = [
  { step: 1, title: "Enter invoice details", body: "Invoice number, date, place of supply, and reverse charge flag." },
  { step: 2, title: "Add IRN & QR data", body: "Paste in the IRN, acknowledgement number, ack date, and QR code you received from the IRP." },
  { step: 3, title: "Add supplier & buyer details", body: "Enter both parties' details including GSTIN." },
  { step: 4, title: "Add line items", body: "List each item or service with quantity, rate, and tax." },
  { step: 5, title: "Preview", body: "Check the live preview updates instantly." },
  { step: 6, title: "Download PDF", body: "Click Save PDF to download the invoice." },
];
const BENEFITS = [
  "Dedicated fields for IRN, acknowledgement number, and QR code.",
  "Reverse charge and place of supply included.",
  "No registration or sign-up required.",
  "Direct PDF download — no print dialog.",
  "All data stays in your browser — zero privacy risk.",
  "Completely free — no subscription.",
];
const FORMAT_FIELDS = [
  { field: "IRN", description: "Invoice Reference Number issued by the government IRP", example: "35054cb4d...9f2a1" },
  { field: "Acknowledgement No.", description: "Ack number returned alongside the IRN", example: "112010001234567" },
  { field: "QR Code", description: "QR code data issued for the invoice", example: "Base64/encoded QR payload" },
  { field: "Place of Supply", description: "State where the supply is deemed to occur", example: "Maharashtra" },
  { field: "Reverse Charge", description: "Whether GST liability shifts to the recipient", example: "Yes / No" },
];
const FAQS = faqSchema.mainEntity.map((i) => ({ q: i.name, a: i.acceptedAnswer.text }));
const RELATED_DOCS = [
  { name: "GST Invoice Generator", href: "/documents/gst-invoice", description: "General-purpose GST-compliant invoices." },
  { name: "E-Way Bill Generator", href: "/documents/eway-bill", description: "GST e-way bill reference document." },
  { name: "Service Invoice Generator", href: "/documents/service-invoice", description: "Invoices for service-based businesses." },
];

function Field({ label, value, onChange, placeholder, type="text", small }) {
  return (
    <div style={{ marginBottom:small?8:12 }}>
      {label&&<label style={{ fontSize:11, fontWeight:600, color:INK_MUTED, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder} onChange={e=>onChange&&onChange(e.target.value)}
        style={{ width:"100%", height:small?32:38, border:`1.5px solid ${BORDER}`, borderRadius:8, padding:"0 10px", fontSize:13, color:INK, outline:"none", boxSizing:"border-box", background:"#fff" }}
        onFocus={e=>e.target.style.borderColor=BRAND} onBlur={e=>e.target.style.borderColor=BORDER} />
    </div>
  );
}

const defaultItem = () => ({ id:Date.now()+Math.random(), description:"", hsn:"", qty:1, rate:0, cgst:9, sgst:9, igst:0 });

// Sample/illustrative IRN only — a real one is a 64-character hash issued by
// the government IRP, never generated by this tool.
const SAMPLE_IRN = "35054cb4d9d8e1f6a2b7c3e0f4a8d1b6c9e2f5a8b1d4e7f0a3b6c9e2f5a8d1b7";

function EInvoicePreview({ data }) {
  const { invoice, supplier, buyer, items } = data;
  const subtotal = items.reduce((s,i)=>s+i.qty*i.rate,0);
  const totalTax = items.reduce((s,i)=>s+i.qty*i.rate*(i.cgst+i.sgst+i.igst)/100,0);
  const total = subtotal+totalTax;
  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:11, color:"#1a1a1a", padding:"28px 32px", border:`1px solid ${BORDER}` }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14, paddingBottom:12, borderBottom:`2px solid ${INK}` }}>
        <div>
          <div style={{ fontSize:18, fontWeight:900, color:INK, letterSpacing:"-0.01em" }}>E-INVOICE</div>
          <div style={{ fontSize:10, color:INK_SOFT, marginTop:3 }}>Tax invoice under GST · Invoice Registration Portal</div>
        </div>
        <div style={{ fontSize:9, fontWeight:700, color:INK_MUTED, letterSpacing:"0.15em", textTransform:"uppercase", border:`1px solid ${BORDER}`, borderRadius:999, padding:"3px 10px", background:SURFACE_ALT }}>Original for Recipient</div>
      </div>

      {/* IRN block */}
      {invoice.irn&&(
        <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"9px 12px", marginBottom:12, fontSize:10 }}>
          <div style={{ fontSize:9, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>IRP Registration</div>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"6px 12px" }}>
            <div style={{ gridColumn:"1/-1" }}><span style={{ color:INK_MUTED }}>IRN: </span><strong style={{ fontSize:9, wordBreak:"break-all", color:INK }}>{invoice.irn}</strong></div>
            <div><span style={{ color:INK_MUTED }}>Ack No: </span><strong style={{ color:INK }}>{invoice.ackNo||"—"}</strong></div>
            <div><span style={{ color:INK_MUTED }}>Ack Date: </span><strong style={{ color:INK }}>{invoice.ackDate?new Date(invoice.ackDate+"T00:00:00").toLocaleDateString("en-IN"):"—"}</strong></div>
            {invoice.qrCode&&<div style={{ gridColumn:"1/-1" }}><span style={{ color:INK_MUTED }}>QR: </span><strong style={{ fontSize:9, color:INK_SOFT }}>{invoice.qrCode.substring(0,20)}…</strong></div>}
          </div>
        </div>
      )}

      {/* Parties */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        <div style={{ border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Supplier</div>
          <div style={{ fontWeight:700, fontSize:12, color:INK }}>{supplier.name||"—"}</div>
          <div style={{ fontSize:10, color:INK_SOFT, lineHeight:1.7 }}>
            {supplier.address&&<div>{supplier.address}</div>}
            {supplier.gstin&&<div>GSTIN: <strong style={{ color:INK }}>{supplier.gstin}</strong></div>}
            {supplier.pan&&<div>PAN: {supplier.pan}</div>}
          </div>
        </div>
        <div style={{ border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6 }}>Buyer</div>
          <div style={{ fontWeight:700, fontSize:12, color:INK }}>{buyer.name||"—"}</div>
          <div style={{ fontSize:10, color:INK_SOFT, lineHeight:1.7 }}>
            {buyer.address&&<div>{buyer.address}</div>}
            {buyer.gstin&&<div>GSTIN: <strong style={{ color:INK }}>{buyer.gstin}</strong></div>}
          </div>
        </div>
      </div>

      {/* Invoice meta */}
      <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"9px 12px", marginBottom:12, display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, fontSize:10 }}>
        {[["Invoice No.",invoice.invoiceNo||"—"],["Date",invoice.date?new Date(invoice.date+"T00:00:00").toLocaleDateString("en-IN"):"—"],["Place of Supply",invoice.placeOfSupply||"—"],["Reverse Charge",invoice.reverseCharge?"Yes":"No"]].map(([l,v])=>(
          <div key={l}><div style={{ color:INK_MUTED, marginBottom:2 }}>{l}</div><strong style={{ color:INK }}>{v}</strong></div>
        ))}
      </div>

      {/* Line items */}
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:12, fontSize:10 }}>
        <thead><tr style={{ background:INK, color:"#fff" }}>
          {["#","Description","HSN","Qty","Rate","Taxable","CGST","SGST","IGST","Total"].map(h=><th key={h} style={{ padding:"7px 8px", fontWeight:700, textAlign:h==="Description"?"left":"right", fontSize:9 }}>{h}</th>)}
        </tr></thead>
        <tbody>{items.map((item,i)=>{
          const taxable=item.qty*item.rate;
          const cgstAmt=taxable*item.cgst/100, sgstAmt=taxable*item.sgst/100, igstAmt=taxable*item.igst/100;
          return <tr key={item.id} style={{ borderBottom:`1px solid ${BORDER}`, background:i%2===0?"#fff":SURFACE }}>
            <td style={{ padding:"6px 8px", textAlign:"right", color:INK_MUTED }}>{i+1}</td>
            <td style={{ padding:"6px 8px", color:INK }}>{item.description||"—"}</td>
            <td style={{ padding:"6px 8px", textAlign:"right", color:INK_SOFT }}>{item.hsn||"—"}</td>
            <td style={{ padding:"6px 8px", textAlign:"right", color:INK_SOFT }}>{item.qty}</td>
            <td style={{ padding:"6px 8px", textAlign:"right", color:INK_SOFT }}>{Number(item.rate||0).toFixed(2)}</td>
            <td style={{ padding:"6px 8px", textAlign:"right", color:INK_SOFT }}>{taxable.toFixed(2)}</td>
            <td style={{ padding:"6px 8px", textAlign:"right", color:INK_SOFT }}>{cgstAmt.toFixed(2)}</td>
            <td style={{ padding:"6px 8px", textAlign:"right", color:INK_SOFT }}>{sgstAmt.toFixed(2)}</td>
            <td style={{ padding:"6px 8px", textAlign:"right", color:INK_SOFT }}>{igstAmt.toFixed(2)}</td>
            <td style={{ padding:"6px 8px", textAlign:"right", fontWeight:700, color:INK }}>{(taxable+cgstAmt+sgstAmt+igstAmt).toFixed(2)}</td>
          </tr>;
        })}</tbody>
      </table>

      {/* Totals */}
      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <div style={{ width:240 }}>
          {[["Taxable Amount",subtotal],["Total Tax",totalTax]].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${BORDER}`, fontSize:11 }}><span style={{ color:INK_MUTED }}>{l}</span><span style={{ color:INK }}>₹{v.toFixed(2)}</span></div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"9px 10px", background:INK, color:"#fff", borderRadius:6, marginTop:6, fontSize:12, fontWeight:800 }}><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        </div>
      </div>

      {/* Signature */}
      <div style={{ display:"flex", justifyContent:"flex-end", marginTop:22 }}>
        <div style={{ textAlign:"center", width:200 }}>
          <div style={{ height:34, borderBottom:"1px solid #CBD5E1", marginBottom:4 }}/>
          <div style={{ fontSize:9, color:"#94A3B8" }}>Authorised Signatory{supplier.name?` — ${supplier.name}`:""}</div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background:"#fff", borderRadius:16, border:`1px solid ${BORDER}`, padding:"20px 24px", marginBottom:16 }}>
      <h2 style={{ fontSize:13, fontWeight:700, color:INK, margin:"0 0 16px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</h2>
      {children}
    </div>
  );
}

export default function EInvoicePage() {
  const [invoice, setInvoice] = useState(() => ({
    invoiceNo:`EINV-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`,
    date:new Date().toISOString().split("T")[0],
    placeOfSupply:"Maharashtra",
    reverseCharge:false,
    // Sample/illustrative values only — a real IRN, ack number and QR payload
    // are issued by the government IRP, never generated here.
    irn:SAMPLE_IRN,
    ackNo:"112420011234567",
    ackDate:new Date().toISOString().split("T")[0],
    qrCode:"eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.SAMPLE-QR-PAYLOAD",
  }));
  const [supplier, setSupplier] = useState({
    name:"Sunrise Technologies Pvt Ltd",
    address:"402, Lotus Business Park, Andheri West, Mumbai 400053",
    gstin:"27AABCS1429B1ZQ",
    pan:"AABCS1429B",
  });
  const [buyer, setBuyer] = useState({
    name:"Meridian Retail Solutions Pvt Ltd",
    address:"17th Floor, Nariman Point, Mumbai 400021",
    gstin:"27AACCM9876P1ZV",
  });
  const [items, setItems] = useState([
    { id:1001, description:"CRM Pro annual subscription (25 seats)", hsn:"998314", qty:1, rate:180000, cgst:9, sgst:9, igst:0 },
    { id:1002, description:"Implementation & data migration services", hsn:"998313", qty:40, rate:1500, cgst:9, sgst:9, igst:0 },
    { id:1003, description:"On-site training workshop (2 days)", hsn:"999293", qty:2, rate:12500, cgst:9, sgst:9, igst:0 },
  ]);
  const [gstType, setGstType] = useState("cgst_sgst");
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");
  const upd=setter=>(k,v)=>setter(p=>({...p,[k]:v}));
  const updItem=(id,k,v)=>setItems(p=>p.map(i=>i.id===id?{...i,[k]:v}:i));

  const doDownload = async (format = "pdf") => {
    if (downloading) return;
    setDownloading(true);
    setNotice("");

    const data = { invoice, supplier, buyer, items, gstType };
    const printId = `EINV-${Date.now()}`;
    const logged = await logSaveRequest({ template: "e-invoice", printId, billData: data });
    if (!logged.ok) setNotice("Your invoice downloaded fine, but we couldn't record it on our side.");

    await exportSingleDocument({
      Template: EInvoicePreview,
      data,
      format,
      fileBase: `e-invoice-${invoice.invoiceNo || Date.now()}`,
      taintedHint: TAINTED_HINT,
    });
    setDownloading(false);
  };

  useSEO({
    title: SEO_TITLE, description: SEO_DESCRIPTION, canonical: CANONICAL,
    breadcrumbs: [
      { name: "Home", url: "https://www.opstools.ai" },
      { name: "Documents", url: "https://www.opstools.ai/documents" },
      { name: "E-Invoice Generator", url: CANONICAL },
    ],
    schemas: [softwareAppSchema, faqSchema],
  });

  return (
    <div style={{ backgroundColor:"#F8FAFC", minHeight:"100vh" }}>
      <style>{`@media(max-width:1023px){.ei-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .ei-grid{grid-template-columns:1fr!important;}}@media(max-width:768px){.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#0c2340 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#7DD3FC" }}><a href="/" style={{ color:"#7DD3FC", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span><a href="/documents" style={{ color:"#7DD3FC", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span><span style={{ color:"#BAE6FD" }}>E-Invoice</span></nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>E-Invoice Generator</h1>
          <p style={{ fontSize:14, color:"#7DD3FC", margin:0 }}>GST e-invoice format with IRN, acknowledgement number, supplier, buyer and line items.</p>
        </div>
      </section>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div className="ei-grid" style={{ display:"grid", gridTemplateColumns:"1fr 500px", gap:28, alignItems:"start" }}>
          <div>
            <Section title="Invoice Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Invoice No." value={invoice.invoiceNo} onChange={v=>upd(setInvoice)("invoiceNo",v)} />
                <Field label="Invoice Date" value={invoice.date} onChange={v=>upd(setInvoice)("date",v)} type="date" />
                <Field label="Place of Supply" value={invoice.placeOfSupply} onChange={v=>upd(setInvoice)("placeOfSupply",v)} placeholder="Maharashtra" />
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4 }}>
                <input type="checkbox" checked={invoice.reverseCharge} onChange={e=>upd(setInvoice)("reverseCharge",e.target.checked)} id="rc" />
                <label htmlFor="rc" style={{ fontSize:13, color:"#374151", cursor:"pointer" }}>Reverse Charge Applicable</label>
              </div>
            </Section>
            <Section title="IRN Details (if available)">
              <Field label="IRN (Invoice Reference Number)" value={invoice.irn} onChange={v=>upd(setInvoice)("irn",v)} placeholder="64-character IRN from GST portal" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Acknowledgement No." value={invoice.ackNo} onChange={v=>upd(setInvoice)("ackNo",v)} />
                <Field label="Acknowledgement Date" value={invoice.ackDate} onChange={v=>upd(setInvoice)("ackDate",v)} type="date" />
              </div>
            </Section>
            <Section title="Supplier">
              <Field label="Business Name" value={supplier.name} onChange={v=>upd(setSupplier)("name",v)} />
              <Field label="Address" value={supplier.address} onChange={v=>upd(setSupplier)("address",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="GSTIN" value={supplier.gstin} onChange={v=>upd(setSupplier)("gstin",v)} />
                <Field label="PAN" value={supplier.pan} onChange={v=>upd(setSupplier)("pan",v)} />
              </div>
            </Section>
            <Section title="Buyer">
              <Field label="Buyer Name" value={buyer.name} onChange={v=>upd(setBuyer)("name",v)} />
              <Field label="Address" value={buyer.address} onChange={v=>upd(setBuyer)("address",v)} />
              <Field label="GSTIN" value={buyer.gstin} onChange={v=>upd(setBuyer)("gstin",v)} />
            </Section>
            <Section title="GST Type">
              <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                {[{key:"cgst_sgst",label:"CGST + SGST"},{key:"igst",label:"IGST"}].map(opt=>(
                  <button key={opt.key} onClick={()=>{setGstType(opt.key);setItems(p=>p.map(i=>opt.key==="igst"?{...i,cgst:0,sgst:0,igst:18}:{...i,cgst:9,sgst:9,igst:0}));}} style={{ flex:1, padding:"9px 12px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", border:gstType===opt.key?`1.5px solid ${INK}`:`1.5px solid ${BORDER}`, background:gstType===opt.key?INK:"#fff", color:gstType===opt.key?"#fff":INK_MUTED }}>{opt.label}</button>
                ))}
              </div>
            </Section>
            <Section title="Line Items">
              {items.map((item,idx)=>(
                <div key={item.id} style={{ background:SURFACE, borderRadius:12, padding:"14px 16px", marginBottom:10, border:`1px solid ${BORDER}`, position:"relative" }}>
                  {items.length>1&&<button onClick={()=>setItems(p=>p.filter(i=>i.id!==item.id))} style={{ position:"absolute", top:10, right:10, background:"#FEF2F2", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:"#DC2626", fontSize:14 }}>×</button>}
                  <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:8 }}>
                    <Field label={`Item ${idx+1}`} value={item.description} onChange={v=>updItem(item.id,"description",v)} small />
                    <Field label="HSN/SAC" value={item.hsn} onChange={v=>updItem(item.id,"hsn",v)} small />
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                    <Field label="Qty" value={item.qty} onChange={v=>updItem(item.id,"qty",Number(v))} type="number" small />
                    <Field label="Rate ₹" value={item.rate} onChange={v=>updItem(item.id,"rate",Number(v))} type="number" small />
                    {gstType==="igst"
                      ? <Field label="IGST %" value={item.igst} onChange={v=>updItem(item.id,"igst",Number(v))} type="number" small />
                      : <Field label="CGST/SGST %" value={item.cgst} onChange={v=>{updItem(item.id,"cgst",Number(v));updItem(item.id,"sgst",Number(v));}} type="number" small />
                    }
                  </div>
                </div>
              ))}
              <button onClick={()=>setItems(p=>[...p,defaultItem()])} style={{ width:"100%", padding:10, borderRadius:10, border:`1.5px dashed ${BRAND}`, background:"#fff", color:BRAND, fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Item</button>
            </Section>
          </div>
          <div className="ei-prev" style={{ position:"sticky", top:88 }}>
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
              <EInvoicePreview data={{ invoice, supplier, buyer, items, gstType }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0" }}>
        <div className="seo-section" style={{ maxWidth: "80%", margin: "0 auto", width: "80%" }}>
          <DocumentPageSEO documentName="E-Invoice" documentSlug="e-invoice" intro={INTRO} whatIs={WHAT_IS} whyUse={WHY_USE} features={FEATURES} howToSteps={HOW_TO_STEPS} benefits={BENEFITS} formatFields={FORMAT_FIELDS} faqs={FAQS} relatedDocs={RELATED_DOCS} />
        </div>
      </div>
    </div>
  );
}
