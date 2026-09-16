import BankStrip from "./BankStrip";
import { computeTotals, formatDateShort, fmtAmt, fmtVol } from "./billMath";

const dot = { fontFamily: "monospace", fontSize: "13px", letterSpacing: "0.3px" };
const CONTENT_WIDTH = 320;
const wrap = {
  background: "#FBFAF6",
  border: "1px solid #e9e6dd",
  borderRadius: 0,
  overflow: "hidden",
  boxShadow: "0 1px 3px rgba(0,0,0,0.08)",
  position: "relative",
  zIndex: 0,
  maxWidth: CONTENT_WIDTH + 40,
  margin: "0 auto",
};
const inner = { padding: "24px 20px" };
// A literal dash-character line rather than a CSS dashed border — see
// TemplatePOS.jsx for why.
const Divider = () => (
  <div style={{ ...dot, color: "#4b5563", margin: "12px 0" }}>
    {"-".repeat(34)}
  </div>
);

export default function TemplateThermalFull({ data }) {
  const { qty, rate, total } = computeTotals(data);
  const formatDate = formatDateShort;

  const InfoRow = ({ label, value, indent = 14 }) => (
    <div style={{ ...dot, display: "flex", padding: "2px 0", lineHeight: 1.4 }}>
      <span style={{ minWidth: `${indent}ch` }}>{label}</span>
      <span>: {value}</span>
    </div>
  );

  const now = new Date();
  const printedOn = `${formatDate(data.billDate || now.toISOString())} ${data.billTime || ""}`.trim();

  return (
    <div style={wrap}>
      <BankStrip logoUrl={data.bankLogoUrl} bank="BANK" color="#1B3A6B" codes={["5001", "A01/2019"]} />
      <div style={inner}>
        <div style={{ ...dot, textAlign: "center", marginBottom: 4 }}>
          {data.logoUrl && (
            <img src={data.logoUrl} alt="logo" crossOrigin="anonymous" style={{ height: 48, objectFit: "contain", marginBottom: 6, display: "block", margin: "0 auto 6px" }} />
          )}
          <div style={{ fontWeight: "bold", fontSize: 17, letterSpacing: 1 }}>{data.stationName || "IndianOil"}</div>
          <div style={{ fontSize: 13, fontStyle: "italic" }}>Welcomes You</div>
          {data.stationAddress && <div style={{ fontSize: 11, marginTop: 2, lineHeight: 1.3 }}>{data.stationAddress}</div>}
          <div style={{ fontSize: 12, marginTop: 2 }}>Tel. No.: {data.stationPhone || ""}</div>
        </div>

        <Divider />

        <InfoRow label="Inv.No" value={data.invoiceNo || data.billNumber || ""} indent={10} />
        <InfoRow label="Nozzle No." value={data.nozzleNo || ""} indent={10} />
        <InfoRow label="Product" value={data.fuelType || ""} indent={10} />
        {data.density && <InfoRow label="Density" value={`${data.density} Kg/Cu.mtr`} indent={10} />}
        {data.presetType && <InfoRow label="Preset Type" value={data.presetType} indent={10} />}

        <Divider />

        <InfoRow label="Rate(Rs/L)" value={rate.toFixed(2)} indent={12} />
        <InfoRow label="Volume(L)" value={fmtVol(qty)} indent={12} />
        <InfoRow label="Amount(Rs)" value={fmtAmt(total)} indent={12} />

        <Divider />

        <InfoRow label="Vehicle No" value={data.vehicleNumber || ""} indent={12} />
        {data.vehicleType && <InfoRow label="Vehicle Type" value={data.vehicleType} indent={12} />}
        {data.customerName && <InfoRow label="Customer" value={data.customerName} indent={12} />}
        <InfoRow label="Mobile No" value={data.mobileNo || "Not Entered"} indent={12} />

        <Divider />

        <InfoRow label="Date" value={formatDate(data.billDate)} indent={6} />
        <InfoRow label="Time" value={data.billTime || ""} indent={6} />

        {data.paymentMode && (
          <>
            <Divider />
            <InfoRow label="Mode" value={data.paymentMode} indent={6} />
          </>
        )}
        {data.vatTin && <InfoRow label="GST No." value={data.vatTin} indent={10} />}
        {data.attendantId && <InfoRow label="Attendant ID" value={data.attendantId} indent={14} />}

        <Divider />

        <div style={{ ...dot, textAlign: "center", fontSize: 12, lineHeight: 1.5 }}>
          Thank You! Please Visit<br />Again..
        </div>

        <Divider />

        <div style={{ ...dot, fontSize: 11 }}>
          Printed on:<br />{printedOn}
        </div>
      </div>
    </div>
  );
}
