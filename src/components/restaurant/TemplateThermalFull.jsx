import { computeTotals, formatINR } from "./billMath";

// TemplateThermalFull — restaurant equivalent of TemplateThermalFull.jsx (fuel):
// dot-matrix look, every field shown (FSSAI, GSTIN, Order No, Waiter ID).
// This is the closest match to the uploaded reference receipt.
export default function TemplateThermalFull({ data }) {
  const t = computeTotals(data);
  const dt = data.dateTime ? new Date(data.dateTime) : new Date();

  return (
    <div
      className="mx-auto w-[380px] bg-white p-6 text-[13px] text-black"
      style={{ fontFamily: "'Courier New', monospace", letterSpacing: "0.5px" }}
    >
      <div className="text-center">
        {data.establishedYear && (
          <p className="text-[11px]">Estd. {data.establishedYear}</p>
        )}
        <h1 className="text-[19px] font-bold">
          {data.restaurantName || "Restaurant Name"}
        </h1>
        <p className="text-[11px]">{data.address}</p>
      </div>

      <div className="my-2 border-t border-dashed border-black" />

      <div className="space-y-0.5 text-[11px]">
        <Row label="Name" value={data.customerName || "—"} />
        <Row label="Date" value={dt.toLocaleDateString("en-GB")} />
        <Row label="Time" value={dt.toLocaleTimeString("en-GB")} />
        <Row label="Bill No" value={data.billNo} />
        <Row label="Order No" value={data.orderNo} />
        <Row label="Dine In" value={data.dineIn} />
        <Row label="Cashier" value={data.cashier} />
        <Row label="Waiter ID" value={data.waiterId} />
        {data.gstin && <Row label="GSTIN" value={data.gstin} />}
        {data.fssaiNo && <Row label="FSSAI No" value={data.fssaiNo} />}
      </div>

      <div className="my-2 border-t border-dashed border-black" />

      <div className="grid grid-cols-[1fr_24px_45px_50px] text-[10px] font-bold uppercase">
        <span>Item</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Price</span>
        <span className="text-right">Amt</span>
      </div>
      {t.items.map((it, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_24px_45px_50px] py-0.5 text-[11px]"
        >
          <span>{it.name}</span>
          <span className="text-right">{it.qty}</span>
          <span className="text-right">{Number(it.price).toFixed(2)}</span>
          <span className="text-right">{it.amt.toFixed(2)}</span>
        </div>
      ))}

      <div className="my-2 border-t border-dashed border-black" />

      <div className="space-y-0.5 text-[11px]">
        <Row label={`SubTotal (${t.qtyTotal}qty)`} value={formatINR(t.subTotal)} />
        <Row label={`Service Charge(${data.serviceChargePct}%)`} value={formatINR(t.serviceCharge)} />
        <Row label={`CGST${data.cgstPct}%`} value={formatINR(t.cgst)} />
        <Row label={`SGST${data.sgstPct}%`} value={formatINR(t.sgst)} />
        <Row
          label="RoundOff"
          value={`${t.roundOff >= 0 ? "+" : ""}${t.roundOff.toFixed(2)}`}
        />
      </div>

      <div className="my-2 border-t border-dashed border-black" />

      <div className="flex justify-between text-[16px] font-bold">
        <span>GrandTotal</span>
        <span>{formatINR(t.grandTotal)}</span>
      </div>

      <div className="my-2 border-t border-dashed border-black" />
      <p className="text-center text-[11px]">|| Thanks For Your Visit ||</p>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  );
}
