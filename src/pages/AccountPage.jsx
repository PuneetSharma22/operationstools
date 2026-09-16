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
  "bulk-thermal-full": { name: "Bulk Fuel Bill", href: "/documents/fuel-bill", icon: "📦", bg: "#DBEAFE" },
  "bulk-pos": { name: "Bulk Fuel Bill — POS", href: "/documents/fuel-bill", icon: "📦", bg: "#DBEAFE" },
  "bulk-iocl": { name: "Bulk Fuel Bill — IOCL", href: "/documents/fuel-bill", icon: "📦", bg: "#DBEAFE" },
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
  { amount: 10, price: "₹1", desc: "Try it out" },
  { amount: 15, price: "₹1.50", desc: "Small boost" },
  { amount: 25, price: "₹2.50", desc: "Popular" },
  { amount: 100, price: "₹10", desc: "Best value" },
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

function getMonthRange() {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0);
  const fmt = d => d.toLocaleDateString("en-IN", { day: "numeric", month: "short" });
  return `${fmt(start)} – ${fmt(end)} ${now.getFullYear()}`;
}


function groupByDate(items) {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
  const weekAgo = new Date(today); weekAgo.setDate(weekAgo.getDate() - 7);

  const groups = { Today: [], Yesterday: [], "This Week": [], Older: [] };
  items.forEach(item => {
    const d = new Date(item.created_at);
    const day = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    if (day >= today) groups["Today"].push(item);
    else if (day >= yesterday) groups["Yesterday"].push(item);
    else if (day >= weekAgo) groups["This Week"].push(item);
    else groups["Older"].push(item);
  });
  return groups;
}

