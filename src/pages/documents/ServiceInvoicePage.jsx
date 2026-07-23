import { Helmet } from 'react-helmet-async';
import { useState, useRef } from "react";
import { supabase } from "../../supabase-public.js";

function Field({ label, value, onChange, placeholder, type="text", small }) {
  return (
    <div style={{ marginBottom:small?8:12 }}>
      {label&&<label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder} onChange={e=>onChange&&onChange(e.target.value)}
        style={{ width:"100%", height:small?32:38, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 10px", fontSize:13, color:"#0F172A", outline:"none", boxSizing:"border-box", background:"#fff" }}
        onFocus={e=>e.target.style.borderColor="#0891B2"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
    </div>
  );
}

const defaultItem = () => ({ id:Date.now()+Math.random(), description:"", qty:1, unit:"Service", rate:0, tax:18 });

function ServicePreview({ data, provider, client, items }) {
  const subtotal = items.reduce((s,i)=>s+i.qty*i.rate,0);
  const tax = items.reduce((s,i)=>s+i.qty*i.rate*i.tax/100,0);
  const total = subtotal+tax-(Number(data.discount)||0);
  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:12, color:"#1a1a1a", padding:"32px 40px" }}>
      <div style={{ background:"linear-gradient(135deg,#0891B2,#0E7490)", borderRadius:12, padding:"20px 24px", marginBottom:24, color:"#fff", display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
        <div>
          {data.logoUrl&&<img src={data.logoUrl} alt="logo" style={{ maxHeight:40, maxWidth:120, objectFit:"contain", marginBottom:8, display:"block", filter:"brightness(0) invert(1)" }}/>}
          <div style={{ fontSize:18, fontWeight:800 }}>{provider.name||"Service Provider"}</div>
          <div style={{ fontSize:11, opacity:0.8, marginTop:3, lineHeight:1.6 }}>
            {provider.address&&<div>{provider.address}</div>}
            {provider.gstin&&<div>GSTIN: {provider.gstin}</div>}
            {provider.email&&<div>{provider.email}</div>}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:20, fontWeight:900 }}>SERVICE INVOICE</div>
          <div style={{ fontSize:11, opacity:0.8, marginTop:6 }}>
            <div>No: {data.invoiceNo||"—"}</div>
            <div>Date: {data.date?new Date(data.date+"T00:00:00").toLocaleDateString("en-IN"):"—"}</div>
            {data.dueDate&&<div>Due: {new Date(data.dueDate+"T00:00:00").toLocaleDateString("en-IN")}</div>}
          </div>
        </div>
      </div>
      <div style={{ background:"#ECFEFF", borderRadius:8, padding:"12px 16px", marginBottom:20, border:"1px solid #A5F3FC" }}>
        <div style={{ fontSize:10, fontWeight:700, color:"#0891B2", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Bill To</div>
        <div style={{ fontWeight:700, fontSize:13 }}>{client.name||"Client Name"}</div>
        <div style={{ fontSize:11, color:"#475569", lineHeight:1.7 }}>
          {client.address&&<span>{client.address}<br/></span>}
          {client.gstin&&<span>GSTIN: {client.gstin}<br/></span>}
          {client.email&&<span>{client.email}</span>}
        </div>
      </div>
      {data.serviceDesc&&<div style={{ background:"#ECFEFF", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:12, color:"#0369A1", fontWeight:500, border:"1px solid #A5F3FC" }}><strong>Service: </strong>{data.serviceDesc}</div>}
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:16 }}>
        <thead><tr style={{ background:"#0891B2", color:"#fff" }}>
          {["#","Description","Unit","Qty","Rate (₹)","Tax %","Amount (₹)"].map(h=><th key={h} style={{ padding:"8px 10px", fontSize:10, fontWeight:700, textAlign:h==="Description"?"left":"right" }}>{h}</th>)}
        </tr></thead>
        <tbody>{items.map((item,i)=>{
          const amt=item.qty*item.rate*(1+item.tax/100);
          return <tr key={item.id} style={{ borderBottom:"1px solid #E2E8F0", background:i%2===0?"#fff":"#ECFEFF" }}>
            <td style={{ padding:"9px 10px", textAlign:"right", color:"#94A3B8" }}>{i+1}</td>
            <td style={{ padding:"9px 10px" }}>{item.description||"—"}</td>
            <td style={{ padding:"9px 10px", textAlign:"right", fontSize:11, color:"#64748B" }}>{item.unit}</td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{item.qty}</td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{item.rate.toFixed(2)}</td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{item.tax}%</td>
            <td style={{ padding:"9px 10px", textAlign:"right", fontWeight:700 }}>{amt.toFixed(2)}</td>
          </tr>;
        })}</tbody>
      </table>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <div style={{ width:220 }}>
          {[["Subtotal",subtotal],["Tax",tax],Number(data.discount)>0?["Discount",-(Number(data.discount)||0)]:null].filter(Boolean).map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #F1F5F9", fontSize:12 }}><span style={{ color:"#64748B" }}>{l}</span><span>{v<0?`-₹${Math.abs(v).toFixed(2)}`:`₹${v.toFixed(2)}`}</span></div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 12px", background:"#0891B2", color:"#fff", borderRadius:8, marginTop:8, fontSize:14, fontWeight:800 }}><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        </div>
      </div>
      {data.terms&&<div style={{ border:"1px solid #E2E8F0", borderRadius:8, padding:"12px 14px", fontSize:11, color:"#475569" }}><strong style={{ color:"#0891B2" }}>Terms: </strong>{data.terms}</div>}
    </div>
  );
}

export default function ServiceInvoicePage() {
  const [data, setData] = useState({ invoiceNo:`SRV-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`, date:new Date().toISOString().split("T")[0], dueDate:"", serviceDesc:"", logoUrl:"", discount:"", terms:"Payment due within 15 days of invoice date." });
  const [provider, setProvider] = useState({ name:"", address:"", gstin:"", email:"", phone:"" });
  const [client, setClient] = useState({ name:"", address:"", gstin:"", email:"" });
  const [items, setItems] = useState([defaultItem()]);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);
  const upd=setter=>(k,v)=>setter(p=>({...p,[k]:v}));
  const updItem=(id,k,v)=>setItems(p=>p.map(i=>i.id===id?{...i,[k]:v}:i));

  const handlePDF = async () => {
    if (!previewRef.current||downloading) return;
    setDownloading(true);
    try {
      try { await supabase.from("save_requests").insert({ template:"service-invoice", print_id:`SRV-${Date.now()}`, user_id:null, bill_data: { ...data, provider, client, items } }); } catch(_){}
      const { default:jsPDF } = await import("jspdf");
      const { default:html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(previewRef.current,{scale:2,useCORS:true,backgroundColor:"#ffffff"});
      const pdf = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
      const pw=pdf.internal.pageSize.getWidth(),ph=pdf.internal.pageSize.getHeight();
      const s=Math.min(pw/(canvas.width*25.4/(96*2)),ph/(canvas.height*25.4/(96*2)));
      pdf.addImage(canvas.toDataURL("image/png"),"PNG",(pw-canvas.width*25.4/(96*2)*s)/2,0,canvas.width*25.4/(96*2)*s,canvas.height*25.4/(96*2)*s);
      pdf.save(`service-invoice-${data.invoiceNo}.pdf`);
    } catch(e){alert("PDF failed: "+e?.message);}
    finally{setDownloading(false);}
  };

  const S=({title,children})=>(<div style={{ background:"#fff", borderRadius:16, border:"1px solid #E2E8F0", padding:"20px 24px", marginBottom:16 }}><h2 style={{ fontSize:13, fontWeight:700, color:"#0891B2", margin:"0 0 16px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</h2>{children}</div>);

  return (
    <>
      <Helmet>
        <title>Free Service Invoice Generator India — GST Service Bills | OpsTools</title>
        <meta name="description" content="Generate service invoices with GST and payment terms for contractors and agencies. Free, instant PDF." />
        <meta property="og:title" content="Free Service Invoice Generator India — GST Service Bills | OpsTools" />
        <meta property="og:description" content="Generate service invoices with GST and payment terms for contractors and agencies. Free, instant PDF." />
        <meta property="og:url" content="https://www.opstools.ai/documents/service-invoice" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Service Invoice Generator India — GST Service Bills | OpsTools" />
        <meta name="twitter:description" content="Generate service invoices with GST and payment terms for contractors and agencies. Free, instant PDF." />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>
    <div style={{ backgroundColor:"#F8FAFC", minHeight:"100vh" }}>
      <style>{`@media(max-width:768px){.si-grid{grid-template-columns:1fr!important;}.si-prev{display:none!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#082f49 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#67E8F9" }}><a href="/" style={{ color:"#67E8F9", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span><a href="/documents" style={{ color:"#67E8F9", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span><span style={{ color:"#A5F3FC" }}>Service Invoice</span></nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Service Invoice Generator</h1>
          <p style={{ fontSize:14, color:"#67E8F9", margin:0 }}>Professional service invoices with line items, GST, and payment terms.</p>
        </div>
      </section>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div className="si-grid" style={{ display:"grid", gridTemplateColumns:"1fr 500px", gap:28, alignItems:"start" }}>
          <div>
            <S title="Invoice Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Invoice No." value={data.invoiceNo} onChange={v=>upd(setData)("invoiceNo",v)} />
                <Field label="Date" value={data.date} onChange={v=>upd(setData)("date",v)} type="date" />
                <Field label="Due Date" value={data.dueDate} onChange={v=>upd(setData)("dueDate",v)} type="date" />
                <Field label="Discount ₹" value={data.discount} onChange={v=>upd(setData)("discount",v)} type="number" />
              </div>
              <Field label="Service Description (optional)" value={data.serviceDesc} onChange={v=>upd(setData)("serviceDesc",v)} placeholder="Annual maintenance contract for AC units" />
              <Field label="Logo URL" value={data.logoUrl} onChange={v=>upd(setData)("logoUrl",v)} placeholder="https://..." />
            </S>
            <S title="Service Provider">
              <Field label="Business Name" value={provider.name} onChange={v=>upd(setProvider)("name",v)} />
              <Field label="Address" value={provider.address} onChange={v=>upd(setProvider)("address",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="GSTIN" value={provider.gstin} onChange={v=>upd(setProvider)("gstin",v)} />
                <Field label="Email" value={provider.email} onChange={v=>upd(setProvider)("email",v)} />
                <Field label="Phone" value={provider.phone} onChange={v=>upd(setProvider)("phone",v)} />
              </div>
            </S>
            <S title="Client">
              <Field label="Client Name" value={client.name} onChange={v=>upd(setClient)("name",v)} />
              <Field label="Address" value={client.address} onChange={v=>upd(setClient)("address",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="GSTIN" value={client.gstin} onChange={v=>upd(setClient)("gstin",v)} />
                <Field label="Email" value={client.email} onChange={v=>upd(setClient)("email",v)} />
              </div>
            </S>
            <S title="Services">
              {items.map((item,idx)=>(
                <div key={item.id} style={{ background:"#F8FAFC", borderRadius:12, padding:"14px 16px", marginBottom:10, border:"1px solid #E2E8F0", position:"relative" }}>
                  {items.length>1&&<button onClick={()=>setItems(p=>p.filter(i=>i.id!==item.id))} style={{ position:"absolute", top:10, right:10, background:"#FEF2F2", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:"#DC2626", fontSize:14 }}>×</button>}
                  <Field label={`Service ${idx+1}`} value={item.description} onChange={v=>updItem(item.id,"description",v)} placeholder="Annual maintenance visit" small />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr 1fr", gap:8 }}>
                    <Field label="Unit" value={item.unit} onChange={v=>updItem(item.id,"unit",v)} placeholder="Visit" small />
                    <Field label="Qty" value={item.qty} onChange={v=>updItem(item.id,"qty",Number(v))} type="number" small />
                    <Field label="Rate ₹" value={item.rate} onChange={v=>updItem(item.id,"rate",Number(v))} type="number" small />
                    <Field label="Tax %" value={item.tax} onChange={v=>updItem(item.id,"tax",Number(v))} type="number" small />
                  </div>
                </div>
              ))}
              <button onClick={()=>setItems(p=>[...p,defaultItem()])} style={{ width:"100%", padding:10, borderRadius:10, border:"1.5px dashed #0891B2", background:"#ECFEFF", color:"#0369A1", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Service</button>
            </S>
            <S title="Terms">
              <textarea value={data.terms} onChange={e=>upd(setData)("terms",e.target.value)} rows={2} style={{ width:"100%", border:"1.5px solid #E2E8F0", borderRadius:8, padding:"8px 12px", fontSize:13, color:"#0F172A", resize:"vertical", boxSizing:"border-box", outline:"none" }}/>
            </S>
          </div>
          <div className="si-prev" style={{ position:"sticky", top:88 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#64748B", margin:0 }}>Live Preview</p>
              <button onClick={handlePDF} disabled={downloading} style={{ background:"linear-gradient(135deg,#0891B2,#0E7490)", border:"none", borderRadius:8, padding:"6px 16px", color:"#fff", fontSize:13, fontWeight:600, cursor:downloading?"wait":"pointer" }}>{downloading?"Saving…":"Save PDF"}</button>
            </div>
            <div style={{ transform:"scale(0.68)", transformOrigin:"top left", width:"147%", marginBottom:"-32%" }}>
              <div ref={previewRef}><ServicePreview data={data} provider={provider} client={client} items={items} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
