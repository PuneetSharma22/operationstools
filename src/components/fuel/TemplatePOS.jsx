const mono = { fontFamily: "'Courier New', monospace" };
const wrap = { background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" };
const divider = { borderTop: "1px dashed #666", margin: "12px 0" };

export default function TemplatePOS({ data }) {
  const qty = parseFloat(data.quantity) || 0;
  const rate = parseFloat(data.pricePerLitre) || 0;
  const total = qty * rate;

  const formatDate = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    return `${String(dt.getDate()).padStart(2,"0")}/${String(dt.getMonth()+1).padStart(2,"0")}/${dt.getFullYear()}`;
  };

  const Line = ({ label, value }) => (
    <div style={{ ...mono, fontSize: 13, padding: "2px 0" }}>
      <span style={{ fontWeight: "bold" }}>{label}</span>
      <span style={{ marginLeft: 4 }}>{value}</span>
    </div>
  );

  return (
    <div style={wrap}>
      <div style={{ padding: "28px" }}>
        {data.logoUrl && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <img src={data.logoUrl} alt="logo" style={{ height: 56, objectFit: "contain" }} onError={(e) => e.target.style.display = "none"} />
          </div>
        )}

        <div style={{ ...mono, fontWeight: 900, fontSize: 18, textTransform: "uppercase", marginBottom: 4 }}>{data.stationName}</div>
        <div style={{ ...mono, fontSize: 12, marginBottom: 2 }}>{data.stationAddress}</div>
        <div style={{ ...mono, fontSize: 12, marginBottom: 2 }}>TEL {data.stationPhone}</div>
        <div style={{ ...mono, fontSize: 12, marginBottom: 12 }}>VAT TIN NO {data.vatTin}</div>

        <div style={{ ...mono, textAlign: "center", fontWeight: "bold", fontSize: 13, marginBottom: 4 }}>ORIGINAL</div>
        <div style={{ ...mono, borderTop: "1px dashed #666", borderBottom: "1px dashed #666", padding: "4px 0", textAlign: "center", fontSize: 12, marginBottom: 12, letterSpacing: 2 }}>
          ****************************
        </div>

        <div style={{ ...mono, fontSize: 13, marginBottom: 12 }}>
          {formatDate(data.billDate)} &nbsp; {data.billTime}
        </div>

        <Line label="TXN NO:" value={data.txnNo} />
        <Line label="INVOICE NO:" value={data.invoiceNo} />
        <Line label="VEHICLE NO:" value={data.vehicleNumber || "NOT ENTERED"} />
        <Line label="PRESET:" value={data.presetType?.toUpperCase()} />

        <div style={divider} />

        <Line label="NOZZLE NO:" value={data.nozzleNo} />
        <Line label="PRODUCT:" value={data.fuelType?.toUpperCase()} />
        <Line label="DENSITY:" value={`${data.density} kg/m3`} />
        <Line label="RATE    :" value={`${rate.toFixed(1)} INR/Ltr`} />
        <Line label="VOLUME  :" value={`${qty.toFixed(1)} Ltr`} />
        <Line label="AMOUNT  :" value={`${total.toFixed(1)} INR`} />

        <div style={divider} />

        <div style={{ ...mono, textAlign: "center", fontSize: 13, fontWeight: "bold" }}>Thank You! Visit Again</div>
      </div>
    </div>
  );
}
