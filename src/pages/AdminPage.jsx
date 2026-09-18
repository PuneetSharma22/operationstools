import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend, Cell
} from "recharts";

const RANGES = ["7d", "30d", "90d", "all"];
const RANGE_LABELS = { "7d": "Last 7 days", "30d": "Last 30 days", "90d": "Last 90 days", "all": "All time" };

const TEMPLATE_COLORS = [
  "#2563EB","#7C3AED","#059669","#DB2777","#D97706",
  "#0891B2","#DC2626","#16A34A","#9333EA","#EA580C",
];

function StatCard({ label, value, sub, accent = "#2563EB", bg = "#EFF6FF", delta }) {
  return (
    <div style={{ background: bg, borderRadius: 16, padding: "18px 22px", border: `1px solid ${accent}20` }}>
      <div style={{ fontSize: 10, fontWeight: 700, color: accent, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 30, fontWeight: 900, color: "#0F172A", lineHeight: 1 }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: "#64748B", marginTop: 5 }}>{sub}</div>}
      {delta !== undefined && (
        <div style={{ fontSize: 11, fontWeight: 600, color: delta >= 0 ? "#059669" : "#DC2626", marginTop: 4 }}>
          {delta >= 0 ? "▲" : "▼"} {Math.abs(delta)} vs prev period
        </div>
      )}
    </div>
  );
}

function ChartCard({ title, children, action }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", margin: 0 }}>{title}</h3>
        {action}
      </div>
      {children}
    </div>
  );
}

function groupByDay(rows, dateField) {
  const map = {};
  rows.forEach(r => {
    const day = new Date(r[dateField]).toISOString().split("T")[0];
    map[day] = (map[day] || 0) + 1;
  });
  const sorted = Object.keys(map).sort();
  if (!sorted.length) return [];
  const start = new Date(sorted[0]);
  const end = new Date();
  const result = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().split("T")[0];
    result.push({
      date: key,
      label: new Date(key).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
      count: map[key] || 0,
    });
  }
  return result;
}

