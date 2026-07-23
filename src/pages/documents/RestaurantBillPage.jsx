import { Helmet } from 'react-helmet-async';
import { useState, useRef } from "react";
import { supabase } from "../../supabase-public.js";

function Field({ label, value, onChange, placeholder, type="text", small }) {
  return (
    <div style={{ marginBottom:small?8:12 }}>
      {label&&<label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder} onChange={e=>onChange&&onChange(e.target.value)}
        style={{ width:"100%", height:small?32:38, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 10px", fontSize:13, color:"#0F172A", outline:"none", boxSizing:"border-box", background:"#fff" }}
        onFocus={e=>e.target.style.borderColor="#F97316"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
    </div>
  );
}

const defaultItem = () => ({ id:Date.now()+Math.random(), name:"", qty:1, rate:0 });

function RestaurantPreview({ data, items }) {
  const subtotal = items.reduce((s,i)=>s+i.qty*i.rate,0);
  const sgst = subtotal * (Number(data.sgst)||2.5) / 100;
  const cgst = subtotal * (Number(data.cgst)||2.5) / 100;
  const sc = subtotal * (Number(data.serviceCharge)||0) / 100;
  const total = subtotal + sgst + cgst + sc;

  return (
    <div style={{ background:"#fff", fontFamily:"'Courier New',monospace", fontSize:12, color:"#1a1a1a", padding:"24px 28px", maxWidth:380, margin:"0 auto" }}>
      <div style={{ textAlign:"center", marginBottom:16 }}>
        {data.logoUrl&&<img src={data.logoUrl} alt="logo" style={{ maxHeight:52, maxWidth:140, objectFit:"contain", marginBottom:8, display:"block", margin:"0 auto 8px" }}/>}
        <div style={{ fontSize:18, fontWeight:900, letterSpacing:"-0.01em" }}>{data.restaurantName||"Restaurant Name"}</div>
        {data.address&&<div style={{ fontSize:11, color:"#475569", marginTop:2 }}>{data.address}</div>}
        {data.phone&&<div style={{ fontSize:11, color:"#475569" }}>Tel: {data.phone}</div>}
        {data.gstin&&<div style={{ fontSize:11, color:"#475569" }}>GSTIN: {data.gstin}</div>}
      </div>
      <div style={{ borderTop:"1px dashed #CBD5E1", borderBottom:"1px dashed #CBD5E1", padding:"8px 0", marginBottom:12 }}>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11 }}>
          <span>Bill No: {data.billNo||"—"}</span>
          <span>{data.date?new Date(data.date+"T00:00:00").toLocaleDateString("en-IN"):"—"}</span>
        </div>
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginTop:2 }}>
          {data.tableNo&&<span>Table: {data.tableNo}</span>}
          {data.covers&&<span>Covers: {data.covers}</span>}
          {data.waiter&&<span>Waiter: {data.waiter}</span>}
        </div>
      </div>
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:8 }}>
        <thead><tr style={{ borderBottom:"1px dashed #CBD5E1" }}>
          <th style={{ padding:"4px 0", fontSize:10, fontWeight:700, textAlign:"left" }}>Item</th>
          <th style={{ padding:"4px 0", fontSize:10, fontWeight:700, textAlign:"right" }}>Qty</th>
          <th style={{ padding:"4px 0", fontSize:10, fontWeight:700, textAlign:"right" }}>Rate</th>
          <th style={{ padding:"4px 0", fontSize:10, fontWeight:700, textAlign:"right" }}>Amt</th>
        </tr></thead>
        <tbody>{items.map((item,i)=>(
          <tr key={item.id}>
            <td style={{ padding:"4px 0", fontSize:11 }}>{item.name||"—"}</td>
            <td style={{ padding:"4px 0", fontSize:11, textAlign:"right" }}>{item.qty}</td>
            <td style={{ padding:"4px 0", fontSize:11, textAlign:"right" }}>{item.rate.toFixed(2)}</td>
            <td style={{ padding:"4px 0", fontSize:11, textAlign:"right" }}>{(item.qty*item.rate).toFixed(2)}</td>
          </tr>
        ))}</tbody>
      </table>
      <div style={{ borderTop:"1px dashed #CBD5E1", paddingTop:8 }}>
        {[["Subtotal",subtotal],[`CGST @${data.cgst||2.5}%`,cgst],[`SGST @${data.sgst||2.5}%`,sgst],Number(data.serviceCharge)>0?[`Service Charge @${data.serviceCharge}%`,sc]:null].filter(Boolean).map(([l,v])=>(
          <div key={l} style={{ display:"flex", justifyContent:"space-between", fontSize:11, marginBottom:3 }}>
            <span style={{ color:"#475569" }}>{l}</span><span>₹{v.toFixed(2)}</span>
          </div>
        ))}
        <div style={{ display:"flex", justifyContent:"space-between", fontSize:14, fontWeight:900, borderTop:"1px dashed #CBD5E1", paddingTop:6, marginTop:4 }}>
          <span>TOTAL</span><span>₹{total.toFixed(2)}</span>
        </div>
      </div>
      {data.footer&&<div style={{ textAlign:"center", fontSize:11, color:"#475569", marginTop:12, borderTop:"1px dashed #CBD5E1", paddingTop:8 }}>{data.footer}</div>}
    </div>
  );
}

