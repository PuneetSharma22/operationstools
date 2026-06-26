import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "../supabase";

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
  "quotation": { bg: "#D1FAE5", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="4" y="3" width="20" height="22" rx="2.5" fill="#A7F3D0"/><rect x="7" y="7" width="14" height="2" rx="1" fill="#059669"/><rect x="7" y="11" width="10" height="1.5" rx="0.75" fill="#6EE7B7"/><rect x="7" y="14" width="12" height="1.5" rx="0.75" fill="#6EE7B7"/><rect x="7" y="17" width="8" height="1.5" rx="0.75" fill="#6EE7B7"/></svg> },
  "service-invoice": { bg: "#FEF3C7", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FDE68A"/><circle cx="14" cy="14" r="5" fill="#F59E0B" opacity="0.4"/><circle cx="14" cy="14" r="2" fill="#D97706"/><path d="M14 7v2M14 19v2M7 14h2M19 14h2" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  "freelancer-invoice": { bg: "#DBEAFE", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="5" width="22" height="18" rx="2.5" fill="#BFDBFE"/><rect x="6" y="9" width="16" height="2" rx="1" fill="#3B82F6"/><rect x="6" y="13" width="10" height="1.5" rx="0.75" fill="#93C5FD"/><rect x="6" y="16" width="12" height="1.5" rx="0.75" fill="#93C5FD"/></svg> },
};

