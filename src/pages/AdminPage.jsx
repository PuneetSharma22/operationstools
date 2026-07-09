import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../supabase";

const ADMIN_EMAIL = "punitshrma769@gmail.com";

export default function AdminPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [stats, setStats] = useState({ pending: 0, approved: 0, totalCredits: 0, totalUsers: 0, totalSaves: 0 });
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(null);
  const [filter, setFilter] = useState("pending");
  const [manualUser, setManualUser] = useState({ email: "", amount: "", note: "" });
  const [manualMsg, setManualMsg] = useState(null);

  useEffect(() => {
    if (!user) { navigate("/login"); return; }
    if (user.email !== ADMIN_EMAIL) { navigate("/"); return; }
    loadAll();
  }, [user]);

  async function loadAll() {
    setLoading(true);
    try {
      // All requests
      const { data: reqs } = await supabase
        .from("credit_requests")
        .select("*")
        .order("requested_at", { ascending: false });

      // Get all profiles and merge by user_id
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, email, full_name");

      const profileMap = (profiles || []).reduce((acc, p) => { acc[p.id] = p; return acc; }, {});
      const reqsWithProfiles = (reqs || []).map(r => ({ ...r, profiles: profileMap[r.user_id] || null }));
      setRequests(reqsWithProfiles);

      // Stats
      const pending = (reqs || []).filter(r => r.status === "pending").length;
      const approved = (reqs || []).filter(r => r.status === "approved").length;
      const totalCredits = (reqs || []).filter(r => r.status === "approved").reduce((s, r) => s + r.amount, 0);

      const { count: userCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
      const { count: saveCount } = await supabase.from("save_requests").select("*", { count: "exact", head: true });

      setStats({ pending, approved, totalCredits, totalUsers: userCount || 0, totalSaves: saveCount || 0 });
    } catch (e) { console.error(e); }
    setLoading(false);
  }

  async function handleApprove(req) {
    setProcessing(req.id);
    try {
      // Update request status
      await supabase.from("credit_requests").update({
        status: "approved",
        resolved_at: new Date().toISOString(),
        resolved_by: user.id,
      }).eq("id", req.id);

      // Add credits to user balance
      const { data: existing } = await supabase
        .from("user_credits").select("balance").eq("user_id", req.user_id).maybeSingle();

      if (existing) {
        await supabase.from("user_credits").update({ balance: existing.balance + req.amount, updated_at: new Date().toISOString() }).eq("user_id", req.user_id);
      } else {
        await supabase.from("user_credits").insert({ user_id: req.user_id, balance: req.amount });
      }

      // Log transaction
      await supabase.from("credit_transactions").insert({
        user_id: req.user_id,
        type: "credit_request_approved",
        amount: req.amount,
        description: `Credit request approved — ${req.amount} credits added`,
      });

      await loadAll();
    } catch (e) { console.error(e); }
    setProcessing(null);
  }

  async function handleReject(req) {
    setProcessing(req.id);
    try {
      await supabase.from("credit_requests").update({
        status: "rejected",
        resolved_at: new Date().toISOString(),
        resolved_by: user.id,
      }).eq("id", req.id);
      await loadAll();
    } catch (e) { console.error(e); }
    setProcessing(null);
  }

  async function handleManualGrant() {
    if (!manualUser.email || !manualUser.amount) return;
    setManualMsg(null);
    try {
      // Find user by email
      const { data: profile } = await supabase
        .from("profiles").select("id").eq("email", manualUser.email).maybeSingle();

      if (!profile) {
        setManualMsg({ type: "error", text: "User not found with that email." });
        return;
      }

      const { data: existing } = await supabase
        .from("user_credits").select("balance").eq("user_id", profile.id).maybeSingle();

      if (existing) {
        await supabase.from("user_credits").update({ balance: existing.balance + Number(manualUser.amount), updated_at: new Date().toISOString() }).eq("user_id", profile.id);
      } else {
        await supabase.from("user_credits").insert({ user_id: profile.id, balance: Number(manualUser.amount) });
      }

      await supabase.from("credit_transactions").insert({
        user_id: profile.id,
        type: "manual_grant",
        amount: Number(manualUser.amount),
        description: manualUser.note || `Manual credit grant by admin — ${manualUser.amount} credits`,
      });

      setManualMsg({ type: "success", text: `✅ ${manualUser.amount} credits added to ${manualUser.email}` });
      setManualUser({ email: "", amount: "", note: "" });
      await loadAll();
    } catch (e) {
      setManualMsg({ type: "error", text: "Failed: " + e.message });
    }
  }

  const filtered = requests.filter(r => filter === "all" ? true : r.status === filter);

  if (loading) return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #E2E8F0", borderTopColor: "#2563EB", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "calc(100vh - 64px)" }}>
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0D0630 100%)", padding: "32px 24px" }}>
        <div style={{ maxWidth: 1000, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
            <span style={{ fontSize: 10, fontWeight: 700, color: "#EF4444", background: "rgba(239,68,68,0.2)", padding: "2px 10px", borderRadius: 999, letterSpacing: "0.1em" }}>ADMIN</span>
          </div>
          <h1 style={{ fontSize: 24, fontWeight: 800, color: "#fff", margin: 0 }}>OpsTools Admin</h1>
        </div>
      </section>

      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "32px 24px 64px" }}>

        {/* Stats */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 14, marginBottom: 32 }}>
          {[
            { label: "Pending Requests", value: stats.pending, color: "#D97706", bg: "#FFFBEB" },
            { label: "Approved Requests", value: stats.approved, color: "#059669", bg: "#F0FDF4" },
            { label: "Credits Granted", value: stats.totalCredits, color: "#2563EB", bg: "#EFF6FF" },
            { label: "Total Users", value: stats.totalUsers, color: "#7C3AED", bg: "#F5F3FF" },
            { label: "Total PDF Saves", value: stats.totalSaves, color: "#0891B2", bg: "#ECFEFF" },
          ].map(s => (
            <div key={s.label} style={{ background: s.bg, borderRadius: 14, padding: "16px 18px", border: `1px solid ${s.color}20` }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: s.color, textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 6 }}>{s.label}</div>
              <div style={{ fontSize: 28, fontWeight: 900, color: "#0F172A" }}>{s.value}</div>
            </div>
          ))}
        </div>

        {/* Manual grant */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: "0 0 16px" }}>Manual Credit Grant</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 120px 1fr auto", gap: 10, alignItems: "end" }}>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>User Email</label>
              <input value={manualUser.email} onChange={e => setManualUser(p => ({ ...p, email: e.target.value }))} placeholder="user@example.com"
                style={{ width: "100%", height: 38, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 10px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Credits</label>
              <input type="number" value={manualUser.amount} onChange={e => setManualUser(p => ({ ...p, amount: e.target.value }))} placeholder="100"
                style={{ width: "100%", height: 38, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 10px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <div>
              <label style={{ fontSize: 11, fontWeight: 600, color: "#64748B", display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Note (optional)</label>
              <input value={manualUser.note} onChange={e => setManualUser(p => ({ ...p, note: e.target.value }))} placeholder="Reason for grant"
                style={{ width: "100%", height: 38, border: "1.5px solid #E2E8F0", borderRadius: 8, padding: "0 10px", fontSize: 13, outline: "none", boxSizing: "border-box" }} />
            </div>
            <button onClick={handleManualGrant} style={{ height: 38, padding: "0 20px", borderRadius: 8, background: "linear-gradient(135deg,#2563EB,#4F46E5)", color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", whiteSpace: "nowrap" }}>
              Grant Credits
            </button>
          </div>
          {manualMsg && (
            <div style={{ marginTop: 10, padding: "10px 14px", borderRadius: 8, background: manualMsg.type === "success" ? "#F0FDF4" : "#FEF2F2", color: manualMsg.type === "success" ? "#065F46" : "#991B1B", fontSize: 13, fontWeight: 500 }}>
              {manualMsg.text}
            </div>
          )}
        </div>

        {/* Requests */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #E2E8F0", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", margin: 0 }}>Credit Requests</h2>
            <div style={{ display: "flex", gap: 6 }}>
              {["pending", "approved", "rejected", "all"].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", border: filter === f ? "1.5px solid #2563EB" : "1.5px solid #E2E8F0", background: filter === f ? "#EFF6FF" : "#fff", color: filter === f ? "#2563EB" : "#64748B", textTransform: "capitalize" }}>
                  {f}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#94A3B8", fontSize: 14 }}>No {filter} requests</div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {filtered.map(req => (
                <div key={req.id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px", background: req.status === "pending" ? "#FFFBEB" : "#F8FAFC", borderRadius: 12, border: `1px solid ${req.status === "pending" ? "#FDE68A" : "#E2E8F0"}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{req.profiles?.email || req.user_id?.slice(0, 8) + "..."}</span>
                      <span style={{ fontSize: 11, fontWeight: 700, padding: "2px 8px", borderRadius: 999, background: req.status === "pending" ? "#FEF3C7" : req.status === "approved" ? "#D1FAE5" : "#FEE2E2", color: req.status === "pending" ? "#92400E" : req.status === "approved" ? "#065F46" : "#991B1B" }}>
                        {req.status.toUpperCase()}
                      </span>
                    </div>
                    <div style={{ fontSize: 12, color: "#64748B" }}>
                      {req.amount} credits · Requested {new Date(req.requested_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                      {req.resolved_at && ` · Resolved ${new Date(req.resolved_at).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`}
                    </div>
                  </div>
                  {req.status === "pending" && (
                    <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                      <button onClick={() => handleApprove(req)} disabled={processing === req.id} style={{ padding: "8px 16px", borderRadius: 8, background: "#059669", color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: "pointer", opacity: processing === req.id ? 0.6 : 1 }}>
                        {processing === req.id ? "..." : "✓ Approve"}
                      </button>
                      <button onClick={() => handleReject(req)} disabled={processing === req.id} style={{ padding: "8px 16px", borderRadius: 8, background: "#FEF2F2", color: "#DC2626", fontSize: 13, fontWeight: 700, border: "1px solid #FCA5A5", cursor: "pointer" }}>
                        ✕ Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
