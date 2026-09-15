import { computeTotals, formatINR } from "./billMath";

// TemplateThermalCompact — restaurant equivalent of TemplateThermalCompact.jsx (fuel):
// minimal dot-matrix, core fields only, fastest to scan.
export default function TemplateThermalCompact({ data }) {
  const t = computeTotals(data);
  const dt = data.dateTime ? new Date(data.dateTime) : new Date();

  return (
    <div
      className="mx-auto w-[320px] bg-white p-5 text-[12px] text-black"
      style={{ fontFamily: "'Courier New', monospace" }}
    >
      <div className="text-center">
        <h1 className="text-[16px] font-bold">
          {data.restaurantName || "Restaurant Name"}
        </h1>
        <p className="text-[10px]">{data.address}</p>
      </div>

      <div className="my-2 border-t border-dashed border-black" />

      <div className="flex justify-between text-[10px]">
        <span>{dt.toLocaleDateString("en-GB")}</span>
        <span>Bill #{data.billNo}</span>
      </div>
      <div className="flex justify-between text-[10px]">
        <span>Table {data.dineIn}</span>
        <span>{data.cashier}</span>
      </div>

      <div className="my-2 border-t border-dashed border-black" />

      {t.items.map((it, i) => (
        <div key={i} className="flex justify-between py-0.5 text-[11px]">
          <span>
            {it.name} x{it.qty}
          </span>
          <span>{it.amt.toFixed(2)}</span>
        </div>
      ))}

      <div className="my-2 border-t border-dashed border-black" />

      <div className="flex justify-between text-[11px]">
        <span>Subtotal</span>
        <span>{formatINR(t.subTotal)}</span>
      </div>
      <div className="flex justify-between text-[11px]">
        <span>Svc + Tax</span>
        <span>{formatINR(t.serviceCharge + t.cgst + t.sgst)}</span>
      </div>

      <div className="my-2 border-t border-dashed border-black" />

      <div className="flex justify-between text-[15px] font-bold">
        <span>Total</span>
        <span>{formatINR(t.grandTotal)}</span>
      </div>

      <p className="mt-3 text-center text-[10px]">Thank you, visit again!</p>
    </div>
  );
}
