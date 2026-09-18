import { useState } from "react";
import BillForm from "../../components/restaurant/BillForm";
import TemplateFormal from "../../components/restaurant/TemplateFormal";
import TemplatePOS from "../../components/restaurant/TemplatePOS";
import TemplateThermalFull from "../../components/restaurant/TemplateThermalFull";
import TemplateThermalCompact from "../../components/restaurant/TemplateThermalCompact";
import SaveMenu from "../../components/common/SaveMenu";
import { exportSingleDocument } from "../../utils/documentExport";
import { logSaveRequest } from "../../utils/saveLog";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";
import * as content from "./restaurantBillContent";

const TAINTED_HINT = "the logo image doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again.";

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
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");

  const ActiveTemplate = TEMPLATES.find((t) => t.id === templateId).Component;

  const handleChange = (partial) => setData((prev) => ({ ...prev, ...partial }));
  const handleLogoChange = (url) => handleChange({ logoUrl: url });

  useSEO({
    title: content.SEO_TITLE,
    description: content.SEO_DESCRIPTION,
    canonical: content.CANONICAL,
    breadcrumbs: content.BREADCRUMBS,
    schemas: [content.softwareAppSchema, content.faqSchema],
  });

  const doDownload = async (format = "pdf") => {
    if (downloading) return;
    setDownloading(true);
    setNotice("");

    const printId = `PRINT-${Date.now()}-${Math.floor(Math.random() * 10000)}`;
    const logged = await logSaveRequest({ template: `restaurant-${templateId}`, printId, billData: data });
    if (!logged.ok) setNotice("Your bill downloaded fine, but we couldn't record it on our side.");

    await exportSingleDocument({
      Template: ActiveTemplate,
      data,
      format,
      fileBase: `restaurant-bill-${data.billNo || Date.now()}`,
      taintedHint: TAINTED_HINT,
    });
    setDownloading(false);
  };

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <style>{`@media print{.no-print{display:none!important;}}`}</style>
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0c2340 100%)", padding: "40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <nav style={{ marginBottom: 16, fontSize: 13, color: "#7DD3FC" }}>
            <a href="/" style={{ color: "#7DD3FC", textDecoration: "none" }}>Home</a><span style={{ margin: "0 8px" }}>›</span>
            <a href="/documents" style={{ color: "#7DD3FC", textDecoration: "none" }}>Documents</a><span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#BAE6FD" }}>Restaurant Bill</span>
          </nav>
          <h1 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Restaurant Bill Generator</h1>
          <p style={{ fontSize: 14, color: "#7DD3FC", margin: 0 }}>Create a professional restaurant / cafe bill — pick a template, fill in the details, and download.</p>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 py-8">
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
            <div className="no-print mb-3 flex items-center justify-between">
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748B", margin: 0 }}>Live Preview</p>
              <SaveMenu onSave={doDownload} downloading={downloading} small />
            </div>

            {notice && (
              <div className="no-print" style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 12, color: "#92400E", display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span>⚠ {notice}</span>
                <button onClick={() => setNotice("")} style={{ background: "none", border: "none", color: "#92400E", cursor: "pointer", fontSize: 14, lineHeight: 1 }} aria-label="Dismiss">×</button>
              </div>
            )}

            <div className="rounded-2xl border border-[#E2E8F0] bg-white p-4 shadow-sm">
              <ActiveTemplate data={data} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0" }}>
        <div className="seo-section" style={{ maxWidth: "80%", margin: "0 auto", width: "80%" }}>
          <DocumentPageSEO
            documentName="Restaurant Bill"
            documentSlug="restaurant-bill"
            intro={content.INTRO}
            whatIs={content.WHAT_IS}
            whyUse={content.WHY_USE}
            features={content.FEATURES}
            howToSteps={content.HOW_TO_STEPS}
            benefits={content.BENEFITS}
            formatFields={content.FORMAT_FIELDS}
            faqs={content.FAQS}
            relatedDocs={content.RELATED_DOCS}
          />
        </div>
      </div>
    </div>
  );
}
