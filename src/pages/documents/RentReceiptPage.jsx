import { useState } from "react";
import { supabase } from "../../supabase";
import RentReceiptForm from "../../components/rent/RentReceiptForm";
import BulkGenerateModal from "../../components/rent/BulkGenerateModal";
import { TEMPLATES, TEMPLATE_COMPONENTS, makeDefaultRentReceiptData } from "../../components/rent/templates";
import DocumentToolHero from "../../components/common/DocumentToolHero";
import LoginPromptModal from "../../components/common/LoginPromptModal";
import SaveMenu from "../../components/common/SaveMenu";
import TemplatePicker from "../../components/common/TemplatePicker";
import { exportSingleDocument } from "../../utils/documentExport";
import { logSaveRequest } from "../../utils/saveLog";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";
import * as content from "./rentReceiptContent";

const TAINTED_HINT = "the revenue stamp image doesn't allow cross-origin access, which blocks export.";

export default function RentReceiptPage() {
  const [data, setData] = useState(makeDefaultRentReceiptData);
  const [activeTemplate, setActiveTemplate] = useState("1");
  const [modal, setModal] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: name === "landlordPan" ? value.toUpperCase() : value }));
  };

  const PreviewComponent = TEMPLATE_COMPONENTS[activeTemplate];

  const doDownload = async (format = "pdf") => {
    if (downloading) return;
    setDownloading(true);
    setNotice("");

    const printId = `RENT-${Date.now()}-${Math.random().toString(36).slice(2, 11).toUpperCase()}`;
    // Analytics only — never allowed to block or fail the export, but a
    // failure is surfaced as a quiet notice rather than swallowed.
    const logged = await logSaveRequest({ template: activeTemplate, printId, billData: data });
    if (!logged.ok) setNotice("Your receipt downloaded fine, but we couldn't record it on our side.");

    await exportSingleDocument({
      Template: PreviewComponent,
      data,
      format,
      fileBase: `rent-receipt-${data.periodFrom || Date.now()}`,
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
        @media(max-width:1159px){.preview-col{position:static!important;}}
        @media(max-width:768px){.fuel-tool-padding{padding-left:16px!important;padding-right:16px!important;}.fuel-hero-padding{padding:28px 16px 24px!important;}.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}
        .tool-grid { display: grid; grid-template-columns: 1fr; gap: 20px; }
        @media(min-width:1160px){ .tool-grid { grid-template-columns: 1fr 580px; gap: 28px; } }
      `}</style>

      {modal === "login" && <LoginPromptModal onClose={() => setModal(null)} unitLabel="receipts" />}
      {modal === "bulk" && modalUser && (
        <BulkGenerateModal
          user={modalUser}
          formData={data}
          activeTemplate={activeTemplate}
          templateComponents={TEMPLATE_COMPONENTS}
          onClose={() => setModal(null)}
        />
      )}

      <DocumentToolHero
        crumb="Rent Receipt Generator"
        title="Free Rent Receipt Generator"
        subtitle="Choose a template, fill details — receipt updates live."
        onBulkClick={handleBulkClick}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }} className="fuel-tool-padding no-print">
        <div className="tool-grid">
          <div className="no-print">
            <RentReceiptForm data={data} onChange={handleChange} />
          </div>

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

              <div style={{ maxWidth: "100%", overflowX: "auto" }}>
                <PreviewComponent data={data} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0" }}>
        <div className="seo-section" style={{ maxWidth: "80%", margin: "0 auto", width: "80%" }}>
          <DocumentPageSEO
            documentName="Rent Receipt"
            documentSlug="rent-receipt"
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
