import { Helmet } from 'react-helmet-async';
import { useState, useRef } from "react";
import { supabase } from "../../supabase";

function Field({ label, value, onChange, placeholder, type="text", small }) {
  return (
    <div style={{ marginBottom:small?8:12 }}>
      {label&&<label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder} onChange={e=>onChange&&onChange(e.target.value)}
        style={{ width:"100%", height:small?32:38, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 10px", fontSize:13, color:"#0F172A", outline:"none", boxSizing:"border-box", background:"#fff" }}
        onFocus={e=>e.target.style.borderColor="#10B981"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
    </div>
  );
}

const defaultItem = () => ({ id:Date.now()+Math.random(), description:"", type:"Medicine", qty:1, rate:0 });
const TYPES = ["Medicine","Consultation","Lab Test","Procedure","Equipment","Other"];

function MedicalPreview({ data, hospital, patient, items }) {
  const subtotal = items.reduce((s,i)=>s+i.qty*i.rate,0);
  const disc = Number(data.discount)||0;
  const total = subtotal - disc;
  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:12, color:"#1a1a1a", padding:"32px 36px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, paddingBottom:16, borderBottom:"2px solid #10B981" }}>
        <div>
          {data.logoUrl&&<img src={data.logoUrl} alt="logo" style={{ maxHeight:52, maxWidth:160, objectFit:"contain", marginBottom:8, display:"block" }}/>}
          <div style={{ fontSize:18, fontWeight:800, color:"#065F46" }}>{hospital.name||"Hospital / Clinic Name"}</div>
          <div style={{ fontSize:11, color:"#475569", marginTop:3, lineHeight:1.7 }}>
            {hospital.address&&<div>{hospital.address}</div>}
            {hospital.phone&&<div>Tel: {hospital.phone}</div>}
            {hospital.gstin&&<div>GSTIN: {hospital.gstin}</div>}
            {hospital.regNo&&<div>Reg No: {hospital.regNo}</div>}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ background:"#ECFDF5", border:"1px solid #6EE7B7", borderRadius:8, padding:"12px 16px" }}>
            <div style={{ fontSize:14, fontWeight:800, color:"#065F46", marginBottom:8 }}>MEDICAL BILL</div>
            <div style={{ fontSize:11 }}><span style={{ color:"#64748B" }}>Bill No: </span><strong>{data.billNo||"—"}</strong></div>
            <div style={{ fontSize:11, marginTop:3 }}><span style={{ color:"#64748B" }}>Date: </span><strong>{data.date?new Date(data.date+"T00:00:00").toLocaleDateString("en-IN"):"—"}</strong></div>
          </div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
        <div style={{ background:"#F0FDF4", borderRadius:8, padding:"12px 14px" }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#10B981", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Patient Details</div>
          <div style={{ fontWeight:700, fontSize:13 }}>{patient.name||"Patient Name"}</div>
          <div style={{ fontSize:11, color:"#475569", lineHeight:1.7, marginTop:2 }}>
            {patient.age&&<div>Age: {patient.age}</div>}
            {patient.gender&&<div>Gender: {patient.gender}</div>}
            {patient.phone&&<div>Phone: {patient.phone}</div>}
            {patient.uhid&&<div>UHID: {patient.uhid}</div>}
          </div>
        </div>
        <div style={{ background:"#F0FDF4", borderRadius:8, padding:"12px 14px" }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#10B981", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Doctor / Dept</div>
          <div style={{ fontWeight:700, fontSize:13 }}>{data.doctorName||"—"}</div>
          <div style={{ fontSize:11, color:"#475569", lineHeight:1.7, marginTop:2 }}>
            {data.department&&<div>{data.department}</div>}
            {data.admitDate&&<div>Admit: {new Date(data.admitDate+"T00:00:00").toLocaleDateString("en-IN")}</div>}
            {data.dischargeDate&&<div>Discharge: {new Date(data.dischargeDate+"T00:00:00").toLocaleDateString("en-IN")}</div>}
          </div>
        </div>
      </div>
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:16 }}>
        <thead><tr style={{ background:"#10B981", color:"#fff" }}>
          {["#","Description","Type","Qty","Rate (₹)","Amount (₹)"].map(h=><th key={h} style={{ padding:"8px 10px", fontSize:10, fontWeight:700, textAlign:h==="Description"||h==="Type"?"left":"right" }}>{h}</th>)}
        </tr></thead>
        <tbody>{items.map((item,i)=>(
          <tr key={item.id} style={{ borderBottom:"1px solid #E2E8F0", background:i%2===0?"#fff":"#F0FDF4" }}>
            <td style={{ padding:"9px 10px", textAlign:"right", color:"#94A3B8" }}>{i+1}</td>
            <td style={{ padding:"9px 10px" }}>{item.description||"—"}</td>
            <td style={{ padding:"9px 10px" }}><span style={{ background:"#DCFCE7", color:"#065F46", fontSize:10, fontWeight:600, padding:"2px 8px", borderRadius:999 }}>{item.type}</span></td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{item.qty}</td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{item.rate.toFixed(2)}</td>
            <td style={{ padding:"9px 10px", textAlign:"right", fontWeight:700 }}>{(item.qty*item.rate).toFixed(2)}</td>
          </tr>
        ))}</tbody>
      </table>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <div style={{ width:220 }}>
          <div style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #F1F5F9", fontSize:12 }}><span style={{ color:"#64748B" }}>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          {disc>0&&<div style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #F1F5F9", fontSize:12 }}><span style={{ color:"#64748B" }}>Discount</span><span>-₹{disc.toFixed(2)}</span></div>}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 12px", background:"#10B981", color:"#fff", borderRadius:8, marginTop:8, fontSize:14, fontWeight:800 }}><span>Net Amount</span><span>₹{total.toFixed(2)}</span></div>
        </div>
      </div>
      {data.paymentMode&&<div style={{ fontSize:11, color:"#475569", textAlign:"right", marginBottom:12 }}>Payment Mode: <strong>{data.paymentMode}</strong></div>}
      <div style={{ marginTop:20, display:"flex", justifyContent:"flex-end" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ width:120, height:40, borderBottom:"1px solid #CBD5E1", marginBottom:6 }}/>
          <div style={{ fontSize:11, color:"#64748B" }}>Authorised Signatory</div>
        </div>
      </div>
    </div>
  );
}

