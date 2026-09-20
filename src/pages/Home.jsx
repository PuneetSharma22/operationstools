import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { fetchDocuments } from "../lib/documentsCache";
import { Helmet } from 'react-helmet-async';

const DOC_ICON_MAP = {
  "fuel-bill": { bg: "#DBEAFE", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="5" y="3" width="14" height="19" rx="2" fill="#BFDBFE"/><rect x="8" y="7" width="8" height="1.5" rx="0.75" fill="#3B82F6"/><rect x="8" y="10.5" width="6" height="1.5" rx="0.75" fill="#3B82F6"/><rect x="8" y="14" width="8" height="1.5" rx="0.75" fill="#3B82F6"/><circle cx="20" cy="19" r="5" fill="#FDE68A"/><path d="M19 17.5l1.5 1.5-1.5 1.5" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 17.5v3" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  "rent-receipt": { bg: "#D1FAE5", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="4" y="5" width="20" height="18" rx="2.5" fill="#A7F3D0"/><path d="M9 10h10M9 14h6" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 17l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  "ld-bill": { bg: "#EDE9FE", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#DDD6FE"/><path d="M8 10h12M8 14h8M8 18h10" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  "restaurant-bill": { bg: "#FCE7F3", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FBCFE8"/><path d="M9 8v5a3 3 0 0 0 6 0V8" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="13" x2="12" y2="20" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/><line x1="18" y1="8" x2="18" y2="20" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  "medical-bill": { bg: "#DCFCE7", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BBF7D0"/><rect x="12" y="8" width="4" height="12" rx="2" fill="#16A34A"/><rect x="8" y="12" width="12" height="4" rx="2" fill="#16A34A"/></svg> },
  "hotel-bill": { bg: "#DBEAFE", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BFDBFE"/><rect x="7" y="12" width="6" height="10" rx="1" fill="#2563EB"/><rect x="15" y="12" width="6" height="10" rx="1" fill="#2563EB"/><rect x="5" y="10" width="18" height="3" rx="1" fill="#3B82F6"/><rect x="11" y="6" width="6" height="4" rx="1" fill="#60A5FA"/></svg> },
  "electricity-bill": { bg: "#FEF3C7", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FDE68A"/><polygon points="16,4 9,15 14,15 12,24 19,13 14,13" fill="#D97706"/></svg> },
  "vehicle-expense": { bg: "#E0F2FE", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BAE6FD"/><rect x="5" y="11" width="18" height="8" rx="2" fill="#0284C7"/><rect x="8" y="8" width="12" height="5" rx="1.5" fill="#38BDF8"/><circle cx="9" cy="20" r="2" fill="#0369A1"/><circle cx="19" cy="20" r="2" fill="#0369A1"/></svg> },
  "travel-expense": { bg: "#EDE9FE", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#DDD6FE"/><path d="M14 6l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" fill="#7C3AED"/></svg> },
  "roi-calculator": { bg: "#FEF3C7", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FDE68A"/><path d="M7 18l4-5 4 3 5-7" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="21" cy="9" r="2" fill="#F59E0B"/></svg> },
  "gst-invoice": { bg: "#EDE9FE", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="4" y="3" width="20" height="22" rx="2.5" fill="#DDD6FE"/><rect x="7" y="7" width="14" height="2" rx="1" fill="#7C3AED"/><rect x="7" y="11" width="9" height="1.5" rx="0.75" fill="#A78BFA"/><rect x="7" y="14" width="11" height="1.5" rx="0.75" fill="#A78BFA"/><rect x="7" y="17" width="7" height="1.5" rx="0.75" fill="#A78BFA"/><rect x="15" y="20" width="6" height="2" rx="1" fill="#7C3AED"/></svg> },
  "salary-slip": { bg: "#FCE7F3", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="6" width="22" height="16" rx="2.5" fill="#FBCFE8"/><circle cx="10" cy="14" r="4" fill="#F9A8D4"/><path d="M9 14h2M10 13v2" stroke="#DB2777" strokeWidth="1.3" strokeLinecap="round"/><rect x="16" y="11" width="6" height="1.5" rx="0.75" fill="#F9A8D4"/><rect x="16" y="14" width="4" height="1.5" rx="0.75" fill="#F9A8D4"/></svg> },
  "eway-bill": { bg: "#DBEAFE", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BFDBFE"/><rect x="5" y="11" width="18" height="8" rx="2" fill="#2563EB"/><rect x="8" y="8" width="12" height="5" rx="1.5" fill="#60A5FA"/><circle cx="9" cy="20" r="2" fill="#1D4ED8"/><circle cx="19" cy="20" r="2" fill="#1D4ED8"/></svg> },
  "e-invoice": { bg: "#CFFAFE", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="6" width="22" height="16" rx="2.5" fill="#A5F3FC"/><path d="M3 10l11 7 11-7" stroke="#0891B2" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  "quotation": { bg: "#D1FAE5", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="4" y="3" width="20" height="22" rx="2.5" fill="#A7F3D0"/><rect x="7" y="7" width="14" height="2" rx="1" fill="#059669"/><rect x="7" y="11" width="10" height="1.5" rx="0.75" fill="#6EE7B7"/><rect x="7" y="14" width="12" height="1.5" rx="0.75" fill="#6EE7B7"/><rect x="7" y="17" width="8" height="1.5" rx="0.75" fill="#6EE7B7"/></svg> },
  "service-invoice": { bg: "#FEF3C7", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FDE68A"/><circle cx="14" cy="14" r="5" fill="#F59E0B" opacity="0.4"/><circle cx="14" cy="14" r="2" fill="#D97706"/><path d="M14 7v2M14 19v2M7 14h2M19 14h2" stroke="#D97706" strokeWidth="1.3" strokeLinecap="round"/></svg> },
  "freelancer-invoice": { bg: "#DBEAFE", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="5" width="22" height="18" rx="2.5" fill="#BFDBFE"/><rect x="6" y="9" width="16" height="2" rx="1" fill="#3B82F6"/><rect x="6" y="13" width="10" height="1.5" rx="0.75" fill="#93C5FD"/><rect x="6" y="16" width="12" height="1.5" rx="0.75" fill="#93C5FD"/></svg> },
  "invoice": { bg: "#EEF2FF", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="4" y="3" width="20" height="22" rx="2.5" fill="#C7D2FE"/><rect x="7" y="7" width="14" height="2" rx="1" fill="#4F46E5"/><rect x="7" y="11" width="9" height="1.5" rx="0.75" fill="#818CF8"/><rect x="7" y="14" width="11" height="1.5" rx="0.75" fill="#818CF8"/><rect x="15" y="20" width="6" height="2" rx="1" fill="#4F46E5"/></svg> },
  "book-invoice": { bg: "#FEF3C7", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><path d="M5 5a2 2 0 0 1 2-2h9v22H7a2 2 0 0 1-2-2V5z" fill="#FDE68A"/><path d="M16 3h5a2 2 0 0 1 2 2v18a2 2 0 0 1-2 2h-5V3z" fill="#FCD34D"/><rect x="8" y="7" width="6" height="1.4" rx="0.7" fill="#D97706"/><rect x="8" y="10" width="5" height="1.4" rx="0.7" fill="#D97706"/></svg> },
  "mobile-bill": { bg: "#FCE7F3", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="8" y="2" width="12" height="24" rx="2.5" fill="#FBCFE8"/><rect x="10.5" y="5" width="7" height="14" rx="0.8" fill="#fff"/><circle cx="14" cy="22" r="1.4" fill="#DB2777"/></svg> },
  "gst-calculator": { bg: "#CCFBF1", svg: <svg width="24" height="24" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#5EEAD4"/><rect x="7" y="7" width="14" height="5" rx="1" fill="#0F766E"/><rect x="7" y="15" width="4" height="4" rx="1" fill="#0F766E"/><rect x="13" y="15" width="4" height="4" rx="1" fill="#0F766E"/><rect x="19" y="15" width="4" height="4" rx="1" fill="#0F766E"/><rect x="7" y="20" width="4" height="3" rx="1" fill="#0F766E"/><rect x="13" y="20" width="4" height="3" rx="1" fill="#0F766E"/><rect x="19" y="20" width="4" height="3" rx="1" fill="#0F766E"/></svg> },
};

const stats = [
  { value: "100%", label: "Free to start" },
  { value: "15+", label: "Tools live" },
  { value: "₹0", label: "Cost to use" },
  { value: "50+", label: "Tools in roadmap" },
];

export default function Home() {
  const [retailDocs, setRetailDocs] = useState(FALLBACK_RETAIL);
  const [businessDocs, setBusinessDocs] = useState(FALLBACK_BUSINESS);

  useEffect(() => {
    fetchDocuments().then(data => {
      if (!data?.length) return;
      setRetailDocs(data.filter(d => d.category === "retail"));
      setBusinessDocs(data.filter(d => d.category === "business"));
    });
  }, []);

  return (
    <>
      <Helmet>
        <title>OpsTools — Free Business Document Generator for India</title>
        <meta name="description" content="Free online document generators and calculators for Indian small businesses. Fuel bills, rent receipts, GST invoices, salary slips, ROI calculator — no login, no cost, instant results." />
        <link rel="canonical" href="https://www.opstools.ai/" />
      </Helmet>
      <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
        <style>{`
          .hero-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 48px; align-items: center; }
          .hero-cards { display: block; }
          .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); }
          @media (max-width: 768px) {
            .hero-grid { grid-template-columns: 1fr !important; gap: 36px !important; }
            .hero-cards { display: none !important; }
            .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
            .hero-section { padding: 44px 20px 40px !important; }
            .why-grid { grid-template-columns: 1fr 1fr !important; }
          }
          @media (max-width: 480px) { .why-grid { grid-template-columns: 1fr !important; } }
        `}</style>

        {/* Hero */}
        <section className="hero-section" style={{ background: "linear-gradient(160deg, #07011F 0%, #0D0630 55%, #1e1b4b 100%)", padding: "72px 24px 64px", overflow: "hidden" }}>
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <div className="hero-grid">
              <div>
                <span style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(99,102,241,0.18)", border: "1px solid rgba(99,102,241,0.35)", color: "#A5B4FC", fontSize: 11, fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 12px", borderRadius: 999, marginBottom: 24 }}>
                  <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#818CF8", display: "inline-block" }} />
                  Free · No sign-up · India-ready
                </span>
                <h1 style={{ fontSize: "clamp(26px, 3.5vw, 46px)", fontWeight: 800, color: "#fff", lineHeight: 1.12, margin: "0 0 18px", letterSpacing: "-0.025em" }}>
                  Professional documents,{" "}
                  <span style={{ background: "linear-gradient(90deg, #60A5FA, #818CF8)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>ready in seconds</span>
                </h1>
                <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 32px", maxWidth: 440 }}>
                  Fuel bills, rent receipts, GST invoices — filled and downloaded without a single login or rupee spent.
                </p>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 32 }}>
                  <Link to="/documents/fuel-bill" style={{ background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)", color: "#fff", padding: "13px 26px", borderRadius: 10, fontWeight: 600, fontSize: 15, textDecoration: "none", display: "inline-block" }}>Generate a fuel bill →</Link>
                  <a href="#tools" style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.14)", color: "#CBD5E1", padding: "13px 26px", borderRadius: 10, fontWeight: 500, fontSize: 15, textDecoration: "none", display: "inline-block" }}>Browse all tools</a>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
                  {[{ icon: "🔒", text: "No data stored" }, { icon: "⚡", text: "Instant PDF" }, { icon: "🇮🇳", text: "India-specific formats" }].map(t => (
                    <div key={t.text} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#94A3B8" }}>
                      <span>{t.icon}</span><span>{t.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="hero-cards" style={{ position: "relative", height: 320, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {/* Card text below was #94A3B8 on a white (#fff) card background — that
                    combination only reaches ~2.56:1 contrast, well short of the 4.5:1
                    WCAG AA minimum for normal-size text. Switched to #64748B (~4.76:1),
                    a color already used elsewhere in this exact role throughout the
                    site, so this brings these cards in line with everything else
                    rather than introducing a new shade. */}
                <div style={{ position: "absolute", left: "5%", top: "10%", background: "#fff", borderRadius: 14, padding: "16px 18px", width: 210, boxShadow: "0 20px 60px rgba(0,0,0,0.35)", zIndex: 3 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#DBEAFE", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⛽</div>
                    <div><div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>Fuel Bill</div><div style={{ fontSize: 10, color: "#64748B" }}>PK Fuel Station</div></div>
                  </div>
                  <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 10 }}>
                    {[["Fuel Type", "Petrol"], ["Rate/Litre", "₹104.29"], ["Volume", "9.52 L"], ["Amount", "₹992.00"]].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5 }}>
                        <span style={{ color: "#64748B" }}>{k}</span><span style={{ fontWeight: 600, color: "#0F172A" }}>{v}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop: 10, background: "#DBEAFE", borderRadius: 6, padding: "4px 8px", display: "inline-flex", alignItems: "center", gap: 4 }}>
                    <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#1D4ED8", display: "inline-block" }} />
                    {/* #2563EB on this light-blue chip measured ~4.24:1 — just under
                        the 4.5:1 threshold. #1D4ED8 (already used elsewhere, e.g. the
                        e-way-bill icon) passes at ~5.49:1. */}
                    <span style={{ fontSize: 10, fontWeight: 700, color: "#1D4ED8" }}>Live</span>
                  </div>
                </div>
                <div style={{ position: "absolute", right: "2%", top: "5%", background: "#fff", borderRadius: 14, padding: "16px 18px", width: 196, boxShadow: "0 20px 60px rgba(0,0,0,0.3)", zIndex: 2 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
                    <div style={{ width: 32, height: 32, borderRadius: 8, background: "#D1FAE5", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏠</div>
                    <div><div style={{ fontSize: 12, fontWeight: 700, color: "#0F172A" }}>Rent Receipt</div><div style={{ fontSize: 10, color: "#64748B" }}>June 2026</div></div>
                  </div>
                  <div style={{ borderTop: "1px solid #F1F5F9", paddingTop: 10 }}>
                    {[["Tenant", "Rajesh Verma"], ["Rent", "₹18,000"], ["Period", "Jun 2026"], ["PAN", "ABCDE1234F"]].map(([k, v]) => (
                      <div key={k} style={{ display: "flex", justifyContent: "space-between", fontSize: 11, marginBottom: 5 }}>
                        <span style={{ color: "#64748B" }}>{k}</span><span style={{ fontWeight: 600, color: "#0F172A", fontSize: 10 }}>{v}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div style={{ position: "absolute", left: "18%", bottom: "4%", background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, padding: "12px 14px", width: 160, zIndex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 7, background: "rgba(124,58,237,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14 }}>🧾</div>
                    <div><div style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.85)" }}>GST Invoice</div><div style={{ fontSize: 9, color: "rgba(255,255,255,0.5)" }}>15+ tools live</div></div>
                  </div>
                  <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, marginBottom: 4 }} />
                  <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, width: "70%", marginBottom: 4 }} />
                  <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 3, width: "85%" }} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section style={{ background: "#07011F", borderBottom: "1px solid rgba(255,255,255,0.07)", padding: "0 24px" }}>
          <div style={{ maxWidth: 900, margin: "0 auto" }}>
            <div className="stats-grid">
              {stats.map((s, i) => (
                <div key={s.label} style={{ textAlign: "center", padding: "20px 16px", borderRight: i < stats.length - 1 ? "1px solid rgba(255,255,255,0.06)" : "none" }}>
                  <div style={{ fontSize: 28, fontWeight: 800, color: "#fff", lineHeight: 1, letterSpacing: "-0.02em" }}>{s.value}</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 5, fontWeight: 500 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Tools */}
        <section id="tools" style={{ padding: "64px 0 72px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 20px" }}>
            <div style={{ marginBottom: 52, minHeight: 260 }}>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Document Generator</h2>
                <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>Print-ready documents in seconds — no templates to buy, no software to install.</p>
              </div>
              <Carousel docs={retailDocs} />
            </div>
            <div style={{ minHeight: 260 }}>
              <div style={{ marginBottom: 20 }}>
                <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "0 0 4px", letterSpacing: "-0.01em" }}>Business Calculators</h2>
                <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>Quick math for decisions you make every day — margins, ROI, taxes, and more.</p>
              </div>
              <Carousel docs={businessDocs} />
            </div>
          </div>
        </section>

        {/* Why */}
        <section style={{ background: "linear-gradient(135deg, #07011F 0%, #0D0630 100%)", padding: "64px 20px", textAlign: "center" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <div style={{ maxWidth: 640, margin: "0 auto" }}>
              <h2 style={{ fontSize: "clamp(20px, 3vw, 28px)", fontWeight: 700, color: "#fff", margin: "0 0 16px", letterSpacing: "-0.02em" }}>Built for the operator, not the accountant</h2>
              <p style={{ fontSize: 15, color: "#94A3B8", lineHeight: 1.75, margin: "0 0 40px" }}>Most document tools are built for chartered accountants — complex, expensive, and full of fields you don't understand. OpsTools is different.</p>
            </div>
            <div className="why-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 20, textAlign: "left" }}>
              {[
                {
                  title: "Instant",
                  body: "Open the tool, fill it, download. No account, no approval queue, no waiting on anyone.",
                  icon: <path d="M13 3 4 14h6l-1 7 9-11h-6l1-7z" />,
                },
                {
                  title: "Private",
                  body: "Your PDF is generated client-side, in your browser. Nothing you type ever reaches our servers — not even us can see it.",
                  icon: <><rect x="5" y="11" width="14" height="10" rx="2" /><path d="M8 11V7a4 4 0 0 1 8 0v4" /></>,
                },
                {
                  title: "Mobile-ready",
                  body: "Every generator is a responsive web form, not an app to install. Fill it on your phone between customers, download, done.",
                  icon: <><rect x="7" y="2" width="10" height="20" rx="2" /><line x1="11" y1="18" x2="13" y2="18" /></>,
                },
                {
                  title: "India-specific",
                  body: "IOCL/POS-style fuel bills, HRA-compliant rent receipts with landlord PAN, GST invoices with HSN codes — modeled on real Indian paperwork.",
                  icon: <><path d="M6 3h12v18l-3-2-3 2-3-2-3 2z" /><path d="M9 10l2 2 4-4" /></>,
                },
                {
                  title: "Bulk-ready",
                  body: "Need 50 bills for month-end? Upload a CSV and generate them all as one PDF, in a single pass.",
                  icon: <><path d="M12 2 2 7l10 5 10-5-10-5z" /><path d="M2 17l10 5 10-5" /><path d="M2 12l10 5 10-5" /></>,
                },
                {
                  title: "Always free",
                  body: "Every single-document download is free, forever — no card on file, no trial, no catch.",
                  icon: <><path d="M20.6 13.4 12 22l-9-9V4a1 1 0 0 1 1-1h9l9 9a2 2 0 0 1 0 2.83z" /><circle cx="7.5" cy="7.5" r="1.2" fill="currentColor" stroke="none" /></>,
                },
              ].map(f => (
                <div key={f.title} style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.09)", borderRadius: 14, padding: "20px 18px" }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(129,140,248,0.15)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14 }}>
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#A5B4FC" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{f.icon}</svg>
                  </div>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#E2E8F0", marginBottom: 6 }}>{f.title}</div>
                  <div style={{ fontSize: 13, color: "#94A3B8", lineHeight: 1.6 }}>{f.body}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}

// Detects whether the row can scroll further left/right using
// IntersectionObserver on sentinel elements at each end of the scrollable
// content, instead of reading el.scrollLeft/scrollWidth/clientWidth in
// response to scroll/resize events. Reading geometry like that right after
// a DOM change is exactly what Lighthouse flags as a "forced reflow" — it
// forces the browser to synchronously recompute layout instead of waiting
// for its normal render cycle. IntersectionObserver reports visibility
// changes without the caller ever having to query geometry at all, so
// there's nothing to force a reflow with.
function Carousel({ docs }) {
  const scrollRef = useRef(null);
  const startSentinelRef = useRef(null);
  const endSentinelRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const root = scrollRef.current;
    const startEl = startSentinelRef.current;
    const endEl = endSentinelRef.current;
    if (!root || !startEl || !endEl) return;

    const startObserver = new IntersectionObserver(
      ([entry]) => setCanScrollLeft(!entry.isIntersecting),
      { root, threshold: 0.99 }
    );
    const endObserver = new IntersectionObserver(
      ([entry]) => setCanScrollRight(!entry.isIntersecting),
      { root, threshold: 0.99 }
    );
    startObserver.observe(startEl);
    endObserver.observe(endEl);
    return () => { startObserver.disconnect(); endObserver.disconnect(); };
  }, [docs]);

  const scroll = (dir) => {
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: "smooth" });
  };

  return (
    <div style={{ position: "relative" }}>
      {canScrollLeft && (
        <button onClick={() => scroll(-1)} aria-label="Scroll left" style={{ position: "absolute", left: -16, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, borderRadius: "50%", background: "#fff", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"><path d="M15 18l-6-6 6-6"/></svg>
        </button>
      )}
      <div ref={scrollRef} style={{ display: "flex", gap: 14, overflowX: "auto", paddingBottom: 8, scrollbarWidth: "none", msOverflowStyle: "none", minHeight: 200 }}>
        <div ref={startSentinelRef} style={{ width: 1, flexShrink: 0 }} aria-hidden="true" />
        {docs.map(doc => <ToolCard key={doc.slug} doc={doc} />)}
        <div ref={endSentinelRef} style={{ width: 1, flexShrink: 0 }} aria-hidden="true" />
      </div>
      {canScrollRight && (
        <button onClick={() => scroll(1)} aria-label="Scroll right" style={{ position: "absolute", right: -16, top: "50%", transform: "translateY(-50%)", width: 32, height: 32, borderRadius: "50%", background: "#fff", border: "1px solid #E2E8F0", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#374151" strokeWidth="2.5" strokeLinecap="round"><path d="M9 18l6-6-6-6"/></svg>
        </button>
      )}
    </div>
  );
}

function ToolCard({ doc }) {
  const isLive = doc.status === "live" || doc.status === "new";
  const iconData = DOC_ICON_MAP[doc.slug];
  const accentColor = iconData?.bg || "#F1F5F9";
  const inner = (
    <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, padding: "20px 18px", width: 210, height: "100%", boxSizing: "border-box", flexShrink: 0, display: "flex", flexDirection: "column", gap: 12, cursor: isLive ? "pointer" : "default", opacity: isLive ? 1 : 0.72, transition: "box-shadow 0.18s, transform 0.18s" }}
      onMouseEnter={e => { if (isLive) { e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
    >
      <div style={{ width: 48, height: 48, borderRadius: 12, background: accentColor, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {iconData?.svg || <span style={{ fontSize: 22 }}>{doc.icon}</span>}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, fontWeight: 650, color: "#0F172A", marginBottom: 4, lineHeight: 1.3 }}>{doc.name}</div>
        <div style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.5 }}>{doc.description || doc.tagline}</div>
      </div>
      {doc.status === "live" ? (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, color: "#1D4ED8", background: accentColor, padding: "3px 10px", borderRadius: 999, alignSelf: "flex-start" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#1D4ED8", display: "inline-block" }} />Live
        </div>
      ) : doc.status === "new" ? (
        <div style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: 11.5, fontWeight: 600, color: "#059669", background: "#ECFDF5", padding: "3px 10px", borderRadius: 999, alignSelf: "flex-start" }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#10B981", display: "inline-block" }} />New
        </div>
      ) : (
        <div style={{ display: "inline-flex", alignItems: "center", fontSize: 11.5, fontWeight: 600, color: "#94A3B8", background: "#F1F5F9", padding: "3px 10px", borderRadius: 999, alignSelf: "flex-start" }}>Coming soon</div>
      )}
    </div>
  );
  return isLive ? <Link to={doc.href} style={{ textDecoration: "none", display: "block", flexShrink: 0 }}>{inner}</Link> : <div style={{ flexShrink: 0 }}>{inner}</div>;
}

const FALLBACK_RETAIL = [
  { slug: "fuel-bill", name: "Fuel Bill", href: "/documents/fuel-bill", description: "IOCL, POS & thermal receipt formats", bundle: "Transport Suite", status: "live" },
  { slug: "rent-receipt", name: "Rent Receipt", href: "/documents/rent-receipt", description: "HRA-compliant receipts for tenants", bundle: "Housing Suite", status: "live" },
  { slug: "ld-bill", name: "L&D Bill", href: "/documents/ld-bill", description: "Tax invoices for training & courses", bundle: "Education Suite", status: "live" },
  { slug: "gst-invoice", name: "GST Invoice", href: "/documents/gst-invoice", description: "Tax-compliant GST invoices with HSN codes", bundle: "GST Suite", status: "live" },
  { slug: "salary-slip", name: "Salary Slip", href: "/documents/salary-slip", description: "Payslips with CTC, deductions & net pay", bundle: "HR Suite", status: "live" },
  { slug: "restaurant-bill", name: "Restaurant Bill", href: "/documents/restaurant-bill", description: "Restaurant bills and food receipts", bundle: "Food Suite", status: "new" },
  { slug: "medical-bill", name: "Medical Bill", href: "/documents/medical-bill", description: "Medical & pharmacy expense receipts", bundle: "Healthcare Suite", status: "new" },
  { slug: "hotel-bill", name: "Hotel Bill", href: "/documents/hotel-bill", description: "Hotel stay receipts for reimbursement", bundle: "Hospitality Suite", status: "new" },
  { slug: "electricity-bill", name: "Electricity Bill", href: "/documents/electricity-bill", description: "Utility bills for expense claims", bundle: "Utility Suite", status: "new" },
  { slug: "invoice", name: "Invoice Generator", href: "/documents/invoice", description: "Professional invoices with line items", bundle: "Invoice Suite", status: "new" },
  { slug: "quotation", name: "Quotation Generator", href: "/documents/quotation", description: "Price quotes with validity and terms", bundle: "Invoice Suite", status: "new" },
  { slug: "freelancer-invoice", name: "Freelancer Invoice", href: "/documents/freelancer-invoice", description: "Hourly & fixed price invoices", bundle: "Freelancer Suite", status: "new" },
  { slug: "vehicle-expense", name: "Vehicle Expense", href: "#", description: "Vehicle maintenance & fuel expense report", bundle: "Transport Suite", status: "soon" },
  { slug: "travel-expense", name: "Travel Expense", href: "#", description: "Business travel expense summary", bundle: "Transport Suite", status: "soon" },
];

const FALLBACK_BUSINESS = [
  { slug: "roi-calculator", name: "ROI Calculator", href: "/business/roi-calculator", description: "Measure returns on any investment", bundle: "Finance Suite", status: "live" },
  { slug: "gst-invoice", name: "GST Invoice", href: "/documents/gst-invoice", description: "Tax-compliant invoices with GSTIN", bundle: "GST Suite", status: "live" },
  { slug: "salary-slip", name: "Salary Slip", href: "/documents/salary-slip", description: "Professional payslips with deductions", bundle: "HR Suite", status: "live" },
  { slug: "eway-bill", name: "E-Way Bill", href: "/documents/eway-bill", description: "GST e-way bill reference document", bundle: "GST Suite", status: "new" },
  { slug: "e-invoice", name: "E-Invoice", href: "/documents/e-invoice", description: "GST e-invoice with IRN", bundle: "GST Suite", status: "new" },
  { slug: "service-invoice", name: "Service Invoice", href: "/documents/service-invoice", description: "Invoices for service-based businesses", bundle: "Service Suite", status: "new" },
  { slug: "quotation", name: "Quotation", href: "/documents/quotation", description: "Professional business quotations", bundle: "Invoice Suite", status: "new" },
  { slug: "freelancer-invoice", name: "Freelancer Invoice", href: "/documents/freelancer-invoice", description: "Invoices for freelancers & consultants", bundle: "Freelancer Suite", status: "new" },
];
