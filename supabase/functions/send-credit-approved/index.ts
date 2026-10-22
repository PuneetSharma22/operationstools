import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// Fired directly from admin_grant_credits() right after it approves a
// credit_requests row — never directly reachable by a browser. Gated by
// WEBHOOK_SECRET the same way send-welcome-email is.
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const WEBHOOK_SECRET = Deno.env.get("WEBHOOK_SECRET");
const SITE_URL = "https://www.opstools.ai";

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleDateString("en-IN", {
      day: "numeric", month: "short", year: "numeric", timeZone: "Asia/Kolkata",
    });
  } catch {
    return "—";
  }
}

function approvedHtml({ amount, newBalance }) {
  const balanceRow = typeof newBalance === "number"
    ? `<td style="width:50%;text-align:right;">
        <div style="font-size:10px;font-weight:700;color:#15803D;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px;">New balance</div>
        <div style="font-size:24px;font-weight:800;color:#0F172A;">${newBalance}</div>
      </td>`
    : "";
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(160deg,#07011F 0%,#0D0630 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
    <div style="width:56px;height:56px;background:rgba(34,197,94,0.15);border:1px solid rgba(34,197,94,0.4);border-radius:50%;margin:0 auto 16px;font-size:26px;line-height:54px;text-align:center;">✅</div>
    <div style="font-size:11px;font-weight:700;color:#A5B4FC;text-transform:uppercase;letter-spacing:0.1em;margin-bottom:8px;">Request approved</div>
    <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0;letter-spacing:-0.02em;line-height:1.3;">${amount} credits added</h1>
  </td></tr>
  <tr><td style="background:#fff;padding:40px;border-left:1px solid #E2E8F0;border-right:1px solid #E2E8F0;">
    <p style="color:#374151;font-size:15px;line-height:1.75;margin:0 0 24px;">Good news — your credit request has been approved and the credits are live on your account.</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:12px;padding:20px;margin-bottom:28px;">
      <tr><td>
        <table width="100%" cellpadding="0" cellspacing="0"><tr>
          <td style="width:50%;">
            <div style="font-size:10px;font-weight:700;color:#15803D;text-transform:uppercase;letter-spacing:0.06em;margin-bottom:5px;">Credits added</div>
            <div style="font-size:24px;font-weight:800;color:#0F172A;">+${amount}</div>
          </td>
          ${balanceRow}
        </tr></table>
      </td></tr>
    </table>
    <table cellpadding="0" cellspacing="0"><tr><td style="background:linear-gradient(135deg,#2563EB,#4F46E5);border-radius:10px;">
      <a href="${SITE_URL}/account" style="display:inline-block;color:#fff;font-size:14px;font-weight:700;padding:13px 28px;text-decoration:none;">View account →</a>
    </td></tr></table>
    <p style="color:#94A3B8;font-size:12px;margin:20px 0 0;">Approved on ${formatDate(new Date().toISOString())}</p>
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
    if (!record?.email || !record?.amount) {
      return new Response("Missing recipient data", { status: 200 });
    }

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "OpsTools <hello@opstools.ai>",
        to: [record.email],
        subject: `${record.amount} credits added to your OpsTools account`,
        html: approvedHtml({ amount: record.amount, newBalance: record.new_balance }),
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify({ success: true, data }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
