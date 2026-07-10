import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");

serve(async (req) => {
  try {
    const payload = await req.json();
    const record = payload.record;
    const oldRecord = payload.old_record;

    // Only fire when email_confirmed_at is newly set
    if (!record?.email_confirmed_at || oldRecord?.email_confirmed_at) {
      return new Response("Not a confirmation event", { status: 200 });
    }

    const userEmail = record.email;
    if (!userEmail) return new Response("No email", { status: 200 });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "OpsTools <hello@opstools.ai>",
        to: [userEmail],
        subject: "Welcome to OpsTools 🎉 — Your account is ready",
        html: WELCOME_HTML,
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

const WELCOME_HTML = `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/></head>
<body style="margin:0;padding:0;background:#F8FAFC;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;padding:40px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">
  <tr><td style="background:linear-gradient(160deg,#07011F 0%,#0D0630 100%);border-radius:16px 16px 0 0;padding:40px;text-align:center;">
    <div style="font-size:36px;margin-bottom:12px;">🎉</div>
    <h1 style="color:#fff;font-size:24px;font-weight:800;margin:0 0 10px;letter-spacing:-0.02em;">Welcome to OpsTools!</h1>
    <p style="color:#94A3B8;font-size:15px;margin:0;line-height:1.6;">Your account is verified. 19 free tools are ready to use.</p>
  </td></tr>
  <tr><td style="background:#fff;padding:40px;border-left:1px solid #E2E8F0;border-right:1px solid #E2E8F0;">
    <p style="color:#374151;font-size:15px;line-height:1.75;margin:0 0 28px;">Hi there 👋<br/><br/>Thanks for joining OpsTools. Here are the most popular tools to get you started:</p>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
      <tr><td style="padding-bottom:10px;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:14px;"><tr>
        <td style="width:36px;height:36px;background:#EDE9FE;border-radius:8px;text-align:center;vertical-align:middle;font-size:18px;">🧾</td>
        <td style="padding-left:12px;vertical-align:middle;"><div style="font-size:13px;font-weight:700;color:#0F172A;">GST Invoice Generator</div><div style="font-size:11px;color:#64748B;">CGST/SGST/IGST · HSN codes</div></td>
        <td style="text-align:right;"><a href="https://www.opstools.ai/documents/gst-invoice" style="background:linear-gradient(135deg,#2563EB,#4F46E5);color:#fff;font-size:11px;font-weight:700;padding:6px 12px;border-radius:7px;text-decoration:none;">Open →</a></td>
      </tr></table></td></tr>
      <tr><td style="padding-bottom:10px;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:14px;"><tr>
        <td style="width:36px;height:36px;background:#FCE7F3;border-radius:8px;text-align:center;vertical-align:middle;font-size:18px;">💼</td>
        <td style="padding-left:12px;vertical-align:middle;"><div style="font-size:13px;font-weight:700;color:#0F172A;">Salary Slip Generator</div><div style="font-size:11px;color:#64748B;">CTC · PF · TDS · Net pay</div></td>
        <td style="text-align:right;"><a href="https://www.opstools.ai/documents/salary-slip" style="background:linear-gradient(135deg,#2563EB,#4F46E5);color:#fff;font-size:11px;font-weight:700;padding:6px 12px;border-radius:7px;text-decoration:none;">Open →</a></td>
      </tr></table></td></tr>
      <tr><td style="padding-bottom:10px;"><table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:14px;"><tr>
        <td style="width:36px;height:36px;background:#DBEAFE;border-radius:8px;text-align:center;vertical-align:middle;font-size:18px;">⛽</td>
        <td style="padding-left:12px;vertical-align:middle;"><div style="font-size:13px;font-weight:700;color:#0F172A;">Fuel Bill Generator</div><div style="font-size:11px;color:#64748B;">IOCL · POS · Thermal formats</div></td>
        <td style="text-align:right;"><a href="https://www.opstools.ai/documents/fuel-bill" style="background:linear-gradient(135deg,#2563EB,#4F46E5);color:#fff;font-size:11px;font-weight:700;padding:6px 12px;border-radius:7px;text-decoration:none;">Open →</a></td>
      </tr></table></td></tr>
      <tr><td><table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border:1px solid #E2E8F0;border-radius:12px;padding:14px;"><tr>
        <td style="width:36px;height:36px;background:#D1FAE5;border-radius:8px;text-align:center;vertical-align:middle;font-size:18px;">🏠</td>
        <td style="padding-left:12px;vertical-align:middle;"><div style="font-size:13px;font-weight:700;color:#0F172A;">Rent Receipt Generator</div><div style="font-size:11px;color:#64748B;">HRA-compliant · Landlord PAN</div></td>
        <td style="text-align:right;"><a href="https://www.opstools.ai/documents/rent-receipt" style="background:linear-gradient(135deg,#2563EB,#4F46E5);color:#fff;font-size:11px;font-weight:700;padding:6px 12px;border-radius:7px;text-decoration:none;">Open →</a></td>
      </tr></table></td></tr>
    </table>
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;"><tr>
      <td style="background:linear-gradient(135deg,#07011F,#0D0630);border-radius:12px;padding:20px;text-align:center;">
        <p style="color:#94A3B8;font-size:13px;margin:0 0 12px;">19 tools live · All free · No login needed for most</p>
        <a href="https://www.opstools.ai/documents" style="background:linear-gradient(135deg,#2563EB,#4F46E5);color:#fff;font-size:14px;font-weight:700;padding:12px 28px;border-radius:10px;text-decoration:none;display:inline-block;">Browse all tools →</a>
      </td>
    </tr></table>
    <p style="color:#64748B;font-size:13px;line-height:1.75;margin:0;">Questions? Reply to this email or write to <a href="mailto:hello@opstools.ai" style="color:#2563EB;text-decoration:none;font-weight:600;">hello@opstools.ai</a>. We read every message.</p>
  </td></tr>
  <tr><td style="background:#F8FAFC;border:1px solid #E2E8F0;border-top:none;border-radius:0 0 16px 16px;padding:24px 40px;text-align:center;">
    <p style="color:#94A3B8;font-size:12px;margin:0 0 8px;">OpsTools · Free business document tools for India</p>
    <p style="margin:0;"><a href="https://www.opstools.ai" style="color:#2563EB;font-size:12px;text-decoration:none;font-weight:600;">opstools.ai</a><span style="color:#E2E8F0;margin:0 8px;">·</span><a href="mailto:hello@opstools.ai" style="color:#64748B;font-size:12px;text-decoration:none;">hello@opstools.ai</a></p>
  </td></tr>
</table>
</td></tr>
</table>
</body>
</html>`;
