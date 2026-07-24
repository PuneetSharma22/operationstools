const serif = { fontFamily: "'Times New Roman', Georgia, serif" };
import { REVENUE_STAMP_DATA_URI } from "./revenueStampAsset";

const formatDate = (d) => {
  if (!d) return "—";
  const dt = new Date(d);
  return `${String(dt.getDate()).padStart(2, "0")}/${String(dt.getMonth() + 1).padStart(2, "0")}/${dt.getFullYear()}`;
};
const formatMonthName = (d) => {
  if (!d) return "—";
  return new Date(d + "-02").toLocaleDateString("en-IN", { month: "long" });
};

const amountToWords = (amount) => {
  if (!amount || isNaN(amount)) return "";
  const ones = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine",
    "Ten", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  const numToWords = (n) => {
    if (n === 0) return "Zero";
    if (n < 20) return ones[n];
    if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 ? " " + ones[n % 10] : "");
    if (n < 1000) return ones[Math.floor(n / 100)] + " Hundred" + (n % 100 ? " " + numToWords(n % 100) : "");
    if (n < 100000) return numToWords(Math.floor(n / 1000)) + " Thousand" + (n % 1000 ? " " + numToWords(n % 1000) : "");
    return numToWords(Math.floor(n / 100000)) + " Lakh" + (n % 100000 ? " " + numToWords(n % 100000) : "");
  };
  return numToWords(parseInt(amount)) + " Rupees Only";
};

function TableRow({ label, value, last }) {
  return (
    <div style={{ display: "flex", borderBottom: last ? "none" : "1px solid #333" }}>
      <div style={{ ...serif, fontSize: 12.5, fontWeight: 700, padding: "6px 10px", width: "42%", borderRight: "1px solid #333" }}>{label}</div>
      <div style={{ ...serif, fontSize: 12.5, padding: "6px 10px", flex: 1 }}>{value || "N/A"}</div>
    </div>
  );
}

export default function TemplateRentReceipt4({ data }) {
  const periodLabel = !data.periodFrom ? "" : (!data.periodTo || data.periodFrom === data.periodTo)
    ? formatMonthName(data.periodFrom)
    : `${formatMonthName(data.periodFrom)} – ${formatMonthName(data.periodTo)}`;
  const words = amountToWords(data.rentAmount);

  return (
    <div style={{
      background: "#FBFAF6",
      border: "1px solid #e9e6dd",
      padding: "30px 34px",
      color: "#1a1a1a",
      maxWidth: 540,
      margin: "0 auto",
      boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
    }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <span style={{ ...serif, fontSize: 12 }}>DATE: {formatDate(data.receiptDate)}</span>
      </div>
      <h2 style={{ ...serif, fontSize: 26, fontWeight: 900, letterSpacing: 4, textAlign: "center", margin: "0 0 4px" }}>RENT RECEIPT</h2>
      <p style={{ ...serif, fontSize: 12.5, fontStyle: "italic", textAlign: "center", color: "#5a5142", margin: "0 0 16px" }}>
        Monthly tenancy payment acknowledgement
      </p>
      <div style={{ borderTop: "2px solid #1a1a1a", marginBottom: 4 }} />

      <div style={{ border: "1px solid #333", marginBottom: 20 }}>
        <TableRow label="LANDLORD" value={data.landlordName} />
        <TableRow label="TENANT" value={data.tenantName} />
        <TableRow label="PROPERTY ADDRESS" value={data.propertyAddress} />
        <TableRow label="RENTAL PERIOD" value={periodLabel} />
        <TableRow label="AMOUNT RECEIVED" value={data.rentAmount ? `₹ ${parseInt(data.rentAmount).toLocaleString("en-IN")}` : ""} />
        <TableRow label="MODE OF PAYMENT" value={data.paymentMethod} last />
      </div>

      <p style={{ ...serif, fontSize: 13, lineHeight: 1.7, margin: "0 0 12px" }}>
        I, <strong>{data.landlordName || "N/A"}</strong>, hereby acknowledge receipt of rent amounting to{" "}
        <strong>₹ {data.rentAmount ? parseInt(data.rentAmount).toLocaleString("en-IN") : "0"}</strong>
        {words && <> (<strong>{words}</strong>)</>} from <strong>{data.tenantName || "N/A"}</strong> for the tenancy period of <strong>{periodLabel || "N/A"}</strong>.
      </p>
      <p style={{ ...serif, fontSize: 13, lineHeight: 1.7, margin: "0 0 20px" }}>
        The rent pertains to the premises situated at <strong>{data.propertyAddress || "N/A"}</strong>, and this receipt is issued to serve as proof of payment for accounting, tax, and reimbursement purposes.
      </p>

      <div style={{ borderTop: "1px dashed #999", marginBottom: 14 }} />

      <ol style={{ ...serif, fontSize: 11.5, color: "#5a5142", margin: "0 0 24px", paddingLeft: 18, lineHeight: 1.6 }}>
        <li>This receipt confirms payment only for the month mentioned above.</li>
        <li>Utility charges, penalties, or maintenance are excluded unless stated separately.</li>
        <li>The parties affirm that the details in this receipt are true and correct.</li>
      </ol>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 8 }}>
        <div>
          <div style={{ borderBottom: "1px solid #1a1a1a", width: 200, marginBottom: 6 }} />
          <div style={{ ...serif, fontSize: 12.5, fontWeight: 700 }}>TENANT SIGNATURE</div>
          <div style={{ ...serif, fontSize: 12, marginTop: 4 }}>Name: {data.tenantName || "N/A"}</div>
          <div style={{ ...serif, fontSize: 12 }}>Period: {periodLabel || "N/A"}</div>
        </div>
        <img
          src={REVENUE_STAMP_DATA_URI}
          alt="Revenue stamp"
          style={{ width: 56, height: 68, objectFit: "contain" }}
        />
      </div>
    </div>
  );
}
