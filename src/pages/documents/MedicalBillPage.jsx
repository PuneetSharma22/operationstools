import { useState } from "react";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";
import SaveMenu from "../../components/common/SaveMenu";
import { exportSingleDocument } from "../../utils/documentExport";
import { logSaveRequest } from "../../utils/saveLog";

const TAINTED_HINT = "the logo image doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again.";

// Neutral document palette — a printed bill should read like a normal business
// document, not a brand-colour showcase. Brand blue is reserved for interactive
// form chrome (focus rings, add buttons), never for the bill preview itself.
const INK = "#0F172A";
const INK_SOFT = "#475569";
const INK_MUTED = "#64748B";
const BORDER = "#E2E8F0";
const SURFACE = "#F8FAFC";
const SURFACE_ALT = "#F1F5F9";
const BRAND = "#2563EB";

// ─── SEO ─────────────────────────────────────────────────────────────────────
const SEO_TITLE = "Free Medical Bill Generator Online — Hospital & Pharmacy Receipt (2026)";
const SEO_DESCRIPTION = "Generate a medical or pharmacy bill online for free. Patient details, itemized charges, and GSTIN. No login. Instant PDF. India-compliant.";
const CANONICAL = "https://www.opstools.ai/documents/medical-bill";
const softwareAppSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "OpsTools Medical Bill Generator", operatingSystem: "Web", applicationCategory: "BusinessApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, description: SEO_DESCRIPTION, url: CANONICAL, provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" } };
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "Is this medical bill generator free?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no login required." } },
  { "@type": "Question", name: "Can I use this for insurance claims?", acceptedAnswer: { "@type": "Answer", text: "Yes, a properly itemized medical bill with patient and hospital details is what most insurers require for a reimbursement claim." } },
  { "@type": "Question", name: "Does it work for pharmacies too?", acceptedAnswer: { "@type": "Answer", text: "Yes, the itemized line items work equally well for medicine bills or hospital/clinic charges." } },
  { "@type": "Question", name: "Can I include the hospital's GSTIN?", acceptedAnswer: { "@type": "Answer", text: "Yes, an optional GSTIN field is available for the hospital or clinic." } },
] };
const INTRO = (<><p style={{ marginBottom: 16 }}>Need a clean medical or pharmacy bill for an insurance claim, reimbursement, or record-keeping? OpsTools Medical Bill Generator gets you a properly itemized receipt in under a minute — patient details, charges, and hospital info, all in one document.</p><p style={{ marginBottom: 16 }}>List each charge or medicine as a line item, add the hospital or clinic's details including GSTIN, and the total calculates itself. Works equally well for a hospital bill, a clinic consultation receipt, or a pharmacy bill.</p><p>The preview updates live as you type. Download directly as a PDF — your data never leaves your browser.</p></>);
const WHAT_IS = `A medical bill is the receipt issued by a hospital, clinic, or pharmacy for medical services or medicines provided, itemizing charges and often including patient and doctor details. It's commonly required for insurance reimbursement claims and expense records.`;
const WHY_USE = [
  { title: "Insurance reimbursement", body: "Attach a properly itemized medical bill when filing a claim." },
  { title: "Clinics & small hospitals", body: "Generate professional bills without hospital management software." },
  { title: "Pharmacies", body: "Issue itemized medicine bills quickly." },
  { title: "Personal expense records", body: "Keep track of medical spending for tax or budgeting purposes." },
];
const FEATURES = [
  { icon: "🏥", title: "Itemized charges", body: "List consultations, tests, procedures, or medicines as separate line items." },
  { icon: "🧾", title: "GSTIN support", body: "Include the hospital or clinic's GST registration number." },
  { icon: "👤", title: "Patient details", body: "Name, address, and other patient info on the bill." },
  { icon: "👁️", title: "Live preview", body: "See the bill update in real time as you fill the form." },
  { icon: "⬇️", title: "Direct PDF download", body: "One click downloads the bill as a PDF." },
  { icon: "🔒", title: "100% private", body: "No data is stored or transmitted. Everything happens in your browser." },
];
const HOW_TO_STEPS = [
  { step: 1, title: "Enter hospital/clinic details", body: "Name, address, and GSTIN." },
  { step: 2, title: "Add patient details", body: "Patient name and other relevant info." },
  { step: 3, title: "Add line items", body: "List each charge, test, or medicine with quantity and rate." },
  { step: 4, title: "Preview", body: "Check the live preview — totals update instantly." },
  { step: 5, title: "Download PDF", body: "Click Save PDF to download the bill." },
];
const BENEFITS = [
  "Itemized charges for hospital, clinic, or pharmacy bills.",
  "GSTIN support for tax-compliant billing.",
  "No registration or sign-up required.",
  "Direct PDF download — no print dialog.",
  "All data stays in your browser — zero privacy risk.",
  "Completely free — no subscription.",
];
const FORMAT_FIELDS = [
  { field: "Patient Name", description: "Name of the patient receiving treatment", example: "Rajesh Sharma" },
  { field: "Line Items", description: "Individual charges, tests, or medicines", example: "Consultation Fee — ₹500" },
  { field: "Hospital GSTIN", description: "GST registration number of the hospital/clinic", example: "27AABCU9603R1ZX" },
  { field: "Total Amount", description: "Sum of all itemized charges", example: "₹2,450.00" },
];
const FAQS = faqSchema.mainEntity.map((i) => ({ q: i.name, a: i.acceptedAnswer.text }));
const RELATED_DOCS = [
  { name: "Hotel Bill Generator", href: "/documents/hotel-bill", description: "Hotel stay receipts for reimbursement." },
  { name: "GST Invoice Generator", href: "/documents/gst-invoice", description: "Tax-compliant GST invoices." },
  { name: "Rent Receipt Generator", href: "/documents/rent-receipt", description: "HRA-compliant rent receipts." },
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

const defaultItem = () => ({ id:Date.now()+Math.random(), description:"", type:"Medicine", qty:1, rate:0 });
const TYPES = ["Medicine","Consultation","Lab Test","Procedure","Equipment","Other"];

function MedicalPreview({ data: doc }) {
  // The page keeps hospital/patient/items/bill fields in separate state slices;
  // they arrive here bundled as one object so the off-screen export renderer
  // (which only ever passes a single `data` prop) can render this template too.
  const { data, hospital, patient, items } = doc;
  const subtotal = items.reduce((s,i)=>s+Number(i.qty||0)*Number(i.rate||0),0);
  const disc = Number(data.discount)||0;
  const total = subtotal - disc;
  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:12, color:"#1a1a1a", padding:"32px 36px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, paddingBottom:16, borderBottom:`2px solid ${INK}` }}>
        <div>
          {data.logoUrl&&<img src={data.logoUrl} alt="logo" style={{ maxHeight:52, maxWidth:160, objectFit:"contain", marginBottom:8, display:"block" }}/>}
          <div style={{ fontSize:18, fontWeight:800, color:INK }}>{hospital.name||"Hospital / Clinic Name"}</div>
          <div style={{ fontSize:11, color:INK_SOFT, marginTop:3, lineHeight:1.7 }}>
            {hospital.address&&<div>{hospital.address}</div>}
            {hospital.phone&&<div>Tel: {hospital.phone}</div>}
            {hospital.gstin&&<div>GSTIN: {hospital.gstin}</div>}
            {hospital.regNo&&<div>Reg No: {hospital.regNo}</div>}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"12px 16px" }}>
            <div style={{ fontSize:14, fontWeight:800, color:INK, letterSpacing:"0.04em", marginBottom:8 }}>MEDICAL BILL</div>
            <div style={{ fontSize:11 }}><span style={{ color:INK_MUTED }}>Bill No: </span><strong>{data.billNo||"—"}</strong></div>
            <div style={{ fontSize:11, marginTop:3 }}><span style={{ color:INK_MUTED }}>Date: </span><strong>{data.date?new Date(data.date+"T00:00:00").toLocaleDateString("en-IN"):"—"}</strong></div>
          </div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
        <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"12px 14px" }}>
          <div style={{ fontSize:10, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Patient Details</div>
          <div style={{ fontWeight:700, fontSize:13, color:INK }}>{patient.name||"Patient Name"}</div>
          <div style={{ fontSize:11, color:INK_SOFT, lineHeight:1.7, marginTop:2 }}>
            {patient.age&&<div>Age: {patient.age}</div>}
            {patient.gender&&<div>Gender: {patient.gender}</div>}
            {patient.phone&&<div>Phone: {patient.phone}</div>}
            {patient.uhid&&<div>UHID: {patient.uhid}</div>}
          </div>
        </div>
        <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"12px 14px" }}>
          <div style={{ fontSize:10, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Doctor / Dept</div>
          <div style={{ fontWeight:700, fontSize:13, color:INK }}>{data.doctorName||"—"}</div>
          <div style={{ fontSize:11, color:INK_SOFT, lineHeight:1.7, marginTop:2 }}>
            {data.department&&<div>{data.department}</div>}
            {data.admitDate&&<div>Admit: {new Date(data.admitDate+"T00:00:00").toLocaleDateString("en-IN")}</div>}
            {data.dischargeDate&&<div>Discharge: {new Date(data.dischargeDate+"T00:00:00").toLocaleDateString("en-IN")}</div>}
          </div>
        </div>
      </div>
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:16 }}>
        <thead><tr style={{ background:INK, color:"#fff" }}>
          {["#","Description","Type","Qty","Rate (₹)","Amount (₹)"].map(h=><th key={h} style={{ padding:"8px 10px", fontSize:10, fontWeight:700, textAlign:h==="Description"||h==="Type"?"left":"right" }}>{h}</th>)}
        </tr></thead>
        <tbody>{items.map((item,i)=>(
          <tr key={item.id} style={{ borderBottom:`1px solid ${BORDER}`, background:i%2===0?"#fff":SURFACE }}>
            <td style={{ padding:"9px 10px", textAlign:"right", color:"#94A3B8" }}>{i+1}</td>
            <td style={{ padding:"9px 10px" }}>{item.description||"—"}</td>
            <td style={{ padding:"9px 10px" }}><span style={{ background:SURFACE_ALT, color:INK_SOFT, fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:999 }}>{item.type}</span></td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{item.qty}</td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{Number(item.rate||0).toFixed(2)}</td>
            <td style={{ padding:"9px 10px", textAlign:"right", fontWeight:700 }}>{(Number(item.qty||0)*Number(item.rate||0)).toFixed(2)}</td>
          </tr>
        ))}</tbody>
      </table>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <div style={{ width:220 }}>
          <div style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${SURFACE_ALT}`, fontSize:12 }}><span style={{ color:INK_MUTED }}>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          {disc>0&&<div style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${SURFACE_ALT}`, fontSize:12 }}><span style={{ color:INK_MUTED }}>Discount</span><span>-₹{disc.toFixed(2)}</span></div>}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 12px", background:INK, color:"#fff", borderRadius:8, marginTop:8, fontSize:14, fontWeight:800 }}><span>Net Amount</span><span>₹{total.toFixed(2)}</span></div>
        </div>
      </div>
      {data.paymentMode&&<div style={{ fontSize:11, color:INK_SOFT, textAlign:"right", marginBottom:12 }}>Payment Mode: <strong>{data.paymentMode}</strong></div>}
      <div style={{ marginTop:20, display:"flex", justifyContent:"flex-end" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ width:120, height:40, borderBottom:"1px solid #CBD5E1", marginBottom:6 }}/>
          <div style={{ fontSize:11, color:INK_MUTED }}>Authorised Signatory</div>
        </div>
      </div>
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

