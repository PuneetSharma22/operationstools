import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";


const TEMPLATE_META = {
  "fuel-bill": { name: "Fuel Bill", href: "/documents/fuel-bill", icon: "⛽", bg: "#DBEAFE" },
  "iocl": { name: "Fuel Bill — IOCL", href: "/documents/fuel-bill", icon: "⛽", bg: "#DBEAFE" },
  "pos": { name: "Fuel Bill — POS", href: "/documents/fuel-bill", icon: "⛽", bg: "#DBEAFE" },
  "thermal-full": { name: "Fuel Bill — Thermal Full", href: "/documents/fuel-bill", icon: "⛽", bg: "#DBEAFE" },
  "thermal-compact": { name: "Fuel Bill — Thermal Compact", href: "/documents/fuel-bill", icon: "⛽", bg: "#DBEAFE" },
  "rent-receipt": { name: "Rent Receipt", href: "/documents/rent-receipt", icon: "🏠", bg: "#D1FAE5" },
  "ld-bill": { name: "L&D Bill", href: "/documents/ld-bill", icon: "🎓", bg: "#EDE9FE" },
  "gst-invoice": { name: "GST Invoice", href: "/documents/gst-invoice", icon: "🧾", bg: "#EDE9FE" },
  "salary-slip": { name: "Salary Slip", href: "/documents/salary-slip", icon: "💼", bg: "#FCE7F3" },
  "restaurant-bill": { name: "Restaurant Bill", href: "/documents/restaurant-bill", icon: "🍽️", bg: "#FCE7F3" },
  "medical-bill": { name: "Medical Bill", href: "/documents/medical-bill", icon: "🏥", bg: "#DCFCE7" },
  "hotel-bill": { name: "Hotel Bill", href: "/documents/hotel-bill", icon: "🏨", bg: "#DBEAFE" },
  "electricity-bill": { name: "Electricity Bill", href: "/documents/electricity-bill", icon: "⚡", bg: "#FEF3C7" },
  "invoice": { name: "Invoice", href: "/documents/invoice", icon: "📄", bg: "#EEF2FF" },
  "quotation": { name: "Quotation", href: "/documents/quotation", icon: "📋", bg: "#D1FAE5" },
  "freelancer-invoice": { name: "Freelancer Invoice", href: "/documents/freelancer-invoice", icon: "💻", bg: "#DBEAFE" },
  "service-invoice": { name: "Service Invoice", href: "/documents/service-invoice", icon: "🔧", bg: "#FEF3C7" },
  "eway-bill": { name: "E-Way Bill", href: "/documents/eway-bill", icon: "🚚", bg: "#DBEAFE" },
  "e-invoice": { name: "E-Invoice", href: "/documents/e-invoice", icon: "📧", bg: "#CFFAFE" },
  "vehicle-expense": { name: "Vehicle Expense", href: "/documents/vehicle-expense", icon: "🚗", bg: "#E0F2FE" },
  "travel-expense": { name: "Travel Expense", href: "/documents/travel-expense", icon: "✈️", bg: "#EDE9FE" },
  "roi-calculator": { name: "ROI Calculator", href: "/business/roi-calculator", icon: "📈", bg: "#FEF3C7" },
  "gst-calculator": { name: "GST Calculator", href: "/business/gst-calculator", icon: "🧮", bg: "#CFFAFE" },
};

const CREDIT_PACKAGES = [
  { amount: 10, label: "10 credits", price: "₹1", desc: "Try it out" },
  { amount: 15, label: "15 credits", price: "₹1.50", desc: "Small boost" },
  { amount: 25, label: "25 credits", price: "₹2.50", desc: "Popular" },
  { amount: 100, label: "100 credits", price: "₹10", desc: "Best value" },
];

