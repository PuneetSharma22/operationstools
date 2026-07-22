import BankStrip from "./BankStrip";

const dot = { fontFamily: "monospace", fontSize: "13px", letterSpacing: "0.3px" };
const wrap = { background: "#FBFAF6", border: "1px solid #e9e6dd", borderRadius: 0, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", position: "relative", zIndex: 0 };
// A literal dash-character line rather than a CSS dashed border — see
// TemplatePOS.jsx for why.
const Divider = () => (
  <div style={{ ...dot, color: "#4b5563", margin: "12px 0" }}>
    {"-".repeat(36)}
  </div>
);

export default function TemplateThermalCompact({ data }) {
  const qty = parseFloat(data.quantity) || 0;
  const rate = parseFloat(data.pricePerLitre) || 0;
  // Amount is the authoritative user-entered value when present (single-bill
  // form flow); bulk CSV generation doesn''t set data.amount, so fall back
  // to qty*rate there.
  const total = data.amount !== undefined && data.amount !== "" ? (parseFloat(data.amount) || 0) : qty * rate;

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const Row = ({ label, value }) => (
    <div style={{ ...dot, padding: "2px 0" }}>
      <span style={{ fontWeight: "bold" }}>{label} </span>
      <span>{value}</span>
    </div>
  );

  return (
    <div style={wrap}>
      <BankStrip logoUrl={data.bankLogoUrl} bank="BANK" color="#1B3A6B" codes={["5001", "A02/2024"]} />
      <div style={{ padding: "24px" }}>
        {data.logoUrl && (
          <div style={{ textAlign: "center", marginBottom: 8 }}>
  <img src={data.logoUrl} alt="logo" crossOrigin="anonymous" style={{ height: 40, objectFit: "contain", display: "block", margin: "0 auto" }} onError={(e) => e.target.style.display = "none"} />
</div>
        )}
        <div style={{ ...dot, textAlign: "center", fontWeight: "bold", fontSize: 14, marginBottom: 4 }}>
          {data.stationName || "WELCOME!!!"}
        </div>
        {data.stationAddress && (
          <div style={{ ...dot, textAlign: "center", fontSize: 11, color: "#4b5563", marginBottom: 2 }}>
            {data.stationAddress}
          </div>
        )}
        {data.stationPhone && (
          <div style={{ ...dot, textAlign: "center", fontSize: 11, color: "#4b5563", marginBottom: 12 }}>
            Tel: {data.stationPhone}
          </div>
        )}

        <Row label="Receipt No.:" value={data.billNumber} />
        <Divider />
        <Row label="PRODUCT:" value={data.fuelType} />
        <Row label="RATE/LTR:" value={`₹ ${rate.toFixed(2)}`} />
        <Row label="AMOUNT:" value={`₹ ${total.toFixed(2)}`} />
        <Row label="VOLUME(LTR.):" value={`${qty.toFixed(2)} lt`} />
        <Divider />
        <Row label="VEH TYPE:" value={data.vehicleType} />
        <Row label="VEH NO:" value={data.vehicleNumber} />
        <Row label="CUSTOMER NAME:" value={data.customerName} />
        <Divider />
        <div style={{ ...dot, display: "flex", justifyContent: "space-between" }}>
          <span><span style={{ fontWeight: "bold" }}>Date:</span> {formatDate(data.billDate)}</span>
          <span><span style={{ fontWeight: "bold" }}>Time:</span> {data.billTime}</span>
        </div>
        <Divider />
        <Row label="MODE:" value={data.paymentMode} />
        {data.vatTin && <Divider />}
        {data.vatTin && <Row label="GST NO.:" value={data.vatTin} />}
        <Divider />
        <div style={{ ...dot, textAlign: "center", fontSize: 12 }}>
          SAVE FUEL YAANI SAVE MONEY!! THANKS FOR FUELLING WITH US.
        </div>
      </div>
    </div>
  );
}
