const dot = { fontFamily: "'Courier New', monospace", fontSize: "13px" };

export default function TemplateThermalCompact({ data }) {
  const qty = parseFloat(data.quantity) || 0;
  const rate = parseFloat(data.pricePerLitre) || 0;
  const total = qty * rate;

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
  };

  const Row = ({ label, value }) => (
    <div style={dot} className="py-0.5">
      <span className="font-bold">{label} </span>
      <span>{value}</span>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm print:shadow-none">
      <div className="px-6 py-6">
        <div style={dot} className="text-center font-bold text-[14px] mb-3">WELCOME!!!</div>

        <Row label="Receipt No.:" value={data.billNumber} />

        <div style={{ borderTop: "1px dashed #999" }} className="my-3" />

        <Row label="PRODUCT:" value={data.fuelType} />
        <Row label="RATE/LTR:" value={`₹ ${rate.toFixed(2)}`} />
        <Row label="AMOUNT:" value={`₹ ${total.toFixed(2)}`} />
        <Row label="VOLUME(LTR.):" value={`${qty.toFixed(2)} lt`} />

        <div style={{ borderTop: "1px dashed #999" }} className="my-3" />

        <Row label="VEH TYPE:" value={data.vehicleType} />
        <Row label="VEH NO:" value={data.vehicleNumber} />
        <Row label="CUSTOMER NAME:" value={data.customerName} />

        <div style={{ borderTop: "1px dashed #999" }} className="my-3" />

        <div style={dot} className="flex justify-between">
          <span><span className="font-bold">Date:</span> {formatDate(data.billDate)}</span>
          <span><span className="font-bold">Time:</span> {data.billTime}</span>
        </div>

        <div style={{ borderTop: "1px dashed #999" }} className="my-3" />

        <Row label="MODE:" value={data.paymentMode} />

        <div style={{ borderTop: "1px dashed #999" }} className="my-3" />

        <div style={dot} className="text-center text-[12px]">
          SAVE FUEL YAANI SAVE MONEY!! THANKS FOR FUELLING WITH US.
        </div>
      </div>
    </div>
  );
}
