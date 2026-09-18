import { useState } from "react";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";
import SaveMenu from "../../components/common/SaveMenu";
import { exportSingleDocument } from "../../utils/documentExport";
import { logSaveRequest } from "../../utils/saveLog";

const TAINTED_HINT = "one of the document's fields couldn't be captured due to a cross-origin image restriction. Try again, or contact support if this persists.";

// Neutral document palette — a printed e-way bill should read like a normal
// government/business document, not a brand-colour showcase. Brand blue is
// reserved for interactive form chrome (field focus, buttons) below, never for
// the document preview itself.
const INK = "#0F172A";
const INK_SOFT = "#475569";
const INK_MUTED = "#64748B";
const BORDER = "#E2E8F0";
const SURFACE = "#F8FAFC";
const SURFACE_ALT = "#F1F5F9";
const BRAND = "#2563EB";

// ─── SEO ─────────────────────────────────────────────────────────────────────
const SEO_TITLE = "Free E-Way Bill Generator Online — GST Transport Document (2026)";
const SEO_DESCRIPTION = "Generate a GST e-way bill reference document online for free. Vehicle number, transporter, distance, and consignor/consignee details. No login. Instant PDF.";
const CANONICAL = "https://www.opstools.ai/documents/eway-bill";
const softwareAppSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "OpsTools E-Way Bill Generator", operatingSystem: "Web", applicationCategory: "BusinessApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, description: SEO_DESCRIPTION, url: CANONICAL, provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" } };
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "What is an e-way bill?", acceptedAnswer: { "@type": "Answer", text: "An e-way bill is a document required under GST for the movement of goods worth more than ₹50,000, containing details of the goods, consignor, consignee, and transporter." } },
  { "@type": "Question", name: "Does this generate a legally valid e-way bill?", acceptedAnswer: { "@type": "Answer", text: "This creates a properly formatted reference document with your e-way bill number and details laid out clearly — the actual e-way bill number (EWB No.) itself must be generated on the government's e-way bill portal before goods move." } },
  { "@type": "Question", name: "What details does an e-way bill need?", acceptedAnswer: { "@type": "Answer", text: "Consignor and consignee details, invoice/document reference, goods description with HSN code, transport mode, vehicle number, and distance." } },
  { "@type": "Question", name: "Is this free?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no login required." } },
] };
const INTRO = (<><p style={{ marginBottom: 16 }}>Moving goods worth more than ₹50,000 under GST means having an e-way bill on hand — and once you&apos;ve generated the actual EWB number on the government portal, you still need a clean, properly formatted document to travel with the shipment. OpsTools E-Way Bill Generator handles that layout: consignor, consignee, transport details, and goods description, all in one print-ready document.</p><p style={{ marginBottom: 16 }}>This tool doesn&apos;t generate the e-way bill number itself — that has to come from the official e-way bill portal — but it gives you a clean reference document with everything filled in correctly: vehicle number, transporter name, distance, and both parties&apos; details.</p><p>The preview updates live as you type. Download directly as a PDF or PNG when ready — no data leaves your browser.</p></>);
const WHAT_IS = `An e-way bill (Electronic Way Bill) is a document required under Indian GST law for transporting goods worth more than ₹50,000. It must be generated on the government's e-way bill portal before the goods move, and contains consignor/consignee details, goods description, and transport information.`;
const WHY_USE = [
  { title: "Businesses shipping goods", body: "Prepare a clean, properly formatted e-way bill reference document to travel with the shipment." },
  { title: "Transporters", body: "Keep consistent documentation for every consignment carried." },
  { title: "Accounts & logistics teams", body: "Generate a print-ready copy alongside the invoice for dispatch records." },
];
const FEATURES = [
  { icon: "🚚", title: "Transport details", body: "Mode, vehicle number, transporter name, and distance all included." },
  { icon: "📦", title: "Consignor/consignee fields", body: "Full details for both parties, including state for tax purposes." },
  { icon: "🧾", title: "Linked document reference", body: "Reference the original tax invoice or document number and date." },
  { icon: "👁️", title: "Live preview", body: "See the document update in real time as you fill the form." },
  { icon: "⬇️", title: "PDF or PNG download", body: "One click saves the document as a PDF or a flat image." },
  { icon: "🔒", title: "100% private", body: "No data is stored or transmitted. Everything happens in your browser." },
];
const HOW_TO_STEPS = [
  { step: 1, title: "Enter e-way bill details", body: "EWB number (from the government portal), date, and validity." },
  { step: 2, title: "Add document reference", body: "Link the original tax invoice number and date." },
  { step: 3, title: "Add goods details", body: "Product name, HSN code, quantity, taxable value, and GST." },
  { step: 4, title: "Add transport details", body: "Mode, vehicle number, transporter name, and distance." },
  { step: 5, title: "Add consignor & consignee", body: "Full details for both parties." },
  { step: 6, title: "Save the document", body: "Click Save to download the document as a PDF or PNG." },
];
const BENEFITS = [
  "Clean, properly formatted e-way bill reference document.",
  "Consignor, consignee, and transport details all in one place.",
  "No registration or sign-up required.",
  "Direct PDF or PNG download — no print dialog.",
  "All data stays in your browser — zero privacy risk.",
  "Completely free — no subscription.",
];
const FORMAT_FIELDS = [
  { field: "EWB No.", description: "E-way bill number generated on the government portal", example: "123456789012" },
  { field: "Vehicle No.", description: "Registration number of the transporting vehicle", example: "MH12AB1234" },
  { field: "Transport Mode", description: "How the goods are being moved", example: "Road / Rail / Air / Ship" },
  { field: "Distance (km)", description: "Approximate distance to be covered", example: "245" },
  { field: "HSN Code", description: "Harmonized code for the goods being transported", example: "8471" },
];
const FAQS = faqSchema.mainEntity.map((i) => ({ q: i.name, a: i.acceptedAnswer.text }));
const RELATED_DOCS = [
  { name: "GST Invoice Generator", href: "/documents/gst-invoice", description: "Tax-compliant GST invoices." },
  { name: "E-Invoice Generator", href: "/documents/e-invoice", description: "GST e-invoice with IRN." },
  { name: "Vehicle Expense Report", href: "/documents/vehicle-expense", description: "Vehicle maintenance & fuel expense report." },
];

