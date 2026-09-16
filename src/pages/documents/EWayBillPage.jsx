import { Helmet } from 'react-helmet-async';
import { useState, useRef } from "react";
import { supabase } from "../../supabase";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";

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
const INTRO = (<><p style={{ marginBottom: 16 }}>Moving goods worth more than ₹50,000 under GST means having an e-way bill on hand — and once you've generated the actual EWB number on the government portal, you still need a clean, properly formatted document to travel with the shipment. OpsTools E-Way Bill Generator handles that layout: consignor, consignee, transport details, and goods description, all in one print-ready document.</p><p style={{ marginBottom: 16 }}>This tool doesn't generate the e-way bill number itself — that has to come from the official e-way bill portal — but it gives you a clean reference document with everything filled in correctly: vehicle number, transporter name, distance, and both parties' details.</p><p>The preview updates live as you type. Download directly as a PDF when ready — no data leaves your browser.</p></>);
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
  { icon: "⬇️", title: "Direct PDF download", body: "One click downloads the document as a PDF." },
  { icon: "🔒", title: "100% private", body: "No data is stored or transmitted. Everything happens in your browser." },
];
const HOW_TO_STEPS = [
  { step: 1, title: "Enter e-way bill details", body: "EWB number (from the government portal), date, and validity." },
  { step: 2, title: "Add document reference", body: "Link the original tax invoice number and date." },
  { step: 3, title: "Add goods details", body: "Product name, HSN code, quantity, and value." },
  { step: 4, title: "Add transport details", body: "Mode, vehicle number, transporter name, and distance." },
  { step: 5, title: "Add consignor & consignee", body: "Full details for both parties." },
  { step: 6, title: "Download PDF", body: "Click Save PDF to download the document." },
];
const BENEFITS = [
  "Clean, properly formatted e-way bill reference document.",
  "Consignor, consignee, and transport details all in one place.",
  "No registration or sign-up required.",
  "Direct PDF download — no print dialog.",
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

function Field({ label, value, onChange, placeholder, type="text", small }) {
  return (
    <div style={{ marginBottom:small?8:12 }}>
      {label&&<label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder} onChange={e=>onChange&&onChange(e.target.value)}
        style={{ width:"100%", height:small?32:38, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 10px", fontSize:13, color:"#0F172A", outline:"none", boxSizing:"border-box", background:"#fff" }}
        onFocus={e=>e.target.style.borderColor="#DC2626"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
    </div>
  );
}

function EWayPreview({ data, consignor, consignee }) {
  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:11, color:"#1a1a1a", padding:"24px 28px", border:"2px solid #DC2626" }}>
      <div style={{ textAlign:"center", marginBottom:16, borderBottom:"2px solid #DC2626", paddingBottom:12 }}>
        <div style={{ fontSize:16, fontWeight:900, color:"#DC2626" }}>E-WAY BILL</div>
        <div style={{ fontSize:10, color:"#475569", marginTop:2 }}>Generated Reference Document</div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:12 }}>
        {[["E-Way Bill No.",data.ewayNo||"—"],["Generated Date",data.date?new Date(data.date+"T00:00:00").toLocaleDateString("en-IN"):"—"],["Valid Until",data.validUntil?new Date(data.validUntil+"T00:00:00").toLocaleDateString("en-IN"):"—"],["Document Type",data.docType||"Tax Invoice"],["Document No.",data.docNo||"—"],["Document Date",data.docDate?new Date(data.docDate+"T00:00:00").toLocaleDateString("en-IN"):"—"]].map(([l,v])=>(
          <div key={l} style={{ background:"#FEF2F2", padding:"8px 10px", borderRadius:6 }}>
            <div style={{ fontSize:9, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.06em", marginBottom:3 }}>{l}</div>
            <div style={{ fontWeight:700, fontSize:12 }}>{v}</div>
          </div>
        ))}
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        <div style={{ border:"1.5px solid #FCA5A5", borderRadius:8, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:"#DC2626", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Consignor (From)</div>
          <div style={{ fontWeight:700, fontSize:12 }}>{consignor.name||"—"}</div>
          <div style={{ fontSize:10, color:"#475569", lineHeight:1.7, marginTop:2 }}>
            {consignor.gstin&&<div>GSTIN: {consignor.gstin}</div>}
            {consignor.address&&<div>{consignor.address}</div>}
            {consignor.state&&<div>State: {consignor.state}</div>}
          </div>
        </div>
        <div style={{ border:"1.5px solid #FCA5A5", borderRadius:8, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:"#DC2626", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Consignee (To)</div>
          <div style={{ fontWeight:700, fontSize:12 }}>{consignee.name||"—"}</div>
          <div style={{ fontSize:10, color:"#475569", lineHeight:1.7, marginTop:2 }}>
            {consignee.gstin&&<div>GSTIN: {consignee.gstin}</div>}
            {consignee.address&&<div>{consignee.address}</div>}
            {consignee.state&&<div>State: {consignee.state}</div>}
          </div>
        </div>
      </div>
      <div style={{ background:"#FEF2F2", borderRadius:8, padding:"10px 12px", marginBottom:12 }}>
        <div style={{ fontSize:9, fontWeight:700, color:"#DC2626", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Goods Details</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
          {[["Product","productName"],["HSN Code","hsn"],["Quantity","qty"],["Unit","unit"],["Value (₹)","value"],["Taxable Value (₹)","taxableValue"]].map(([l,k])=>(
            <div key={k}>
              <div style={{ fontSize:9, color:"#64748B", marginBottom:2 }}>{l}</div>
              <div style={{ fontWeight:600, fontSize:11 }}>{data[k]||"—"}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ background:"#FEF2F2", borderRadius:8, padding:"10px 12px" }}>
        <div style={{ fontSize:9, fontWeight:700, color:"#DC2626", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Transport Details</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
          {[["Mode",data.transportMode||"—"],["Vehicle No.",data.vehicleNo||"—"],["Transporter",data.transporterName||"—"],["Distance (km)",data.distance||"—"],["From State",consignor.state||"—"],["To State",consignee.state||"—"]].map(([l,v])=>(
            <div key={l}>
              <div style={{ fontSize:9, color:"#64748B", marginBottom:2 }}>{l}</div>
              <div style={{ fontWeight:600, fontSize:11 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ marginTop:12, fontSize:9, color:"#94A3B8", textAlign:"center", borderTop:"1px solid #FEE2E2", paddingTop:8 }}>
        This is a reference document. Official E-Way Bills must be generated on the GST Portal (ewaybillgst.gov.in)
      </div>
    </div>
  );
}

export default function EWayBillPage() {
  const [data, setData] = useState({ ewayNo:"", date:new Date().toISOString().split("T")[0], validUntil:"", docType:"Tax Invoice", docNo:"", docDate:"", productName:"", hsn:"", qty:"", unit:"Nos", value:"", taxableValue:"", transportMode:"Road", vehicleNo:"", transporterName:"", distance:"" });
  const [consignor, setConsignor] = useState({ name:"", gstin:"", address:"", state:"" });
  const [consignee, setConsignee] = useState({ name:"", gstin:"", address:"", state:"" });
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);
  const upd=setter=>(k,v)=>setter(p=>({...p,[k]:v}));

  const handlePDF = async () => {
    if (!previewRef.current||downloading) return;
    setDownloading(true);
    try {
      try { await supabase.from("save_requests").insert({ template:"eway-bill", print_id:`EWAY-${Date.now()}`, user_id:null, bill_data: { ...data, consignor, consignee } }); } catch (err) { console.warn("Save logging for the e-way bill failed (non-blocking); the document itself was unaffected.", err); }
      const { default:jsPDF } = await import("jspdf");
      const { default:html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(previewRef.current,{scale:2,useCORS:true,backgroundColor:"#ffffff"});
      const pdf = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
      const pw=pdf.internal.pageSize.getWidth(),ph=pdf.internal.pageSize.getHeight();
      const s=Math.min(pw/(canvas.width*25.4/(96*2)),ph/(canvas.height*25.4/(96*2)));
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92),"JPEG",(pw-canvas.width*25.4/(96*2)*s)/2,0,canvas.width*25.4/(96*2)*s,canvas.height*25.4/(96*2)*s);
      pdf.save(`eway-bill-${data.ewayNo||Date.now()}.pdf`);
    } catch(e){
      const isTainted = /tainted|cross-origin|SecurityError/i.test(e?.message || e?.name || "");
      alert(isTainted
        ? "PDF failed: the logo image doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again."
        : "PDF failed: " + (e?.message || "Unknown error"));
    }
    finally{setDownloading(false);}
  };

  const S=({title,children})=>(<div style={{ background:"#fff", borderRadius:16, border:"1px solid #E2E8F0", padding:"20px 24px", marginBottom:16 }}><h2 style={{ fontSize:13, fontWeight:700, color:"#DC2626", margin:"0 0 16px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</h2>{children}</div>);

  useSEO({
    title: SEO_TITLE, description: SEO_DESCRIPTION, canonical: CANONICAL,
    breadcrumbs: [
      { name: "Home", url: "https://www.opstools.ai" },
      { name: "Documents", url: "https://www.opstools.ai/documents" },
      { name: "E-Way Bill Generator", url: CANONICAL },
    ],
    schemas: [softwareAppSchema, faqSchema],
  });

  return (
    <>
      <Helmet>
        <title>Free E-Way Bill Generator — GST E-Way Bill Reference | OpsTools</title>
        <meta name="description" content="Generate GST e-way bill reference documents with consignor and transport details. Free, no login, instant PDF." />
        <meta property="og:title" content="Free E-Way Bill Generator — GST E-Way Bill Reference | OpsTools" />
        <meta property="og:description" content="Generate GST e-way bill reference documents with consignor and transport details. Free, no login, instant PDF." />
        <meta property="og:url" content="https://www.opstools.ai/documents/eway-bill" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free E-Way Bill Generator — GST E-Way Bill Reference | OpsTools" />
        <meta name="twitter:description" content="Generate GST e-way bill reference documents with consignor and transport details. Free, no login, instant PDF." />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>
    <div style={{ backgroundColor:"#F8FAFC", minHeight:"100vh" }}>
      <style>{`@media(max-width:1023px){.ew-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .ew-grid{grid-template-columns:1fr!important;}}@media(max-width:768px){.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#450a0a 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#FCA5A5" }}><a href="/" style={{ color:"#FCA5A5", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span><a href="/documents" style={{ color:"#FCA5A5", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span><span style={{ color:"#FECACA" }}>E-Way Bill</span></nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>E-Way Bill Generator</h1>
          <p style={{ fontSize:14, color:"#FCA5A5", margin:0 }}>Reference e-way bill document with consignor, consignee, and transport details.</p>
        </div>
      </section>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div style={{ background:"#FEF2F2", border:"1px solid #FCA5A5", borderRadius:12, padding:"12px 16px", marginBottom:20, fontSize:13, color:"#991B1B" }}>
          ⚠️ <strong>Note:</strong> This tool generates a reference document for record-keeping. Official E-Way Bills must be generated on the GST Portal at <strong>ewaybillgst.gov.in</strong>
        </div>
        <div className="ew-grid" style={{ display:"grid", gridTemplateColumns:"1fr 480px", gap:28, alignItems:"start" }}>
          <div>
            <S title="E-Way Bill Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="E-Way Bill No." value={data.ewayNo} onChange={v=>upd(setData)("ewayNo",v)} placeholder="EWB-1234567890" />
                <Field label="Generated Date" value={data.date} onChange={v=>upd(setData)("date",v)} type="date" />
                <Field label="Valid Until" value={data.validUntil} onChange={v=>upd(setData)("validUntil",v)} type="date" />
                <div>
                  <label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Document Type</label>
                  <select value={data.docType} onChange={e=>upd(setData)("docType",e.target.value)} style={{ width:"100%", height:38, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 10px", fontSize:13, outline:"none", background:"#fff" }}>
                    {["Tax Invoice","Bill of Supply","Delivery Challan","Credit Note","Bill of Entry"].map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <Field label="Document No." value={data.docNo} onChange={v=>upd(setData)("docNo",v)} placeholder="INV-2026-001" />
                <Field label="Document Date" value={data.docDate} onChange={v=>upd(setData)("docDate",v)} type="date" />
              </div>
            </S>
            <S title="Consignor (From)">
              <Field label="Name / Business" value={consignor.name} onChange={v=>upd(setConsignor)("name",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="GSTIN" value={consignor.gstin} onChange={v=>upd(setConsignor)("gstin",v)} />
                <Field label="State" value={consignor.state} onChange={v=>upd(setConsignor)("state",v)} placeholder="Maharashtra" />
              </div>
              <Field label="Address" value={consignor.address} onChange={v=>upd(setConsignor)("address",v)} />
            </S>
            <S title="Consignee (To)">
              <Field label="Name / Business" value={consignee.name} onChange={v=>upd(setConsignee)("name",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="GSTIN" value={consignee.gstin} onChange={v=>upd(setConsignee)("gstin",v)} />
                <Field label="State" value={consignee.state} onChange={v=>upd(setConsignee)("state",v)} placeholder="Karnataka" />
              </div>
              <Field label="Address" value={consignee.address} onChange={v=>upd(setConsignee)("address",v)} />
            </S>
            <S title="Goods Details">
              <Field label="Product Name" value={data.productName} onChange={v=>upd(setData)("productName",v)} placeholder="Electronic Components" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <Field label="HSN Code" value={data.hsn} onChange={v=>upd(setData)("hsn",v)} placeholder="8542" />
                <Field label="Quantity" value={data.qty} onChange={v=>upd(setData)("qty",v)} />
                <Field label="Unit" value={data.unit} onChange={v=>upd(setData)("unit",v)} placeholder="Nos" />
                <Field label="Total Value ₹" value={data.value} onChange={v=>upd(setData)("value",v)} type="number" />
                <Field label="Taxable Value ₹" value={data.taxableValue} onChange={v=>upd(setData)("taxableValue",v)} type="number" />
              </div>
            </S>
            <S title="Transport Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <div>
                  <label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Mode</label>
                  <select value={data.transportMode} onChange={e=>upd(setData)("transportMode",e.target.value)} style={{ width:"100%", height:38, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 10px", fontSize:13, outline:"none", background:"#fff" }}>
                    {["Road","Rail","Air","Ship"].map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <Field label="Vehicle No." value={data.vehicleNo} onChange={v=>upd(setData)("vehicleNo",v)} placeholder="MH12AB1234" />
                <Field label="Transporter Name" value={data.transporterName} onChange={v=>upd(setData)("transporterName",v)} />
                <Field label="Distance (km)" value={data.distance} onChange={v=>upd(setData)("distance",v)} type="number" />
              </div>
            </S>
          </div>
          <div className="ew-prev" style={{ position:"sticky", top:88 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#64748B", margin:0 }}>Live Preview</p>
              <button onClick={handlePDF} disabled={downloading} style={{ background:"linear-gradient(135deg,#DC2626,#B91C1C)", border:"none", borderRadius:8, padding:"6px 16px", color:"#fff", fontSize:13, fontWeight:600, cursor:downloading?"wait":"pointer" }}>{downloading?"Saving…":"Save PDF"}</button>
            </div>
            <div className="preview-scale-wrap" style={{ transform:"scale(0.78)", transformOrigin:"top left", width:"128%", marginBottom:"-22%" }}>
              <div ref={previewRef}><EWayPreview data={data} consignor={consignor} consignee={consignee} /></div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0" }}>
        <div className="seo-section" style={{ maxWidth: "80%", margin: "0 auto", width: "80%" }}>
          <DocumentPageSEO documentName="E-Way Bill" documentSlug="eway-bill" intro={INTRO} whatIs={WHAT_IS} whyUse={WHY_USE} features={FEATURES} howToSteps={HOW_TO_STEPS} benefits={BENEFITS} formatFields={FORMAT_FIELDS} faqs={FAQS} relatedDocs={RELATED_DOCS} />
        </div>
      </div>
    </div>
    </>
  );
}
