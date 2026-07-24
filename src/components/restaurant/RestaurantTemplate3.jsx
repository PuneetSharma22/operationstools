const mono = { fontFamily: "'Courier New', monospace" };

function Divider() {
  return <div style={{ borderTop: "1px dashed #666", margin: "8px 0" }} />;
}

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d + "T00:00:00").toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }).toUpperCase();
};

export default function RestaurantTemplate3({ data, items }) {
  const subtotal = items.reduce((s, i) => s + i.qty * i.rate, 0);
  const cgstAmt = subtotal * (Number(data.cgst) || 0) / 100;
  const sgstAmt = subtotal * (Number(data.sgst) || 0) / 100;
  const scAmt = subtotal * (Number(data.serviceCharge) || 0) / 100;
  const rawTotal = subtotal + cgstAmt + sgstAmt + scAmt;
  const total = Math.round(rawTotal);
  const roundOff = total - rawTotal;
  const totalGst = cgstAmt + sgstAmt;

  return (
    <div style={{
      background: "#FBFAF6",
      border: "1px solid #e9e6dd",
      borderRadius: 0,
      padding: "26px 28px",
      ...mono,
      fontSize: 12.5,
      color: "#1a1a1a",
      maxWidth: 440,
      margin: "0 auto",
      boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
      letterSpacing: "0.2px",
    }}>
      <div style={{ textAlign: "center", marginBottom: 6 }}>
        {data.logoUrl && (
          <img src={data.logoUrl} alt="logo" crossOrigin="anonymous"
            style={{ maxHeight: 44, maxWidth: 130, objectFit: "contain", marginBottom: 8 }}
            onError={(e) => { e.target.style.display = "none"; }} />
        )}
        <div style={{ fontSize: 19, fontWeight: 900, letterSpacing: "1px" }}>{(data.restaurantName || "Restaurant Name").toUpperCase()}</div>
        <div style={{ fontSize: 11.5, color: "#555", marginTop: 2 }}>{(data.address || "Restaurant Address").toUpperCase()}</div>
        <div style={{ fontSize: 12, fontWeight: 700, marginTop: 4 }}>BILL NO: {data.billNo || "—"}</div>
      </div>

      <Divider />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>TABLE: {data.tableNo || "—"}</span>
        <span>DATE: {formatDate(data.date)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>CUST: {(data.customerName || "Customer Name").toUpperCase()}</span>
        <span>TIME: {data.time || "—"}</span>
      </div>

      <Divider />

      <div style={{ display: "flex", fontWeight: 700, marginBottom: 4 }}>
        <div style={{ flex: 2 }}>DESCRIPTION</div>
        <div style={{ flex: 0.7, textAlign: "right" }}>QTY</div>
        <div style={{ flex: 1, textAlign: "right" }}>RATE</div>
        <div style={{ flex: 1, textAlign: "right" }}>AMOUNT</div>
      </div>
      {items.map((item, i) => (
        <div key={item.id || i} style={{ display: "flex", marginBottom: 3 }}>
          <div style={{ flex: 2 }}>{(item.name || "ITEM").toUpperCase()}</div>
          <div style={{ flex: 0.7, textAlign: "right" }}>{item.qty}</div>
          <div style={{ flex: 1, textAlign: "right" }}>{Number(item.rate).toFixed(2)}</div>
          <div style={{ flex: 1, textAlign: "right" }}>{(item.qty * item.rate).toFixed(2)}</div>
        </div>
      ))}

      <Divider />

      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>SUB TOTAL</span><span>₹ {subtotal.toFixed(2)}</span>
      </div>
      {Number(data.cgst) > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>CGST @ {data.cgst}%</span><span>₹ {cgstAmt.toFixed(2)}</span>
        </div>
      )}
      {Number(data.sgst) > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>SGST @ {data.sgst}%</span><span>₹ {sgstAmt.toFixed(2)}</span>
        </div>
      )}
      {Number(data.serviceCharge) > 0 && (
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>SERVICE @ {data.serviceCharge}%</span><span>₹ {scAmt.toFixed(2)}</span>
        </div>
      )}
      <div style={{ textAlign: "center", fontSize: 11, color: "#555", marginTop: 4 }}>
        ( {roundOff >= 0 ? "+" : "-"} ) PETC ROUNDED
      </div>

      <Divider />

      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 900, fontSize: 17, marginBottom: 10 }}>
        <span>TOTAL</span><span>₹ {total.toFixed(2)}</span>
      </div>

      <div style={{ textAlign: "center", fontSize: 11.5, marginBottom: 4 }}>ABOVE PRICES INCLUDE TAXES</div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>TOTAL GST</span><span>₹ {totalGst.toFixed(2)}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <span>NON-TAXABLE</span><span>₹ 0.00</span>
      </div>

      <Divider />

      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700 }}>
        <span>PAID BY:</span><span>{(data.paymentMode || "CASH").toUpperCase()}</span>
      </div>
      <div style={{ textAlign: "center", marginTop: 10 }}>
        {data.footer && <div>{data.footer.toUpperCase()}</div>}
        <div style={{ marginTop: 2 }}>{data.time || ""}</div>
      </div>
    </div>
  );
}
