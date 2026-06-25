const dot = { fontFamily: "'Courier New', monospace", fontSize: "13px" };

export default function TemplateThermalFull({ data }) {
  const qty = parseFloat(data.quantity) || 0;
  const rate = parseFloat(data.pricePerLitre) || 0;
  const total = qty * rate;

  // Atot / Vtot — use provided values or leave blank
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

  // Format amount like receipt: 01000.00
  const fmtAmt = (n) => n.toFixed(2).padStart(9, "0");
  // Format volume: 00009.52
  const fmtVol = (n) => n.toFixed(2).padStart(9, "0");

  const Row = ({ label, value }) => (
    <div style={dot} className="py-[2px] leading-snug">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );

  // Label left-aligned, value indented with colon style like real receipt
  const InfoRow = ({ label, value, indent = 14 }) => (
    <div style={{ ...dot, display: "flex" }} className="py-[2px] leading-snug">
      <span style={{ minWidth: `${indent}ch` }}>{label}</span>
      <span>: {value}</span>
    </div>
  );

  const now = new Date();
  const printedOn = `${formatDate(data.billDate || now.toISOString())} ${data.billTime || ""}`.trim();

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm print:shadow-none">
      <div style={{ maxWidth: "320px", margin: "0 auto" }} className="px-5 py-6">

        {/* Header */}
        <div style={dot} className="text-center mb-1">
          <div className="font-bold text-[17px] tracking-wide">{data.stationName || "IndianOil"}</div>
          <div className="text-[13px] italic">Welcomes You</div>
          {data.stationAddress && (
            <div className="text-[11px] mt-0.5 leading-tight">{data.stationAddress}</div>
          )}
          <div className="text-[12px] mt-0.5">Tel. No.: {data.stationPhone || ""}</div>
        </div>

        <div style={{ borderTop: "1px dashed #999" }} className="my-3" />

        {/* Bill identifiers */}
        <InfoRow label="Inv.No" value={data.invoiceNo || data.billNumber || ""} indent={10} />
        {data.fccId && <InfoRow label="FCC ID" value={data.fccId} indent={10} />}
        {data.fipNo && <InfoRow label="FIP No." value={data.fipNo} indent={10} />}
        <InfoRow label="Nozzle No." value={data.nozzleNo || ""} indent={10} />
        <InfoRow label="Product" value={data.fuelType || ""} indent={10} />
        {data.density && (
          <InfoRow label="Density" value={`${data.density}Kg/Cu.mtr`} indent={10} />
        )}
        {data.presetType && (
          <InfoRow label="Preset Type" value={data.presetType} indent={10} />
        )}

        <div style={{ borderTop: "1px dashed #999" }} className="my-3" />

        {/* Fuel transaction */}
        <InfoRow label="Rate(Rs/L)" value={`${rate.toFixed(2)}`} indent={12} />
        <InfoRow label="Volume(L)" value={fmtVol(qty)} indent={12} />
        <InfoRow label="Amount(Rs)" value={fmtAmt(total)} indent={12} />
        {atot && <InfoRow label="Atot" value={atot} indent={12} />}
        {vtot && <InfoRow label="Vtot" value={vtot} indent={12} />}

        <div style={{ borderTop: "1px dashed #999" }} className="my-3" />

        {/* Vehicle / customer */}
        <InfoRow label="Vehicle No" value={data.vehicleNumber || ""} indent={12} />
        <InfoRow label="Mobile No" value={data.mobileNo || "Not Entered"} indent={12} />

        <div style={{ borderTop: "1px dashed #999" }} className="my-3" />

        {/* Date / Time */}
        <InfoRow label="Date" value={formatDate(data.billDate)} indent={6} />
        <InfoRow label="Time" value={data.billTime || ""} indent={6} />

        {/* Payment / other */}
        {data.paymentMode && (
          <>
            <div style={{ borderTop: "1px dashed #999" }} className="my-3" />
            <InfoRow label="Mode" value={data.paymentMode} indent={6} />
          </>
        )}
        {(data.lstNumber || data.vatTin) && (
          <>
            {data.lstNumber && <InfoRow label="LST No." value={data.lstNumber} indent={10} />}
            {data.vatTin && <InfoRow label="VAT No." value={data.vatTin} indent={10} />}
          </>
        )}
        {data.attendantId && (
          <InfoRow label="Attendant ID" value={data.attendantId} indent={14} />
        )}

        <div style={{ borderTop: "1px dashed #999" }} className="my-3" />

        <div style={dot} className="text-center text-[12px] leading-snug">
          Thank You! Please Visit
          <br />Again..
        </div>

        <div style={{ borderTop: "1px dashed #999" }} className="my-3" />

        <div style={dot} className="text-[11px]">
          Printed on:
          <br />
          {printedOn}
        </div>
      </div>
    </div>
  );
}
