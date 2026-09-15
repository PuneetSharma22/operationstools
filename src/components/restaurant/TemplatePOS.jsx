import { computeTotals, formatINR } from "./billMath";

// TemplatePOS — restaurant equivalent of TemplatePOS.jsx (fuel):
// bold monospace header, TXN/Invoice numbers, table-service framing.
export default function TemplatePOS({ data }) {
  const t = computeTotals(data);
  const dt = data.dateTime ? new Date(data.dateTime) : new Date();

  return (
    <div className="mx-auto w-[380px] bg-white p-6 font-mono text-[13px] font-bold text-black">
      <div className="text-center">
        <h1 className="text-[20px] uppercase tracking-wide">
          {data.restaurantName || "Restaurant Name"}
        </h1>
        <p className="text-[11px] font-normal">{data.address}</p>
      </div>

      <div className="my-3 border-t-2 border-black" />

      <div className="grid grid-cols-2 gap-x-2 text-[11px] font-normal">
        <span>TXN NO: {data.txnNo}</span>
        <span className="text-right">TABLE: {data.dineIn}</span>
        <span>INV NO: {data.invoiceNo}</span>
        <span className="text-right">CASHIER: {data.cashier}</span>
        <span className="col-span-2">
          {dt.toLocaleDateString("en-GB")} {dt.toLocaleTimeString("en-GB")}
        </span>
      </div>

      <div className="my-3 border-t-2 border-black" />

      {t.items.map((it, i) => (
        <div key={i} className="mb-1 text-[12px] font-normal">
          <div className="flex justify-between uppercase">
            <span>{it.name}</span>
            <span>{it.amt.toFixed(2)}</span>
          </div>
          <div className="text-[10px] text-gray-600">
            {it.qty} x {Number(it.price).toFixed(2)}
          </div>
        </div>
      ))}

      <div className="my-3 border-t-2 border-black" />

      <div className="space-y-0.5 text-[12px] font-normal">
        <Row label="SUBTOTAL" value={formatINR(t.subTotal)} />
        <Row label={`SVC CHG ${data.serviceChargePct}%`} value={formatINR(t.serviceCharge)} />
        <Row label={`CGST ${data.cgstPct}%`} value={formatINR(t.cgst)} />
        <Row label={`SGST ${data.sgstPct}%`} value={formatINR(t.sgst)} />
        <Row
          label="ROUND OFF"
          value={`${t.roundOff >= 0 ? "+" : ""}${t.roundOff.toFixed(2)}`}
        />
      </div>

      <div className="my-3 border-t-2 border-black" />

      <div className="flex justify-between text-[19px]">
        <span>TOTAL</span>
        <span>{formatINR(t.grandTotal)}</span>
      </div>

      <div className="my-3 border-t-2 border-black" />
      <p className="text-center text-[11px] font-normal">
        *** THANK YOU — VISIT AGAIN ***
      </p>
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
