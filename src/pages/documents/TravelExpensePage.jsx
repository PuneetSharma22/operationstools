import { useState } from "react";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";
import SaveMenu from "../../components/common/SaveMenu";
import { exportSingleDocument } from "../../utils/documentExport";
import { logSaveRequest } from "../../utils/saveLog";
import * as content from "./travelExpenseContent";

const TAINTED_HINT = "one of the report's fields couldn't be captured due to a cross-origin image restriction. Try again, or contact support if this persists.";

// Neutral document palette — a printed report should read like a normal
// business document, not a brand-colour showcase. Brand blue is reserved for
// interactive form chrome (buttons, active tab) below, never for the report
// preview itself.
const INK = "#0F172A";
const INK_SOFT = "#475569";
const INK_MUTED = "#64748B";
const BORDER = "#E2E8F0";
const SURFACE = "#F8FAFC";
const SURFACE_ALT = "#F1F5F9";
const BRAND = "#2563EB";

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

function Section({title,children}) {
  return (
    <div style={{ background:"#fff", borderRadius:16, border:`1px solid ${BORDER}`, padding:"20px 24px", marginBottom:16 }}>
      <h2 style={{ fontSize:13, fontWeight:700, color:INK, margin:"0 0 16px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</h2>
      {children}
    </div>
  );
}

function ExpenseRow({ e, onUpdate, onRemove, showDate=true }) {
  return (
    <div style={{ background:SURFACE, borderRadius:12, padding:"12px 14px", marginBottom:10, border:`1px solid ${BORDER}`, position:"relative" }}>
      <button onClick={onRemove} style={{ position:"absolute", top:8, right:8, background:"#FEF2F2", border:"none", borderRadius:6, width:22, height:22, cursor:"pointer", color:"#DC2626", fontSize:13 }}>×</button>
      <div style={{ display:"grid", gridTemplateColumns:showDate?"1fr 1fr":"1fr", gap:8, marginBottom:6 }}>
        {showDate&&<Field label="Date" value={e.date} onChange={v=>onUpdate("date",v)} type="date" small />}
        <div>
          <label style={{ fontSize:11, fontWeight:600, color:INK_MUTED, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Category</label>
          <select value={e.category} onChange={ev=>onUpdate("category",ev.target.value)} style={{ width:"100%", height:32, border:`1.5px solid ${BORDER}`, borderRadius:8, padding:"0 8px", fontSize:12, outline:"none", background:"#fff" }}>
            {EXPENSE_CATS.map(c=><option key={c} value={c}>{c}</option>)}
          </select>
        </div>
      </div>
      <Field label="Description" value={e.description} onChange={v=>onUpdate("description",v)} placeholder="Flight BOM-DEL, Hotel name etc." small />
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
        <Field label="Bill/Receipt No." value={e.billNo} onChange={v=>onUpdate("billNo",v)} small />
        <div>
          <label style={{ fontSize:11, fontWeight:600, color:INK_MUTED, display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>Payment</label>
          <select value={e.paymentMode} onChange={ev=>onUpdate("paymentMode",ev.target.value)} style={{ width:"100%", height:32, border:`1.5px solid ${BORDER}`, borderRadius:8, padding:"0 8px", fontSize:12, outline:"none", background:"#fff" }}>
            {["Company Card","Personal Card","Cash","UPI","Net Banking"].map(m=><option key={m} value={m}>{m}</option>)}
          </select>
        </div>
        <Field label="Amount ₹" value={e.amount} onChange={v=>onUpdate("amount",v)} type="number" small />
      </div>
    </div>
  );
}

const EXPENSE_CATS = ["Flight","Train","Bus","Taxi/Auto","Hotel","Meals","Client Entertainment","Internet/Comm","Visa/Documents","Incidentals","Other"];
const defaultExpense = () => ({ id:Date.now()+Math.random(), date:new Date().toISOString().split("T")[0], category:"Flight", description:"", amount:0, billNo:"", paymentMode:"Company Card" });
const defaultDay = () => ({ id:Date.now()+Math.random(), date:new Date().toISOString().split("T")[0], location:"", expenses:[defaultExpense()] });

const daysFromNowISO = (n) => { const d=new Date(); d.setDate(d.getDate()+n); return d.toISOString().split("T")[0]; };

function BalanceBanner({ total, advanceAmount }) {
  if (!advanceAmount || Number(advanceAmount) <= 0) return null;
  const balance = total - Number(advanceAmount);
  const isDue = balance >= 0;
  return (
    <div style={{ background: isDue ? "#FEF2F2" : "#F0FDF4", borderRadius:10, padding:"10px 16px", marginTop:8, display:"flex", justifyContent:"space-between" }}>
      <span style={{ fontSize:13, fontWeight:600, color: isDue ? "#DC2626" : "#059669" }}>{isDue ? "Balance Due" : "Refund"}</span>
      <span style={{ fontSize:15, fontWeight:800, color: isDue ? "#DC2626" : "#059669" }}>₹{Math.abs(balance).toFixed(2)}</span>
    </div>
  );
}

function TravelPreview({ data }) {
  const { mode, trip, traveller, singleExpenses, days } = data;
  const allExpenses = mode==="single" ? singleExpenses : days.flatMap(d=>d.expenses);
  const total = allExpenses.reduce((s,e)=>s+Number(e.amount||0),0);
  const byCat = allExpenses.reduce((acc,e)=>{ acc[e.category]=(acc[e.category]||0)+Number(e.amount||0); return acc; },{});

  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:11, color:"#1a1a1a", padding:"28px 32px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:20, paddingBottom:16, borderBottom:`2px solid ${INK}` }}>
        <div>
          <div style={{ fontSize:18, fontWeight:900, color:INK }}>TRAVEL EXPENSE REPORT</div>
          <div style={{ fontSize:11, color:INK_SOFT, marginTop:3 }}>{mode==="multi"?"Multi-Day Itinerary":"Single Trip Report"}</div>
        </div>
        <div style={{ textAlign:"right", fontSize:11 }}>
          <div><span style={{ color:INK_MUTED }}>Report No: </span><strong>{trip.reportNo||"—"}</strong></div>
          <div style={{ marginTop:3 }}><span style={{ color:INK_MUTED }}>Date: </span><strong>{trip.travelDate?new Date(trip.travelDate+"T00:00:00").toLocaleDateString("en-IN"):"—"}</strong></div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
        <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>Traveller</div>
          <div style={{ fontWeight:700, fontSize:12, color:INK }}>{traveller.name||"—"}</div>
          <div style={{ fontSize:10, color:INK_SOFT, lineHeight:1.7 }}>
            {traveller.department&&<div>{traveller.department}</div>}
            {traveller.empId&&<div>ID: {traveller.empId}</div>}
          </div>
        </div>
        <div style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:5 }}>Trip Details</div>
          <div style={{ fontWeight:700, fontSize:12, color:INK }}>{trip.purpose||"—"}</div>
          <div style={{ fontSize:10, color:INK_SOFT, lineHeight:1.7 }}>
            {trip.destination&&<div>To: {trip.destination}</div>}
            {trip.travelDate&&trip.returnDate&&<div>{new Date(trip.travelDate+"T00:00:00").toLocaleDateString("en-IN")} → {new Date(trip.returnDate+"T00:00:00").toLocaleDateString("en-IN")}</div>}
          </div>
        </div>
      </div>

      <div style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:10, marginBottom:16 }}>
        {[["Total Expenses",`₹${total.toFixed(2)}`],["No. of Items",allExpenses.length],mode==="multi"?["Days",days.length]:["Trip Days",trip.travelDate&&trip.returnDate?Math.ceil((new Date(trip.returnDate)-new Date(trip.travelDate))/(1000*60*60*24))+1:"—"]].map(([l,v])=>(
          <div key={l} style={{ background:SURFACE, border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px", textAlign:"center" }}>
            <div style={{ fontSize:18, fontWeight:800, color:INK }}>{v}</div>
            <div style={{ fontSize:10, color:INK_MUTED, marginTop:2 }}>{l}</div>
          </div>
        ))}
      </div>

      {mode==="multi" ? (
        days.map((day,di)=>(
          <div key={day.id} style={{ marginBottom:16 }}>
            <div style={{ background:INK, color:"#fff", padding:"6px 10px", borderRadius:"6px 6px 0 0", fontSize:10, fontWeight:700 }}>
              Day {di+1} — {day.date?new Date(day.date+"T00:00:00").toLocaleDateString("en-IN"):"—"}{day.location?` · ${day.location}`:""}
            </div>
            <table style={{ width:"100%", borderCollapse:"collapse" }}>
              <thead><tr style={{ background:SURFACE_ALT }}>
                {["Category","Description","Bill No.","Payment","Amount (₹)"].map(h=><th key={h} style={{ padding:"5px 8px", fontSize:9, fontWeight:700, textAlign:h==="Description"?"left":"right", color:INK_MUTED }}>{h}</th>)}
              </tr></thead>
              <tbody>{day.expenses.map((e,i)=>(
                <tr key={e.id} style={{ borderBottom:`1px solid ${BORDER}`, background:i%2===0?"#fff":SURFACE }}>
                  <td style={{ padding:"6px 8px", textAlign:"right" }}><span style={{ background:SURFACE_ALT, color:INK_SOFT, fontSize:9, fontWeight:600, padding:"1px 6px", borderRadius:999 }}>{e.category}</span></td>
                  <td style={{ padding:"6px 8px" }}>{e.description||"—"}</td>
                  <td style={{ padding:"6px 8px", textAlign:"right", fontSize:10 }}>{e.billNo||"—"}</td>
                  <td style={{ padding:"6px 8px", textAlign:"right", fontSize:10 }}>{e.paymentMode}</td>
                  <td style={{ padding:"6px 8px", textAlign:"right", fontWeight:700 }}>₹{Number(e.amount||0).toFixed(2)}</td>
                </tr>
              ))}</tbody>
              <tfoot><tr style={{ background:SURFACE_ALT }}>
                <td colSpan="4" style={{ padding:"6px 8px", fontSize:10, fontWeight:700, color:INK }}>Day Total</td>
                <td style={{ padding:"6px 8px", textAlign:"right", fontWeight:900, color:INK }}>₹{day.expenses.reduce((s,e)=>s+Number(e.amount||0),0).toFixed(2)}</td>
              </tr></tfoot>
            </table>
          </div>
        ))
      ) : (
        <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:14 }}>
          <thead><tr style={{ background:INK, color:"#fff" }}>
            {["Date","Category","Description","Bill No.","Payment","Amount (₹)"].map(h=><th key={h} style={{ padding:"7px 8px", fontSize:9, fontWeight:700, textAlign:h==="Description"?"left":"right" }}>{h}</th>)}
          </tr></thead>
          <tbody>{singleExpenses.map((e,i)=>(
            <tr key={e.id} style={{ borderBottom:`1px solid ${BORDER}`, background:i%2===0?"#fff":SURFACE }}>
              <td style={{ padding:"7px 8px", textAlign:"right", fontSize:10 }}>{e.date?new Date(e.date+"T00:00:00").toLocaleDateString("en-IN"):"—"}</td>
              <td style={{ padding:"7px 8px", textAlign:"right" }}><span style={{ background:SURFACE_ALT, color:INK_SOFT, fontSize:9, fontWeight:600, padding:"1px 6px", borderRadius:999 }}>{e.category}</span></td>
              <td style={{ padding:"7px 8px" }}>{e.description||"—"}</td>
              <td style={{ padding:"7px 8px", textAlign:"right", fontSize:10 }}>{e.billNo||"—"}</td>
              <td style={{ padding:"7px 8px", textAlign:"right", fontSize:10 }}>{e.paymentMode}</td>
              <td style={{ padding:"7px 8px", textAlign:"right", fontWeight:700 }}>₹{Number(e.amount||0).toFixed(2)}</td>
            </tr>
          ))}</tbody>
        </table>
      )}

      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        <div style={{ border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px" }}>
          <div style={{ fontSize:9, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>By Category</div>
          {Object.entries(byCat).map(([c,v])=>(
            <div key={c} style={{ display:"flex", justifyContent:"space-between", fontSize:10, marginBottom:4 }}><span style={{ color:INK_SOFT }}>{c}</span><span style={{ fontWeight:600, color:INK }}>₹{v.toFixed(2)}</span></div>
          ))}
        </div>
        <div style={{ border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px", background:SURFACE }}>
          <div style={{ fontSize:9, fontWeight:700, color:INK_MUTED, textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:8 }}>Reimbursement Summary</div>
          <div style={{ fontSize:22, fontWeight:900, color:INK }}>₹{total.toFixed(2)}</div>
          {trip.advanceAmount&&Number(trip.advanceAmount)>0&&(
            <>
              <div style={{ fontSize:10, color:INK_SOFT, marginTop:6 }}>Advance Paid: ₹{Number(trip.advanceAmount).toFixed(2)}</div>
              <div style={{ fontSize:12, fontWeight:700, color:(total-Number(trip.advanceAmount))>=0?"#DC2626":"#059669", marginTop:4 }}>
                {(total-Number(trip.advanceAmount))>=0?`Balance Due: ₹${(total-Number(trip.advanceAmount)).toFixed(2)}`:`Refund: ₹${(Number(trip.advanceAmount)-total).toFixed(2)}`}
              </div>
            </>
          )}
        </div>
      </div>

      {trip.notes&&<div style={{ border:`1px solid ${BORDER}`, borderRadius:8, padding:"10px 12px", fontSize:10, color:INK_SOFT, marginBottom:12 }}><strong style={{ color:INK }}>Notes: </strong>{trip.notes}</div>}

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
  const [trip, setTrip] = useState(() => ({
    reportNo:`TRVL-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`,
    travelDate:daysFromNowISO(5), returnDate:daysFromNowISO(7),
    destination:"Mumbai → Delhi", purpose:"Client meeting — Q3 review",
    advanceAmount:5000, notes:"Client meetings across Delhi NCR region.",
  }));
  const [traveller, setTraveller] = useState({ name:"Rajesh Verma", empId:"EMP-1042", department:"Sales" });
  const [singleExpenses, setSingleExpenses] = useState([
    { id:1001, date:daysFromNowISO(5), category:"Flight", description:"BOM-DEL, IndiGo 6E-204", amount:4500, billNo:"AI-2506", paymentMode:"Company Card" },
    { id:1002, date:daysFromNowISO(5), category:"Hotel", description:"Taj City Centre, 2 nights", amount:3200, billNo:"HTL-889", paymentMode:"Company Card" },
    { id:1003, date:daysFromNowISO(6), category:"Meals", description:"Client dinner", amount:850, billNo:"", paymentMode:"Personal Card" },
  ]);
  const [days, setDays] = useState([
    { id:2001, date:daysFromNowISO(5), location:"Delhi", expenses:[{ id:2101, date:daysFromNowISO(5), category:"Flight", description:"BOM-DEL, IndiGo 6E-204", amount:4500, billNo:"AI-2506", paymentMode:"Company Card" }] },
    { id:2002, date:daysFromNowISO(6), location:"Delhi", expenses:[
      { id:2201, date:daysFromNowISO(6), category:"Hotel", description:"Taj City Centre", amount:3200, billNo:"HTL-889", paymentMode:"Company Card" },
      { id:2202, date:daysFromNowISO(6), category:"Meals", description:"Client dinner", amount:850, billNo:"", paymentMode:"Personal Card" },
    ] },
  ]);
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");

  useSEO({
    title: content.SEO_TITLE,
    description: content.SEO_DESCRIPTION,
    canonical: content.CANONICAL,
    breadcrumbs: content.BREADCRUMBS,
    schemas: [content.softwareAppSchema, content.faqSchema],
  });

  const upd=setter=>(k,v)=>setter(p=>({...p,[k]:v}));
  const updExp=(id,k,v)=>setSingleExpenses(p=>p.map(e=>e.id===id?{...e,[k]:v}:e));
  const updDayExp=(dayId,expId,k,v)=>setDays(p=>p.map(d=>d.id===dayId?{...d,expenses:d.expenses.map(e=>e.id===expId?{...e,[k]:v}:e)}:d));
  const updDay=(id,k,v)=>setDays(p=>p.map(d=>d.id===id?{...d,[k]:v}:d));

  const total = mode==="single"
    ? singleExpenses.reduce((s,e)=>s+Number(e.amount||0),0)
    : days.flatMap(d=>d.expenses).reduce((s,e)=>s+Number(e.amount||0),0);

  const doDownload = async (format = "pdf") => {
    if (downloading) return;
    setDownloading(true);
    setNotice("");

    const data = { mode, trip, traveller, singleExpenses, days };
    const printId = `TRVL-${Date.now()}`;
    const logged = await logSaveRequest({ template: "travel-expense", printId, billData: data });
    if (!logged.ok) setNotice("Your report downloaded fine, but we couldn't record it on our side.");

    await exportSingleDocument({
      Template: TravelPreview,
      data,
      format,
      fileBase: `travel-expense-${trip.reportNo}`,
      taintedHint: TAINTED_HINT,
    });
    setDownloading(false);
  };

  return (
    <div style={{ backgroundColor:SURFACE, minHeight:"100vh" }}>
      <style>{`@media(max-width:1023px){.te-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .te-grid{grid-template-columns:1fr!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#0c2340 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#7DD3FC" }}><a href="/" style={{ color:"#7DD3FC", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span><a href="/documents" style={{ color:"#7DD3FC", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span><span style={{ color:"#BAE6FD" }}>Travel Expense Report</span></nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Travel Expense Report</h1>
          <p style={{ fontSize:14, color:"#7DD3FC", margin:0 }}>Single trip or multi-day itinerary — flights, hotels, meals, and more.</p>
        </div>
      </section>

      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div style={{ display:"flex", gap:8, marginBottom:24 }}>
          {[{key:"single",label:"✈️ Single Trip"},{key:"multi",label:"📅 Multi-Day Itinerary"}].map(opt=>(
            <button key={opt.key} onClick={()=>setMode(opt.key)} style={{ padding:"10px 20px", borderRadius:10, fontSize:13, fontWeight:600, cursor:"pointer", border:mode===opt.key?`1.5px solid ${INK}`:`1.5px solid ${BORDER}`, background:mode===opt.key?SURFACE_ALT:"#fff", color:mode===opt.key?INK:INK_MUTED }}>{opt.label}</button>
          ))}
        </div>

        <div className="te-grid" style={{ display:"grid", gridTemplateColumns:"1fr 500px", gap:28, alignItems:"start" }}>
          <div>
            <Section title="Trip Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Report No." value={trip.reportNo} onChange={v=>upd(setTrip)("reportNo",v)} />
                <Field label="Purpose of Travel" value={trip.purpose} onChange={v=>upd(setTrip)("purpose",v)} placeholder="Client meeting / Conference" />
                <Field label="Travel Date" value={trip.travelDate} onChange={v=>upd(setTrip)("travelDate",v)} type="date" />
                <Field label="Return Date" value={trip.returnDate} onChange={v=>upd(setTrip)("returnDate",v)} type="date" />
                <Field label="Destination" value={trip.destination} onChange={v=>upd(setTrip)("destination",v)} placeholder="Mumbai → Delhi" />
                <Field label="Advance Amount ₹" value={trip.advanceAmount} onChange={v=>upd(setTrip)("advanceAmount",v)} type="number" placeholder="0" />
              </div>
              <Field label="Notes" value={trip.notes} onChange={v=>upd(setTrip)("notes",v)} placeholder="Business purpose, client name etc." />
            </Section>

            <Section title="Traveller Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Name" value={traveller.name} onChange={v=>upd(setTraveller)("name",v)} placeholder="Rajesh Verma" />
                <Field label="Employee ID" value={traveller.empId} onChange={v=>upd(setTraveller)("empId",v)} placeholder="EMP-001" />
                <Field label="Department" value={traveller.department} onChange={v=>upd(setTraveller)("department",v)} placeholder="Sales" />
              </div>
            </Section>

            {mode==="single" ? (
              <Section title="Expenses">
                {singleExpenses.map(e=>(
                  <ExpenseRow key={e.id} e={e}
                    onUpdate={(k,v)=>updExp(e.id,k,v)}
                    onRemove={()=>singleExpenses.length>1&&setSingleExpenses(p=>p.filter(i=>i.id!==e.id))}
                    showDate={true}
                  />
                ))}
                <button onClick={()=>setSingleExpenses(p=>[...p,defaultExpense()])} style={{ width:"100%", padding:10, borderRadius:10, border:`1.5px dashed ${INK_MUTED}`, background:SURFACE, color:INK_SOFT, fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Expense</button>
                <div style={{ background:INK, color:"#fff", borderRadius:10, padding:"12px 16px", marginTop:12, display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:14, fontWeight:700 }}>Total</span>
                  <span style={{ fontSize:18, fontWeight:900 }}>₹{total.toFixed(2)}</span>
                </div>
                <BalanceBanner total={total} advanceAmount={trip.advanceAmount} />
              </Section>
            ) : (
              <Section title="Day-wise Itinerary">
                {days.map((day,di)=>(
                  <div key={day.id} style={{ border:`1px solid ${BORDER}`, borderRadius:14, padding:"16px", marginBottom:16, background:SURFACE }}>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12 }}>
                      <div style={{ display:"flex", gap:8, alignItems:"center" }}>
                        <span style={{ background:INK, color:"#fff", fontSize:11, fontWeight:700, padding:"3px 10px", borderRadius:999 }}>Day {di+1}</span>
                        <div style={{ display:"grid", gridTemplateColumns:"140px 1fr", gap:8 }}>
                          <input type="date" value={day.date} onChange={e=>updDay(day.id,"date",e.target.value)} style={{ height:30, border:`1.5px solid ${BORDER}`, borderRadius:7, padding:"0 8px", fontSize:12, outline:"none" }} />
                          <input value={day.location} onChange={e=>updDay(day.id,"location",e.target.value)} placeholder="City / Location" style={{ height:30, border:`1.5px solid ${BORDER}`, borderRadius:7, padding:"0 8px", fontSize:12, outline:"none" }} />
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
                      <button onClick={()=>setDays(p=>p.map(d=>d.id===day.id?{...d,expenses:[...d.expenses,defaultExpense()]}:d))} style={{ padding:"7px 14px", borderRadius:8, border:`1.5px dashed ${INK_MUTED}`, background:"#fff", color:INK_SOFT, fontSize:12, fontWeight:600, cursor:"pointer" }}>+ Add Expense</button>
                      <div style={{ fontSize:13, fontWeight:700, color:INK }}>Day total: ₹{day.expenses.reduce((s,e)=>s+Number(e.amount||0),0).toFixed(2)}</div>
                    </div>
                  </div>
                ))}
                <button onClick={()=>setDays(p=>[...p,defaultDay()])} style={{ width:"100%", padding:10, borderRadius:10, border:`1.5px dashed ${INK_MUTED}`, background:SURFACE, color:INK_SOFT, fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Day</button>
                <div style={{ background:INK, color:"#fff", borderRadius:10, padding:"12px 16px", marginTop:12, display:"flex", justifyContent:"space-between" }}>
                  <span style={{ fontSize:14, fontWeight:700 }}>Grand Total</span>
                  <span style={{ fontSize:18, fontWeight:900 }}>₹{total.toFixed(2)}</span>
                </div>
                <BalanceBanner total={total} advanceAmount={trip.advanceAmount} />
              </Section>
            )}
          </div>

          <div className="te-prev" style={{ position:"sticky", top:88 }}>
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
              <TravelPreview data={{ mode, trip, traveller, singleExpenses, days }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background:"#fff", borderTop:`1px solid ${BORDER}` }}>
        <div className="seo-section" style={{ maxWidth:"80%", margin:"0 auto", width:"80%" }}>
          <DocumentPageSEO
            documentName="Travel Expense Report"
            documentSlug="travel-expense"
            intro={content.INTRO}
            whatIs={content.WHAT_IS}
            whyUse={content.WHY_USE}
            features={content.FEATURES}
            howToSteps={content.HOW_TO_STEPS}
            benefits={content.BENEFITS}
            formatFields={content.FORMAT_FIELDS}
            faqs={content.FAQS}
            relatedDocs={content.RELATED_DOCS}
          />
        </div>
      </div>
    </div>
  );
}
