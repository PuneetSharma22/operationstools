import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

function Callout({ icon, title, children, color = "#EFF6FF", borderColor = "#2563EB" }) {
  return (
    <div style={{ background: color, border: `1px solid ${borderColor}30`, borderLeft: `4px solid ${borderColor}`, borderRadius: 10, padding: "16px 20px", margin: "24px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 18 }}>{icon}</span>
        <span style={{ fontSize: 13, fontWeight: 700, color: borderColor, textTransform: "uppercase", letterSpacing: "0.06em" }}>{title}</span>
      </div>
      <div style={{ fontSize: 14, color: "#374151", lineHeight: 1.7 }}>{children}</div>
    </div>
  );
}

function Step({ number, title, children }) {
  return (
    <div style={{ display: "flex", gap: 16, marginBottom: 28 }}>
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#0891B2,#0E7490)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>{number}</div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>{title}</h3>
        <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>{children}</div>
      </div>
    </div>
  );
}

export default function EInvoiceBlog() {
  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <Helmet>
        <title>How to Generate a GST E-Invoice Reference Online in India (2026) | OpsTools</title>
        <meta name="description" content="Learn how to lay out a GST e-invoice with IRN and acknowledgement number fields on a properly formatted reference document — free, no login, instant PDF." />
        <meta property="og:title" content="How to Generate a GST E-Invoice Reference Online in India (2026) | OpsTools" />
        <meta property="og:description" content="Learn how to lay out a GST e-invoice with IRN and acknowledgement number fields on a properly formatted reference document — free, no login, instant PDF." />
        <meta property="og:url" content="https://www.opstools.ai/blogs/how-to-generate-e-invoice-online-india" />
        <link rel="canonical" href="https://www.opstools.ai/blogs/how-to-generate-e-invoice-online-india" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#083344 55%,#0e7490 100%)", padding: "72px 24px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748B", display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#334155" }}>›</span>
            <Link to="/blogs" style={{ color: "#64748B", textDecoration: "none" }}>Blog</Link>
            <span style={{ color: "#334155" }}>›</span>
            <span style={{ color: "#94A3B8" }}>E-Invoice Guide</span>
          </nav>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(8,145,178,0.2)", border: "1px solid rgba(8,145,178,0.3)", color: "#67E8F9", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 999, marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>Guide</div>
            <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              How to Generate a GST E-Invoice Reference Online in India (2026)
            </h1>
            <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 24px" }}>
              A complete guide to laying out a GST e-invoice — what the IRN and acknowledgement number actually are, which businesses are mandated to use e-invoicing, and how to generate a properly formatted reference document for free.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#64748B", flexWrap: "wrap" }}>
              <span>Prajay Bangar</span><span>·</span><span>October 22, 2026</span><span>·</span><span>7 min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
          {[
            ["IRN", "Issued by the IRP", "#CFFAFE", "#0891B2"],
            ["Ack Number", "Returned with the IRN", "#DBEAFE", "#2563EB"],
            ["QR Code", "Included on the invoice", "#EDE9FE", "#7C3AED"],
            ["Cost", "100% Free", "#D1FAE5", "#059669"],
          ].map(([l,v,bg,c])=>(
            <div key={l} style={{ background: bg, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: c }}>{l}</div>
              <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          If your business falls under the GST e-invoicing mandate, registering an invoice on the government's Invoice Registration Portal (IRP) is only half the job. Once the IRP hands back an Invoice Reference Number (IRN), an acknowledgement number, and a QR code, you still need a proper document that lays all of it out the way an e-invoice is expected to look — for your buyer, your auditor, and your own records.
        </p>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          This guide explains what an e-invoice actually is under GST, what the IRN and acknowledgement number mean, which businesses are required to use e-invoicing, and how to generate a clean, print-ready e-invoice reference document once you have your IRP data in hand.
        </p>

        <Callout icon="✅" title="Quick answer" color="#ECFEFF" borderColor="#0891B2">
          Go to <Link to="/documents/e-invoice" style={{ color: "#0891B2", fontWeight: 600 }}>opstools.ai/documents/e-invoice</Link>, fill in your invoice, supplier, buyer and line-item details, paste in the IRN, acknowledgement number and QR data you received from the IRP, and download the formatted e-invoice as a PDF. No login, no subscription, no cost.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What is an E-Invoice Under GST?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          An e-invoice (electronic invoice) is a GST invoice that has been registered on the government's Invoice Registration Portal, which validates it and returns an Invoice Reference Number (IRN) and a QR code. E-invoicing is mandatory for businesses above a specified annual turnover under Indian GST rules.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          It's worth being clear about what generates what: the IRP is the only source of a valid IRN, acknowledgement number, and QR code — no third-party tool can create or register these. What a formatting tool can do is take the data you already received from the IRP and lay it out on a properly structured invoice, alongside your supplier, buyer, and line-item details.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>Who Needs This</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {[
            { title: "Businesses under the e-invoicing mandate", desc: "Lay out your registered invoice with IRN, acknowledgement number, and QR code in the expected format." },
            { title: "Accounts teams", desc: "Generate consistent, properly formatted e-invoices for every transaction without rebuilding the layout each time." },
            { title: "GST compliance records", desc: "Keep a clean, print-ready copy of every e-invoice issued, ready to hand over during an audit or reconciliation." },
          ].map(f => (
            <div key={f.title} style={{ display: "flex", gap: 14, background: "#ECFEFF", borderRadius: 12, padding: "16px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0891B2", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🧾</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What Should an E-Invoice Include?</h2>
        <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Field","Description","Example"].map(h=><th key={h} style={{ padding:"10px 14px", fontSize:12, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"left", borderBottom:"1px solid #E2E8F0" }}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ["IRN","Invoice Reference Number issued by the government IRP","35054cb4d...9f2a1"],
                ["Acknowledgement No.","Ack number returned alongside the IRN","112010001234567"],
                ["QR Code","QR code data issued for the invoice","Base64/encoded QR payload"],
                ["Place of Supply","State where the supply is deemed to occur","Maharashtra"],
                ["Reverse Charge","Whether GST liability shifts to the recipient","Yes / No"],
              ].map(([a,b,c],i)=>(
                <tr key={i} style={{ borderBottom:"1px solid #F1F5F9", background:i%2===0?"#fff":"#FAFAFA" }}>
                  <td style={{ padding:"10px 14px", fontSize:13, fontWeight:600, color:"#0F172A" }}>{a}</td>
                  <td style={{ padding:"10px 14px", fontSize:12, color:"#475569" }}>{b}</td>
                  <td style={{ padding:"10px 14px", fontSize:12, color:"#475569" }}>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>IRN, Acknowledgement Number, and Who Must Use E-Invoicing</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          The <strong>IRN (Invoice Reference Number)</strong> is a unique hash generated by the IRP for every valid invoice submitted to it — it's the identifier that proves a specific invoice was registered with the government. The <strong>acknowledgement number</strong> is issued alongside it as confirmation that the IRP accepted and processed your submission, along with an acknowledgement date and a QR code encoding the key invoice details.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          E-invoicing under GST has been rolled out in phases, starting with the largest taxpayers and progressively extending to businesses with lower annual turnover, as decided by the GST Council. Because the applicable turnover threshold has changed over time and can change again, don't rely on a fixed number — check the current threshold on the official GST portal or with your tax advisor to confirm whether your business is currently required to issue e-invoices.
        </p>

        <Callout icon="⚠️" title="This is a formatting tool, not the IRP" color="#FFFBEB" borderColor="#F59E0B">
          The OpsTools E-Invoice Generator does not generate or register an IRN, acknowledgement number, or QR code — those can only come from the government's Invoice Registration Portal. This tool exists for the step after that: taking the data your IRP submission returned and laying it out on a clean, correctly formatted invoice.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 24px", letterSpacing: "-0.01em" }}>How to Generate an E-Invoice Reference — Step by Step</h2>
        <Step number={1} title="Enter invoice details">Go to <Link to="/documents/e-invoice" style={{ color: "#0891B2", fontWeight: 600 }}>opstools.ai/documents/e-invoice</Link> and fill in the invoice number, date, place of supply, and whether reverse charge applies.</Step>
        <Step number={2} title="Add IRN & QR data">Paste in the IRN, acknowledgement number, ack date, and QR code data you received from the IRP after registering your invoice there.</Step>
        <Step number={3} title="Add supplier & buyer details">Enter both parties' details including GSTIN, so the invoice is complete on both sides.</Step>
        <Step number={4} title="Add line items">List each item or service with quantity, rate, and applicable CGST/SGST or IGST.</Step>
        <Step number={5} title="Preview">Check the live preview — it updates instantly as you fill in each field, so you can catch mistakes before exporting.</Step>
        <Step number={6} title="Download PDF">Click Save PDF to download the finished e-invoice reference document, ready to send or file.</Step>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 20px", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
        {[
          { q: "What is an e-invoice under GST?", a: "An e-invoice is a standard invoice that has been registered on the government's Invoice Registration Portal (IRP), which returns a unique Invoice Reference Number (IRN) and a QR code. It's mandatory for businesses above a certain turnover threshold." },
          { q: "Where do I get the IRN and QR code?", a: "The IRN, acknowledgement number, and QR code are issued by the government's IRP after you submit your invoice there — this tool lets you lay them out on a properly formatted invoice once you have them, it doesn't generate or register them itself." },
          { q: "What is reverse charge on an invoice?", a: "Reverse charge means the recipient, not the supplier, is liable to pay GST on that transaction. Mark it accordingly if applicable to your invoice." },
          { q: "Which businesses are required to use e-invoicing?", a: "E-invoicing has been rolled out in phases based on annual turnover thresholds set by the GST Council, starting with the largest taxpayers and expanding to smaller businesses over time. Check the current threshold on the official GST portal or with your tax advisor, since it can change." },
          { q: "What do I need before I use this tool?", a: "You need your invoice already registered on the IRP, along with the IRN, acknowledgement number, ack date, and QR code it returned. Without those, you can still fill in a regular GST invoice, but it won't count as a registered e-invoice." },
          { q: "Is this generator free?", a: "Yes, completely free with no login required." },
        ].map((faq, i) => (
          <div key={i} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 20px", marginBottom: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Q: {faq.q}</div>
            <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>A: {faq.a}</div>
          </div>
        ))}

        <div style={{ background: "linear-gradient(135deg,#083344,#0e7490)", borderRadius: 16, padding: "32px 28px", textAlign: "center", marginTop: 48, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>Generate your e-invoice reference now</h3>
          <p style={{ fontSize: 14, color: "#67E8F9", margin: "0 0 24px" }}>Free · No login · IRN & QR fields · Live preview · Instant PDF</p>
          <Link to="/documents/e-invoice" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#0891B2,#0E7490)", color: "#fff", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Generate E-Invoice Reference →
          </Link>
        </div>

        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Related Tools</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { name: "GST Invoice Generator", href: "/documents/gst-invoice", desc: "General-purpose GST-compliant invoices" },
              { name: "E-Way Bill Generator", href: "/documents/eway-bill", desc: "GST e-way bill reference document" },
              { name: "Service Invoice Generator", href: "/documents/service-invoice", desc: "Invoices for service-based businesses" },
            ].map(r => (
              <Link key={r.name} to={r.href} style={{ flex: 1, minWidth: 160, background: "#fff", borderRadius: 12, padding: "14px 16px", border: "1px solid #E2E8F0", textDecoration: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{r.name}</span>
                <span style={{ fontSize: 12, color: "#64748B" }}>{r.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
