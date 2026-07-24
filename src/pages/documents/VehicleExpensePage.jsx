import { Helmet } from 'react-helmet-async';
import { useState, useRef } from "react";
import { supabase } from "../../supabase";

function Field({ label, value, onChange, placeholder, type="text", small }) {
  return (
    <div style={{ marginBottom:small?8:12 }}>
      {label&&<label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder} onChange={e=>onChange&&onChange(e.target.value)}
        style={{ width:"100%", height:small?32:38, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 10px", fontSize:13, color:"#0F172A", outline:"none", boxSizing:"border-box", background:"#fff" }}
        onFocus={e=>e.target.style.borderColor="#0284C7"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
    </div>
  );
}

const EXPENSE_TYPES = ["Fuel","Toll","Parking","Maintenance","Repair","Tyre","Oil Change","Insurance","Other"];
const defaultEntry = () => ({ id:Date.now()+Math.random(), date:new Date().toISOString().split("T")[0], type:"Fuel", description:"", odometerStart:"", odometerEnd:"", amount:0, receipt:"", vehicle:"" });

function VehiclePreview({ mode, report, employee, entries, vehicles }) {
  const total = entries.reduce((s,e)=>s+Number(e.amount||0),0);
  const byType = entries.reduce((acc,e)=>{ acc[e.type]=(acc[e.type]||0)+Number(e.amount||0); return acc; },{});
  const byVehicle = entries.reduce((acc,e)=>{ const v=e.vehicle||"—"; acc[v]=(acc[v]||0)+Number(e.amount||0); return acc; },{});
  const totalKm = entries.reduce((s,e)=>{
    if(e.odometerStart&&e.odometerEnd) return s+(Number(e.odometerEnd)-Number(e.odometerStart));
    return s;
  },0);

  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:11, color:"#1a1a1a", padding:"28px 32px" }}>
      {/* Header */}
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, paddingBottom:16, borderBottom:"2px solid #0284C7" }}>
        <div>
          <div style={{ fontSize:18, fontWeight:900, color:"#0284C7" }}>VEHICLE EXPENSE REPORT</div>
          <div style={{ fontSize:11, color:"#475569", marginTop:3 }}>{mode==="fleet"?"Fleet Management Report":"Employee Reimbursement Report"}</div>
        </div>
        <div style={{ textAlign:"right", fontSize:11 }}>
          <div><span style={{ color:"#64748B" }}>Report No: </span><strong>{report.reportNo||"—"}</strong></div>
          <div style={{ marginTop:3 }}><span style={{ color:"#64748B" }}>Period: </span><strong>{report.periodFrom&&report.periodTo?`${new Date(report.periodFrom+"T00:00:00").toLocaleDateString("en-IN")} – ${new Date(report.periodTo+"T00:00:00").toLocaleDateString("en-IN")}`:report.periodFrom?new Date(report.periodFrom+"T00:00:00").toLocaleDateString("en-IN"):"—"}</strong></div>
        </div>
      </div>

      {/* Employee/Fleet info */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        {mode==="employee" ? (
          <>
            <div style={{ background:"#F0F9FF", borderRadius:8, padding:"10px 12px" }}>
              <div style={{ fontSize:9, fontWeight:700, color:"#0284C7", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>Employee Details</div>
              <div style={{ fontWeight:700, fontSize:12 }}>{employee.name||"—"}</div>
              <div style={{ fontSize:10, color:"#475569", lineHeight:1.7 }}>
                {employee.department&&<div>{employee.department}</div>}
                {employee.designation&&<div>{employee.designation}</div>}
                {employee.empId&&<div>ID: {employee.empId}</div>}
              </div>
            </div>
            <div style={{ background:"#F0F9FF", borderRadius:8, padding:"10px 12px" }}>
              <div style={{ fontSize:9, fontWeight:700, color:"#0284C7", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>Vehicle Details</div>
              <div style={{ fontWeight:700, fontSize:12 }}>{vehicles[0]?.regNo||"—"}</div>
              <div style={{ fontSize:10, color:"#475569", lineHeight:1.7 }}>
                {vehicles[0]?.make&&<div>{vehicles[0].make} {vehicles[0].model}</div>}
                {vehicles[0]?.fuelType&&<div>Fuel: {vehicles[0].fuelType}</div>}
              </div>
            </div>
          </>
        ) : (
          <div style={{ background:"#F0F9FF", borderRadius:8, padding:"10px 12px", gridColumn:"1/-1" }}>
            <div style={{ fontSize:9, fontWeight:700, color:"#0284C7", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>Fleet Summary — {vehicles.length} Vehicle(s)</div>
            <div style={{ display:"flex", gap:16, flexWrap:"wrap" }}>
              {vehicles.filter(v=>v.regNo).map(v=>(
                <div key={v.id} style={{ fontSize:10, color:"#0F172A" }}>
                  <strong>{v.regNo}</strong>{v.make?` (${v.make} ${v.model||""})`:""}: <strong>₹{(byVehicle[v.regNo]||0).toFixed(2)}</strong>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Summary cards */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
        {[["Total Expenses",`₹${total.toFixed(2)}`,"#0284C7"],["Total Distance",totalKm>0?`${totalKm} km`:"—","#0F172A"],["Entries",entries.length,"#0F172A"]].map(([l,v,c])=>(
          <div key={l} style={{ background:"#F0F9FF", borderRadius:8, padding:"10px 12px", textAlign:"center" }}>
            <div style={{ fontSize:18, fontWeight:800, color:c }}>{v}</div>
            <div style={{ fontSize:10, color:"#64748B", marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {/* Entries table */}
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:14 }}>
        <thead><tr style={{ background:"#0284C7", color:"#fff" }}>
          {["Date","Type","Description",mode==="fleet"?"Vehicle":"Odometer","Amount (₹)"].map(h=>(
            <th key={h} style={{ padding:"7px 8px", fontSize:9, fontWeight:700, textAlign:h==="Description"?"left":"right" }}>{h}</th>
          ))}
        </tr></thead>
        <tbody>{entries.map((e,i)=>(
          <tr key={e.id} style={{ borderBottom:"1px solid #E2E8F0", background:i%2===0?"#fff":"#F0F9FF" }}>
            <td style={{ padding:"7px 8px", textAlign:"right", fontSize:10 }}>{e.date?new Date(e.date+"T00:00:00").toLocaleDateString("en-IN"):"—"}</td>
            <td style={{ padding:"7px 8px", textAlign:"right" }}><span style={{ background:"#DBEAFE", color:"#1D4ED8", fontSize:9, fontWeight:600, padding:"1px 6px", borderRadius:999 }}>{e.type}</span></td>
            <td style={{ padding:"7px 8px" }}>{e.description||"—"}</td>
            <td style={{ padding:"7px 8px", textAlign:"right", fontSize:10 }}>
              {mode==="fleet"?(e.vehicle||"—"):(e.odometerStart&&e.odometerEnd?`${e.odometerStart}→${e.odometerEnd} (${Number(e.odometerEnd)-Number(e.odometerStart)} km)`:"—")}
            </td>
            <td style={{ padding:"7px 8px", textAlign:"right", fontWeight:700, fontSize:11 }}>₹{Number(e.amount||0).toFixed(2)}</td>
          </tr>
        ))}</tbody>
      </table>

      {/* By type breakdown */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:14 }}>
        <div style={{ border:"1px solid #E2E8F0", borderRadius:8, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:"#0284C7", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>By Expense Type</div>
          {Object.entries(byType).map(([t,v])=>(
            <div key={t} style={{ display:"flex", justifyContent:"space-between", fontSize:10, marginBottom:4 }}>
              <span style={{ color:"#475569" }}>{t}</span><span style={{ fontWeight:600 }}>₹{v.toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div style={{ border:"1px solid #BAE6FD", borderRadius:8, padding:"10px 12px", background:"#F0F9FF" }}>
          <div style={{ fontSize:9, fontWeight:700, color:"#0284C7", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Total Reimbursable</div>
          <div style={{ fontSize:22, fontWeight:900, color:"#0284C7" }}>₹{total.toFixed(2)}</div>
          {report.approverName&&<div style={{ fontSize:10, color:"#475569", marginTop:6 }}>Approver: {report.approverName}</div>}
        </div>
      </div>

      {report.notes&&<div style={{ border:"1px solid #E2E8F0", borderRadius:8, padding:"10px 12px", fontSize:10, color:"#475569", marginBottom:12 }}><strong style={{ color:"#0284C7" }}>Notes: </strong>{report.notes}</div>}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20, marginTop:16 }}>
        {["Employee Signature","Approver Signature"].map(l=>(
          <div key={l} style={{ textAlign:"center" }}>
            <div style={{ height:36, borderBottom:"1px solid #CBD5E1", marginBottom:4 }}/>
            <div style={{ fontSize:9, color:"#94A3B8" }}>{l}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function VehicleExpensePage() {
  const [mode, setMode] = useState("employee");
  const [report, setReport] = useState({ reportNo:`VEH-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`, periodFrom:"", periodTo:"", approverName:"", notes:"" });
  const [employee, setEmployee] = useState({ name:"", empId:"", department:"", designation:"" });
  const [vehicles, setVehicles] = useState([{ id:1, regNo:"", make:"", model:"", fuelType:"Petrol" }]);
  const [entries, setEntries] = useState([defaultEntry()]);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);

  const upd=setter=>(k,v)=>setter(p=>({...p,[k]:v}));
  const updEntry=(id,k,v)=>setEntries(p=>p.map(e=>e.id===id?{...e,[k]:v}:e));
  const updVehicle=(id,k,v)=>setVehicles(p=>p.map(v2=>v2.id===id?{...v2,[k]:v}:v2));

  const handlePDF = async () => {
    if (!previewRef.current||downloading) return;
    setDownloading(true);
    try {
      try { await supabase.from("save_requests").insert({ template:"vehicle-expense", print_id:`VEH-${Date.now()}`, user_id:null, bill_data: { mode, ...report, employee, vehicles, entries } }); } catch(_){}
      const { default:jsPDF } = await import("jspdf");
      const { default:html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(previewRef.current,{scale:2,useCORS:true,backgroundColor:"#ffffff"});
      const pdf = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
      const pw=pdf.internal.pageSize.getWidth(),ph=pdf.internal.pageSize.getHeight();
      const s=Math.min(pw/(canvas.width*25.4/(96*2)),ph/(canvas.height*25.4/(96*2)));
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92),"JPEG",(pw-canvas.width*25.4/(96*2)*s)/2,0,canvas.width*25.4/(96*2)*s,canvas.height*25.4/(96*2)*s);
      pdf.save(`vehicle-expense-${report.reportNo}.pdf`);
    } catch(e){
      const isTainted = /tainted|cross-origin|SecurityError/i.test(e?.message || e?.name || "");
      alert(isTainted
        ? "PDF failed: the logo image doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again."
        : "PDF failed: " + (e?.message || "Unknown error"));
    }
    finally{setDownloading(false);}
  };

  const S=({title,children,accent="#0284C7"})=>(<div style={{ background:"#fff", borderRadius:16, border:"1px solid #E2E8F0", padding:"20px 24px", marginBottom:16 }}><h2 style={{ fontSize:13, fontWeight:700, color:accent, margin:"0 0 16px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</h2>{children}</div>);

  return (
    <>
      <Helmet>
        <title>Free Vehicle Expense Report — Fleet and Employee Reimbursement | OpsTools</title>
        <meta name="description" content="Generate vehicle expense reports for employee reimbursement or fleet management. Free, no login, instant PDF." />
        <meta property="og:title" content="Free Vehicle Expense Report — Fleet and Employee Reimbursement | OpsTools" />
        <meta property="og:description" content="Generate vehicle expense reports for employee reimbursement or fleet management. Free, no login, instant PDF." />
        <meta property="og:url" content="https://www.opstools.ai/documents/vehicle-expense" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Vehicle Expense Report — Fleet and Employee Reimbursement | OpsTools" />
        <meta name="twitter:description" content="Generate vehicle expense reports for employee reimbursement or fleet management. Free, no login, instant PDF." />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>
    <div style={{ backgroundColor:"#F8FAFC", minHeight:"100vh" }}>
      <style>{`@media(max-width:1023px){.ve-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .ve-grid{grid-template-columns:1fr!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#0c2340 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#7DD3FC" }}><a href="/" style={{ color:"#7DD3FC", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span><a href="/documents" style={{ color:"#7DD3FC", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span><span style={{ color:"#BAE6FD" }}>Vehicle Expense Report</span></nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Vehicle Expense Report</h1>
          <p style={{ fontSize:14, color:"#7DD3FC", margin:0 }}>Employee reimbursement or fleet management — fuel, tolls, maintenance and more.</p>
        </div>
      </section>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        {/* Mode toggle */}
        <div style={{ display:"flex", gap:8, marginBottom:24 }}>
          {[{key:"employee",label:"👤 Employee Reimbursement"},{key:"fleet",label:"🚗 Fleet Management"}].map(opt=>(
            <button key={opt.key} onClick={()=>setMode(opt.key)} style={{ padding:"10px 20px", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer", border:mode===opt.key?"1.5px solid #0284C7":"1.5px solid #E2E8F0", background:mode===opt.key?"#F0F9FF":"#fff", color:mode===opt.key?"#0284C7":"#64748B" }}>{opt.label}</button>
          ))}
        </div>

        <div className="ve-grid" style={{ display:"grid", gridTemplateColumns:"1fr 500px", gap:28, alignItems:"start" }}>
          <div>
            <S title="Report Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Report No." value={report.reportNo} onChange={v=>upd(setReport)("reportNo",v)} />
                <Field label="Period From" value={report.periodFrom} onChange={v=>upd(setReport)("periodFrom",v)} type="date" />
                <Field label="Period To" value={report.periodTo} onChange={v=>upd(setReport)("periodTo",v)} type="date" />
                <Field label="Approver Name" value={report.approverName} onChange={v=>upd(setReport)("approverName",v)} placeholder="Manager name" />
              </div>
              <Field label="Notes" value={report.notes} onChange={v=>upd(setReport)("notes",v)} placeholder="Purpose of travel or additional notes" />
            </S>

            {mode==="employee" ? (
              <S title="Employee Details">
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                  <Field label="Employee Name" value={employee.name} onChange={v=>upd(setEmployee)("name",v)} placeholder="Rajesh Sharma" />
                  <Field label="Employee ID" value={employee.empId} onChange={v=>upd(setEmployee)("empId",v)} placeholder="EMP-001" />
                  <Field label="Department" value={employee.department} onChange={v=>upd(setEmployee)("department",v)} placeholder="Sales" />
                  <Field label="Designation" value={employee.designation} onChange={v=>upd(setEmployee)("designation",v)} placeholder="Sales Manager" />
                </div>
                <div style={{ background:"#F0F9FF", borderRadius:12, padding:"14px 16px", border:"1px solid #BAE6FD" }}>
                  <div style={{ fontSize:12, fontWeight:700, color:"#0284C7", marginBottom:12 }}>Vehicle</div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    <Field label="Reg. Number" value={vehicles[0]?.regNo} onChange={v=>updVehicle(1,"regNo",v)} placeholder="MH12AB1234" small />
                    <Field label="Make" value={vehicles[0]?.make} onChange={v=>updVehicle(1,"make",v)} placeholder="Maruti" small />
                    <Field label="Model" value={vehicles[0]?.model} onChange={v=>updVehicle(1,"model",v)} placeholder="Swift" small />
                    <div>
                      <label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Fuel Type</label>
                      <select value={vehicles[0]?.fuelType} onChange={e=>updVehicle(1,"fuelType",e.target.value)} style={{ width:"100%", height:32, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 8px", fontSize:12, outline:"none", background:"#fff" }}>
                        {["Petrol","Diesel","CNG","Electric","Hybrid"].map(f=><option key={f} value={f}>{f}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
              </S>
            ) : (
              <S title="Fleet Vehicles">
                {vehicles.map((v,idx)=>(
                  <div key={v.id} style={{ background:"#F0F9FF", borderRadius:12, padding:"12px 14px", marginBottom:10, border:"1px solid #BAE6FD", position:"relative" }}>
                    {vehicles.length>1&&<button onClick={()=>setVehicles(p=>p.filter(v2=>v2.id!==v.id))} style={{ position:"absolute", top:8, right:8, background:"#FEF2F2", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:"#DC2626", fontSize:14 }}>×</button>}
                    <div style={{ fontSize:11, fontWeight:700, color:"#0284C7", marginBottom:8 }}>Vehicle {idx+1}</div>
                    <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                      <Field label="Reg. No." value={v.regNo} onChange={val=>updVehicle(v.id,"regNo",val)} placeholder="MH12AB1234" small />
                      <Field label="Make" value={v.make} onChange={val=>updVehicle(v.id,"make",val)} placeholder="Maruti" small />
                      <Field label="Model" value={v.model} onChange={val=>updVehicle(v.id,"model",val)} placeholder="Swift" small />
                    </div>
                  </div>
                ))}
                <button onClick={()=>setVehicles(p=>[...p,{id:Date.now(),regNo:"",make:"",model:"",fuelType:"Petrol"}])} style={{ width:"100%", padding:10, borderRadius:10, border:"1.5px dashed #0284C7", background:"#F0F9FF", color:"#0284C7", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Vehicle</button>
              </S>
            )}

            <S title="Expense Entries">
              {entries.map((e,idx)=>(
                <div key={e.id} style={{ background:"#F8FAFC", borderRadius:12, padding:"14px 16px", marginBottom:10, border:"1px solid #E2E8F0", position:"relative" }}>
                  {entries.length>1&&<button onClick={()=>setEntries(p=>p.filter(i=>i.id!==e.id))} style={{ position:"absolute", top:10, right:10, background:"#FEF2F2", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:"#DC2626", fontSize:14 }}>×</button>}
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8, marginBottom:8 }}>
                    <Field label="Date" value={e.date} onChange={v=>updEntry(e.id,"date",v)} type="date" small />
                    <div>
                      <label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Type</label>
                      <select value={e.type} onChange={ev=>updEntry(e.id,"type",ev.target.value)} style={{ width:"100%", height:32, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 8px", fontSize:12, outline:"none", background:"#fff" }}>
                        {EXPENSE_TYPES.map(t=><option key={t} value={t}>{t}</option>)}
                      </select>
                    </div>
                  </div>
                  <Field label="Description" value={e.description} onChange={v=>updEntry(e.id,"description",v)} placeholder="Route or purpose" small />
                  <div style={{ display:"grid", gridTemplateColumns: mode==="fleet"?"1fr 1fr":"1fr 1fr 1fr", gap:8 }}>
                    {mode==="fleet" ? (
                      <div>
                        <label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Vehicle</label>
                        <select value={e.vehicle} onChange={ev=>updEntry(e.id,"vehicle",ev.target.value)} style={{ width:"100%", height:32, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 8px", fontSize:12, outline:"none", background:"#fff" }}>
                          <option value="">Select vehicle</option>
                          {vehicles.filter(v=>v.regNo).map(v=><option key={v.id} value={v.regNo}>{v.regNo}</option>)}
                        </select>
                      </div>
                    ) : (
                      <>
                        <Field label="Odometer Start" value={e.odometerStart} onChange={v=>updEntry(e.id,"odometerStart",v)} type="number" placeholder="12000" small />
                        <Field label="Odometer End" value={e.odometerEnd} onChange={v=>updEntry(e.id,"odometerEnd",v)} type="number" placeholder="12150" small />
                      </>
                    )}
                    <Field label="Amount ₹" value={e.amount} onChange={v=>updEntry(e.id,"amount",v)} type="number" small />
                  </div>
                  {e.odometerStart&&e.odometerEnd&&mode==="employee"&&<div style={{ fontSize:11, color:"#0284C7", fontWeight:600, marginTop:4 }}>Distance: {Number(e.odometerEnd)-Number(e.odometerStart)} km</div>}
                </div>
              ))}
              <button onClick={()=>setEntries(p=>[...p,defaultEntry()])} style={{ width:"100%", padding:10, borderRadius:10, border:"1.5px dashed #0284C7", background:"#F0F9FF", color:"#0284C7", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Entry</button>
              <div style={{ background:"#0284C7", color:"#fff", borderRadius:10, padding:"12px 16px", marginTop:12, display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                <span style={{ fontSize:14, fontWeight:700 }}>Total</span>
                <span style={{ fontSize:18, fontWeight:900 }}>₹{entries.reduce((s,e)=>s+Number(e.amount||0),0).toFixed(2)}</span>
              </div>
            </S>
          </div>

          <div className="ve-prev" style={{ position:"sticky", top:88 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#64748B", margin:0 }}>Live Preview</p>
              <button onClick={handlePDF} disabled={downloading} style={{ background:"linear-gradient(135deg,#0284C7,#0369A1)", border:"none", borderRadius:8, padding:"6px 16px", color:"#fff", fontSize:13, fontWeight:600, cursor:downloading?"wait":"pointer" }}>{downloading?"Saving…":"Save PDF"}</button>
            </div>
            <div className="preview-scale-wrap" style={{ transform:"scale(0.68)", transformOrigin:"top left", width:"147%", marginBottom:"-32%" }}>
              <div ref={previewRef}><VehiclePreview mode={mode} report={report} employee={employee} entries={entries} vehicles={vehicles} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
