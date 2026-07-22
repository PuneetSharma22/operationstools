import BankStrip from "./BankStrip";

const mono = { fontFamily: "monospace", letterSpacing: "0.3px" };
const wrap = { background: "#FBFAF6", border: "1px solid #e9e6dd", borderRadius: 0, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", position: "relative", zIndex: 0 };
const thickDivider = { borderTop: "2px solid #000", borderBottom: "2px solid #000", margin: "8px 0" };
const thickLine = { borderTop: "2px solid #000", margin: "8px 0" };

export default function TemplateIOCL({ data }) {
  const qty = parseFloat(data.quantity) || 0;
  const rate = parseFloat(data.pricePerLitre) || 0;
  // Amount is the authoritative user-entered value when present (single-bill
  // form flow); bulk CSV generation doesn''t set data.amount, so fall back
  // to qty*rate there.
  const total = data.amount !== undefined && data.amount !== "" ? (parseFloat(data.amount) || 0) : qty * rate;

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const Row = ({ label, value }) => (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "10px 0", borderBottom: "1px dashed #d1d5db" }}>
      <span style={{ ...mono, fontWeight: 700, fontSize: 13 }}>{label}</span>
      <span style={{ ...mono, fontSize: 13 }}>{value}</span>
    </div>
  );

  return (
    <div style={wrap}>
      <BankStrip logoUrl={data.bankLogoUrl} bank="BANK" color="#1B3A6B" codes={["5001", "A02/2024"]} />
      <div style={{ padding: "32px" }}>

        {/* Logo + header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginBottom: 24 }}>
          {data.logoUrl && (
            <img src={data.logoUrl} alt="station logo" crossOrigin="anonymous" style={{ height: 64, objectFit: "contain", marginBottom: 12 }} onError={(e) => e.target.style.display = "none"} />
          )}
          <p style={{ ...mono, textAlign: "center", fontSize: 13 }}>{data.stationName}</p>
          <p style={{ ...mono, textAlign: "center", fontSize: 12, color: "#4b5563", marginTop: 4 }}>{data.stationAddress}</p>
        </div>

        <div style={thickDivider} />

        <Row label="TEL:" value={data.stationPhone} />
        {data.vatTin && <Row label="GST NO:" value={data.vatTin} />}
        <div style={{ height: 8 }} />
        <Row label="RECEIPT NO:" value={data.billNumber} />
        <Row label="DATE & TIME:" value={data.billDate || data.billTime ? `${formatDate(data.billDate)}, ${data.billTime}` : ""} />
        <Row label="NOZZLE NO:" value={data.nozzleNo} />
        <div style={{ height: 8 }} />
        <Row label="PRODUCT:" value={data.fuelType} />
        <Row label="RATE/LTR:" value={`₹${rate.toFixed(2)}`} />
        <Row label="QTY(LTR):" value={`${qty.toFixed(2)} Ltr`} />
        <div style={{ height: 8 }} />
        <Row label="CUSTOMER:" value={data.customerName || "Not Entered"} />
        <Row label="VEHICLE NO:" value={data.vehicleNumber || "Not Entered"} />
        <Row label="VEHICLE TYPE:" value={data.vehicleType} />
        <Row label="MOBILE NO:" value={data.mobileNo || "Not Entered"} />
        <div style={{ height: 8 }} />
        <Row label="PAYMENT:" value={data.paymentMode} />

        <div style={thickDivider} />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", padding: "4px 0" }}>
          <span style={{ ...mono, fontWeight: 900, fontSize: 15 }}>TOTAL AMOUNT:</span>
          <span style={{ ...mono, fontWeight: 900, fontSize: 15 }}>₹{total.toFixed(2)}</span>
        </div>

        <div style={thickLine} />

        <p style={{ ...mono, textAlign: "center", fontSize: 12, letterSpacing: 4, marginBottom: 4 }}>* * * * * * * * * * * * * * *</p>
        <p style={{ ...mono, textAlign: "center", fontSize: 12, marginTop: 16 }}>Thank You! Visit Again</p>
        <p style={{ ...mono, textAlign: "center", fontSize: 12 }}>Save Fuel, Save Money.</p>
      </div>
    </div>
  );
}
