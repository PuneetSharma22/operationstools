const dot = { fontFamily: "'Courier New', monospace", fontSize: "13px" };
const wrap = { background: "#fff", border: "1px solid #e5e7eb", borderRadius: 12, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)" };
const inner = { maxWidth: "320px", margin: "0 auto", padding: "24px 20px" };
const divider = { borderTop: "1px dashed #999", margin: "12px 0" };

export default function TemplateThermalFull({ data }) {
  const qty = parseFloat(data.quantity) || 0;
  const rate = parseFloat(data.pricePerLitre) || 0;
  const total = qty * rate;
  const atot = data.atot || "";
  const vtot = data.vtot || "";

  const formatDate = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    const dd = String(dt.getDate()).padStart(2, "0");
    const mm = String(dt.getMonth() + 1).padStart(2, "0");
    const yy = String(dt.getFullYear()).slice(-2);
    return `${dd}/${mm}/${yy}`;
  };

  const fmtAmt = (n) => n.toFixed(2).padStart(9, "0");
  const fmtVol = (n) => n.toFixed(2).padStart(9, "0");

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
      <div style={inner}>
        <div style={{ ...dot, textAlign: "center", marginBottom: 4 }}>
          {data.logoUrl && (
            <img src={data.logoUrl} alt="logo" style={{ height: 48, objectFit: "contain", marginBottom: 6, display: "block", margin: "0 auto 6px" }} />
          )}
          <div style={{ fontWeight: "bold", fontSize: 17, letterSpacing: 1 }}>{data.stationName || "IndianOil"}</div>
          <div style={{ fontSize: 13, fontStyle: "italic" }}>Welcomes You</div>
          {data.stationAddress && <div style={{ fontSize: 11, marginTop: 2, lineHeight: 1.3 }}>{data.stationAddress}</div>}
          <div style={{ fontSize: 12, marginTop: 2 }}>Tel. No.: {data.stationPhone || ""}</div>
        </div>

        <div style={divider} />

        <InfoRow label="Inv.No" value={data.invoiceNo || data.billNumber || ""} indent={10} />
        {data.fccId && <InfoRow label="FCC ID" value={data.fccId} indent={10} />}
        {data.fipNo && <InfoRow label="FIP No." value={data.fipNo} indent={10} />}
        <InfoRow label="Nozzle No." value={data.nozzleNo || ""} indent={10} />
        <InfoRow label="Product" value={data.fuelType || ""} indent={10} />
        {data.density && <InfoRow label="Density" value={`${data.density}Kg/Cu.mtr`} indent={10} />}
        {data.presetType && <InfoRow label="Preset Type" value={data.presetType} indent={10} />}

        <div style={divider} />

        <InfoRow label="Rate(Rs/L)" value={rate.toFixed(2)} indent={12} />
        <InfoRow label="Volume(L)" value={fmtVol(qty)} indent={12} />
        <InfoRow label="Amount(Rs)" value={fmtAmt(total)} indent={12} />
        {atot && <InfoRow label="Atot" value={atot} indent={12} />}
        {vtot && <InfoRow label="Vtot" value={vtot} indent={12} />}

        <div style={divider} />

        <InfoRow label="Vehicle No" value={data.vehicleNumber || ""} indent={12} />
        <InfoRow label="Mobile No" value={data.mobileNo || "Not Entered"} indent={12} />

        <div style={divider} />

        <InfoRow label="Date" value={formatDate(data.billDate)} indent={6} />
        <InfoRow label="Time" value={data.billTime || ""} indent={6} />

        {data.paymentMode && (
          <>
            <div style={divider} />
            <InfoRow label="Mode" value={data.paymentMode} indent={6} />
          </>
        )}
        {data.lstNumber && <InfoRow label="LST No." value={data.lstNumber} indent={10} />}
        {data.vatTin && <InfoRow label="VAT No." value={data.vatTin} indent={10} />}
        {data.attendantId && <InfoRow label="Attendant ID" value={data.attendantId} indent={14} />}

        <div style={divider} />

        <div style={{ ...dot, textAlign: "center", fontSize: 12, lineHeight: 1.5 }}>
          Thank You! Please Visit<br />Again..
        </div>

        <div style={divider} />

        <div style={{ ...dot, fontSize: 11 }}>
          Printed on:<br />{printedOn}
        </div>
      </div>
    </div>
  );
}
