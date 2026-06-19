import { useState } from "react";
import DocumentsPage from "../DocumentsPage";
import BillForm from "../../components/fuel/BillForm";
import TemplatePOS from "../../components/fuel/TemplatePOS";
import TemplateIOCL from "../../components/fuel/TemplateIOCL";
import TemplateThermalFull from "../../components/fuel/TemplateThermalFull";
import TemplateThermalCompact from "../../components/fuel/TemplateThermalCompact";

const TEMPLATES = [
  { id: "iocl", label: "IOCL Formal", desc: "Logo + dashed separators" },
  { id: "pos", label: "Classic POS", desc: "Monospace receipt style" },
  { id: "thermal-full", label: "Thermal Full", desc: "Dot-matrix with all fields" },
  { id: "thermal-compact", label: "Thermal Compact", desc: "Minimal thermal print" },
];

const defaultData = {
  // Station
  stationName: "PK FUEL STATION",
  stationAddress: "PAREKH NAGAR S V RD, KANDIVALI W, MUMBAI - 400067",
  stationPhone: "38055913",
  vatTin: "7761395712V",
  gstNumber: "27AABCU9603R1ZX",
  lstNumber: "",
  cstNumber: "",
  logoUrl: "https://upload.wikimedia.org/wikipedia/en/thumb/4/47/IndianOil_Logo.svg/200px-IndianOil_Logo.svg.png",

  // Bill
  billNumber: "G64695",
  billDate: new Date().toISOString().split("T")[0],
  billTime: new Date().toTimeString().slice(0, 5),
  shift: "S-1",
  pumpNo: "P-05",
  nozzleNo: "N-02",
  fccId: "",
  fipNo: "07",
  txnNo: "6242805",
  invoiceNo: "927267",
  localId: "00024735",

  // Customer
  customerName: "",
  vehicleNumber: "",
  vehicleType: "4W",
  mobileNo: "",
  attendantId: "",

  // Fuel
  fuelType: "Petrol",
  density: "625.078",
  quantity: "",
  pricePerLitre: "104.29",
  presetType: "Amount",
  paymentMode: "Cash",
};

const TEMPLATE_COMPONENTS = {
  pos: TemplatePOS,
  iocl: TemplateIOCL,
  "thermal-full": TemplateThermalFull,
  "thermal-compact": TemplateThermalCompact,
};

export default function FuelBillPage() {
  const [data, setData] = useState(defaultData);
  const [activeTemplate, setActiveTemplate] = useState("iocl");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const PreviewComponent = TEMPLATE_COMPONENTS[activeTemplate];

  return (
    <>
      <DocumentsPage />
      <div className="max-w-[1280px] mx-auto px-6 py-8">

        {/* Page Header */}
        <div className="flex items-center justify-between mb-8 no-print">
          <div>
            <h1 className="text-[24px] font-bold text-[#0F172A]">Fuel Bill Generator</h1>
            <p className="text-[#64748B] text-[14px] mt-1">Choose a template, fill details — receipt updates live.</p>
          </div>
          <button
            onClick={() => window.print()}
            className="inline-flex items-center justify-center gap-2 h-11 px-6 text-[14px] font-semibold text-white rounded-xl transition-all duration-150 hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)" }}
          >
            🖨️ Print / Save PDF
          </button>
        </div>

        {/* Template Picker */}
        <div className="no-print mb-8">
          <p className="text-[12px] font-semibold uppercase tracking-widest text-[#64748B] mb-3">Choose Template</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {TEMPLATES.map((t) => (
              <button
                key={t.id}
                onClick={() => setActiveTemplate(t.id)}
                className={`text-left p-4 rounded-xl border-2 transition-all duration-150 ${
                  activeTemplate === t.id
                    ? "border-[#2563EB] bg-[#EFF6FF]"
                    : "border-[#E2E8F0] bg-white hover:border-[#2563EB]/40"
                }`}
              >
                <p className={`text-[14px] font-semibold ${activeTemplate === t.id ? "text-[#2563EB]" : "text-[#0F172A]"}`}>{t.label}</p>
                <p className="text-[12px] text-[#64748B] mt-0.5">{t.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
          <div className="no-print">
            <BillForm data={data} onChange={handleChange} template={activeTemplate} />
          </div>
          <div className="lg:sticky lg:top-24">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-[#64748B] mb-3 no-print">Live Preview</p>
            <PreviewComponent data={data} />
          </div>
        </div>
      </div>
    </>
  );
}
