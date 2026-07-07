import { useState, useRef } from "react";
import { supabase } from "../../supabase-public.js";

function Field({ label, value, onChange, placeholder, type = "text", small }) {
  return (
    <div style={{ marginBottom: small ? 8 : 12 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder}
        onChange={e => onChange && onChange(e.target.value)}
        style={{ width: "100%", height: small ? 32 : 38, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 10px", fontSize: 13, color: "#0F172A", outline: "none", boxSizing: "border-box", background: "#fff" }}
        onFocus={e => e.target.style.borderColor = "#6366F1"}
        onBlur={e => e.target.style.borderColor = "#E2E8F0"} />
    </div>
  );
}

function numberToWords(n) {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  if (n === 0) return "Zero";
  const convert = num => {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num/10)] + (num%10 ? " "+ones[num%10] : "");
    if (num < 1000) return ones[Math.floor(num/100)] + " Hundred" + (num%100 ? " "+convert(num%100) : "");
    if (num < 100000) return convert(Math.floor(num/1000)) + " Thousand" + (num%1000 ? " "+convert(num%1000) : "");
    return convert(Math.floor(num/100000)) + " Lakh" + (num%100000 ? " "+convert(num%100000) : "");
  };
  return convert(Math.floor(n)) + " Rupees Only";
}

const defaultItem = () => ({ id: Date.now()+Math.random(), description: "", qty: 1, rate: 0, tax: 0 });

function InvoicePreview({ data, from, to, items }) {
  const subtotal = items.reduce((s,i) => s + i.qty*i.rate, 0);
  const tax = items.reduce((s,i) => s + i.qty*i.rate*i.tax/100, 0);
  const total = subtotal + tax - (Number(data.discount)||0);
  return (
    <div style={{ background:"#fff", fontFamily:"Arial,sans-serif", fontSize:12, color:"#1a1a1a", padding:"32px 40px" }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:24, paddingBottom:20, borderBottom:"2px solid #6366F1" }}>
        <div>
          {data.logoUrl && <img src={data.logoUrl} alt="logo" style={{ maxHeight:52, maxWidth:160, objectFit:"contain", marginBottom:8, display:"block" }} />}
          <div style={{ fontSize:20, fontWeight:800, color:"#6366F1" }}>{from.name || "Your Business"}</div>
          <div style={{ fontSize:11, color:"#475569", marginTop:4, lineHeight:1.7 }}>
            {from.address && <div>{from.address}</div>}
            {from.gstin && <div>GSTIN: {from.gstin}</div>}
            {from.email && <div>{from.email}</div>}
            {from.phone && <div>{from.phone}</div>}
          </div>
        </div>
        <div style={{ textAlign:"right" }}>
          <div style={{ fontSize:24, fontWeight:900, color:"#0F172A" }}>INVOICE</div>
          <div style={{ background:"#EEF2FF", borderRadius:8, padding:"10px 16px", marginTop:8, fontSize:12 }}>
            <div style={{ display:"flex", gap:16, justifyContent:"flex-end" }}><span style={{ color:"#64748B" }}>Invoice No.</span><strong>{data.invoiceNo||"—"}</strong></div>
            <div style={{ display:"flex", gap:16, justifyContent:"flex-end", marginTop:4 }}><span style={{ color:"#64748B" }}>Date</span><strong>{data.date ? new Date(data.date+"T00:00:00").toLocaleDateString("en-IN") : "—"}</strong></div>
            {data.dueDate && <div style={{ display:"flex", gap:16, justifyContent:"flex-end", marginTop:4 }}><span style={{ color:"#64748B" }}>Due</span><strong>{new Date(data.dueDate+"T00:00:00").toLocaleDateString("en-IN")}</strong></div>}
          </div>
        </div>
      </div>
      <div style={{ background:"#F8FAFC", borderRadius:8, padding:"12px 16px", marginBottom:20, border:"1px solid #E2E8F0" }}>
        <div style={{ fontSize:11, fontWeight:700, color:"#6366F1", textTransform:"uppercase", letterSpacing:"0.08em", marginBottom:6 }}>Bill To</div>
        <div style={{ fontWeight:700, fontSize:13 }}>{to.name||"Client Name"}</div>
        <div style={{ fontSize:11, color:"#475569", lineHeight:1.7, marginTop:2 }}>
          {to.address && <span>{to.address}<br/></span>}
          {to.email && <span>{to.email}</span>}
          {to.phone && <span>  ·  {to.phone}</span>}
        </div>
      </div>
      <table style={{ width:"100%", borderCollapse:"collapse", marginBottom:16 }}>
        <thead><tr style={{ background:"#6366F1", color:"#fff" }}>
          {["#","Description","Qty","Rate (₹)","Tax %","Amount (₹)"].map(h => <th key={h} style={{ padding:"8px 10px", fontSize:10, fontWeight:700, textAlign:h==="Description"?"left":"right" }}>{h}</th>)}
        </tr></thead>
        <tbody>{items.map((item,i) => {
          const amt = item.qty*item.rate*(1+item.tax/100);
          return <tr key={item.id} style={{ borderBottom:"1px solid #E2E8F0", background:i%2===0?"#fff":"#F8FAFC" }}>
            <td style={{ padding:"9px 10px", textAlign:"right", color:"#94A3B8" }}>{i+1}</td>
            <td style={{ padding:"9px 10px" }}>{item.description||"—"}</td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{item.qty}</td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{item.rate.toFixed(2)}</td>
            <td style={{ padding:"9px 10px", textAlign:"right" }}>{item.tax}%</td>
            <td style={{ padding:"9px 10px", textAlign:"right", fontWeight:700 }}>{amt.toFixed(2)}</td>
          </tr>;
        })}</tbody>
      </table>
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:16 }}>
        <div style={{ width:240 }}>
          {[["Subtotal", subtotal],["Tax", tax],["Discount", -(Number(data.discount)||0)]].filter(([,v])=>v!==0).map(([l,v]) => (
            <div key={l} style={{ display:"flex", justifyContent:"space-between", padding:"5px 0", borderBottom:"1px solid #F1F5F9", fontSize:12 }}>
              <span style={{ color:"#64748B" }}>{l}</span><span>{v<0?`-₹${Math.abs(v).toFixed(2)}`:`₹${v.toFixed(2)}`}</span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", padding:"10px 12px", background:"#6366F1", color:"#fff", borderRadius:8, marginTop:8, fontSize:14, fontWeight:800 }}>
            <span>Total</span><span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
      <div style={{ background:"#EEF2FF", borderRadius:8, padding:"10px 14px", marginBottom:16, fontSize:11, color:"#3730A3" }}>
        <strong>Amount in words:</strong> {numberToWords(Math.round(total))}
      </div>
      {data.notes && <div style={{ border:"1px solid #E2E8F0", borderRadius:8, padding:"12px 14px", fontSize:11, color:"#475569" }}><strong style={{ color:"#6366F1" }}>Notes: </strong>{data.notes}</div>}
      {(data.bankName||data.accountNo||data.ifsc) && (
        <div style={{ marginTop:12, border:"1px solid #E2E8F0", borderRadius:8, padding:"12px 14px", fontSize:11 }}>
          <div style={{ fontWeight:700, color:"#6366F1", marginBottom:6, textTransform:"uppercase", letterSpacing:"0.08em", fontSize:10 }}>Bank Details</div>
          {data.bankName && <div><span style={{ color:"#64748B" }}>Bank: </span>{data.bankName}</div>}
          {data.accountNo && <div><span style={{ color:"#64748B" }}>A/C: </span>{data.accountNo}</div>}
          {data.ifsc && <div><span style={{ color:"#64748B" }}>IFSC: </span>{data.ifsc}</div>}
          {data.upi && <div><span style={{ color:"#64748B" }}>UPI: </span>{data.upi}</div>}
        </div>
      )}
      <div style={{ marginTop:20, display:"flex", justifyContent:"flex-end" }}>
        <div style={{ textAlign:"center" }}>
          <div style={{ width:120, height:40, borderBottom:"1px solid #CBD5E1", marginBottom:6 }}/>
          <div style={{ fontSize:11, color:"#64748B" }}>Authorised Signatory</div>
        </div>
      </div>
    </div>
  );
}

export default function InvoiceGeneratorPage() {
  const [data, setData] = useState({ invoiceNo:`INV-${new Date().getFullYear()}-${String(Math.floor(Math.random()*9000)+1000)}`, date:new Date().toISOString().split("T")[0], dueDate:"", logoUrl:"", discount:"", bankName:"", accountNo:"", ifsc:"", upi:"", notes:"Thank you for your business." });
  const [from, setFrom] = useState({ name:"", address:"", gstin:"", email:"", phone:"" });
  const [to, setTo] = useState({ name:"", address:"", email:"", phone:"" });
  const [items, setItems] = useState([defaultItem()]);
  const [downloading, setDownloading] = useState(false);
  const previewRef = useRef(null);
  const upd = setter => (k,v) => setter(p=>({...p,[k]:v}));
  const updItem = (id,k,v) => setItems(p=>p.map(i=>i.id===id?{...i,[k]:v}:i));

  const handlePDF = async () => {
    if (!previewRef.current||downloading) return;
    setDownloading(true);
    try {
      try { await supabase.from("save_requests").insert({ template:"invoice-generator", print_id:`INV-${Date.now()}`, user_id:null }); } catch(_) {}
      const { default: jsPDF } = await import("jspdf");
      const { default: html2canvas } = await import("html2canvas");
      const canvas = await html2canvas(previewRef.current, { scale:2, useCORS:true, backgroundColor:"#ffffff" });
      const pdf = new jsPDF({ orientation:"portrait", unit:"mm", format:"a4" });
      const pw=pdf.internal.pageSize.getWidth(), ph=pdf.internal.pageSize.getHeight();
      const s=Math.min(pw/(canvas.width*25.4/(96*2)), ph/(canvas.height*25.4/(96*2)));
      const fw=canvas.width*25.4/(96*2)*s, fh=canvas.height*25.4/(96*2)*s;
      pdf.addImage(canvas.toDataURL("image/png"),"PNG",(pw-fw)/2,0,fw,fh);
      pdf.save(`invoice-${data.invoiceNo}.pdf`);
    } catch(e) { alert("PDF failed: "+e?.message); }
    finally { setDownloading(false); }
  };

  const S = ({ title, accent="#6366F1", children }) => (
    <div style={{ background:"#fff", borderRadius:16, border:"1px solid #E2E8F0", padding:"20px 24px", marginBottom:16 }}>
      <h2 style={{ fontSize:13, fontWeight:700, color:accent, margin:"0 0 16px", textTransform:"uppercase", letterSpacing:"0.08em" }}>{title}</h2>
      {children}
    </div>
  );

  return (
    <div style={{ backgroundColor:"#F8FAFC", minHeight:"100vh" }}>
      <style>{`@media(max-width:768px){.inv-grid{grid-template-columns:1fr!important;}.inv-prev{display:none!important;}}@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background:"linear-gradient(160deg,#07011F 0%,#1e1b4b 100%)", padding:"40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth:1280, margin:"0 auto" }}>
          <nav style={{ marginBottom:16, fontSize:13, color:"#818CF8" }}>
            <a href="/" style={{ color:"#818CF8", textDecoration:"none" }}>Home</a><span style={{ margin:"0 8px" }}>›</span>
            <a href="/documents" style={{ color:"#818CF8", textDecoration:"none" }}>Documents</a><span style={{ margin:"0 8px" }}>›</span>
            <span style={{ color:"#C7D2FE" }}>Invoice Generator</span>
          </nav>
          <h1 style={{ fontSize:"clamp(20px,3vw,30px)", fontWeight:800, color:"#fff", margin:"0 0 8px", letterSpacing:"-0.02em" }}>Invoice Generator</h1>
          <p style={{ fontSize:14, color:"#818CF8", margin:0 }}>Professional invoices with line items, tax, discounts and bank details.</p>
        </div>
      </section>
      <div style={{ maxWidth:1280, margin:"0 auto", padding:"32px 24px" }} className="no-print">
        <div className="inv-grid" style={{ display:"grid", gridTemplateColumns:"1fr 500px", gap:28, alignItems:"start" }}>
          <div>
            <S title="Invoice Details">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Invoice No." value={data.invoiceNo} onChange={v=>upd(setData)("invoiceNo",v)} />
                <Field label="Invoice Date" value={data.date} onChange={v=>upd(setData)("date",v)} type="date" />
                <Field label="Due Date" value={data.dueDate} onChange={v=>upd(setData)("dueDate",v)} type="date" />
                <Field label="Discount (₹)" value={data.discount} onChange={v=>upd(setData)("discount",v)} type="number" placeholder="0" />
              </div>
              <Field label="Logo URL" value={data.logoUrl} onChange={v=>upd(setData)("logoUrl",v)} placeholder="https://..." />
            </S>
            <S title="From (Your Business)">
              <Field label="Business Name" value={from.name} onChange={v=>upd(setFrom)("name",v)} placeholder="Your Company" />
              <Field label="Address" value={from.address} onChange={v=>upd(setFrom)("address",v)} placeholder="City, State - PIN" />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="GSTIN" value={from.gstin} onChange={v=>upd(setFrom)("gstin",v)} placeholder="27ABCDE1234F1Z5" />
                <Field label="Email" value={from.email} onChange={v=>upd(setFrom)("email",v)} />
                <Field label="Phone" value={from.phone} onChange={v=>upd(setFrom)("phone",v)} />
              </div>
            </S>
            <S title="Bill To (Client)">
              <Field label="Client Name" value={to.name} onChange={v=>upd(setTo)("name",v)} placeholder="Client / Company" />
              <Field label="Address" value={to.address} onChange={v=>upd(setTo)("address",v)} />
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Email" value={to.email} onChange={v=>upd(setTo)("email",v)} />
                <Field label="Phone" value={to.phone} onChange={v=>upd(setTo)("phone",v)} />
              </div>
            </S>
            <S title="Line Items">
              {items.map((item,idx) => (
                <div key={item.id} style={{ background:"#F8FAFC", borderRadius:12, padding:"14px 16px", marginBottom:10, border:"1px solid #E2E8F0", position:"relative" }}>
                  {items.length>1 && <button onClick={()=>setItems(p=>p.filter(i=>i.id!==item.id))} style={{ position:"absolute", top:10, right:10, background:"#FEF2F2", border:"none", borderRadius:6, width:24, height:24, cursor:"pointer", color:"#DC2626", fontSize:14 }}>×</button>}
                  <div style={{ fontSize:11, fontWeight:700, color:"#94A3B8", marginBottom:8, textTransform:"uppercase" }}>Item {idx+1}</div>
                  <Field label="Description" value={item.description} onChange={v=>updItem(item.id,"description",v)} placeholder="Service or product" small />
                  <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:8 }}>
                    <Field label="Qty" value={item.qty} onChange={v=>updItem(item.id,"qty",Number(v))} type="number" small />
                    <Field label="Rate ₹" value={item.rate} onChange={v=>updItem(item.id,"rate",Number(v))} type="number" small />
                    <Field label="Tax %" value={item.tax} onChange={v=>updItem(item.id,"tax",Number(v))} type="number" small />
                  </div>
                  <div style={{ fontSize:12, color:"#6366F1", fontWeight:700, marginTop:6 }}>= ₹{(item.qty*item.rate*(1+item.tax/100)).toFixed(2)}</div>
                </div>
              ))}
              <button onClick={()=>setItems(p=>[...p,defaultItem()])} style={{ width:"100%", padding:10, borderRadius:10, border:"1.5px dashed #6366F1", background:"#EEF2FF", color:"#4F46E5", fontSize:13, fontWeight:600, cursor:"pointer" }}>+ Add Item</button>
            </S>
            <S title="Bank Details (Optional)">
              <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:12 }}>
                <Field label="Bank Name" value={data.bankName} onChange={v=>upd(setData)("bankName",v)} placeholder="HDFC Bank" />
                <Field label="Account No." value={data.accountNo} onChange={v=>upd(setData)("accountNo",v)} />
                <Field label="IFSC" value={data.ifsc} onChange={v=>upd(setData)("ifsc",v)} placeholder="HDFC0001234" />
                <Field label="UPI ID" value={data.upi} onChange={v=>upd(setData)("upi",v)} placeholder="name@upi" />
              </div>
            </S>
            <S title="Notes">
              <textarea value={data.notes} onChange={e=>upd(setData)("notes",e.target.value)} rows={2} style={{ width:"100%", border:"1.5px solid #E2E8F0", borderRadius:8, padding:"8px 12px", fontSize:13, color:"#0F172A", resize:"vertical", boxSizing:"border-box", outline:"none" }}/>
            </S>
          </div>
          <div className="inv-prev" style={{ position:"sticky", top:88 }}>
            <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:10 }}>
              <p style={{ fontSize:12, fontWeight:700, textTransform:"uppercase", letterSpacing:"0.1em", color:"#64748B", margin:0 }}>Live Preview</p>
              <button onClick={handlePDF} disabled={downloading} style={{ background:"linear-gradient(135deg,#6366F1,#4F46E5)", border:"none", borderRadius:8, padding:"6px 16px", color:"#fff", fontSize:13, fontWeight:600, cursor:downloading?"wait":"pointer", opacity:downloading?0.7:1 }}>
                {downloading?"Saving…":"Save PDF"}
              </button>
            </div>
            <div style={{ transform:"scale(0.68)", transformOrigin:"top left", width:"147%", marginBottom:"-32%" }}>
              <div ref={previewRef}><InvoicePreview data={data} from={from} to={to} items={items} /></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
