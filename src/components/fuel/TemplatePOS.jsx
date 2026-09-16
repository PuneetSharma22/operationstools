import BankStrip from "./BankStrip";
import { computeTotals, formatDateLong } from "./billMath";

const mono = { fontFamily: "monospace", letterSpacing: "0.3px" };
const wrap = { background: "#FBFAF6", border: "1px solid #e9e6dd", borderRadius: 0, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", position: "relative", zIndex: 0 };
// A literal dash-character line rather than a CSS dashed border — CSS
// border-style:dashed can rasterize inconsistently (often much thicker than
// on-screen) when captured via html2canvas, and real thermal printers print
// this as actual characters anyway, not a rule line.
const Divider = () => (
  <div style={{ ...mono, fontSize: 13, color: "#4b5563", margin: "12px 0" }}>
    {"-".repeat(40)}
  </div>
);

const Line = ({ label, value }) => (
  <div style={{ ...mono, fontSize: 13, padding: "2px 0" }}>
    <span style={{ fontWeight: "bold" }}>{label}</span>
    <span style={{ marginLeft: 4 }}>{value}</span>
  </div>
);

export default function TemplatePOS({ data }) {
  const { qty, rate, total } = computeTotals(data);
  const formatDate = formatDateLong;

  return (
    <div style={wrap}>
      <BankStrip logoUrl={data.bankLogoUrl} bank="BANK" color="#003A79" codes={["VSB", "A02/2024"]} />
      <div style={{ padding: "28px" }}>
        {data.logoUrl && (
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
            <img src={data.logoUrl} alt="logo" crossOrigin="anonymous" style={{ height: 56, objectFit: "contain" }} onError={(e) => e.target.style.display = "none"} />
          </div>
        )}

        <div style={{ ...mono, fontWeight: 900, fontSize: 18, textTransform: "uppercase", marginBottom: 4 }}>{data.stationName}</div>
        <div style={{ ...mono, fontSize: 12, marginBottom: 2 }}>{data.stationAddress}</div>
        <div style={{ ...mono, fontSize: 12, marginBottom: 2 }}>TEL {data.stationPhone}</div>
        <div style={{ ...mono, fontSize: 12, marginBottom: 12 }}>GST NO {data.vatTin}</div>

        <div style={{ ...mono, textAlign: "center", fontWeight: "bold", fontSize: 13, marginBottom: 4 }}>ORIGINAL</div>
        <div style={{ ...mono, borderTop: "1px dashed #666", borderBottom: "1px dashed #666", padding: "4px 0", textAlign: "center", fontSize: 12, marginBottom: 12, letterSpacing: 2 }}>
          ****************************
        </div>

        <div style={{ ...mono, fontSize: 13, marginBottom: 12 }}>
          {formatDate(data.billDate)} &nbsp; {data.billTime}
        </div>

        <Line label="INVOICE NO:" value={data.invoiceNo} />
        {data.billNumber && <Line label="BILL NO:" value={data.billNumber} />}
        <Line label="VEHICLE NO:" value={data.vehicleNumber || "NOT ENTERED"} />
        {data.vehicleType && <Line label="VEH TYPE:" value={data.vehicleType} />}
        {data.customerName && <Line label="CUSTOMER:" value={data.customerName} />}
        {data.mobileNo && <Line label="MOBILE NO:" value={data.mobileNo} />}
        <Line label="PRESET:" value={data.presetType?.toUpperCase()} />

        <Divider />

        <Line label="NOZZLE NO:" value={data.nozzleNo} />
        <Line label="PRODUCT:" value={data.fuelType?.toUpperCase()} />
        <Line label="DENSITY:" value={`${data.density} kg/m3`} />
        <Line label="RATE    :" value={`${rate.toFixed(1)} INR/Ltr`} />
        <Line label="VOLUME  :" value={`${qty.toFixed(1)} Ltr`} />
        <Line label="AMOUNT  :" value={`${total.toFixed(1)} INR`} />

        {data.paymentMode && <Line label="MODE    :" value={data.paymentMode?.toUpperCase()} />}

        <Divider />

        <div style={{ ...mono, textAlign: "center", fontSize: 13, fontWeight: "bold" }}>Thank You! Visit Again</div>
      </div>
    </div>
  );
}
