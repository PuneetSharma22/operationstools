import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase-public";

function OpsToolsLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="url(#logoGrad)"/>
      <rect x="7" y="7" width="4" height="4" rx="1" fill="white"/>
      <rect x="14" y="7" width="4" height="4" rx="1" fill="white" opacity="0.7"/>
      <rect x="21" y="7" width="4" height="4" rx="1" fill="white" opacity="0.35"/>
      <rect x="7" y="14" width="4" height="4" rx="1" fill="white" opacity="0.7"/>
      <rect x="14" y="14" width="4" height="4" rx="1" fill="white"/>
      <rect x="21" y="14" width="4" height="4" rx="1" fill="white" opacity="0.7"/>
      <rect x="7" y="21" width="4" height="4" rx="1" fill="white" opacity="0.35"/>
      <rect x="14" y="21" width="4" height="4" rx="1" fill="white" opacity="0.7"/>
      <rect x="21" y="21" width="4" height="4" rx="1" fill="white"/>
      <defs>
        <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB"/>
          <stop offset="100%" stopColor="#4F46E5"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

const DOC_ICON_MAP = {
  "fuel-bill": { bg: "#DBEAFE", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="5" y="3" width="14" height="19" rx="2" fill="#BFDBFE"/><rect x="8" y="7" width="8" height="1.5" rx="0.75" fill="#3B82F6"/><rect x="8" y="10.5" width="6" height="1.5" rx="0.75" fill="#3B82F6"/><rect x="8" y="14" width="8" height="1.5" rx="0.75" fill="#3B82F6"/><circle cx="20" cy="19" r="5" fill="#FDE68A"/><path d="M19 17.5l1.5 1.5-1.5 1.5" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 17.5v3" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  "ld-bill": { bg: "#EDE9FE", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#DDD6FE"/><path d="M8 10h12M8 14h8M8 18h10" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  "rent-receipt": { bg: "#D1FAE5", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="4" y="5" width="20" height="18" rx="2.5" fill="#A7F3D0"/><path d="M9 10h10M9 14h6" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 17l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  "restaurant-bill": { bg: "#FCE7F3", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FBCFE8"/><path d="M9 8v5a3 3 0 0 0 6 0V8" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/><line x1="12" y1="13" x2="12" y2="20" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/><line x1="18" y1="8" x2="18" y2="20" stroke="#DB2777" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  "medical-bill": { bg: "#DCFCE7", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BBF7D0"/><rect x="12" y="8" width="4" height="12" rx="2" fill="#16A34A"/><rect x="8" y="12" width="12" height="4" rx="2" fill="#16A34A"/></svg> },
  "hotel-bill": { bg: "#DBEAFE", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BFDBFE"/><rect x="7" y="12" width="6" height="10" rx="1" fill="#2563EB"/><rect x="15" y="12" width="6" height="10" rx="1" fill="#2563EB"/><rect x="5" y="10" width="18" height="3" rx="1" fill="#3B82F6"/><rect x="11" y="6" width="6" height="4" rx="1" fill="#60A5FA"/></svg> },
  "electricity-bill": { bg: "#FEF3C7", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FDE68A"/><polygon points="16,4 9,15 14,15 12,24 19,13 14,13" fill="#D97706"/></svg> },
  "vehicle-expense": { bg: "#E0F2FE", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BAE6FD"/><rect x="5" y="11" width="18" height="8" rx="2" fill="#0284C7"/><rect x="8" y="8" width="12" height="5" rx="1.5" fill="#38BDF8"/><circle cx="9" cy="20" r="2" fill="#0369A1"/><circle cx="19" cy="20" r="2" fill="#0369A1"/></svg> },
  "travel-expense": { bg: "#EDE9FE", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#DDD6FE"/><path d="M14 6l2 4h4l-3 3 1 4-4-2-4 2 1-4-3-3h4z" fill="#7C3AED"/></svg> },
  "roi-calculator": { bg: "#FEF3C7", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FDE68A"/><path d="M7 18l4-5 4 3 5-7" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/><circle cx="21" cy="9" r="2" fill="#F59E0B"/></svg> },
  "gst-invoice": { bg: "#EDE9FE", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="4" y="3" width="20" height="22" rx="2.5" fill="#DDD6FE"/><rect x="7" y="7" width="14" height="2" rx="1" fill="#7C3AED"/><rect x="7" y="11" width="9" height="1.5" rx="0.75" fill="#A78BFA"/><rect x="7" y="14" width="11" height="1.5" rx="0.75" fill="#A78BFA"/><rect x="15" y="20" width="6" height="2" rx="1" fill="#7C3AED"/></svg> },
  "eway-bill": { bg: "#DBEAFE", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BFDBFE"/><rect x="5" y="11" width="18" height="8" rx="2" fill="#2563EB"/><rect x="8" y="8" width="12" height="5" rx="1.5" fill="#60A5FA"/><circle cx="9" cy="20" r="2" fill="#1D4ED8"/><circle cx="19" cy="20" r="2" fill="#1D4ED8"/></svg> },
  "tax-invoice": { bg: "#FCE7F3", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="4" y="3" width="20" height="22" rx="2.5" fill="#FBCFE8"/><rect x="7" y="7" width="14" height="2" rx="1" fill="#DB2777"/><rect x="7" y="11" width="9" height="1.5" rx="0.75" fill="#F9A8D4"/><rect x="7" y="14" width="11" height="1.5" rx="0.75" fill="#F9A8D4"/><rect x="15" y="19" width="6" height="3" rx="1" fill="#DB2777"/></svg> },
  "e-invoice": { bg: "#CFFAFE", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="6" width="22" height="16" rx="2.5" fill="#A5F3FC"/><path d="M3 10l11 7 11-7" stroke="#0891B2" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  "salary-slip": { bg: "#FCE7F3", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="6" width="22" height="16" rx="2.5" fill="#FBCFE8"/><circle cx="10" cy="14" r="4" fill="#F9A8D4"/><rect x="16" y="11" width="6" height="1.5" rx="0.75" fill="#F9A8D4"/><rect x="16" y="14" width="4" height="1.5" rx="0.75" fill="#F9A8D4"/></svg> },
  "quotation": { bg: "#D1FAE5", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="4" y="3" width="20" height="22" rx="2.5" fill="#A7F3D0"/><rect x="7" y="7" width="14" height="2" rx="1" fill="#059669"/><rect x="7" y="11" width="10" height="1.5" rx="0.75" fill="#6EE7B7"/><rect x="7" y="14" width="12" height="1.5" rx="0.75" fill="#6EE7B7"/></svg> },
  "service-invoice": { bg: "#FEF3C7", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#FDE68A"/><circle cx="14" cy="14" r="5" fill="#F59E0B" opacity="0.4"/><circle cx="14" cy="14" r="2" fill="#D97706"/></svg> },
  "freelancer-invoice": { bg: "#DBEAFE", svg: <svg width="22" height="22" viewBox="0 0 28 28" fill="none"><rect x="3" y="5" width="22" height="18" rx="2.5" fill="#BFDBFE"/><rect x="6" y="9" width="16" height="2" rx="1" fill="#3B82F6"/><rect x="6" y="13" width="10" height="1.5" rx="0.75" fill="#93C5FD"/><circle cx="21" cy="8" r="4" fill="#2563EB"/><path d="M19.5 8l1 1 2-2" stroke="white" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
};

function MobileDrawer({ open, onClose, retailDocs, businessDocs, user, credits, signOut }) {
  const [expanded, setExpanded] = useState(null);
  if (!open) return null;
  const sections = [
    { key: "retail", label: "Retail", docs: retailDocs },
    { key: "business", label: "Business", docs: businessDocs },
  ];
  return (
    <>
      <div onClick={onClose} aria-hidden="true" style={{ position: "fixed", inset: 0, zIndex: 300, background: "rgba(0,0,0,0.5)", animation: "fadeIn 0.15s ease" }} />
      <div role="dialog" aria-modal="true" aria-label="Navigation menu" style={{ position: "fixed", top: 0, left: 0, bottom: 0, width: "min(320px, 85vw)", background: "#07011F", zIndex: 301, overflowY: "auto", animation: "slideInLeft 0.2s cubic-bezier(0.16,1,0.3,1)", display: "flex", flexDirection: "column" }}>
        <style>{`
          @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
          @keyframes slideInLeft { from { transform: translateX(-100%) } to { transform: translateX(0) } }
          .drawer-item:hover { background: rgba(255,255,255,0.06) !important; }
          .drawer-doc-item:active { background: rgba(255,255,255,0.08) !important; }
        `}</style>
        {/* Drawer header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0 20px", height: 64, flexShrink: 0, borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <OpsToolsLogo />
            <span style={{ fontWeight: 700, color: "#fff", fontSize: 16 }}>OpsTools</span>
          </div>
          {/* ✅ aria-label added */}
          <button onClick={onClose} aria-label="Close menu" style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "rgba(255,255,255,0.7)" }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6 6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>
        {/* Nav sections */}
        <div style={{ flex: 1, padding: "12px 0" }}>
          {sections.map(({ key, label, docs }) => (
            <div key={key}>
              <button
                onClick={() => setExpanded(expanded === key ? null : key)}
                aria-expanded={expanded === key}
                aria-label={`${label} documents`}
                className="drawer-item"
                style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 20px", background: "transparent", border: "none", cursor: "pointer", transition: "background 0.12s" }}
              >
                <span style={{ fontSize: 15, fontWeight: 600, color: "#fff" }}>{label}</span>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5"
                  style={{ transition: "transform 0.2s", transform: expanded === key ? "rotate(180deg)" : "rotate(0deg)" }}>
                  <path d="m6 9 6 6 6-6"/>
                </svg>
              </button>
              {expanded === key && (
                <div style={{ padding: "4px 0 8px 0" }}>
                  {docs.map((doc) => {
                    const iconData = DOC_ICON_MAP[doc.slug];
                    const inner = (
                      <div className="drawer-doc-item" style={{ display: "flex", alignItems: "center", gap: 12, padding: "10px 20px", transition: "background 0.12s", opacity: doc.status === "soon" ? 0.5 : 1 }}>
                        <div style={{ width: 36, height: 36, borderRadius: 9, flexShrink: 0, background: iconData?.bg || "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          {iconData?.svg}
                        </div>
                        <div>
                          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <span style={{ fontSize: 14, fontWeight: 600, color: doc.status === "live" ? "#fff" : "rgba(255,255,255,0.55)" }}>{doc.name}</span>
                            {doc.status === "soon" && <span style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", background: "rgba(255,255,255,0.08)", padding: "1px 6px", borderRadius: 999 }}>SOON</span>}
                          </div>
                          {/* ✅ contrast: 0.35 → 0.6 */}
                          <p style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: 1.4 }}>{doc.description}</p>
                        </div>
                      </div>
                    );
                    return doc.status === "live" ? (
                      <Link key={doc.slug} to={doc.href} onClick={onClose} style={{ textDecoration: "none", display: "block" }}>{inner}</Link>
                    ) : <div key={doc.slug}>{inner}</div>;
                  })}
                </div>
              )}
            </div>
          ))}
          <div style={{ height: 1, background: "rgba(255,255,255,0.08)", margin: "8px 0" }} />
          {user ? (
            <div style={{ padding: "8px 20px" }}>
              <div style={{ padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: 8 }}>
                {/* ✅ contrast: 0.3 → 0.55 */}
                <p style={{ fontSize: 11, color: "rgba(255,255,255,0.55)", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px" }}>Signed in as</p>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.8)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
              </div>
              <Link to="/account" onClick={onClose} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", fontSize: 14, color: "rgba(255,255,255,0.75)", textDecoration: "none" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
                My Account
              </Link>
              <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                {credits === null ? "—" : credits.toLocaleString()} credits
              </div>
              <button onClick={async () => { await signOut(); onClose(); }} aria-label="Sign out" style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 0", fontSize: 14, color: "#F87171", background: "none", border: "none", cursor: "pointer", width: "100%" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F87171" strokeWidth="2.5" strokeLinecap="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                Sign out
              </button>
            </div>
          ) : (
            <div style={{ padding: "12px 20px", display: "flex", flexDirection: "column", gap: 10 }}>
              <Link to="/login" onClick={onClose} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 44, borderRadius: 10, border: "1px solid rgba(255,255,255,0.2)", fontSize: 15, fontWeight: 500, color: "rgba(255,255,255,0.85)", textDecoration: "none" }}>Log in</Link>
              <Link to="/signup" onClick={onClose} style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 44, borderRadius: 10, background: "linear-gradient(135deg,#2563EB,#4F46E5)", fontSize: 15, fontWeight: 600, color: "#fff", textDecoration: "none" }}>Sign up</Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

function MegaDropdown({ docs, onClose }) {
  const groups = docs.reduce((acc, doc) => {
    const key = doc.bundle || "Other";
    if (!acc[key]) acc[key] = [];
    acc[key].push(doc);
    return acc;
  }, {});
  const cols = Object.keys(groups).length <= 2 ? 2 : 3;
  return (
    <div style={{ position: "fixed", top: 64, left: "50%", transform: "translateX(-50%)", minWidth: cols === 3 ? 700 : 480, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, boxShadow: "0 16px 48px rgba(0,0,0,0.12), 0 4px 12px rgba(0,0,0,0.06)", padding: "24px 20px", zIndex: 200, animation: "megaIn 0.15s cubic-bezier(0.16,1,0.3,1)" }}>
      <style>{`
        @keyframes megaIn { from { opacity: 0; transform: translateX(-50%) translateY(-4px) scale(0.98); } to { opacity: 1; transform: translateX(-50%) translateY(0) scale(1); } }
        .nav-doc-item:hover { background: #F8FAFC !important; }
      `}</style>
      <div style={{ display: "grid", gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: "0 28px" }}>
        {Object.entries(groups).map(([bundle, items]) => (
          <div key={bundle} style={{ marginBottom: 8 }}>
            <p style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.12em", margin: "0 0 8px 4px" }}>{bundle.replace(" Suite", "")}</p>
            {items.map((doc) => {
              const iconData = DOC_ICON_MAP[doc.slug];
              const item = (
                <div className="nav-doc-item" style={{ display: "flex", alignItems: "center", gap: 12, padding: "8px 8px", borderRadius: 10, background: "transparent", transition: "background 0.12s", cursor: doc.status === "live" ? "pointer" : "default", marginBottom: 2 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 10, flexShrink: 0, background: iconData?.bg || "#F1F5F9", display: "flex", alignItems: "center", justifyContent: "center", opacity: doc.status === "soon" ? 0.55 : 1 }}>
                    {iconData?.svg || <span style={{ fontSize: 18 }}>{doc.icon}</span>}
                  </div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: doc.status === "live" ? "#0F172A" : "#94A3B8", whiteSpace: "nowrap" }}>{doc.name}</span>
                      {doc.status === "soon" && <span style={{ fontSize: 9, fontWeight: 700, color: "#94A3B8", background: "#F1F5F9", padding: "1px 6px", borderRadius: 999, letterSpacing: "0.05em", flexShrink: 0 }}>SOON</span>}
                    </div>
                    <p style={{ fontSize: 11.5, color: "#94A3B8", margin: 0, lineHeight: 1.35, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: 180 }}>{doc.description}</p>
                  </div>
                </div>
              );
              return doc.status === "live" ? (
                <Link key={doc.slug} to={doc.href} onClick={onClose} style={{ textDecoration: "none", display: "block" }}>{item}</Link>
              ) : <div key={doc.slug}>{item}</div>;
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function TopHeader() {
  const [openMenu, setOpenMenu] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [credits, setCredits] = useState(null);
  const [retailDocs, setRetailDocs] = useState(FALLBACK_RETAIL);
  const [businessDocs, setBusinessDocs] = useState(FALLBACK_BUSINESS);
  const location = useLocation();
  const { user, signOut } = useAuth();
  const creditsFetchedRef = useRef(false);

  useEffect(() => {
    supabase.from("documents").select("*").order("sort_order", { ascending: true })
      .then(({ data, error }) => {
        if (error || !data?.length) return;
        setRetailDocs(data.filter(d => d.category === "retail"));
        setBusinessDocs(data.filter(d => d.category === "business"));
      });
  }, []);

  useEffect(() => {
    if (!user) { setCredits(null); creditsFetchedRef.current = false; return; }
    if (creditsFetchedRef.current) return;
    creditsFetchedRef.current = true;
    supabase.from("user_credits").select("balance").eq("user_id", user.id).maybeSingle()
      .then(({ data }) => setCredits(data?.balance ?? 0));
  }, [user]);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  const closeAll = () => { setOpenMenu(null); setShowUserMenu(false); };

  const NAV_ITEMS = [
    { label: "Retail", key: "retail", docs: retailDocs },
    { label: "Business", key: "business", docs: businessDocs },
  ];

  return (
    <>
      <header style={{ background: "#07011F", borderBottom: "1px solid rgba(255,255,255,0.08)", position: "sticky", top: 0, zIndex: 50 }} className="no-print">
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px", height: 64, display: "flex", alignItems: "center", gap: 8 }}>

          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none", flexShrink: 0 }} onClick={closeAll} aria-label="OpsTools home">
            <OpsToolsLogo />
            <span style={{ fontWeight: 700, color: "#fff", fontSize: 16, letterSpacing: "-0.01em" }}>OpsTools</span>
          </Link>

          <nav aria-label="Main navigation" className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 4, flex: 1 }}>
            {NAV_ITEMS.map((item) => (
              <div key={item.key} style={{ position: "relative" }}>
                <button
                  onClick={() => setOpenMenu(openMenu === item.key ? null : item.key)}
                  aria-expanded={openMenu === item.key}
                  aria-haspopup="true"
                  style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "0 14px", height: 36, borderRadius: 8, fontSize: 14, fontWeight: 500, cursor: "pointer", border: "none", background: openMenu === item.key ? "rgba(255,255,255,0.1)" : "transparent", color: openMenu === item.key ? "#fff" : "rgba(255,255,255,0.75)", transition: "color 0.15s, background 0.15s" }}
                  onMouseEnter={e => { if (openMenu !== item.key) { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.06)"; }}}
                  onMouseLeave={e => { if (openMenu !== item.key) { e.currentTarget.style.color = "rgba(255,255,255,0.75)"; e.currentTarget.style.background = "transparent"; }}}
                >
                  {item.label}
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transition: "transform 0.2s", transform: openMenu === item.key ? "rotate(180deg)" : "rotate(0deg)" }}>
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                </button>
                {openMenu === item.key && item.docs.length > 0 && <MegaDropdown docs={item.docs} onClose={closeAll} />}
              </div>
            ))}
          </nav>

          <div className="desktop-nav" style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0, marginLeft: "auto" }}>
            {user ? (
              <>
                <Link to="/account" aria-label="View credits" style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "0 12px", height: 32, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8, textDecoration: "none" }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.7)" }}>{credits === null ? "—" : credits.toLocaleString()} credits</span>
                </Link>
                <div style={{ position: "relative" }}>
                  {/* ✅ aria-label added */}
                  <button onClick={() => setShowUserMenu(!showUserMenu)} aria-label="User menu" aria-expanded={showUserMenu} style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "0 12px", height: 36, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 10, cursor: "pointer" }}>
                    <div style={{ width: 20, height: 20, borderRadius: "50%", background: "linear-gradient(135deg,#2563EB,#4F46E5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#fff" }}>
                      {user.email[0].toUpperCase()}
                    </div>
                    <span style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", maxWidth: 120, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
                  </button>
                  {showUserMenu && (
                    <div style={{ position: "fixed", top: 64, right: 24, width: 210, background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, boxShadow: "0 12px 40px rgba(0,0,0,0.12)", overflow: "hidden", zIndex: 200, animation: "megaIn 0.15s cubic-bezier(0.16,1,0.3,1)" }}>
                      <div style={{ padding: "12px 16px", borderBottom: "1px solid #F1F5F9" }}>
                        <p style={{ fontSize: 11, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 3px" }}>Signed in as</p>
                        <p style={{ fontSize: 13, color: "#0F172A", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
                      </div>
                      {[
                        { to: "/account", label: "My Account", icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg> },
                        { to: "/account", label: `${credits === null ? "—" : credits.toLocaleString()} credits`, icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#64748B" strokeWidth="2.5" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg> },
                      ].map(({ to, label, icon }) => (
                        <Link key={label} to={to} onClick={closeAll} style={{ display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", fontSize: 14, color: "#374151", textDecoration: "none" }}
                          onMouseEnter={e => e.currentTarget.style.background = "#F8FAFC"}
                          onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                        >{icon}{label}</Link>
                      ))}
                      <div style={{ borderTop: "1px solid #F1F5F9" }} />
                      <button onClick={async () => { await signOut(); closeAll(); }} aria-label="Sign out" style={{ width: "100%", display: "flex", alignItems: "center", gap: 10, padding: "11px 16px", fontSize: 14, color: "#DC2626", background: "none", border: "none", cursor: "pointer" }}
                        onMouseEnter={e => e.currentTarget.style.background = "#FEF2F2"}
                        onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                        Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "0 12px", height: 32, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                  <span style={{ fontSize: 12, fontWeight: 500, color: "rgba(255,255,255,0.6)" }}>Guest · 0 credits</span>
                </div>
                <div style={{ width: 1, height: 18, background: "rgba(255,255,255,0.1)" }} />
                <Link to="/login" style={{ display: "inline-flex", alignItems: "center", height: 36, padding: "0 16px", fontSize: 14, fontWeight: 500, color: "rgba(255,255,255,0.75)", textDecoration: "none", borderRadius: 8 }}
                  onMouseEnter={e => { e.currentTarget.style.color = "#fff"; e.currentTarget.style.background = "rgba(255,255,255,0.07)"; }}
                  onMouseLeave={e => { e.currentTarget.style.color = "rgba(255,255,255,0.75)"; e.currentTarget.style.background = "transparent"; }}
                >Log in</Link>
                <Link to="/signup" style={{ display: "inline-flex", alignItems: "center", height: 36, padding: "0 18px", fontSize: 14, fontWeight: 600, color: "#fff", textDecoration: "none", borderRadius: 10, background: "linear-gradient(135deg,#2563EB,#4F46E5)" }}>Sign up</Link>
              </>
            )}
          </div>

          {/* Mobile right side */}
          <div className="mobile-nav" style={{ display: "none", alignItems: "center", gap: 8, marginLeft: "auto" }}>
            {!user && (
              <Link to="/signup" style={{ display: "inline-flex", alignItems: "center", height: 34, padding: "0 14px", fontSize: 13, fontWeight: 600, color: "#fff", textDecoration: "none", borderRadius: 8, background: "linear-gradient(135deg,#2563EB,#4F46E5)" }}>Sign up</Link>
            )}
            {/* ✅ aria-label already present */}
            <button onClick={() => setMobileOpen(true)} aria-label="Open menu" style={{ background: "none", border: "none", cursor: "pointer", padding: 8, color: "rgba(255,255,255,0.9)", display: "flex", alignItems: "center" }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </button>
          </div>
        </div>

        {(openMenu || showUserMenu) && <div style={{ position: "fixed", inset: 0, zIndex: 199 }} onClick={closeAll} />}

        <style>{`
          @media (max-width: 768px) {
            .desktop-nav { display: none !important; }
            .mobile-nav { display: flex !important; }
          }
        `}</style>
      </header>

      <MobileDrawer open={mobileOpen} onClose={() => setMobileOpen(false)} retailDocs={retailDocs} businessDocs={businessDocs} user={user} credits={credits} signOut={signOut} />
    </>
  );
}

const FALLBACK_RETAIL = [
  { slug: "fuel-bill", name: "Fuel Bill", href: "/documents/fuel-bill", description: "Petrol & diesel receipts for reimbursement", bundle: "Transport Suite", status: "live" },
  { slug: "rent-receipt", name: "Rent Receipt", href: "/documents/rent-receipt", description: "HRA-compliant rent receipts with PAN", bundle: "Housing Suite", status: "live" },
  { slug: "ld-bill", name: "L&D Bill", href: "/documents/ld-bill", description: "Tax invoices for training & courses", bundle: "Education Suite", status: "live" },
  { slug: "gst-invoice", name: "GST Invoice", href: "/documents/gst-invoice", description: "Tax-compliant GST invoices with HSN codes", bundle: "GST Suite", status: "live" },
  { slug: "salary-slip", name: "Salary Slip", href: "/documents/salary-slip", description: "Payslips with CTC, deductions & net pay", bundle: "HR Suite", status: "live" },  
  { slug: "hotel-bill", name: "Hotel Bill", href: "#", description: "Hotel stay receipts for reimbursement", bundle: "Hospitality Suite", status: "soon" },
  { slug: "electricity-bill", name: "Electricity Bill", href: "#", description: "Utility bills for expense claims", bundle: "Utility Suite", status: "soon" },
  { slug: "vehicle-expense", name: "Vehicle Expense", href: "#", description: "Vehicle maintenance & fuel expense report", bundle: "Transport Suite", status: "soon" },
  { slug: "travel-expense", name: "Travel Expense", href: "#", description: "Business travel expense summary", bundle: "Transport Suite", status: "soon" },
];

const FALLBACK_BUSINESS = [
  { slug: "roi-calculator", name: "ROI Calculator", href: "/business/roi-calculator", description: "Calculate return on investment", bundle: "Finance Suite", status: "live" },
  { slug: "gst-invoice", name: "GST Invoice", href: "#", description: "Tax-compliant GST invoices with HSN codes", bundle: "GST Suite", status: "soon" },
  { slug: "eway-bill", name: "E-Way Bill", href: "#", description: "GST e-way bill for goods transport", bundle: "GST Suite", status: "soon" },
  { slug: "tax-invoice", name: "Tax Invoice", href: "#", description: "Formal tax invoices for B2B transactions", bundle: "GST Suite", status: "soon" },
  { slug: "e-invoice", name: "E-Invoice", href: "#", description: "GST e-invoice for eligible businesses", bundle: "GST Suite", status: "soon" },
  { slug: "salary-slip", name: "Salary Slip", href: "#", description: "Payslips with CTC, deductions & net pay", bundle: "HR Suite", status: "soon" },
  { slug: "quotation", name: "Quotation", href: "#", description: "Professional business quotations", bundle: "Invoice Suite", status: "soon" },
  { slug: "service-invoice", name: "Service Invoice", href: "#", description: "Invoices for service-based businesses", bundle: "Service Suite", status: "soon" },
  { slug: "freelancer-invoice", name: "Freelancer Invoice", href: "#", description: "Invoices for freelancers & consultants", bundle: "Freelancer Suite", status: "soon" },
];
