import { useState, useRef } from "react";
import { supabase } from "../../supabase";
import BillForm from "../../components/fuel/BillForm";
import BulkGenerateModal from "../../components/fuel/BulkGenerateModal";
import { TEMPLATES, TEMPLATE_COMPONENTS, defaultFuelBillData } from "../../components/fuel/templates";
import { computeQuantity } from "../../components/fuel/billMath";
import DocumentToolHero from "../../components/common/DocumentToolHero";
import LoginPromptModal from "../../components/common/LoginPromptModal";
import SaveMenu from "../../components/common/SaveMenu";
import TemplatePicker from "../../components/common/TemplatePicker";
import { exportSingleDocument } from "../../utils/documentExport";
import { logSaveRequest } from "../../utils/saveLog";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";
import * as content from "./fuelBillContent";

const TAINTED_HINT = "one of the logo/bank-strip image URLs doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again.";

export default function FuelBillPage() {
  const [data, setData] = useState(defaultFuelBillData);
  const [activeTemplate, setActiveTemplate] = useState("thermal-full");
  const [modal, setModal] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");
  const previewRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      const next = { ...prev, [name]: value };
      // Volume is derived from Amount ÷ Rate (matches how a real dispenser
      // preset to an amount works) — recompute whenever either changes.
      if (name === "amount" || name === "pricePerLitre") {
        next.quantity = computeQuantity(next.amount, next.pricePerLitre);
      }
      return next;
    });
  };

  const PreviewComponent = TEMPLATE_COMPONENTS[activeTemplate];

  const doDownload = async (format = "pdf") => {
    if (downloading) return;
    setDownloading(true);
    setNotice("");

    const printId = `PRINT-${Date.now()}-${Math.random().toString(36).slice(2, 11).toUpperCase()}`;
    // Analytics only — never allowed to block or fail the export, but a
    // failure is surfaced as a quiet notice rather than swallowed.
    const logged = await logSaveRequest({ template: activeTemplate, printId, billData: data });
    if (!logged.ok) setNotice("Your bill downloaded fine, but we couldn't record it on our side.");

    await exportSingleDocument({
      Template: PreviewComponent,
      data,
      format,
      fileBase: `fuel-bill-${Date.now()}`,
      taintedHint: TAINTED_HINT,
    });
    setDownloading(false);
  };

  const handleBulkClick = async () => {
    try {
      const { data: { user }, error } = await supabase.auth.getUser();
      if (error) throw error;
      if (!user) setModal("login");
      else { setModalUser(user); setModal("bulk"); }
    } catch (err) {
      console.warn("Could not confirm the signed-in user for bulk generation; showing the login prompt.", err);
      setModal("login");
    }
  };

  useSEO({
    title: content.SEO_TITLE,
    description: content.SEO_DESCRIPTION,
    canonical: content.CANONICAL,
    breadcrumbs: content.BREADCRUMBS,
    schemas: [content.softwareAppSchema, content.faqSchema],
  });

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <style>{`
        @media(max-width:1023px){.preview-col{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;}}
        @media(max-width:768px){.fuel-tool-padding{padding-left:16px!important;padding-right:16px!important;}.fuel-hero-padding{padding:28px 16px 24px!important;}.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}

        /* Simple two-column layout — no grid-template-areas / row-spanning.
           Spanning the tall "form" column across two rows was what broke
           the layout: browsers size spanned row tracks in a way that
           doesn't match "sidebar stacks two blocks beside a much taller
           column", producing the big misaligned gap. A plain two-column
           grid with the picker + preview simply stacked as ordinary
           content inside column 2 avoids that entirely. */
        .tool-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 20px;
        }
        @media(min-width:1024px){
          .tool-grid {
            grid-template-columns: 1fr 320px;
            gap: 28px;
          }
        }
      `}</style>

      {modal === "login" && <LoginPromptModal onClose={() => setModal(null)} unitLabel="bills" />}
      {modal === "bulk" && modalUser && (
        <BulkGenerateModal
          user={modalUser}
          stationData={data}
          activeTemplate={activeTemplate}
          templateComponents={TEMPLATE_COMPONENTS}
          onClose={() => setModal(null)}
        />
      )}

      <DocumentToolHero
        crumb="Fuel Bill Generator"
        title="Free Fuel Bill Generator"
        subtitle="Choose a template, fill details — receipt updates live."
        onBulkClick={handleBulkClick}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }} className="fuel-tool-padding no-print">
        <div className="tool-grid">
          <div className="no-print">
            <BillForm data={data} onChange={handleChange} />
          </div>

          {/* Right column: template picker stacked directly above the live
              preview, both as ordinary content in a single grid cell — this
              is what keeps the picker "right above the preview" without
              needing any row-spanning on the form column. */}
          <div className="preview-col" style={{ position: "sticky", top: 96 }}>
            <TemplatePicker templates={TEMPLATES} activeId={activeTemplate} onSelect={setActiveTemplate} />

            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }} className="no-print">
                <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: "#64748B", margin: 0 }}>Live Preview</p>
                <SaveMenu onSave={doDownload} downloading={downloading} small />
              </div>

              {notice && (
                <div className="no-print" style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 12, color: "#92400E", display: "flex", justifyContent: "space-between", gap: 8 }}>
                  <span>⚠ {notice}</span>
                  <button onClick={() => setNotice("")} style={{ background: "none", border: "none", color: "#92400E", cursor: "pointer", fontSize: 14, lineHeight: 1 }} aria-label="Dismiss">×</button>
                </div>
              )}

              {/* The outer div's scale/width/margin combo is purely a visual
                  on-screen fit trick — html2canvas captures the untransformed
                  box, which is 22% wider than the actual card. display:
                  inline-block on the ref'd inner div makes it shrink-wrap to
                  the card's own rendered width instead of filling its full
                  block-level parent — without this, ThermalFull specifically
                  (whose card self-centers via maxWidth+margin:auto, narrower
                  than the other three templates) leaves blank space on both
                  sides that gets exported filled with the background color,
                  reading as an off-white bleed past the card's real edge. */}
              <div className="preview-scale-wrap" style={{ transform: "scale(0.82)", transformOrigin: "top left", width: "122%", marginBottom: "-18%" }}>
                <div ref={previewRef} style={{ display: "inline-block" }}>
                  <PreviewComponent data={data} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0" }}>
        <div className="seo-section" style={{ maxWidth: "80%", margin: "0 auto", width: "80%" }}>
          <DocumentPageSEO
            documentName="Fuel Bill"
            documentSlug="fuel-bill"
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