function StatCard({ label, value, sub, accent = "#2563EB", bg = "#EFF6FF" }) {
  return (
    <div style={{ background: bg, borderRadius: 16, padding: "20px 24px", border: `1px solid ${accent}20` }}>
      <div style={{ fontSize: 11, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#64748B", marginTop: 6 }}>{sub}</div>}
    </div>
  );
}

export default function AccountPage() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const loadedRef = useRef(false);
  const [balance, setBalance] = useState(0);
  const [requests, setRequests] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [saves, setSaves] = useState(0);
  const [saveHistory, setSaveHistory] = useState([]);
  const [pendingRequest, setPendingRequest] = useState(null);
  const [monthlyRequested, setMonthlyRequested] = useState(0);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitMsg, setSubmitMsg] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    const now = Date.now();
    if (loadedRef.current && (now - loadedRef.current) < 30000) return;
    loadedRef.current = now;
    loadAll();
  }, [user]);

  async function loadAll() {
    setLoading(true);
    try {
      // Balance
      const { data: cred } = await supabase
        .from("user_credits").select("balance").eq("user_id", user.id).maybeSingle();
      setBalance(cred?.balance ?? 0);

      // Credit requests
      const { data: reqs } = await supabase
        .from("credit_requests").select("*").eq("user_id", user.id)
        .order("requested_at", { ascending: false });
      setRequests(reqs || []);

      // Pending request
      const pending = (reqs || []).find(r => r.status === "pending");
      setPendingRequest(pending || null);

      // Monthly requested (current month)
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);
      const monthReqs = (reqs || []).filter(r =>
        new Date(r.requested_at) >= startOfMonth && r.status !== "rejected"
      );
      setMonthlyRequested(monthReqs.reduce((s, r) => s + r.amount, 0));

      // Transactions
      const { data: txns } = await supabase
        .from("credit_transactions").select("*").eq("user_id", user.id)
        .order("created_at", { ascending: false }).limit(20);
      setTransactions(txns || []);

      // Save history
      const { data: saveData, count } = await supabase
        .from("save_requests").select("*", { count: "exact" })
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(50);
      setSaves(count || 0);
      setSaveHistory(saveData || []);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  }

  async function handleRequest() {
    if (!selectedAmount || submitting) return;
    if (pendingRequest) {
      setSubmitMsg({ type: "error", text: "You already have a pending request. Wait for it to be resolved." });
      return;
    }
    if (monthlyRequested + selectedAmount > 100) {
      setSubmitMsg({ type: "error", text: `You can only request up to 100 credits per month. You've used ${monthlyRequested} this month.` });
      return;
    }
    setSubmitting(true);
    setSubmitMsg(null);
    try {
      const { error } = await supabase.from("credit_requests").insert({
        user_id: user.id,
        amount: selectedAmount,
        status: "pending",
      });
      if (error) throw error;
      setSubmitMsg({ type: "success", text: `Request for ${selectedAmount} credits submitted! We'll review it shortly.` });
      setSelectedAmount(null);
      await loadAll();
    } catch (e) {
      setSubmitMsg({ type: "error", text: "Failed to submit request. Please try again." });
    }
    setSubmitting(false);
  }

  const canRequest = !pendingRequest && monthlyRequested < 100;
  const remaining = 100 - monthlyRequested;

  if (loading) {
    return (
      <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #E2E8F0", borderTopColor: "#2563EB", animation: "spin 0.7s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "calc(100vh - 64px)" }}>
      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0D0630 100%)", padding: "40px 24px 36px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#2563EB,#4F46E5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff" }}>
                  {user?.email?.[0]?.toUpperCase()}
                </div>
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{user?.email}</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Member since {new Date(user?.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</div>
                </div>
              </div>
            </div>
            <button onClick={async () => { await signOut(); navigate("/"); }} style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#94A3B8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Sign out
            </button>
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          <StatCard label="Credit Balance" value={balance.toLocaleString()} sub="Available to use" accent="#2563EB" bg="#EFF6FF" />
          <StatCard label="Documents Saved" value={saves.toLocaleString()} sub="Total PDFs generated" accent="#7C3AED" bg="#F5F3FF" />
          <StatCard label="This Month" value={`${monthlyRequested}/100`} sub="Credits requested" accent="#059669" bg="#F0FDF4" />
        </div>

        {/* Request Credits */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "28px", marginBottom: 24 }}>
          <div style={{ marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 6px" }}>Request Credits</h2>
            <p style={{ fontSize: 13, color: "#64748B", margin: 0 }}>
              Credits are used for bulk operations. You can request up to 100 credits per month.
              {remaining < 100 && <span style={{ color: "#D97706", fontWeight: 600 }}> {remaining} remaining this month.</span>}
            </p>
          </div>

          {pendingRequest ? (
            <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 12, padding: "16px 20px", display: "flex", alignItems: "center", gap: 12 }}>
              <span style={{ fontSize: 20 }}>⏳</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#92400E" }}>Request pending — {pendingRequest.amount} credits</div>
                <div style={{ fontSize: 12, color: "#78350F", marginTop: 3 }}>
                  Submitted {new Date(pendingRequest.requested_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}. We'll approve it shortly.
                </div>
              </div>
            </div>
          ) : monthlyRequested >= 100 ? (
            <div style={{ background: "#FEF2F2", border: "1px solid #FCA5A5", borderRadius: 12, padding: "16px 20px" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#991B1B", marginBottom: 4 }}>Monthly limit reached</div>
              <div style={{ fontSize: 13, color: "#7F1D1D" }}>
                You've requested 100 credits this month. To get more, email{" "}
                <a href="mailto:hello@opstools.ai?subject=Credits Request" style={{ color: "#DC2626", fontWeight: 600 }}>hello@opstools.ai</a>
              </div>
            </div>
          ) : (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
                {CREDIT_PACKAGES.filter(p => p.amount <= remaining).map(pkg => (
                  <button key={pkg.amount} onClick={() => setSelectedAmount(pkg.amount)} style={{
                    padding: "14px 10px", borderRadius: 12, cursor: "pointer", textAlign: "center",
                    border: selectedAmount === pkg.amount ? "2px solid #2563EB" : "2px solid #E2E8F0",
                    background: selectedAmount === pkg.amount ? "#EFF6FF" : "#fff",
                    transition: "all 0.15s",
                  }}>
                    <div style={{ fontSize: 18, fontWeight: 800, color: selectedAmount === pkg.amount ? "#2563EB" : "#0F172A" }}>{pkg.amount}</div>
                    <div style={{ fontSize: 11, color: "#64748B", marginTop: 2 }}>credits</div>
                    <div style={{ fontSize: 12, fontWeight: 700, color: selectedAmount === pkg.amount ? "#2563EB" : "#475569", marginTop: 4 }}>{pkg.price}</div>
                    <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{pkg.desc}</div>
                  </button>
                ))}
              </div>

              {submitMsg && (
                <div style={{ background: submitMsg.type === "success" ? "#F0FDF4" : "#FEF2F2", border: `1px solid ${submitMsg.type === "success" ? "#BBF7D0" : "#FCA5A5"}`, borderRadius: 10, padding: "12px 16px", marginBottom: 14, fontSize: 13, color: submitMsg.type === "success" ? "#065F46" : "#991B1B", fontWeight: 500 }}>
                  {submitMsg.text}
                </div>
              )}

              <button onClick={handleRequest} disabled={!selectedAmount || submitting} style={{
                width: "100%", padding: "13px", borderRadius: 12, border: "none",
                background: selectedAmount ? "linear-gradient(135deg,#2563EB,#4F46E5)" : "#F1F5F9",
                color: selectedAmount ? "#fff" : "#94A3B8",
                fontSize: 14, fontWeight: 700, cursor: selectedAmount ? "pointer" : "default",
                transition: "all 0.15s",
              }}>
                {submitting ? "Submitting..." : selectedAmount ? `Request ${selectedAmount} credits (${CREDIT_PACKAGES.find(p => p.amount === selectedAmount)?.price})` : "Select an amount above"}
              </button>

              <p style={{ fontSize: 11, color: "#94A3B8", textAlign: "center", margin: "10px 0 0" }}>
                Need more than 100 credits/month? Email <a href="mailto:hello@opstools.ai?subject=Credits Request" style={{ color: "#2563EB" }}>hello@opstools.ai</a>
              </p>
            </>
          )}
        </div>

        {/* Request History */}
        {requests.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "28px", marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 20px" }}>Credit Requests</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {requests.map(req => (
                <div key={req.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ fontSize: 18 }}>{req.status === "pending" ? "⏳" : req.status === "approved" ? "✅" : "❌"}</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{req.amount} credits</div>
                      <div style={{ fontSize: 12, color: "#64748B" }}>{new Date(req.requested_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                    </div>
                  </div>
                  <span style={{
                    fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999,
                    background: req.status === "pending" ? "#FFFBEB" : req.status === "approved" ? "#F0FDF4" : "#FEF2F2",
                    color: req.status === "pending" ? "#92400E" : req.status === "approved" ? "#065F46" : "#991B1B",
                  }}>
                    {req.status.toUpperCase()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Transaction History */}
        {transactions.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "28px", marginBottom: 24 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 20px" }}>Credit History</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {transactions.map(txn => (
                <div key={txn.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{txn.description || txn.type}</div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>{new Date(txn.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: txn.amount > 0 ? "#059669" : "#DC2626" }}>
                    {txn.amount > 0 ? "+" : ""}{txn.amount}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Document History */}
        {saveHistory.length > 0 && (
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "28px", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>Document History</h2>
              <span style={{ fontSize: 12, color: "#64748B" }}>{saves} total</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {saveHistory.map(save => {
                const templateMeta = TEMPLATE_META[save.template] || { name: save.template, href: null, icon: "🧾", color: "#64748B", bg: "#F8FAFC" };
                return (
                  <div key={save.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div style={{ width: 36, height: 36, borderRadius: 9, background: templateMeta.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{templateMeta.icon}</div>
                      <div>
                        <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{templateMeta.name}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{new Date(save.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}</div>
                      </div>
                    </div>
                    {templateMeta.href && (
                      <Link to={templateMeta.href} style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", textDecoration: "none", background: "#EFF6FF", padding: "5px 12px", borderRadius: 7 }}>
                        Open →
                      </Link>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Quick links */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "28px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 16px" }}>Quick Links</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[
              { label: "GST Invoice", href: "/documents/gst-invoice" },
              { label: "Salary Slip", href: "/documents/salary-slip" },
              { label: "Fuel Bill", href: "/documents/fuel-bill" },
              { label: "All Tools", href: "/documents" },
            ].map(l => (
              <Link key={l.label} to={l.href} style={{ padding: "9px 16px", borderRadius: 9, background: "#F8FAFC", border: "1px solid #E2E8F0", fontSize: 13, fontWeight: 600, color: "#0F172A", textDecoration: "none" }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
