import { useState, useRef } from "react";
import { supabase } from "../../supabase-public.js";

function Field({ label, value, onChange, placeholder, type="text", small }) {
  return (
    <div style={{ marginBottom:small?8:12 }}>
      {label && <label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder} onChange={e=>onChange&&onChange(e.target.value)}
        style={{ width:"100%", height:small?32:38, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 10px", fontSize:13, color:"#0F172A", outline:"none", boxSizing:"border-box", background:"#fff" }}
        onFocus={e=>e.target.style.borderColor="#0EA5E9"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
    </div>
  );
}

const defaultItem = () => ({ id:Date.now()+Math.random(), description:"", qty:1, rate:0, note:"" });

function QuotePreview({ data, from, to, items }) {
  const subtotal = items.reduce((s,i)=>s+i.qty*i.rate,0);
  const total = subtotal - (Number(data.discount)||0);
  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:12, color:"#1a1a1a", padding:"32px 40px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, paddingBottom:16, borderBottom:"2px solid #0EA5E9" }}>
        <div>
          {data.logoUrl && <img src={data.logoUrl} alt="logo" style={{ maxHeight:52, maxWidth:160, objectFit:"contain", marginBottom:8, display:"block" }}/>}
          <div style={{ fontSize:18, fontWeight:800, color:"#0EA5E9" }}>{from.name||"Your Business"}</div>
          <div style={{ fontSize:11, color:"#475569", marginTop:3, lineHeight:1.7 }}>
            {from.address&&<div>{from.address}</div>}
            {from.email&&<div>{from.email}</div>}
            {from.phone&&<div>{from.phone}</div>}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:22, fontWeight:900, color:"#0F172A" }}>QUOTATION</div>
          <div style={{ background:"#F0F9FF", border:"1px solid #BAE6FD", borderRadius:8, padding:"10px 16px", marginTop:8, fontSize:12 }}>
            <div style={{ display:"flex", gap:16, justifyContent:"flex-end" }}><span style={{ color:"#64748B" }}>Quote No.</span><strong>{data.quoteNo||"—"}</strong></div>
            <div style={{ display:"flex", gap:16, justifyContent:"flex-end", marginTop:4 }}><span style={{ color:"#64748B" }}>Date</span><strong>{data.date?new Date(data.date+"T00:00:00").toLocaleDateString("en-IN"):"—"}</strong></div>
            {data.validUntil&&<div style={{ display:"flex", gap:16, justifyContent:"flex-end", marginTop:4 }}><span style={{ color:"#64748B" }}>Valid Until</span><strong>{new Date(data.validUntil+"T00:00:00").toLocaleDateString("en-IN")}</strong></div>}
          </div>
        </div>
      </div>
      <div style={{ background:"#F0F9FF", borderRadius:8, padding:"12px 16px", marginBottom:20 }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#0EA5E9", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Prepared For</div>
        <div style={{ fontWeight:700, fontSize:13 }}>{to.name||"Client Name"}</div>
        <div style={{ fontSize:11, color:"#475569", lineHeight:1.7 }}>{to.address&&<span>{to.address}<br/></span>}{to.email&&<span>{to.email}</span>}</div>
      </div>
      {data.subject&&<div style={{ background:"#F0F9FF", borderRadius:8, padding:"10px 16px", marginBottom:20, fontSize:13, color:"#0369A1", fontWeight:600 }}>Re: {data.subject}</div>}
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:16 }}>
        <thead><tr style={{ background:"#0EA5E9", color:"#fff" }}>
          {["#","Description","Qty","Rate (₹)","Amount (₹)"].map(h=><th key={h} style={{ padding:"8px 10px", fontSize:10, fontWeight:700, textAlign:h==="Description"?"left":"right" }}>{h}</th>)}
        </tr></thead>
        <tbody>{items.map((item,i)=>{
          const amt=item.qty*item.rate;
          return <tr key={item.id} style={{ borderBottom:"1px solid #E2E8F0", background:i%2===0?"#fff":"#F8FAFC" }}>
            <td style={{ padding:"9px 10px", textAlign:"right", color:"#94A3B8" }}>{i+1}</td>
            <td style={{ padding:"9px 10px" }}><div>{item.description||"—"}</div>{item.note&&<div style={{ fontSize:10, color:"#94A3B8", marginTop:2 }}>{item.note}</div>}</td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{item.qty}</td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{item.rate.toFixed(2)}</td>
            <td style={{ padding:"9px 10px", textAlign:"right", fontWeight:700 }}>{amt.toFixed(2)}</td>
          </tr>;
        })}</tbody>
      </table>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <div style={{ width:220 }}>
          <div style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #F1F5F9", fontSize:12 }}><span style={{ color:"#64748B" }}>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
          {Number(data.discount)>0&&<div style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #F1F5F9", fontSize:12 }}><span style={{ color:"#64748B" }}>Discount</span><span>-₹{Number(data.discount).toFixed(2)}</span></div>}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 12px", background:"#0EA5E9", color:"#fff", borderRadius:8, marginTop:8, fontSize:14, fontWeight:800 }}><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        </div>
      </div>
      {data.terms&&<div style={{ border:"1px solid #E2E8F0", borderRadius:8, padding:"12px 14px", fontSize:11, color:"#475569", marginBottom:12 }}><strong style={{ color:"#0EA5E9" }}>Terms & Conditions: </strong>{data.terms}</div>}
      {data.notes&&<div style={{ border:"1px solid #E2E8F0", borderRadius:8, padding:"12px 14px", fontSize:11, color:"#475569" }}><strong style={{ color:"#0EA5E9" }}>Notes: </strong>{data.notes}</div>}
    </div>
  );
}

