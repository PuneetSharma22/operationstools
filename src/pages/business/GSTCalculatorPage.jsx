import { Helmet } from 'react-helmet-async';
import { useState } from "react";

const GST_RATES = [0, 0.25, 0.5, 1, 1.5, 3, 5, 7.5, 12, 18, 28];
const COMMON_ITEMS = [
  { name: "Milk / Eggs / Fresh vegetables", rate: 0 },
  { name: "Sugar / Tea / Coffee", rate: 5 },
  { name: "Packed food / Namkeen", rate: 12 },
  { name: "Restaurant (AC)", rate: 18 },
  { name: "Mobile phones", rate: 18 },
  { name: "Computers / Laptops", rate: 18 },
  { name: "Cement / Paint", rate: 28 },
  { name: "Cars / SUVs", rate: 28 },
  { name: "Medicines", rate: 12 },
  { name: "Freight services", rate: 5 },
];

function ResultCard({ label, value, sub, accent, big }) {
  return (
    <div style={{ background:"#fff", borderRadius:14, border:`1.5px solid ${accent}30`, padding:"16px 20px", textAlign:"center" }}>
      <div style={{ fontSize:11, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>{label}</div>
      <div style={{ fontSize:big?28:22, fontWeight:900, color:accent, lineHeight:1 }}>₹{Number(value||0).toFixed(2)}</div>
      {sub&&<div style={{ fontSize:11, color:"#94A3B8", marginTop:4 }}>{sub}</div>}
    </div>
  );
}

export default function GSTCalculatorPage() {
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState(18);
  const [mode, setMode] = useState("exclusive"); // exclusive = add GST, inclusive = remove GST
  const [txnType, setTxnType] = useState("intra"); // intra = CGST+SGST, inter = IGST
  const [history, setHistory] = useState([]);

  const num = Number(amount)||0;

  const taxable = mode==="exclusive" ? num : num / (1 + rate/100);
  const gstAmount = mode==="exclusive" ? num * rate/100 : num - taxable;
  const total = mode==="exclusive" ? num + gstAmount : num;
  const cgst = txnType==="intra" ? gstAmount/2 : 0;
  const sgst = txnType==="intra" ? gstAmount/2 : 0;
  const igst = txnType==="inter" ? gstAmount : 0;

  const addToHistory = () => {
    if (!num) return;
    setHistory(h=>[{ id:Date.now(), amount:num, rate, mode, txnType, taxable, gstAmount, total, cgst, sgst, igst }, ...h].slice(0,10));
  };

  const clearHistory = () => setHistory([]);

  return (
    <>
      <Helmet>
        <title>Free GST Calculator India — Add or Remove GST with CGST/SGST | OpsTools</title>
        <meta name="description" content="Calculate GST instantly. Add or remove GST. CGST, SGST and IGST breakdown for any rate. Free." />
        <meta property="og:title" content="Free GST Calculator India — Add or Remove GST with CGST/SGST | OpsTools" />
        <meta property="og:description" content="Calculate GST instantly. Add or remove GST. CGST, SGST and IGST breakdown for any rate. Free." />
        <meta property="og:url" content="https://www.opstools.ai/business/gst-calculator" />
        <link rel="canonical" href="https://www.opstools.ai/business/gst-calculator" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free GST Calculator India — Add or Remove GST with CGST/SGST | OpsTools" />
        <meta name="twitter:description" content="Calculate GST instantly. Add or remove GST. CGST, SGST and IGST breakdown for any rate. Free." />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>
    <div style={{ backgroundColor:"#F8FAFC", minHeight:"100vh" }}>
      <style>{`@media(max-width:768px){.gst-layout{grid-template-columns:1fr!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#083344 100%)", padding:"40px 24px 36px" }}>
        <div style={{ maxWidth:1100, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#67E8F9" }}><a href="/" style={{ color:"#67E8F9", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span><a href="/business/roi-calculator" style={{ color:"#67E8F9", textDecoration:"none" }}>Business</a><span style={{ margin:"0 8px" }}>›</span><span style={{ color:"#A5F3FC" }}>GST Calculator</span></nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>GST Calculator</h1>
          <p style={{ fontSize:14, color:"#67E8F9", margin:0 }}>Add or remove GST — with CGST/SGST/IGST breakdown. No login needed.</p>
        </div>
      </section>

      <div style={{ maxWidth:1100, margin:"0 auto", padding:"32px 24px" }}>
        <div className="gst-layout" style={{ display:"grid", gridTemplateColumns:"420px 1fr", gap:28, alignItems:"start" }}>

          {/* Input panel */}
          <div>
            <div style={{ background:"#fff", borderRadius:20, border:"1px solid #E2E8F0", padding:"28px 28px", marginBottom:16, boxShadow:"0 4px 24px rgba(0,0,0,0.05)" }}>
              <h2 style={{ fontSize:16, fontWeight:700, color:"#0F172A", margin:"0 0 20px" }}>Calculate GST</h2>

              {/* Mode toggle */}
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em" }}>Mode</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[{key:"exclusive",label:"➕ Add GST",sub:"Price excl. GST → Total"},{key:"inclusive",label:"➖ Remove GST",sub:"Price incl. GST → Base"}].map(opt=>(
                    <button key={opt.key} onClick={()=>setMode(opt.key)} style={{ padding:"12px 10px", borderRadius:10, fontSize:12, fontWeight:600, cursor:"pointer", border:mode===opt.key?"1.5px solid #0891B2":"1.5px solid #E2E8F0", background:mode===opt.key?"#ECFEFF":"#fff", color:mode===opt.key?"#0891B2":"#64748B", textAlign:"center" }}>
                      <div>{opt.label}</div>
                      <div style={{ fontSize:10, fontWeight:400, marginTop:2, opacity:0.7 }}>{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amount */}
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em" }}>
                  {mode==="exclusive"?"Price (Excl. GST)":"Price (Incl. GST)"}
                </label>
                <div style={{ position:"relative" }}>
                  <span style={{ position:"absolute", left:14, top:"50%", transform:"translateY(-50%)", fontSize:18, fontWeight:700, color:"#94A3B8" }}>₹</span>
                  <input type="number" value={amount} onChange={e=>setAmount(e.target.value)} placeholder="0.00"
                    style={{ width:"100%", height:52, border:"1.5px solid #E2E8F0", borderRadius:12, padding:"0 16px 0 36px", fontSize:20, fontWeight:700, color:"#0F172A", outline:"none", boxSizing:"border-box" }}
                    onFocus={e=>e.target.style.borderColor="#0891B2"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
                </div>
              </div>

              {/* GST Rate */}
              <div style={{ marginBottom:20 }}>
                <label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em" }}>GST Rate</label>
                <div style={{ display:"flex", flexWrap:"wrap", gap:6 }}>
                  {GST_RATES.map(r=>(
                    <button key={r} onClick={()=>setRate(r)} style={{ padding:"6px 12px", borderRadius:8, fontSize:13, fontWeight:600, cursor:"pointer", border:rate===r?"1.5px solid #0891B2":"1.5px solid #E2E8F0", background:rate===r?"#0891B2":"#fff", color:rate===r?"#fff":"#475569" }}>
                      {r}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Transaction type */}
              <div style={{ marginBottom:24 }}>
                <label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em" }}>Transaction Type</label>
                <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                  {[{key:"intra",label:"Intra-state",sub:"CGST + SGST"},{key:"inter",label:"Inter-state",sub:"IGST only"}].map(opt=>(
                    <button key={opt.key} onClick={()=>setTxnType(opt.key)} style={{ padding:"10px", borderRadius:10, fontSize:12, fontWeight:600, cursor:"pointer", border:txnType===opt.key?"1.5px solid #0891B2":"1.5px solid #E2E8F0", background:txnType===opt.key?"#ECFEFF":"#fff", color:txnType===opt.key?"#0891B2":"#64748B" }}>
                      <div>{opt.label}</div>
                      <div style={{ fontSize:10, fontWeight:400, marginTop:1, opacity:0.7 }}>{opt.sub}</div>
                    </button>
                  ))}
                </div>
              </div>

              <button onClick={addToHistory} style={{ width:"100%", padding:14, borderRadius:12, background:"linear-gradient(135deg,#0891B2,#0E7490)", color:"#fff", fontSize:14, fontWeight:700, border:"none", cursor:"pointer" }}>
                Save to History
              </button>
            </div>

            {/* Quick reference */}
            <div style={{ background:"#fff", borderRadius:16, border:"1px solid #E2E8F0", padding:"20px" }}>
              <h3 style={{ fontSize:13, fontWeight:700, color:"#0F172A", margin:"0 0 14px" }}>Common GST Rates</h3>
              <div style={{ display:"flex", flexDirection:"column", gap:4 }}>
                {COMMON_ITEMS.map(item=>(
                  <button key={item.name} onClick={()=>setRate(item.rate)} style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"8px 10px", borderRadius:8, border:"1px solid transparent", background:"transparent", cursor:"pointer", textAlign:"left", transition:"background 0.12s" }}
                    onMouseEnter={e=>e.currentTarget.style.background="#F8FAFC"}
                    onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                    <span style={{ fontSize:13, color:"#374151" }}>{item.name}</span>
                    <span style={{ fontSize:12, fontWeight:700, color:"#0891B2", background:"#ECFEFF", padding:"2px 8px", borderRadius:999, flexShrink:0 }}>{item.rate}%</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results panel */}
          <div>
            {/* Main result */}
            <div style={{ background:"linear-gradient(135deg,#0891B2,#0E7490)", borderRadius:20, padding:"28px", marginBottom:16, color:"#fff" }}>
              <div style={{ fontSize:13, fontWeight:600, opacity:0.8, marginBottom:4, textTransform:"uppercase", letterSpacing:"0.08em" }}>
                {mode==="exclusive"?"Total Amount (Incl. GST)":"Taxable Amount (Excl. GST)"}
              </div>
              <div style={{ fontSize:48, fontWeight:900, lineHeight:1, letterSpacing:"-0.02em" }}>
                ₹{(mode==="exclusive"?total:taxable).toFixed(2)}
              </div>
              <div style={{ fontSize:13, opacity:0.75, marginTop:8 }}>
                GST @ {rate}% = ₹{gstAmount.toFixed(2)}
              </div>
            </div>

            {/* Breakdown cards */}
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:16 }}>
              <ResultCard label="Taxable Amount" value={taxable} accent="#0F172A" />
              <ResultCard label="GST Amount" value={gstAmount} accent="#0891B2" />
              {txnType==="intra" ? (
                <>
                  <ResultCard label={`CGST @ ${rate/2}%`} value={cgst} accent="#6366F1" />
                  <ResultCard label={`SGST @ ${rate/2}%`} value={sgst} accent="#8B5CF6" />
                </>
              ) : (
                <div style={{ gridColumn:"1/-1" }}>
                  <ResultCard label={`IGST @ ${rate}%`} value={igst} accent="#6366F1" big />
                </div>
              )}
              <div style={{ gridColumn:"1/-1" }}>
                <ResultCard label="Total (Incl. GST)" value={total} accent="#059669" big />
              </div>
            </div>

            {/* Detailed table */}
            <div style={{ background:"#fff", borderRadius:16, border:"1px solid #E2E8F0", padding:"20px", marginBottom:16 }}>
              <h3 style={{ fontSize:13, fontWeight:700, color:"#0F172A", margin:"0 0 14px" }}>Full Breakdown</h3>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
                <tbody>
                  {[
                    ["Taxable Value", `₹${taxable.toFixed(2)}`, "#0F172A"],
                    txnType==="intra"?[`CGST (${rate/2}%)`, `₹${cgst.toFixed(2)}`, "#6366F1"]:null,
                    txnType==="intra"?[`SGST (${rate/2}%)`, `₹${sgst.toFixed(2)}`, "#8B5CF6"]:null,
                    txnType==="inter"?[`IGST (${rate}%)`, `₹${igst.toFixed(2)}`, "#6366F1"]:null,
                    ["Total GST", `₹${gstAmount.toFixed(2)}`, "#0891B2"],
                    ["Total Amount", `₹${total.toFixed(2)}`, "#059669"],
                  ].filter(Boolean).map(([l,v,c])=>(
                    <tr key={l} style={{ borderBottom:"1px solid #F1F5F9" }}>
                      <td style={{ padding:"10px 8px", color:"#475569" }}>{l}</td>
                      <td style={{ padding:"10px 8px", textAlign:"right", fontWeight:700, color:c }}>{v}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Comparison across rates */}
            <div style={{ background:"#fff", borderRadius:16, border:"1px solid #E2E8F0", padding:"20px" }}>
              <h3 style={{ fontSize:13, fontWeight:700, color:"#0F172A", margin:"0 0 14px" }}>Compare Across Rates</h3>
              <table style={{ width:"100%", borderCollapse:"collapse", fontSize:12 }}>
                <thead><tr style={{ background:"#F8FAFC" }}>
                  {["Rate","GST Amount","Total"].map(h=><th key={h} style={{ padding:"8px", fontSize:11, fontWeight:700, color:"#64748B", textAlign:"right", borderBottom:"1px solid #E2E8F0" }}>{h}</th>)}
                </tr></thead>
                <tbody>
                  {[0,5,12,18,28].map(r=>{
                    const g = mode==="exclusive" ? num*r/100 : num-(num/(1+r/100));
                    const t = mode==="exclusive" ? num+g : num;
                    return (
                      <tr key={r} onClick={()=>setRate(r)} style={{ borderBottom:"1px solid #F1F5F9", cursor:"pointer", background:rate===r?"#ECFEFF":"transparent" }}>
                        <td style={{ padding:"8px", textAlign:"right" }}><span style={{ background:rate===r?"#0891B2":"#F1F5F9", color:rate===r?"#fff":"#475569", fontSize:11, fontWeight:700, padding:"2px 8px", borderRadius:999 }}>{r}%</span></td>
                        <td style={{ padding:"8px", textAlign:"right", fontWeight:600, color:"#0891B2" }}>₹{g.toFixed(2)}</td>
                        <td style={{ padding:"8px", textAlign:"right", fontWeight:700, color:"#0F172A" }}>₹{t.toFixed(2)}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* History */}
            {history.length>0&&(
              <div style={{ background:"#fff", borderRadius:16, border:"1px solid #E2E8F0", padding:"20px", marginTop:16 }}>
                <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:14 }}>
                  <h3 style={{ fontSize:13, fontWeight:700, color:"#0F172A", margin:0 }}>Calculation History</h3>
                  <button onClick={clearHistory} style={{ fontSize:12, color:"#94A3B8", background:"none", border:"none", cursor:"pointer" }}>Clear</button>
                </div>
                <div style={{ display:"flex", flexDirection:"column", gap:6 }}>
                  {history.map(h=>(
                    <div key={h.id} style={{ display:"flex", justifyContent:"space-between", padding:"8px 10px", background:"#F8FAFC", borderRadius:8, fontSize:12 }}>
                      <span style={{ color:"#475569" }}>₹{h.amount} @ {h.rate}% ({h.mode==="exclusive"?"Add":"Remove"}, {h.txnType==="intra"?"CGST+SGST":"IGST"})</span>
                      <span style={{ fontWeight:700, color:"#0891B2" }}>Total: ₹{h.total.toFixed(2)} | GST: ₹{h.gstAmount.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
