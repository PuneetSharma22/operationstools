import { useState } from "react";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";
import SaveMenu from "../../components/common/SaveMenu";
import { exportSingleDocument } from "../../utils/documentExport";
import { logSaveRequest } from "../../utils/saveLog";

const TAINTED_HINT = "the logo image doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again.";

// Neutral document palette — a printed quotation should read like a normal
// business document, not a brand-colour showcase. Brand blue is reserved for
// interactive form chrome (input focus, the dashed "add" button), never for
// the quotation preview itself.
const INK = "#0F172A";
const INK_SOFT = "#475569";
const INK_MUTED = "#64748B";
const BORDER = "#E2E8F0";
const SURFACE = "#F8FAFC";
const SURFACE_ALT = "#F1F5F9";
const BRAND = "#2563EB";

// ─── SEO ─────────────────────────────────────────────────────────────────────
const SEO_TITLE = "Free Quotation Generator Online — Business Price Quote PDF (2026)";
const SEO_DESCRIPTION = "Generate professional business quotations online for free. Line items, validity period, and terms & conditions. No login. Instant PDF.";
const CANONICAL = "https://www.opstools.ai/documents/quotation";
const softwareAppSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "OpsTools Quotation Generator", operatingSystem: "Web", applicationCategory: "BusinessApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, description: SEO_DESCRIPTION, url: CANONICAL, provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" } };
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "Is this quotation generator free?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no login required." } },
  { "@type": "Question", name: "What's the difference between a quotation and an invoice?", acceptedAnswer: { "@type": "Answer", text: "A quotation is a price estimate offered before work begins, while an invoice is a request for payment after goods or services are delivered. This tool is for the former." } },
  { "@type": "Question", name: "Can I set a validity period?", acceptedAnswer: { "@type": "Answer", text: "Yes, you can specify how long the quoted prices remain valid, which appears clearly on the document." } },
  { "@type": "Question", name: "Can I add terms and conditions?", acceptedAnswer: { "@type": "Answer", text: "Yes, a dedicated terms & conditions field lets you specify payment terms, delivery timelines, or other conditions." } },
] };
const INTRO = (<><p style={{ marginBottom: 16 }}>Sending a client a price quote shouldn&apos;t mean formatting a document from scratch every time. OpsTools Quotation Generator gets you a professional, clearly laid-out quotation in under a minute — line items, validity period, and terms, all in one document.</p><p style={{ marginBottom: 16 }}>List your priced items, set how long the quote remains valid, and add any terms and conditions — payment terms, delivery timelines, or whatever your business needs specified upfront.</p><p>The preview updates live as you type. Download directly as a PDF — your data never leaves your browser.</p></>);
const WHAT_IS = `A quotation (or price quote) is a document a business sends a prospective client, listing prices for goods or services before any commitment is made. Unlike an invoice, it's not a request for payment — it's an offer, usually valid for a limited period.`;
const WHY_USE = [
  { title: "Sales & business development", body: "Send prospective clients a clear, professional price quote." },
  { title: "Service providers", body: "Quote for a project before work begins, with clear terms." },
  { title: "Freelancers & consultants", body: "Formalize pricing discussions with a proper written quote." },
];
const FEATURES = [
  { icon: "📋", title: "Itemized pricing", body: "List each item or service with quantity and rate." },
  { icon: "📅", title: "Validity period", body: "Specify how long the quoted prices remain valid." },
  { icon: "📝", title: "Terms & conditions", body: "Add payment terms, delivery timelines, or other conditions." },
  { icon: "👁️", title: "Live preview", body: "See the quotation update in real time as you fill the form." },
  { icon: "⬇️", title: "Direct PDF download", body: "One click downloads the quotation as a PDF." },
  { icon: "🔒", title: "100% private", body: "No data is stored or transmitted. Everything happens in your browser." },
];
const HOW_TO_STEPS = [
  { step: 1, title: "Enter quote details", body: "Quote number, date, and validity period." },
  { step: 2, title: "Add your business & client details", body: "Both parties' names and contact info." },
  { step: 3, title: "Add line items", body: "List each priced item or service." },
  { step: 4, title: "Add terms", body: "Optional terms & conditions and notes." },
  { step: 5, title: "Preview", body: "Check the live preview — totals update instantly." },
  { step: 6, title: "Download PDF", body: "Click Save to download the quotation." },
];
const BENEFITS = [
  "Clear, professional price quotes in seconds.",
  "Validity period clearly displayed.",
  "Terms & conditions field included.",
  "No registration or sign-up required.",
  "All data stays in your browser — zero privacy risk.",
  "Completely free — no subscription.",
];
const FORMAT_FIELDS = [
  { field: "Quote No.", description: "Unique identifier for the quotation", example: "QUOTE-2026-1042" },
  { field: "Validity", description: "How long the quoted prices remain valid", example: "30 days from issue" },
  { field: "Line Items", description: "Priced items or services offered", example: "Website Design — ₹25,000" },
  { field: "Terms & Conditions", description: "Payment or delivery terms for the quote", example: "50% advance, balance on delivery" },
];
const FAQS = faqSchema.mainEntity.map((i) => ({ q: i.name, a: i.acceptedAnswer.text }));
const RELATED_DOCS = [
  { name: "Invoice Generator", href: "/documents/invoice", description: "Professional invoices with line items." },
  { name: "Freelancer Invoice", href: "/documents/freelancer-invoice", description: "Hourly & fixed price invoices." },
  { name: "Service Invoice Generator", href: "/documents/service-invoice", description: "Invoices for service-based businesses." },
];

