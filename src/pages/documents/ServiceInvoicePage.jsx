import { useState } from "react";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";
import SaveMenu from "../../components/common/SaveMenu";
import { exportSingleDocument } from "../../utils/documentExport";
import { logSaveRequest } from "../../utils/saveLog";

const TAINTED_HINT = "the logo image doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again.";

// Neutral document palette — a printed invoice should read like a normal
// business document, not a brand-colour showcase. Brand blue is reserved for
// interactive form chrome (focus rings, "+ Add" buttons) below, never for the
// invoice preview itself.
const INK = "#0F172A";
const INK_SOFT = "#475569";
const INK_MUTED = "#64748B";
const BORDER = "#E2E8F0";
const SURFACE = "#F8FAFC";
const SURFACE_ALT = "#F1F5F9";
const BRAND = "#2563EB";

// ─── SEO ─────────────────────────────────────────────────────────────────────
const SEO_TITLE = "Free Service Invoice Generator Online — GST Service Bills (2026)";
const SEO_DESCRIPTION = "Create a professional service invoice online for free. Line items, hourly rates, GST, discounts and payment terms. No login. Instant PDF or PNG download.";
const CANONICAL = "https://www.opstools.ai/documents/service-invoice";

const softwareAppSchema = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "OpsTools Service Invoice Generator",
  operatingSystem: "Web",
  applicationCategory: "BusinessApplication",
  offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
  description: SEO_DESCRIPTION,
  url: CANONICAL,
  provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" },
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    { "@type": "Question", name: "Is this service invoice generator free?", acceptedAnswer: { "@type": "Answer", text: "Yes. It is completely free with no login and no limit on how many invoices you create. Everything runs in your browser." } },
    { "@type": "Question", name: "What is the difference between a service invoice and a product invoice?", acceptedAnswer: { "@type": "Answer", text: "A service invoice bills for work performed rather than goods supplied, so line items are usually hours, milestones, retainers or visits instead of physical quantities. For GST purposes services are classified with SAC codes rather than HSN codes." } },
    { "@type": "Question", name: "Can I add GST to a service invoice?", acceptedAnswer: { "@type": "Answer", text: "Yes. Each line item carries its own tax percentage, so you can apply 18% GST to consulting work and a different rate to another service on the same invoice. Add your GSTIN and your client's GSTIN in the provider and client sections." } },
    { "@type": "Question", name: "Do I need a GSTIN to issue a service invoice?", acceptedAnswer: { "@type": "Answer", text: "No. If you are not GST registered you can leave the GSTIN fields blank and set the tax percentage on each line to 0 — the invoice will simply show the service amounts and total." } },
    { "@type": "Question", name: "Can I download the invoice as an image instead of a PDF?", acceptedAnswer: { "@type": "Answer", text: "Yes. The Save menu offers both PDF and PNG, so you can attach a PDF to an email or paste a PNG into a chat thread." } },
  ],
};

const INTRO = (
  <>
    <p style={{ marginBottom: 16 }}>Consultants, agencies, freelancers and service businesses bill for time and outcomes rather than goods — and most invoice tools are built around products, stock and shipping. OpsTools Service Invoice Generator is built for the other half: hours, milestones, retainers and site visits, each with its own rate and tax.</p>
    <p style={{ marginBottom: 16 }}>Add your business details, your client, and as many service lines as the engagement needs. Subtotal, per-line tax and the final payable amount recalculate as you type, and a discount field handles negotiated write-downs without breaking the maths.</p>
    <p>The preview on the right is exactly what downloads. Save it as a PDF to attach to an email or as a PNG to drop into a message — nothing is uploaded, and no sign-up is required.</p>
  </>
);

const WHAT_IS = "A service invoice is the bill a service provider issues to a client for work performed — consulting hours, a delivered project milestone, a monthly retainer, a maintenance visit. It lists each service with its quantity, unit, rate and applicable tax, and states the total payable along with the payment terms. For GST-registered providers in India it doubles as the tax invoice supporting the client's input tax credit claim.";