function DocumentHistory({ saves, saveHistory }) {
  const [filter, setFilter] = useState("All");
  const [visibleCount, setVisibleCount] = useState(10);

  const docTypes = ["All", ...new Set(saveHistory.map(s => {
    const meta = TEMPLATE_META[s.template];
    return meta ? meta.name : s.template;
  }))].filter((v, i, a) => a.indexOf(v) === i);

  const filtered = filter === "All" ? saveHistory : saveHistory.filter(s => {
    const meta = TEMPLATE_META[s.template];
    return (meta ? meta.name : s.template) === filter;
  });

  const visible = filtered.slice(0, visibleCount);
  const groups = groupByDate(visible);
  const hasMore = filtered.length > visibleCount;

  return (
    <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "28px", marginBottom: 24 }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>Document History</h2>
        <span style={{ fontSize: 12, color: "#64748B" }}>{saves} total</span>
      </div>

      {/* Filter by type */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginBottom: 20 }}>
        {docTypes.slice(0, 8).map(type => (
          <button key={type} onClick={() => { setFilter(type); setVisibleCount(10); }}
            style={{ padding: "5px 12px", borderRadius: 999, fontSize: 12, fontWeight: 600, cursor: "pointer", border: filter === type ? "1.5px solid #2563EB" : "1.5px solid #E2E8F0", background: filter === type ? "#EFF6FF" : "#fff", color: filter === type ? "#2563EB" : "#64748B", whiteSpace: "nowrap" }}>
            {type}
          </button>
        ))}
        {docTypes.length > 8 && (
          <span style={{ fontSize: 12, color: "#94A3B8", padding: "5px 4px" }}>+{docTypes.length - 8} more</span>
        )}
      </div>

      {/* Grouped list */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px", color: "#94A3B8", fontSize: 14 }}>No documents found</div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {Object.entries(groups).filter(([, items]) => items.length > 0).map(([group, items]) => (
            <div key={group}>
              <div style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{group}</div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {items.map(save => {
                  const meta = TEMPLATE_META[save.template] || { name: save.template, href: null, icon: "🧾", bg: "#F8FAFC" };
                  return (
                    <div key={save.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 14px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <div style={{ width: 34, height: 34, borderRadius: 8, background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{meta.icon}</div>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{meta.name}</div>
                          <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 1 }}>
                            {new Date(save.created_at).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                            {group === "Older" && ` · ${new Date(save.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}`}
                          </div>
                        </div>
                      </div>
                      {meta.href && (
                        <Link to={meta.href} style={{ fontSize: 12, fontWeight: 600, color: "#2563EB", textDecoration: "none", background: "#EFF6FF", padding: "5px 12px", borderRadius: 7, flexShrink: 0 }}>Open →</Link>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {hasMore && (
            <button onClick={() => setVisibleCount(v => v + 10)}
              style={{ width: "100%", padding: "10px", borderRadius: 10, border: "1.5px dashed #E2E8F0", background: "#F8FAFC", color: "#64748B", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
              Load more ({filtered.length - visibleCount} remaining)
            </button>
          )}
        </div>
      )}
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
  const [creditsTab, setCreditsTab] = useState("request"); // request | history

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
      const { data: cred } = await supabase.from("user_credits").select("balance").eq("user_id", user.id).maybeSingle();
      setBalance(cred?.balance ?? 0);

      const { data: reqs } = await supabase.from("credit_requests").select("*").eq("user_id", user.id).order("requested_at", { ascending: false });
      setRequests(reqs || []);
      setPendingRequest((reqs || []).find(r => r.status === "pending") || null);

      const startOfMonth = new Date(); startOfMonth.setDate(1); startOfMonth.setHours(0,0,0,0);
      const monthReqs = (reqs || []).filter(r => new Date(r.requested_at) >= startOfMonth && r.status !== "rejected");
      setMonthlyRequested(monthReqs.reduce((s, r) => s + r.amount, 0));

      const { data: txns } = await supabase.from("credit_transactions").select("*").eq("user_id", user.id).order("created_at", { ascending: false }).limit(20);
      setTransactions(txns || []);

      const { data: saveData, count } = await supabase.from("save_requests").select("*", { count: "exact" }).eq("user_id", user.id).order("created_at", { ascending: false }).limit(50);
      setSaves(count || 0);
      setSaveHistory(saveData || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function handleRequest() {
    if (!selectedAmount || submitting) return;
    if (pendingRequest) { setSubmitMsg({ type: "error", text: "You already have a pending request. Wait for it to be resolved." }); return; }
    if (monthlyRequested + selectedAmount > 100) { setSubmitMsg({ type: "error", text: `Monthly limit is 100 credits. You've used ${monthlyRequested} this month.` }); return; }
    setSubmitting(true); setSubmitMsg(null);
    try {
      const { error } = await supabase.from("credit_requests").insert({ user_id: user.id, amount: selectedAmount, status: "pending" });
      if (error) throw error;
      setSubmitMsg({ type: "success", text: `Request for ${selectedAmount} credits submitted! We'll approve it shortly.` });
      setSelectedAmount(null);
      loadedRef.current = false;
      await loadAll();
    } catch { setSubmitMsg({ type: "error", text: "Failed to submit. Please try again." }); }
    setSubmitting(false);
  }

  const remaining = 100 - monthlyRequested;
  const monthRange = getMonthRange();

  if (loading) return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #E2E8F0", borderTopColor: "#2563EB", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "calc(100vh - 64px)" }}>
      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0D0630 100%)", padding: "40px 24px 36px" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: "linear-gradient(135deg,#2563EB,#4F46E5)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: "#fff" }}>
              {user?.email?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>{user?.email}</div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>Member since {new Date(user?.created_at).toLocaleDateString("en-IN", { month: "long", year: "numeric" })}</div>
            </div>
          </div>
          <button onClick={async () => { await signOut(); navigate("/"); }} style={{ padding: "10px 20px", borderRadius: 10, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.15)", color: "#94A3B8", fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Sign out</button>
        </div>
      </section>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16, marginBottom: 32 }}>
          <StatCard label="Credit Balance" value={balance.toLocaleString()} sub="Available to use" accent="#2563EB" bg="#EFF6FF" />
          <StatCard label="Documents Saved" value={saves.toLocaleString()} sub="Total PDFs generated" accent="#7C3AED" bg="#F5F3FF" />
          <StatCard label="This Month" value={`${monthlyRequested}/100`} sub={monthRange} accent="#059669" bg="#F0FDF4" />
        </div>

        {/* Credits — unified card */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "28px", marginBottom: 24 }}>
          {/* Tab header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: 0 }}>Credits</h2>
            <div style={{ display: "flex", gap: 6 }}>
              {["request", "history"].map(tab => (
                <button key={tab} onClick={() => setCreditsTab(tab)} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: creditsTab === tab ? "1.5px solid #2563EB" : "1.5px solid #E2E8F0", background: creditsTab === tab ? "#EFF6FF" : "#fff", color: creditsTab === tab ? "#2563EB" : "#64748B", textTransform: "capitalize" }}>
                  {tab === "request" ? "Request" : `History${requests.length > 0 ? ` (${requests.length})` : ""}`}
                </button>
              ))}
            </div>
          </div>

          {creditsTab === "request" && (
            <>
              {/* Month info bar */}
              <div style={{ background: "#F8FAFC", borderRadius: 10, padding: "10px 16px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>{monthRange}</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: monthlyRequested >= 100 ? "#DC2626" : "#059669" }}>
                  {monthlyRequested}/100 credits requested
                  {remaining > 0 && <span style={{ color: "#64748B", fontWeight: 400 }}> · {remaining} remaining</span>}
                </span>
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
                  <p style={{ fontSize: 13, color: "#64748B", margin: "0 0 16px" }}>Credits are used for bulk operations. Select an amount to request:</p>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 10, marginBottom: 16 }}>
                    {CREDIT_PACKAGES.filter(p => p.amount <= remaining).map(pkg => (
                      <button key={pkg.amount} onClick={() => setSelectedAmount(pkg.amount)} style={{ padding: "14px 10px", borderRadius: 12, cursor: "pointer", textAlign: "center", border: selectedAmount === pkg.amount ? "2px solid #2563EB" : "2px solid #E2E8F0", background: selectedAmount === pkg.amount ? "#EFF6FF" : "#fff", transition: "all 0.15s" }}>
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
                  <button onClick={handleRequest} disabled={!selectedAmount || submitting} style={{ width: "100%", padding: "13px", borderRadius: 12, border: "none", background: selectedAmount ? "linear-gradient(135deg,#2563EB,#4F46E5)" : "#F1F5F9", color: selectedAmount ? "#fff" : "#94A3B8", fontSize: 14, fontWeight: 700, cursor: selectedAmount ? "pointer" : "default", transition: "all 0.15s" }}>
                    {submitting ? "Submitting..." : selectedAmount ? `Request ${selectedAmount} credits (${CREDIT_PACKAGES.find(p => p.amount === selectedAmount)?.price})` : "Select an amount above"}
                  </button>
                  <p style={{ fontSize: 11, color: "#94A3B8", textAlign: "center", margin: "10px 0 0" }}>
                    Need more than 100 credits/month? Email <a href="mailto:hello@opstools.ai?subject=Credits Request" style={{ color: "#2563EB" }}>hello@opstools.ai</a>
                  </p>
                </>
              )}
            </>
          )}

          {creditsTab === "history" && (
            <>
              {/* Credit Requests */}
              {requests.length > 0 && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Credit Requests</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
                    {requests.map(req => (
                      <div key={req.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <span style={{ fontSize: 18 }}>{req.status === "pending" ? "⏳" : req.status === "approved" ? "✅" : "❌"}</span>
                          <div>
                            <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{req.amount} credits</div>
                            <div style={{ fontSize: 12, color: "#64748B" }}>{new Date(req.requested_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                          </div>
                        </div>
                        <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: req.status === "pending" ? "#FFFBEB" : req.status === "approved" ? "#F0FDF4" : "#FEF2F2", color: req.status === "pending" ? "#92400E" : req.status === "approved" ? "#065F46" : "#991B1B" }}>
                          {req.status.toUpperCase()}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Credit Transactions */}
              {transactions.length > 0 && (
                <>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>Credit Transactions</div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    {transactions.map(txn => (
                      <div key={txn.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{txn.description || txn.type}</div>
                          <div style={{ fontSize: 12, color: "#64748B" }}>{new Date(txn.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                        </div>
                        <span style={{ fontSize: 15, fontWeight: 800, color: txn.amount > 0 ? "#059669" : "#DC2626" }}>
                          {txn.amount > 0 ? "+" : ""}{txn.amount}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {requests.length === 0 && transactions.length === 0 && (
                <div style={{ textAlign: "center", padding: "32px", color: "#94A3B8", fontSize: 14 }}>No credit history yet</div>
              )}
            </>
          )}
        </div>

        {/* Document History */}
        {saveHistory.length > 0 && <DocumentHistory saves={saves} saveHistory={saveHistory} />}

        {/* Quick links */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "28px" }}>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 16px" }}>Quick Links</h2>
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            {[{ label: "GST Invoice", href: "/documents/gst-invoice" }, { label: "Salary Slip", href: "/documents/salary-slip" }, { label: "Fuel Bill", href: "/documents/fuel-bill" }, { label: "All Tools", href: "/documents" }].map(l => (
              <Link key={l.label} to={l.href} style={{ padding: "9px 16px", borderRadius: 9, background: "#F8FAFC", border: "1px solid #E2E8F0", fontSize: 13, fontWeight: 600, color: "#0F172A", textDecoration: "none" }}>{l.label}</Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
