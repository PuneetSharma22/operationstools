const serif = { fontFamily: "'Times New Roman', Georgia, serif" };
const sans = { fontFamily: "Georgia, 'Times New Roman', serif" };
export const REVENUE_STAMP_URL = "https://bill-generator-assets-2.s3.ap-south-1.amazonaws.com/Revenu.jpg";

const formatDate = (d) => {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
};
const formatMonthYear = (d) => {
  if (!d) return "—";
  return new Date(d + "-02").toLocaleDateString("en-IN", { month: "long", year: "numeric" });
};

function Row({ label, value }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", padding: "9px 0", borderBottom: "1px solid #e5ddc9" }}>
      <span style={{ ...sans, fontSize: 11, fontWeight: 700, color: "#8a7a5c", textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</span>
      <span style={{ ...serif, fontSize: 14, color: "#1a1a1a" }}>{value || "—"}</span>
    </div>
  );
}

export default function TemplateRentReceipt3({ data }) {
  const periodLabel = data.periodFrom === data.periodTo || !data.periodTo
    ? formatMonthYear(data.periodFrom)
    : `${formatMonthYear(data.periodFrom)} – ${formatMonthYear(data.periodTo)}`;

  return (
    <div style={{
      background: "#FBFAF6",
      border: "1px solid #e9e6dd",
      padding: "32px 34px",
      color: "#1a1a1a",
      maxWidth: 500,
      margin: "0 auto",
      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
        <div>
          <div style={{ ...sans, fontSize: 10, fontWeight: 700, color: "#8a7a5c", textTransform: "uppercase", letterSpacing: "0.08em" }}>Receipt No.</div>
          <div style={{ ...serif, fontSize: 15, fontWeight: 700 }}>{data.receiptNo || "—"}</div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ ...sans, fontSize: 10, fontWeight: 700, color: "#8a7a5c", textTransform: "uppercase", letterSpacing: "0.08em" }}>Date</div>
          <div style={{ ...serif, fontSize: 15 }}>{formatDate(data.receiptDate)}</div>
        </div>
      </div>

      <h2 style={{ ...serif, fontSize: 22, fontWeight: 900, margin: "0 0 6px", letterSpacing: 1 }}>Rent Receipt</h2>
      <p style={{ ...serif, fontSize: 13.5, color: "#5a5142", margin: "0 0 22px", lineHeight: 1.6 }}>
        Acknowledging receipt of rent paid by <strong>{data.tenantName || "the tenant"}</strong> to <strong>{data.landlordName || "the landlord"}</strong> for the period of <strong>{periodLabel}</strong>.
      </p>

      <div style={{ background: "rgba(255,255,255,0.5)", borderRadius: 6, padding: "4px 16px", marginBottom: 20 }}>
        <Row label="Tenant" value={data.tenantName} />
        <Row label="Landlord" value={data.landlordName} />
        <Row label="Property" value={data.propertyAddress} />
        <Row label="Rent Period" value={periodLabel} />
        <Row label="Amount Paid" value={data.rentAmount ? `₹ ${parseInt(data.rentAmount).toLocaleString("en-IN")}` : ""} />
        <Row label="Payment Mode" value={data.paymentMethod} />
        {data.paymentRef && <Row label="Reference" value={data.paymentRef} />}
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ ...sans, fontSize: 10, fontWeight: 700, color: "#8a7a5c", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 3 }}>Landlord PAN</div>
          <div style={{ ...serif, fontSize: 13 }}>{data.landlordPan || "—"}</div>
        </div>
        <img
          src={REVENUE_STAMP_URL}
          alt="Revenue stamp"
          style={{ width: 56, height: 68, objectFit: "contain" }}
          onError={(e) => { e.target.style.display = "none"; }}
        />
      </div>
    </div>
  );
}
