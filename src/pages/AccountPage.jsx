import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";

const inputClass = "w-full h-11 px-4 bg-white border border-[#E2E8F0] rounded-xl text-[#0F172A] text-[14px] focus:outline-none focus:border-[#2563EB] focus:ring-2 focus:ring-[#2563EB]/10 transition-all duration-150 placeholder:text-[#94a3b8]";
const labelClass = "block text-[13px] font-medium text-[#0F172A] mb-1.5";

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState("credits");
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loadingCredits, setLoadingCredits] = useState(true);
  const [creditAmount, setCreditAmount] = useState(100);

  const presets = [100, 500, 1000, 5000];
  const rupees = Math.max(10, Math.ceil(creditAmount / 10));

  // Redirect if not logged in
  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  // Fetch credits
  useEffect(() => {
    if (!user) return;
    const fetchCredits = async () => {
      setLoadingCredits(true);
      const { data: bal } = await supabase
        .from("user_credits")
        .select("balance")
        .eq("user_id", user.id)
        .maybeSingle();
      setBalance(bal?.balance ?? 0);

      const { data: txns } = await supabase
        .from("credit_transactions")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      setTransactions(txns || []);
      setLoadingCredits(false);
    };
    fetchCredits();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  const formatDate = (ts) => {
    if (!ts) return "";
    return new Date(ts).toLocaleDateString("en-IN", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
    });
  };

  if (!user) return null;

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg, #07011F 0%, #0D0630 60%, #1e1b4b 100%)", padding: "36px 24px 32px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <nav style={{ marginBottom: 14, fontSize: 13, color: "#475569" }}>
            <a href="/" style={{ color: "#475569", textDecoration: "none" }}>Home</a>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Account</span>
          </nav>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "linear-gradient(135deg, #2563EB, #4F46E5)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 20, fontWeight: 800, color: "#fff", flexShrink: 0,
            }}>
              {user.email[0].toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
                My Account
              </h1>
              <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>{user.email}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <div style={{ borderBottom: "1px solid #E2E8F0", background: "#fff" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px", display: "flex", gap: 0 }}>
          {[
            { id: "credits", label: "Credits & Billing" },
            { id: "profile", label: "Profile" },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} style={{
              padding: "14px 20px", fontSize: 14, fontWeight: 600, border: "none",
              background: "none", cursor: "pointer",
              color: tab === t.id ? "#2563EB" : "#64748B",
              borderBottom: tab === t.id ? "2px solid #2563EB" : "2px solid transparent",
              transition: "all 0.15s",
            }}>{t.label}</button>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 80px" }}>

        {/* ── Credits Tab ── */}
        {tab === "credits" && (
          <div>
            {/* Balance card */}
            <div style={{
              background: "linear-gradient(135deg, #07011F, #1e1b4b)",
              borderRadius: 20, padding: "28px 32px", marginBottom: 28,
              display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16,
            }}>
              <div>
                <p style={{ fontSize: 12, fontWeight: 700, color: "rgba(255,255,255,0.5)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 8px" }}>Current Balance</p>
                {loadingCredits ? (
                  <div style={{ fontSize: 40, fontWeight: 800, color: "#fff" }}>—</div>
                ) : (
                  <div style={{ fontSize: 44, fontWeight: 800, color: "#fff", letterSpacing: "-0.03em", lineHeight: 1 }}>
                    {balance.toLocaleString()}
                    <span style={{ fontSize: 16, fontWeight: 500, color: "rgba(255,255,255,0.5)", marginLeft: 8 }}>credits</span>
                  </div>
                )}
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.4)", margin: "8px 0 0" }}>1 credit = 1 bill generated</p>
              </div>
              <button
                onClick={() => document.getElementById("add-credits-section").scrollIntoView({ behavior: "smooth" })}
                style={{
                  background: "linear-gradient(135deg, #2563EB, #4F46E5)",
                  border: "none", borderRadius: 12, padding: "12px 24px",
                  color: "#fff", fontSize: 14, fontWeight: 700, cursor: "pointer",
                  whiteSpace: "nowrap",
                }}>
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
              ) : (
                <div>
                  {transactions.map((txn, i) => (
                    <div key={txn.id} style={{
                      display: "flex", alignItems: "center", justifyContent: "space-between",
                      padding: "14px 24px",
                      borderBottom: i < transactions.length - 1 ? "1px solid #F8FAFC" : "none",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                          background: txn.type === "purchase" ? "#DCFCE7" : "#FEF2F2",
                          display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
                        }}>
                          {txn.type === "purchase" ? "↑" : "↓"}
                        </div>
                        <div>
                          <p style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", margin: "0 0 2px" }}>
                            {txn.description || (txn.type === "purchase" ? "Credits purchased" : "Bill generated")}
                          </p>
                          <p style={{ fontSize: 12, color: "#94A3B8", margin: 0 }}>{formatDate(txn.created_at)}</p>
                        </div>
                      </div>
                      <span style={{
                        fontSize: 15, fontWeight: 700,
                        color: txn.amount > 0 ? "#16A34A" : "#DC2626",
                      }}>
                        {txn.amount > 0 ? "+" : ""}{txn.amount.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Add credits */}
            <div id="add-credits-section" style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 4px" }}>Add Credits</h2>
                <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>1 credit = 1 bill · Minimum ₹10 = 100 credits</p>
              </div>
              <div style={{ padding: "24px" }}>
                {/* Presets */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 10, marginBottom: 16 }}>
                  {presets.map((p) => (
                    <button key={p} onClick={() => setCreditAmount(p)} style={{
                      padding: "12px 8px", borderRadius: 12, fontSize: 14, fontWeight: 700, cursor: "pointer",
                      border: creditAmount === p ? "2px solid #2563EB" : "2px solid #E2E8F0",
                      background: creditAmount === p ? "#EFF6FF" : "#F8FAFC",
                      color: creditAmount === p ? "#2563EB" : "#0F172A",
                      transition: "all 0.15s",
                    }}>
                      {p.toLocaleString()}
                      <div style={{ fontSize: 11, fontWeight: 500, marginTop: 2, color: creditAmount === p ? "#3B82F6" : "#94A3B8" }}>
                        ₹{Math.ceil(p / 10)}
                      </div>
                    </button>
                  ))}
                </div>
                {/* Custom */}
                <div style={{ marginBottom: 20 }}>
                  <label className={labelClass}>Custom amount</label>
                  <input
                    type="number" min={100} step={100} value={creditAmount}
                    onChange={(e) => setCreditAmount(Math.max(100, parseInt(e.target.value) || 100))}
                    className={inputClass}
                  />
                </div>
                {/* Summary + CTA */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", background: "#F8FAFC", borderRadius: 12, padding: "14px 18px", marginBottom: 16 }}>
                  <span style={{ fontSize: 14, color: "#374151" }}>{creditAmount.toLocaleString()} credits</span>
                  <span style={{ fontSize: 22, fontWeight: 800, color: "#0F172A" }}>₹{rupees}</span>
                </div>
                <button
                  onClick={() => alert(`Integrate Razorpay here — ₹${rupees} for ${creditAmount} credits`)}
                  style={{
                    width: "100%", height: 48, borderRadius: 12, border: "none", cursor: "pointer",
                    background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
                    color: "#fff", fontSize: 15, fontWeight: 700,
                  }}
                >
                  Pay ₹{rupees} · Get {creditAmount.toLocaleString()} Credits
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Profile Tab ── */}
        {tab === "profile" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Account info */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>Account Information</h2>
              </div>
              <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16 }}>
                <div>
                  <label className={labelClass}>Email address</label>
                  <div style={{
                    height: 44, padding: "0 16px", background: "#F8FAFC", border: "1px solid #E2E8F0",
                    borderRadius: 12, display: "flex", alignItems: "center", fontSize: 14, color: "#475569",
                  }}>
                    {user.email}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>User ID</label>
                  <div style={{
                    height: 44, padding: "0 16px", background: "#F8FAFC", border: "1px solid #E2E8F0",
                    borderRadius: 12, display: "flex", alignItems: "center", fontSize: 12,
                    color: "#94A3B8", fontFamily: "monospace",
                  }}>
                    {user.id}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Member since</label>
                  <div style={{
                    height: 44, padding: "0 16px", background: "#F8FAFC", border: "1px solid #E2E8F0",
                    borderRadius: 12, display: "flex", alignItems: "center", fontSize: 14, color: "#475569",
                  }}>
                    {new Date(user.created_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" })}
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Last sign in</label>
                  <div style={{
                    height: 44, padding: "0 16px", background: "#F8FAFC", border: "1px solid #E2E8F0",
                    borderRadius: 12, display: "flex", alignItems: "center", fontSize: 14, color: "#475569",
                  }}>
                    {new Date(user.last_sign_in_at).toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
            </div>

            {/* Credits summary */}
            <div style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #F1F5F9" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>Credits Summary</h2>
              </div>
              <div style={{ padding: "24px", display: "flex", gap: 16, flexWrap: "wrap" }}>
                <div style={{ flex: 1, minWidth: 140, background: "#F8FAFC", borderRadius: 12, padding: "16px 20px" }}>
                  <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Balance</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", margin: 0 }}>{balance.toLocaleString()}</p>
                </div>
                <div style={{ flex: 1, minWidth: 140, background: "#F8FAFC", borderRadius: 12, padding: "16px 20px" }}>
                  <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Bills Generated</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                    {transactions.filter(t => t.type === "usage").length}
                  </p>
                </div>
                <div style={{ flex: 1, minWidth: 140, background: "#F8FAFC", borderRadius: 12, padding: "16px 20px" }}>
                  <p style={{ fontSize: 12, color: "#94A3B8", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.06em", fontWeight: 600 }}>Total Purchased</p>
                  <p style={{ fontSize: 28, fontWeight: 800, color: "#0F172A", margin: 0 }}>
                    {transactions.filter(t => t.type === "purchase").reduce((s, t) => s + t.amount, 0).toLocaleString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div style={{ background: "#fff", border: "1px solid #FEE2E2", borderRadius: 16, overflow: "hidden" }}>
              <div style={{ padding: "20px 24px", borderBottom: "1px solid #FEF2F2" }}>
                <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>Sign Out</h2>
              </div>
              <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
                <p style={{ fontSize: 14, color: "#64748B", margin: 0 }}>
                  You'll be returned to the home page after signing out.
                </p>
                <button
                  onClick={handleSignOut}
                  style={{
                    padding: "10px 20px", borderRadius: 10, border: "1.5px solid #FCA5A5",
                    background: "#FFF", color: "#DC2626", fontSize: 14, fontWeight: 600,
                    cursor: "pointer", display: "flex", alignItems: "center", gap: 8,
                    transition: "all 0.15s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "#FEF2F2"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "#FFF"; }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                    <polyline points="16 17 21 12 16 7"/>
                    <line x1="21" y1="12" x2="9" y2="12"/>
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
