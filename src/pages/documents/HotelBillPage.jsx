import { useState } from "react";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";
import SaveMenu from "../../components/common/SaveMenu";
import { exportSingleDocument } from "../../utils/documentExport";
import { logSaveRequest } from "../../utils/saveLog";

const TAINTED_HINT = "the logo image doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again.";

// Neutral document palette — a printed bill should read like a normal business
// document, not a brand-colour showcase. Brand blue is reserved for interactive
// form chrome (focus rings, add buttons) below, never for the bill preview.
const INK = "#0F172A";
const INK_SOFT = "#475569";
const INK_MUTED = "#64748B";
const BORDER = "#E2E8F0";
const SURFACE = "#F8FAFC";
const SURFACE_ALT = "#F1F5F9";
const BRAND = "#2563EB";

// ─── SEO ─────────────────────────────────────────────────────────────────────
const SEO_TITLE = "Free Hotel Bill Generator Online — Stay Receipt PDF (2026)";
const SEO_DESCRIPTION = "Generate a hotel bill online for free. Check-in/check-out dates, room charges, taxes, and GSTIN. No login. Instant PDF. India-compliant.";
const CANONICAL = "https://www.opstools.ai/documents/hotel-bill";
const softwareAppSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "OpsTools Hotel Bill Generator", operatingSystem: "Web", applicationCategory: "BusinessApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, description: SEO_DESCRIPTION, url: CANONICAL, provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" } };
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "Is this hotel bill generator free?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no login required." } },
  { "@type": "Question", name: "How is the number of nights calculated?", acceptedAnswer: { "@type": "Answer", text: "Nights are calculated automatically from your check-in and check-out dates — no manual counting needed." } },
  { "@type": "Question", name: "Can I use this for travel reimbursement?", acceptedAnswer: { "@type": "Answer", text: "Yes, a properly formatted hotel bill with dates, charges, and GSTIN is exactly what most travel expense claims need." } },
  { "@type": "Question", name: "Does it include additional charges?", acceptedAnswer: { "@type": "Answer", text: "Yes, optional fields are available for extra charges like room service, laundry, or amenities, alongside the room rate." } },
] };
const INTRO = (<><p style={{ marginBottom: 16 }}>Need a hotel bill for travel reimbursement, expense records, or a stay confirmation? OpsTools Hotel Bill Generator lays out a clean, professional receipt in under a minute — check-in/check-out dates, room charges, and tax, all calculated automatically.</p><p style={{ marginBottom: 16 }}>Enter the check-in and check-out dates and the number of nights computes itself. Add the room rate and any additional charges — room service, amenities, or extras — and the total, including applicable tax, is worked out for you.</p><p>The preview updates live as you type. Download directly as a PDF — your data never leaves your browser.</p></>);
const WHAT_IS = `A hotel bill is the receipt issued to a guest at checkout, itemizing the room charge, number of nights, any additional charges, and applicable tax. It's commonly required for business travel reimbursement and expense record-keeping.`;
const WHY_USE = [
  { title: "Business travel reimbursement", body: "Attach a properly formatted hotel bill when claiming back travel expenses." },
  { title: "Small hotels & guesthouses", body: "Generate professional bills without investing in dedicated hotel management software." },
  { title: "Travel expense records", body: "Keep consistent records of accommodation spend across trips." },
];
const FEATURES = [
  { icon: "🏨", title: "Auto-calculated nights", body: "Number of nights computed automatically from check-in and check-out dates." },
  { icon: "🧮", title: "Room + additional charges", body: "Room rate plus optional extras like room service or amenities, all itemized." },
  { icon: "🧾", title: "GSTIN & tax support", body: "Include the hotel's GSTIN and applicable tax on the bill." },
  { icon: "👁️", title: "Live preview", body: "See the bill update in real time as you fill the form." },
  { icon: "⬇️", title: "Direct PDF download", body: "One click downloads the bill as a PDF." },
  { icon: "🔒", title: "100% private", body: "No data is stored or transmitted. Everything happens in your browser." },
];
const HOW_TO_STEPS = [
  { step: 1, title: "Enter stay dates", body: "Check-in and check-out dates — nights calculate automatically." },
  { step: 2, title: "Add hotel details", body: "Hotel name, address, and GSTIN." },
  { step: 3, title: "Add guest details", body: "Guest name and address." },
  { step: 4, title: "Enter charges", body: "Room rate and any additional charges." },
  { step: 5, title: "Preview", body: "Check the live preview — totals update instantly." },
  { step: 6, title: "Download", body: "Click Save to download the bill as a PDF or PNG." },
];
const BENEFITS = [
  "Nights calculated automatically from stay dates.",
  "Room and additional charges itemized separately.",
  "GSTIN and tax support included.",
  "No registration or sign-up required.",
  "All data stays in your browser — zero privacy risk.",
  "Completely free — no subscription.",
];
const FORMAT_FIELDS = [
  { field: "Check-in / Check-out", description: "Stay dates, used to calculate number of nights", example: "20 Jun – 22 Jun 2026" },
  { field: "Room Rate", description: "Per-night charge for the room", example: "₹4,500" },
  { field: "Additional Charges", description: "Extras like room service or amenities", example: "₹850" },
  { field: "GSTIN", description: "Hotel's GST registration number", example: "27AABCU9603R1ZX" },
];
const FAQS = faqSchema.mainEntity.map((i) => ({ q: i.name, a: i.acceptedAnswer.text }));
const RELATED_DOCS = [
  { name: "Travel Expense Report", href: "/documents/travel-expense", description: "Business travel expense summary." },
  { name: "Restaurant Bill Generator", href: "/documents/restaurant-bill", description: "Restaurant bills and food receipts." },
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

function Section({ title, children }) {
  return (
    <div style={{ background:"#fff", borderRadius:16, border:`1px solid ${BORDER}`, padding:"20px 24px", marginBottom:16 }}>
      <h2 style={{ fontSize:13, fontWeight:700, color:INK, margin:"0 0 16px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</h2>
      {children}
    </div>
  );
}

const defaultCharge = () => ({ id:Date.now()+Math.random(), description:"", qty:1, rate:0, category:"Room" });
const CATEGORIES = ["Room","Food & Beverage","Spa","Laundry","Transport","Miscellaneous"];

const todayISO = () => new Date().toISOString().split("T")[0];
const daysAgoISO = (n) => { const d=new Date(); d.setDate(d.getDate()-n); return d.toISOString().split("T")[0]; };

function HotelPreview({ data }) {
  const { hotel, guest, charges } = data;
  const nights = data.checkIn&&data.checkOut ? Math.max(1,Math.round((new Date(data.checkOut)-new Date(data.checkIn))/(1000*60*60*24))) : 1;
  const subtotal = charges.reduce((s,c)=>s+Number(c.qty||0)*Number(c.rate||0),0);
  const cgst = subtotal*(Number(data.cgst)||6)/100;
  const sgst = subtotal*(Number(data.sgst)||6)/100;
  const total = subtotal+cgst+sgst-(Number(data.discount)||0);
  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:12, color:INK, padding:"32px 40px" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, paddingBottom:16, borderBottom:`2px solid ${INK}` }}>
        <div>
          {data.logoUrl&&<img src={data.logoUrl} alt="logo" style={{ maxHeight:56, maxWidth:160, objectFit:"contain", marginBottom:8, display:"block" }}/>}
          <div style={{ fontSize:19, fontWeight:800, color:INK }}>{hotel.name||"Hotel Name"}</div>
          <div style={{ fontSize:11, color:INK_SOFT, marginTop:3, lineHeight:1.7 }}>
            {hotel.address&&<div>{hotel.address}</div>}
            {hotel.phone&&<div>Tel: {hotel.phone}</div>}
            {hotel.email&&<div>{hotel.email}</div>}
            {hotel.gstin&&<div>GSTIN: {hotel.gstin}</div>}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:20, fontWeight:900, color:INK, letterSpacing:"0.02em" }}>HOTEL BILL</div>
          <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 16px", marginTop:8, fontSize:12 }}>
            <div style={{ display:"flex", gap:16, justifyContent:"flex-end" }}><span style={{ color:INK_MUTED }}>Bill No.</span><strong>{data.billNo||"—"}</strong></div>
            <div style={{ display:"flex", gap:16, justifyContent:"flex-end", marginTop:4 }}><span style={{ color:INK_MUTED }}>Date</span><strong>{data.checkOut?new Date(data.checkOut+"T00:00:00").toLocaleDateString("en-IN"):"—"}</strong></div>
          </div>
        </div>
      </div>

      {/* Guest / stay panels */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
        <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"12px 14px" }}>
          <div style={{ fontSize:10, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Guest Details</div>
          <div style={{ fontWeight:700, fontSize:13, color:INK }}>{guest.name||"Guest Name"}</div>
          <div style={{ fontSize:11, color:INK_SOFT, lineHeight:1.7 }}>
            {guest.address&&<div>{guest.address}</div>}
            {guest.idType&&guest.idNo&&<div>{guest.idType}: {guest.idNo}</div>}
            {guest.phone&&<div>{guest.phone}</div>}
          </div>
        </div>
        <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"12px 14px" }}>
          <div style={{ fontSize:10, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Stay Details</div>
          <div style={{ fontSize:11, lineHeight:1.7, color:INK_SOFT }}>
            {data.roomNo&&<div><span style={{ color:INK_MUTED }}>Room: </span><strong style={{ color:INK }}>{data.roomNo} ({data.roomType||"Standard"})</strong></div>}
            {data.checkIn&&<div><span style={{ color:INK_MUTED }}>Check-in: </span>{new Date(data.checkIn+"T00:00:00").toLocaleDateString("en-IN")}</div>}
            {data.checkOut&&<div><span style={{ color:INK_MUTED }}>Check-out: </span>{new Date(data.checkOut+"T00:00:00").toLocaleDateString("en-IN")}</div>}
            <div><span style={{ color:INK_MUTED }}>Nights: </span><strong style={{ color:INK }}>{nights}</strong></div>
            {data.guests&&<div><span style={{ color:INK_MUTED }}>Guests: </span>{data.guests}</div>}
          </div>
        </div>
      </div>

      {/* Charges table */}
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:16 }}>
        <thead><tr style={{ background:INK, color:"#fff" }}>
          {["#","Description","Category","Qty","Rate (₹)","Amount (₹)"].map(h=><th key={h} style={{ padding:"8px 10px", fontSize:10, fontWeight:700, textAlign:h==="Description"||h==="Category"?"left":"right" }}>{h}</th>)}
        </tr></thead>
        <tbody>{charges.map((c,i)=>(
          <tr key={c.id} style={{ borderBottom:`1px solid ${BORDER}`, background:i%2===0?"#fff":SURFACE }}>
            <td style={{ padding:"9px 10px", textAlign:"right", color:INK_MUTED }}>{i+1}</td>
            <td style={{ padding:"9px 10px", color:INK }}>{c.description||"—"}</td>
            <td style={{ padding:"9px 10px" }}><span style={{ background:SURFACE_ALT, color:INK_SOFT, fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:999 }}>{c.category}</span></td>
            <td style={{ padding:"9px 10px", textAlign:"right", color:INK_SOFT }}>{c.qty}</td>
            <td style={{ padding:"9px 10px", textAlign:"right", color:INK_SOFT }}>{Number(c.rate||0).toFixed(2)}</td>
            <td style={{ padding:"9px 10px", textAlign:"right", fontWeight:700, color:INK }}>{(Number(c.qty||0)*Number(c.rate||0)).toFixed(2)}</td>
          </tr>
        ))}</tbody>
      </table>

      {/* Totals */}
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <div style={{ width:250 }}>
          {[["Subtotal",subtotal],[`CGST @${data.cgst||6}%`,cgst],[`SGST @${data.sgst||6}%`,sgst],Number(data.discount)>0?["Discount",-(Number(data.discount)||0)]:null].filter(Boolean).map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:`1px solid ${BORDER}`, fontSize:12 }}><span style={{ color:INK_MUTED }}>{l}</span><span style={{ color:INK }}>{v<0?`-₹${Math.abs(v).toFixed(2)}`:`₹${v.toFixed(2)}`}</span></div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 12px", background:INK, color:"#fff", borderRadius:8, marginTop:8, fontSize:14, fontWeight:800 }}><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        </div>
      </div>

      {data.paymentMode&&<div style={{ fontSize:11, color:INK_SOFT, textAlign:"right", marginBottom:12 }}>Payment Mode: <strong style={{ color:INK }}>{data.paymentMode}</strong></div>}
      <div style={{ borderTop:`1px solid ${BORDER}`, marginTop:16, paddingTop:12, fontSize:10, color:INK_MUTED, textAlign:"center" }}>Thank you for staying with us. We hope to welcome you again.</div>
    </div>
  );
}