export default function QuotationGeneratorPage() {
  const [data, setData] = useState({ quoteNo:`QUOTE-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`, date:new Date().toISOString().split("T")[0], validUntil:"", subject:"", logoUrl:"", discount:"", terms:"This quotation is valid for 30 days.", notes:"" });
  const [from, setFrom] = useState({ name:"", address:"", email:"", phone:"" });
  const [to, setTo] = useState({ name:"", address:"", email:"" });
  const [items, setItems] = useState([defaultItem()]);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);
  const upd = setter=>(k,v)=>setter(p=>({...p,[k]:v}));
  const updItem = (id,k,v)=>setItems(p=>p.map(i=>i.id===id?{...i,[k]:v}:i));

  const handlePDF = async () => {
    if (!previewRef.current||downloading) return;
    setDownloading(true);
    try {
      try { await supabase.from("save_requests").insert({ template:"quotation-generator", print_id:`QUOTE-${Date.now()}`, user_id:null }); } catch(_){}
      const { default:jsPDF } = await import("jspdf");
      const { default:html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(previewRef.current,{scale:2,useCORS:true,backgroundColor:"#ffffff"});
      const pdf = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
      const pw=pdf.internal.pageSize.getWidth(),ph=pdf.internal.pageSize.getHeight();
      const s=Math.min(pw/(canvas.width*25.4/(96*2)),ph/(canvas.height*25.4/(96*2)));
      pdf.addImage(canvas.toDataURL("image/png"),"PNG",(pw-canvas.width*25.4/(96*2)*s)/2,0,canvas.width*25.4/(96*2)*s,canvas.height*25.4/(96*2)*s);
      pdf.save(`quotation-${data.quoteNo}.pdf`);
    } catch(e){alert("PDF failed: "+e?.message);}
    finally{setDownloading(false);}
  };

  const S=({title,children})=>(
    <div style={{ background:"#fff", borderRadius:16, border:"1px solid #E2E8F0", padding:"20px 24px", marginBottom:16 }}>
      <h2 style={{ fontSize:13, fontWeight:700, color:"#0EA5E9", margin:"0 0 16px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div style={{ backgroundColor:"#F8FAFC", minHeight:"100vh" }}>
      <style>{`@media(max-width:768px){.qt-grid{grid-template-columns:1fr!important;}.qt-prev{display:none!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#0c2340 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#7DD3FC" }}>
            <a href="/" style={{ color:"#7DD3FC", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span>
            <a href="/documents" style={{ color:"#7DD3FC", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span>
            <span style={{ color:"#BAE6FD" }}>Quotation Generator</span>
          </nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Quotation Generator</h1>
          <p style={{ fontSize:14, color:"#7DD3FC", margin:0 }}>Professional price quotes with line items, validity period, and terms.</p>
        </div>
      </section>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div className="qt-grid" style={{ display:"grid", gridTemplateColumns:"1fr 500px", gap:28, alignItems:"start" }}>
          <div>
            <S title="Quotation Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Quote No." value={data.quoteNo} onChange={v=>upd(setData)("quoteNo",v)} />
                <Field label="Date" value={data.date} onChange={v=>upd(setData)("date",v)} type="date" />
                <Field label="Valid Until" value={data.validUntil} onChange={v=>upd(setData)("validUntil",v)} type="date" />
                <Field label="Discount (₹)" value={data.discount} onChange={v=>upd(setData)("discount",v)} type="number" placeholder="0" />
              </div>
              <Field label="Subject / Re:" value={data.subject} onChange={v=>upd(setData)("subject",v)} placeholder="Website development project" />
              <Field label="Logo URL" value={data.logoUrl} onChange={v=>upd(setData)("logoUrl",v)} placeholder="https://..." />
            </S>
            <S title="From (Your Business)">
              <Field label="Business Name" value={from.name} onChange={v=>upd(setFrom)("name",v)} />
              <Field label="Address" value={from.address} onChange={v=>upd(setFrom)("address",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Email" value={from.email} onChange={v=>upd(setFrom)("email",v)} />
                <Field label="Phone" value={from.phone} onChange={v=>upd(setFrom)("phone",v)} />
              </div>
            </S>
            <S title="Prepared For (Client)">
              <Field label="Client Name" value={to.name} onChange={v=>upd(setTo)("name",v)} />
              <Field label="Address" value={to.address} onChange={v=>upd(setTo)("address",v)} />
              <Field label="Email" value={to.email} onChange={v=>upd(setTo)("email",v)} />
            </S>
            <S title="Line Items">
              {items.map((item,idx)=>(
                <div key={item.id} style={{ background:"#F8FAFC", borderRadius:12, padding:"14px 16px", marginBottom:10, border:"1px solid #E2E8F0", position:"relative" }}>
                  {items.length>1&&<button onClick={()=>setItems(p=>p.filter(i=>i.id!==item.id))} style={{ position:"absolute", top:10, right:10, background:"#FEF2F2", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:"#DC2626", fontSize:14 }}>×</button>}
                  <div style={{ fontSize:11, fontWeight:700, color:"#94A3B8", marginBottom:8, textTransform:"uppercase" }}>Item {idx+1}</div>
                  <Field label="Description" value={item.description} onChange={v=>updItem(item.id,"description",v)} small />
                  <Field label="Note (optional)" value={item.note} onChange={v=>updItem(item.id,"note",v)} placeholder="Specifications, delivery time etc." small />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    <Field label="Qty" value={item.qty} onChange={v=>updItem(item.id,"qty",Number(v))} type="number" small />
                    <Field label="Rate ₹" value={item.rate} onChange={v=>updItem(item.id,"rate",Number(v))} type="number" small />
                  </div>
                  <div style={{ fontSize:12, color:"#0EA5E9", fontWeight:700, marginTop:6 }}>= ₹{(item.qty*item.rate).toFixed(2)}</div>
                </div>
              ))}
              <button onClick={()=>setItems(p=>[...p,defaultItem()])} style={{ width:"100%", padding:10, borderRadius:10, border:"1.5px dashed #0EA5E9", background:"#F0F9FF", color:"#0369A1", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Item</button>
            </S>
            <S title="Terms & Notes">
              <Field label="Terms & Conditions" value={data.terms} onChange={v=>upd(setData)("terms",v)} />
              <Field label="Notes" value={data.notes} onChange={v=>upd(setData)("notes",v)} placeholder="Payment terms, delivery etc." />
            </S>
          </div>
          <div className="qt-prev" style={{ position:"sticky", top:88 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#64748B", margin:0 }}>Live Preview</p>
              <button onClick={handlePDF} disabled={downloading} style={{ background:"linear-gradient(135deg,#0EA5E9,#0284C7)", border:"none", borderRadius:8, padding:"6px 16px", color:"#fff", fontSize:13, fontWeight:600, cursor:downloading?"wait":"pointer", opacity:downloading?0.7:1 }}>{downloading?"Saving…":"Save PDF"}</button>
            </div>
            <div style={{ transform:"scale(0.68)", transformOrigin:"top left", width:"147%", marginBottom:"-32%" }}>
              <div ref={previewRef}><QuotePreview data={data} from={from} to={to} items={items} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
