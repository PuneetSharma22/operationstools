import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Fired by the on_credit_request_created trigger the instant a row lands in
// credit_requests — never directly reachable by a browser. Gated by
// WEBHOOK_SECRET the same way send-welcome-email is.
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const SITE_URL = "https://www.opstools.ai";

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function formatDate(iso) {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata",
    });
  } catch {
    return "—";
  }
}

function requestHtml({ requesterEmail, amount, requestedAt, pendingCount }) {
  const safeEmail = escapeHtml(requesterEmail);
  const queueNote = pendingCount > 1
    ? `<p style="color:#94A3B8;font-size:13px;margin:16px 0 0;">${pendingCount - 1} other request${pendingCount - 1 === 1 ? "" : "s"} also waiting on review.</p>`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(160deg,#07011F 0%,#0D0630 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
    <table width="100%" cellpadding="0" cellspacing="0"><tr>
      <td style="font-size:11px;font-weight:700;color:#A5B4FC;text-transform:uppercase;letter-spacing:0.1em;">Credit request</td>
      <td style="text-align:right;"><span style="display:inline-block;background:#FEF3C7;color:#92400E;font-size:10px;font-weight:800;text-transform:uppercase;letter-spacing:0.05em;padding:4px 10px;border-radius:999px;">Pending</span></td>
    </tr></table>
    <h1 style="color:#fff;font-size:26px;font-weight:800;margin:14px 0 0;letter-spacing:-0.02em;line-height:1.3;">${amount} credits requested</h1>
  </td></tr>
  <tr><td style="background:#fff;padding:40px;border-left:1px solid #E2E8F0;border-right:1px solid #E2E8F0;">
    <p style="color:#374151;font-size:15px;line-height:1.75;margin:0 0 24px;">A user is waiting on your approval to add credits to their account.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;margin-bottom:28px;">
      <tr><td style="padding:18px 20px;border-bottom:1px solid #E2E8F0;">
        <div style="font-size:10px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px;">Requested by</div>
        <div style="font-size:15px;font-weight:700;color:#0F172A;">${safeEmail}</div>
      </td></tr>
      <tr><td style="padding:18px 20px;">
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="width:50%;">
            <div style="font-size:10px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px;">Amount</div>
            <div style="font-size:18px;font-weight:800;color:#0F172A;">${amount} credits</div>
          </td>
          <td style="width:50%;">
            <div style="font-size:10px;font-weight:700;color:#94A3B8;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px;">Requested on</div>
            <div style="font-size:14px;font-weight:600;color:#0F172A;">${formatDate(requestedAt)}</div>
          </td>
        </tr></table>
      </td></tr>
    </table>
    <table cellpadding="0" cellspacing="0"><tr><td style="background:linear-gradient(135deg,#2563EB,#4F46E5);border-radius:10px;">
      <a href="${SITE_URL}/admin" style="display:inline-block;color:#fff;font-size:14px;font-weight:700;padding:13px 28px;text-decoration:none;">Review request →</a>
    </td></tr></table>
    ${queueNote}
  </td></tr>
  <tr><td style="background:#F8FAFC;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
    <p style="color:#94A3B8;font-size:12px;margin:0;">OpsTools · Free business document tools for India</p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

serve(async (req) => {
  if (!WEBHOOK_SECRET || req.headers.get("x-webhook-secret") !== WEBHOOK_SECRET) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    const payload = await req.json();
    const record = payload.record;
    if (!record?.user_id || !record?.amount) {
      return new Response("Missing request data", { status: 200 });
    }

    const restHeaders = {
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
      "Content-Type": "application/json",
    };

    const requesterRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?select=email&id=eq.${record.user_id}`,
      { headers: restHeaders }
    );
    const requesterRows = await requesterRes.json();
    const requesterEmail = requesterRows[0]?.email;
    if (!requesterEmail) return new Response("Requester has no email", { status: 200 });

    const adminsRes = await fetch(
      `${SUPABASE_URL}/rest/v1/profiles?select=email&is_admin=eq.true&email=not.is.null`,
      { headers: restHeaders }
    );
    const admins = await adminsRes.json();
    if (!Array.isArray(admins) || admins.length === 0) {
      return new Response("No admin recipients found", { status: 200 });
    }

    const pendingRes = await fetch(
      `${SUPABASE_URL}/rest/v1/credit_requests?select=id&status=eq.pending`,
      { headers: { ...restHeaders, Prefer: "count=exact" } }
    );
    const pendingCount = Number(pendingRes.headers.get("content-range")?.split("/")[1]) || 1;

    const html = requestHtml({ requesterEmail, amount: record.amount, requestedAt: record.requested_at, pendingCount });
    const results = [];
    for (const admin of admins) {
      const res = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: "OpsTools <hello@opstools.ai>",
          to: [admin.email],
          subject: `Credit request: ${record.amount} credits from ${requesterEmail}`,
          html,
        }),
      });
      results.push(await res.json());
    }

    return new Response(JSON.stringify({ success: true, notified: admins.length, results }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
