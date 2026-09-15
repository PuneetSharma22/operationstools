// Shared bill-math helper for all Restaurant Bill templates.
// Mirrors the calculation verified by hand against a real bill earlier:
// items -> subtotal -> + service charge -> + CGST/SGST on (subtotal+service)
// -> round to nearest rupee -> round-off shown as the difference.

export function computeTotals(data) {
  const items = (data.items || []).map((it) => ({
    ...it,
    amt: Number(it.qty || 0) * Number(it.price || 0),
  }));

  const qtyTotal = items.reduce((sum, it) => sum + Number(it.qty || 0), 0);
  const subTotal = items.reduce((sum, it) => sum + it.amt, 0);

  const serviceCharge = subTotal * (Number(data.serviceChargePct || 0) / 100);
  const taxableAmount = subTotal + serviceCharge;

  const cgst = taxableAmount * (Number(data.cgstPct || 0) / 100);
  const sgst = taxableAmount * (Number(data.sgstPct || 0) / 100);

  const rawTotal = subTotal + serviceCharge + cgst + sgst;
  const grandTotal = Math.round(rawTotal);
  const roundOff = grandTotal - rawTotal;

  return {
    items,
    qtyTotal,
    subTotal,
    serviceCharge,
    cgst,
    sgst,
    roundOff,
    grandTotal,
  };
}

export function formatINR(amount) {
  return (
    "₹" +
    Number(amount || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}
