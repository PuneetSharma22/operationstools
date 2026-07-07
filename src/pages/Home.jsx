import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../supabase";

// ─── Same pastel icon map as TopHeader ───────────────────────────────────────

const DOC_ICON_MAP = {
  "fuel-bill": { bg: "#DBEAFE", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="5" y="3" width="14" height="19" rx="2" fill="#BFDBFE"/><rect x="8" y="7" width="8" height="1.5" rx="0.75" fill="#3B82F6"/><rect x="8" y="10.5" width="6" height="1.5" rx="0.75" fill="#3B82F6"/><rect x="8" y="14" width="8" height="1.5" rx="0.75" fill="#3B82F6"/><circle cx="20" cy="19" r="5" fill="#FDE68A"/><path d="M19 17.5l1.5 1.5-1.5 1.5" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 17.5v3" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  "rent-receipt": { bg: "#D1FAE5", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="4" y="5" width="20" height="18" rx="2.5" fill="#A7F3D0"/><path d="M9 10h10M9 14h6" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 17l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  "restaurant-bill": { bg: "#FCE7F3", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FBCFE8"/><path d="M9 8v5a3 3 0 0 0 6 0V8" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="13" x2="12" y2="20" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/><line x1="18" y1="8" x2="18" y2="20" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  "medical-bill": { bg: "#DCFCE7", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BBF7D0"/><rect x="12" y="8" width="4" height="12" rx="2" fill="#16A34A"/><rect x="8" y="12" width="12" height="4" rx="2" fill="#16A34A"/></svg> },
  "hotel-bill": { bg: "#DBEAFE", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BFDBFE"/><rect x="7" y="12" width="6" height="10" rx="1" fill="#2563EB"/><rect x="15" y="12" width="6" height="10" rx="1" fill="#2563EB"/><rect x="5" y="10" width="18" height="3" rx="1" fill="#3B82F6"/><rect x="11" y="6" width="6" height="4" rx="1" fill="#60A5FA"/></svg> },
  "electricity-bill": { bg: "#FEF3C7", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FDE68A"/><polygon points="16,4 9,15 14,15 12,24 19,13 14,13" fill="#D97706"/></svg> },
  "vehicle-expense": { bg: "#E0F2FE", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BAE6FD"/><rect x="5" y="11" width="18" height="8" rx="2" fill="#0284C7"/><rect x="8" y="8" width="12" height="5" rx="1.5" fill="#38BDF8"/><circle cx="9" cy="20" r="2" fill="#0369A1"/><circle cx="19" cy="20" r="2" fill="#0369A1"/></svg> },
  "travel-expense": { bg: "#EDE9FE", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#DDD6FE"/><path d="M6 18l4-6 3 3 4-5 5 8H6z" fill="#7C3AED" opacity="0.3"/><path d="M14 6l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" fill="#7C3AED"/></svg> },
  "roi-calculator": { bg: "#FEF3C7", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FDE68A"/><path d="M7 18l4-5 4 3 5-7" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="21" cy="9" r="2" fill="#F59E0B"/></svg> },
  "gst-invoice": { bg: "#EDE9FE", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="4" y="3" width="20" height="22" rx="2.5" fill="#DDD6FE"/><rect x="7" y="7" width="14" height="2" rx="1" fill="#7C3AED"/><rect x="7" y="11" width="9" height="1.5" rx="0.75" fill="#A78BFA"/><rect x="7" y="14" width="11" height="1.5" rx="0.75" fill="#A78BFA"/><rect x="7" y="17" width="7" height="1.5" rx="0.75" fill="#A78BFA"/><rect x="15" y="20" width="6" height="2" rx="1" fill="#7C3AED"/></svg> },
  "salary-slip": { bg: "#FCE7F3", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="6" width="22" height="16" rx="2.5" fill="#FBCFE8"/><circle cx="10" cy="14" r="4" fill="#F9A8D4"/><path d="M9 14h2M10 13v2" stroke="#DB2777" strokeWidth="1.3" strokeLinecap="round"/><rect x="16" y="11" width="6" height="1.5" rx="0.75" fill="#F9A8D4"/><rect x="16" y="14" width="4" height="1.5" rx="0.75" fill="#F9A8D4"/></svg> },
  "gst-calculator": { bg: "#CFFAFE", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#A5F3FC"/><text x="14" y="18" textAnchor="middle" fill="#0891B2" fontSize="11" fontWeight="700" fontFamily="monospace">%</text></svg> },
};

// ─── Stats ────────────────────────────────────────────────────────────────────

const stats = [
  { value: "100%", label: "Free forever" },
  { value: "0", label: "Sign-ups needed" },
  { value: "4", label: "Bill templates" },
  { value: "∞", label: "Documents generated" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  const [retailDocs, setRetailDocs] = useState(null);
  const [businessDocs, setBusinessDocs] = useState(null);

  useEffect(() => {
    supabase.from("documents").select("*").order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (error || !data?.length) {
          setRetailDocs(FALLBACK_RETAIL);
          setBusinessDocs(FALLBACK_BUSINESS);
          return;
        }
        setRetailDocs(data.filter(d => d.category === "retail"));
        setBusinessDocs(data.filter(d => d.category === "business"));
      });
  }, []);

  const retail = retailDocs || FALLBACK_RETAIL;
  const business = businessDocs || FALLBACK_BUSINESS;

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #07011F 0%, #0D0630 55%, #1e1b4b 100%)", padding: "80px 24px 72px", textAlign: "center" }}>
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          <span style={{ display: "inline-block", background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.35)", color: "#A5B4FC", fontSize: 12, fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 999, marginBottom: 28 }}>
            Free tools for Indian businesses
          </span>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: 800, color: "#fff", lineHeight: 1.15, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
            Professional documents,{" "}
            <span style={{ background: "linear-gradient(90deg, #60A5FA, #818CF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              ready in seconds
            </span>
          </h1>
          <p style={{ fontSize: 18, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 40px", maxWidth: 520, marginLeft: "auto", marginRight: "auto" }}>
            Fuel bills, rent receipts, GST invoices — generated, filled, and printed without a single login or rupee spent.
          </p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/documents/fuel-bill" style={{ background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)", color: "#fff", padding: "13px 28px", borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: "none", boxShadow: "0 4px 20px rgba(79,70,229,0.4)" }}>
              Generate a fuel bill →
            </Link>
            <a href="#tools" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#CBD5E1", padding: "13px 28px", borderRadius: 10, fontWeight: 500, fontSize: 15, textDecoration: "none" }}>
              Browse all tools
            </a>
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section style={{ background: "#07011F", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "20px 24px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8 }}>
          {stats.map(s => (
            <div key={s.label} style={{ textAlign: "center", padding: "8px 0" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#E0E7FF", lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 4, fontWeight: 500 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Tools */}
      <section id="tools" style={{ padding: "72px 24px", maxWidth: 1000, margin: "0 auto" }}>

        {/* Retail */}
        <CategorySection
          label="Retail Documents"
          description="Receipts and bills for everyday personal & business expenses — reimbursement ready."
          docs={retail}
        />

        <div style={{ marginBottom: 64 }} />

        {/* Business */}
        <CategorySection
          label="Business Tools"
          description="Invoices, calculators and compliance tools for running your business."
          docs={business}
        />
      </section>

      {/* Why OpsTools */}
      <section style={{ background: "linear-gradient(135deg, #07011F 0%, #0D0630 100%)", padding: "72px 24px", textAlign: "center" }}>
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.02em" }}>
            Built for the operator, not the accountant
          </h2>
          <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.75, margin: "0 0 48px" }}>
            Most document tools are built for chartered accountants — complex, expensive, and full of fields you don't understand. OpsTools is different. Every tool here is designed for the person running the business, not auditing it.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 24, textAlign: "left" }}>
            {[
              { icon: "⚡", title: "Instant", body: "Fill the form, hit print. No account, no waiting, no email verification." },
              { icon: "🔒", title: "Private", body: "Nothing is stored on our servers. Your data stays in your browser." },
              { icon: "📱", title: "Mobile-ready", body: "Works on any phone. Generate and share a PDF from anywhere." },
              { icon: "🇮🇳", title: "India-specific", body: "Templates based on actual Indian receipts and compliance formats." },
            ].map(f => (
              <div key={f.title} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, padding: "20px 18px" }}>
                <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#E2E8F0", marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Category Section ─────────────────────────────────────────────────────────

function CategorySection({ label, description, docs }) {
  // Group by bundle
  const groups = docs.reduce((acc, doc) => {
    const key = doc.bundle || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(doc);
    return acc;
  }, {});

  return (
    <div>
      <div style={{ marginBottom: 24 }}>
        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "0 0 6px", letterSpacing: "-0.01em" }}>{label}</h2>
        <p style={{ fontSize: 14, color: "#64748B", margin: 0, lineHeight: 1.6 }}>{description}</p>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        {Object.entries(groups).map(([bundle, items]) => (
          <div key={bundle}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 12px" }}>
              {bundle.replace(" Suite", "")}
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 10 }}>
              {items.map(doc => <DocCard key={doc.slug} doc={doc} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Doc Card ─────────────────────────────────────────────────────────────────

function DocCard({ doc }) {
  const isLive = doc.status === "live";
  const iconData = DOC_ICON_MAP[doc.slug];

  const inner = (
    <div style={{
      display: "flex", alignItems: "center", gap: 14,
      background: "#fff", border: "1px solid #E2E8F0",
      borderRadius: 14, padding: "14px 16px",
      cursor: isLive ? "pointer" : "default",
      opacity: isLive ? 1 : 0.72,
      transition: "box-shadow 0.18s, transform 0.18s",
      position: "relative",
    }}
      onMouseEnter={e => { if (isLive) { e.currentTarget.style.boxShadow = "0 4px 20px rgba(0,0,0,0.08)"; e.currentTarget.style.transform = "translateY(-1px)"; }}}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      {/* Icon */}
      <div style={{ width: 44, height: 44, borderRadius: 11, background: iconData?.bg || "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {iconData?.svg || <span style={{ fontSize: 20 }}>{doc.icon}</span>}
      </div>

      {/* Text */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2 }}>
          <span style={{ fontSize: 14, fontWeight: 650, color: "#0F172A" }}>{doc.name}</span>
          {isLive ? (
            <span style={{ fontSize: 10, fontWeight: 700, color: "#059669", background: "#D1FAE5", padding: "1px 7px", borderRadius: 999, letterSpacing: "0.04em", flexShrink: 0 }}>LIVE</span>
          ) : (
            <span style={{ fontSize: 10, fontWeight: 600, color: "#94A3B8", background: "#F1F5F9", padding: "1px 7px", borderRadius: 999, flexShrink: 0 }}>SOON</span>
          )}
        </div>
        <p style={{ fontSize: 12, color: "#94A3B8", margin: 0, lineHeight: 1.4, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {doc.description || doc.tagline}
        </p>
      </div>

      {/* Arrow for live */}
      {isLive && (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <path d="M5 12h14M12 5l7 7-7 7"/>
        </svg>
      )}
    </div>
  );

  return isLive ? (
    <Link to={doc.href} style={{ textDecoration: "none", display: "block" }}>{inner}</Link>
  ) : <div>{inner}</div>;
}

// ─── Fallback data ─────────────────────────────────────────────────────────────

const FALLBACK_RETAIL = [
  { slug: "fuel-bill", name: "Fuel Bill", href: "/documents/fuel-bill", description: "Petrol & diesel receipts for reimbursement", bundle: "Transport Suite", status: "live" },
  { slug: "rent-receipt", name: "Rent Receipt", href: "/documents/rent-receipt", description: "HRA-compliant rent receipts with PAN", bundle: "Housing Suite", status: "live" },
  { slug: "restaurant-bill", name: "Restaurant Bill", href: "#", description: "Restaurant bills and food receipts", bundle: "Food Suite", status: "soon" },
  { slug: "medical-bill", name: "Medical Bill", href: "#", description: "Medical & pharmacy expense receipts", bundle: "Healthcare Suite", status: "soon" },
  { slug: "hotel-bill", name: "Hotel Bill", href: "#", description: "Hotel stay receipts for reimbursement", bundle: "Hospitality Suite", status: "soon" },
  { slug: "electricity-bill", name: "Electricity Bill", href: "#", description: "Utility bills for expense claims", bundle: "Utility Suite", status: "soon" },
  { slug: "vehicle-expense", name: "Vehicle Expense", href: "#", description: "Vehicle maintenance & fuel expense report", bundle: "Transport Suite", status: "soon" },
  { slug: "travel-expense", name: "Travel Expense", href: "#", description: "Business travel expense summary", bundle: "Transport Suite", status: "soon" },
];

const FALLBACK_BUSINESS = [
  { slug: "roi-calculator", name: "ROI Calculator", href: "/roi", description: "Calculate return on investment", bundle: "Finance Suite", status: "live" },
  { slug: "gst-invoice", name: "GST Invoice", href: "#", description: "Tax-compliant GST invoices with HSN codes", bundle: "GST Suite", status: "soon" },
  { slug: "salary-slip", name: "Salary Slip", href: "#", description: "Payslips with CTC, deductions & net pay", bundle: "HR Suite", status: "soon" },
  { slug: "quotation", name: "Quotation", href: "#", description: "Professional business quotations", bundle: "Invoice Suite", status: "soon" },
  { slug: "service-invoice", name: "Service Invoice", href: "#", description: "Invoices for service-based businesses", bundle: "Service Suite", status: "soon" },
  { slug: "freelancer-invoice", name: "Freelancer Invoice", href: "#", description: "Invoices for freelancers & consultants", bundle: "Freelancer Suite", status: "soon" },
];