export default function RestaurantBillPage() {
  const [data, setData] = useState({ restaurantName:"", address:"", phone:"", gstin:"", logoUrl:"", billNo:`BILL-${String(Math.floor(Math.random()*9000)+1000)}`, date:new Date().toISOString().split("T")[0], tableNo:"", covers:"", waiter:"", cgst:"2.5", sgst:"2.5", serviceCharge:"10", footer:"Thank you for dining with us!" });
  const [items, setItems] = useState([defaultItem(),defaultItem()]);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);
  const upd = (k,v)=>setData(p=>({...p,[k]:v}));
  const updItem = (id,k,v)=>setItems(p=>p.map(i=>i.id===id?{...i,[k]:v}:i));

  const handlePDF = async () => {
    if (!previewRef.current||downloading) return;
    setDownloading(true);
    try {
      try { await supabase.from("save_requests").insert({ template:"restaurant-bill", print_id:`REST-${Date.now()}`, user_id:null, bill_data: { ...data, items } }); } catch(_){}
      const { default:jsPDF } = await import("jspdf");
      const { default:html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(previewRef.current,{scale:2,useCORS:true,backgroundColor:"#ffffff"});
      const pdf = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
      const pw=pdf.internal.pageSize.getWidth(),ph=pdf.internal.pageSize.getHeight();
      const s=Math.min(pw/(canvas.width*25.4/(96*2)),ph/(canvas.height*25.4/(96*2)));
      pdf.addImage(canvas.toDataURL("image/png"),"PNG",(pw-canvas.width*25.4/(96*2)*s)/2,0,canvas.width*25.4/(96*2)*s,canvas.height*25.4/(96*2)*s);
      pdf.save(`restaurant-bill-${data.billNo}.pdf`);
    } catch(e){alert("PDF failed: "+e?.message);}
    finally{setDownloading(false);}
  };

  const S=({title,children})=>(<div style={{ background:"#fff", borderRadius:16, border:"1px solid #E2E8F0", padding:"20px 24px", marginBottom:16 }}><h2 style={{ fontSize:13, fontWeight:700, color:"#F97316", margin:"0 0 16px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</h2>{children}</div>);

  return (
    <>
      <Helmet>
        <title>Free Restaurant Bill Generator — Food Receipt with CGST/SGST | OpsTools</title>
        <meta name="description" content="Generate restaurant bills with table number, menu items, CGST and SGST. Free, no login, instant PDF." />
        <meta property="og:title" content="Free Restaurant Bill Generator — Food Receipt with CGST/SGST | OpsTools" />
        <meta property="og:description" content="Generate restaurant bills with table number, menu items, CGST and SGST. Free, no login, instant PDF." />
        <meta property="og:url" content="https://www.opstools.ai/documents/restaurant-bill" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Restaurant Bill Generator — Food Receipt with CGST/SGST | OpsTools" />
        <meta name="twitter:description" content="Generate restaurant bills with table number, menu items, CGST and SGST. Free, no login, instant PDF." />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>
    <div style={{ backgroundColor:"#F8FAFC", minHeight:"100vh" }}>
      <style>{`@media(max-width:768px){.rb-grid{grid-template-columns:1fr!important;}.rb-prev{display:none!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#431407 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#FDBA74" }}><a href="/" style={{ color:"#FDBA74", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span><a href="/documents" style={{ color:"#FDBA74", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span><span style={{ color:"#FED7AA" }}>Restaurant Bill</span></nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Restaurant Bill Generator</h1>
          <p style={{ fontSize:14, color:"#FDBA74", margin:0 }}>Thermal-style restaurant bills with CGST/SGST and service charge.</p>
        </div>
      </section>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div className="rb-grid" style={{ display:"grid", gridTemplateColumns:"1fr 420px", gap:28, alignItems:"start" }}>
          <div>
            <S title="Restaurant Details">
              <Field label="Restaurant Name" value={data.restaurantName} onChange={v=>upd("restaurantName",v)} placeholder="The Grand Restaurant" />
              <Field label="Address" value={data.address} onChange={v=>upd("address",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Phone" value={data.phone} onChange={v=>upd("phone",v)} />
                <Field label="GSTIN" value={data.gstin} onChange={v=>upd("gstin",v)} />
                <Field label="Logo URL" value={data.logoUrl} onChange={v=>upd("logoUrl",v)} placeholder="https://..." />
              </div>
            </S>
            <S title="Bill Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Bill No." value={data.billNo} onChange={v=>upd("billNo",v)} />
                <Field label="Date" value={data.date} onChange={v=>upd("date",v)} type="date" />
                <Field label="Table No." value={data.tableNo} onChange={v=>upd("tableNo",v)} placeholder="T-05" />
                <Field label="Covers (pax)" value={data.covers} onChange={v=>upd("covers",v)} type="number" placeholder="2" />
                <Field label="Waiter Name" value={data.waiter} onChange={v=>upd("waiter",v)} placeholder="Ramesh" />
              </div>
            </S>
            <S title="Tax & Charges">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:12 }}>
                <Field label="CGST %" value={data.cgst} onChange={v=>upd("cgst",v)} type="number" placeholder="2.5" />
                <Field label="SGST %" value={data.sgst} onChange={v=>upd("sgst",v)} type="number" placeholder="2.5" />
                <Field label="Service Charge %" value={data.serviceCharge} onChange={v=>upd("serviceCharge",v)} type="number" placeholder="10" />
              </div>
            </S>
            <S title="Menu Items">
              {items.map((item,idx)=>(
                <div key={item.id} style={{ background:"#F8FAFC", borderRadius:12, padding:"12px 14px", marginBottom:10, border:"1px solid #E2E8F0", position:"relative" }}>
                  {items.length>1&&<button onClick={()=>setItems(p=>p.filter(i=>i.id!==item.id))} style={{ position:"absolute", top:8, right:8, background:"#FEF2F2", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:"#DC2626", fontSize:14 }}>×</button>}
                  <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr 1fr", gap:8 }}>
                    <Field label={`Item ${idx+1}`} value={item.name} onChange={v=>updItem(item.id,"name",v)} placeholder="Paneer Butter Masala" small />
                    <Field label="Qty" value={item.qty} onChange={v=>updItem(item.id,"qty",Number(v))} type="number" small />
                    <Field label="Rate ₹" value={item.rate} onChange={v=>updItem(item.id,"rate",Number(v))} type="number" small />
                  </div>
                </div>
              ))}
              <button onClick={()=>setItems(p=>[...p,defaultItem()])} style={{ width:"100%", padding:10, borderRadius:10, border:"1.5px dashed #F97316", background:"#FFF7ED", color:"#EA580C", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Item</button>
            </S>
            <S title="Footer Message">
              <Field label="Footer Note" value={data.footer} onChange={v=>upd("footer",v)} />
            </S>
          </div>
          <div className="rb-prev" style={{ position:"sticky", top:88 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#64748B", margin:0 }}>Live Preview</p>
              <button onClick={handlePDF} disabled={downloading} style={{ background:"linear-gradient(135deg,#F97316,#EA580C)", border:"none", borderRadius:8, padding:"6px 16px", color:"#fff", fontSize:13, fontWeight:600, cursor:downloading?"wait":"pointer" }}>{downloading?"Saving…":"Save PDF"}</button>
            </div>
            <div style={{ transform:"scale(0.9)", transformOrigin:"top left", width:"111%", marginBottom:"-10%" }}>
              <div ref={previewRef}><RestaurantPreview data={data} items={items} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
