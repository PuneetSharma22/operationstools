import { useState } from "react";
import { supabase } from "../../supabase";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";
import DocumentToolHero from "../../components/common/DocumentToolHero";
import LoginPromptModal from "../../components/common/LoginPromptModal";
import SaveMenu from "../../components/common/SaveMenu";
import { exportSingleDocument } from "../../utils/documentExport";
import { logSaveRequest } from "../../utils/saveLog";
import MobileBillTemplate from "../../components/mobileBill/MobileBillTemplate";
import BulkGenerateModal from "../../components/mobileBill/BulkGenerateModal";
import { defaultMobileBillData, BILL_TYPES, PAYMENT_MODES } from "../../components/mobileBill/defaults";
import { OPERATOR_LIST, OPERATORS } from "../../components/mobileBill/operatorThemes";

const TAINTED_HINT = "the logo image doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again.";

const INK = "#0F172A";
const INK_MUTED = "#64748B";
const BORDER = "#E2E8F0";
const SURFACE = "#F8FAFC";
const BRAND = "#2563EB";

// ─── SEO ─────────────────────────────────────────────────────────────────────
const SEO_TITLE = "Free Mobile & Telephone Bill Generator — Postpaid Invoice & Prepaid Receipt | OpsTools";
const SEO_DESCRIPTION = "Generate a postpaid mobile tax invoice or a prepaid recharge payment receipt online. Airtel, Jio, Vi and BSNL themes. Free, no login, instant PDF.";
const CANONICAL = "https://www.opstools.ai/documents/mobile-bill";
const softwareAppSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "OpsTools Mobile & Telephone Bill Generator", operatingSystem: "Web", applicationCategory: "BusinessApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, description: SEO_DESCRIPTION, url: CANONICAL, provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" } };
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "What's the difference between the postpaid and prepaid layout?", acceptedAnswer: { "@type": "Answer", text: "Postpaid generates a GST tax invoice with plan rental, CGST/SGST breakdown, invoice number and due date. Prepaid generates a payment/recharge receipt with receipt number, order number and paid amount — no tax breakdown, matching how telecom operators issue each." } },
  { "@type": "Question", name: "Which operators are supported?", acceptedAnswer: { "@type": "Answer", text: "Airtel, Jio, Vi and BSNL each apply their own colour theme, plus a generic \"Other\" option for any operator." } },
  { "@type": "Question", name: "Is this free?", acceptedAnswer: { "@type": "Answer", text: "Yes, single bills are completely free with no login required. Bulk generation via CSV uses credits." } },
] };
const INTRO = (<><p style={{ marginBottom: 16 }}>Need a mobile or telephone bill for reimbursement or record-keeping? OpsTools Mobile & Telephone Bill Generator produces either a postpaid tax invoice or a prepaid recharge receipt — pick your operator's theme, fill in the details, and download.</p><p style={{ marginBottom: 16 }}>Postpaid bills come out as a proper GST tax invoice with CGST/SGST breakdown; prepaid recharges come out as a payment receipt, matching how each is actually issued.</p><p>The preview updates live as you type. Download directly as a PDF — your data never leaves your browser.</p></>);
const WHAT_IS = `A mobile/telephone bill is either the postpaid tax invoice a telecom operator issues for a billing cycle (plan rental, usage, taxes) or the prepaid payment receipt issued for a recharge. Both are commonly required for expense reimbursement.`;
const WHY_USE = [
  { title: "Employee reimbursement", body: "Generate a properly formatted mobile bill to attach to an expense claim." },
  { title: "Record-keeping", body: "Keep a consistent record of monthly telecom spend, postpaid or prepaid." },
  { title: "Multiple operators", body: "Switch between Airtel, Jio, Vi and BSNL themes without re-entering shared details." },
];
const FEATURES = [
  { icon: "📱", title: "Postpaid & prepaid", body: "Toggle between a GST tax invoice layout and a recharge receipt layout." },
  { icon: "🎨", title: "Operator themes", body: "Airtel, Jio, Vi and BSNL colour themes, plus a generic option." },
  { icon: "🧾", title: "GST breakdown", body: "Postpaid invoices compute CGST/SGST on the plan rental automatically." },
  { icon: "👁️", title: "Live preview", body: "See the bill update in real time as you fill the form." },
  { icon: "📦", title: "Bulk generation", body: "Upload a CSV to generate a whole batch of bills as one PDF." },
  { icon: "🔒", title: "100% private", body: "No data is stored or transmitted for single-bill generation." },
];
const HOW_TO_STEPS = [
  { step: 1, title: "Choose operator & bill type", body: "Pick a telecom operator and whether it's postpaid or prepaid." },
  { step: 2, title: "Add subscriber details", body: "Customer name, mobile number and address." },
  { step: 3, title: "Fill plan / recharge details", body: "Plan name, rental or recharge amount, dates and payment mode." },
  { step: 4, title: "Preview", body: "Check the live preview — totals update instantly." },
  { step: 5, title: "Download", body: "Click Save to download the bill as a PDF or PNG." },
];
const BENEFITS = [
  "Postpaid tax invoice and prepaid receipt layouts, both in one tool.",
  "Airtel, Jio, Vi and BSNL colour themes.",
  "CGST/SGST breakdown computed automatically for postpaid.",
  "No registration or sign-up required for single bills.",
  "Bulk CSV generation available for high-volume use.",
];
const FORMAT_FIELDS = [
  { field: "Invoice/Receipt No.", description: "Unique identifier for the bill or payment", example: "IDL_88785885785" },
  { field: "Plan / Recharge Name", description: "The postpaid plan or prepaid pack purchased", example: "Unlimited 4999 Plan" },
  { field: "GST Rate", description: "Applicable GST on postpaid telecom services", example: "18%" },
];
const FAQS = faqSchema.mainEntity.map((i) => ({ q: i.name, a: i.acceptedAnswer.text }));
const RELATED_DOCS = [
  { name: "Electricity Bill Generator", href: "/documents/electricity-bill", description: "Utility bills with meter readings." },
  { name: "Book & Periodical Invoice", href: "/documents/book-invoice", description: "Retail GST invoices for books & magazines." },
  { name: "GST Invoice Generator", href: "/documents/gst-invoice", description: "General-purpose GST tax invoices." },
];
const BREADCRUMBS = [
  { name: "Home", url: "https://www.opstools.ai" },
  { name: "Documents", url: "https://www.opstools.ai/documents" },
  { name: "Mobile & Telephone Bill", url: CANONICAL },
];

function Field({ label, value, onChange, placeholder, type = "text", small }) {
  return (
    <div style={{ marginBottom: small ? 8 : 12 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: INK_MUTED, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder} onChange={e => onChange && onChange(e.target.value)}
        style={{ width: "100%", height: small ? 32 : 38, border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: "0 10px", fontSize: 13, color: INK, outline: "none", boxSizing: "border-box", background: "#fff" }}
        onFocus={e => e.target.style.borderColor = BRAND} onBlur={e => e.target.style.borderColor = BORDER} />
    </div>
  );
}

function Select({ label, value, onChange, options, small }) {
  return (
    <div style={{ marginBottom: small ? 8 : 12 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: INK_MUTED, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
      <select value={value} onChange={e => onChange(e.target.value)} style={{ width: "100%", height: small ? 32 : 38, border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: "0 10px", fontSize: 13, outline: "none", background: "#fff" }}>
        {options.map(o => <option key={o.id || o} value={o.id || o}>{o.label || o}</option>)}
      </select>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${BORDER}`, padding: "20px 24px", marginBottom: 16 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, color: INK, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</h2>
      {children}
    </div>
  );
}

export default function MobileBillPage() {
  const [data, setData] = useState(defaultMobileBillData);
  const [modal, setModal] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");

  const upd = (k, v) => setData(p => ({ ...p, [k]: v }));

  const handleOperatorChange = (opKey) => {
    setData(p => ({ ...p, operator: opKey, operatorName: OPERATORS[opKey]?.name || p.operatorName }));
  };

  const doDownload = async (format = "pdf") => {
    if (downloading) return;
    setDownloading(true);
    setNotice("");

    const printId = `MBL-${Date.now()}`;
    const logged = await logSaveRequest({ template: `mobile-bill-${data.billType}`, printId, billData: data });
    if (!logged.ok) setNotice("Your bill downloaded fine, but we couldn't record it on our side.");

    await exportSingleDocument({
      Template: MobileBillTemplate,
      data,
      format,
      fileBase: `mobile-bill-${data.billType}-${Date.now()}`,
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
    title: SEO_TITLE, description: SEO_DESCRIPTION, canonical: CANONICAL,
    breadcrumbs: BREADCRUMBS,
    schemas: [softwareAppSchema, faqSchema],
  });

  const isPostpaid = data.billType === "postpaid";

  return (
    <div style={{ backgroundColor: SURFACE, minHeight: "100vh" }}>
      <style>{`@media(max-width:1023px){.mb-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .mb-grid{grid-template-columns:1fr!important;}}@media(max-width:768px){.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}@media print{.no-print{display:none!important;}}`}</style>

      {modal === "login" && <LoginPromptModal onClose={() => setModal(null)} unitLabel="bills" />}
      {modal === "bulk" && modalUser && (
        <BulkGenerateModal user={modalUser} formData={data} onClose={() => setModal(null)} />
      )}

      <DocumentToolHero
        crumb="Mobile & Telephone Bill"
        title="Mobile & Telephone Bill Generator"
        subtitle="Postpaid tax invoices and prepaid recharge receipts — Airtel, Jio, Vi & BSNL themes."
        onBulkClick={handleBulkClick}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }} className="no-print">
        <div className="mb-grid" style={{ display: "grid", gridTemplateColumns: "1fr 500px", gap: 28, alignItems: "start" }}>
          <div>
            <Section title="Bill Type & Operator">
              <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
                {BILL_TYPES.map(t => (
                  <button key={t.id} onClick={() => upd("billType", t.id)}
                    style={{ flex: 1, padding: "10px 12px", borderRadius: 10, border: `1.5px solid ${data.billType === t.id ? BRAND : BORDER}`, background: data.billType === t.id ? "#EFF6FF" : "#fff", color: data.billType === t.id ? BRAND : INK, fontSize: 13, fontWeight: 700, cursor: "pointer" }}>
                    {t.label}
                  </button>
                ))}
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Select label="Operator" value={data.operator} onChange={handleOperatorChange} options={OPERATOR_LIST.map(o => ({ id: o.key, label: o.name }))} />
                <Field label="Operator Display Name" value={data.operatorName} onChange={v => upd("operatorName", v)} placeholder="Airtel" />
              </div>
              <Field label="Logo URL (optional)" value={data.logoUrl} onChange={v => upd("logoUrl", v)} placeholder="https://..." />
            </Section>

            <Section title="Subscriber Details">
              <Field label="Customer Name" value={data.customerName} onChange={v => upd("customerName", v)} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Mobile Number" value={data.mobileNumber} onChange={v => upd("mobileNumber", v)} />
                <Field label="Address (optional)" value={data.customerAddress} onChange={v => upd("customerAddress", v)} />
              </div>
            </Section>

            {isPostpaid ? (
              <Section title="Postpaid Invoice Details">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Invoice No." value={data.invoiceNo} onChange={v => upd("invoiceNo", v)} />
                  <Field label="Invoice Date" value={data.invoiceDate} onChange={v => upd("invoiceDate", v)} type="date" />
                  <Field label="Due Date" value={data.dueDate} onChange={v => upd("dueDate", v)} type="date" />
                  <Field label="Billing Period (optional)" value={data.billingPeriod} onChange={v => upd("billingPeriod", v)} placeholder="12 Aug – 11 Sep 2026" />
                </div>
                <Field label="Plan Name" value={data.planName} onChange={v => upd("planName", v)} placeholder="Unlimited 4999 Plan" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="GSTIN (optional)" value={data.gstin} onChange={v => upd("gstin", v)} />
                  <Field label="PAN (optional)" value={data.pan} onChange={v => upd("pan", v)} />
                  <Field label="Plan Rental ₹" value={data.planRental} onChange={v => upd("planRental", Number(v))} type="number" />
                  <Field label="GST %" value={data.gstRate} onChange={v => upd("gstRate", Number(v))} type="number" />
                  <Field label="Late Fee ₹ (optional)" value={data.lateFee} onChange={v => upd("lateFee", Number(v))} type="number" />
                  <Field label="Previous Balance ₹ (optional)" value={data.previousBalance} onChange={v => upd("previousBalance", Number(v))} type="number" />
                </div>
              </Section>
            ) : (
              <Section title="Prepaid Receipt Details">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Receipt No." value={data.receiptNo} onChange={v => upd("receiptNo", v)} />
                  <Field label="Payment Date" value={data.paymentDate} onChange={v => upd("paymentDate", v)} type="date" />
                  <Field label="Order Number (optional)" value={data.orderNo} onChange={v => upd("orderNo", v)} />
                  <Select label="Payment Mode" value={data.paymentMode} onChange={v => upd("paymentMode", v)} options={PAYMENT_MODES} />
                </div>
                <Field label="Recharge Plan" value={data.rechargePlan} onChange={v => upd("rechargePlan", v)} placeholder="599 Unlimited Pack — 28 Days" />
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <Field label="Recharge Amount ₹" value={data.rechargeAmount} onChange={v => upd("rechargeAmount", Number(v))} type="number" />
                  <Field label="Validity" value={data.validity} onChange={v => upd("validity", v)} placeholder="28 Days" />
                </div>
              </Section>
            )}
          </div>

          <div className="mb-prev" style={{ position: "sticky", top: 88 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: INK_MUTED, margin: 0 }}>Live Preview</p>
              <SaveMenu onSave={doDownload} downloading={downloading} small />
            </div>

            {notice && (
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 12, color: "#92400E", display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span>⚠ {notice}</span>
                <button onClick={() => setNotice("")} style={{ background: "none", border: "none", color: "#92400E", cursor: "pointer", fontSize: 14, lineHeight: 1 }} aria-label="Dismiss">×</button>
              </div>
            )}

            <div className="preview-scale-wrap" style={{ transform: "scale(0.68)", transformOrigin: "top left", width: "147%", marginBottom: "-32%" }}>
              <MobileBillTemplate data={data} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderTop: `1px solid ${BORDER}` }}>
        <div className="seo-section" style={{ maxWidth: "80%", margin: "0 auto", width: "80%" }}>
          <DocumentPageSEO documentName="Mobile & Telephone Bill" documentSlug="mobile-bill" intro={INTRO} whatIs={WHAT_IS} whyUse={WHY_USE} features={FEATURES} howToSteps={HOW_TO_STEPS} benefits={BENEFITS} formatFields={FORMAT_FIELDS} faqs={FAQS} relatedDocs={RELATED_DOCS} />
        </div>
      </div>
    </div>
  );
}
