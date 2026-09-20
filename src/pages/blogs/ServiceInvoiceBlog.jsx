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
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#D97706,#B45309)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>{number}</div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>{title}</h3>
        <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>{children}</div>
      </div>
    </div>
  );
}

export default function ServiceInvoiceBlog() {
  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <Helmet>
        <title>How to Generate a Service Invoice Online in India for Free (2026) | OpsTools</title>
        <meta name="description" content="Complete guide to service invoices for consultants, agencies and freelancers in India — GST and SAC codes for services, per-line tax, payment terms, and free instant PDF download." />
        <meta property="og:title" content="How to Generate a Service Invoice Online in India for Free (2026) | OpsTools" />
        <meta property="og:description" content="Complete guide to service invoices for consultants, agencies and freelancers in India — GST and SAC codes for services, per-line tax, payment terms, and free instant PDF download." />
        <meta property="og:url" content="https://www.opstools.ai/blogs/how-to-generate-service-invoice-online-india" />
        <link rel="canonical" href="https://www.opstools.ai/blogs/how-to-generate-service-invoice-online-india" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>

      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#451a03 55%,#b45309 100%)", padding: "72px 24px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748B", display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#334155" }}>›</span>
            <Link to="/blogs" style={{ color: "#64748B", textDecoration: "none" }}>Blog</Link>
            <span style={{ color: "#334155" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Service Invoice Guide</span>
          </nav>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(217,119,6,0.2)", border: "1px solid rgba(217,119,6,0.3)", color: "#FCD34D", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 999, marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>Guide</div>
            <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              How to Generate a Service Invoice Online in India for Free (2026)
            </h1>
            <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 24px" }}>
              A complete guide to service invoices for consultants, agencies and freelancers — GST on services, per-line tax, payment terms, and how to generate a compliant invoice for free.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#64748B", flexWrap: "wrap" }}>
              <span>Prakash Jha</span><span>·</span><span>September 10, 2026</span><span>·</span><span>6 min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
          {[
            ["Tax Code", "SAC, not HSN", "#FEF3C7", "#D97706"],
            ["GST", "Set per line item", "#DBEAFE", "#2563EB"],
            ["Billing Unit", "Hour, milestone, month", "#EDE9FE", "#7C3AED"],
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
          Consultants, agencies, freelancers and service businesses bill for time and outcomes rather than goods — hours, milestones, retainers, site visits. Yet most free invoice generators are built around products, stock quantities and shipping details that a service business never touches. If you've ever tried to squeeze a monthly retainer or a maintenance visit into a product-invoice template, you know how awkward that gets.
        </p>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          This guide covers what a service invoice needs to include, how GST applies when you're billing for services instead of goods, why payment terms matter more for service businesses than product sellers, and how to generate a clean, GST-ready service invoice for free in under a minute.
        </p>

        <Callout icon="✅" title="Quick answer" color="#FFFBEB" borderColor="#D97706">
          Go to <Link to="/documents/service-invoice" style={{ color: "#D97706", fontWeight: 600 }}>opstools.ai/documents/service-invoice</Link>, add your business and client details, list your services with unit, quantity, rate and GST, and click Save. Download as PDF or PNG — no login, no subscription, no cost.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What is a Service Invoice?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          A service invoice is the bill a service provider issues to a client for work performed — consulting hours, a delivered project milestone, a monthly retainer, a maintenance visit. It lists each service with its quantity, unit, rate and applicable tax, and states the total payable along with the payment terms.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          For GST-registered providers in India, a service invoice doubles as the tax invoice that supports the client's input tax credit claim — which is why the GSTIN, tax rate and invoice number matter as much as the service description itself.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>Who Actually Needs This</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {[
            { title: "Consultants & freelancers", desc: "Bill hourly or per-project work with a clean, professional document instead of a spreadsheet screenshot." },
            { title: "Agencies & studios", desc: "Invoice retainers and milestone deliverables on the same document, each with its own rate." },
            { title: "Maintenance & field services", desc: "Charge per visit or per unit serviced, with quantities and rates spelled out line by line." },
            { title: "Small service businesses", desc: "Issue GST-compliant invoices without paying for accounting software you barely use." },
            { title: "Finance & accounts teams", desc: "Produce consistent, audit-ready service bills that clients can process without follow-up questions." },
          ].map(f => (
            <div key={f.title} style={{ display: "flex", gap: 14, background: "#FFFBEB", borderRadius: 12, padding: "16px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#D97706", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🧾</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What Should a Service Invoice Include?</h2>
        <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Field","Example","Required?"].map(h=><th key={h} style={{ padding:"10px 14px", fontSize:12, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"left", borderBottom:"1px solid #E2E8F0" }}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ["Invoice Number","SRV-2026-4218","✅ Required"],
                ["Invoice Date","16/09/2026","✅ Required"],
                ["Due Date","01/10/2026","✅ Recommended"],
                ["Service Description","Operations consulting — senior consultant","✅ Recommended"],
                ["Unit & Quantity","40 Hour","✅ Required"],
                ["Rate","₹2,500.00 per unit","✅ Required"],
                ["GST / Tax %","18%","✅ If GST-registered"],
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

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>GST, SAC Codes and Payment Terms for Service Invoices</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          A service invoice differs from a product invoice in one important way for GST purposes: services are classified using SAC (Services Accounting Code) rather than HSN codes used for goods. Each line item can also carry its own tax percentage, so you can apply 18% GST to consulting work and a different rate to another service on the same invoice — the breakdown and totals recalculate instantly as you set them.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          If you're not GST registered, you can leave the GSTIN fields blank and set the tax percentage on each line to 0 — the invoice will simply show the service amounts and total, with no tax breakup.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Payment terms matter more for service invoices than product invoices because service engagements often run on retainers or milestones rather than a single upfront payment. Stating your due date and terms clearly — for example, "Payment due within 15 days of invoice date" — on the document itself removes any ambiguity about when payment is expected.
        </p>

        <Callout icon="💡" title="Tip — Bill hours, milestones and retainers on one invoice" color="#FFFBEB" borderColor="#D97706">
          You don't need separate invoices for different billing structures. Add a line for consulting hours, another for a project milestone, and another for a monthly retainer — each with its own unit, quantity, rate and tax — all on the same invoice. The subtotal, tax and total adjust automatically.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 24px", letterSpacing: "-0.01em" }}>How to Generate a Service Invoice — Step by Step</h2>
        <Step number={1} title="Set the Invoice Details">Enter the invoice number, issue date, due date and an optional one-line summary of the engagement.</Step>
        <Step number={2} title="Add Your Business">Enter your business name, address, GSTIN and contact details as the service provider.</Step>
        <Step number={3} title="Add the Client">Enter the client's billing name, address and GSTIN so the invoice is addressed correctly.</Step>
        <Step number={4} title="List the Services">Add a line per service with its unit (hour, visit, milestone, month), quantity, rate and tax percentage.</Step>
        <Step number={5} title="Review the Preview">Check the subtotal, per-line tax, discount and payment terms in the live preview before exporting.</Step>
        <Step number={6} title="Download">Use the Save menu to download the finished invoice as a PDF to attach to an email, or a PNG to drop into a message.</Step>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 20px", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
        {[
          { q: "Is this service invoice generator free?", a: "Yes. It is completely free with no login and no limit on how many invoices you create. Everything runs in your browser." },
          { q: "What is the difference between a service invoice and a product invoice?", a: "A service invoice bills for work performed rather than goods supplied, so line items are usually hours, milestones, retainers or visits instead of physical quantities. For GST purposes services are classified with SAC codes rather than HSN codes." },
          { q: "Can I add GST to a service invoice?", a: "Yes. Each line item carries its own tax percentage, so you can apply 18% GST to consulting work and a different rate to another service on the same invoice. Add your GSTIN and your client's GSTIN in the provider and client sections." },
          { q: "Do I need a GSTIN to issue a service invoice?", a: "No. If you are not GST registered you can leave the GSTIN fields blank and set the tax percentage on each line to 0 — the invoice will simply show the service amounts and total." },
          { q: "Can I download the invoice as an image instead of a PDF?", a: "Yes. The Save menu offers both PDF and PNG, so you can attach a PDF to an email or paste a PNG into a chat thread." },
        ].map((faq, i) => (
          <div key={i} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 20px", marginBottom: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Q: {faq.q}</div>
            <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>A: {faq.a}</div>
          </div>
        ))}

        <div style={{ background: "linear-gradient(135deg,#451a03,#b45309)", borderRadius: 16, padding: "32px 28px", textAlign: "center", marginTop: 48, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>Generate your service invoice now</h3>
          <p style={{ fontSize: 14, color: "#FCD34D", margin: "0 0 24px" }}>Free · No login · Per-line GST · Payment terms · Instant PDF</p>
          <Link to="/documents/service-invoice" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#D97706,#B45309)", color: "#fff", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Generate Service Invoice →
          </Link>
        </div>

        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Related Tools</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { name: "Invoice Generator", href: "/documents/invoice", desc: "General-purpose invoices for goods and services" },
              { name: "Freelancer Invoice Generator", href: "/documents/freelancer-invoice", desc: "Simple invoices for independent professionals" },
              { name: "GST Invoice Generator", href: "/documents/gst-invoice", desc: "GST tax invoices with HSN codes and tax breakdown" },
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