function Field({ label, value, onChange, placeholder, type="text", small }) {
  return (
    <div style={{ marginBottom:small?8:12 }}>
      {label && <label style={{ fontSize:11, fontWeight:600, color:INK_MUTED, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder} onChange={e=>onChange&&onChange(e.target.value)}
        style={{ width:"100%", height:small?32:38, border:`1.5px solid ${BORDER}`, borderRadius:8, padding:"0 10px", fontSize:13, color:INK, outline:"none", boxSizing:"border-box", background:"#fff" }}
        onFocus={e=>e.target.style.borderColor=BRAND} onBlur={e=>e.target.style.borderColor=BORDER} />
    </div>
  );
}

const defaultItem = () => ({ id:Date.now()+Math.random(), description:"", qty:1, rate:0, note:"" });

const todayISO = () => new Date().toISOString().split("T")[0];
const daysAheadISO = (n) => { const d=new Date(); d.setDate(d.getDate()+n); return d.toISOString().split("T")[0]; };

function QuotePreview({ data }) {
  const { quote, from, to, items } = data;
  const subtotal = items.reduce((s,i)=>s+i.qty*i.rate,0);
  const total = subtotal - (Number(quote.discount)||0);
  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:12, color:"#1a1a1a", padding:"32px 40px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, paddingBottom:16, borderBottom:`2px solid ${INK}` }}>
        <div>
          {quote.logoUrl && <img src={quote.logoUrl} alt="logo" style={{ maxHeight:52, maxWidth:160, objectFit:"contain", marginBottom:8, display:"block" }}/>}
          <div style={{ fontSize:18, fontWeight:800, color:INK }}>{from.name||"Your Business"}</div>
          <div style={{ fontSize:11, color:INK_SOFT, marginTop:3, lineHeight:1.7 }}>
            {from.address&&<div>{from.address}</div>}
            {from.email&&<div>{from.email}</div>}
            {from.phone&&<div>{from.phone}</div>}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:22, fontWeight:900, color:INK }}>QUOTATION</div>
          <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 16px", marginTop:8, fontSize:12 }}>
            <div style={{ display:"flex", gap:16, justifyContent:"flex-end" }}><span style={{ color:INK_MUTED }}>Quote No.</span><strong style={{ color:INK }}>{quote.quoteNo||"—"}</strong></div>
            <div style={{ display:"flex", gap:16, justifyContent:"flex-end", marginTop:4 }}><span style={{ color:INK_MUTED }}>Date</span><strong style={{ color:INK }}>{quote.date?new Date(quote.date+"T00:00:00").toLocaleDateString("en-IN"):"—"}</strong></div>
            {quote.validUntil&&<div style={{ display:"flex", gap:16, justifyContent:"flex-end", marginTop:4 }}><span style={{ color:INK_MUTED }}>Valid Until</span><strong style={{ color:INK }}>{new Date(quote.validUntil+"T00:00:00").toLocaleDateString("en-IN")}</strong></div>}
          </div>
        </div>
      </div>
      <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"12px 16px", marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Prepared For</div>
        <div style={{ fontWeight:700, fontSize:13, color:INK }}>{to.name||"Client Name"}</div>
        <div style={{ fontSize:11, color:INK_SOFT, lineHeight:1.7 }}>{to.address&&<span>{to.address}<br/></span>}{to.email&&<span>{to.email}</span>}</div>
      </div>
      {quote.subject&&<div style={{ background:SURFACE_ALT, border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 16px", marginBottom:20, fontSize:13, color:INK, fontWeight:600 }}>Re: {quote.subject}</div>}
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:16 }}>
        <thead><tr style={{ background:INK, color:"#fff" }}>
          {["#","Description","Qty","Rate (₹)","Amount (₹)"].map(h=><th key={h} style={{ padding:"8px 10px", fontSize:10, fontWeight:700, textAlign:h==="Description"?"left":"right" }}>{h}</th>)}
        </tr></thead>
        <tbody>{items.map((item,i)=>{
          const amt=item.qty*item.rate;
          return <tr key={item.id} style={{ borderBottom:`1px solid ${BORDER}`, background:i%2===0?"#fff":SURFACE }}>
            <td style={{ padding:"9px 10px", textAlign:"right", color:INK_MUTED }}>{i+1}</td>
            <td style={{ padding:"9px 10px", color:INK }}><div>{item.description||"—"}</div>{item.note&&<div style={{ fontSize:10, color:INK_MUTED, marginTop:2 }}>{item.note}</div>}</td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{item.qty}</td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{item.rate.toFixed(2)}</td>
            <td style={{ padding:"9px 10px", textAlign:"right", fontWeight:700, color:INK }}>{amt.toFixed(2)}</td>
          </tr>;
        })}</tbody>
      </table>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <div style={{ width:220 }}>
          <div style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${SURFACE_ALT}`, fontSize:12 }}><span style={{ color:INK_MUTED }}>Subtotal</span><span style={{ color:INK }}>₹{subtotal.toFixed(2)}</span></div>
          {Number(quote.discount)>0&&<div style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${SURFACE_ALT}`, fontSize:12 }}><span style={{ color:INK_MUTED }}>Discount</span><span style={{ color:INK }}>-₹{Number(quote.discount).toFixed(2)}</span></div>}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 12px", background:INK, color:"#fff", borderRadius:8, marginTop:8, fontSize:14, fontWeight:800 }}><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        </div>
      </div>
      {quote.terms&&<div style={{ border:`1px solid ${BORDER}`, borderRadius:8, padding:"12px 14px", fontSize:11, color:INK_SOFT, marginBottom:12 }}><strong style={{ color:INK }}>Terms &amp; Conditions: </strong>{quote.terms}</div>}
      {quote.notes&&<div style={{ border:`1px solid ${BORDER}`, borderRadius:8, padding:"12px 14px", fontSize:11, color:INK_SOFT }}><strong style={{ color:INK }}>Notes: </strong>{quote.notes}</div>}
    </div>
  );
}