function filterByRange(rows, dateField, range) {
  if (range === "all") return rows;
  const days = range === "7d" ? 7 : range === "30d" ? 30 : 90;
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - days);
  return rows.filter(r => new Date(r[dateField]) >= cutoff);
}

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [range, setRange] = useState("all");
  const [requests, setRequests] = useState([]);
  const [allSaves, setAllSaves] = useState([]);
  const [allProfiles, setAllProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [manualUser, setManualUser] = useState({ email: "", amount: "", note: "" });
  const [manualMsg, setManualMsg] = useState(null);
  const [activeTab, setActiveTab] = useState("dashboard");

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    // Admin access is a server-side flag (profiles.is_admin), checked fresh
    // on every load — never a hardcoded email in the client bundle.
    supabase.from("profiles").select("is_admin").eq("id", user.id).maybeSingle()
      .then(({ data, error }) => {
        if (error || !data?.is_admin) { navigate("/"); return; }
        loadAll();
      });
  }, [user]);

  async function loadAll() {
    setLoading(true);
    try {
      const [reqRes, saveRes, profileRes] = await Promise.all([
        supabase.from("credit_requests").select("*").order("requested_at", { ascending: false }),
        supabase.from("save_requests").select("*").order("created_at", { ascending: true }),
        supabase.from("profiles").select("id, email, full_name, created_at, email_verified"),
      ]);

      const profileMap = (profileRes.data || []).reduce((acc, p) => { acc[p.id] = p; return acc; }, {});
      const reqs = (reqRes.data || []).map(r => ({ ...r, profiles: profileMap[r.user_id] || null }));
      setRequests(reqs);
      setAllSaves(saveRes.data || []);
      setAllProfiles(profileRes.data || []);
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  const filteredSaves = filterByRange(allSaves, "created_at", range);
  const filteredProfiles = filterByRange(allProfiles, "created_at", range);
  const filteredRequests = filterByRange(requests, "requested_at", range);

  const savesOverTime = groupByDay(filteredSaves, "created_at");
  const signupsOverTime = groupByDay(filteredProfiles, "created_at");

  const templateCounts = filteredSaves.reduce((acc, s) => {
    const t = s.template || "unknown";
    acc[t] = (acc[t] || 0) + 1;
    return acc;
  }, {});
  const topTemplates = Object.entries(templateCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([name, count]) => ({ name, count }));

  const creditsByDay = filteredRequests.reduce((acc, r) => {
    const day = new Date(r.requested_at).toISOString().split("T")[0];
    if (!acc[day]) acc[day] = { date: day, label: new Date(day).toLocaleDateString("en-IN", { day: "numeric", month: "short" }), requested: 0, approved: 0 };
    acc[day].requested += r.amount;
    if (r.status === "approved") acc[day].approved += r.amount;
    return acc;
  }, {});
  const creditsOverTime = Object.values(creditsByDay).sort((a, b) => a.date.localeCompare(b.date));

  const totalSaves = allSaves.length;
  const totalUsers = allProfiles.length;
  const verifiedUsers = allProfiles.filter(p => p.email_verified === "verified").length;
  const pendingReqs = requests.filter(r => r.status === "pending").length;
  const approvedCredits = requests.filter(r => r.status === "approved").reduce((s, r) => s + r.amount, 0);
  const periodSaves = filteredSaves.length;
  const periodSignups = filteredProfiles.length;

  // Applies the actual credit grant first, and only marks the request
  // "approved" once that succeeds — previously the request was marked
  // approved BEFORE the credit write, so a silently RLS-blocked write to
  // user_credits (the admin's session can't read/write another user's row
  // under the "own row" policy) left the request showing "approved" with
  // no credits actually granted, and no visible error either. Both parts
  // of that bug are fixed here: correct ordering, and every step's error
  // is now checked and surfaced instead of only relying on a thrown
  // exception (RLS-blocked writes return an error object, they don't throw).
  async function handleApprove(req) {
    setProcessing(req.id);
    try {
      const { data: existing, error: selErr } = await supabase
        .from("user_credits").select("balance").eq("user_id", req.user_id).maybeSingle();
      if (selErr) throw selErr;

      if (existing) {
        const { error: updErr } = await supabase
          .from("user_credits")
          .update({ balance: existing.balance + req.amount, updated_at: new Date().toISOString() })
          .eq("user_id", req.user_id);
        if (updErr) throw updErr;
      } else {
        const { error: insErr } = await supabase
          .from("user_credits").insert({ user_id: req.user_id, balance: req.amount });
        if (insErr) throw insErr;
      }

      const { error: txnErr } = await supabase.from("credit_transactions").insert({
        user_id: req.user_id,
        type: "credit_request_approved",
        amount: req.amount,
        description: `Credit request approved — ${req.amount} credits added`,
      });
      if (txnErr) throw txnErr;

      const { error: reqErr } = await supabase
        .from("credit_requests")
        .update({ status: "approved", resolved_at: new Date().toISOString(), resolved_by: user.id })
        .eq("id", req.id);
      if (reqErr) throw reqErr;

      await loadAll();
    } catch (e) {
      console.error(e);
      alert(
        "Approval failed: " + (e?.message || e?.details || "Unknown error") +
        "\n\nThe request was left as-is (not marked approved), so it's safe to retry. " +
        "This is very likely a database permissions (RLS) issue on user_credits/credit_transactions — " +
        "the admin's session needs an explicit policy to write to another user's row."
      );
    }
    setProcessing(null);
  }

  async function handleReject(req) {
    setProcessing(req.id);
    try {
      const { error } = await supabase
        .from("credit_requests")
        .update({ status: "rejected", resolved_at: new Date().toISOString(), resolved_by: user.id })
        .eq("id", req.id);
      if (error) throw error;
      await loadAll();
    } catch (e) {
      console.error(e);
      alert("Reject failed: " + (e?.message || "Unknown error"));
    }
    setProcessing(null);
  }

  async function handleManualGrant() {
    if (!manualUser.email || !manualUser.amount) return;
    setManualMsg(null);
    try {
      const { data: profile, error: profErr } = await supabase
        .from("profiles").select("id").eq("email", manualUser.email).maybeSingle();
      if (profErr) throw profErr;
      if (!profile) { setManualMsg({ type: "error", text: "User not found." }); return; }

      const { data: existing, error: selErr } = await supabase
        .from("user_credits").select("balance").eq("user_id", profile.id).maybeSingle();
      if (selErr) throw selErr;

      if (existing) {
        const { error: updErr } = await supabase
          .from("user_credits")
          .update({ balance: existing.balance + Number(manualUser.amount), updated_at: new Date().toISOString() })
          .eq("user_id", profile.id);
        if (updErr) throw updErr;
      } else {
        const { error: insErr } = await supabase
          .from("user_credits").insert({ user_id: profile.id, balance: Number(manualUser.amount) });
        if (insErr) throw insErr;
      }

      const { error: txnErr } = await supabase.from("credit_transactions").insert({
        user_id: profile.id,
        type: "manual_grant",
        amount: Number(manualUser.amount),
        description: manualUser.note || `Manual grant — ${manualUser.amount} credits`,
      });
      if (txnErr) throw txnErr;

      setManualMsg({ type: "success", text: `✅ ${manualUser.amount} credits added to ${manualUser.email}` });
      setManualUser({ email: "", amount: "", note: "" });
      await loadAll();
    } catch (e) {
      setManualMsg({ type: "error", text: "Failed: " + (e?.message || e?.details || "Unknown error") });
    }
  }

  const filteredReqList = requests.filter(r => filter === "all" ? true : r.status === filter);

  if (loading) return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", border: "3px solid #E2E8F0", borderTopColor: "#2563EB", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "calc(100vh - 64px)" }}>
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0D0630 100%)", padding: "28px 24px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#EF4444", background: "rgba(239,68,68,0.2)", padding: "2px 10px", borderRadius: 999, letterSpacing: "0.1em", marginBottom: 6, display: "inline-block" }}>ADMIN</span>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: "#fff", margin: 0 }}>OpsTools Dashboard</h1>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {["dashboard", "requests", "users"].map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ padding: "8px 16px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer", border: activeTab === t ? "1.5px solid #60A5FA" : "1.5px solid rgba(255,255,255,0.15)", background: activeTab === t ? "rgba(96,165,250,0.15)" : "transparent", color: activeTab === t ? "#60A5FA" : "rgba(255,255,255,0.6)", textTransform: "capitalize" }}>
                {t}{t === "requests" && pendingReqs > 0 && <span style={{ marginLeft: 6, background: "#EF4444", color: "#fff", fontSize: 10, fontWeight: 700, padding: "1px 6px", borderRadius: 999 }}>{pendingReqs}</span>}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "28px 24px 64px" }}>

        {activeTab === "dashboard" && (
          <>
            <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
              {RANGES.map(r => (
                <button key={r} onClick={() => setRange(r)} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: range === r ? "1.5px solid #2563EB" : "1.5px solid #E2E8F0", background: range === r ? "#EFF6FF" : "#fff", color: range === r ? "#2563EB" : "#64748B" }}>
                  {RANGE_LABELS[r]}
                </button>
              ))}
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 14, marginBottom: 28 }}>
              <StatCard label="Total PDF Saves" value={totalSaves} sub={`${periodSaves} in period`} accent="#2563EB" bg="#EFF6FF" />
              <StatCard label="Total Users" value={totalUsers} sub={`${verifiedUsers} verified`} accent="#7C3AED" bg="#F5F3FF" />
              <StatCard label="New Signups" value={periodSignups} sub={RANGE_LABELS[range]} accent="#059669" bg="#F0FDF4" />
              <StatCard label="Credits Approved" value={approvedCredits} sub="All time" accent="#D97706" bg="#FFFBEB" />
              <StatCard label="Pending Requests" value={pendingReqs} sub="Needs review" accent="#EF4444" bg="#FEF2F2" />
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="PDF Saves Over Time">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={savesOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} />
                    <Line type="monotone" dataKey="count" stroke="#2563EB" strokeWidth={2} dot={false} name="Saves" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="New Signups Over Time">
                <ResponsiveContainer width="100%" height={220}>
                  <LineChart data={signupsOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                    <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
                    <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} />
                    <Line type="monotone" dataKey="count" stroke="#7C3AED" strokeWidth={2} dot={false} name="Signups" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 20 }}>
              <ChartCard title="Top Templates Used">
                <ResponsiveContainer width="100%" height={240}>
                  <BarChart data={topTemplates} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                    <XAxis type="number" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 10, fill: "#64748B" }} tickLine={false} axisLine={false} width={110} />
                    <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} />
                    <Bar dataKey="count" radius={[0, 4, 4, 0]} name="Saves">
                      {topTemplates.map((_, i) => <Cell key={i} fill={TEMPLATE_COLORS[i % TEMPLATE_COLORS.length]} />)}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Credits Requested vs Approved">
                {creditsOverTime.length > 0 ? (
                  <ResponsiveContainer width="100%" height={240}>
                    <BarChart data={creditsOverTime}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                      <XAxis dataKey="label" tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: "#94A3B8" }} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid #E2E8F0" }} />
                      <Legend wrapperStyle={{ fontSize: 11 }} />
                      <Bar dataKey="requested" fill="#FDE68A" name="Requested" radius={[3, 3, 0, 0]} />
                      <Bar dataKey="approved" fill="#059669" name="Approved" radius={[3, 3, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div style={{ height: 240, display: "flex", alignItems: "center", justifyContent: "center", color: "#94A3B8", fontSize: 13 }}>No credit requests in this period</div>
                )}
              </ChartCard>
            </div>
          </>
        )}

        {activeTab === "requests" && (
          <>
            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 24 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: "0 0 16px" }}>Manual Credit Grant</h2>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 1fr auto", gap: 10, alignItems: "end" }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>User Email</label>
                  <input value={manualUser.email} onChange={e => setManualUser(p => ({ ...p, email: e.target.value }))} placeholder="user@example.com" style={{ width: "100%", height: 38, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 10px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Credits</label>
                  <input type="number" value={manualUser.amount} onChange={e => setManualUser(p => ({ ...p, amount: e.target.value }))} placeholder="100" style={{ width: "100%", height: 38, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 10px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Note</label>
                  <input value={manualUser.note} onChange={e => setManualUser(p => ({ ...p, note: e.target.value }))} placeholder="Reason" style={{ width: "100%", height: 38, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 10px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
                </div>
                <button onClick={handleManualGrant} style={{ height: 38, padding: "0 20px", borderRadius: 8, background: "linear-gradient(135deg,#2563EB,#4F46E5)", color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer" }}>Grant</button>
              </div>
              {manualMsg && <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: manualMsg.type === "success" ? "#F0FDF4" : "#FEF2F2", color: manualMsg.type === "success" ? "#065F46" : "#991B1B", fontSize: 13 }}>{manualMsg.text}</div>}
            </div>

            <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
                <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>Credit Requests</h2>
                <div style={{ display: "flex", gap: 6 }}>
                  {["pending", "approved", "rejected", "all"].map(f => (
                    <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: filter === f ? "1.5px solid #2563EB" : "1.5px solid #E2E8F0", background: filter === f ? "#EFF6FF" : "#fff", color: filter === f ? "#2563EB" : "#64748B", textTransform: "capitalize" }}>{f}</button>
                  ))}
                </div>
              </div>
              {filteredReqList.length === 0 ? (
                <div style={{ textAlign: "center", padding: "40px", color: "#94A3B8", fontSize: 14 }}>No {filter} requests</div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filteredReqList.map(req => (
                    <div key={req.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: req.status === "pending" ? "#FFFBEB" : "#F8FAFC", borderRadius: 12, border: `1px solid ${req.status === "pending" ? "#FDE68A" : "#E2E8F0"}` }}>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                          <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{req.profiles?.email || req.user_id?.slice(0, 8) + "..."}</span>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: req.status === "pending" ? "#FEF3C7" : req.status === "approved" ? "#D1FAE5" : "#FEE2E2", color: req.status === "pending" ? "#92400E" : req.status === "approved" ? "#065F46" : "#991B1B" }}>{req.status.toUpperCase()}</span>
                        </div>
                        <div style={{ fontSize: 12, color: "#64748B" }}>
                          {req.amount} credits · {new Date(req.requested_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                          {req.resolved_at && ` · Resolved ${new Date(req.resolved_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                        </div>
                      </div>
                      {req.status === "pending" && (
                        <div style={{ display: "flex", gap: 8 }}>
                          <button onClick={() => handleApprove(req)} disabled={processing === req.id} style={{ padding: "8px 16px", borderRadius: 8, background: "#059669", color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", opacity: processing === req.id ? 0.6 : 1 }}>{processing === req.id ? "..." : "✓ Approve"}</button>
                          <button onClick={() => handleReject(req)} disabled={processing === req.id} style={{ padding: "8px 16px", borderRadius: 8, background: "#FEF2F2", color: "#DC2626", fontSize: 13, fontWeight: 700, border: "1px solid #FCA5A5", cursor: "pointer" }}>✕ Reject</button>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === "users" && (
          <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
              <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>All Users ({allProfiles.length})</h2>
              <span style={{ fontSize: 12, color: "#64748B" }}>{verifiedUsers} verified · {allProfiles.length - verifiedUsers} unverified</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {allProfiles.map(p => (
                <div key={p.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 16px", background: "#F8FAFC", borderRadius: 10, border: "1px solid #E2E8F0" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg,#2563EB,#4F46E5)", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{p.email?.[0]?.toUpperCase()}</div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{p.email}</div>
                      <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>Joined {new Date(p.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 999, background: p.email_verified === "verified" ? "#D1FAE5" : "#FEF3C7", color: p.email_verified === "verified" ? "#065F46" : "#92400E" }}>
                      {p.email_verified === "verified" ? "✓ Verified" : "Unverified"}
                    </span>
                    <span style={{ fontSize: 11, color: "#64748B" }}>
                      {allSaves.filter(s => s.user_id === p.id).length} saves
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
