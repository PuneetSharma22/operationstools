export default function BillPreview({ data }) {
  const qty = parseFloat(data.quantity) || 0;
  const rate = parseFloat(data.pricePerLitre) || 0;
  const subtotal = qty * rate;
  const cgst = subtotal * 0.09;
  const sgst = subtotal * 0.09;
  const total = subtotal + cgst + sgst;

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric"
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8F0] shadow-sm overflow-hidden print:shadow-none print:border-none print:rounded-none">

      {/* Station Header */}
      <div className="bg-[#0F172A] px-8 py-7 text-center">
        <div className="w-12 h-12 bg-[#2563EB] rounded-xl flex items-center justify-center text-2xl mx-auto mb-4">⛽</div>
        <h2 className="text-white font-bold text-[20px] leading-tight">
          {data.stationName || "Station Name"}
        </h2>
        <p className="text-[#94a3b8] text-[13px] mt-1">{data.stationAddress}</p>
        <p className="text-[#94a3b8] text-[13px] mt-1">
          {data.stationPhone} &nbsp;·&nbsp; GST: {data.gstNumber}
        </p>
      </div>

      {/* Fuel Receipt Badge */}
      <div className="flex justify-center -mt-3">
        <span className="bg-[#2563EB] text-white text-[11px] font-bold px-4 py-1 rounded-full tracking-widest uppercase">
          Fuel Receipt
        </span>
      </div>

      <div className="px-8 py-6 space-y-6">

        {/* Bill Meta */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Bill No.", value: data.billNumber },
            { label: "Date", value: formatDate(data.billDate) },
            { label: "Time", value: data.billTime },
          ].map(({ label, value }) => (
            <div key={label} className="bg-[#F8FAFC] rounded-xl p-3 text-center">
              <p className="text-[#64748B] text-[11px] uppercase tracking-wider font-medium">{label}</p>
              <p className="text-[#0F172A] font-semibold text-[13px] mt-1">{value}</p>
            </div>
          ))}
        </div>

        {/* Customer Info */}
        <div className="space-y-2">
          {[
            { label: "Customer", value: data.customerName || "—" },
            { label: "Vehicle No.", value: data.vehicleNumber || "—" },
            { label: "Vehicle Type", value: data.vehicleType },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between items-center py-2 border-b border-[#F1F5F9] last:border-0">
              <span className="text-[#64748B] text-[13px]">{label}</span>
              <span className="text-[#0F172A] text-[13px] font-medium">{value}</span>
            </div>
          ))}
        </div>

        {/* Fuel Row */}
        <div className="bg-[#F8FAFC] rounded-xl overflow-hidden">
          <div className="grid grid-cols-4 px-4 py-2 border-b border-[#E2E8F0]">
            {["Description", "Qty (L)", "Rate (₹)", "Amount (₹)"].map((h, i) => (
              <span key={h} className={`text-[11px] font-semibold text-[#64748B] uppercase tracking-wider ${i > 0 ? "text-right" : ""}`}>{h}</span>
            ))}
          </div>
          <div className="grid grid-cols-4 px-4 py-3">
            <span className="text-[#0F172A] text-[14px] font-medium">{data.fuelType}</span>
            <span className="text-[#0F172A] text-[14px] text-right">{qty.toFixed(2)}</span>
            <span className="text-[#0F172A] text-[14px] text-right">{rate.toFixed(2)}</span>
            <span className="text-[#0F172A] text-[14px] font-semibold text-right">{subtotal.toFixed(2)}</span>
          </div>
        </div>

        {/* Tax Breakdown */}
        <div className="space-y-2">
          {[
            { label: "Subtotal", value: subtotal },
            { label: "CGST (9%)", value: cgst },
            { label: "SGST (9%)", value: sgst },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between">
              <span className="text-[#64748B] text-[13px]">{label}</span>
              <span className="text-[#0F172A] text-[13px]">₹ {value.toFixed(2)}</span>
            </div>
          ))}
        </div>

        {/* Total */}
        <div className="bg-[#0F172A] rounded-xl px-5 py-4 flex justify-between items-center">
          <span className="text-white font-bold text-[16px] tracking-wide">TOTAL</span>
          <span className="text-white font-bold text-[20px]">₹ {total.toFixed(2)}</span>
        </div>

        {/* Footer */}
        <p className="text-center text-[#94a3b8] text-[12px]">
          Thank you for visiting {data.stationName || "our station"} · Drive safe 🙏
        </p>

      </div>
    </div>
  );
}
