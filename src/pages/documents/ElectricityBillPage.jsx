import { useState } from "react";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";
import SaveMenu from "../../components/common/SaveMenu";
import { exportSingleDocument } from "../../utils/documentExport";
import { logSaveRequest } from "../../utils/saveLog";

const TAINTED_HINT = "one of the bill's fields couldn't be captured due to a cross-origin image restriction. Try again, or contact support if this persists.";

// Neutral document palette — a printed utility bill should read like a normal
// business document, not a brand-colour showcase. Brand blue is reserved for
// interactive form chrome (focus rings, buttons) below, never for the bill
// preview itself.
const INK = "#0F172A";
const INK_SOFT = "#475569";
const INK_MUTED = "#64748B";
const BORDER = "#E2E8F0";
const SURFACE = "#F8FAFC";
const SURFACE_ALT = "#F1F5F9";
const BRAND = "#2563EB";

// ─── SEO ─────────────────────────────────────────────────────────────────────
const SEO_TITLE = "Free Electricity Bill Generator Online — Utility Bill PDF (2026)";
const SEO_DESCRIPTION = "Generate an electricity bill online for free. Meter reading, units consumed, energy charges, and tax — auto-calculated. No login. Instant PDF.";
const CANONICAL = "https://www.opstools.ai/documents/electricity-bill";
const softwareAppSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "OpsTools Electricity Bill Generator", operatingSystem: "Web", applicationCategory: "BusinessApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, description: SEO_DESCRIPTION, url: CANONICAL, provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" } };
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "Is this electricity bill generator free?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no login required." } },
  { "@type": "Question", name: "How are units consumed calculated?", acceptedAnswer: { "@type": "Answer", text: "Units consumed are calculated automatically as the difference between the current and previous meter readings — you just enter both readings and the rate per unit." } },
  { "@type": "Question", name: "Can I use this for expense claims?", acceptedAnswer: { "@type": "Answer", text: "Yes, a properly formatted electricity bill with meter readings and charges is what most finance teams need for a utility expense claim." } },
  { "@type": "Question", name: "Does it include fixed charges and fuel adjustment?", acceptedAnswer: { "@type": "Answer", text: "Yes, optional fields are available for fixed charges, fuel adjustment charges, arrears, and tax on top of the energy charge." } },
] };
const INTRO = (<><p style={{ marginBottom: 16 }}>Need an electricity bill for expense claims, record-keeping, or as a reference document — without hunting down a real utility provider's format? OpsTools Electricity Bill Generator lays out a properly formatted utility bill in under a minute: enter your meter readings and rate, and the rest — units consumed, energy charge, tax — calculates automatically.</p><p style={{ marginBottom: 16 }}>Built around how a real electricity bill actually breaks down: previous and current meter readings determine units consumed, which multiplied by your rate per unit gives the energy charge. Optional fixed charges, fuel adjustment, arrears, and tax stack on top for the final total.</p><p>The preview updates live as you type. Download directly as a PDF — your data never leaves your browser.</p></>);
const WHAT_IS = `An electricity bill is a utility document issued by a power distribution company, showing meter readings, units consumed, and the resulting charges. It's commonly used for expense claims, record-keeping, and as address/utility proof.`;
const WHY_USE = [
  { title: "Expense claims", body: "Attach a properly formatted electricity bill when claiming utility expenses for a home office or business premises." },
  { title: "Record-keeping", body: "Keep consistent records of utility charges across billing periods." },
  { title: "Reference documents", body: "Generate a sample bill for templates, mockups, or documentation." },
];
const FEATURES = [
  { icon: "⚡", title: "Auto-calculated units", body: "Units consumed computed automatically from previous and current meter readings." },
  { icon: "🧮", title: "Full charge breakdown", body: "Energy charge, fixed charge, fuel adjustment, arrears, and tax all itemized." },
  { icon: "📊", title: "Consumer details", body: "Consumer ID, meter number, and connection category included." },
  { icon: "👁️", title: "Live preview", body: "See the bill update in real time as you fill the form." },
  { icon: "⬇️", title: "Direct PDF download", body: "One click downloads the bill as a PDF." },
  { icon: "🔒", title: "100% private", body: "No data is stored or transmitted. Everything happens in your browser." },
];
const HOW_TO_STEPS = [
  { step: 1, title: "Enter bill details", body: "Bill number, billing period, and due date." },
  { step: 2, title: "Add meter readings", body: "Previous and current readings — units consumed calculate automatically." },
  { step: 3, title: "Set the rate", body: "Enter the rate per unit and any fixed or fuel adjustment charges." },
  { step: 4, title: "Add consumer details", body: "Name, address, consumer ID, and meter number." },
  { step: 5, title: "Preview", body: "Check the live preview — totals update instantly." },
  { step: 6, title: "Download PDF", body: "Click Save PDF to download the bill." },
];
const BENEFITS = [
  "Units consumed calculated automatically from meter readings.",
  "Full charge breakdown — energy, fixed, fuel adjustment, tax.",
  "No registration or sign-up required.",
  "Direct PDF download — no print dialog.",
  "All data stays in your browser — zero privacy risk.",
  "Completely free — no subscription.",
];
const FORMAT_FIELDS = [
  { field: "Meter Readings", description: "Previous and current readings, used to compute units consumed", example: "1240 → 1385" },
  { field: "Units Consumed", description: "Automatically calculated: current minus previous reading", example: "145 units" },
  { field: "Rate per Unit", description: "Price charged per unit of electricity", example: "₹7.50" },
  { field: "Consumer ID", description: "Unique identifier for the connection", example: "CONS-4471023" },
  { field: "Billing Period", description: "The month or cycle the bill covers", example: "June 2026" },
];
const FAQS = faqSchema.mainEntity.map((i) => ({ q: i.name, a: i.acceptedAnswer.text }));
const RELATED_DOCS = [
  { name: "Rent Receipt Generator", href: "/documents/rent-receipt", description: "HRA-compliant rent receipts." },
  { name: "Hotel Bill Generator", href: "/documents/hotel-bill", description: "Hotel stay receipts for reimbursement." },
  { name: "Fuel Bill Generator", href: "/documents/fuel-bill", description: "Petrol & diesel receipts." },
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

function ElectricityPreview({ data }) {
  const { bill, utility, consumer } = data;
  const unitsConsumed = Math.max(0, (Number(bill.currentReading)||0) - (Number(bill.previousReading)||0));
  const energyCharge = unitsConsumed * (Number(bill.ratePerUnit)||0);
  const fixedCharge = Number(bill.fixedCharge)||0;
  const fuelAdj = Number(bill.fuelAdj)||0;
  const subtotal = energyCharge + fixedCharge + fuelAdj;
  const tax = subtotal * (Number(bill.tax)||5) / 100;
  const arrears = Number(bill.arrears)||0;
  const total = subtotal + tax + arrears;
  const fmtDate = (d) => d ? new Date(d+"T00:00:00").toLocaleDateString("en-IN") : "—";

  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:11, color:"#1a1a1a", padding:"28px 32px" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, paddingBottom:16, borderBottom:`2px solid ${INK}` }}>
        <div>
          <div style={{ fontSize:16, fontWeight:900, color:INK }}>{utility.name||"Electricity Board"}</div>
          <div style={{ fontSize:10, color:INK_SOFT, marginTop:3, maxWidth:280, lineHeight:1.5 }}>{utility.address}</div>
          {utility.gstin&&<div style={{ fontSize:10, color:INK_MUTED, marginTop:3 }}>GSTIN: {utility.gstin}</div>}
        </div>
        <div style={{ textAlign:"right", fontSize:11 }}>
          <div style={{ fontSize:14, fontWeight:900, color:INK, letterSpacing:"0.04em" }}>ELECTRICITY BILL</div>
          <div style={{ marginTop:4 }}><span style={{ color:INK_MUTED }}>Bill No: </span><strong>{bill.billNo||"—"}</strong></div>
          <div style={{ marginTop:2 }}><span style={{ color:INK_MUTED }}>Period: </span><strong>{bill.billingPeriod||"—"}</strong></div>
        </div>
      </div>

      {/* Consumer + billing panels */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Consumer Details</div>
          <div style={{ fontWeight:700, fontSize:12, color:INK }}>{consumer.name||"Consumer Name"}</div>
          <div style={{ fontSize:10, color:INK_SOFT, lineHeight:1.7 }}>
            {consumer.address&&<div>{consumer.address}</div>}
            {consumer.consumerId&&<div>Consumer No: {consumer.consumerId}</div>}
            {consumer.meterNo&&<div>Meter No: {consumer.meterNo}</div>}
          </div>
          {consumer.category&&<span style={{ display:"inline-block", marginTop:6, background:SURFACE_ALT, color:INK_SOFT, fontSize:9, fontWeight:600, padding:"2px 8px", borderRadius:999 }}>{consumer.category}</span>}
        </div>
        <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Billing Period</div>
          <div style={{ fontSize:10, lineHeight:1.8, color:INK }}>
            <div><span style={{ color:INK_MUTED }}>Bill Date: </span>{fmtDate(bill.billDate)}</div>
            <div><span style={{ color:INK_MUTED }}>Due Date: </span>{fmtDate(bill.dueDate)}</div>
            <div><span style={{ color:INK_MUTED }}>Period: </span>{bill.billingPeriod||"—"}</div>
          </div>
        </div>
      </div>

      {/* Meter reading */}
      <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"12px 14px", marginBottom:16 }}>
        <div style={{ fontSize:9, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Meter Reading</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
          <div style={{ textAlign:"center", background:"#fff", border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px" }}>
            <div style={{ fontSize:9, color:INK_MUTED, marginBottom:4 }}>Previous Reading</div>
            <div style={{ fontSize:20, fontWeight:800, color:INK }}>{bill.previousReading||"0"}</div>
            <div style={{ fontSize:9, color:INK_MUTED }}>kWh</div>
          </div>
          <div style={{ textAlign:"center", background:"#fff", border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px" }}>
            <div style={{ fontSize:9, color:INK_MUTED, marginBottom:4 }}>Current Reading</div>
            <div style={{ fontSize:20, fontWeight:800, color:INK }}>{bill.currentReading||"0"}</div>
            <div style={{ fontSize:9, color:INK_MUTED }}>kWh</div>
          </div>
          <div style={{ textAlign:"center", background:INK, borderRadius:8, padding:"10px" }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.75)", marginBottom:4 }}>Units Consumed</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#fff" }}>{unitsConsumed}</div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.75)" }}>kWh</div>
          </div>
        </div>
      </div>

      {/* Charges */}
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:12 }}>
        <thead><tr style={{ background:INK, color:"#fff" }}>
          <th style={{ padding:"7px 10px", fontSize:9, fontWeight:700, textAlign:"left" }}>Charge</th>
          <th style={{ padding:"7px 10px", fontSize:9, fontWeight:700, textAlign:"right" }}>Amount (₹)</th>
        </tr></thead>
        <tbody>
          {[
            [`Energy Charge (${unitsConsumed} units × ₹${bill.ratePerUnit||0}/unit)`, energyCharge],
            ["Fixed / Demand Charge", fixedCharge],
            fuelAdj>0?["Fuel Adjustment Charge", fuelAdj]:null,
            [`Tax @${bill.tax||5}%`, tax],
            arrears!==0?[arrears>0?"Previous Arrears":"Previous Advance", arrears]:null,
          ].filter(Boolean).map(([l,v],i)=>(
            <tr key={l} style={{ borderBottom:`1px solid ${BORDER}`, background:i%2===0?"#fff":SURFACE }}>
              <td style={{ padding:"8px 10px", fontSize:11, color:INK_SOFT }}>{l}</td>
              <td style={{ padding:"8px 10px", fontSize:11, textAlign:"right", fontWeight:600, color:v<0?"#DC2626":INK }}>{v<0?`-₹${Math.abs(v).toFixed(2)}`:`₹${v.toFixed(2)}`}</td>
            </tr>
          ))}
          <tr style={{ background:INK, color:"#fff" }}>
            <td style={{ padding:"10px", fontSize:13, fontWeight:800 }}>Total Amount Due</td>
            <td style={{ padding:"10px", fontSize:13, fontWeight:800, textAlign:"right" }}>₹{total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", border:`1px solid ${BORDER}`, background:SURFACE, borderRadius:8, padding:"10px 12px", marginBottom:10 }}>
        <div style={{ fontSize:9, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em" }}>Pay by {fmtDate(bill.dueDate)}</div>
        <div style={{ fontSize:18, fontWeight:900, color:INK }}>₹{total.toFixed(2)}</div>
      </div>

      {bill.paymentModes&&<div style={{ fontSize:10, color:INK_SOFT, marginBottom:8 }}><strong style={{ color:INK }}>Pay via: </strong>{bill.paymentModes}</div>}
      <div style={{ fontSize:9, color:INK_MUTED, textAlign:"center", borderTop:`1px solid ${BORDER}`, paddingTop:8 }}>For queries: {utility.phone||utility.email||"Contact your electricity board"}</div>
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

export default function ElectricityBillPage() {
  const [bill, setBill] = useState(() => {
    const today = new Date();
    const due = new Date(today.getTime() + 15*24*60*60*1000);
    return {
      billNo:`ELEC-${String(Math.floor(Math.random()*90000)+10000)}`,
      billDate:today.toISOString().split("T")[0],
      dueDate:due.toISOString().split("T")[0],
      billingPeriod:today.toLocaleDateString("en-IN",{ month:"long", year:"numeric" }),
      previousReading:"12480", currentReading:"12725", ratePerUnit:"7.50",
      fixedCharge:"128", fuelAdj:"62.40", tax:"5", arrears:"0",
      paymentModes:"UPI, Net Banking, Debit Card, Cash at Collection Centre",
    };
  });
  const [utility, setUtility] = useState({
    name:"Maharashtra State Electricity Distribution Co. Ltd.",
    address:"Prakashgad, Plot No. G-9, Bandra (East), Mumbai – 400051",
    phone:"1912", email:"helpdesk@mahadiscom.in", gstin:"27AAECM2933K1ZB",
  });
  const [consumer, setConsumer] = useState({
    name:"Rajesh Sharma",
    address:"Flat 402, Sai Residency, Andheri West, Mumbai – 400058",
    consumerId:"CA-180023456", meterNo:"MT-9876543", category:"Domestic",
  });
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");
  const upd=setter=>(k,v)=>setter(p=>({...p,[k]:v}));

  const doDownload = async (format = "pdf") => {
    if (downloading) return;
    setDownloading(true);
    setNotice("");

    const data = { bill, utility, consumer };
    const printId = `ELEC-${Date.now()}`;
    const logged = await logSaveRequest({ template: "electricity-bill", printId, billData: data });
    if (!logged.ok) setNotice("Your bill downloaded fine, but we couldn't record it on our side.");

    await exportSingleDocument({
      Template: ElectricityPreview,
      data,
      format,
      fileBase: `electricity-bill-${bill.billNo || Date.now()}`,
      taintedHint: TAINTED_HINT,
    });
    setDownloading(false);
  };

  useSEO({
    title: SEO_TITLE, description: SEO_DESCRIPTION, canonical: CANONICAL,
    breadcrumbs: [
      { name: "Home", url: "https://www.opstools.ai" },
      { name: "Documents", url: "https://www.opstools.ai/documents" },
      { name: "Electricity Bill Generator", url: CANONICAL },
    ],
    schemas: [softwareAppSchema, faqSchema],
  });

  return (
    <div style={{ backgroundColor:SURFACE, minHeight:"100vh" }}>
      <style>{`@media(max-width:1023px){.eb-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .eb-grid{grid-template-columns:1fr!important;}}@media(max-width:768px){.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#0c2340 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#7DD3FC" }}><a href="/" style={{ color:"#7DD3FC", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span><a href="/documents" style={{ color:"#7DD3FC", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span><span style={{ color:"#BAE6FD" }}>Electricity Bill</span></nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Electricity Bill Generator</h1>
          <p style={{ fontSize:14, color:"#7DD3FC", margin:0 }}>Utility bills with meter readings, energy charges, and tax breakdown.</p>
        </div>
      </section>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div className="eb-grid" style={{ display:"grid", gridTemplateColumns:"1fr 460px", gap:28, alignItems:"start" }}>
          <div>
            <Section title="Utility Board Details">
              <Field label="Board / Company Name" value={utility.name} onChange={v=>upd(setUtility)("name",v)} placeholder="MSEDCL / BESCOM / TNEB" />
              <Field label="Address" value={utility.address} onChange={v=>upd(setUtility)("address",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Phone" value={utility.phone} onChange={v=>upd(setUtility)("phone",v)} />
                <Field label="Email" value={utility.email} onChange={v=>upd(setUtility)("email",v)} />
                <Field label="GSTIN" value={utility.gstin} onChange={v=>upd(setUtility)("gstin",v)} />
              </div>
            </Section>
            <Section title="Consumer Details">
              <Field label="Consumer Name" value={consumer.name} onChange={v=>upd(setConsumer)("name",v)} placeholder="Rajesh Sharma" />
              <Field label="Address" value={consumer.address} onChange={v=>upd(setConsumer)("address",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <Field label="Consumer No." value={consumer.consumerId} onChange={v=>upd(setConsumer)("consumerId",v)} placeholder="CA-12345678" />
                <Field label="Meter No." value={consumer.meterNo} onChange={v=>upd(setConsumer)("meterNo",v)} placeholder="MT-987654" />
                <div>
                  <label style={{ fontSize:11, fontWeight:600, color:INK_MUTED, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Category</label>
                  <select value={consumer.category} onChange={e=>upd(setConsumer)("category",e.target.value)} style={{ width:"100%", height:38, border:`1.5px solid ${BORDER}`, borderRadius:8, padding:"0 10px", fontSize:13, outline:"none", background:"#fff" }}>
                    {["Domestic","Commercial","Industrial","Agricultural"].map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </Section>
            <Section title="Bill Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Bill No." value={bill.billNo} onChange={v=>upd(setBill)("billNo",v)} />
                <Field label="Bill Date" value={bill.billDate} onChange={v=>upd(setBill)("billDate",v)} type="date" />
                <Field label="Due Date" value={bill.dueDate} onChange={v=>upd(setBill)("dueDate",v)} type="date" />
                <Field label="Billing Period" value={bill.billingPeriod} onChange={v=>upd(setBill)("billingPeriod",v)} placeholder="June 2026" />
              </div>
            </Section>
            <Section title="Meter Reading & Charges">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Previous Reading (kWh)" value={bill.previousReading} onChange={v=>upd(setBill)("previousReading",v)} type="number" placeholder="1200" />
                <Field label="Current Reading (kWh)" value={bill.currentReading} onChange={v=>upd(setBill)("currentReading",v)} type="number" placeholder="1450" />
                <Field label="Rate per Unit (₹/kWh)" value={bill.ratePerUnit} onChange={v=>upd(setBill)("ratePerUnit",v)} type="number" placeholder="6.50" />
                <Field label="Fixed Charge (₹)" value={bill.fixedCharge} onChange={v=>upd(setBill)("fixedCharge",v)} type="number" placeholder="50" />
                <Field label="Fuel Adjustment (₹)" value={bill.fuelAdj} onChange={v=>upd(setBill)("fuelAdj",v)} type="number" placeholder="0" />
                <Field label="Tax %" value={bill.tax} onChange={v=>upd(setBill)("tax",v)} type="number" placeholder="5" />
                <Field label="Previous Arrears (₹)" value={bill.arrears} onChange={v=>upd(setBill)("arrears",v)} type="number" placeholder="0" />
                <Field label="Payment Modes" value={bill.paymentModes} onChange={v=>upd(setBill)("paymentModes",v)} placeholder="Cash, UPI, Online" />
              </div>
              <div style={{ background:INK, color:"#fff", borderRadius:10, padding:"12px 16px", marginTop:4, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:14, fontWeight:700 }}>Units Consumed</span>
                <span style={{ fontSize:18, fontWeight:900 }}>{Math.max(0,(Number(bill.currentReading)||0)-(Number(bill.previousReading)||0))} kWh</span>
              </div>
            </Section>
          </div>
          <div className="eb-prev" style={{ position:"sticky", top:88 }}>
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

            <div className="preview-scale-wrap" style={{ transform:"scale(0.78)", transformOrigin:"top left", width:"128%", marginBottom:"-22%" }}>
              <ElectricityPreview data={{ bill, utility, consumer }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderTop: `1px solid ${BORDER}` }}>
        <div className="seo-section" style={{ maxWidth: "80%", margin: "0 auto", width: "80%" }}>
          <DocumentPageSEO documentName="Electricity Bill" documentSlug="electricity-bill" intro={INTRO} whatIs={WHAT_IS} whyUse={WHY_USE} features={FEATURES} howToSteps={HOW_TO_STEPS} benefits={BENEFITS} formatFields={FORMAT_FIELDS} faqs={FAQS} relatedDocs={RELATED_DOCS} />
        </div>
      </div>
    </div>
  );
}