const WHY_USE = [
  { title: "Consultants & freelancers", body: "Bill hourly or per-project work with a clean, professional document instead of a spreadsheet screenshot." },
  { title: "Agencies & studios", body: "Invoice retainers and milestone deliverables on the same document, each with its own rate." },
  { title: "Maintenance & field services", body: "Charge per visit or per unit serviced, with quantities and rates spelled out line by line." },
  { title: "Small service businesses", body: "Issue GST-compliant invoices without paying for accounting software you barely use." },
  { title: "Finance & accounts teams", body: "Produce consistent, audit-ready service bills that clients can process without follow-up questions." },
];

const FEATURES = [
  { icon: "🧾", title: "Service-first line items", body: "Every line carries a unit — hour, visit, milestone, month — so the invoice reads the way you actually bill." },
  { icon: "📊", title: "Per-line tax rates", body: "Set GST individually on each service; the breakdown and totals update instantly." },
  { icon: "🏷️", title: "Discount handling", body: "Apply a negotiated discount to the invoice total without editing every line rate." },
  { icon: "👁️", title: "Live preview", body: "The document redraws as you type — what you see is exactly what downloads." },
  { icon: "⬇️", title: "PDF or PNG export", body: "One menu, two formats: a PDF to attach or a PNG to paste into a chat." },
  { icon: "🏢", title: "Your logo", body: "Paste any image URL to put your own mark on the invoice header." },
  { icon: "📝", title: "Payment terms", body: "State your due date and terms on the document so payment expectations are unambiguous." },
  { icon: "🔒", title: "100% private", body: "The invoice is built entirely in your browser. Your client data is never uploaded." },
];

const HOW_TO_STEPS = [
  { step: 1, title: "Set the invoice details", body: "Invoice number, issue date, due date and an optional one-line summary of the engagement." },
  { step: 2, title: "Add your business", body: "Enter your name, address, GSTIN and contact details as the service provider." },
  { step: 3, title: "Add the client", body: "Enter the client's billing name, address and GSTIN so the invoice is addressed correctly." },
  { step: 4, title: "List the services", body: "Add a line per service with its unit, quantity, rate and tax percentage." },
  { step: 5, title: "Review the preview", body: "Check the totals, discount and terms in the live preview on the right." },
  { step: 6, title: "Download", body: "Use the Save menu to download the finished invoice as a PDF or PNG." },
];

const BENEFITS = [
  "Generate unlimited service invoices — no caps, credits or subscriptions.",
  "Bill hours, milestones and retainers on one document with separate rates.",
  "GST applied per line item, with subtotal and tax shown separately.",
  "No registration, no login, no email address required.",
  "All data stays in your browser — nothing is uploaded or stored.",
  "Export as a PDF for records or a PNG for quick sharing.",
];

const FORMAT_FIELDS = [
  { field: "Invoice Number", description: "Unique reference for the invoice in your own series", example: "SRV-2026-4218" },
  { field: "Invoice Date", description: "Date the invoice is issued to the client", example: "16/09/2026" },
  { field: "Due Date", description: "Date payment is expected, per your terms", example: "01/10/2026" },
  { field: "Service Description", description: "Name of the service supplied on that line", example: "Operations consulting — senior consultant" },
  { field: "Unit & Quantity", description: "How the service is measured and how much was supplied", example: "40 Hour" },
  { field: "Rate", description: "Charge per unit before tax", example: "₹2,500.00" },
  { field: "GST / Tax %", description: "Tax rate applicable to that service line", example: "18%" },
];

const FAQS = faqSchema.mainEntity.map((i) => ({ q: i.name, a: i.acceptedAnswer.text }));

const RELATED_DOCS = [
  { name: "Invoice Generator", href: "/documents/invoice", description: "General-purpose invoices for goods and services." },
  { name: "Freelancer Invoice Generator", href: "/documents/freelancer-invoice", description: "Simple invoices for independent professionals." },
  { name: "GST Invoice Generator", href: "/documents/gst-invoice", description: "GST tax invoices with HSN codes and tax breakdown." },
];

