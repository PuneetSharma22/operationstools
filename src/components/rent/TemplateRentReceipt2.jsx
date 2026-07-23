const serif = { fontFamily: "'Times New Roman', Georgia, serif" };
export const REVENUE_STAMP_URL = "https://bill-generator-assets-2.s3.ap-south-1.amazonaws.com/Revenu.jpg";

const formatDate = (d) => {
  if (!d) return "___________";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
};
const formatMonthName = (d) => {
  if (!d) return "___________";
  return new Date(d + "-02").toLocaleDateString("en-IN", { month: "long" });
};

function ReceiptBlock({ data, compact }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 10 }}>
        <span style={{ ...serif, fontSize: compact ? 13 : 15, fontWeight: 700 }}>
          Rent of the Month: <span style={{ fontWeight: 400 }}>{formatMonthName(data.periodFrom)}</span>
        </span>
        {!compact && (
          <span style={{ ...serif, fontSize: 13, fontWeight: 700 }}>
            Rental Address: <span style={{ fontWeight: 400 }}>{data.propertyAddress || ""}</span>
          </span>
        )}
        {compact && (
          <span style={{ ...serif, fontSize: 13, fontWeight: 700 }}>
            Amount: <span style={{ fontWeight: 400 }}>₹ {data.rentAmount ? parseInt(data.rentAmount).toLocaleString("en-IN") : "0"}</span>
          </span>
        )}
        <span style={{ ...serif, fontSize: 13, fontWeight: 700 }}>
          Date: <span style={{ fontWeight: 400 }}>{formatDate(data.receiptDate)}</span>
        </span>
      </div>

      {!compact && (
        <div style={{ ...serif, fontSize: 13.5, lineHeight: 1.8, marginBottom: 10 }}>
          Received From Mr./Ms. <strong>{data.tenantName || ""}</strong> ₹{" "}
          <strong>{data.rentAmount ? parseInt(data.rentAmount).toLocaleString("en-IN") : "0"}</strong> towards rent of month of{" "}
          <strong>{formatMonthName(data.periodFrom)}</strong> Received By landlord Mr./Ms. <strong>{data.landlordName || ""}</strong>.
        </div>
      )}

      {!compact && (
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
          <span style={{ ...serif, fontSize: 13, fontWeight: 700 }}>Employee Name: <span style={{ fontWeight: 400 }}>{data.tenantName || ""}</span></span>
        </div>
      )}

      {compact && (
        <>
          <div style={{ ...serif, fontSize: 13, marginBottom: 4 }}>
            Received From Mr./Ms. <strong>{data.tenantName || ""}</strong>
          </div>
          <div style={{ ...serif, fontSize: 13, marginBottom: 10 }}>
            Landlord Name Mr./Ms. <strong>{data.landlordName || ""}</strong>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <div>
              <div style={{ ...serif, fontSize: 12, marginBottom: 4 }}>Revenue Stamp</div>
              <img
                src={REVENUE_STAMP_URL}
                alt="Revenue stamp"
                style={{ width: 48, height: 58, objectFit: "contain" }}
                onError={(e) => { e.target.style.display = "none"; }}
              />
            </div>
            <span style={{ ...serif, fontSize: 12.5 }}>Receiver's Name</span>
            <span style={{ ...serif, fontSize: 12.5 }}>Received By: <strong>{data.landlordName || "landlord"}</strong></span>
          </div>
        </>
      )}
    </div>
  );
}

export default function TemplateRentReceipt2({ data }) {
  return (
    <div style={{
      background: "#FBFAF6",
      border: "1px solid #e9e6dd",
      padding: "28px 32px",
      ...serif,
      color: "#1a1a1a",
      maxWidth: 540,
      margin: "0 auto",
      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    }}>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 4 }}>
        <span style={{ ...serif, fontSize: 13 }}>Date: {formatDate(data.receiptDate)}</span>
      </div>
      <h2 style={{ ...serif, fontSize: 20, fontWeight: 900, textAlign: "center", textDecoration: "underline", textUnderlineOffset: 4, margin: "0 0 20px" }}>
        Rent Receipt
      </h2>

      <ReceiptBlock data={data} compact={false} />

      <div style={{ borderTop: "2px dashed #b0a284", margin: "24px 0" }} />

      <h3 style={{ ...serif, fontSize: 16, fontWeight: 900, textDecoration: "underline", textUnderlineOffset: 4, margin: "0 0 16px" }}>
        Receipt Acknowledgement
      </h3>
      <ReceiptBlock data={data} compact={true} />
    </div>
  );
}
