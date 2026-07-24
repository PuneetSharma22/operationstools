import { Helmet } from 'react-helmet-async';
import { useState, useRef } from "react";
import { supabase } from "../../supabase";

function Field({ label, value, onChange, placeholder, type="text", small }) {
  return (
    <div style={{ marginBottom:small?8:12 }}>
      {label&&<label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder} onChange={e=>onChange&&onChange(e.target.value)}
        style={{ width:"100%", height:small?32:38, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 10px", fontSize:13, color:"#0F172A", outline:"none", boxSizing:"border-box", background:"#fff" }}
        onFocus={e=>e.target.style.borderColor="#7C3AED"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
    </div>
  );
}

const EXPENSE_CATS = ["Flight","Train","Bus","Taxi/Auto","Hotel","Meals","Client Entertainment","Internet/Comm","Visa/Documents","Incidentals","Other"];
const defaultExpense = () => ({ id:Date.now()+Math.random(), date:new Date().toISOString().split("T")[0], category:"Flight", description:"", amount:0, billNo:"", paymentMode:"Company Card" });
const defaultDay = () => ({ id:Date.now()+Math.random(), date:new Date().toISOString().split("T")[0], location:"", expenses:[defaultExpense()] });

function TravelPreview({ mode, trip, traveller, singleExpenses, days }) {
  const allExpenses = mode==="single" ? singleExpenses : days.flatMap(d=>d.expenses.map(e=>({...e,_day:d})));
  const total = allExpenses.reduce((s,e)=>s+Number(e.amount||0),0);
  const byCat = allExpenses.reduce((acc,e)=>{ acc[e.category]=(acc[e.category]||0)+Number(e.amount||0); return acc; },{});

  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:11, color:"#1a1a1a", padding:"28px 32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, paddingBottom:16, borderBottom:"2px solid #7C3AED" }}>
        <div>
          <div style={{ fontSize:18, fontWeight:900, color:"#7C3AED" }}>TRAVEL EXPENSE REPORT</div>
          <div style={{ fontSize:11, color:"#475569", marginTop:3 }}>{mode==="multi"?"Multi-Day Itinerary":"Single Trip Report"}</div>
        </div>
        <div style={{ textAlign:"right", fontSize:11 }}>
          <div><span style={{ color:"#64748B" }}>Report No: </span><strong>{trip.reportNo||"—"}</strong></div>
          <div style={{ marginTop:3 }}><span style={{ color:"#64748B" }}>Date: </span><strong>{trip.travelDate?new Date(trip.travelDate+"T00:00:00").toLocaleDateString("en-IN"):"—"}</strong></div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        <div style={{ background:"#F5F3FF", borderRadius:8, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:"#7C3AED", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>Traveller</div>
          <div style={{ fontWeight:700, fontSize:12 }}>{traveller.name||"—"}</div>
          <div style={{ fontSize:10, color:"#475569", lineHeight:1.7 }}>
            {traveller.department&&<div>{traveller.department}</div>}
            {traveller.empId&&<div>ID: {traveller.empId}</div>}
          </div>
        </div>
        <div style={{ background:"#F5F3FF", borderRadius:8, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:"#7C3AED", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>Trip Details</div>
          <div style={{ fontWeight:700, fontSize:12 }}>{trip.purpose||"—"}</div>
          <div style={{ fontSize:10, color:"#475569", lineHeight:1.7 }}>
            {trip.destination&&<div>To: {trip.destination}</div>}
            {trip.travelDate&&trip.returnDate&&<div>{new Date(trip.travelDate+"T00:00:00").toLocaleDateString("en-IN")} → {new Date(trip.returnDate+"T00:00:00").toLocaleDateString("en-IN")}</div>}
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
        {[["Total Expenses",`₹${total.toFixed(2)}`,"#7C3AED"],["No. of Items",allExpenses.length,"#0F172A"],mode==="multi"?["Days",days.length,"#0F172A"]:["Trip Days",trip.travelDate&&trip.returnDate?Math.ceil((new Date(trip.returnDate)-new Date(trip.travelDate))/(1000*60*60*24))+1:"—","#0F172A"]].map(([l,v,c])=>(
          <div key={l} style={{ background:"#F5F3FF", borderRadius:8, padding:"10px 12px", textAlign:"center" }}>
            <div style={{ fontSize:18, fontWeight:800, color:c }}>{v}</div>
            <div style={{ fontSize:10, color:"#64748B", marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {mode==="multi" ? (
        days.map((day,di)=>(
          <div key={day.id} style={{ marginBottom:16 }}>
            <div style={{ background:"#7C3AED", color:"#fff", padding:"6px 10px", borderRadius:"6px 6px 0 0", fontSize:10, fontWeight:700 }}>
              Day {di+1} — {day.date?new Date(day.date+"T00:00:00").toLocaleDateString("en-IN"):"—"}{day.location?` · ${day.location}`:""}
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:"#EDE9FE" }}>
                {["Category","Description","Bill No.","Payment","Amount (₹)"].map(h=><th key={h} style={{ padding:"5px 8px", fontSize:9, fontWeight:700, textAlign:h==="Description"?"left":"right", color:"#5B21B6" }}>{h}</th>)}
              </tr></thead>
              <tbody>{day.expenses.map((e,i)=>(
                <tr key={e.id} style={{ borderBottom:"1px solid #F1F5F9", background:i%2===0?"#fff":"#FAFAFA" }}>
                  <td style={{ padding:"6px 8px", textAlign:"right" }}><span style={{ background:"#EDE9FE", color:"#5B21B6", fontSize:9, fontWeight:600, padding:"1px 6px", borderRadius:999 }}>{e.category}</span></td>
                  <td style={{ padding:"6px 8px" }}>{e.description||"—"}</td>
                  <td style={{ padding:"6px 8px", textAlign:"right", fontSize:10 }}>{e.billNo||"—"}</td>
                  <td style={{ padding:"6px 8px", textAlign:"right", fontSize:10 }}>{e.paymentMode}</td>
                  <td style={{ padding:"6px 8px", textAlign:"right", fontWeight:700 }}>₹{Number(e.amount||0).toFixed(2)}</td>
                </tr>
              ))}</tbody>
              <tfoot><tr style={{ background:"#EDE9FE" }}>
                <td colSpan="4" style={{ padding:"6px 8px", fontSize:10, fontWeight:700, color:"#5B21B6" }}>Day Total</td>
                <td style={{ padding:"6px 8px", textAlign:"right", fontWeight:900, color:"#5B21B6" }}>₹{day.expenses.reduce((s,e)=>s+Number(e.amount||0),0).toFixed(2)}</td>
              </tr></tfoot>
            </table>
          </div>
        ))
      ) : (
        <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:14 }}>
          <thead><tr style={{ background:"#7C3AED", color:"#fff" }}>
            {["Date","Category","Description","Bill No.","Payment","Amount (₹)"].map(h=><th key={h} style={{ padding:"7px 8px", fontSize:9, fontWeight:700, textAlign:h==="Description"?"left":"right" }}>{h}</th>)}
          </tr></thead>
          <tbody>{singleExpenses.map((e,i)=>(
            <tr key={e.id} style={{ borderBottom:"1px solid #E2E8F0", background:i%2===0?"#fff":"#F5F3FF" }}>
              <td style={{ padding:"7px 8px", textAlign:"right", fontSize:10 }}>{e.date?new Date(e.date+"T00:00:00").toLocaleDateString("en-IN"):"—"}</td>
              <td style={{ padding:"7px 8px", textAlign:"right" }}><span style={{ background:"#EDE9FE", color:"#5B21B6", fontSize:9, fontWeight:600, padding:"1px 6px", borderRadius:999 }}>{e.category}</span></td>
              <td style={{ padding:"7px 8px" }}>{e.description||"—"}</td>
              <td style={{ padding:"7px 8px", textAlign:"right", fontSize:10 }}>{e.billNo||"—"}</td>
              <td style={{ padding:"7px 8px", textAlign:"right", fontSize:10 }}>{e.paymentMode}</td>
              <td style={{ padding:"7px 8px", textAlign:"right", fontWeight:700 }}>₹{Number(e.amount||0).toFixed(2)}</td>
            </tr>
          ))}</tbody>
        </table>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        <div style={{ border:"1px solid #E2E8F0", borderRadius:8, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:"#7C3AED", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>By Category</div>
          {Object.entries(byCat).map(([c,v])=>(
            <div key={c} style={{ display:"flex", justifyContent:"space-between", fontSize:10, marginBottom:4 }}><span style={{ color:"#475569" }}>{c}</span><span style={{ fontWeight:600 }}>₹{v.toFixed(2)}</span></div>
          ))}
        </div>
        <div style={{ background:"#F5F3FF", border:"1px solid #DDD6FE", borderRadius:8, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:"#7C3AED", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Reimbursement Summary</div>
          <div style={{ fontSize:22, fontWeight:900, color:"#7C3AED" }}>₹{total.toFixed(2)}</div>
          {trip.advanceAmount&&Number(trip.advanceAmount)>0&&(
            <>
              <div style={{ fontSize:10, color:"#475569", marginTop:6 }}>Advance Paid: ₹{Number(trip.advanceAmount).toFixed(2)}</div>
              <div style={{ fontSize:12, fontWeight:700, color:(total-Number(trip.advanceAmount))>=0?"#DC2626":"#059669", marginTop:4 }}>
                {(total-Number(trip.advanceAmount))>=0?`Balance Due: ₹${(total-Number(trip.advanceAmount)).toFixed(2)}`:`Refund: ₹${(Number(trip.advanceAmount)-total).toFixed(2)}`}
              </div>
            </>
          )}
        </div>
      </div>

      {trip.notes&&<div style={{ border:"1px solid #E2E8F0", borderRadius:8, padding:"10px 12px", fontSize:10, color:"#475569", marginBottom:12 }}><strong style={{ color:"#7C3AED" }}>Notes: </strong>{trip.notes}</div>}

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

export default function TravelExpensePage() {
  const [mode, setMode] = useState("single");
  const [trip, setTrip] = useState({ reportNo:`TRVL-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`, travelDate:"", returnDate:"", destination:"", purpose:"", advanceAmount:"", notes:"" });
  const [traveller, setTraveller] = useState({ name:"", empId:"", department:"" });
  const [singleExpenses, setSingleExpenses] = useState([defaultExpense()]);
  const [days, setDays] = useState([defaultDay()]);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);

  const upd=setter=>(k,v)=>setter(p=>({...p,[k]:v}));
  const updExp=(id,k,v)=>setSingleExpenses(p=>p.map(e=>e.id===id?{...e,[k]:v}:e));
  const updDayExp=(dayId,expId,k,v)=>setDays(p=>p.map(d=>d.id===dayId?{...d,expenses:d.expenses.map(e=>e.id===expId?{...e,[k]:v}:e)}:d));
  const updDay=(id,k,v)=>setDays(p=>p.map(d=>d.id===id?{...d,[k]:v}:d));

  const total = mode==="single"
    ? singleExpenses.reduce((s,e)=>s+Number(e.amount||0),0)
    : days.flatMap(d=>d.expenses).reduce((s,e)=>s+Number(e.amount||0),0);

  const handlePDF = async () => {
    if (!previewRef.current||downloading) return;
    setDownloading(true);
    try {
      try { await supabase.from("save_requests").insert({ template:"travel-expense", print_id:`TRVL-${Date.now()}`, user_id:null, bill_data: { mode, ...trip, traveller, singleExpenses, days } }); } catch(_){}
      const { default:jsPDF } = await import("jspdf");
      const { default:html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(previewRef.current,{scale:2,useCORS:true,backgroundColor:"#ffffff"});
      const pdf = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
      const pw=pdf.internal.pageSize.getWidth(),ph=pdf.internal.pageSize.getHeight();
      const s=Math.min(pw/(canvas.width*25.4/(96*2)),ph/(canvas.height*25.4/(96*2)));
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92),"JPEG",(pw-canvas.width*25.4/(96*2)*s)/2,0,canvas.width*25.4/(96*2)*s,canvas.height*25.4/(96*2)*s);
      pdf.save(`travel-expense-${trip.reportNo}.pdf`);
    } catch(e){
      const isTainted = /tainted|cross-origin|SecurityError/i.test(e?.message || e?.name || "");
      alert(isTainted
        ? "PDF failed: the logo image doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again."
        : "PDF failed: " + (e?.message || "Unknown error"));
    }
    finally{setDownloading(false);}
  };

  const S=({title,children})=>(<div style={{ background:"#fff", borderRadius:16, border:"1px solid #E2E8F0", padding:"20px 24px", marginBottom:16 }}><h2 style={{ fontSize:13, fontWeight:700, color:"#7C3AED", margin:"0 0 16px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</h2>{children}</div>);

  const ExpenseRow = ({ e, onUpdate, onRemove, showDate=true }) => (
    <div style={{ background:"#F8FAFC", borderRadius:12, padding:"12px 14px", marginBottom:10, border:"1px solid #E2E8F0", position:"relative" }}>
      <button onClick={onRemove} style={{ position:"absolute", top:8, right:8, background:"#FEF2F2", border:"none", borderRadius:6, width:22, height:22, cursor:"pointer", color:"#DC2626", fontSize:13 }}>×</button>
      <div style={{ display:"grid", gridTemplateColumns:showDate?"1fr 1fr":"1fr", gap:8, marginBottom:6 }}>
        {showDate&&<Field label="Date" value={e.date} onChange={v=>onUpdate("date",v)} type="date" small />}
        <div>
          <label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Category</label>
          <select value={e.category} onChange={ev=>onUpdate("category",ev.target.value)} style={{ width:"100%", height:32, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 8px", fontSize:12, outline:"none", background:"#fff" }}>
            {EXPENSE_CATS.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <Field label="Description" value={e.description} onChange={v=>onUpdate("description",v)} placeholder="Flight BOM-DEL, Hotel name etc." small />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
        <Field label="Bill/Receipt No." value={e.billNo} onChange={v=>onUpdate("billNo",v)} small />
        <div>
          <label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Payment</label>
          <select value={e.paymentMode} onChange={ev=>onUpdate("paymentMode",ev.target.value)} style={{ width:"100%", height:32, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 8px", fontSize:12, outline:"none", background:"#fff" }}>
            {["Company Card","Personal Card","Cash","UPI","Net Banking"].map(m=><option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <Field label="Amount ₹" value={e.amount} onChange={v=>onUpdate("amount",v)} type="number" small />
      </div>
    </div>
  );

  return (
    <>
      <Helmet>
        <title>Free Travel Expense Report — Single Trip and Multi-Day | OpsTools</title>
        <meta name="description" content="Generate travel expense reports with flights, hotel, meals and per-day breakdown. Free, no login, instant PDF." />
        <meta property="og:title" content="Free Travel Expense Report — Single Trip and Multi-Day | OpsTools" />
        <meta property="og:description" content="Generate travel expense reports with flights, hotel, meals and per-day breakdown. Free, no login, instant PDF." />
        <meta property="og:url" content="https://www.opstools.ai/documents/travel-expense" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Travel Expense Report — Single Trip and Multi-Day | OpsTools" />
        <meta name="twitter:description" content="Generate travel expense reports with flights, hotel, meals and per-day breakdown. Free, no login, instant PDF." />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>
    <div style={{ backgroundColor:"#F8FAFC", minHeight:"100vh" }}>
      <style>{`@media(max-width:1023px){.te-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .te-grid{grid-template-columns:1fr!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#2e1065 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#C4B5FD" }}><a href="/" style={{ color:"#C4B5FD", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span><a href="/documents" style={{ color:"#C4B5FD", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span><span style={{ color:"#DDD6FE" }}>Travel Expense Report</span></nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Travel Expense Report</h1>
          <p style={{ fontSize:14, color:"#C4B5FD", margin:0 }}>Single trip or multi-day itinerary — flights, hotels, meals, and more.</p>
        </div>
      </section>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div style={{ display:"flex", gap:8, marginBottom:24 }}>
          {[{key:"single",label:"✈️ Single Trip"},{key:"multi",label:"📅 Multi-Day Itinerary"}].map(opt=>(
            <button key={opt.key} onClick={()=>setMode(opt.key)} style={{ padding:"10px 20px", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer", border:mode===opt.key?"1.5px solid #7C3AED":"1.5px solid #E2E8F0", background:mode===opt.key?"#F5F3FF":"#fff", color:mode===opt.key?"#7C3AED":"#64748B" }}>{opt.label}</button>
          ))}
        </div>

        <div className="te-grid" style={{ display:"grid", gridTemplateColumns:"1fr 500px", gap:28, alignItems:"start" }}>
          <div>
            <S title="Trip Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Report No." value={trip.reportNo} onChange={v=>upd(setTrip)("reportNo",v)} />
                <Field label="Purpose of Travel" value={trip.purpose} onChange={v=>upd(setTrip)("purpose",v)} placeholder="Client meeting / Conference" />
                <Field label="Travel Date" value={trip.travelDate} onChange={v=>upd(setTrip)("travelDate",v)} type="date" />
                <Field label="Return Date" value={trip.returnDate} onChange={v=>upd(setTrip)("returnDate",v)} type="date" />
                <Field label="Destination" value={trip.destination} onChange={v=>upd(setTrip)("destination",v)} placeholder="Mumbai → Delhi" />
                <Field label="Advance Amount ₹" value={trip.advanceAmount} onChange={v=>upd(setTrip)("advanceAmount",v)} type="number" placeholder="0" />
              </div>
              <Field label="Notes" value={trip.notes} onChange={v=>upd(setTrip)("notes",v)} placeholder="Business purpose, client name etc." />
            </S>

            <S title="Traveller Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Name" value={traveller.name} onChange={v=>upd(setTraveller)("name",v)} placeholder="Rajesh Sharma" />
                <Field label="Employee ID" value={traveller.empId} onChange={v=>upd(setTraveller)("empId",v)} placeholder="EMP-001" />
                <Field label="Department" value={traveller.department} onChange={v=>upd(setTraveller)("department",v)} placeholder="Sales" />
              </div>
            </S>

            {mode==="single" ? (
              <S title="Expenses">
                {singleExpenses.map(e=>(
                  <ExpenseRow key={e.id} e={e}
                    onUpdate={(k,v)=>updExp(e.id,k,v)}
                    onRemove={()=>singleExpenses.length>1&&setSingleExpenses(p=>p.filter(i=>i.id!==e.id))}
                    showDate={true}
                  />
                ))}
                <button onClick={()=>setSingleExpenses(p=>[...p,defaultExpense()])} style={{ width:"100%", padding:10, borderRadius:10, border:"1.5px dashed #7C3AED", background:"#F5F3FF", color:"#5B21B6", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Expense</button>
                <div style={{ background:"#7C3AED", color:"#fff", borderRadius:10, padding:"12px 16px", marginTop:12, display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:14, fontWeight:700 }}>Total</span>
                  <span style={{ fontSize:18, fontWeight:900 }}>₹{total.toFixed(2)}</span>
                </div>
                {trip.advanceAmount&&Number(trip.advanceAmount)>0&&(
                  <div style={{ background:(total-Number(trip.advanceAmount))>=0?"#FEF2F2":"#F0FDF4", borderRadius:10, padding:"10px 16px", marginTop:8, display:"flex", justifyContent:"space-between" }}>
                    <span style={{ fontSize:13, fontWeight:600, color:(total-Number(trip.advanceAmount))>=0?"#DC2626":"#059669" }}>
                      {(total-Number(trip.advanceAmount))>=0?"Balance Due":"Refund"}
                    </span>
                    <span style={{ fontSize:15, fontWeight:800, color:(total-Number(trip.advanceAmount))>=0?"#DC2626":"#059669" }}>
                      ₹{Math.abs(total-Number(trip.advanceAmount)).toFixed(2)}
                    </span>
                  </div>
                )}
              </S>
            ) : (
              <S title="Day-wise Itinerary">
                {days.map((day,di)=>(
                  <div key={day.id} style={{ border:"1px solid #DDD6FE", borderRadius:14, padding:"16px", marginBottom:16, background:"#FAFAFA" }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <span style={{ background:"#7C3AED", color:"#fff", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:999 }}>Day {di+1}</span>
                        <div style={{ display:"grid", gridTemplateColumns:"140px 1fr", gap:8 }}>
                          <input type="date" value={day.date} onChange={e=>updDay(day.id,"date",e.target.value)} style={{ height:30, border:"1.5px solid #E2E8F0", borderRadius:7, padding:"0 8px", fontSize:12, outline:"none" }} />
                          <input value={day.location} onChange={e=>updDay(day.id,"location",e.target.value)} placeholder="City / Location" style={{ height:30, border:"1.5px solid #E2E8F0", borderRadius:7, padding:"0 8px", fontSize:12, outline:"none" }} />
                        </div>
                      </div>
                      {days.length>1&&<button onClick={()=>setDays(p=>p.filter(d=>d.id!==day.id))} style={{ background:"#FEF2F2", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:"#DC2626", fontSize:13 }}>×</button>}
                    </div>
                    {day.expenses.map(e=>(
                      <ExpenseRow key={e.id} e={e}
                        onUpdate={(k,v)=>updDayExp(day.id,e.id,k,v)}
                        onRemove={()=>day.expenses.length>1&&setDays(p=>p.map(d=>d.id===day.id?{...d,expenses:d.expenses.filter(i=>i.id!==e.id)}:d))}
                        showDate={false}
                      />
                    ))}
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <button onClick={()=>setDays(p=>p.map(d=>d.id===day.id?{...d,expenses:[...d.expenses,defaultExpense()]}:d))} style={{ padding:"7px 14px", borderRadius:8, border:"1.5px dashed #7C3AED", background:"#F5F3FF", color:"#5B21B6", fontSize:12, fontWeight:600, cursor:"pointer" }}>+ Add Expense</button>
                      <div style={{ fontSize:13, fontWeight:700, color:"#7C3AED" }}>Day total: ₹{day.expenses.reduce((s,e)=>s+Number(e.amount||0),0).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
                <button onClick={()=>setDays(p=>[...p,defaultDay()])} style={{ width:"100%", padding:10, borderRadius:10, border:"1.5px dashed #7C3AED", background:"#F5F3FF", color:"#5B21B6", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Day</button>
                <div style={{ background:"#7C3AED", color:"#fff", borderRadius:10, padding:"12px 16px", marginTop:12, display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:14, fontWeight:700 }}>Grand Total</span>
                  <span style={{ fontSize:18, fontWeight:900 }}>₹{total.toFixed(2)}</span>
                </div>
              </S>
            )}
          </div>

          <div className="te-prev" style={{ position:"sticky", top:88 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#64748B", margin:0 }}>Live Preview</p>
              <button onClick={handlePDF} disabled={downloading} style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)", border:"none", borderRadius:8, padding:"6px 16px", color:"#fff", fontSize:13, fontWeight:600, cursor:downloading?"wait":"pointer" }}>{downloading?"Saving…":"Save PDF"}</button>
            </div>
            <div className="preview-scale-wrap" style={{ transform:"scale(0.68)", transformOrigin:"top left", width:"147%", marginBottom:"-32%" }}>
              <div ref={previewRef}><TravelPreview mode={mode} trip={trip} traveller={traveller} singleExpenses={singleExpenses} days={days} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