const DOC_TYPES = ["Tax Invoice", "Bill of Supply", "Delivery Challan", "Credit Note", "Bill of Entry"];
const TRANSPORT_MODES = ["Road", "Rail", "Air", "Ship"];

const todayISO = () => new Date().toISOString().split("T")[0];
const daysFromNowISO = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d.toISOString().split("T")[0]; };
const fmtDate = (iso) => (iso ? new Date(iso + "T00:00:00").toLocaleDateString("en-IN") : "—");
const inr = (v) => Number(v || 0).toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

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

function SelectField({ label, value, onChange, options }) {
  return (
    <div style={{ marginBottom:12 }}>
      <label style={{ fontSize:11, fontWeight:600, color:INK_MUTED, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>
      <select value={value} onChange={e=>onChange(e.target.value)} style={{ width:"100%", height:38, border:`1.5px solid ${BORDER}`, borderRadius:8, padding:"0 10px", fontSize:13, color:INK, outline:"none", background:"#fff", boxSizing:"border-box" }}>
        {options.map(o=><option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

/** One label/value pair inside the preview's meta and transport grids. */
function Cell({ label, value }) {
  return (
    <div>
      <div style={{ fontSize:9, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>{label}</div>
      <div style={{ fontWeight:700, fontSize:11, color:INK }}>{value || "—"}</div>
    </div>
  );
}

function PartyBlock({ title, party }) {
  return (
    <div style={{ border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px" }}>
      <div style={{ fontSize:9, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>{title}</div>
      <div style={{ fontWeight:700, fontSize:12, color:INK }}>{party.name||"—"}</div>
      <div style={{ fontSize:10, color:INK_SOFT, lineHeight:1.7, marginTop:2 }}>
        {party.gstin&&<div>GSTIN: {party.gstin}</div>}
        {party.address&&<div>{party.address}</div>}
        {party.state&&<div>State: {party.state}</div>}
      </div>
    </div>
  );
}

function EWayPreview({ data }) {
  const { bill, consignor, consignee } = data;
  const taxable = Number(bill.taxableValue || 0);
  const cgst = Number(bill.cgst || 0);
  const sgst = Number(bill.sgst || 0);
  const igst = Number(bill.igst || 0);
  const totalTax = cgst + sgst + igst;
  const grandTotal = taxable + totalTax;

  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:11, color:INK, padding:"26px 30px", border:`1px solid ${BORDER}` }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18, paddingBottom:14, borderBottom:`2px solid ${INK}` }}>
        <div>
          <div style={{ fontSize:18, fontWeight:900, color:INK, letterSpacing:"0.02em" }}>E-WAY BILL</div>
          <div style={{ fontSize:10, color:INK_SOFT, marginTop:3 }}>Goods transport reference document — GST</div>
        </div>
        <div style={{ textAlign:"right", fontSize:11 }}>
          <div><span style={{ color:INK_MUTED }}>EWB No: </span><strong>{bill.ewayNo||"—"}</strong></div>
          <div style={{ marginTop:3 }}><span style={{ color:INK_MUTED }}>Valid Until: </span><strong>{fmtDate(bill.validUntil)}</strong></div>
        </div>
      </div>

      {/* Bill / document meta */}
      <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"12px 14px", marginBottom:12, display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
        <Cell label="E-Way Bill No." value={bill.ewayNo} />
        <Cell label="Generated Date" value={fmtDate(bill.date)} />
        <Cell label="Valid Until" value={fmtDate(bill.validUntil)} />
        <Cell label="Document Type" value={bill.docType||"Tax Invoice"} />
        <Cell label="Document No." value={bill.docNo} />
        <Cell label="Document Date" value={fmtDate(bill.docDate)} />
      </div>

      {/* Parties */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        <PartyBlock title="Consignor (From)" party={consignor} />
        <PartyBlock title="Consignee (To)" party={consignee} />
      </div>

      {/* Goods */}
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:12 }}>
        <thead><tr style={{ background:INK, color:"#fff" }}>
          {["Description of Goods","HSN","Qty","Unit","Taxable Value (₹)"].map(h=>(
            <th key={h} style={{ padding:"7px 8px", fontSize:9, fontWeight:700, textAlign:h==="Description of Goods"?"left":"right" }}>{h}</th>
          ))}
        </tr></thead>
        <tbody>
          <tr style={{ borderBottom:`1px solid ${BORDER}` }}>
            <td style={{ padding:"8px", fontSize:11, fontWeight:600, color:INK }}>{bill.productName||"—"}</td>
            <td style={{ padding:"8px", fontSize:10, textAlign:"right", color:INK_SOFT }}>{bill.hsn||"—"}</td>
            <td style={{ padding:"8px", fontSize:10, textAlign:"right", color:INK_SOFT }}>{bill.qty||"—"}</td>
            <td style={{ padding:"8px", fontSize:10, textAlign:"right", color:INK_SOFT }}>{bill.unit||"—"}</td>
            <td style={{ padding:"8px", fontSize:11, textAlign:"right", fontWeight:700, color:INK }}>{inr(taxable)}</td>
          </tr>
        </tbody>
      </table>

      {/* Tax summary */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 240px", gap:12, marginBottom:12 }}>
        <div style={{ border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px", fontSize:10, color:INK_SOFT }}>
          <div style={{ fontSize:9, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Value Declared</div>
          <div>Taxable value of the consignment as per the linked {bill.docType||"Tax Invoice"}{bill.docNo?` (${bill.docNo})`:""}.</div>
        </div>
        <div style={{ border:`1px solid ${BORDER}`, borderRadius:8, overflow:"hidden" }}>
          {[["Taxable Value", taxable],["CGST", cgst],["SGST", sgst],["IGST", igst]].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 12px", fontSize:10, borderBottom:`1px solid ${BORDER}`, background:"#fff" }}>
              <span style={{ color:INK_SOFT }}>{l}</span><span style={{ fontWeight:600, color:INK }}>₹{inr(v)}</span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 12px", background:INK, color:"#fff" }}>
            <span style={{ fontSize:10, fontWeight:700 }}>Total Invoice Value</span>
            <span style={{ fontSize:13, fontWeight:900 }}>₹{inr(grandTotal)}</span>
          </div>
        </div>
      </div>

      {/* Transport */}
      <div style={{ background:SURFACE_ALT, border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px" }}>
        <div style={{ fontSize:9, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Transport Details</div>
        <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10 }}>
          <Cell label="Mode" value={bill.transportMode} />
          <Cell label="Vehicle No." value={bill.vehicleNo} />
          <Cell label="Transporter" value={bill.transporterName} />
          <Cell label="Transporter ID" value={bill.transporterId} />
          <Cell label="Distance (km)" value={bill.distance} />
          <Cell label="Route" value={consignor.state&&consignee.state?`${consignor.state} → ${consignee.state}`:"—"} />
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginTop:18 }}>
        {["Consignor / Authorised Signatory","Transporter Signature"].map(l=>(
          <div key={l} style={{ textAlign:"center" }}>
            <div style={{ height:34, borderBottom:"1px solid #CBD5E1", marginBottom:4 }}/>
            <div style={{ fontSize:9, color:"#94A3B8" }}>{l}</div>
          </div>
        ))}
      </div>

      <div style={{ marginTop:14, fontSize:9, color:INK_MUTED, textAlign:"center", borderTop:`1px solid ${BORDER}`, paddingTop:8 }}>
        This is a reference document. Official E-Way Bills must be generated on the GST Portal (ewaybillgst.gov.in)
      </div>
    </div>
  );
}

export default function EWayBillPage() {
  const [bill, setBill] = useState(() => ({
    ewayNo: String(Math.floor(Math.random() * 9e11) + 1e11),
    date: todayISO(),
    validUntil: daysFromNowISO(3),
    docType: "Tax Invoice",
    docNo: `INV-${new Date().getFullYear()}-0184`,
    docDate: todayISO(),
    productName: "Electronic Components — SMD Capacitors & ICs",
    hsn: "8542",
    qty: "120",
    unit: "Nos",
    taxableValue: "185000",
    cgst: "0",
    sgst: "0",
    igst: "33300",
    transportMode: "Road",
    vehicleNo: "MH12AB1234",
    transporterName: "Shree Ganesh Roadlines",
    transporterId: "27AABCS1429B1ZQ",
    distance: "985",
  }));
  const [consignor, setConsignor] = useState({
    name: "Vertex Electronics Pvt Ltd",
    gstin: "27AACCV1234K1Z5",
    address: "Plot 42, MIDC Industrial Area, Andheri East, Mumbai 400093",
    state: "Maharashtra",
  });
  const [consignee, setConsignee] = useState({
    name: "Nova Systems India LLP",
    gstin: "29AAFCN5678M1ZP",
    address: "No. 18, Electronic City Phase 1, Hosur Road, Bengaluru 560100",
    state: "Karnataka",
  });
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");

  const upd=setter=>(k,v)=>setter(p=>({...p,[k]:v}));

  useSEO({
    title: SEO_TITLE, description: SEO_DESCRIPTION, canonical: CANONICAL,
    breadcrumbs: [
      { name: "Home", url: "https://www.opstools.ai" },
      { name: "Documents", url: "https://www.opstools.ai/documents" },
      { name: "E-Way Bill Generator", url: CANONICAL },
    ],
    schemas: [softwareAppSchema, faqSchema],
  });

  const doDownload = async (format = "pdf") => {
    if (downloading) return;
    setDownloading(true);
    setNotice("");

    const data = { bill, consignor, consignee };
    const printId = `EWB-${Date.now()}`;
    const logged = await logSaveRequest({ template: "eway-bill", printId, billData: data });
    if (!logged.ok) setNotice("Your e-way bill downloaded fine, but we couldn't record it on our side.");

    await exportSingleDocument({
      Template: EWayPreview,
      data,
      format,
      fileBase: `eway-bill-${bill.ewayNo || Date.now()}`,
      taintedHint: TAINTED_HINT,
    });
    setDownloading(false);
  };

  return (
    <div style={{ backgroundColor:SURFACE, minHeight:"100vh" }}>
      <style>{`@media(max-width:1023px){.ew-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .ew-grid{grid-template-columns:1fr!important;}}@media(max-width:768px){.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#0c2340 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#7DD3FC" }}><a href="/" style={{ color:"#7DD3FC", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span><a href="/documents" style={{ color:"#7DD3FC", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span><span style={{ color:"#BAE6FD" }}>E-Way Bill</span></nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>E-Way Bill Generator</h1>
          <p style={{ fontSize:14, color:"#7DD3FC", margin:0 }}>Reference e-way bill document with consignor, consignee, and transport details.</p>
        </div>
      </section>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div style={{ background:"#FFFBEB", border:"1px solid #FDE68A", borderRadius:12, padding:"12px 16px", marginBottom:20, fontSize:13, color:"#92400E" }}>
          ⚠ <strong>Note:</strong> This tool generates a reference document for record-keeping. Official E-Way Bills must be generated on the GST Portal at <strong>ewaybillgst.gov.in</strong>
        </div>

        <div className="ew-grid" style={{ display:"grid", gridTemplateColumns:"1fr 500px", gap:28, alignItems:"start" }}>
          <div>
            <Section title="E-Way Bill Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="E-Way Bill No." value={bill.ewayNo} onChange={v=>upd(setBill)("ewayNo",v)} placeholder="123456789012" />
                <Field label="Generated Date" value={bill.date} onChange={v=>upd(setBill)("date",v)} type="date" />
                <Field label="Valid Until" value={bill.validUntil} onChange={v=>upd(setBill)("validUntil",v)} type="date" />
                <SelectField label="Document Type" value={bill.docType} onChange={v=>upd(setBill)("docType",v)} options={DOC_TYPES} />
                <Field label="Document No." value={bill.docNo} onChange={v=>upd(setBill)("docNo",v)} placeholder="INV-2026-001" />
                <Field label="Document Date" value={bill.docDate} onChange={v=>upd(setBill)("docDate",v)} type="date" />
              </div>
            </Section>

            <Section title="Consignor (From)">
              <Field label="Name / Business" value={consignor.name} onChange={v=>upd(setConsignor)("name",v)} placeholder="Vertex Electronics Pvt Ltd" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="GSTIN" value={consignor.gstin} onChange={v=>upd(setConsignor)("gstin",v)} placeholder="27AACCV1234K1Z5" />
                <Field label="State" value={consignor.state} onChange={v=>upd(setConsignor)("state",v)} placeholder="Maharashtra" />
              </div>
              <Field label="Address" value={consignor.address} onChange={v=>upd(setConsignor)("address",v)} placeholder="Street, area, city, PIN" />
            </Section>

            <Section title="Consignee (To)">
              <Field label="Name / Business" value={consignee.name} onChange={v=>upd(setConsignee)("name",v)} placeholder="Nova Systems India LLP" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="GSTIN" value={consignee.gstin} onChange={v=>upd(setConsignee)("gstin",v)} placeholder="29AAFCN5678M1ZP" />
                <Field label="State" value={consignee.state} onChange={v=>upd(setConsignee)("state",v)} placeholder="Karnataka" />
              </div>
              <Field label="Address" value={consignee.address} onChange={v=>upd(setConsignee)("address",v)} placeholder="Street, area, city, PIN" />
            </Section>

            <Section title="Goods Details">
              <Field label="Product Name" value={bill.productName} onChange={v=>upd(setBill)("productName",v)} placeholder="Electronic Components" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <Field label="HSN Code" value={bill.hsn} onChange={v=>upd(setBill)("hsn",v)} placeholder="8542" />
                <Field label="Quantity" value={bill.qty} onChange={v=>upd(setBill)("qty",v)} placeholder="120" />
                <Field label="Unit" value={bill.unit} onChange={v=>upd(setBill)("unit",v)} placeholder="Nos" />
                <Field label="Taxable Value ₹" value={bill.taxableValue} onChange={v=>upd(setBill)("taxableValue",v)} type="number" />
                <Field label="CGST ₹" value={bill.cgst} onChange={v=>upd(setBill)("cgst",v)} type="number" />
                <Field label="SGST ₹" value={bill.sgst} onChange={v=>upd(setBill)("sgst",v)} type="number" />
                <Field label="IGST ₹" value={bill.igst} onChange={v=>upd(setBill)("igst",v)} type="number" />
              </div>
              <div style={{ background:INK, color:"#fff", borderRadius:10, padding:"12px 16px", marginTop:4, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:14, fontWeight:700 }}>Total Invoice Value</span>
                <span style={{ fontSize:18, fontWeight:900 }}>₹{inr(Number(bill.taxableValue||0)+Number(bill.cgst||0)+Number(bill.sgst||0)+Number(bill.igst||0))}</span>
              </div>
            </Section>

            <Section title="Transport Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <SelectField label="Mode" value={bill.transportMode} onChange={v=>upd(setBill)("transportMode",v)} options={TRANSPORT_MODES} />
                <Field label="Vehicle No." value={bill.vehicleNo} onChange={v=>upd(setBill)("vehicleNo",v)} placeholder="MH12AB1234" />
                <Field label="Transporter Name" value={bill.transporterName} onChange={v=>upd(setBill)("transporterName",v)} placeholder="Shree Ganesh Roadlines" />
                <Field label="Transporter ID" value={bill.transporterId} onChange={v=>upd(setBill)("transporterId",v)} placeholder="27AABCS1429B1ZQ" />
                <Field label="Distance (km)" value={bill.distance} onChange={v=>upd(setBill)("distance",v)} type="number" />
              </div>
            </Section>
          </div>

          <div className="ew-prev" style={{ position:"sticky", top:88 }}>
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

            <div className="preview-scale-wrap" style={{ transform:"scale(0.72)", transformOrigin:"top left", width:"139%", marginBottom:"-28%" }}>
              <EWayPreview data={{ bill, consignor, consignee }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background:"#fff", borderTop:`1px solid ${BORDER}` }}>
        <div className="seo-section" style={{ maxWidth:"80%", margin:"0 auto", width:"80%" }}>
          <DocumentPageSEO documentName="E-Way Bill" documentSlug="eway-bill" intro={INTRO} whatIs={WHAT_IS} whyUse={WHY_USE} features={FEATURES} howToSteps={HOW_TO_STEPS} benefits={BENEFITS} formatFields={FORMAT_FIELDS} faqs={FAQS} relatedDocs={RELATED_DOCS} />
        </div>
      </div>
    </div>
  );
}
