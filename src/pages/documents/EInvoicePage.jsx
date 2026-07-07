import { useState, useRef } from "react";
import { supabase } from "../../supabase-public.js";

function Field({ label, value, onChange, placeholder, type="text", small }) {
  return (
    <div style={{ marginBottom:small?8:12 }}>
      {label&&<label style={{ fontSize:11, fontWeight:600, color:"#64748B", display:"block", marginBottom:4, textTransform:"uppercase", letterSpacing:"0.06em" }}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder} onChange={e=>onChange&&onChange(e.target.value)}
        style={{ width:"100%", height:small?32:38, border:"1.5px solid #E2E8F0", borderRadius:8, padding:"0 10px", fontSize:13, color:"#0F172A", outline:"none", boxSizing:"border-box", background:"#fff" }}
        onFocus={e=>e.target.style.borderColor="#0F172A"} onBlur={e=>e.target.style.borderColor="#E2E8F0"} />
    </div>
  );
}

const defaultItem = () => ({ id:Date.now()+Math.random(), description:"", hsn:"", qty:1, rate:0, cgst:9, sgst:9, igst:0 });

function EInvoicePreview({ data, supplier, buyer, items }) {
  const subtotal = items.reduce((s,i)=>s+i.qty*i.rate,0);
  const totalTax = items.reduce((s,i)=>s+i.qty*i.rate*(i.cgst+i.sgst+i.igst)/100,0);
  const total = subtotal+totalTax;
  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:11, color:"#1a1a1a", padding:"28px 32px", border:"1px solid #E2E8F0" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:12, paddingBottom:12, borderBottom:"1px solid #0F172A" }}>
        <div style={{ fontSize:10, fontWeight:700, color:"#64748B", letterSpacing:"0.15em", textTransform:"uppercase" }}>Original for Recipient</div>
        <div style={{ fontSize:18, fontWeight:900, color:"#0F172A" }}>E-INVOICE</div>
      </div>
      {data.irn&&(
        <div style={{ background:"#F8FAFC", border:"1px solid #E2E8F0", borderRadius:6, padding:"8px 12px", marginBottom:12, fontSize:10 }}>
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            <div><span style={{ color:"#64748B" }}>IRN: </span><strong style={{ fontSize:9, wordBreak:"break-all" }}>{data.irn}</strong></div>
            <div><span style={{ color:"#64748B" }}>Ack No: </span><strong>{data.ackNo||"—"}</strong></div>
            <div><span style={{ color:"#64748B" }}>Ack Date: </span><strong>{data.ackDate?new Date(data.ackDate+"T00:00:00").toLocaleDateString("en-IN"):"—"}</strong></div>
            {data.qrCode&&<div><span style={{ color:"#64748B" }}>QR: </span><strong style={{ fontSize:9 }}>{data.qrCode.substring(0,20)}...</strong></div>}
          </div>
        </div>
      )}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12, marginBottom:12 }}>
        <div>
          <div style={{ fontSize:9, fontWeight:700, color:"#0F172A", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6, borderBottom:"1px solid #E2E8F0", paddingBottom:4 }}>Supplier</div>
          <div style={{ fontWeight:700, fontSize:12 }}>{supplier.name||"—"}</div>
          <div style={{ fontSize:10, color:"#475569", lineHeight:1.7 }}>
            {supplier.address&&<div>{supplier.address}</div>}
            {supplier.gstin&&<div>GSTIN: <strong>{supplier.gstin}</strong></div>}
            {supplier.pan&&<div>PAN: {supplier.pan}</div>}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:9, fontWeight:700, color:"#0F172A", textTransform:"uppercase", letterSpacing:"0.1em", marginBottom:6, borderBottom:"1px solid #E2E8F0", paddingBottom:4 }}>Buyer</div>
          <div style={{ fontWeight:700, fontSize:12 }}>{buyer.name||"—"}</div>
          <div style={{ fontSize:10, color:"#475569", lineHeight:1.7 }}>
            {buyer.address&&<div>{buyer.address}</div>}
            {buyer.gstin&&<div>GSTIN: <strong>{buyer.gstin}</strong></div>}
          </div>
        </div>
      </div>
      <div style={{ background:"#F8FAFC", borderRadius:6, padding:"8px 12px", marginBottom:12, display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:8, fontSize:10 }}>
        {[["Invoice No.",data.invoiceNo||"—"],["Date",data.date?new Date(data.date+"T00:00:00").toLocaleDateString("en-IN"):"—"],["Place of Supply",data.placeOfSupply||"—"],["Reverse Charge",data.reverseCharge?"Yes":"No"]].map(([l,v])=>(
          <div key={l}><div style={{ color:"#64748B", marginBottom:2 }}>{l}</div><strong>{v}</strong></div>
        ))}
      </div>
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:12, fontSize:10 }}>
        <thead><tr style={{ background:"#0F172A", color:"#fff" }}>
          {["#","Description","HSN","Qty","Rate","Taxable","CGST","SGST","IGST","Total"].map(h=><th key={h} style={{ padding:"6px 8px", fontWeight:700, textAlign:h==="Description"?"left":"right", fontSize:9 }}>{h}</th>)}
        </tr></thead>
        <tbody>{items.map((item,i)=>{
          const taxable=item.qty*item.rate;
          const cgstAmt=taxable*item.cgst/100, sgstAmt=taxable*item.sgst/100, igstAmt=taxable*item.igst/100;
          return <tr key={item.id} style={{ borderBottom:"1px solid #F1F5F9", background:i%2===0?"#fff":"#F8FAFC" }}>
            <td style={{ padding:"6px 8px", textAlign:"right", color:"#94A3B8" }}>{i+1}</td>
            <td style={{ padding:"6px 8px" }}>{item.description||"—"}</td>
            <td style={{ padding:"6px 8px", textAlign:"right" }}>{item.hsn||"—"}</td>
            <td style={{ padding:"6px 8px", textAlign:"right" }}>{item.qty}</td>
            <td style={{ padding:"6px 8px", textAlign:"right" }}>{item.rate.toFixed(2)}</td>
            <td style={{ padding:"6px 8px", textAlign:"right" }}>{taxable.toFixed(2)}</td>
            <td style={{ padding:"6px 8px", textAlign:"right" }}>{cgstAmt.toFixed(2)}</td>
            <td style={{ padding:"6px 8px", textAlign:"right" }}>{sgstAmt.toFixed(2)}</td>
            <td style={{ padding:"6px 8px", textAlign:"right" }}>{igstAmt.toFixed(2)}</td>
            <td style={{ padding:"6px 8px", textAlign:"right", fontWeight:700 }}>{(taxable+cgstAmt+sgstAmt+igstAmt).toFixed(2)}</td>
          </tr>;
        })}</tbody>
      </table>
      <div style={{ display:"flex", justifyContent:"flex-end" }}>
        <div style={{ width:220 }}>
          {[["Taxable Amount",subtotal],["Total Tax",totalTax]].map(([l,v])=>(
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"4px 0", borderBottom:"1px solid #F1F5F9", fontSize:11 }}><span style={{ color:"#64748B" }}>{l}</span><span>₹{v.toFixed(2)}</span></div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"8px 10px", background:"#0F172A", color:"#fff", borderRadius:6, marginTop:6, fontSize:12, fontWeight:800 }}><span>Total</span><span>₹{total.toFixed(2)}</span></div>
        </div>
      </div>
    </div>
  );
}