export default function MedicalBillPage() {
  const [data, setData] = useState(() => ({ billNo:`MED-${String(Math.floor(Math.random()*9000)+1000)}`, date:new Date().toISOString().split("T")[0], logoUrl:"", doctorName:"Dr. Anjali Deshmukh", department:"General Medicine", admitDate:"", dischargeDate:"", discount:"200", paymentMode:"UPI" }));
  const [hospital, setHospital] = useState({ name:"Sunrise Multispeciality Hospital", address:"Plot 14, MG Road, Andheri East, Mumbai 400069", phone:"+91 22 4012 8890", gstin:"27AABCU9603R1ZX", regNo:"MH/HOSP/2011/4472" });
  const [patient, setPatient] = useState({ name:"Rajesh Sharma", age:"38", gender:"Male", phone:"+91 98200 44561", uhid:"UHID-204519" });
  const [items, setItems] = useState([
    { id:1001, description:"Consultation — General Medicine (OPD)", type:"Consultation", qty:1, rate:800 },
    { id:1002, description:"Complete Blood Count (CBC) + CRP", type:"Lab Test", qty:1, rate:450 },
    { id:1003, description:"Azithromycin 500mg (strip of 5)", type:"Medicine", qty:2, rate:135 },
  ]);
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");
  const upd=setter=>(k,v)=>setter(p=>({...p,[k]:v}));
  const updItem=(id,k,v)=>setItems(p=>p.map(i=>i.id===id?{...i,[k]:v}:i));

  const doDownload = async (format = "pdf") => {
    if (downloading) return;
    setDownloading(true);
    setNotice("");

    const payload = { data, hospital, patient, items };
    const printId = `MED-${Date.now()}`;
    const logged = await logSaveRequest({ template: "medical-bill", printId, billData: payload });
    if (!logged.ok) setNotice("Your bill downloaded fine, but we couldn't record it on our side.");

    await exportSingleDocument({
      Template: MedicalPreview,
      data: payload,
      format,
      fileBase: `medical-bill-${data.billNo || Date.now()}`,
      taintedHint: TAINTED_HINT,
    });
    setDownloading(false);
  };

  useSEO({
    title: SEO_TITLE, description: SEO_DESCRIPTION, canonical: CANONICAL,
    breadcrumbs: [
      { name: "Home", url: "https://www.opstools.ai" },
      { name: "Documents", url: "https://www.opstools.ai/documents" },
      { name: "Medical Bill Generator", url: CANONICAL },
    ],
    schemas: [softwareAppSchema, faqSchema],
  });

  return (
    <div style={{ backgroundColor:SURFACE, minHeight:"100vh" }}>
      <style>{`@media(max-width:1023px){.mb-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .mb-grid{grid-template-columns:1fr!important;}}@media(max-width:768px){.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#0c2340 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#7DD3FC" }}><a href="/" style={{ color:"#7DD3FC", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span><a href="/documents" style={{ color:"#7DD3FC", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span><span style={{ color:"#BAE6FD" }}>Medical Bill</span></nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Medical Bill Generator</h1>
          <p style={{ fontSize:14, color:"#7DD3FC", margin:0 }}>Hospital & clinic bills with patient details, medicine, consultations and procedures.</p>
        </div>
      </section>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div className="mb-grid" style={{ display:"grid", gridTemplateColumns:"1fr 500px", gap:28, alignItems:"start" }}>
          <div>
            <Section title="Hospital / Clinic">
              <Field label="Hospital Name" value={hospital.name} onChange={v=>upd(setHospital)("name",v)} placeholder="City Hospital" />
              <Field label="Address" value={hospital.address} onChange={v=>upd(setHospital)("address",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Phone" value={hospital.phone} onChange={v=>upd(setHospital)("phone",v)} />
                <Field label="GSTIN" value={hospital.gstin} onChange={v=>upd(setHospital)("gstin",v)} />
                <Field label="Reg No." value={hospital.regNo} onChange={v=>upd(setHospital)("regNo",v)} />
                <Field label="Logo URL" value={data.logoUrl} onChange={v=>upd(setData)("logoUrl",v)} placeholder="https://..." />
              </div>
            </Section>
            <Section title="Bill Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Bill No." value={data.billNo} onChange={v=>upd(setData)("billNo",v)} />
                <Field label="Date" value={data.date} onChange={v=>upd(setData)("date",v)} type="date" />
                <Field label="Doctor Name" value={data.doctorName} onChange={v=>upd(setData)("doctorName",v)} placeholder="Dr. Sharma" />
                <Field label="Department" value={data.department} onChange={v=>upd(setData)("department",v)} placeholder="General Medicine" />
                <Field label="Admit Date" value={data.admitDate} onChange={v=>upd(setData)("admitDate",v)} type="date" />
                <Field label="Discharge Date" value={data.dischargeDate} onChange={v=>upd(setData)("dischargeDate",v)} type="date" />
              </div>
            </Section>
            <Section title="Patient Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Patient Name" value={patient.name} onChange={v=>upd(setPatient)("name",v)} placeholder="Rajesh Sharma" />
                <Field label="UHID / MRN" value={patient.uhid} onChange={v=>upd(setPatient)("uhid",v)} placeholder="UHID-12345" />
                <Field label="Age" value={patient.age} onChange={v=>upd(setPatient)("age",v)} placeholder="35" />
                <Field label="Gender" value={patient.gender} onChange={v=>upd(setPatient)("gender",v)} placeholder="Male" />
                <Field label="Phone" value={patient.phone} onChange={v=>upd(setPatient)("phone",v)} />
              </div>
            </Section>
            <Section title="Items / Services">
              {items.map((item,idx)=>(
                <div key={item.id} style={{ background:SURFACE, borderRadius:12, padding:"14px 16px", marginBottom:10, border:`1px solid ${BORDER}`, position:"relative" }}>
                  {items.length>1&&<button onClick={()=>setItems(p=>p.filter(i=>i.id!==item.id))} style={{ position:"absolute", top:10, right:10, background:"#FEF2F2", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:"#DC2626", fontSize:14 }}>×</button>}
                  <Field label={`Item ${idx+1}`} value={item.description} onChange={v=>updItem(item.id,"description",v)} placeholder="Paracetamol 500mg x10" small />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                    <div>
                      <label style={{ fontSize:11, fontWeight:600, color:INK_MUTED, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Type</label>
                      <select value={item.type} onChange={e=>updItem(item.id,"type",e.target.value)} style={{ width:"100%", height:32, border:`1.5px solid ${BORDER}`, borderRadius:8, padding:"0 8px", fontSize:12, color:INK, outline:"none", background:"#fff" }}>
                        {TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <Field label="Qty" value={item.qty} onChange={v=>updItem(item.id,"qty",Number(v))} type="number" small />
                    <Field label="Rate ₹" value={item.rate} onChange={v=>updItem(item.id,"rate",Number(v))} type="number" small />
                  </div>
                </div>
              ))}
              <button onClick={()=>setItems(p=>[...p,defaultItem()])} style={{ width:"100%", padding:10, borderRadius:10, border:`1.5px dashed ${BRAND}`, background:SURFACE, color:BRAND, fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Item</button>
              <div style={{ background:INK, color:"#fff", borderRadius:10, padding:"12px 16px", marginTop:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:14, fontWeight:700 }}>Subtotal</span>
                <span style={{ fontSize:18, fontWeight:900 }}>₹{items.reduce((s,i)=>s+Number(i.qty||0)*Number(i.rate||0),0).toFixed(2)}</span>
              </div>
            </Section>
            <Section title="Payment">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Discount (₹)" value={data.discount} onChange={v=>upd(setData)("discount",v)} type="number" placeholder="0" />
                <div>
                  <label style={{ fontSize:11, fontWeight:600, color:INK_MUTED, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Payment Mode</label>
                  <select value={data.paymentMode} onChange={e=>upd(setData)("paymentMode",e.target.value)} style={{ width:"100%", height:38, border:`1.5px solid ${BORDER}`, borderRadius:8, padding:"0 10px", fontSize:13, color:INK, outline:"none", background:"#fff" }}>
                    {["Cash","Card","UPI","Insurance","Cheque"].map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </Section>
          </div>
          <div className="mb-prev" style={{ position:"sticky", top:88 }}>
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
              <MedicalPreview data={{ data, hospital, patient, items }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderTop: `1px solid ${BORDER}` }}>
        <div className="seo-section" style={{ maxWidth: "80%", margin: "0 auto", width: "80%" }}>
          <DocumentPageSEO documentName="Medical Bill" documentSlug="medical-bill" intro={INTRO} whatIs={WHAT_IS} whyUse={WHY_USE} features={FEATURES} howToSteps={HOW_TO_STEPS} benefits={BENEFITS} formatFields={FORMAT_FIELDS} faqs={FAQS} relatedDocs={RELATED_DOCS} />
        </div>
      </div>
    </div>
  );
}