export default function MedicalBillPage() {
  const [data, setData] = useState({ billNo:`MED-${String(Math.floor(Math.random()*9000)+1000)}`, date:new Date().toISOString().split("T")[0], logoUrl:"", doctorName:"", department:"", admitDate:"", dischargeDate:"", discount:"", paymentMode:"Cash" });
  const [hospital, setHospital] = useState({ name:"", address:"", phone:"", gstin:"", regNo:"" });
  const [patient, setPatient] = useState({ name:"", age:"", gender:"", phone:"", uhid:"" });
  const [items, setItems] = useState([defaultItem()]);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);
  const upd=setter=>(k,v)=>setter(p=>({...p,[k]:v}));
  const updItem=(id,k,v)=>setItems(p=>p.map(i=>i.id===id?{...i,[k]:v}:i));

  const handlePDF = async () => {
    if (!previewRef.current||downloading) return;
    setDownloading(true);
    try {
      try { await supabase.from("save_requests").insert({ template:"medical-bill", print_id:`MED-${Date.now()}`, user_id:null, bill_data: { ...data, hospital, patient, items } }); } catch(_){}
      const { default:jsPDF } = await import("jspdf");
      const { default:html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(previewRef.current,{scale:2,useCORS:true,backgroundColor:"#ffffff"});
      const pdf = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
      const pw=pdf.internal.pageSize.getWidth(),ph=pdf.internal.pageSize.getHeight();
      const s=Math.min(pw/(canvas.width*25.4/(96*2)),ph/(canvas.height*25.4/(96*2)));
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92),"JPEG",(pw-canvas.width*25.4/(96*2)*s)/2,0,canvas.width*25.4/(96*2)*s,canvas.height*25.4/(96*2)*s);
      pdf.save(`medical-bill-${data.billNo}.pdf`);
    } catch(e){
      const isTainted = /tainted|cross-origin|SecurityError/i.test(e?.message || e?.name || "");
      alert(isTainted
        ? "PDF failed: the logo image doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again."
        : "PDF failed: " + (e?.message || "Unknown error"));
    }
    finally{setDownloading(false);}
  };

  const S=({title,children})=>(<div style={{ background:"#fff", borderRadius:16, border:"1px solid #E2E8F0", padding:"20px 24px", marginBottom:16 }}><h2 style={{ fontSize:13, fontWeight:700, color:"#10B981", margin:"0 0 16px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</h2>{children}</div>);

  return (
    <>
      <Helmet>
        <title>Free Medical Bill Generator — Hospital and Pharmacy Receipt | OpsTools</title>
        <meta name="description" content="Generate medical bills with patient details, medicines and consultation fees. Free, no login, instant PDF." />
        <meta property="og:title" content="Free Medical Bill Generator — Hospital and Pharmacy Receipt | OpsTools" />
        <meta property="og:description" content="Generate medical bills with patient details, medicines and consultation fees. Free, no login, instant PDF." />
        <meta property="og:url" content="https://www.opstools.ai/documents/medical-bill" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Medical Bill Generator — Hospital and Pharmacy Receipt | OpsTools" />
        <meta name="twitter:description" content="Generate medical bills with patient details, medicines and consultation fees. Free, no login, instant PDF." />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>
    <div style={{ backgroundColor:"#F8FAFC", minHeight:"100vh" }}>
      <style>{`@media(max-width:1023px){.mb-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .mb-grid{grid-template-columns:1fr!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#052e16 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#6EE7B7" }}><a href="/" style={{ color:"#6EE7B7", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span><a href="/documents" style={{ color:"#6EE7B7", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span><span style={{ color:"#A7F3D0" }}>Medical Bill</span></nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Medical Bill Generator</h1>
          <p style={{ fontSize:14, color:"#6EE7B7", margin:0 }}>Hospital & clinic bills with patient details, medicine, consultations and procedures.</p>
        </div>
      </section>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div className="mb-grid" style={{ display:"grid", gridTemplateColumns:"1fr 500px", gap:28, alignItems:"start" }}>
          <div>
            <S title="Hospital / Clinic">
              <Field label="Hospital Name" value={hospital.name} onChange={v=>upd(setHospital)("name",v)} placeholder="City Hospital" />
              <Field label="Address" value={hospital.address} onChange={v=>upd(setHospital)("address",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Phone" value={hospital.phone} onChange={v=>upd(setHospital)("phone",v)} />
                <Field label="GSTIN" value={hospital.gstin} onChange={v=>upd(setHospital)("gstin",v)} />
                <Field label="Reg No." value={hospital.regNo} onChange={v=>upd(setHospital)("regNo",v)} />
                <Field label="Logo URL" value={data.logoUrl} onChange={v=>upd(setData)("logoUrl",v)} placeholder="https://..." />
              </div>
            </S>
            <S title="Bill Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Bill No." value={data.billNo} onChange={v=>upd(setData)("billNo",v)} />
                <Field label="Date" value={data.date} onChange={v=>upd(setData)("date",v)} type="date" />
                <Field label="Doctor Name" value={data.doctorName} onChange={v=>upd(setData)("doctorName",v)} placeholder="Dr. Sharma" />
                <Field label="Department" value={data.department} onChange={v=>upd(setData)("department",v)} placeholder="General Medicine" />
                <Field label="Admit Date" value={data.admitDate} onChange={v=>upd(setData)("admitDate",v)} type="date" />
                <Field label="Discharge Date" value={data.dischargeDate} onChange={v=>upd(setData)("dischargeDate",v)} type="date" />
              </div>
            </S>
            <S title="Patient Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Patient Name" value={patient.name} onChange={v=>upd(setPatient)("name",v)} placeholder="Rajesh Sharma" />
                <Field label="UHID / MRN" value={patient.uhid} onChange={v=>upd(setPatient)("uhid",v)} placeholder="UHID-12345" />
                <Field label="Age" value={patient.age} onChange={v=>upd(setPatient)("age",v)} placeholder="35" />
                <Field label="Gender" value={patient.gender} onChange={v=>upd(setPatient)("gender",v)} placeholder="Male" />
                <Field label="Phone" value={patient.phone} onChange={v=>upd(setPatient)("phone",v)} />
              </div>
            </S>
            <S title="Items / Services">
              {items.map((item,idx)=>(
                <div key={item.id} style={{ background:"#F8FAFC", borderRadius:12, padding:"14px 16px", marginBottom:10, border:"1px solid #E2E8F0", position:"relative" }}>
                  {items.length>1&&<button onClick={()=>setItems(p=>p.filter(i=>i.id!==item.id))} style={{ position:"absolute", top:10, right:10, background:"#FEF2F2", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:"#DC2626", fontSize:14 }}>×</button>}
                  <Field label={`Item ${idx+1}`} value={item.description} onChange={v=>updItem(item.id,"description",v)} placeholder="Paracetamol 500mg x10" small />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                    <div>
                      <label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Type</label>
                      <select value={item.type} onChange={e=>updItem(item.id,"type",e.target.value)} style={{ width:"100%", height:32, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 8px", fontSize:12, color:"#0F172A", outline:"none", background:"#fff" }}>
                        {TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                    <Field label="Qty" value={item.qty} onChange={v=>updItem(item.id,"qty",Number(v))} type="number" small />
                    <Field label="Rate ₹" value={item.rate} onChange={v=>updItem(item.id,"rate",Number(v))} type="number" small />
                  </div>
                </div>
              ))}
              <button onClick={()=>setItems(p=>[...p,defaultItem()])} style={{ width:"100%", padding:10, borderRadius:10, border:"1.5px dashed #10B981", background:"#ECFDF5", color:"#059669", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Item</button>
            </S>
            <S title="Payment">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Discount (₹)" value={data.discount} onChange={v=>upd(setData)("discount",v)} type="number" placeholder="0" />
                <div>
                  <label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Payment Mode</label>
                  <select value={data.paymentMode} onChange={e=>upd(setData)("paymentMode",e.target.value)} style={{ width:"100%", height:38, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 10px", fontSize:13, color:"#0F172A", outline:"none", background:"#fff" }}>
                    {["Cash","Card","UPI","Insurance","Cheque"].map(m=><option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
              </div>
            </S>
          </div>
          <div className="mb-prev" style={{ position:"sticky", top:88 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#64748B", margin:0 }}>Live Preview</p>
              <button onClick={handlePDF} disabled={downloading} style={{ background:"linear-gradient(135deg,#10B981,#059669)", border:"none", borderRadius:8, padding:"6px 16px", color:"#fff", fontSize:13, fontWeight:600, cursor:downloading?"wait":"pointer" }}>{downloading?"Saving…":"Save PDF"}</button>
            </div>
            <div className="preview-scale-wrap" style={{ transform:"scale(0.68)", transformOrigin:"top left", width:"147%", marginBottom:"-32%" }}>
              <div ref={previewRef}><MedicalPreview data={data} hospital={hospital} patient={patient} items={items} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