const BREADCRUMBS = [
  { name: "Home", url: "https://www.opstools.ai" },
  { name: "Documents", url: "https://www.opstools.ai/documents" },
  { name: "Service Invoice Generator", url: CANONICAL },
];

// ─── Form chrome ─────────────────────────────────────────────────────────────
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

const defaultItem = () => ({ id:Date.now()+Math.random(), description:"", qty:1, unit:"Service", rate:0, tax:18 });

const todayISO = () => new Date().toISOString().split("T")[0];
const daysFromNowISO = (n) => { const d=new Date(); d.setDate(d.getDate()+n); return d.toISOString().split("T")[0]; };
const fmtDate = (iso) => iso ? new Date(iso+"T00:00:00").toLocaleDateString("en-IN") : "—";

// ─── Invoice preview ─────────────────────────────────────────────────────────
function ServicePreview({ data }) {
  const { provider, client, items } = data;
  const subtotal = items.reduce((s,i)=>s+i.qty*i.rate,0);
  const tax = items.reduce((s,i)=>s+i.qty*i.rate*i.tax/100,0);
  const total = subtotal+tax-(Number(data.discount)||0);

  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:12, color:"#1a1a1a", padding:"32px 40px" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, paddingBottom:16, borderBottom:`2px solid ${INK}` }}>
        <div>
          {data.logoUrl&&<img src={data.logoUrl} alt="logo" style={{ maxHeight:44, maxWidth:140, objectFit:"contain", marginBottom:8, display:"block" }}/>}
          <div style={{ fontSize:18, fontWeight:800, color:INK, letterSpacing:"-0.01em" }}>{provider.name||"Service Provider"}</div>
          <div style={{ fontSize:11, color:INK_SOFT, marginTop:3, lineHeight:1.6 }}>
            {provider.address&&<div>{provider.address}</div>}
            {provider.gstin&&<div>GSTIN: <strong>{provider.gstin}</strong></div>}
            {provider.email&&<div>{provider.email}</div>}
            {provider.phone&&<div>{provider.phone}</div>}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:20, fontWeight:900, color:INK, letterSpacing:"-0.02em", marginBottom:6 }}>SERVICE INVOICE</div>
          <div style={{ fontSize:11, color:INK_SOFT, lineHeight:1.7 }}>
            <div><span style={{ color:INK_MUTED }}>No: </span><strong>{data.invoiceNo||"—"}</strong></div>
            <div><span style={{ color:INK_MUTED }}>Date: </span><strong>{fmtDate(data.date)}</strong></div>
            {data.dueDate&&<div><span style={{ color:INK_MUTED }}>Due: </span><strong>{fmtDate(data.dueDate)}</strong></div>}
          </div>
        </div>
      </div>

      {/* Bill to */}
      <div style={{ background:SURFACE, borderRadius:8, padding:"12px 16px", marginBottom:16, border:`1px solid ${BORDER}` }}>
        <div style={{ fontSize:10, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Bill To</div>
        <div style={{ fontWeight:700, fontSize:13, color:INK }}>{client.name||"Client Name"}</div>
        <div style={{ fontSize:11, color:INK_SOFT, lineHeight:1.7 }}>
          {client.address&&<span>{client.address}<br/></span>}
          {client.gstin&&<span>GSTIN: {client.gstin}<br/></span>}
          {client.email&&<span>{client.email}</span>}
        </div>
      </div>

      {data.serviceDesc&&(
        <div style={{ background:SURFACE_ALT, borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:12, color:INK_SOFT, border:`1px solid ${BORDER}` }}>
          <strong style={{ color:INK }}>Service: </strong>{data.serviceDesc}
        </div>
      )}

      {/* Line items */}
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:16 }}>
        <thead><tr style={{ background:INK, color:"#fff" }}>
          {["#","Description","Unit","Qty","Rate (₹)","Tax %","Amount (₹)"].map(h=>(
            <th key={h} style={{ padding:"8px 10px", fontSize:10, fontWeight:700, textAlign:h==="Description"?"left":"right", whiteSpace:"nowrap" }}>{h}</th>
          ))}
        </tr></thead>
        <tbody>{items.map((item,i)=>{
          const amt=item.qty*item.rate*(1+item.tax/100);
          return (
            <tr key={item.id} style={{ borderBottom:`1px solid ${BORDER}`, background:i%2===0?"#fff":SURFACE }}>
              <td style={{ padding:"9px 10px", textAlign:"right", color:"#94A3B8" }}>{i+1}</td>
              <td style={{ padding:"9px 10px" }}>{item.description||"—"}</td>
              <td style={{ padding:"9px 10px", textAlign:"right" }}><span style={{ background:SURFACE_ALT, color:INK_SOFT, fontSize:10, fontWeight:600, padding:"1px 7px", borderRadius:999 }}>{item.unit}</span></td>
              <td style={{ padding:"9px 10px", textAlign:"right" }}>{item.qty}</td>
              <td style={{ padding:"9px 10px", textAlign:"right" }}>{Number(item.rate).toFixed(2)}</td>
              <td style={{ padding:"9px 10px", textAlign:"right", color:INK_MUTED }}>{item.tax}%</td>
              <td style={{ padding:"9px 10px", textAlign:"right", fontWeight:700, color:INK }}>{amt.toFixed(2)}</td>
            </tr>
          );
        })}</tbody>
      </table>

      {/* Totals */}
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <div style={{ width:240 }}>
          {[["Subtotal",subtotal],["Tax",tax],Number(data.discount)>0?["Discount",-(Number(data.discount)||0)]:null].filter(Boolean).map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${SURFACE_ALT}`, fontSize:12 }}>
              <span style={{ color:INK_MUTED }}>{l}</span>
              <span style={{ color:INK }}>{v<0?`-₹${Math.abs(v).toFixed(2)}`:`₹${v.toFixed(2)}`}</span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 12px", background:INK, color:"#fff", borderRadius:8, marginTop:8, fontSize:14, fontWeight:800 }}>
            <span>Total</span><span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {data.terms&&(
        <div style={{ border:`1px solid ${BORDER}`, borderRadius:8, padding:"12px 14px", fontSize:11, color:INK_SOFT }}>
          <strong style={{ color:INK }}>Terms: </strong>{data.terms}
        </div>
      )}

      {/* Signature */}
      <div style={{ marginTop:24, display:"flex", justifyContent:"flex-end" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ width:150, height:44, borderBottom:"1px solid #CBD5E1", marginBottom:5 }}/>
          <div style={{ fontSize:10, color:INK_MUTED }}>Authorised Signatory</div>
          <div style={{ fontSize:11, fontWeight:700, color:INK, marginTop:2 }}>{provider.name||""}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function ServiceInvoicePage() {
  const [data, setData] = useState(() => ({
    invoiceNo:`SRV-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`,
    date:todayISO(),
    dueDate:daysFromNowISO(15),
    serviceDesc:"Operations consulting and ERP migration support",
    logoUrl:"",
    discount:"5000",
    terms:"Payment due within 15 days of invoice date. Please quote the invoice number with your transfer.",
  }));
  const [provider, setProvider] = useState({
    name:"Nexline Consulting LLP",
    address:"402 Trident Business Park, Sakinaka, Andheri East, Mumbai - 400072",
    gstin:"27AABCN4521R1ZP",
    email:"accounts@nexlineconsulting.in",
    phone:"+91 98200 41185",
  });
  const [client, setClient] = useState({
    name:"Kaveri Retail Pvt Ltd",
    address:"17 MG Road, Indiranagar, Bengaluru, Karnataka - 560038",
    gstin:"29AACCK8842M1Z4",
    email:"finance@kaveriretail.com",
  });
  const [items, setItems] = useState([
    { id:2001, description:"Operations consulting — senior consultant", qty:40, unit:"Hour", rate:2500, tax:18 },
    { id:2002, description:"ERP migration — Phase 1 milestone delivery", qty:1, unit:"Milestone", rate:75000, tax:18 },
    { id:2003, description:"Monthly support retainer", qty:1, unit:"Month", rate:18000, tax:18 },
  ]);
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");

  useSEO({
    title: SEO_TITLE,
    description: SEO_DESCRIPTION,
    canonical: CANONICAL,
    breadcrumbs: BREADCRUMBS,
    schemas: [softwareAppSchema, faqSchema],
  });

  const upd=setter=>(k,v)=>setter(p=>({...p,[k]:v}));
  const updItem=(id,k,v)=>setItems(p=>p.map(i=>i.id===id?{...i,[k]:v}:i));

  const doDownload = async (format = "pdf") => {
    if (downloading) return;
    setDownloading(true);
    setNotice("");

    const bundled = { ...data, provider, client, items };
    const printId = `SRV-${Date.now()}`;
    const logged = await logSaveRequest({ template: "service-invoice", printId, billData: bundled });
    if (!logged.ok) setNotice("Your invoice downloaded fine, but we couldn't record it on our side.");

    await exportSingleDocument({
      Template: ServicePreview,
      data: bundled,
      format,
      fileBase: `service-invoice-${data.invoiceNo || Date.now()}`,
      taintedHint: TAINTED_HINT,
    });
    setDownloading(false);
  };

  return (
    <div style={{ backgroundColor:SURFACE, minHeight:"100vh" }}>
      <style>{`@media(max-width:1023px){.si-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .si-grid{grid-template-columns:1fr!important;}}@media(max-width:768px){.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}@media print{.no-print{display:none!important;}}`}</style>

      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#0c2340 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#7DD3FC" }}><a href="/" style={{ color:"#7DD3FC", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span><a href="/documents" style={{ color:"#7DD3FC", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span><span style={{ color:"#BAE6FD" }}>Service Invoice</span></nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Service Invoice Generator</h1>
          <p style={{ fontSize:14, color:"#7DD3FC", margin:0 }}>Professional service invoices with line items, GST, and payment terms.</p>
        </div>
      </section>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div className="si-grid" style={{ display:"grid", gridTemplateColumns:"1fr 500px", gap:28, alignItems:"start" }}>
          <div>
            <Section title="Invoice Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Invoice No." value={data.invoiceNo} onChange={v=>upd(setData)("invoiceNo",v)} />
                <Field label="Date" value={data.date} onChange={v=>upd(setData)("date",v)} type="date" />
                <Field label="Due Date" value={data.dueDate} onChange={v=>upd(setData)("dueDate",v)} type="date" />
                <Field label="Discount ₹" value={data.discount} onChange={v=>upd(setData)("discount",v)} type="number" />
              </div>
              <Field label="Service Description (optional)" value={data.serviceDesc} onChange={v=>upd(setData)("serviceDesc",v)} placeholder="Annual maintenance contract for AC units" />
              <Field label="Logo URL" value={data.logoUrl} onChange={v=>upd(setData)("logoUrl",v)} placeholder="https://..." />
            </Section>

            <Section title="Service Provider">
              <Field label="Business Name" value={provider.name} onChange={v=>upd(setProvider)("name",v)} placeholder="Your Company LLP" />
              <Field label="Address" value={provider.address} onChange={v=>upd(setProvider)("address",v)} placeholder="Street, City, State - PIN" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="GSTIN" value={provider.gstin} onChange={v=>upd(setProvider)("gstin",v)} placeholder="27ABCDE1234F1Z5" />
                <Field label="Email" value={provider.email} onChange={v=>upd(setProvider)("email",v)} placeholder="billing@company.com" />
                <Field label="Phone" value={provider.phone} onChange={v=>upd(setProvider)("phone",v)} placeholder="+91 98765 43210" />
              </div>
            </Section>

            <Section title="Client">
              <Field label="Client Name" value={client.name} onChange={v=>upd(setClient)("name",v)} placeholder="Client Company Pvt Ltd" />
              <Field label="Address" value={client.address} onChange={v=>upd(setClient)("address",v)} placeholder="Street, City, State - PIN" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="GSTIN" value={client.gstin} onChange={v=>upd(setClient)("gstin",v)} placeholder="29ABCDE1234F1Z5" />
                <Field label="Email" value={client.email} onChange={v=>upd(setClient)("email",v)} placeholder="finance@client.com" />
              </div>
            </Section>

            <Section title="Services">
              {items.map((item,idx)=>(
                <div key={item.id} style={{ background:SURFACE, borderRadius:12, padding:"14px 16px", marginBottom:10, border:`1px solid ${BORDER}`, position:"relative" }}>
                  {items.length>1&&<button onClick={()=>setItems(p=>p.filter(i=>i.id!==item.id))} style={{ position:"absolute", top:10, right:10, background:"#FEF2F2", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:"#DC2626", fontSize:14 }}>×</button>}
                  <Field label={`Service ${idx+1}`} value={item.description} onChange={v=>updItem(item.id,"description",v)} placeholder="Annual maintenance visit" small />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8 }}>
                    <Field label="Unit" value={item.unit} onChange={v=>updItem(item.id,"unit",v)} placeholder="Hour" small />
                    <Field label="Qty" value={item.qty} onChange={v=>updItem(item.id,"qty",Number(v))} type="number" small />
                    <Field label="Rate ₹" value={item.rate} onChange={v=>updItem(item.id,"rate",Number(v))} type="number" small />
                    <Field label="Tax %" value={item.tax} onChange={v=>updItem(item.id,"tax",Number(v))} type="number" small />
                  </div>
                  <div style={{ fontSize:12, color:INK_SOFT, fontWeight:600, marginTop:4 }}>Line total: ₹{(item.qty*item.rate*(1+item.tax/100)).toFixed(2)}</div>
                </div>
              ))}
              <button onClick={()=>setItems(p=>[...p,defaultItem()])} style={{ width:"100%", padding:10, borderRadius:10, border:`1.5px dashed ${BRAND}`, background:"#fff", color:BRAND, fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Service</button>
              <div style={{ background:INK, color:"#fff", borderRadius:10, padding:"12px 16px", marginTop:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:14, fontWeight:700 }}>Total</span>
                <span style={{ fontSize:18, fontWeight:900 }}>₹{(items.reduce((s,i)=>s+i.qty*i.rate*(1+i.tax/100),0)-(Number(data.discount)||0)).toFixed(2)}</span>
              </div>
            </Section>

            <Section title="Terms">
              <textarea value={data.terms} onChange={e=>upd(setData)("terms",e.target.value)} rows={2} style={{ width:"100%", border:`1.5px solid ${BORDER}`, borderRadius:8, padding:"8px 12px", fontSize:13, color:INK, resize:"vertical", boxSizing:"border-box", outline:"none" }}/>
            </Section>
          </div>

          <div className="si-prev" style={{ position:"sticky", top:88 }}>
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
              <ServicePreview data={{ ...data, provider, client, items }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background:"#fff", borderTop:`1px solid ${BORDER}` }}>
        <div className="seo-section" style={{ maxWidth:"80%", margin:"0 auto", width:"80%" }}>
          <DocumentPageSEO
            documentName="Service Invoice"
            documentSlug="service-invoice"
            intro={INTRO}
            whatIs={WHAT_IS}
            whyUse={WHY_USE}
            features={FEATURES}
            howToSteps={HOW_TO_STEPS}
            benefits={BENEFITS}
            formatFields={FORMAT_FIELDS}
            faqs={FAQS}
            relatedDocs={RELATED_DOCS}
          />
        </div>
      </div>
    </div>
  );
}
