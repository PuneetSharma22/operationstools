import { useState } from "react";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";
import SaveMenu from "../../components/common/SaveMenu";
import { exportSingleDocument } from "../../utils/documentExport";
import { logSaveRequest } from "../../utils/saveLog";

const TAINTED_HINT = "the logo image doesn't allow cross-origin access, which blocks export. Try a different image host, or clear the logo URL and try again.";

// Neutral document palette — a printed invoice should read like a normal
// business document, not a brand-colour showcase. Brand blue is reserved for
// interactive form chrome (focus rings, the billing-type toggle, the dashed
// "+ Add" button) and never appears in the invoice preview itself.
const INK = "#0F172A";
const INK_SOFT = "#475569";
const INK_MUTED = "#64748B";
const BORDER = "#E2E8F0";
const SURFACE = "#F8FAFC";
const SURFACE_ALT = "#F1F5F9";
const BRAND = "#2563EB";

// ─── SEO ─────────────────────────────────────────────────────────────────────
const SEO_TITLE = "Free Freelancer Invoice Generator Online — Hourly & Fixed Price (2026)";
const SEO_DESCRIPTION = "Generate a freelancer invoice online for free. Hourly or fixed-price billing, project details, and tax. No login. Instant PDF. India-compliant.";
const CANONICAL = "https://www.opstools.ai/documents/freelancer-invoice";
const softwareAppSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "OpsTools Freelancer Invoice Generator", operatingSystem: "Web", applicationCategory: "BusinessApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, description: SEO_DESCRIPTION, url: CANONICAL, provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" } };
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "Is this freelancer invoice generator free?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no login required." } },
  { "@type": "Question", name: "Can I bill hourly or fixed price?", acceptedAnswer: { "@type": "Answer", text: "Yes, you can toggle between hourly billing (hours × rate) and fixed-price billing (quantity × rate) depending on the engagement." } },
  { "@type": "Question", name: "Does it include tax and discounts?", acceptedAnswer: { "@type": "Answer", text: "Yes, you can set a tax percentage and an optional discount, both reflected in the final total." } },
  { "@type": "Question", name: "Can I add a project name?", acceptedAnswer: { "@type": "Answer", text: "Yes, an optional project name and description field appears on the invoice for context." } },
] };
const INTRO = (<><p style={{ marginBottom: 16 }}>Billing a client as a freelancer shouldn&apos;t mean fighting with a spreadsheet template every time. OpsTools Freelancer Invoice Generator gets you a clean, professional invoice in under a minute — hourly or fixed price, with tax and discount handled automatically.</p><p style={{ marginBottom: 16 }}>Toggle between hourly billing (log hours at a rate) and fixed-price billing (quantity at a rate) depending on how the engagement works. Add a project name and description for context, and the invoice total calculates itself from your line items, tax rate, and any discount.</p><p>The preview updates live as you type. Download directly as a PDF or PNG when ready — your data never leaves your browser.</p></>);
const WHAT_IS = `A freelancer invoice is a bill issued by an independent contractor or freelancer to a client for work completed, itemizing hours or deliverables, rate, tax, and total amount due. It's used both for payment collection and as a record for tax filing.`;
const WHY_USE = [
  { title: "Freelancers & consultants", body: "Bill clients professionally without needing dedicated invoicing software." },
  { title: "Hourly contractors", body: "Log hours against a rate and get an itemized invoice automatically." },
  { title: "Fixed-price projects", body: "Bill for deliverables or milestones at agreed fixed rates." },
  { title: "Side-project income", body: "Keep clean records of freelance income for tax purposes." },
];
const FEATURES = [
  { icon: "⏱️", title: "Hourly or fixed pricing", body: "Toggle between billing types depending on the engagement." },
  { icon: "📋", title: "Project details", body: "Optional project name and description field for context." },
  { icon: "🧮", title: "Tax & discount", body: "Set a tax percentage and optional discount, reflected in the total automatically." },
  { icon: "👁️", title: "Live preview", body: "See the invoice update in real time as you fill the form." },
  { icon: "⬇️", title: "PDF or PNG download", body: "One click downloads the invoice as a PDF or an image." },
  { icon: "🏷️", title: "Custom logo", body: "Paste any image URL to add your logo." },
  { icon: "🔒", title: "100% private", body: "No data is stored or transmitted. Everything happens in your browser." },
];
const HOW_TO_STEPS = [
  { step: 1, title: "Enter invoice details", body: "Invoice number, date, due date, and billing type (hourly or fixed)." },
  { step: 2, title: "Add project details", body: "Optional project name and description." },
  { step: 3, title: "Add line items", body: "List each task or deliverable with hours/quantity and rate." },
  { step: 4, title: "Set tax & discount", body: "Enter tax percentage and any discount to apply." },
  { step: 5, title: "Preview", body: "Check the live preview — totals update instantly." },
  { step: 6, title: "Download", body: "Use Save to download the invoice as a PDF or PNG." },
];
const BENEFITS = [
  "Toggle between hourly and fixed-price billing.",
  "Tax and discount calculated automatically.",
  "No registration or sign-up required.",
  "Direct PDF download — no print dialog.",
  "All data stays in your browser — zero privacy risk.",
  "Completely free — no subscription.",
];
const FORMAT_FIELDS = [
  { field: "Invoice No.", description: "Unique identifier for the invoice", example: "FREEL-2026-1042" },
  { field: "Billing Type", description: "Hourly or fixed-price billing basis", example: "Hourly" },
  { field: "Project Name", description: "Optional project or engagement name", example: "Website Redesign" },
  { field: "Line Items", description: "Task/deliverable with hours or quantity and rate", example: "UI Design — 12 hrs @ ₹1,500/hr" },
  { field: "Tax %", description: "Applicable tax rate on the subtotal", example: "18%" },
];
const FAQS = faqSchema.mainEntity.map((i) => ({ q: i.name, a: i.acceptedAnswer.text }));
const RELATED_DOCS = [
  { name: "Service Invoice Generator", href: "/documents/service-invoice", description: "Invoices for service-based businesses." },
  { name: "Invoice Generator", href: "/documents/invoice", description: "Professional invoices with line items." },
  { name: "Quotation Generator", href: "/documents/quotation", description: "Price quotes with validity and terms." },
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

function Section({ title, children }) {
  return (
    <div style={{ background:"#fff", borderRadius:16, border:`1px solid ${BORDER}`, padding:"20px 24px", marginBottom:16 }}>
      <h2 style={{ fontSize:13, fontWeight:700, color:INK, margin:"0 0 16px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</h2>
      {children}
    </div>
  );
}

const defaultItem = () => ({ id:Date.now()+Math.random(), description:"", hours:0, rate:0 });

const todayISO = () => new Date().toISOString().split("T")[0];
const daysFromNowISO = (n) => { const d=new Date(); d.setDate(d.getDate()+n); return d.toISOString().split("T")[0]; };

const lineAmount = (item) => Number(item.hours||0) * Number(item.rate||0);

function invoiceTotals(items, taxPct, discount) {
  const subtotal = items.reduce((s,i)=>s+lineAmount(i),0);
  const tax = subtotal * (Number(taxPct)||0) / 100;
  const total = subtotal + tax - (Number(discount)||0);
  return { subtotal, tax, total };
}

function FreelancerPreview({ data }) {
  const { freelancer, client, items } = data;
  const { subtotal, tax, total } = invoiceTotals(items, data.tax, data.discount);
  const unitLabel = data.billingType==="hourly" ? "Hours" : "Qty";

  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:11, color:"#1a1a1a", padding:"28px 32px" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, paddingBottom:16, borderBottom:`2px solid ${INK}` }}>
        <div>
          {data.logoUrl&&<img src={data.logoUrl} alt="logo" style={{ maxHeight:38, maxWidth:120, objectFit:"contain", marginBottom:8, display:"block" }}/>}
          <div style={{ fontSize:18, fontWeight:900, color:INK, letterSpacing:"0.02em" }}>INVOICE</div>
          <div style={{ fontSize:12, fontWeight:700, color:INK, marginTop:6 }}>{freelancer.name||"Your Name"}</div>
          <div style={{ fontSize:10, color:INK_SOFT, lineHeight:1.7 }}>
            {freelancer.title&&<div>{freelancer.title}</div>}
            {freelancer.email&&<div>{freelancer.email}</div>}
            {freelancer.phone&&<div>{freelancer.phone}</div>}
            {freelancer.website&&<div>{freelancer.website}</div>}
          </div>
        </div>
        <div style={{ textAlign:"right", fontSize:11 }}>
          <div><span style={{ color:INK_MUTED }}>Invoice No: </span><strong style={{ color:INK }}>{data.invoiceNo||"—"}</strong></div>
          <div style={{ marginTop:3 }}><span style={{ color:INK_MUTED }}>Date: </span><strong style={{ color:INK }}>{data.date?new Date(data.date+"T00:00:00").toLocaleDateString("en-IN"):"—"}</strong></div>
          {data.dueDate&&<div style={{ marginTop:3 }}><span style={{ color:INK_MUTED }}>Due: </span><strong style={{ color:INK }}>{new Date(data.dueDate+"T00:00:00").toLocaleDateString("en-IN")}</strong></div>}
          <div style={{ marginTop:6 }}>
            <span style={{ background:SURFACE_ALT, color:INK_SOFT, fontSize:9, fontWeight:700, padding:"2px 8px", borderRadius:999, textTransform:"uppercase", letterSpacing:"0.06em" }}>
              {data.billingType==="hourly"?"Hourly Billing":"Fixed Price"}
            </span>
          </div>
        </div>
      </div>

      {/* Bill to / project */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>Bill To</div>
          <div style={{ fontWeight:700, fontSize:12, color:INK }}>{client.name||"Client Name"}</div>
          <div style={{ fontSize:10, color:INK_SOFT, lineHeight:1.7 }}>
            {client.company&&<div>{client.company}</div>}
            {client.email&&<div>{client.email}</div>}
            {client.address&&<div>{client.address}</div>}
          </div>
        </div>
        <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>Project</div>
          <div style={{ fontWeight:700, fontSize:12, color:INK }}>{data.projectName||"—"}</div>
          {data.projectDesc&&<div style={{ fontSize:10, color:INK_SOFT, lineHeight:1.65, marginTop:2 }}>{data.projectDesc}</div>}
        </div>
      </div>

      {/* Line items */}
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:14 }}>
        <thead><tr style={{ background:INK, color:"#fff" }}>
          {["#","Description",unitLabel,"Rate (₹)","Amount (₹)"].map(h=>(
            <th key={h} style={{ padding:"7px 8px", fontSize:9, fontWeight:700, textAlign:h==="Description"?"left":"right" }}>{h}</th>
          ))}
        </tr></thead>
        <tbody>{items.map((item,i)=>(
          <tr key={item.id} style={{ borderBottom:`1px solid ${BORDER}`, background:i%2===0?"#fff":SURFACE }}>
            <td style={{ padding:"7px 8px", textAlign:"right", color:INK_MUTED, fontSize:10 }}>{i+1}</td>
            <td style={{ padding:"7px 8px", color:INK }}>{item.description||"—"}</td>
            <td style={{ padding:"7px 8px", textAlign:"right", fontSize:10 }}>{Number(item.hours||0)}</td>
            <td style={{ padding:"7px 8px", textAlign:"right", fontSize:10 }}>{Number(item.rate||0).toFixed(2)}</td>
            <td style={{ padding:"7px 8px", textAlign:"right", fontWeight:700, fontSize:11 }}>{lineAmount(item).toFixed(2)}</td>
          </tr>
        ))}</tbody>
      </table>

      {/* Totals */}
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:14 }}>
        <div style={{ width:240 }}>
          {[["Subtotal",subtotal],[`Tax (${Number(data.tax)||0}%)`,tax],Number(data.discount)>0?["Discount",-(Number(data.discount)||0)]:null].filter(Boolean).map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${SURFACE_ALT}`, fontSize:11 }}>
              <span style={{ color:INK_MUTED }}>{l}</span><span style={{ color:INK }}>{v<0?`-₹${Math.abs(v).toFixed(2)}`:`₹${v.toFixed(2)}`}</span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 12px", background:INK, color:"#fff", borderRadius:8, marginTop:8, fontSize:13, fontWeight:800 }}>
            <span>Total Due</span><span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {(freelancer.bankName||freelancer.upi||freelancer.accountNo)&&(
        <div style={{ border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px", fontSize:10, color:INK_SOFT, background:SURFACE }}>
          <div style={{ fontWeight:700, color:INK_MUTED, marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em", fontSize:9 }}>Payment Details</div>
          {freelancer.bankName&&<div><span style={{ color:INK_MUTED }}>Bank: </span>{freelancer.bankName}</div>}
          {freelancer.accountNo&&<div><span style={{ color:INK_MUTED }}>A/C: </span>{freelancer.accountNo}</div>}
          {freelancer.ifsc&&<div><span style={{ color:INK_MUTED }}>IFSC: </span>{freelancer.ifsc}</div>}
          {freelancer.upi&&<div><span style={{ color:INK_MUTED }}>UPI: </span>{freelancer.upi}</div>}
        </div>
      )}

      {data.notes&&<div style={{ marginTop:12, border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px", fontSize:10, color:INK_SOFT }}><strong style={{ color:INK }}>Notes: </strong>{data.notes}</div>}

      <div style={{ marginTop:20, textAlign:"right" }}>
        <div style={{ display:"inline-block", minWidth:180 }}>
          <div style={{ height:34, borderBottom:"1px solid #CBD5E1", marginBottom:4 }}/>
          <div style={{ fontSize:9, color:"#94A3B8" }}>Authorised Signature</div>
        </div>
      </div>
    </div>
  );
}

export default function FreelancerInvoicePage() {
  const [invoice, setInvoice] = useState(() => ({
    invoiceNo:`FREEL-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`,
    date:todayISO(),
    dueDate:daysFromNowISO(7),
    projectName:"Brightline Retail — Mobile App Redesign",
    projectDesc:"End-to-end UI/UX redesign of the Android and iOS shopping app, including a reusable design system and developer handoff.",
    billingType:"hourly",
    tax:"18",
    discount:"2000",
    logoUrl:"",
    notes:"Payment due within 7 days of the invoice date. Please quote the invoice number with the transfer.",
  }));
  const [freelancer, setFreelancer] = useState({
    name:"Ananya Iyer", title:"Independent UI/UX Designer",
    email:"ananya@ananyaiyer.design", phone:"+91 98204 41127", website:"ananyaiyer.design",
    bankName:"HDFC Bank — Prabhadevi Branch", accountNo:"50100234567890", ifsc:"HDFC0001234", upi:"ananyaiyer@okhdfcbank",
  });
  const [client, setClient] = useState({
    name:"Vikram Desai", company:"Brightline Retail Pvt Ltd",
    email:"accounts@brightlineretail.in", address:"3rd Floor, Trade Centre, Prabhadevi, Mumbai 400025",
  });
  const [items, setItems] = useState([
    { id:1001, description:"UI design — 18 app screens (hourly)", hours:24, rate:1500 },
    { id:1002, description:"Design system & component library (fixed deliverable)", hours:1, rate:25000 },
    { id:1003, description:"Milestone 2 — developer handoff & QA support", hours:8, rate:1500 },
  ]);
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");

  useSEO({
    title: SEO_TITLE, description: SEO_DESCRIPTION, canonical: CANONICAL,
    breadcrumbs: [
      { name: "Home", url: "https://www.opstools.ai" },
      { name: "Documents", url: "https://www.opstools.ai/documents" },
      { name: "Freelancer Invoice Generator", url: CANONICAL },
    ],
    schemas: [softwareAppSchema, faqSchema],
  });

  const upd=setter=>(k,v)=>setter(p=>({...p,[k]:v}));
  const updItem=(id,k,v)=>setItems(p=>p.map(i=>i.id===id?{...i,[k]:v}:i));

  const previewData = { ...invoice, freelancer, client, items };
  const { subtotal, total } = invoiceTotals(items, invoice.tax, invoice.discount);

  const doDownload = async (format = "pdf") => {
    if (downloading) return;
    setDownloading(true);
    setNotice("");

    const data = { ...invoice, freelancer, client, items };
    const printId = `FRL-${Date.now()}`;
    const logged = await logSaveRequest({ template: "freelancer-invoice", printId, billData: data });
    if (!logged.ok) setNotice("Your invoice downloaded fine, but we couldn't record it on our side.");

    await exportSingleDocument({
      Template: FreelancerPreview,
      data,
      format,
      fileBase: `freelancer-invoice-${invoice.invoiceNo || Date.now()}`,
      taintedHint: TAINTED_HINT,
    });
    setDownloading(false);
  };

  return (
    <div style={{ backgroundColor:SURFACE, minHeight:"100vh" }}>
      <style>{`@media(max-width:1023px){.fl-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .fl-grid{grid-template-columns:1fr!important;}}@media(max-width:768px){.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#0c2340 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#7DD3FC" }}><a href="/" style={{ color:"#7DD3FC", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span><a href="/documents" style={{ color:"#7DD3FC", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span><span style={{ color:"#BAE6FD" }}>Freelancer Invoice</span></nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Freelancer Invoice Generator</h1>
          <p style={{ fontSize:14, color:"#7DD3FC", margin:0 }}>Professional invoices for freelancers — hourly or fixed price, with tax and payment details.</p>
        </div>
      </section>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div className="fl-grid" style={{ display:"grid", gridTemplateColumns:"1fr 500px", gap:28, alignItems:"start" }}>
          <div>
            <Section title="Invoice Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Invoice No." value={invoice.invoiceNo} onChange={v=>upd(setInvoice)("invoiceNo",v)} />
                <Field label="Invoice Date" value={invoice.date} onChange={v=>upd(setInvoice)("date",v)} type="date" />
                <Field label="Due Date" value={invoice.dueDate} onChange={v=>upd(setInvoice)("dueDate",v)} type="date" />
                <Field label="Tax %" value={invoice.tax} onChange={v=>upd(setInvoice)("tax",v)} type="number" placeholder="18" />
                <Field label="Discount (₹)" value={invoice.discount} onChange={v=>upd(setInvoice)("discount",v)} type="number" placeholder="0" />
                <Field label="Logo URL" value={invoice.logoUrl} onChange={v=>upd(setInvoice)("logoUrl",v)} placeholder="https://..." />
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:600, color:INK_MUTED, display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em" }}>Billing Type</label>
                <div style={{ display:"flex", gap:8 }}>
                  {[{key:"hourly",label:"Hourly"},{key:"fixed",label:"Fixed Price"}].map(opt=>(
                    <button key={opt.key} onClick={()=>upd(setInvoice)("billingType",opt.key)} style={{ flex:1, padding:"9px 12px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", border:invoice.billingType===opt.key?`1.5px solid ${BRAND}`:`1.5px solid ${BORDER}`, background:invoice.billingType===opt.key?"#EFF6FF":"#fff", color:invoice.billingType===opt.key?BRAND:INK_MUTED }}>{opt.label}</button>
                  ))}
                </div>
              </div>
            </Section>

            <Section title="Your Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Full Name" value={freelancer.name} onChange={v=>upd(setFreelancer)("name",v)} placeholder="Ananya Iyer" />
                <Field label="Title / Profession" value={freelancer.title} onChange={v=>upd(setFreelancer)("title",v)} placeholder="UI/UX Designer" />
                <Field label="Email" value={freelancer.email} onChange={v=>upd(setFreelancer)("email",v)} />
                <Field label="Phone" value={freelancer.phone} onChange={v=>upd(setFreelancer)("phone",v)} />
                <Field label="Website" value={freelancer.website} onChange={v=>upd(setFreelancer)("website",v)} placeholder="yoursite.com" />
                <Field label="UPI ID" value={freelancer.upi} onChange={v=>upd(setFreelancer)("upi",v)} placeholder="name@upi" />
              </div>
              <div style={{ background:SURFACE, borderRadius:12, padding:"14px 16px", border:`1px solid ${BORDER}` }}>
                <div style={{ fontSize:12, fontWeight:700, color:INK, marginBottom:12 }}>Bank Details</div>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  <Field label="Bank Name" value={freelancer.bankName} onChange={v=>upd(setFreelancer)("bankName",v)} small />
                  <Field label="Account No." value={freelancer.accountNo} onChange={v=>upd(setFreelancer)("accountNo",v)} small />
                  <Field label="IFSC" value={freelancer.ifsc} onChange={v=>upd(setFreelancer)("ifsc",v)} small />
                </div>
              </div>
            </Section>

            <Section title="Client Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Client Name" value={client.name} onChange={v=>upd(setClient)("name",v)} placeholder="Vikram Desai" />
                <Field label="Company" value={client.company} onChange={v=>upd(setClient)("company",v)} placeholder="Brightline Retail Pvt Ltd" />
                <Field label="Email" value={client.email} onChange={v=>upd(setClient)("email",v)} />
                <Field label="Address" value={client.address} onChange={v=>upd(setClient)("address",v)} />
              </div>
            </Section>

            <Section title="Project">
              <Field label="Project Name" value={invoice.projectName} onChange={v=>upd(setInvoice)("projectName",v)} placeholder="Website Redesign" />
              <Field label="Project Description" value={invoice.projectDesc} onChange={v=>upd(setInvoice)("projectDesc",v)} placeholder="Brief description of work done" />
            </Section>

            <Section title="Line Items">
              {items.map((item,idx)=>(
                <div key={item.id} style={{ background:SURFACE, borderRadius:12, padding:"14px 16px", marginBottom:10, border:`1px solid ${BORDER}`, position:"relative" }}>
                  {items.length>1&&<button onClick={()=>setItems(p=>p.filter(i=>i.id!==item.id))} style={{ position:"absolute", top:10, right:10, background:"#FEF2F2", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:"#DC2626", fontSize:14 }}>×</button>}
                  <Field label={`Item ${idx+1}`} value={item.description} onChange={v=>updItem(item.id,"description",v)} placeholder="Logo design" small />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    <Field label={invoice.billingType==="hourly"?"Hours":"Qty"} value={item.hours} onChange={v=>updItem(item.id,"hours",Number(v))} type="number" small />
                    <Field label="Rate ₹" value={item.rate} onChange={v=>updItem(item.id,"rate",Number(v))} type="number" small />
                  </div>
                  <div style={{ fontSize:12, color:INK, fontWeight:700, marginTop:4 }}>= ₹{lineAmount(item).toFixed(2)}</div>
                </div>
              ))}
              <button onClick={()=>setItems(p=>[...p,defaultItem()])} style={{ width:"100%", padding:10, borderRadius:10, border:`1.5px dashed ${BRAND}`, background:SURFACE, color:BRAND, fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Item</button>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginTop:12, fontSize:12, color:INK_MUTED }}>
                <span>Subtotal</span><span style={{ fontWeight:600, color:INK }}>₹{subtotal.toFixed(2)}</span>
              </div>
              <div style={{ background:INK, color:"#fff", borderRadius:10, padding:"12px 16px", marginTop:8, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:14, fontWeight:700 }}>Total Due</span>
                <span style={{ fontSize:18, fontWeight:900 }}>₹{total.toFixed(2)}</span>
              </div>
            </Section>

            <Section title="Notes">
              <textarea value={invoice.notes} onChange={e=>upd(setInvoice)("notes",e.target.value)} rows={2} style={{ width:"100%", border:`1.5px solid ${BORDER}`, borderRadius:8, padding:"8px 12px", fontSize:13, color:INK, resize:"vertical", boxSizing:"border-box", outline:"none" }}/>
            </Section>
          </div>

          <div className="fl-prev" style={{ position:"sticky", top:88 }}>
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
              <FreelancerPreview data={previewData} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background:"#fff", borderTop:`1px solid ${BORDER}` }}>
        <div className="seo-section" style={{ maxWidth: "80%", margin: "0 auto", width: "80%" }}>
          <DocumentPageSEO documentName="Freelancer Invoice" documentSlug="freelancer-invoice" intro={INTRO} whatIs={WHAT_IS} whyUse={WHY_USE} features={FEATURES} howToSteps={HOW_TO_STEPS} benefits={BENEFITS} formatFields={FORMAT_FIELDS} faqs={FAQS} relatedDocs={RELATED_DOCS} />
        </div>
      </div>
    </div>
  );
}
