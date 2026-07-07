import { Helmet } from 'react-helmet-async';
import { useState, useRef } from "react";
import { supabase } from "../../supabase-public.js";

function Field({ label, value, onChange, placeholder, type="text", small }) {
  return (
    <div style={{ marginBottom:small?8:12 }}>
      {label&&<label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder} onChange={e=>onChange&&onChange(e.target.value)}
        style={{ width:"100%", height:small?32:38, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 10px", fontSize:13, color:"#0F172A", outline:"none", boxSizing:"border-box", background:"#fff" }}
        onFocus={e=>e.target.style.borderColor="#CA8A04"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
    </div>
  );
}

function ElectricityPreview({ data, utility, consumer }) {
  const unitsConsumed = Math.max(0, (Number(data.currentReading)||0) - (Number(data.previousReading)||0));
  const energyCharge = unitsConsumed * (Number(data.ratePerUnit)||0);
  const fixedCharge = Number(data.fixedCharge)||0;
  const fuelAdj = Number(data.fuelAdj)||0;
  const subtotal = energyCharge + fixedCharge + fuelAdj;
  const tax = subtotal * (Number(data.tax)||5) / 100;
  const arrears = Number(data.arrears)||0;
  const total = subtotal + tax + arrears;
  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:11, color:"#1a1a1a", padding:"24px 28px" }}>
      <div style={{ background:"linear-gradient(135deg,#CA8A04,#A16207)", borderRadius:10, padding:"16px 20px", marginBottom:20, color:"#fff", display:"flex", justifyContent:"space-between", alignItems:"center" }}>
        <div>
          <div style={{ fontSize:16, fontWeight:800 }}>{utility.name||"Electricity Board"}</div>
          <div style={{ fontSize:10, opacity:0.8, marginTop:2 }}>{utility.address}</div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:14, fontWeight:800 }}>ELECTRICITY BILL</div>
          <div style={{ fontSize:10, opacity:0.8 }}>Bill No: {data.billNo||"—"}</div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        <div style={{ background:"#FEFCE8", borderRadius:8, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:"#CA8A04", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Consumer Details</div>
          <div style={{ fontWeight:700, fontSize:12 }}>{consumer.name||"Consumer Name"}</div>
          <div style={{ fontSize:10, color:"#475569", lineHeight:1.7 }}>
            {consumer.address&&<div>{consumer.address}</div>}
            {consumer.consumerId&&<div>Consumer No: {consumer.consumerId}</div>}
            {consumer.meterNo&&<div>Meter No: {consumer.meterNo}</div>}
            {consumer.category&&<div>Category: {consumer.category}</div>}
          </div>
        </div>
        <div style={{ background:"#FEFCE8", borderRadius:8, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:"#CA8A04", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Billing Period</div>
          <div style={{ fontSize:10, lineHeight:1.8 }}>
            <div><span style={{ color:"#64748B" }}>Bill Date: </span>{data.billDate?new Date(data.billDate+"T00:00:00").toLocaleDateString("en-IN"):"—"}</div>
            <div><span style={{ color:"#64748B" }}>Due Date: </span>{data.dueDate?new Date(data.dueDate+"T00:00:00").toLocaleDateString("en-IN"):"—"}</div>
            <div><span style={{ color:"#64748B" }}>Period: </span>{data.billingPeriod||"—"}</div>
          </div>
        </div>
      </div>
      <div style={{ background:"#FEFCE8", border:"1px solid #FDE68A", borderRadius:8, padding:"12px 14px", marginBottom:16 }}>
        <div style={{ fontSize:9, fontWeight:700, color:"#CA8A04", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:10 }}>Meter Reading</div>
        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
          <div style={{ textAlign:"center", background:"#fff", borderRadius:8, padding:"10px" }}>
            <div style={{ fontSize:9, color:"#64748B", marginBottom:4 }}>Previous Reading</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#CA8A04" }}>{data.previousReading||"0"}</div>
            <div style={{ fontSize:9, color:"#64748B" }}>kWh</div>
          </div>
          <div style={{ textAlign:"center", background:"#fff", borderRadius:8, padding:"10px" }}>
            <div style={{ fontSize:9, color:"#64748B", marginBottom:4 }}>Current Reading</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#CA8A04" }}>{data.currentReading||"0"}</div>
            <div style={{ fontSize:9, color:"#64748B" }}>kWh</div>
          </div>
          <div style={{ textAlign:"center", background:"#CA8A04", borderRadius:8, padding:"10px" }}>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.8)", marginBottom:4 }}>Units Consumed</div>
            <div style={{ fontSize:20, fontWeight:800, color:"#fff" }}>{unitsConsumed}</div>
            <div style={{ fontSize:9, color:"rgba(255,255,255,0.8)" }}>kWh</div>
          </div>
        </div>
      </div>
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:12 }}>
        <thead><tr style={{ background:"#CA8A04", color:"#fff" }}>
          <th style={{ padding:"7px 10px", fontSize:9, fontWeight:700, textAlign:"left" }}>Charge</th>
          <th style={{ padding:"7px 10px", fontSize:9, fontWeight:700, textAlign:"right" }}>Amount (₹)</th>
        </tr></thead>
        <tbody>
          {[
            [`Energy Charge (${unitsConsumed} units × ₹${data.ratePerUnit||0}/unit)`, energyCharge],
            ["Fixed / Demand Charge", fixedCharge],
            fuelAdj>0?["Fuel Adjustment Charge", fuelAdj]:null,
            [`Tax @${data.tax||5}%`, tax],
            arrears!==0?[arrears>0?"Previous Arrears":"Previous Advance", arrears]:null,
          ].filter(Boolean).map(([l,v])=>(
            <tr key={l} style={{ borderBottom:"1px solid #FEF3C7" }}>
              <td style={{ padding:"8px 10px", fontSize:11 }}>{l}</td>
              <td style={{ padding:"8px 10px", fontSize:11, textAlign:"right", fontWeight:v===total?800:400, color:v<0?"#DC2626":"inherit" }}>{v<0?`-₹${Math.abs(v).toFixed(2)}`:`₹${v.toFixed(2)}`}</td>
            </tr>
          ))}
          <tr style={{ background:"#CA8A04", color:"#fff" }}>
            <td style={{ padding:"10px", fontSize:13, fontWeight:800 }}>Total Amount Due</td>
            <td style={{ padding:"10px", fontSize:13, fontWeight:800, textAlign:"right" }}>₹{total.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>
      {data.paymentModes&&<div style={{ fontSize:10, color:"#475569", marginBottom:8 }}><strong>Pay via: </strong>{data.paymentModes}</div>}
      <div style={{ fontSize:9, color:"#94A3B8", textAlign:"center", borderTop:"1px solid #FEF3C7", paddingTop:8 }}>For queries: {utility.phone||utility.email||"Contact your electricity board"}</div>
    </div>
  );
}