export default function DocumentsPage() {
  const location = useLocation();
  const [allDocs, setAllDocs] = useState([]);

  useEffect(() => {
    supabase.from("documents").select("*").order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (error || !data?.length) {
          setAllDocs(FALLBACK_ALL);
          return;
        }
        setAllDocs(data);
      });
  }, []);

  const liveDocs = allDocs.filter(d => d.status === "live");
  const retailDocs = allDocs.filter(d => d.category === "retail");
  const businessDocs = allDocs.filter(d => d.category === "business");

  // Group by bundle
  const groupBy = (docs) => docs.reduce((acc, doc) => {
    const key = doc.bundle || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(doc);
    return acc;
  }, {});

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>

      {/* Sub-nav — live docs only */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0" }} className="no-print">
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 4, height: 48 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", marginRight: 8 }}>Documents</span>
            <div style={{ width: 1, height: 16, background: "#E2E8F0", marginRight: 8 }} />
            {liveDocs.map(doc => (
              <Link key={doc.href} to={doc.href} style={{
                display: "flex", alignItems: "center", gap: 7,
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
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "36px 24px 60px" }}>

          {/* Header */}
          <div style={{ marginBottom: 32 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.02em" }}>All Documents</h1>
            <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>
              {liveDocs.length} live · {allDocs.length - liveDocs.length} coming soon
            </p>
          </div>

          {/* Two column layout — Retail | Business */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32, alignItems: "start" }}>

            {/* Retail */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <h2 style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Retail</h2>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#059669", background: "#D1FAE5", padding: "1px 7px", borderRadius: 999 }}>
                  {retailDocs.filter(d => d.status === "live").length} live
                </span>
              </div>
              <CompactDocList docs={retailDocs} />
            </div>

            {/* Business */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                <h2 style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", margin: 0, textTransform: "uppercase", letterSpacing: "0.06em" }}>Business</h2>
                <span style={{ fontSize: 10, fontWeight: 600, color: "#059669", background: "#D1FAE5", padding: "1px 7px", borderRadius: 999 }}>
                  {businessDocs.filter(d => d.status === "live").length} live
                </span>
              </div>
              <CompactDocList docs={businessDocs} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CompactDocList({ docs }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
      {docs.map(doc => {
        const isLive = doc.status === "live";
        const iconData = DOC_ICON_MAP[doc.slug];
        const inner = (
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            padding: "10px 12px", borderRadius: 10,
            background: "#fff", border: "1px solid #E2E8F0",
            cursor: isLive ? "pointer" : "default",
            opacity: isLive ? 1 : 0.6,
            transition: "box-shadow 0.12s",
          }}
            onMouseEnter={e => { if (isLive) e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"; }}
            onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; }}
          >
            <div style={{ width: 36, height: 36, borderRadius: 9, background: iconData?.bg || "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              {iconData?.svg || <span style={{ fontSize: 16 }}>{doc.icon}</span>}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{doc.name}</span>
                {isLive
                  ? <span style={{ fontSize: 9, fontWeight: 700, color: "#059669", background: "#D1FAE5", padding: "1px 6px", borderRadius: 999 }}>LIVE</span>
                  : <span style={{ fontSize: 9, fontWeight: 600, color: "#94A3B8", background: "#F1F5F9", padding: "1px 6px", borderRadius: 999 }}>SOON</span>
                }
              </div>
              <p style={{ fontSize: 11, color: "#94A3B8", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{doc.description}</p>
            </div>
            {isLive && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}><path d="M5 12h14M12 5l7 7-7 7"/></svg>}
          </div>
        );
        return isLive
          ? <Link key={doc.slug} to={doc.href} style={{ textDecoration: "none" }}>{inner}</Link>
          : <div key={doc.slug}>{inner}</div>;
      })}
    </div>
  );
}

function DocGrid({ groups }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
      {Object.entries(groups).map(([bundle, docs]) => (
        <div key={bundle}>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>
            {bundle.replace(" Suite", "")}
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 12 }}>
            {docs.map(doc => <DocCard key={doc.slug} doc={doc} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

function DocCard({ doc }) {
  const isLive = doc.status === "live";
  const iconData = DOC_ICON_MAP[doc.slug];

  const inner = (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      background: "#fff", border: "1px solid #E2E8F0",
      borderRadius: 14, padding: "14px 16px",
      cursor: isLive ? "pointer" : "default",
      opacity: isLive ? 1 : 0.65,
      transition: "box-shadow 0.15s, transform 0.15s",
    }}
      onMouseEnter={e => { if (isLive) { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ width: 44, height: 44, borderRadius: 11, background: iconData?.bg || "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {iconData?.svg || <span style={{ fontSize: 20 }}>{doc.icon}</span>}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{doc.name}</span>
          {isLive ? (
            <span style={{ fontSize: 10, fontWeight: 700, color: "#059669", background: "#D1FAE5", padding: "1px 7px", borderRadius: 999 }}>LIVE</span>
          ) : (
            <span style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", background: "#F1F5F9", padding: "1px 7px", borderRadius: 999 }}>SOON</span>
          )}
        </div>
        <p style={{ fontSize: 12, color: "#94A3B8", margin: 0, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {doc.description}
        </p>
      </div>
      {isLive && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" style={{ flexShrink: 0 }}>
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      )}
    </div>
  );

  return isLive ? (
    <Link to={doc.href} style={{ textDecoration: "none", display: "block" }}>{inner}</Link>
  ) : <div>{inner}</div>;
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
  { slug: "roi-calculator", name: "ROI Calculator", href: "/roi", description: "Calculate return on investment", bundle: "Finance Suite", category: "business", status: "live", sort_order: 1 },
  { slug: "gst-invoice", name: "GST Invoice", href: "#", description: "Tax-compliant GST invoices with HSN codes", bundle: "GST Suite", category: "business", status: "soon", sort_order: 2 },
  { slug: "salary-slip", name: "Salary Slip", href: "#", description: "Payslips with CTC, deductions & net pay", bundle: "HR Suite", category: "business", status: "soon", sort_order: 3 },
  { slug: "quotation", name: "Quotation", href: "#", description: "Professional business quotations", bundle: "Invoice Suite", category: "business", status: "soon", sort_order: 4 },
  { slug: "service-invoice", name: "Service Invoice", href: "#", description: "Invoices for service-based businesses", bundle: "Service Suite", category: "business", status: "soon", sort_order: 5 },
  { slug: "freelancer-invoice", name: "Freelancer Invoice", href: "#", description: "Invoices for freelancers & consultants", bundle: "Freelancer Suite", category: "business", status: "soon", sort_order: 6 },
];
