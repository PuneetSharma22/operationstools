import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";

const labelClass = "block text-[13px] font-medium text-[#0F172A] mb-1.5";

export default function AccountPage() {
  const { user, loading: authLoading, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("credits");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [promoCode, setPromoCode] = useState("");
  const [promoMsg, setPromoMsg] = useState("");
  const [applyingPromo, setApplyingPromo] = useState(false);

  const PROMO_CODES = { "CREDIT": 100, "OPS100": 100, "WELCOME": 200 };

  const handlePromoCode = async () => {
    const reward = PROMO_CODES[promoCode.trim().toUpperCase()];
    if (!reward) { setPromoMsg("Invalid code. Please try again."); return; }
    setApplyingPromo(true);
    try {
      const { data: existing } = await supabase
        .from("credit_transactions").select("id")
        .eq("user_id", user.id).eq("description", `Promo code: ${promoCode}`).maybeSingle();
      if (existing) { setPromoMsg("This code has already been used."); setApplyingPromo(false); return; }
      const newBalance = balance + reward;
      await supabase.from("user_credits").upsert({ user_id: user.id, balance: newBalance, updated_at: new Date().toISOString() });
      await supabase.from("credit_transactions").insert({ user_id: user.id, type: "purchase", amount: reward, description: `Promo code: ${promoCode}` });
      setBalance(newBalance);
      setTransactions((prev) => [{ id: Date.now(), type: "purchase", amount: reward, description: `Promo code: ${promoCode}`, created_at: new Date().toISOString() }, ...prev]);
      setPromoMsg(`✓ ${reward} credits added to your account!`);
      setPromoCode("");
    } catch { setPromoMsg("Something went wrong. Please try again."); }
    finally { setApplyingPromo(false); }
  };

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  const fetchedRef = React.useRef(false);

  useEffect(() => {
    if (!user || fetchedRef.current) return;
    fetchedRef.current = true;
    const fetchCredits = async () => {
      setLoadingCredits(true);
      const [{ data: bal }, { data: txns }] = await Promise.all([
        supabase.from("user_credits").select("balance").eq("user_id", user.id).maybeSingle(),
        supabase.from("credit_transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(50),
      ]);
      setBalance(bal?.balance ?? 0);
      setTransactions(txns || []);
      setLoadingCredits(false);
    };
    fetchCredits();
  }, [user]);

  const handleSignOut = async () => { await signOut(); navigate("/"); };

  const formatDate = (ts) => {
    if (!ts) return "";
    return new Date(ts).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  if (authLoading) return null;
  if (!user) return null;

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>

      <style>{`@keyframes pulse { 0%, 100% { opacity: 0.4 } 50% { opacity: 0.8 } }`}</style>
      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #07011F 0%, #0D0630 60%, #1e1b4b 100%)", padding: "36px 24px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <nav style={{ marginBottom: 14, fontSize: 13, color: "#475569" }}>
            <a href="/" style={{ color: "#475569", textDecoration: "none" }}>Home</a>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Account</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg, #2563EB, #4F46E5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff", flexShrink: 0 }}>
              {user.email[0].toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.02em" }}>My Account</h1>
              <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>{user.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid #E2E8F0", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex" }}>
          {[{ id: "credits", label: "Credits & Billing" }, { id: "profile", label: "Profile" }].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{ padding: "14px 20px", fontSize: 14, fontWeight: 600, border: "none", background: "none", cursor: "pointer", color: tab === t.id ? "#2563EB" : "#64748B", borderBottom: tab === t.id ? "2px solid #2563EB" : "2px solid transparent", transition: "all 0.15s" }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* Credits Tab */}
        {tab === "credits" && (
          <div>
            {/* Balance card */}
            <div style={{ background: "linear-gradient(135deg, #07011F, #1e1b4b)", borderRadius: 20, padding: "28px 32px", marginBottom: 28, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Current Balance</p>
                {loadingCredits ? (
                  <div style={{ width: 120, height: 44, borderRadius: 8, background: "rgba(255,255,255,0.1)", animation: "pulse 1.5s ease-in-out infinite" }} />
                ) : (
                  <div style={{ fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {balance.toLocaleString()}
                    <span style={{ fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginLeft: 8 }}>credits</span>
                  </div>
                )}
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "8px 0 0" }}>1 credit = 1 bill generated</p>
              </div>
              <button onClick={() => document.getElementById("add-credits-section").scrollIntoView({ behavior: "smooth" })} style={{ background: "linear-gradient(135deg, #2563EB, #4F46E5)", border: "none", borderRadius: 12, padding: "12px 24px", color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer", whiteSpace: "nowrap" }}>
                + Add Credits
              </button>
            </div>

            {/* Transaction history */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, marginBottom: 28, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>Transaction History</h2>
              </div>
              {loadingCredits ? (
                <div style={{ padding: "40px 24px", textAlign: "center", color: "#94A3B8", fontSize: 14 }}>Loading...</div>
              ) : transactions.length === 0 ? (
                <div style={{ padding: "48px 24px", textAlign: "center" }}>
                  <div style={{ fontSize: 32, marginBottom: 12 }}>📋</div>
                  <p style={{ fontSize: 14, color: "#94A3B8", margin: 0 }}>No transactions yet. Add credits to get started.</p>
                </div>
              ) : transactions.map((txn, i) => (
                <div key={txn.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 24px", borderBottom: i < transactions.length - 1 ? "1px solid #F8FAFC" : "none" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, flexShrink: 0, background: txn.type === "purchase" ? "#DCFCE7" : "#FEF2F2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>
                      {txn.type === "purchase" ? "↑" : "↓"}
                    </div>
                    <div>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", margin: "0 0 2px" }}>{txn.description || (txn.type === "purchase" ? "Credits purchased" : "Bill generated")}</p>
                      <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>{formatDate(txn.created_at)}</p>
                    </div>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 700, color: txn.amount > 0 ? "#16A34A" : "#DC2626" }}>
                    {txn.amount > 0 ? "+" : ""}{txn.amount.toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            {/* Add credits — promo code only */}
            <div id="add-credits-section" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 4px" }}>Add Credits</h2>
                <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>Enter a promo code to add credits to your account.</p>
              </div>
              <div style={{ padding: "24px" }}>
                <div style={{ display: "flex", gap: 8 }}>
                  <input
                    type="text"
                    placeholder="Enter promo code"
                    value={promoCode}
                    onChange={(e) => { setPromoCode(e.target.value.toUpperCase()); setPromoMsg(""); }}
                    style={{ flex: 1, height: 44, padding: "0 14px", borderRadius: 10, border: "1.5px solid #E2E8F0", outline: "none", fontSize: 14, color: "#0F172A", letterSpacing: "0.1em", fontFamily: "monospace" }}
                  />
                  <button
                    onClick={handlePromoCode}
                    disabled={applyingPromo || !promoCode}
                    style={{ padding: "0 24px", height: 44, borderRadius: 10, border: "none", background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)", color: "#fff", fontSize: 14, fontWeight: 600, cursor: applyingPromo || !promoCode ? "not-allowed" : "pointer", opacity: applyingPromo || !promoCode ? 0.6 : 1, whiteSpace: "nowrap" }}
                  >{applyingPromo ? "Applying…" : "Apply Code"}</button>
                </div>
                {promoMsg && (
                  <p style={{ fontSize: 13, marginTop: 10, color: promoMsg.startsWith("✓") ? "#16A34A" : "#DC2626", fontWeight: 500 }}>{promoMsg}</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {tab === "profile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Account info */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>Account Information</h2>
              </div>
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { label: "Email address", value: user.email, mono: false },
                  { label: "User ID", value: user.id, mono: true },
                  { label: "Member since", value: new Date(user.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" }), mono: false },
                  { label: "Last sign in", value: new Date(user.last_sign_in_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" }), mono: false },
                ].map(({ label, value, mono }) => (
                  <div key={label}>
                    <label className={labelClass}>{label}</label>
                    <div style={{ height: 44, padding: "0 16px", background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: 12, display: "flex", alignItems: "center", fontSize: mono ? 12 : 14, color: mono ? "#94A3B8" : "#475569", fontFamily: mono ? "monospace" : "inherit", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {value}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Credits summary */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>Credits Summary</h2>
              </div>
              <div style={{ padding: "24px", display: "flex", gap: 16, flexWrap: "wrap" }}>
                {[
                  { label: "Balance", value: balance.toLocaleString() },
                  { label: "Bills Generated", value: transactions.filter(t => t.type === "usage").length },
                  { label: "Total Purchased", value: transactions.filter(t => t.type === "purchase").reduce((s, t) => s + t.amount, 0).toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} style={{ flex: 1, minWidth: 140, background: "#F8FAFC", borderRadius: 12, padding: "16px 20px" }}>
                    <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>{label}</p>
                    <p style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", margin: 0 }}>{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Sign out */}
            <div style={{ background: "#fff", border: "1px solid #FEE2E2", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #FEF2F2" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>Sign Out</h2>
              </div>
              <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>You'll be returned to the home page after signing out.</p>
                <button onClick={handleSignOut} style={{ padding: "10px 20px", borderRadius: 10, border: "1.5px solid #FCA5A5", background: "#FFF", color: "#DC2626", fontSize: 14, fontWeight: 600, cursor: "pointer", display: "flex", alignItems: "center", gap: 8 }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "#FEF2F2"}
                  onMouseLeave={(e) => e.currentTarget.style.background = "#FFF"}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>
                  </svg>
                  Sign out
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
