// Preview / export template for the Book & Periodical Invoice. Pure
// presentational component — takes { data } and renders the printable
// invoice, used identically by the live preview, single-document export,
// and the bulk PDF renderer.

const INK = "#0F172A";
const INK_SOFT = "#475569";
const INK_MUTED = "#64748B";
const BORDER = "#E2E8F0";
const SURFACE = "#F8FAFC";
const SURFACE_ALT = "#F1F5F9";

function numberToWords(n) {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  if (n === 0) return "Zero";
  const convert = (num) => {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num/10)] + (num%10 ? " "+ones[num%10] : "");
    if (num < 1000) return ones[Math.floor(num/100)] + " Hundred" + (num%100 ? " "+convert(num%100) : "");
    if (num < 100000) return convert(Math.floor(num/1000)) + " Thousand" + (num%1000 ? " "+convert(num%1000) : "");
    if (num < 10000000) return convert(Math.floor(num/100000)) + " Lakh" + (num%100000 ? " "+convert(num%100000) : "");
    return convert(Math.floor(num/10000000)) + " Crore" + (n%10000000 ? " "+convert(n%10000000) : "");
  };
  const rupees = Math.floor(n);
  const paise = Math.round((n - rupees) * 100);
  return convert(rupees) + " Rupees" + (paise > 0 ? " and " + convert(paise) + " Paise" : "") + " Only";
}

export default function BookInvoiceTemplate({ data }) {
  const { store, customer, items } = data;
  const subtotal = items.reduce((s, i) => s + Number(i.qty || 0) * Number(i.rate || 0), 0);
  const totalGST = items.reduce((s, i) => s + Number(i.qty || 0) * Number(i.rate || 0) * Number(i.gstRate || 0) / 100, 0);
  const grandTotal = subtotal + totalGST;

  return (
    <div style={{ background: "#fff", fontFamily: "Arial, sans-serif", fontSize: 12, color: INK, padding: "32px 40px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 16, borderBottom: `2px solid ${INK}` }}>
        <div>
          {data.logoUrl ? <img src={data.logoUrl} alt="logo" style={{ maxHeight: 52, maxWidth: 160, objectFit: "contain", marginBottom: 8, display: "block" }} /> : null}
          <div style={{ fontSize: 18, fontWeight: 800, color: INK, letterSpacing: "-0.01em" }}>{store.name || "Book Store Name"}</div>
          <div style={{ fontSize: 11, color: INK_SOFT, marginTop: 3, lineHeight: 1.6 }}>
            {store.address && <div>{store.address}</div>}
            {store.gstin && <div>GSTIN: <strong>{store.gstin}</strong></div>}
            {store.phone && <div>Tel: {store.phone}</div>}
            {store.email && <div>{store.email}</div>}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 22, fontWeight: 900, color: INK, letterSpacing: "-0.02em", marginBottom: 8 }}>BOOK INVOICE</div>
          <div style={{ background: SURFACE, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 16px", fontSize: 12 }}>
            <div style={{ display: "flex", gap: 16, justifyContent: "flex-end" }}>
              <span style={{ color: INK_MUTED }}>Invoice No.</span>
              <strong>{data.invoiceNo || "—"}</strong>
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "flex-end", marginTop: 4 }}>
              <span style={{ color: INK_MUTED }}>Date</span>
              <strong>{data.invoiceDate ? new Date(data.invoiceDate + "T00:00:00").toLocaleDateString("en-IN") : "—"}</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Customer */}
      <div style={{ background: SURFACE, borderRadius: 8, padding: "12px 16px", marginBottom: 20, border: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: INK_MUTED, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>Bill To</div>
        <div style={{ fontWeight: 700, fontSize: 13, color: INK }}>{customer.name || "Customer Name"}</div>
        <div style={{ fontSize: 11, color: INK_SOFT, lineHeight: 1.7, marginTop: 2 }}>
          {customer.address && <span>{customer.address}<br/></span>}
          {customer.phone && <span>{customer.phone}</span>}
        </div>
      </div>

      {/* Items table */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
        <thead>
          <tr style={{ background: INK, color: "#fff" }}>
            {["#","Title / Item","HSN","Qty","Rate (₹)","Taxable Amt","GST %","GST Amt","Total (₹)"].map(h => (
              <th key={h} style={{ padding: "8px 10px", fontSize: 10, fontWeight: 700, textAlign: h==="Title / Item" ? "left" : "right", whiteSpace: "nowrap" }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => {
            const taxable = Number(item.qty || 0) * Number(item.rate || 0);
            const gstAmt = taxable * Number(item.gstRate || 0) / 100;
            const total = taxable + gstAmt;
            return (
              <tr key={item.id} style={{ borderBottom: `1px solid ${BORDER}`, background: i%2===0 ? "#fff" : SURFACE }}>
                <td style={{ padding: "9px 10px", textAlign: "right", color: "#94A3B8" }}>{i+1}</td>
                <td style={{ padding: "9px 10px" }}>
                  <div>{item.description || "—"}</div>
                  {item.author && <div style={{ fontSize: 10, color: INK_MUTED }}>{item.author}</div>}
                </td>
                <td style={{ padding: "9px 10px", textAlign: "right", color: INK_MUTED }}>{item.hsn || "—"}</td>
                <td style={{ padding: "9px 10px", textAlign: "right" }}>{item.qty}</td>
                <td style={{ padding: "9px 10px", textAlign: "right" }}>{Number(item.rate || 0).toFixed(2)}</td>
                <td style={{ padding: "9px 10px", textAlign: "right" }}>{taxable.toFixed(2)}</td>
                <td style={{ padding: "9px 10px", textAlign: "right" }}>{item.gstRate}%</td>
                <td style={{ padding: "9px 10px", textAlign: "right" }}>{gstAmt.toFixed(2)}</td>
                <td style={{ padding: "9px 10px", textAlign: "right", fontWeight: 700 }}>{total.toFixed(2)}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Totals */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 16 }}>
        <div style={{ width: 260 }}>
          {[["Subtotal", subtotal], ["Total GST", totalGST]].map(([label, val]) => (
            <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${SURFACE_ALT}`, fontSize: 12 }}>
              <span style={{ color: INK_MUTED }}>{label}</span>
              <span>₹{val.toFixed(2)}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 12px", background: INK, color: "#fff", borderRadius: 8, marginTop: 8, fontSize: 14, fontWeight: 800 }}>
            <span>Grand Total</span>
            <span>₹{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Amount in words */}
      <div style={{ background: SURFACE_ALT, border: `1px solid ${BORDER}`, borderRadius: 8, padding: "10px 14px", marginBottom: 16, fontSize: 11, color: INK_SOFT }}>
        <strong style={{ color: INK }}>Amount in words:</strong> {numberToWords(Math.round(grandTotal * 100) / 100)}
      </div>

      {data.paymentMode && <div style={{ fontSize: 11, color: INK_SOFT, textAlign: "right", marginBottom: 12 }}>Payment Mode: <strong style={{ color: INK }}>{data.paymentMode}</strong></div>}
      <div style={{ borderTop: `1px solid ${BORDER}`, marginTop: 16, paddingTop: 12, fontSize: 10, color: INK_MUTED, textAlign: "center" }}>Thank you for your purchase. Books are the quietest and most constant of friends.</div>
    </div>
  );
}
