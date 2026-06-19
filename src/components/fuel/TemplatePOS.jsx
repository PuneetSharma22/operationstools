const mono = { fontFamily: "Courier New, monospace" };

export default function TemplatePOS({ data }) {
  const qty = parseFloat(data.quantity) || 0;
  const rate = parseFloat(data.pricePerLitre) || 0;
  const total = qty * rate;

  const formatDate = (d) => {
    if (!d) return "";
    const dt = new Date(d);
    return `${String(dt.getDate()).padStart(2,"0")}/${String(dt.getMonth()+1).padStart(2,"0")}/${dt.getFullYear()}`;
  };

  const Line = ({ label, value }) => (
    <div style={mono} className="text-[13px] py-0.5">
      <span className="font-bold">{label}</span>
      <span className="ml-1">{value}</span>
    </div>
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm print:shadow-none print:border-none">
      <div className="px-7 py-7">

        {/* Logo */}
        {data.logoUrl && (
          <div className="flex justify-center mb-4">
            <img src={data.logoUrl} alt="logo" className="h-14 object-contain" onError={(e) => e.target.style.display = "none"} />
          </div>
        )}

        {/* Station */}
        <div style={mono} className="font-black text-[18px] uppercase mb-1">{data.stationName}</div>
        <div style={mono} className="text-[12px] mb-0.5">{data.stationAddress}</div>
        <div style={mono} className="text-[12px] mb-0.5">TEL {data.stationPhone}</div>
        <div style={mono} className="text-[12px] mb-3">VAT TIN NO {data.vatTin}</div>

        <div style={mono} className="text-center font-bold text-[13px] mb-1">ORIGINAL</div>
        <div style={{ ...mono, borderTop: "1px dashed #666", borderBottom: "1px dashed #666" }} className="py-1 text-center text-[12px] mb-3 tracking-widest">
          ****************************
        </div>

        <div style={mono} className="text-[13px] mb-3">
          {formatDate(data.billDate)} &nbsp; {data.billTime}
        </div>

        <Line label="TXN NO:" value={data.txnNo} />
        <Line label="INVOICE NO:" value={data.invoiceNo} />
        <Line label="VEHICLE NO:" value={data.vehicleNumber || "NOT ENTERED"} />
        <Line label="PRESET:" value={data.presetType?.toUpperCase()} />

        <div style={{ borderTop: "1px dashed #666" }} className="my-3" />

        <Line label="NOZZLE NO:" value={data.nozzleNo} />
        <Line label="PRODUCT:" value={data.fuelType?.toUpperCase()} />
        <Line label="DENSITY:" value={`${data.density} kg/m3`} />
        <Line label="RATE    :" value={`${rate.toFixed(1)} INR/Ltr`} />
        <Line label="VOLUME  :" value={`${qty.toFixed(1)} Ltr`} />
        <Line label="AMOUNT  :" value={`${total.toFixed(1)} INR`} />

        <div style={{ borderTop: "1px dashed #666" }} className="my-3" />

        <div style={mono} className="text-center text-[13px] font-bold">Thank You! Visit Again</div>
      </div>
    </div>
  );
}
