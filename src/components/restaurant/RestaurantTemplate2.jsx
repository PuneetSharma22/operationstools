const sans = { fontFamily: "'Helvetica Neue', Arial, sans-serif" };

function Divider() {
  return <div style={{ borderTop: "1px dashed #cbd5e1", margin: "10px 0" }} />;
}

const formatDateTime = (d, t) => {
  const dateStr = d ? new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";
  return `${dateStr} : ${t || "—"}`;
};

export default function RestaurantTemplate2({ data, items }) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const cgstAmt = subtotal * (Number(data.cgst) || 0) / 100;
  const sgstAmt = subtotal * (Number(data.sgst) || 0) / 100;
  const scAmt = subtotal * (Number(data.serviceCharge) || 0) / 100;
  const total = subtotal + cgstAmt + sgstAmt + scAmt;

  return (
    <div style={{
      background: "#FBFAF6",
      border: "1px solid #e9e6dd",
      borderRadius: 0,
      padding: "28px 30px",
      ...sans,
      fontSize: 13,
      color: "#1a1a1a",
      maxWidth: 460,
      margin: "0 auto",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
    }}>
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        {data.logoUrl && (
          <img src={data.logoUrl} alt="logo" crossOrigin="anonymous"
            style={{ maxHeight: 48, maxWidth: 140, objectFit: "contain", marginBottom: 8 }}
            onError={(e) => { e.target.style.display = "none"; }} />
        )}
        <div style={{ fontSize: 22, fontWeight: 900 }}>{data.restaurantName || "Restaurant Name"}</div>
        <div style={{ fontSize: 12.5, color: "#64748b", marginTop: 2 }}>{data.address || "Restaurant Address"}</div>
      </div>

      <Divider />

      <div style={{ display: "flex", fontWeight: 700, fontSize: 13, marginBottom: 6 }}>
        <div style={{ flex: 2 }}>Item</div>
        <div style={{ flex: 1, textAlign: "right" }}>Qty</div>
        <div style={{ flex: 1, textAlign: "right" }}>Price</div>
        <div style={{ flex: 1, textAlign: "right" }}>Subtotal</div>
      </div>
      <div style={{ borderTop: "1px solid #1a1a1a", marginBottom: 6 }} />
      {items.map((item, i) => (
        <div key={item.id || i} style={{ display: "flex", fontSize: 13, marginBottom: 4 }}>
          <div style={{ flex: 2 }}>{item.name || "Item"}</div>
          <div style={{ flex: 1, textAlign: "right" }}>{item.qty}</div>
          <div style={{ flex: 1, textAlign: "right" }}>₹ {item.rate}</div>
          <div style={{ flex: 1, textAlign: "right" }}>₹ {(item.qty * item.rate).toFixed(0)}</div>
        </div>
      ))}

      <Divider />

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span>Sub Total</span><span>₹ {subtotal.toFixed(0)}</span>
      </div>
      {Number(data.cgst) > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 2 }}>
          <span>CGST: {data.cgst}%</span><span>₹ {cgstAmt.toFixed(0)}</span>
        </div>
      )}
      {Number(data.sgst) > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 2 }}>
          <span>SGST: {data.sgst}%</span><span>₹ {sgstAmt.toFixed(0)}</span>
        </div>
      )}
      {Number(data.serviceCharge) > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, marginBottom: 2 }}>
          <span>Service Charge: {data.serviceCharge}%</span><span>₹ {scAmt.toFixed(0)}</span>
        </div>
      )}

      <Divider />

      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 19, marginBottom: 10 }}>
        <span>TOTAL</span><span>₹ {total.toFixed(0)}</span>
      </div>

      <div style={{ fontSize: 13, lineHeight: 1.7 }}>
        <div>Paid By: {data.paymentMode || "Cash"}</div>
        <div>{formatDateTime(data.date, data.time)}</div>
        <div>Receipt No: {data.billNo || "—"}</div>
        <div>Table No: {data.tableNo || "—"}</div>
        <div>Customer : {data.customerName || "Customer Name"}</div>
      </div>

      {data.footer && (
        <div style={{ textAlign: "center", fontWeight: 700, fontSize: 13, marginTop: 16 }}>{data.footer}</div>
      )}
      <div style={{ textAlign: "center", fontWeight: 700, fontSize: 13, marginTop: 4 }}>Thank For Supporting Local Business!</div>
    </div>
  );
}