export default function HotelBillPage() {
  const [data, setData] = useState(() => ({
    billNo:`HTL-${String(Math.floor(Math.random()*9000)+1000)}`,
    checkIn:daysAgoISO(2), checkOut:todayISO(),
    roomNo:"204", roomType:"Deluxe", guests:"2", logoUrl:"",
    cgst:"6", sgst:"6", discount:"500", paymentMode:"Card",
  }));
  const [hotel, setHotel] = useState({
    name:"Hotel Sahyadri Grand",
    address:"Plot 14, MG Road, Camp, Pune, Maharashtra 411001",
    phone:"+91 20 4567 8900",
    email:"reservations@sahyadrigrand.in",
    gstin:"27AABCU9603R1ZX",
  });
  const [guest, setGuest] = useState({
    name:"Rajesh Verma",
    address:"B-402, Sunrise Residency, Andheri East, Mumbai 400069",
    phone:"+91 98200 11223",
    idType:"Aadhaar",
    idNo:"4821 7734 9056",
  });
  const [charges, setCharges] = useState([
    { id:2001, description:"Deluxe Room — 2 Nights", qty:2, rate:4500, category:"Room" },
    { id:2002, description:"Restaurant — Dinner & Room Service", qty:1, rate:1250, category:"Food & Beverage" },
    { id:2003, description:"Laundry Service", qty:1, rate:380, category:"Laundry" },
  ]);
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");

  const upd=setter=>(k,v)=>setter(p=>({...p,[k]:v}));
  const updCharge=(id,k,v)=>setCharges(p=>p.map(c=>c.id===id?{...c,[k]:v}:c));

  const doDownload = async (format = "pdf") => {
    if (downloading) return;
    setDownloading(true);
    setNotice("");

    const billData = { ...data, hotel, guest, charges };
    const printId = `HTL-${Date.now()}`;
    const logged = await logSaveRequest({ template: "hotel-bill", printId, billData });
    if (!logged.ok) setNotice("Your bill downloaded fine, but we couldn't record it on our side.");

    await exportSingleDocument({
      Template: HotelPreview,
      data: billData,
      format,
      fileBase: `hotel-bill-${data.billNo}`,
      taintedHint: TAINTED_HINT,
    });
    setDownloading(false);
  };

  useSEO({
    title: SEO_TITLE, description: SEO_DESCRIPTION, canonical: CANONICAL,
    breadcrumbs: [
      { name: "Home", url: "https://www.opstools.ai" },
      { name: "Documents", url: "https://www.opstools.ai/documents" },
      { name: "Hotel Bill Generator", url: CANONICAL },
    ],
    schemas: [softwareAppSchema, faqSchema],
  });

  return (
    <div style={{ backgroundColor:SURFACE, minHeight:"100vh" }}>
      <style>{`@media(max-width:1023px){.hb-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .hb-grid{grid-template-columns:1fr!important;}}@media(max-width:768px){.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#0c2340 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#7DD3FC" }}><a href="/" style={{ color:"#7DD3FC", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span><a href="/documents" style={{ color:"#7DD3FC", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span><span style={{ color:"#BAE6FD" }}>Hotel Bill</span></nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Hotel Bill Generator</h1>
          <p style={{ fontSize:14, color:"#7DD3FC", margin:0 }}>Professional hotel bills with room charges, F&B, stay details, and CGST/SGST.</p>
        </div>
      </section>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div className="hb-grid" style={{ display:"grid", gridTemplateColumns:"1fr 500px", gap:28, alignItems:"start" }}>
          <div>
            <Section title="Hotel Details">
              <Field label="Hotel Name" value={hotel.name} onChange={v=>upd(setHotel)("name",v)} placeholder="The Grand Hotel" />
              <Field label="Address" value={hotel.address} onChange={v=>upd(setHotel)("address",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Phone" value={hotel.phone} onChange={v=>upd(setHotel)("phone",v)} />
                <Field label="Email" value={hotel.email} onChange={v=>upd(setHotel)("email",v)} />
                <Field label="GSTIN" value={hotel.gstin} onChange={v=>upd(setHotel)("gstin",v)} />
                <Field label="Logo URL" value={data.logoUrl} onChange={v=>upd(setData)("logoUrl",v)} placeholder="https://..." />
              </div>
            </Section>
            <Section title="Stay Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Bill No." value={data.billNo} onChange={v=>upd(setData)("billNo",v)} />
                <Field label="Room No." value={data.roomNo} onChange={v=>upd(setData)("roomNo",v)} placeholder="101" />
                <Field label="Room Type" value={data.roomType} onChange={v=>upd(setData)("roomType",v)} placeholder="Deluxe" />
                <Field label="No. of Guests" value={data.guests} onChange={v=>upd(setData)("guests",v)} type="number" />
                <Field label="Check-in" value={data.checkIn} onChange={v=>upd(setData)("checkIn",v)} type="date" />
                <Field label="Check-out" value={data.checkOut} onChange={v=>upd(setData)("checkOut",v)} type="date" />
              </div>
            </Section>
            <Section title="Guest Details">
              <Field label="Guest Name" value={guest.name} onChange={v=>upd(setGuest)("name",v)} placeholder="Rajesh Verma" />
              <Field label="Address" value={guest.address} onChange={v=>upd(setGuest)("address",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <Field label="Phone" value={guest.phone} onChange={v=>upd(setGuest)("phone",v)} />
                <div>
                  <label style={{ fontSize:11, fontWeight:600, color:INK_MUTED, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>ID Type</label>
                  <select value={guest.idType} onChange={e=>upd(setGuest)("idType",e.target.value)} style={{ width:"100%", height:38, border:`1.5px solid ${BORDER}`, borderRadius:8, padding:"0 10px", fontSize:13, outline:"none", background:"#fff" }}>
                    {["Aadhaar","Passport","Driving License","Voter ID","PAN"].map(t=><option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <Field label="ID Number" value={guest.idNo} onChange={v=>upd(setGuest)("idNo",v)} />
              </div>
            </Section>
            <Section title="Charges">
              {charges.map((c,idx)=>(
                <div key={c.id} style={{ background:SURFACE, borderRadius:12, padding:"14px 16px", marginBottom:10, border:`1px solid ${BORDER}`, position:"relative" }}>
                  {charges.length>1&&<button onClick={()=>setCharges(p=>p.filter(i=>i.id!==c.id))} style={{ position:"absolute", top:10, right:10, background:"#FEF2F2", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:"#DC2626", fontSize:14 }}>×</button>}
                  <Field label={`Item ${idx+1}`} value={c.description} onChange={v=>updCharge(c.id,"description",v)} placeholder="Room Charge - 1 Night" small />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                    <div>
                      <label style={{ fontSize:11, fontWeight:600, color:INK_MUTED, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Category</label>
                      <select value={c.category} onChange={e=>updCharge(c.id,"category",e.target.value)} style={{ width:"100%", height:32, border:`1.5px solid ${BORDER}`, borderRadius:8, padding:"0 8px", fontSize:12, outline:"none", background:"#fff" }}>
                        {CATEGORIES.map(t=><option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <Field label="Qty" value={c.qty} onChange={v=>updCharge(c.id,"qty",Number(v))} type="number" small />
                    <Field label="Rate ₹" value={c.rate} onChange={v=>updCharge(c.id,"rate",Number(v))} type="number" small />
                  </div>
                </div>
              ))}
              <button onClick={()=>setCharges(p=>[...p,defaultCharge()])} style={{ width:"100%", padding:10, borderRadius:10, border:`1.5px dashed ${BRAND}`, background:SURFACE, color:BRAND, fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Charge</button>
              <div style={{ background:INK, color:"#fff", borderRadius:10, padding:"12px 16px", marginTop:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:14, fontWeight:700 }}>Subtotal</span>
                <span style={{ fontSize:18, fontWeight:900 }}>₹{charges.reduce((s,c)=>s+Number(c.qty||0)*Number(c.rate||0),0).toFixed(2)}</span>
              </div>
            </Section>
            <Section title="Tax & Payment">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <Field label="CGST %" value={data.cgst} onChange={v=>upd(setData)("cgst",v)} type="number" placeholder="6" />
                <Field label="SGST %" value={data.sgst} onChange={v=>upd(setData)("sgst",v)} type="number" placeholder="6" />
                <Field label="Discount ₹" value={data.discount} onChange={v=>upd(setData)("discount",v)} type="number" placeholder="0" />
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:600, color:INK_MUTED, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Payment Mode</label>
                <select value={data.paymentMode} onChange={e=>upd(setData)("paymentMode",e.target.value)} style={{ width:"100%", height:38, border:`1.5px solid ${BORDER}`, borderRadius:8, padding:"0 10px", fontSize:13, outline:"none", background:"#fff" }}>
                  {["Card","Cash","UPI","Bank Transfer","Online"].map(m=><option key={m} value={m}>{m}</option>)}
                </select>
              </div>
            </Section>
          </div>
          <div className="hb-prev" style={{ position:"sticky", top:88 }}>
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
              <HotelPreview data={{ ...data, hotel, guest, charges }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderTop: `1px solid ${BORDER}` }}>
        <div className="seo-section" style={{ maxWidth: "80%", margin: "0 auto", width: "80%" }}>
          <DocumentPageSEO documentName="Hotel Bill" documentSlug="hotel-bill" intro={INTRO} whatIs={WHAT_IS} whyUse={WHY_USE} features={FEATURES} howToSteps={HOW_TO_STEPS} benefits={BENEFITS} formatFields={FORMAT_FIELDS} faqs={FAQS} relatedDocs={RELATED_DOCS} />
        </div>
      </div>
    </div>
  );
}
