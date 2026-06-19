export default function TemplateIOCL({ data }) {
  const qty = parseFloat(data.quantity) || 0;
  const rate = parseFloat(data.pricePerLitre) || 0;
  const total = qty * rate;

  const formatDate = (d) => {
    if (!d) return "";
    return new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
  };

  const Row = ({ label, value }) => (
    <div className="flex justify-between items-baseline py-2.5 border-b border-dashed border-gray-300">
      <span style={{ fontFamily: "Courier New, monospace", fontWeight: "700", fontSize: "13px" }}>{label}</span>
      <span style={{ fontFamily: "Courier New, monospace", fontSize: "13px" }}>{value}</span>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm print:shadow-none print:border-none" style={{ fontFamily: "Courier New, monospace" }}>
      <div className="px-8 py-8">

        {/* Logo + Header */}
        <div className="flex flex-col items-center mb-6">
          {data.logoUrl && (
            <img
              src={data.logoUrl}
              alt="station logo"
              className="h-16 object-contain mb-3"
              onError={(e) => e.target.style.display = "none"}
            />
          )}
          <p className="text-center text-[13px]">{data.stationName}</p>
          <p className="text-center text-[12px] text-gray-600 mt-1">{data.stationAddress}</p>
        </div>

        <div className="border-t-2 border-b-2 border-black mb-4" />

        <Row label="TEL:" value={data.stationPhone} />
        <div className="mb-2" />
        <Row label="RECEIPT NO:" value={data.billNumber} />
        <Row label="DATE & TIME:" value={`${formatDate(data.billDate)}, ${data.billTime}`} />
        <Row label="SHIFT:" value={data.shift} />
        <Row label="PUMP NO:" value={data.pumpNo} />
        <Row label="NOZZLE NO:" value={data.nozzleNo} />
        <div className="mb-2" />
        <Row label="PRODUCT:" value={data.fuelType} />
        <Row label="RATE/LTR:" value={`₹${rate.toFixed(2)}`} />
        <Row label="QTY(LTR):" value={`${qty.toFixed(2)} Ltr`} />
        <div className="mb-2" />
        <Row label="CUSTOMER:" value={data.customerName || "Not Entered"} />
        <Row label="VEHICLE NO:" value={data.vehicleNumber || "Not Entered"} />
        <Row label="VEHICLE TYPE:" value={data.vehicleType} />
        <div className="mb-2" />
        <Row label="PAYMENT:" value={data.paymentMode} />

        <div className="border-t-2 border-b-2 border-black mt-2 mb-4" />

        <div className="flex justify-between items-baseline py-1">
          <span style={{ fontFamily: "Courier New, monospace", fontWeight: "900", fontSize: "15px" }}>TOTAL AMOUNT:</span>
          <span style={{ fontFamily: "Courier New, monospace", fontWeight: "900", fontSize: "15px" }}>₹{total.toFixed(2)}</span>
        </div>

        <div className="border-b-2 border-black mt-2 mb-6" />

        <p className="text-center text-[12px] tracking-widest mb-1">* * * * * * * * * * * * * * *</p>
        <p className="text-center text-[12px] mt-4">Thank You! Visit Again</p>
        <p className="text-center text-[12px]">Save Fuel, Save Money.</p>
      </div>
    </div>
  );
}