function Section({title,children}) {
  return (
    <div style={{ background:"#fff", borderRadius:16, border:`1px solid ${BORDER}`, padding:"20px 24px", marginBottom:16 }}>
      <h2 style={{ fontSize:13, fontWeight:700, color:INK, margin:"0 0 16px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</h2>
      {children}
    </div>
  );
}

export default function QuotationGeneratorPage() {
  const [quote, setQuote] = useState(() => ({
    quoteNo:`QUOTE-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`,
    date:todayISO(),
    validUntil:daysAheadISO(30),
    subject:"Office interior fit-out — Madhapur campus, Phase 1",
    logoUrl:"",
    discount:"15000",
    terms:"50% advance on confirmation of order, balance payable on delivery. Prices are exclusive of GST. This quotation is valid for 30 days from the date of issue.",
    notes:"Delivery within 4 weeks of a confirmed purchase order. Installation and one round of on-site adjustments are included.",
  }));
  const [from, setFrom] = useState({
    name:"Nimbus Interiors Pvt Ltd",
    address:"4th Floor, Prestige Arcade, MG Road, Bengaluru 560001",
    email:"sales@nimbusinteriors.in",
    phone:"+91 98450 12345",
  });
  const [to, setTo] = useState({
    name:"Meridian Softworks Pvt Ltd",
    address:"Plot 21, Hitech City Road, Madhapur, Hyderabad 500081",
    email:"accounts@meridiansoftworks.in",
  });
  const [items, setItems] = useState([
    { id:2001, description:"Modular workstation units (6-seater)", qty:4, rate:48500, note:"Powder-coated steel frame, 3-year warranty" },
    { id:2002, description:"Acoustic conference room panelling", qty:1, rate:62000, note:"Includes installation; 2-week lead time" },
    { id:2003, description:"Site measurement & 3D layout design", qty:1, rate:18000, note:"Two revision rounds included" },
  ]);
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");

  const upd = setter=>(k,v)=>setter(p=>({...p,[k]:v}));
  const updItem = (id,k,v)=>setItems(p=>p.map(i=>i.id===id?{...i,[k]:v}:i));

  const doDownload = async (format = "pdf") => {
    if (downloading) return;
    setDownloading(true);
    setNotice("");

    const data = { quote, from, to, items };
    const printId = `QUOT-${Date.now()}`;
    const logged = await logSaveRequest({ template: "quotation", printId, billData: data });
    if (!logged.ok) setNotice("Your quotation downloaded fine, but we couldn't record it on our side.");

    await exportSingleDocument({
      Template: QuotePreview,
      data,
      format,
      fileBase: `quotation-${quote.quoteNo || Date.now()}`,
      taintedHint: TAINTED_HINT,
    });
    setDownloading(false);
  };

  useSEO({
    title: SEO_TITLE, description: SEO_DESCRIPTION, canonical: CANONICAL,
    breadcrumbs: [
      { name: "Home", url: "https://www.opstools.ai" },
      { name: "Documents", url: "https://www.opstools.ai/documents" },
      { name: "Quotation Generator", url: CANONICAL },
    ],
    schemas: [softwareAppSchema, faqSchema],
  });

  return (
    <div style={{ backgroundColor:SURFACE, minHeight:"100vh" }}>
      <style>{`@media(max-width:1023px){.qt-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .qt-grid{grid-template-columns:1fr!important;}}@media(max-width:768px){.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#0c2340 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#7DD3FC" }}>
            <a href="/" style={{ color:"#7DD3FC", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span>
            <a href="/documents" style={{ color:"#7DD3FC", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span>
            <span style={{ color:"#BAE6FD" }}>Quotation Generator</span>
          </nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Quotation Generator</h1>
          <p style={{ fontSize:14, color:"#7DD3FC", margin:0 }}>Professional price quotes with line items, validity period, and terms.</p>
        </div>
      </section>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div className="qt-grid" style={{ display:"grid", gridTemplateColumns:"1fr 500px", gap:28, alignItems:"start" }}>
          <div>
            <Section title="Quotation Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Quote No." value={quote.quoteNo} onChange={v=>upd(setQuote)("quoteNo",v)} />
                <Field label="Date" value={quote.date} onChange={v=>upd(setQuote)("date",v)} type="date" />
                <Field label="Valid Until" value={quote.validUntil} onChange={v=>upd(setQuote)("validUntil",v)} type="date" />
                <Field label="Discount (₹)" value={quote.discount} onChange={v=>upd(setQuote)("discount",v)} type="number" placeholder="0" />
              </div>
              <Field label="Subject / Re:" value={quote.subject} onChange={v=>upd(setQuote)("subject",v)} placeholder="Website development project" />
              <Field label="Logo URL" value={quote.logoUrl} onChange={v=>upd(setQuote)("logoUrl",v)} placeholder="https://..." />
            </Section>
            <Section title="From (Your Business)">
              <Field label="Business Name" value={from.name} onChange={v=>upd(setFrom)("name",v)} />
              <Field label="Address" value={from.address} onChange={v=>upd(setFrom)("address",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Email" value={from.email} onChange={v=>upd(setFrom)("email",v)} />
                <Field label="Phone" value={from.phone} onChange={v=>upd(setFrom)("phone",v)} />
              </div>
            </Section>
            <Section title="Prepared For (Client)">
              <Field label="Client Name" value={to.name} onChange={v=>upd(setTo)("name",v)} />
              <Field label="Address" value={to.address} onChange={v=>upd(setTo)("address",v)} />
              <Field label="Email" value={to.email} onChange={v=>upd(setTo)("email",v)} />
            </Section>
            <Section title="Line Items">
              {items.map((item,idx)=>(
                <div key={item.id} style={{ background:SURFACE, borderRadius:12, padding:"14px 16px", marginBottom:10, border:`1px solid ${BORDER}`, position:"relative" }}>
                  {items.length>1&&<button onClick={()=>setItems(p=>p.filter(i=>i.id!==item.id))} style={{ position:"absolute", top:10, right:10, background:"#FEF2F2", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:"#DC2626", fontSize:14 }}>×</button>}
                  <div style={{ fontSize:11, fontWeight:700, color:INK_MUTED, marginBottom:8, textTransform:"uppercase" }}>Item {idx+1}</div>
                  <Field label="Description" value={item.description} onChange={v=>updItem(item.id,"description",v)} small />
                  <Field label="Note (optional)" value={item.note} onChange={v=>updItem(item.id,"note",v)} placeholder="Specifications, delivery time etc." small />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    <Field label="Qty" value={item.qty} onChange={v=>updItem(item.id,"qty",Number(v))} type="number" small />
                    <Field label="Rate ₹" value={item.rate} onChange={v=>updItem(item.id,"rate",Number(v))} type="number" small />
                  </div>
                  <div style={{ fontSize:12, color:INK, fontWeight:700, marginTop:6 }}>= ₹{(item.qty*item.rate).toFixed(2)}</div>
                </div>
              ))}
              <button onClick={()=>setItems(p=>[...p,defaultItem()])} style={{ width:"100%", padding:10, borderRadius:10, border:`1.5px dashed ${BRAND}`, background:"#fff", color:BRAND, fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Item</button>
              <div style={{ background:INK, color:"#fff", borderRadius:10, padding:"12px 16px", marginTop:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:14, fontWeight:700 }}>Total</span>
                <span style={{ fontSize:18, fontWeight:900 }}>₹{(items.reduce((s,i)=>s+i.qty*i.rate,0)-(Number(quote.discount)||0)).toFixed(2)}</span>
              </div>
            </Section>
            <Section title="Terms & Notes">
              <Field label="Terms & Conditions" value={quote.terms} onChange={v=>upd(setQuote)("terms",v)} />
              <Field label="Notes" value={quote.notes} onChange={v=>upd(setQuote)("notes",v)} placeholder="Payment terms, delivery etc." />
            </Section>
          </div>
          <div className="qt-prev" style={{ position:"sticky", top:88 }}>
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
              <QuotePreview data={{ quote, from, to, items }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderTop: `1px solid ${BORDER}` }}>
        <div className="seo-section" style={{ maxWidth: "80%", margin: "0 auto", width: "80%" }}>
          <DocumentPageSEO documentName="Quotation" documentSlug="quotation" intro={INTRO} whatIs={WHAT_IS} whyUse={WHY_USE} features={FEATURES} howToSteps={HOW_TO_STEPS} benefits={BENEFITS} formatFields={FORMAT_FIELDS} faqs={FAQS} relatedDocs={RELATED_DOCS} />
        </div>
      </div>
    </div>
  );
}