export default function ElectricityBillPage() {
  const [data, setData] = useState({ billNo:`ELEC-${String(Math.floor(Math.random()*90000)+10000)}`, billDate:new Date().toISOString().split("T")[0], dueDate:"", billingPeriod:"", previousReading:"", currentReading:"", ratePerUnit:"", fixedCharge:"", fuelAdj:"", tax:"5", arrears:"", paymentModes:"Cash, UPI, Online Banking" });
  const [utility, setUtility] = useState({ name:"", address:"", phone:"", email:"", gstin:"" });
  const [consumer, setConsumer] = useState({ name:"", address:"", consumerId:"", meterNo:"", category:"Domestic" });
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);
  const upd=setter=>(k,v)=>setter(p=>({...p,[k]:v}));

  const handlePDF = async () => {
    if (!previewRef.current||downloading) return;
    setDownloading(true);
    try {
      try { await supabase.from("save_requests").insert({ template:"electricity-bill", print_id:`ELEC-${Date.now()}`, user_id:null }); } catch(_){}
      const { default:jsPDF } = await import("jspdf");
      const { default:html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(previewRef.current,{scale:2,useCORS:true,backgroundColor:"#ffffff"});
      const pdf = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
      const pw=pdf.internal.pageSize.getWidth(),ph=pdf.internal.pageSize.getHeight();
      const s=Math.min(pw/(canvas.width*25.4/(96*2)),ph/(canvas.height*25.4/(96*2)));
      pdf.addImage(canvas.toDataURL("image/png"),"PNG",(pw-canvas.width*25.4/(96*2)*s)/2,0,canvas.width*25.4/(96*2)*s,canvas.height*25.4/(96*2)*s);
      pdf.save(`electricity-bill-${data.billNo}.pdf`);
    } catch(e){alert("PDF failed: "+e?.message);}
    finally{setDownloading(false);}
  };

  const S=({title,children})=>(<div style={{ background:"#fff", borderRadius:16, border:"1px solid #E2E8F0", padding:"20px 24px", marginBottom:16 }}><h2 style={{ fontSize:13, fontWeight:700, color:"#CA8A04", margin:"0 0 16px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</h2>{children}</div>);

  return (
    <>
      <Helmet>
        <title>Free Electricity Bill Generator — Utility Bill with Meter Reading | OpsTools</title>
        <meta name="description" content="Generate electricity bills with meter readings, energy charges and tax breakdown. Free, no login, instant PDF." />
        <meta property="og:title" content="Free Electricity Bill Generator — Utility Bill with Meter Reading | OpsTools" />
        <meta property="og:description" content="Generate electricity bills with meter readings, energy charges and tax breakdown. Free, no login, instant PDF." />
        <meta property="og:url" content="https://www.opstools.ai/documents/electricity-bill" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Electricity Bill Generator — Utility Bill with Meter Reading | OpsTools" />
        <meta name="twitter:description" content="Generate electricity bills with meter readings, energy charges and tax breakdown. Free, no login, instant PDF." />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>
    <div style={{ backgroundColor:"#F8FAFC", minHeight:"100vh" }}>
      <style>{`@media(max-width:768px){.eb-grid{grid-template-columns:1fr!important;}.eb-prev{display:none!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#1c1400 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#FCD34D" }}><a href="/" style={{ color:"#FCD34D", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span><a href="/documents" style={{ color:"#FCD34D", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span><span style={{ color:"#FDE68A" }}>Electricity Bill</span></nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Electricity Bill Generator</h1>
          <p style={{ fontSize:14, color:"#FCD34D", margin:0 }}>Utility bills with meter readings, energy charges, and tax breakdown.</p>
        </div>
      </section>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div className="eb-grid" style={{ display:"grid", gridTemplateColumns:"1fr 460px", gap:28, alignItems:"start" }}>
          <div>
            <S title="Utility Board Details">
              <Field label="Board / Company Name" value={utility.name} onChange={v=>upd(setUtility)("name",v)} placeholder="MSEDCL / BESCOM / TNEB" />
              <Field label="Address" value={utility.address} onChange={v=>upd(setUtility)("address",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Phone" value={utility.phone} onChange={v=>upd(setUtility)("phone",v)} />
                <Field label="Email" value={utility.email} onChange={v=>upd(setUtility)("email",v)} />
                <Field label="GSTIN" value={utility.gstin} onChange={v=>upd(setUtility)("gstin",v)} />
              </div>
            </S>
            <S title="Consumer Details">
              <Field label="Consumer Name" value={consumer.name} onChange={v=>upd(setConsumer)("name",v)} placeholder="Rajesh Sharma" />
              <Field label="Address" value={consumer.address} onChange={v=>upd(setConsumer)("address",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <Field label="Consumer No." value={consumer.consumerId} onChange={v=>upd(setConsumer)("consumerId",v)} placeholder="CA-12345678" />
                <Field label="Meter No." value={consumer.meterNo} onChange={v=>upd(setConsumer)("meterNo",v)} placeholder="MT-987654" />
                <div>
                  <label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Category</label>
                  <select value={consumer.category} onChange={e=>upd(setConsumer)("category",e.target.value)} style={{ width:"100%", height:38, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 10px", fontSize:13, outline:"none", background:"#fff" }}>
                    {["Domestic","Commercial","Industrial","Agricultural"].map(c=><option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
            </S>
            <S title="Bill Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Bill No." value={data.billNo} onChange={v=>upd(setData)("billNo",v)} />
                <Field label="Bill Date" value={data.billDate} onChange={v=>upd(setData)("billDate",v)} type="date" />
                <Field label="Due Date" value={data.dueDate} onChange={v=>upd(setData)("dueDate",v)} type="date" />
                <Field label="Billing Period" value={data.billingPeriod} onChange={v=>upd(setData)("billingPeriod",v)} placeholder="June 2026" />
              </div>
            </S>
            <S title="Meter Reading">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Previous Reading (kWh)" value={data.previousReading} onChange={v=>upd(setData)("previousReading",v)} type="number" placeholder="1200" />
                <Field label="Current Reading (kWh)" value={data.currentReading} onChange={v=>upd(setData)("currentReading",v)} type="number" placeholder="1450" />
                <Field label="Rate per Unit (₹/kWh)" value={data.ratePerUnit} onChange={v=>upd(setData)("ratePerUnit",v)} type="number" placeholder="6.50" />
                <Field label="Fixed Charge (₹)" value={data.fixedCharge} onChange={v=>upd(setData)("fixedCharge",v)} type="number" placeholder="50" />
                <Field label="Fuel Adjustment (₹)" value={data.fuelAdj} onChange={v=>upd(setData)("fuelAdj",v)} type="number" placeholder="0" />
                <Field label="Tax %" value={data.tax} onChange={v=>upd(setData)("tax",v)} type="number" placeholder="5" />
                <Field label="Previous Arrears (₹)" value={data.arrears} onChange={v=>upd(setData)("arrears",v)} type="number" placeholder="0" />
                <Field label="Payment Modes" value={data.paymentModes} onChange={v=>upd(setData)("paymentModes",v)} placeholder="Cash, UPI, Online" />
              </div>
            </S>
          </div>
          <div className="eb-prev" style={{ position:"sticky", top:88 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#64748B", margin:0 }}>Live Preview</p>
              <button onClick={handlePDF} disabled={downloading} style={{ background:"linear-gradient(135deg,#CA8A04,#A16207)", border:"none", borderRadius:8, padding:"6px 16px", color:"#fff", fontSize:13, fontWeight:600, cursor:downloading?"wait":"pointer" }}>{downloading?"Saving…":"Save PDF"}</button>
            </div>
            <div style={{ transform:"scale(0.78)", transformOrigin:"top left", width:"128%", marginBottom:"-22%" }}>
              <div ref={previewRef}><ElectricityPreview data={data} utility={utility} consumer={consumer} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
