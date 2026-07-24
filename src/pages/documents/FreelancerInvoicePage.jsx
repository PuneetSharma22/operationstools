import { Helmet } from 'react-helmet-async';
import { useState, useRef } from "react";
import { supabase } from "../../supabase";

function Field({ label, value, onChange, placeholder, type="text", small }) {
  return (
    <div style={{ marginBottom:small?8:12 }}>
      {label&&<label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder} onChange={e=>onChange&&onChange(e.target.value)}
        style={{ width:"100%", height:small?32:38, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 10px", fontSize:13, color:"#0F172A", outline:"none", boxSizing:"border-box", background:"#fff" }}
        onFocus={e=>e.target.style.borderColor="#8B5CF6"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
    </div>
  );
}

const defaultItem = () => ({ id:Date.now()+Math.random(), description:"", hours:0, rate:0 });

function FreelancerPreview({ data, freelancer, client, items }) {
  const subtotal = items.reduce((s,i)=>s+(data.billingType==="hourly"?i.hours*i.rate:i.hours*i.rate),0);
  const tax = subtotal*(Number(data.tax)||18)/100;
  const total = subtotal + tax - (Number(data.discount)||0);
  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:12, color:"#1a1a1a", padding:"32px 40px" }}>
      <div style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)", borderRadius:12, padding:"24px 28px", marginBottom:24, color:"#fff" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
          <div>
            {data.logoUrl&&<img src={data.logoUrl} alt="logo" style={{ maxHeight:40, maxWidth:120, objectFit:"contain", marginBottom:8, display:"block", filter:"brightness(0) invert(1)" }}/>}
            <div style={{ fontSize:20, fontWeight:800 }}>{freelancer.name||"Your Name"}</div>
            <div style={{ fontSize:11, opacity:0.8, marginTop:3, lineHeight:1.7 }}>
              {freelancer.title&&<div>{freelancer.title}</div>}
              {freelancer.email&&<div>{freelancer.email}</div>}
              {freelancer.phone&&<div>{freelancer.phone}</div>}
              {freelancer.website&&<div>{freelancer.website}</div>}
            </div>
          </div>
          <div style={{ textAlign:"right" }}>
            <div style={{ fontSize:22, fontWeight:900, opacity:0.9 }}>INVOICE</div>
            <div style={{ fontSize:11, opacity:0.8, marginTop:8 }}>
              <div>No: {data.invoiceNo||"—"}</div>
              <div>Date: {data.date?new Date(data.date+"T00:00:00").toLocaleDateString("en-IN"):"—"}</div>
              {data.dueDate&&<div>Due: {new Date(data.dueDate+"T00:00:00").toLocaleDateString("en-IN")}</div>}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16, marginBottom:20 }}>
        <div style={{ background:"#F5F3FF", borderRadius:8, padding:"12px 14px" }}>
          <div style={{ fontSize:10, fontWeight:700, color:"#7C3AED", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Bill To</div>
          <div style={{ fontWeight:700, fontSize:13 }}>{client.name||"Client Name"}</div>
          <div style={{ fontSize:11, color:"#475569", lineHeight:1.7, marginTop:2 }}>
            {client.company&&<div>{client.company}</div>}
            {client.email&&<div>{client.email}</div>}
            {client.address&&<div>{client.address}</div>}
          </div>
        </div>
        <div style={{ background:"#F5F3FF", borderRadius:8, padding:"12px 14px" }}>
          {data.projectName&&<div style={{ fontWeight:700, fontSize:13, marginBottom:4 }}>Project: {data.projectName}</div>}
          {data.projectDesc&&<div style={{ fontSize:11, color:"#475569", lineHeight:1.65 }}>{data.projectDesc}</div>}
        </div>
      </div>
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:16 }}>
        <thead><tr style={{ background:"#7C3AED", color:"#fff" }}>
          {["#","Description",data.billingType==="hourly"?"Hours":"Qty","Rate (₹)","Amount (₹)"].map(h=><th key={h} style={{ padding:"8px 10px", fontSize:10, fontWeight:700, textAlign:h==="Description"?"left":"right" }}>{h}</th>)}
        </tr></thead>
        <tbody>{items.map((item,i)=>{
          const amt=item.hours*item.rate;
          return <tr key={item.id} style={{ borderBottom:"1px solid #E2E8F0", background:i%2===0?"#fff":"#F5F3FF" }}>
            <td style={{ padding:"9px 10px", textAlign:"right", color:"#94A3B8" }}>{i+1}</td>
            <td style={{ padding:"9px 10px" }}>{item.description||"—"}</td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{item.hours}</td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{item.rate.toFixed(2)}</td>
            <td style={{ padding:"9px 10px", textAlign:"right", fontWeight:700 }}>{amt.toFixed(2)}</td>
          </tr>;
        })}</tbody>
      </table>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <div style={{ width:220 }}>
          {[["Subtotal",subtotal],[`Tax (${data.tax||18}%)`,tax],Number(data.discount)>0?["Discount",-(Number(data.discount)||0)]:null].filter(Boolean).map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #F1F5F9", fontSize:12 }}><span style={{ color:"#64748B" }}>{l}</span><span>{v<0?`-₹${Math.abs(v).toFixed(2)}`:`₹${v.toFixed(2)}`}</span></div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 12px", background:"#7C3AED", color:"#fff", borderRadius:8, marginTop:8, fontSize:14, fontWeight:800 }}><span>Total Due</span><span>₹{total.toFixed(2)}</span></div>
        </div>
      </div>
      {(freelancer.bankName||freelancer.upi)&&(
        <div style={{ border:"1px solid #E2E8F0", borderRadius:8, padding:"12px 14px", fontSize:11 }}>
          <div style={{ fontWeight:700, color:"#7C3AED", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em", fontSize:10 }}>Payment Details</div>
          {freelancer.bankName&&<div><span style={{ color:"#64748B" }}>Bank: </span>{freelancer.bankName}</div>}
          {freelancer.accountNo&&<div><span style={{ color:"#64748B" }}>A/C: </span>{freelancer.accountNo}</div>}
          {freelancer.ifsc&&<div><span style={{ color:"#64748B" }}>IFSC: </span>{freelancer.ifsc}</div>}
          {freelancer.upi&&<div><span style={{ color:"#64748B" }}>UPI: </span>{freelancer.upi}</div>}
        </div>
      )}
      {data.notes&&<div style={{ marginTop:12, border:"1px solid #E2E8F0", borderRadius:8, padding:"12px 14px", fontSize:11, color:"#475569" }}><strong style={{ color:"#7C3AED" }}>Notes: </strong>{data.notes}</div>}
    </div>
  );
}

export default function FreelancerInvoicePage() {
  const [data, setData] = useState({ invoiceNo:`FREEL-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`, date:new Date().toISOString().split("T")[0], dueDate:"", projectName:"", projectDesc:"", billingType:"hourly", tax:"18", discount:"", logoUrl:"", notes:"Payment due within 7 days." });
  const [freelancer, setFreelancer] = useState({ name:"", title:"", email:"", phone:"", website:"", bankName:"", accountNo:"", ifsc:"", upi:"" });
  const [client, setClient] = useState({ name:"", company:"", email:"", address:"" });
  const [items, setItems] = useState([defaultItem()]);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);
  const upd=setter=>(k,v)=>setter(p=>({...p,[k]:v}));
  const updItem=(id,k,v)=>setItems(p=>p.map(i=>i.id===id?{...i,[k]:v}:i));

  const handlePDF = async () => {
    if (!previewRef.current||downloading) return;
    setDownloading(true);
    try {
      try { await supabase.from("save_requests").insert({ template:"freelancer-invoice", print_id:`FREEL-${Date.now()}`, user_id:null, bill_data: { ...data, freelancer, client, items } }); } catch(_){}
      const { default:jsPDF } = await import("jspdf");
      const { default:html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(previewRef.current,{scale:2,useCORS:true,backgroundColor:"#ffffff"});
      const pdf = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
      const pw=pdf.internal.pageSize.getWidth(),ph=pdf.internal.pageSize.getHeight();
      const s=Math.min(pw/(canvas.width*25.4/(96*2)),ph/(canvas.height*25.4/(96*2)));
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92),"JPEG",(pw-canvas.width*25.4/(96*2)*s)/2,0,canvas.width*25.4/(96*2)*s,canvas.height*25.4/(96*2)*s);
      pdf.save(`freelancer-invoice-${data.invoiceNo}.pdf`);
    } catch(e){
      const isTainted = /tainted|cross-origin|SecurityError/i.test(e?.message || e?.name || "");
      alert(isTainted
        ? "PDF failed: the logo image doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again."
        : "PDF failed: " + (e?.message || "Unknown error"));
    }
    finally{setDownloading(false);}
  };

  const S=({title,children})=>(<div style={{ background:"#fff", borderRadius:16, border:"1px solid #E2E8F0", padding:"20px 24px", marginBottom:16 }}><h2 style={{ fontSize:13, fontWeight:700, color:"#7C3AED", margin:"0 0 16px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</h2>{children}</div>);

  return (
    <>
      <Helmet>
        <title>Free Freelancer Invoice Generator India — Hourly and Fixed Price | OpsTools</title>
        <meta name="description" content="Generate freelancer invoices with hourly or fixed pricing and tax. Free, no login, instant PDF." />
        <meta property="og:title" content="Free Freelancer Invoice Generator India — Hourly and Fixed Price | OpsTools" />
        <meta property="og:description" content="Generate freelancer invoices with hourly or fixed pricing and tax. Free, no login, instant PDF." />
        <meta property="og:url" content="https://www.opstools.ai/documents/freelancer-invoice" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Free Freelancer Invoice Generator India — Hourly and Fixed Price | OpsTools" />
        <meta name="twitter:description" content="Generate freelancer invoices with hourly or fixed pricing and tax. Free, no login, instant PDF." />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>
    <div style={{ backgroundColor:"#F8FAFC", minHeight:"100vh" }}>
      <style>{`@media(max-width:1023px){.fl-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .fl-grid{grid-template-columns:1fr!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#2e1065 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#C4B5FD" }}><a href="/" style={{ color:"#C4B5FD", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span><a href="/documents" style={{ color:"#C4B5FD", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span><span style={{ color:"#DDD6FE" }}>Freelancer Invoice</span></nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Freelancer Invoice Generator</h1>
          <p style={{ fontSize:14, color:"#C4B5FD", margin:0 }}>Professional invoices for freelancers — hourly or fixed price, with tax and payment details.</p>
        </div>
      </section>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div className="fl-grid" style={{ display:"grid", gridTemplateColumns:"1fr 500px", gap:28, alignItems:"start" }}>
          <div>
            <S title="Invoice Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Invoice No." value={data.invoiceNo} onChange={v=>upd(setData)("invoiceNo",v)} />
                <Field label="Invoice Date" value={data.date} onChange={v=>upd(setData)("date",v)} type="date" />
                <Field label="Due Date" value={data.dueDate} onChange={v=>upd(setData)("dueDate",v)} type="date" />
                <Field label="Tax %" value={data.tax} onChange={v=>upd(setData)("tax",v)} type="number" placeholder="18" />
                <Field label="Discount (₹)" value={data.discount} onChange={v=>upd(setData)("discount",v)} type="number" placeholder="0" />
                <Field label="Logo URL" value={data.logoUrl} onChange={v=>upd(setData)("logoUrl",v)} placeholder="https://..." />
              </div>
              <div>
                <label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:8, textTransform:"uppercase", letterSpacing:"0.06em" }}>Billing Type</label>
                <div style={{ display:"flex", gap:8 }}>
                  {[{key:"hourly",label:"Hourly"},{key:"fixed",label:"Fixed Price"}].map(opt=>(
                    <button key={opt.key} onClick={()=>upd(setData)("billingType",opt.key)} style={{ flex:1, padding:"9px 12px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", border:data.billingType===opt.key?"1.5px solid #7C3AED":"1.5px solid #E2E8F0", background:data.billingType===opt.key?"#F5F3FF":"#fff", color:data.billingType===opt.key?"#7C3AED":"#64748B" }}>{opt.label}</button>
                  ))}
                </div>
              </div>
            </S>
            <S title="Your Details">
              <Field label="Full Name" value={freelancer.name} onChange={v=>upd(setFreelancer)("name",v)} placeholder="Rajesh Sharma" />
              <Field label="Title / Profession" value={freelancer.title} onChange={v=>upd(setFreelancer)("title",v)} placeholder="UI/UX Designer" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Email" value={freelancer.email} onChange={v=>upd(setFreelancer)("email",v)} />
                <Field label="Phone" value={freelancer.phone} onChange={v=>upd(setFreelancer)("phone",v)} />
                <Field label="Website" value={freelancer.website} onChange={v=>upd(setFreelancer)("website",v)} placeholder="yoursite.com" />
                <Field label="UPI ID" value={freelancer.upi} onChange={v=>upd(setFreelancer)("upi",v)} placeholder="name@upi" />
                <Field label="Bank Name" value={freelancer.bankName} onChange={v=>upd(setFreelancer)("bankName",v)} />
                <Field label="Account No." value={freelancer.accountNo} onChange={v=>upd(setFreelancer)("accountNo",v)} />
                <Field label="IFSC" value={freelancer.ifsc} onChange={v=>upd(setFreelancer)("ifsc",v)} />
              </div>
            </S>
            <S title="Client Details">
              <Field label="Client Name" value={client.name} onChange={v=>upd(setClient)("name",v)} />
              <Field label="Company" value={client.company} onChange={v=>upd(setClient)("company",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Email" value={client.email} onChange={v=>upd(setClient)("email",v)} />
                <Field label="Address" value={client.address} onChange={v=>upd(setClient)("address",v)} />
              </div>
            </S>
            <S title="Project">
              <Field label="Project Name" value={data.projectName} onChange={v=>upd(setData)("projectName",v)} placeholder="Website Redesign" />
              <Field label="Project Description" value={data.projectDesc} onChange={v=>upd(setData)("projectDesc",v)} placeholder="Brief description of work done" />
            </S>
            <S title="Line Items">
              {items.map((item,idx)=>(
                <div key={item.id} style={{ background:"#F8FAFC", borderRadius:12, padding:"14px 16px", marginBottom:10, border:"1px solid #E2E8F0", position:"relative" }}>
                  {items.length>1&&<button onClick={()=>setItems(p=>p.filter(i=>i.id!==item.id))} style={{ position:"absolute", top:10, right:10, background:"#FEF2F2", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:"#DC2626", fontSize:14 }}>×</button>}
                  <Field label={`Item ${idx+1}`} value={item.description} onChange={v=>updItem(item.id,"description",v)} placeholder="Logo design" small />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
                    <Field label={data.billingType==="hourly"?"Hours":"Qty"} value={item.hours} onChange={v=>updItem(item.id,"hours",Number(v))} type="number" small />
                    <Field label="Rate ₹" value={item.rate} onChange={v=>updItem(item.id,"rate",Number(v))} type="number" small />
                  </div>
                  <div style={{ fontSize:12, color:"#7C3AED", fontWeight:700, marginTop:6 }}>= ₹{(item.hours*item.rate).toFixed(2)}</div>
                </div>
              ))}
              <button onClick={()=>setItems(p=>[...p,defaultItem()])} style={{ width:"100%", padding:10, borderRadius:10, border:"1.5px dashed #7C3AED", background:"#F5F3FF", color:"#5B21B6", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Item</button>
            </S>
            <S title="Notes">
              <textarea value={data.notes} onChange={e=>upd(setData)("notes",e.target.value)} rows={2} style={{ width:"100%", border:"1.5px solid #E2E8F0", borderRadius:8, padding:"8px 12px", fontSize:13, color:"#0F172A", resize:"vertical", boxSizing:"border-box", outline:"none" }}/>
            </S>
          </div>
          <div className="fl-prev" style={{ position:"sticky", top:88 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#64748B", margin:0 }}>Live Preview</p>
              <button onClick={handlePDF} disabled={downloading} style={{ background:"linear-gradient(135deg,#7C3AED,#5B21B6)", border:"none", borderRadius:8, padding:"6px 16px", color:"#fff", fontSize:13, fontWeight:600, cursor:downloading?"wait":"pointer" }}>{downloading?"Saving…":"Save PDF"}</button>
            </div>
            <div className="preview-scale-wrap" style={{ transform:"scale(0.68)", transformOrigin:"top left", width:"147%", marginBottom:"-32%" }}>
              <div ref={previewRef}><FreelancerPreview data={data} freelancer={freelancer} client={client} items={items} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
