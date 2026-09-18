import { useState } from "react";
import { supabase } from "../../supabase";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";
import DocumentToolHero from "../../components/common/DocumentToolHero";
import LoginPromptModal from "../../components/common/LoginPromptModal";
import SaveMenu from "../../components/common/SaveMenu";
import { exportSingleDocument } from "../../utils/documentExport";
import { logSaveRequest } from "../../utils/saveLog";
import BookInvoiceTemplate from "../../components/bookInvoice/BookInvoiceTemplate";
import BulkGenerateModal from "../../components/bookInvoice/BulkGenerateModal";
import { defaultBookInvoiceData, defaultItem, PAYMENT_MODES } from "../../components/bookInvoice/defaults";

const TAINTED_HINT = "the logo image doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again.";

const INK = "#0F172A";
const INK_MUTED = "#64748B";
const BORDER = "#E2E8F0";
const SURFACE = "#F8FAFC";
const BRAND = "#2563EB";

// ─── SEO ─────────────────────────────────────────────────────────────────────
const SEO_TITLE = "Free Book & Periodical Invoice Generator — Retail GST Bill | OpsTools";
const SEO_DESCRIPTION = "Generate a GST invoice for book, magazine and periodical sales. Multiple items, CGST/SGST breakdown, amount in words. Free, no login, instant PDF.";
const CANONICAL = "https://www.opstools.ai/documents/book-invoice";
const softwareAppSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "OpsTools Book & Periodical Invoice Generator", operatingSystem: "Web", applicationCategory: "BusinessApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, description: SEO_DESCRIPTION, url: CANONICAL, provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" } };
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "Is this book invoice generator free?", acceptedAnswer: { "@type": "Answer", text: "Yes, single invoices are completely free with no login required. Bulk generation via CSV uses credits." } },
  { "@type": "Question", name: "Can I add multiple books or magazines to one invoice?", acceptedAnswer: { "@type": "Answer", text: "Yes, add as many line items as you need — each with its own title, author/publisher, HSN code, quantity, rate and GST rate." } },
  { "@type": "Question", name: "What GST rate applies to books and periodicals?", acceptedAnswer: { "@type": "Answer", text: "Printed books are commonly nil-rated (0% GST) while some periodicals, stationery and other retail items can attract 5%, 12% or 18% — set the correct rate per item; this generator doesn't assume one rate for everything." } },
  { "@type": "Question", name: "Can I generate many invoices at once?", acceptedAnswer: { "@type": "Answer", text: "Yes, use \"Generate in Bulk\" to upload a CSV and generate a batch of single-item invoices as one PDF." } },
] };
const INTRO = (<><p style={{ marginBottom: 16 }}>Selling books, magazines or newspapers and need a proper GST invoice? OpsTools Book & Periodical Invoice Generator lays out a clean retail tax invoice — store and customer details, a multi-item table with HSN codes, and the GST breakdown — in under a minute.</p><p style={{ marginBottom: 16 }}>Add as many titles as one sale needs, each with its own author/publisher, HSN code and GST rate, since books and periodicals often carry different tax treatment on the same bill.</p><p>The preview updates live as you type. Download directly as a PDF — your data never leaves your browser.</p></>);
const WHAT_IS = `A book & periodical invoice is the GST tax invoice a bookstore, newsstand or publisher issues for the sale of books, magazines or newspapers, showing the taxable value, applicable GST, and total per title sold.`;
const WHY_USE = [
  { title: "Bookstores & newsstands", body: "Issue proper GST invoices for book and magazine sales instead of a handwritten slip." },
  { title: "Publishers & distributors", body: "Bill retailers or direct customers with correctly split HSN codes and GST rates per title." },
  { title: "Expense & reimbursement records", body: "Generate a clean receipt for book purchases claimed as a business or education expense." },
];
const FEATURES = [
  { icon: "📚", title: "Multiple items per invoice", body: "Add as many books or periodicals as one sale needs." },
  { icon: "🧾", title: "GST breakdown", body: "CGST/SGST computed per line item, since different titles can carry different rates." },
  { icon: "🔢", title: "Amount in words", body: "Total automatically converted to words." },
  { icon: "👁️", title: "Live preview", body: "See the invoice update in real time as you fill the form." },
  { icon: "📦", title: "Bulk generation", body: "Upload a CSV to generate a whole batch of invoices as one PDF." },
  { icon: "🔒", title: "100% private", body: "No data is stored or transmitted for single-invoice generation." },
];
const HOW_TO_STEPS = [
  { step: 1, title: "Add store details", body: "Store name, address, GSTIN, phone and logo." },
  { step: 2, title: "Add customer details", body: "Customer name, address and phone (optional)." },
  { step: 3, title: "Add books/periodicals", body: "List each title with author/publisher, HSN, quantity, rate and GST rate." },
  { step: 4, title: "Preview", body: "Check the live preview — totals update instantly." },
  { step: 5, title: "Download", body: "Click Save to download the invoice as a PDF or PNG." },
];
const BENEFITS = [
  "Multiple books/periodicals on one invoice, each with its own GST rate.",
  "CGST/SGST breakdown and amount in words included.",
  "No registration or sign-up required for single invoices.",
  "All data stays in your browser — zero privacy risk.",
  "Bulk CSV generation available for high-volume stores.",
];
const FORMAT_FIELDS = [
  { field: "HSN Code", description: "Classification code for books (4901) or periodicals (4902)", example: "4901" },
  { field: "GST Rate", description: "Applicable GST percentage — varies by item type", example: "0% / 5% / 12%" },
  { field: "Store GSTIN", description: "Bookstore's GST registration number", example: "06AABCU9603R1Z5" },
];
const FAQS = faqSchema.mainEntity.map((i) => ({ q: i.name, a: i.acceptedAnswer.text }));
const RELATED_DOCS = [
  { name: "GST Invoice Generator", href: "/documents/gst-invoice", description: "General-purpose GST tax invoices." },
  { name: "Retail Receipt — Restaurant Bill", href: "/documents/restaurant-bill", description: "Restaurant bills and food receipts." },
  { name: "Mobile / Telephone Bill", href: "/documents/mobile-bill", description: "Postpaid invoices & prepaid recharge receipts." },
];
const BREADCRUMBS = [
  { name: "Home", url: "https://www.opstools.ai" },
  { name: "Documents", url: "https://www.opstools.ai/documents" },
  { name: "Book & Periodical Invoice", url: CANONICAL },
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

function Section({ title, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${BORDER}`, padding: "20px 24px", marginBottom: 16 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, color: INK, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</h2>
      {children}
    </div>
  );
}

export default function BookInvoicePage() {
  const [data, setData] = useState(defaultBookInvoiceData);
  const [modal, setModal] = useState(null);
  const [modalUser, setModalUser] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");

  const upd = (setter) => (k, v) => setter(p => ({ ...p, [k]: v }));
  const updNested = (key) => (k, v) => setData(p => ({ ...p, [key]: { ...p[key], [k]: v } }));
  const updItem = (id, k, v) => setData(p => ({ ...p, items: p.items.map(i => i.id === id ? { ...i, [k]: v } : i) }));

  const doDownload = async (format = "pdf") => {
    if (downloading) return;
    setDownloading(true);
    setNotice("");

    const printId = `BK-${Date.now()}`;
    const logged = await logSaveRequest({ template: "book-invoice", printId, billData: data });
    if (!logged.ok) setNotice("Your invoice downloaded fine, but we couldn't record it on our side.");

    await exportSingleDocument({
      Template: BookInvoiceTemplate,
      data,
      format,
      fileBase: `book-invoice-${data.invoiceNo || Date.now()}`,
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

  return (
    <div style={{ backgroundColor: SURFACE, minHeight: "100vh" }}>
      <style>{`@media(max-width:1023px){.bk-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .bk-grid{grid-template-columns:1fr!important;}}@media(max-width:768px){.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}@media print{.no-print{display:none!important;}}`}</style>

      {modal === "login" && <LoginPromptModal onClose={() => setModal(null)} unitLabel="invoices" />}
      {modal === "bulk" && modalUser && (
        <BulkGenerateModal user={modalUser} formData={data} onClose={() => setModal(null)} />
      )}

      <DocumentToolHero
        crumb="Book & Periodical Invoice"
        title="Book & Periodical Invoice Generator"
        subtitle="Retail GST invoices for books, magazines & newspapers — multiple items, CGST/SGST breakdown."
        onBulkClick={handleBulkClick}
      />

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }} className="no-print">
        <div className="bk-grid" style={{ display: "grid", gridTemplateColumns: "1fr 500px", gap: 28, alignItems: "start" }}>
          <div>
            <Section title="Invoice Details">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Invoice No." value={data.invoiceNo} onChange={v => upd(setData)("invoiceNo", v)} />
                <Field label="Invoice Date" value={data.invoiceDate} onChange={v => upd(setData)("invoiceDate", v)} type="date" />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: INK_MUTED, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Payment Mode</label>
                  <select value={data.paymentMode} onChange={e => upd(setData)("paymentMode", e.target.value)} style={{ width: "100%", height: 38, border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: "0 10px", fontSize: 13, outline: "none", background: "#fff" }}>
                    {PAYMENT_MODES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <Field label="Logo URL" value={data.logoUrl} onChange={v => upd(setData)("logoUrl", v)} placeholder="https://..." />
              </div>
            </Section>

            <Section title="Store Details (Sold By)">
              <Field label="Store Name" value={data.store.name} onChange={v => updNested("store")("name", v)} placeholder="Nandan Book Store" />
              <Field label="Address" value={data.store.address} onChange={v => updNested("store")("address", v)} />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="GSTIN" value={data.store.gstin} onChange={v => updNested("store")("gstin", v)} placeholder="06AABCU9603R1Z5" />
                <Field label="Phone" value={data.store.phone} onChange={v => updNested("store")("phone", v)} />
                <Field label="Email" value={data.store.email} onChange={v => updNested("store")("email", v)} />
              </div>
            </Section>

            <Section title="Customer Details (Bill To)">
              <Field label="Customer Name" value={data.customer.name} onChange={v => updNested("customer")("name", v)} placeholder="Rajesh Verma" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Address (optional)" value={data.customer.address} onChange={v => updNested("customer")("address", v)} />
                <Field label="Phone (optional)" value={data.customer.phone} onChange={v => updNested("customer")("phone", v)} />
              </div>
            </Section>

            <Section title="Books & Periodicals">
              {data.items.map((item, idx) => (
                <div key={item.id} style={{ background: SURFACE, borderRadius: 12, padding: "14px 16px", marginBottom: 10, border: `1px solid ${BORDER}`, position: "relative" }}>
                  {data.items.length > 1 && <button onClick={() => setData(p => ({ ...p, items: p.items.filter(i => i.id !== item.id) }))} style={{ position: "absolute", top: 10, right: 10, background: "#FEF2F2", border: "none", borderRadius: 6, width: 24, height: 24, cursor: "pointer", color: "#DC2626", fontSize: 14 }}>×</button>}
                  <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", marginBottom: 8, textTransform: "uppercase" }}>Item {idx + 1}</div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <Field label="Title" value={item.description} onChange={v => updItem(item.id, "description", v)} placeholder="Best of Indian Mythology" small />
                    <Field label="Author / Publisher" value={item.author} onChange={v => updItem(item.id, "author", v)} placeholder="Amar Chitra Katha" small />
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 8 }}>
                    <Field label="HSN" value={item.hsn} onChange={v => updItem(item.id, "hsn", v)} placeholder="4901" small />
                    <Field label="Qty" value={item.qty} onChange={v => updItem(item.id, "qty", Number(v))} type="number" small />
                    <Field label="Rate ₹" value={item.rate} onChange={v => updItem(item.id, "rate", Number(v))} type="number" small />
                    <Field label="GST %" value={item.gstRate} onChange={v => updItem(item.id, "gstRate", Number(v))} type="number" small />
                  </div>
                  <div style={{ fontSize: 12, color: INK, fontWeight: 700, marginTop: 6 }}>
                    Total: ₹{(item.qty * item.rate * (1 + item.gstRate / 100)).toFixed(2)}
                  </div>
                </div>
              ))}
              <button onClick={() => setData(p => ({ ...p, items: [...p.items, defaultItem()] }))} style={{ width: "100%", padding: 10, borderRadius: 10, border: `1.5px dashed ${BRAND}`, background: "#fff", color: BRAND, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>+ Add Book / Periodical</button>
              <div style={{ background: INK, color: "#fff", borderRadius: 10, padding: "12px 16px", marginTop: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontSize: 14, fontWeight: 700 }}>Grand Total</span>
                <span style={{ fontSize: 18, fontWeight: 900 }}>₹{data.items.reduce((s, i) => s + i.qty * i.rate * (1 + i.gstRate / 100), 0).toFixed(2)}</span>
              </div>
            </Section>
          </div>

          <div className="bk-prev" style={{ position: "sticky", top: 88 }}>
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
              <BookInvoiceTemplate data={data} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderTop: `1px solid ${BORDER}` }}>
        <div className="seo-section" style={{ maxWidth: "80%", margin: "0 auto", width: "80%" }}>
          <DocumentPageSEO documentName="Book & Periodical Invoice" documentSlug="book-invoice" intro={INTRO} whatIs={WHAT_IS} whyUse={WHY_USE} features={FEATURES} howToSteps={HOW_TO_STEPS} benefits={BENEFITS} formatFields={FORMAT_FIELDS} faqs={FAQS} relatedDocs={RELATED_DOCS} />
        </div>
      </div>
    </div>
  );
}
