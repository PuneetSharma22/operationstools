import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { fetchDocuments } from "../lib/documentsCache";
import { useSEO } from "../seo/useSEO";

const DOC_ICON_MAP = {
  "fuel-bill": { bg: "#DBEAFE", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="5" y="3" width="14" height="19" rx="2" fill="#BFDBFE"/><rect x="8" y="7" width="8" height="1.5" rx="0.75" fill="#3B82F6"/><rect x="8" y="10.5" width="6" height="1.5" rx="0.75" fill="#3B82F6"/><rect x="8" y="14" width="8" height="1.5" rx="0.75" fill="#3B82F6"/><circle cx="20" cy="19" r="5" fill="#FDE68A"/><path d="M19 17.5l1.5 1.5-1.5 1.5" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 17.5v3" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  "rent-receipt": { bg: "#D1FAE5", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="4" y="5" width="20" height="18" rx="2.5" fill="#A7F3D0"/><path d="M9 10h10M9 14h6" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 17l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  "restaurant-bill": { bg: "#FCE7F3", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FBCFE8"/><path d="M9 8v5a3 3 0 0 0 6 0V8" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="13" x2="12" y2="20" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/><line x1="18" y1="8" x2="18" y2="20" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  "medical-bill": { bg: "#DCFCE7", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BBF7D0"/><rect x="12" y="8" width="4" height="12" rx="2" fill="#16A34A"/><rect x="8" y="12" width="12" height="4" rx="2" fill="#16A34A"/></svg> },
  "hotel-bill": { bg: "#DBEAFE", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BFDBFE"/><rect x="7" y="12" width="6" height="10" rx="1" fill="#2563EB"/><rect x="15" y="12" width="6" height="10" rx="1" fill="#2563EB"/><rect x="5" y="10" width="18" height="3" rx="1" fill="#3B82F6"/><rect x="11" y="6" width="6" height="4" rx="1" fill="#60A5FA"/></svg> },
  "electricity-bill": { bg: "#FEF3C7", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FDE68A"/><polygon points="16,4 9,15 14,15 12,24 19,13 14,13" fill="#D97706"/></svg> },
  "vehicle-expense": { bg: "#E0F2FE", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BAE6FD"/><rect x="5" y="11" width="18" height="8" rx="2" fill="#0284C7"/><rect x="8" y="8" width="12" height="5" rx="1.5" fill="#38BDF8"/><circle cx="9" cy="20" r="2" fill="#0369A1"/><circle cx="19" cy="20" r="2" fill="#0369A1"/></svg> },
  "travel-expense": { bg: "#EDE9FE", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#DDD6FE"/><path d="M14 6l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" fill="#7C3AED"/></svg> },
  "gst-invoice": { bg: "#EDE9FE", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="4" y="3" width="20" height="22" rx="2.5" fill="#DDD6FE"/><rect x="7" y="7" width="14" height="2" rx="1" fill="#7C3AED"/><rect x="7" y="11" width="9" height="1.5" rx="0.75" fill="#A78BFA"/><rect x="7" y="14" width="11" height="1.5" rx="0.75" fill="#A78BFA"/><rect x="7" y="17" width="7" height="1.5" rx="0.75" fill="#A78BFA"/><rect x="15" y="20" width="6" height="2" rx="1" fill="#7C3AED"/></svg> },
  "salary-slip": { bg: "#FCE7F3", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="6" width="22" height="16" rx="2.5" fill="#FBCFE8"/><circle cx="10" cy="14" r="4" fill="#F9A8D4"/><path d="M9 14h2M10 13v2" stroke="#DB2777" strokeWidth="1.3" strokeLinecap="round"/><rect x="16" y="11" width="6" height="1.5" rx="0.75" fill="#F9A8D4"/><rect x="16" y="14" width="4" height="1.5" rx="0.75" fill="#F9A8D4"/></svg> },
  "roi-calculator": { bg: "#FEF3C7", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FDE68A"/><path d="M7 18l4-5 4 3 5-7" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="21" cy="9" r="2" fill="#F59E0B"/></svg> },
  "quotation": { bg: "#D1FAE5", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="4" y="3" width="20" height="22" rx="2.5" fill="#A7F3D0"/><rect x="7" y="7" width="14" height="2" rx="1" fill="#059669"/><rect x="7" y="11" width="10" height="1.5" rx="0.75" fill="#6EE7B7"/><rect x="7" y="14" width="12" height="1.5" rx="0.75" fill="#6EE7B7"/></svg> },
  "service-invoice": { bg: "#FEF3C7", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FDE68A"/><circle cx="14" cy="14" r="5" fill="#F59E0B" opacity="0.4"/><circle cx="14" cy="14" r="2" fill="#D97706"/><path d="M14 7v2M14 19v2M7 14h2M19 14h2" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  "freelancer-invoice": { bg: "#DBEAFE", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="5" width="22" height="18" rx="2.5" fill="#BFDBFE"/><rect x="6" y="9" width="16" height="2" rx="1" fill="#3B82F6"/><rect x="6" y="13" width="10" height="1.5" rx="0.75" fill="#93C5FD"/><rect x="6" y="16" width="12" height="1.5" rx="0.75" fill="#93C5FD"/></svg> },
  "book-invoice": { bg: "#FEF3C7", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><path d="M5 5a2 2 0 0 1 2-2h9v22H7a2 2 0 0 1-2-2V5z" fill="#FDE68A"/><path d="M16 3h5a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2h-5V3z" fill="#FCD34D"/><rect x="8" y="7" width="6" height="1.4" rx="0.7" fill="#D97706"/><rect x="8" y="10" width="5" height="1.4" rx="0.7" fill="#D97706"/></svg> },
  "mobile-bill": { bg: "#FCE7F3", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="8" y="2" width="12" height="24" rx="2.5" fill="#FBCFE8"/><rect x="10.5" y="5" width="7" height="14" rx="0.8" fill="#fff"/><circle cx="14" cy="22" r="1.4" fill="#DB2777"/></svg> },
  "gst-calculator": { bg: "#CCFBF1", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#5EEAD4"/><rect x="7" y="7" width="14" height="5" rx="1" fill="#0F766E"/><rect x="7" y="15" width="4" height="4" rx="1" fill="#0F766E"/><rect x="13" y="15" width="4" height="4" rx="1" fill="#0F766E"/><rect x="19" y="15" width="4" height="4" rx="1" fill="#0F766E"/><rect x="7" y="20" width="4" height="3" rx="1" fill="#0F766E"/><rect x="13" y="20" width="4" height="3" rx="1" fill="#0F766E"/><rect x="19" y="20" width="4" height="3" rx="1" fill="#0F766E"/></svg> },
};

const CATEGORY_TABS = [
  { id: "all", label: "All" },
  { id: "retail", label: "Retail" },
  { id: "business", label: "Business" },
];

export default function DocumentsPage() {
  const location = useLocation();
  const [allDocs, setAllDocs] = useState([]);
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("all");

  useEffect(() => {
    fetchDocuments().then(data => {
      if (!data?.length) {
        setAllDocs(FALLBACK_ALL);
        return;
      }
      setAllDocs(data);
    });
  }, []);

  const liveDocs = allDocs.filter(d => d.status === "live");
  const retailDocs = allDocs.filter(d => d.category === "retail");
  const businessDocs = allDocs.filter(d => d.category === "business");

  const q = query.trim().toLowerCase();
  const filteredDocs = allDocs.filter(d => {
    const matchesCat = activeCat === "all" || d.category === activeCat;
    const matchesQuery = !q || d.name.toLowerCase().includes(q) || (d.description || "").toLowerCase().includes(q);
    return matchesCat && matchesQuery;
  });

  useSEO({
    title: "All Free Business Document Generators — OpsTools",
    description: `Browse ${liveDocs.length || "all"} free document generators for Indian businesses — fuel bills, rent receipts, GST invoices, salary slips, expense reports and more. No login, instant PDF.`,
    canonical: "https://www.opstools.ai/documents",
    breadcrumbs: [
      { name: "Home", url: "https://www.opstools.ai" },
      { name: "Documents", url: "https://www.opstools.ai/documents" },
    ],
  });

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <style>{`
        @media(max-width:768px){
          .docs-hero-title{font-size:28px!important;}
          .docs-stats-grid{grid-template-columns:repeat(2,1fr)!important;}
          .docs-grid{grid-template-columns:1fr!important;}
        }
      `}</style>

      {/* Sub-nav — live docs only, shared chrome across every /documents/* page */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0" }} className="no-print">
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, height: 48, overflowX: "auto" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", marginRight: 8, flexShrink: 0 }}>Documents</span>
            <div style={{ width: 1, height: 16, background: "#E2E8F0", marginRight: 8, flexShrink: 0 }} />
            {liveDocs.map(doc => (
              <Link key={doc.href} to={doc.href} style={{
                display: "flex", alignItems: "center", gap: 7, flexShrink: 0,
                padding: "0 12px", height: 32, borderRadius: 8,
                fontSize: 13, fontWeight: 500, textDecoration: "none",
                transition: "all 0.15s",
                background: location.pathname === doc.href ? "#EFF6FF" : "transparent",
                color: location.pathname === doc.href ? "#2563EB" : "#64748B",
              }}
                onMouseEnter={e => { if (location.pathname !== doc.href) { e.currentTarget.style.background = "#F8FAFC"; e.currentTarget.style.color = "#0F172A"; }}}
                onMouseLeave={e => { if (location.pathname !== doc.href) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#64748B"; }}}
              >
                <div style={{ width: 20, height: 20, borderRadius: 5, background: DOC_ICON_MAP[doc.slug]?.bg || "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {DOC_ICON_MAP[doc.slug]?.svg || <span style={{ fontSize: 11 }}>{doc.icon}</span>}
                </div>
                {doc.name}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Index page */}
      {location.pathname === "/documents" && (
        <>
          {/* Hero — same dark gradient + badge pill language as the homepage and every tool page */}
          <section style={{ background: "linear-gradient(160deg, #07011F 0%, #0D0630 55%, #1e1b4b 100%)", padding: "56px 24px 40px" }} className="no-print">
            <div style={{ maxWidth: 1100, margin: "0 auto" }}>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.35)", color: "#A5B4FC", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 999, marginBottom: 20 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818CF8", display: "inline-block" }} />
                {liveDocs.length} tools live · Always free
              </span>
              <h1 className="docs-hero-title" style={{ fontSize: "clamp(26px, 3.5vw, 42px)", fontWeight: 800, color: "#fff", lineHeight: 1.15, margin: "0 0 12px", letterSpacing: "-0.025em", maxWidth: 640 }}>
                Every document your business needs, in one place
              </h1>
              <p style={{ fontSize: 15, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 28px", maxWidth: 520 }}>
                Bills, receipts, invoices and calculators for Indian businesses — search below, or browse by category.
              </p>

              {/* Search */}
              <div style={{ position: "relative", maxWidth: 480 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2" strokeLinecap="round" style={{ position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)" }}><circle cx="11" cy="11" r="7"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
                <input
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  placeholder="Search — rent receipt, GST invoice, mobile bill…"
                  style={{ width: "100%", height: 48, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.16)", borderRadius: 12, padding: "0 16px 0 42px", fontSize: 14, color: "#fff", outline: "none", boxSizing: "border-box" }}
                  onFocus={e => { e.target.style.borderColor = "#818CF8"; e.target.style.background = "rgba(255,255,255,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "rgba(255,255,255,0.16)"; e.target.style.background = "rgba(255,255,255,0.07)"; }}
                />
              </div>
            </div>
          </section>

          {/* Stats strip — same dark bar treatment as the homepage */}
          <section style={{ background: "#07011F", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px" }} className="no-print">
            <div style={{ maxWidth: 900, margin: "0 auto" }}>
              <div className="docs-stats-grid" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)" }}>
                {[
                  { value: String(liveDocs.length), label: "Tools live" },
                  { value: String(retailDocs.length), label: "Retail" },
                  { value: String(businessDocs.length), label: "Business" },
                  { value: "₹0", label: "Cost, always" },
                ].map((s, i) => (
                  <div key={s.label} style={{ textAlign: "center", padding: "18px 16px", borderRight: i < 3 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-0.02em" }}>{s.value}</div>
                    <div style={{ fontSize: 11.5, color: "#94A3B8", marginTop: 5, fontWeight: 500 }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 64px" }}>
            {/* Category filter tabs */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 24 }}>
              {CATEGORY_TABS.map(tab => {
                const count = tab.id === "all" ? allDocs.length : tab.id === "retail" ? retailDocs.length : businessDocs.length;
                const active = activeCat === tab.id;
                return (
                  <button key={tab.id} onClick={() => setActiveCat(tab.id)} style={{
                    display: "flex", alignItems: "center", gap: 6,
                    padding: "8px 16px", borderRadius: 999,
                    border: active ? "1.5px solid #2563EB" : "1px solid #E2E8F0",
                    background: active ? "#EFF6FF" : "#fff",
                    color: active ? "#2563EB" : "#64748B",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                  }}>
                    {tab.label}
                    <span style={{ fontSize: 11, fontWeight: 700, color: active ? "#2563EB" : "#94A3B8", background: active ? "rgba(37,99,235,0.1)" : "#F1F5F9", padding: "1px 6px", borderRadius: 999 }}>{count}</span>
                  </button>
                );
              })}
            </div>

            {/* Grid */}
            {filteredDocs.length > 0 ? (
              <div className="docs-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
                {filteredDocs.map(doc => <DocCard key={doc.slug} doc={doc} />)}
              </div>
            ) : (
              <div style={{ textAlign: "center", padding: "56px 16px", color: "#94A3B8" }}>
                <div style={{ fontSize: 28, marginBottom: 10 }}>🔍</div>
                <p style={{ fontSize: 14, margin: 0 }}>No document matches "{query}". Try a different word, or browse by category above.</p>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

function DocCard({ doc }) {
  const isLive = doc.status === "live" || doc.status === "new";
  const iconData = DOC_ICON_MAP[doc.slug];
  const inner = (
    <div style={{
      background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16,
      padding: "20px 18px", height: "100%", boxSizing: "border-box",
      display: "flex", flexDirection: "column", gap: 12,
      cursor: isLive ? "pointer" : "default",
      opacity: isLive ? 1 : 0.65,
      transition: "box-shadow 0.18s, transform 0.18s",
    }}
      onMouseEnter={e => { if (isLive) { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 12, background: iconData?.bg || "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {iconData?.svg || <span style={{ fontSize: 22 }}>{doc.icon}</span>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 650, color: "#0F172A", marginBottom: 4, lineHeight: 1.3 }}>{doc.name}</div>
        <div style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.5 }}>{doc.description}</div>
      </div>
      {doc.status === "live" ? (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, color: "#059669", background: "#D1FAE5", padding: "3px 10px", borderRadius: 999, alignSelf: "flex-start" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#059669", display: "inline-block" }} />Live
        </div>
      ) : (
        <div style={{ display: "inline-flex", alignItems: "center", fontSize: 11.5, fontWeight: 600, color: "#94A3B8", background: "#F1F5F9", padding: "3px 10px", borderRadius: 999, alignSelf: "flex-start" }}>Coming soon</div>
      )}
    </div>
  );
  return isLive ? <Link to={doc.href} style={{ textDecoration: "none", display: "block", height: "100%" }}>{inner}</Link> : <div style={{ height: "100%" }}>{inner}</div>;
}

const FALLBACK_ALL = [
  { slug: "fuel-bill", name: "Fuel Bill", href: "/documents/fuel-bill", description: "Petrol & diesel receipts for reimbursement", bundle: "Transport Suite", category: "retail", status: "live", sort_order: 1 },
  { slug: "rent-receipt", name: "Rent Receipt", href: "/documents/rent-receipt", description: "HRA-compliant rent receipts with PAN", bundle: "Housing Suite", category: "retail", status: "live", sort_order: 2 },
  { slug: "restaurant-bill", name: "Restaurant Bill", href: "#", description: "Restaurant bills and food receipts", bundle: "Food Suite", category: "retail", status: "soon", sort_order: 3 },
  { slug: "medical-bill", name: "Medical Bill", href: "#", description: "Medical & pharmacy expense receipts", bundle: "Healthcare Suite", category: "retail", status: "soon", sort_order: 4 },
  { slug: "hotel-bill", name: "Hotel Bill", href: "#", description: "Hotel stay receipts for reimbursement", bundle: "Hospitality Suite", category: "retail", status: "soon", sort_order: 5 },
  { slug: "electricity-bill", name: "Electricity Bill", href: "#", description: "Utility bills for expense claims", bundle: "Utility Suite", category: "retail", status: "soon", sort_order: 6 },
  { slug: "vehicle-expense", name: "Vehicle Expense", href: "#", description: "Vehicle maintenance & fuel expense report", bundle: "Transport Suite", category: "retail", status: "soon", sort_order: 7 },
  { slug: "travel-expense", name: "Travel Expense", href: "#", description: "Business travel expense summary", bundle: "Transport Suite", category: "retail", status: "soon", sort_order: 8 },
  { slug: "book-invoice", name: "Book & Periodical Invoice", href: "/documents/book-invoice", description: "GST invoices for books, magazines & newspapers", bundle: "Retail Suite", category: "retail", status: "live", sort_order: 9 },
  { slug: "mobile-bill", name: "Mobile & Telephone Bill", href: "/documents/mobile-bill", description: "Postpaid invoices & prepaid recharge receipts", bundle: "Utility Suite", category: "retail", status: "live", sort_order: 10 },
  { slug: "roi-calculator", name: "ROI Calculator", href: "/business/roi-calculator", description: "Calculate return on investment", bundle: "Finance Suite", category: "business", status: "live", sort_order: 1 },
  { slug: "gst-invoice", name: "GST Invoice", href: "#", description: "Tax-compliant GST invoices with HSN codes", bundle: "GST Suite", category: "business", status: "soon", sort_order: 2 },
  { slug: "salary-slip", name: "Salary Slip", href: "#", description: "Payslips with CTC, deductions & net pay", bundle: "HR Suite", category: "business", status: "soon", sort_order: 3 },
  { slug: "quotation", name: "Quotation", href: "#", description: "Professional business quotations", bundle: "Invoice Suite", category: "business", status: "soon", sort_order: 4 },
  { slug: "service-invoice", name: "Service Invoice", href: "#", description: "Invoices for service-based businesses", bundle: "Service Suite", category: "business", status: "soon", sort_order: 5 },
  { slug: "freelancer-invoice", name: "Freelancer Invoice", href: "#", description: "Invoices for freelancers & consultants", bundle: "Freelancer Suite", category: "business", status: "soon", sort_order: 6 },
  { slug: "gst-calculator", name: "GST Calculator", href: "/business/gst-calculator", description: "Add or remove GST with CGST/SGST/IGST breakdown", bundle: "Finance Suite", category: "business", status: "live", sort_order: 7 },
];
