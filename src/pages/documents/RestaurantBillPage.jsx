import { useState } from "react";
import BillForm from "../../components/restaurant/BillForm";
import TemplateFormal from "../../components/restaurant/TemplateFormal";
import TemplatePOS from "../../components/restaurant/TemplatePOS";
import TemplateThermalFull from "../../components/restaurant/TemplateThermalFull";
import TemplateThermalCompact from "../../components/restaurant/TemplateThermalCompact";
// Reuse the same Supabase print-logging helper the fuel bill tool uses.
// If your project's path differs, adjust this import.
import { supabase } from "../../supabase";

const TEMPLATES = [
  { id: "formal", name: "Formal Receipt", Component: TemplateFormal },
  { id: "pos", name: "Classic POS", Component: TemplatePOS },
  { id: "thermal-full", name: "Thermal Full", Component: TemplateThermalFull },
  { id: "thermal-compact", name: "Thermal Compact", Component: TemplateThermalCompact },
];

const defaultRestaurantBillData = {
  restaurantName: "Kake Da Hotel",
  establishedYear: "1931",
  address: "12, Rajouri Garden Market, New Delhi - 110027",
  logoUrl: "",
  gstin: "",
  fssaiNo: "",
  customerName: "",
  billNo: "50455",
  dateTime: new Date().toISOString().slice(0, 16),
  dineIn: "5",
  cashier: "Biller",
  txnNo: "",
  invoiceNo: "",
  orderNo: "",
  waiterId: "",
  serviceChargePct: 10,
  cgstPct: 2.5,
  sgstPct: 2.5,
  items: [
    { name: "Bhatti Ka Chaap (Full)", qty: 1, price: 299 },
    { name: "Dal Makhni (12 Hrs Coal Cooked)", qty: 1, price: 349 },
    { name: "Veg Hakka Noodles", qty: 1, price: 279 },
  ],
};

export default function RestaurantBillPage() {
  const [templateId, setTemplateId] = useState("formal");
  const [data, setData] = useState(defaultRestaurantBillData);

  const ActiveTemplate = TEMPLATES.find((t) => t.id === templateId).Component;

  const handleChange = (partial) => setData((prev) => ({ ...prev, ...partial }));
  const handleLogoChange = (url) => handleChange({ logoUrl: url });

  const handlePrint = async () => {
    // Log the print, same anonymous-insert pattern as FuelBillPage.jsx.
    try {
      await supabase.from("print_requests").insert({
        template: `restaurant-${templateId}`,
        print_id: `PRINT-${Date.now()}-${Math.floor(Math.random() * 10000)}`,
      });
    } catch (err) {
      console.error("Print logging failed (non-blocking):", err);
    }
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      <div className="mx-auto max-w-6xl px-4 pt-8">
        <div className="no-print mb-6">
          <h1 className="text-[24px] font-bold text-[#0F172A]">
            Restaurant Bill Generator
          </h1>
          <p className="mt-1 text-[14px] text-[#64748B]">
            Create a professional restaurant / cafe bill — pick a template,
            fill in the details, and print or save as PDF.
          </p>
        </div>

        <div className="no-print mb-6 flex flex-wrap gap-2">
          {TEMPLATES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTemplateId(t.id)}
              className={`h-9 rounded-xl px-4 text-[13px] font-medium transition ${
                templateId === t.id
                  ? "text-white"
                  : "border border-[#E2E8F0] bg-white text-[#0F172A]"
              }`}
              style={
                templateId === t.id
                  ? { background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)" }
                  : undefined
              }
            >
              {t.name}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_420px]">
          <div className="no-print">
            <BillForm
              templateId={templateId}
              data={data}
              onChange={handleChange}
              onLogoChange={handleLogoChange}
            />
          </div>

          <div>
            <div className="no-print mb-4 flex justify-end">
              <button
                onClick={handlePrint}
                className="h-12 rounded-xl px-6 text-[14px] font-semibold text-white"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
                }}
              >
                Print / Save as PDF
              </button>
            </div>
            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <div id="print-area">
                <ActiveTemplate data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