export default function EInvoicePage() {
  const [data, setData] = useState({ invoiceNo:`EINV-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`, date:new Date().toISOString().split("T")[0], placeOfSupply:"", reverseCharge:false, irn:"", ackNo:"", ackDate:"", qrCode:"" });
  const [supplier, setSupplier] = useState({ name:"", address:"", gstin:"", pan:"" });
  const [buyer, setBuyer] = useState({ name:"", address:"", gstin:"" });
  const [items, setItems] = useState([defaultItem()]);
  const [gstType, setGstType] = useState("cgst_sgst");
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);
  const upd=setter=>(k,v)=>setter(p=>({...p,[k]:v}));
  const updItem=(id,k,v)=>setItems(p=>p.map(i=>i.id===id?{...i,[k]:v}:i));

  const handlePDF = async () => {
    if (!previewRef.current||downloading) return;
    setDownloading(true);
    try {
      try { await supabase.from("save_requests").insert({ template:"e-invoice", print_id:`EINV-${Date.now()}`, user_id:null }); } catch(_){}
      const { default:jsPDF } = await import("jspdf");
      const { default:html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(previewRef.current,{scale:2,useCORS:true,backgroundColor:"#ffffff"});
      const pdf = new jsPDF({orientation:"portrait",unit:"mm",format:"a4"});
      const pw=pdf.internal.pageSize.getWidth(),ph=pdf.internal.pageSize.getHeight();
      const s=Math.min(pw/(canvas.width*25.4/(96*2)),ph/(canvas.height*25.4/(96*2)));
      pdf.addImage(canvas.toDataURL("image/png"),"PNG",(pw-canvas.width*25.4/(96*2)*s)/2,0,canvas.width*25.4/(96*2)*s,canvas.height*25.4/(96*2)*s);
      pdf.save(`e-invoice-${data.invoiceNo}.pdf`);
    } catch(e){alert("PDF failed: "+e?.message);}
    finally{setDownloading(false);}
  };

  const S=({title,children})=>(<div style={{ background:"#fff", borderRadius:16, border:"1px solid #E2E8F0", padding:"20px 24px", marginBottom:16 }}><h2 style={{ fontSize:13, fontWeight:700, color:"#0F172A", margin:"0 0 16px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</h2>{children}</div>);

  return (
    <div style={{ backgroundColor:"#F8FAFC", minHeight:"100vh" }}>
      <style>{`@media(max-width:768px){.ei-grid{grid-template-columns:1fr!important;}.ei-prev{display:none!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#0F172A 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#94A3B8" }}><a href="/" style={{ color:"#94A3B8", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span><a href="/documents" style={{ color:"#94A3B8", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span><span style={{ color:"#CBD5E1" }}>E-Invoice</span></nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>E-Invoice Generator</h1>
          <p style={{ fontSize:14, color:"#94A3B8", margin:0 }}>GST e-invoice format with IRN, acknowledgement number, supplier, buyer and line items.</p>
        </div>
      </section>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div className="ei-grid" style={{ display:"grid", gridTemplateColumns:"1fr 500px", gap:28, alignItems:"start" }}>
          <div>
            <S title="Invoice Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Invoice No." value={data.invoiceNo} onChange={v=>upd(setData)("invoiceNo",v)} />
                <Field label="Invoice Date" value={data.date} onChange={v=>upd(setData)("date",v)} type="date" />
                <Field label="Place of Supply" value={data.placeOfSupply} onChange={v=>upd(setData)("placeOfSupply",v)} placeholder="Maharashtra" />
              </div>
              <div style={{ display:"flex", alignItems:"center", gap:8, marginTop:4 }}>
                <input type="checkbox" checked={data.reverseCharge} onChange={e=>upd(setData)("reverseCharge",e.target.checked)} id="rc" />
                <label htmlFor="rc" style={{ fontSize:13, color:"#374151", cursor:"pointer" }}>Reverse Charge Applicable</label>
              </div>
            </S>
            <S title="IRN Details (if available)">
              <Field label="IRN (Invoice Reference Number)" value={data.irn} onChange={v=>upd(setData)("irn",v)} placeholder="64-character IRN from GST portal" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Acknowledgement No." value={data.ackNo} onChange={v=>upd(setData)("ackNo",v)} />
                <Field label="Acknowledgement Date" value={data.ackDate} onChange={v=>upd(setData)("ackDate",v)} type="date" />
              </div>
            </S>
            <S title="Supplier">
              <Field label="Business Name" value={supplier.name} onChange={v=>upd(setSupplier)("name",v)} />
              <Field label="Address" value={supplier.address} onChange={v=>upd(setSupplier)("address",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="GSTIN" value={supplier.gstin} onChange={v=>upd(setSupplier)("gstin",v)} />
                <Field label="PAN" value={supplier.pan} onChange={v=>upd(setSupplier)("pan",v)} />
              </div>
            </S>
            <S title="Buyer">
              <Field label="Buyer Name" value={buyer.name} onChange={v=>upd(setBuyer)("name",v)} />
              <Field label="Address" value={buyer.address} onChange={v=>upd(setBuyer)("address",v)} />
              <Field label="GSTIN" value={buyer.gstin} onChange={v=>upd(setBuyer)("gstin",v)} />
            </S>
            <S title="GST Type">
              <div style={{ display:"flex", gap:8, marginBottom:16 }}>
                {[{key:"cgst_sgst",label:"CGST + SGST"},{key:"igst",label:"IGST"}].map(opt=>(
                  <button key={opt.key} onClick={()=>{setGstType(opt.key);setItems(p=>p.map(i=>opt.key==="igst"?{...i,cgst:0,sgst:0,igst:18}:{...i,cgst:9,sgst:9,igst:0}));}} style={{ flex:1, padding:"9px 12px", borderRadius:8, fontSize:12, fontWeight:600, cursor:"pointer", border:gstType===opt.key?"1.5px solid #0F172A":"1.5px solid #E2E8F0", background:gstType===opt.key?"#0F172A":"#fff", color:gstType===opt.key?"#fff":"#64748B" }}>{opt.label}</button>
                ))}
              </div>
            </S>
            <S title="Line Items">
              {items.map((item,idx)=>(
                <div key={item.id} style={{ background:"#F8FAFC", borderRadius:12, padding:"14px 16px", marginBottom:10, border:"1px solid #E2E8F0", position:"relative" }}>
                  {items.length>1&&<button onClick={()=>setItems(p=>p.filter(i=>i.id!==item.id))} style={{ position:"absolute", top:10, right:10, background:"#FEF2F2", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:"#DC2626", fontSize:14 }}>×</button>}
                  <div style={{ display:"grid", gridTemplateColumns:"2fr 1fr", gap:8 }}>
                    <Field label={`Item ${idx+1}`} value={item.description} onChange={v=>updItem(item.id,"description",v)} small />
                    <Field label="HSN/SAC" value={item.hsn} onChange={v=>updItem(item.id,"hsn",v)} small />
                  </div>
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                    <Field label="Qty" value={item.qty} onChange={v=>updItem(item.id,"qty",Number(v))} type="number" small />
                    <Field label="Rate ₹" value={item.rate} onChange={v=>updItem(item.id,"rate",Number(v))} type="number" small />
                    {gstType==="igst"
                      ? <Field label="IGST %" value={item.igst} onChange={v=>updItem(item.id,"igst",Number(v))} type="number" small />
                      : <Field label="CGST/SGST %" value={item.cgst} onChange={v=>{updItem(item.id,"cgst",Number(v));updItem(item.id,"sgst",Number(v));}} type="number" small />
                    }
                  </div>
                </div>
              ))}
              <button onClick={()=>setItems(p=>[...p,defaultItem()])} style={{ width:"100%", padding:10, borderRadius:10, border:"1.5px dashed #0F172A", background:"#F8FAFC", color:"#0F172A", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Item</button>
            </S>
          </div>
          <div className="ei-prev" style={{ position:"sticky", top:88 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#64748B", margin:0 }}>Live Preview</p>
              <button onClick={handlePDF} disabled={downloading} style={{ background:"#0F172A", border:"none", borderRadius:8, padding:"6px 16px", color:"#fff", fontSize:13, fontWeight:600, cursor:downloading?"wait":"pointer" }}>{downloading?"Saving…":"Save PDF"}</button>
            </div>
            <div style={{ transform:"scale(0.68)", transformOrigin:"top left", width:"147%", marginBottom:"-32%" }}>
              <div ref={previewRef}><EInvoicePreview data={data} supplier={supplier} buyer={buyer} items={items} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
