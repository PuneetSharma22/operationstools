const mono = { fontFamily: "'Times New Roman', Georgia, serif" };

const amountToWords = (amount) => {
  if (!amount || isNaN(amount)) return "";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];

  const numToWords = (n) => {
    if (n === 0) return "";
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + numToWords(n % 100) : "");
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + numToWords(n % 1000) : "");
    if (n < 10000000) return numToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + numToWords(n % 100000) : "");
    return numToWords(Math.floor(n / 10000000)) + " Crore" + (n % 10000000 ? " " + numToWords(n % 10000000) : "");
  };

  const n = parseInt(amount);
  return numToWords(n) + " Rupees Only";
};

const formatDate = (d) => {
  if (!d) return "___________";
  return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
};

const formatMonthYear = (d) => {
  if (!d) return "___________";
  return new Date(d).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
};

export default function TemplateRentReceipt({ data }) {
  const words = amountToWords(data.rentAmount);

  return (
    <div style={{
      background: "#f5f0e8",
      border: "2px solid #c8b89a",
      borderRadius: 4,
      padding: "32px 36px",
      fontFamily: "'Times New Roman', Georgia, serif",
      fontSize: 14,
      color: "#1a1a1a",
      maxWidth: 520,
      margin: "0 auto",
      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    }}>

      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 24 }}>
        <h2 style={{ ...mono, fontSize: 22, fontWeight: 900, letterSpacing: 2, margin: 0, textDecoration: "underline", textUnderlineOffset: 4 }}>
          Rent Receipt
        </h2>
      </div>

      {/* Date + Receipt No */}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
        <div style={mono}>
          <strong>Date :</strong> {formatDate(data.receiptDate)}
        </div>
        <div style={mono}>
          <strong>Receipt No.</strong> {data.receiptNo || "___"}
        </div>
      </div>

      {/* Received from */}
      <div style={{ ...mono, marginBottom: 14, lineHeight: 2 }}>
        Rent Received from{" "}
        <span style={{ borderBottom: "1px solid #555", paddingBottom: 1, minWidth: 160, display: "inline-block", textAlign: "center" }}>
          {data.tenantName || ""}
        </span>
        {" "}the sum of{" "}
        <span style={{ borderBottom: "1px solid #555", paddingBottom: 1, minWidth: 120, display: "inline-block", textAlign: "center" }}>
          {data.rentAmount ? `₹ ${parseInt(data.rentAmount).toLocaleString("en-IN")}` : ""}
        </span>
      </div>

      {/* Amount in words */}
      {words && (
        <div style={{ ...mono, marginBottom: 14, fontStyle: "italic", fontSize: 13, color: "#444" }}>
          (Rupees: <strong>{words}</strong>)
        </div>
      )}

      {/* Property */}
      <div style={{ ...mono, marginBottom: 14, lineHeight: 2 }}>
        for the rental of property located at{" "}
        <span style={{ borderBottom: "1px solid #555", paddingBottom: 1, minWidth: 200, display: "inline-block", textAlign: "center" }}>
          {data.propertyAddress || ""}
        </span>
        {" "}for the
      </div>

      {/* Period */}
      <div style={{ ...mono, marginBottom: 24, lineHeight: 2 }}>
        period{" "}
        <span style={{ borderBottom: "1px solid #555", paddingBottom: 1, minWidth: 100, display: "inline-block", textAlign: "center" }}>
          {formatMonthYear(data.periodFrom)}
        </span>
        {" "}to{" "}
        <span style={{ borderBottom: "1px solid #555", paddingBottom: 1, minWidth: 100, display: "inline-block", textAlign: "center" }}>
          {formatMonthYear(data.periodTo)}
        </span>
      </div>

      {/* Revenue stamp area */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <div style={{
          width: 72, height: 80, border: "1px dashed #999",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 10, color: "#888", textAlign: "center", lineHeight: 1.4,
          background: "rgba(255,255,255,0.5)",
        }}>
          Revenue<br />Stamp<br />₹1
        </div>
      </div>

      {/* Payment method + Signature */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginTop: 8 }}>
        <div style={mono}>
          <strong>Payment Method:</strong><br />
          <span style={{ marginTop: 4, display: "block" }}>{data.paymentMethod || ""}</span>
          {data.paymentRef && (
            <span style={{ fontSize: 12, color: "#555", display: "block", marginTop: 2 }}>
              Ref: {data.paymentRef}
            </span>
          )}
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ ...mono, marginBottom: 32 }}><strong>Landlord's Signature</strong></div>
          <div style={{ ...mono }}><strong>PAN :</strong> {data.landlordPan || "_____________"}</div>
          {data.landlordName && (
            <div style={{ ...mono, marginTop: 6, fontSize: 13 }}>{data.landlordName}</div>
          )}
        </div>
      </div>
    </div>
  );
}
