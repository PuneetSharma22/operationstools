import { computeTotals, formatINR } from "./billMath";

// TemplateFormal — restaurant equivalent of TemplateIOCL.jsx:
// logo, dashed separators, sit-down-restaurant formality.
export default function TemplateFormal({ data }) {
  const t = computeTotals(data);
  const dt = data.dateTime ? new Date(data.dateTime) : new Date();

  return (
    <div className="mx-auto w-[380px] bg-white p-6 font-mono text-[13px] text-black">
      <div className="flex flex-col items-center text-center">
        {data.logoUrl && (
          <img
            src={data.logoUrl}
            alt="logo"
            className="mb-1 h-14 w-14 object-contain"
          />
        )}
        {data.establishedYear && (
          <p className="text-[11px] tracking-wide">
            Estd. {data.establishedYear}
          </p>
        )}
        <h1 className="mt-1 text-[18px] font-bold">
          {data.restaurantName || "Restaurant Name"}
        </h1>
        <p className="text-[11px]">{data.address}</p>
        {data.gstin && <p className="text-[11px]">GSTIN: {data.gstin}</p>}
      </div>

      <div className="my-3 border-t border-dashed border-black" />

      <div className="space-y-0.5 text-[12px]">
        <Row label="Name" value={data.customerName || "—"} />
        <Row label="Date" value={dt.toLocaleDateString("en-GB")} />
        <Row label="Bill No" value={data.billNo} />
        <Row label="Dine In" value={data.dineIn} />
        <Row label="Cashier" value={data.cashier} />
      </div>

      <div className="my-3 border-t border-dashed border-black" />

      <div className="grid grid-cols-[1fr_28px_50px_55px] gap-1 text-[11px] font-semibold uppercase">
        <span>Item</span>
        <span className="text-right">Qty</span>
        <span className="text-right">Price</span>
        <span className="text-right">Amt</span>
      </div>
      <div className="my-1 border-t border-black" />
      {t.items.map((it, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_28px_50px_55px] gap-1 py-0.5 text-[12px]"
        >
          <span>{it.name}</span>
          <span className="text-right">{it.qty}</span>
          <span className="text-right">{Number(it.price).toFixed(2)}</span>
          <span className="text-right">{it.amt.toFixed(2)}</span>
        </div>
      ))}

      <div className="my-3 border-t border-dashed border-black" />

      <div className="space-y-0.5 text-[12px]">
        <Row label={`Sub Total (${t.qtyTotal} qty)`} value={formatINR(t.subTotal)} />
        <Row
          label={`Service Charge (${data.serviceChargePct}%)`}
          value={formatINR(t.serviceCharge)}
        />
        <Row label={`CGST ${data.cgstPct}%`} value={formatINR(t.cgst)} />
        <Row label={`SGST ${data.sgstPct}%`} value={formatINR(t.sgst)} />
        <Row
          label="Round Off"
          value={`${t.roundOff >= 0 ? "+" : ""}${t.roundOff.toFixed(2)}`}
        />
      </div>

      <div className="my-3 border-t border-dashed border-black" />

      <div className="flex items-center justify-between text-[17px] font-bold">
        <span>Grand Total</span>
        <span>{formatINR(t.grandTotal)}</span>
      </div>

      <div className="my-3 border-t border-dashed border-black" />
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
