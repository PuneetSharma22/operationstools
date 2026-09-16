const serif = { fontFamily: "'Times New Roman', Georgia, serif" };
import { REVENUE_STAMP_DATA_URI } from "./revenueStampAsset";
import { amountToWords, formatReceiptDate, formatPeriod, formatRentFigure } from "./receiptMath";

// Certificate style: long dates and a blank rule where a value is missing.
const formatDate = (d) => formatReceiptDate(d, { style: "long", placeholder: "___________" });
const formatMonthYear = (d) => formatPeriod(d, { withYear: true, placeholder: "___________" });


export default function TemplateRentReceipt1({ data }) {
  const words = amountToWords(data.rentAmount);

  return (
    <div style={{
      background: "#FBFAF6",
      border: "1px solid #e9e6dd",
      borderRadius: 0,
      padding: "32px 36px",
      ...serif,
      fontSize: 14,
      color: "#1a1a1a",
      maxWidth: 520,
      margin: "0 auto",
      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
      position: "relative",
    }}>
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h2 style={{ ...serif, fontSize: 22, fontWeight: 900, letterSpacing: 2, margin: 0, textDecoration: "underline", textUnderlineOffset: 4 }}>
          Rent Receipt
        </h2>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={serif}><strong>Date :</strong> {formatDate(data.receiptDate)}</div>
        <div style={serif}><strong>Receipt No.</strong> {data.receiptNo || "___"}</div>
      </div>

      <div style={{ ...serif, marginBottom: 14, lineHeight: 2 }}>
        Rent Received from{" "}
        <span style={{ borderBottom: "1px solid #555", paddingBottom: 1, minWidth: 160, display: "inline-block", textAlign: "center" }}>
          {data.tenantName || ""}
        </span>
        {" "}the sum of{" "}
        <span style={{ borderBottom: "1px solid #555", paddingBottom: 1, minWidth: 120, display: "inline-block", textAlign: "center" }}>
          {data.rentAmount ? `₹ ${formatRentFigure(data.rentAmount)}` : ""}
        </span>
      </div>

      {words && (
        <div style={{ ...serif, marginBottom: 14, fontStyle: "italic", fontSize: 13, color: "#444" }}>
          (Rupees: <strong>{words}</strong>)
        </div>
      )}

      <div style={{ ...serif, marginBottom: 14, lineHeight: 2 }}>
        for the rental of property located at{" "}
        <span style={{ borderBottom: "1px solid #555", paddingBottom: 1, minWidth: 200, display: "inline-block", textAlign: "center" }}>
          {data.propertyAddress || ""}
        </span>
        {" "}for the
      </div>

      <div style={{ ...serif, marginBottom: 24, lineHeight: 2 }}>
        period{" "}
        <span style={{ borderBottom: "1px solid #555", paddingBottom: 1, minWidth: 100, display: "inline-block", textAlign: "center" }}>
          {formatMonthYear(data.periodFrom)}
        </span>
        {" "}to{" "}
        <span style={{ borderBottom: "1px solid #555", paddingBottom: 1, minWidth: 100, display: "inline-block", textAlign: "center" }}>
          {formatMonthYear(data.periodTo)}
        </span>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <img
          src={REVENUE_STAMP_DATA_URI}
          alt="Revenue stamp"
          style={{ width: 64, height: 78, objectFit: "contain" }}
        />
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 8 }}>
        <div style={serif}>
          <strong>Payment Method:</strong><br />
          <span style={{ marginTop: 4, display: "block" }}>{data.paymentMethod || ""}</span>
          {data.paymentRef && (
            <span style={{ fontSize: 12, color: "#555", display: "block", marginTop: 2 }}>Ref: {data.paymentRef}</span>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ ...serif, marginBottom: 32 }}><strong>Landlord's Signature</strong></div>
          <div style={serif}><strong>PAN :</strong> {data.landlordPan || "_____________"}</div>
          {data.landlordName && <div style={{ ...serif, marginTop: 6, fontSize: 13 }}>{data.landlordName}</div>}
        </div>
      </div>
    </div>
  );
}
