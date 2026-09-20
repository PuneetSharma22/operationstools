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
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#6366F1,#4F46E5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>{number}</div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>{title}</h3>
        <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>{children}</div>
      </div>
    </div>
  );
}

export default function InvoiceBlog() {
  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <Helmet>
        <title>How to Generate a Professional Invoice Online in India for Free (2026) | OpsTools</title>
        <meta name="description" content="Learn how to create a professional invoice with itemized line items, tax, discounts, and bank details for free, with no login and instant PDF download." />
        <meta property="og:title" content="How to Generate a Professional Invoice Online in India for Free (2026) | OpsTools" />
        <meta property="og:description" content="Learn how to create a professional invoice with itemized line items, tax, discounts, and bank details for free, with no login and instant PDF download." />
        <meta property="og:url" content="https://www.opstools.ai/blogs/how-to-generate-invoice-online-india" />
        <link rel="canonical" href="https://www.opstools.ai/blogs/how-to-generate-invoice-online-india" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#1e1b4b 55%,#3730a3 100%)", padding: "72px 24px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748B", display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#334155" }}>›</span>
            <Link to="/blogs" style={{ color: "#64748B", textDecoration: "none" }}>Blog</Link>
            <span style={{ color: "#334155" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Invoice Guide</span>
          </nav>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(79,70,229,0.2)", border: "1px solid rgba(79,70,229,0.3)", color: "#A5B4FC", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 999, marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>Guide</div>
            <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              How to Generate a Professional Invoice Online in India for Free (2026)
            </h1>
            <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 24px" }}>
              A complete guide to creating professional invoices — itemized line items, tax, discounts, and bank details — with instant PDF download. No login, no cost.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#64748B", flexWrap: "wrap" }}>
              <span>Arijit Sawant</span><span>·</span><span>September 17, 2026</span><span>·</span><span>7 min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
          {[
            ["Line Items", "Unlimited, with qty & rate", "#E0E7FF", "#4F46E5"],
            ["Tax", "Per-item %, auto-calculated", "#DBEAFE", "#2563EB"],
            ["Discount", "Flat amount off the total", "#EDE9FE", "#7C3AED"],
            ["Bank Details", "Optional, for payment", "#FEF3C7", "#D97706"],
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
          Need a clean, professional invoice without wrestling with a spreadsheet template? Whether you're a freelancer billing a client, a small business owner closing a sale, or a service provider issuing a one-off bill, a proper invoice is what gets you paid — and what your client's accounts team needs to process the payment.
        </p>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          This guide covers what an invoice needs to include, how tax and discounts are calculated, and how to generate a print-ready invoice with line items and bank details in under a minute — for free.
        </p>

        <Callout icon="✅" title="Quick answer" color="#EEF2FF" borderColor="#4F46E5">
          Go to <Link to="/documents/invoice" style={{ color: "#4F46E5", fontWeight: 600 }}>opstools.ai/documents/invoice</Link>, fill in your business and client details, add line items with quantity, rate, and tax, and click Save PDF. No login, no subscription, no cost.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What is an Invoice?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          An invoice is a document a business issues to a customer requesting payment for goods or services provided, itemizing what was sold, the price, applicable tax, and total due. It serves as both a payment request and a business record.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Unlike a GST tax invoice, a general invoice doesn't need to follow GST-specific formatting rules like HSN/SAC codes or a CGST/SGST/IGST split — it's suitable for any business, including non-GST-registered freelancers and small vendors billing for a single transaction.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>Who Needs an Invoice Generator?</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {[
            { title: "Small business owners", desc: "Issue professional invoices without accounting software." },
            { title: "Service providers", desc: "Bill clients clearly with itemized line items and tax." },
            { title: "One-off sales", desc: "Generate a quick invoice for a single transaction without setting up a system." },
          ].map(({ title, desc }) => (
            <div key={title} style={{ display: "flex", gap: 14, background: "#EEF2FF", borderRadius: 12, padding: "16px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#4F46E5", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🧾</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What Goes on a Professional Invoice</h2>
        <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Field","Description","Example"].map(h=><th key={h} style={{ padding:"10px 14px", fontSize:12, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"left", borderBottom:"1px solid #E2E8F0" }}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ["Invoice No.","Unique identifier for the invoice","INV-2026-1042"],
                ["Invoice Date & Due Date","When it was issued and when payment is due","Issued 17 Sep, due in 15 days"],
                ["Business Details","Your name, address, GSTIN (optional), email, phone","Verma Consulting Services"],
                ["Client Details","Client's name, address, email, and phone","Vega Retail Pvt Ltd"],
                ["Line Items","Description, quantity, rate, and tax per item","Consulting — 5 hrs @ ₹2,000/hr"],
                ["Discount","Overall flat discount applied to the invoice","₹2,000"],
                ["Bank Details","Account info so the client knows how to pay","HDFC Bank, A/C 50200012345678"],
                ["Amount in Words","Total spelled out, auto-generated","Rupees only"],
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

        <Callout icon="💳" title="Bank details are optional but recommended" color="#FFFBEB" borderColor="#F59E0B">
          Adding your bank name, account number, IFSC, and UPI ID directly on the invoice means the client doesn't need to email you asking how to pay. It's the single change most likely to get you paid faster.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>How Tax and Discount Are Calculated</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Each line item has its own quantity, rate, and tax percentage — this matters when different items on the same invoice attract different tax rates. The total is worked out automatically:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
          {[
            { title: "Subtotal & Tax", desc: "Subtotal = sum of (quantity × rate) across all items. Tax = sum of (quantity × rate × tax%) per item, so mixed tax rates on one invoice are handled correctly.", color: "#EEF2FF", border: "#4F46E5" },
            { title: "Discount & Total", desc: "A single flat discount amount is subtracted after tax: Total = Subtotal + Tax − Discount. The total is also converted to words automatically.", color: "#EFF6FF", border: "#2563EB" },
          ].map(f=>(
            <div key={f.title} style={{ background: f.color, borderRadius: 12, padding: "16px", border: `1px solid ${f.border}20` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 24px", letterSpacing: "-0.01em" }}>How to Generate an Invoice — Step by Step</h2>
        <Step number={1} title="Enter invoice details">Fill in the invoice number, invoice date, due date, and any overall discount. Add a logo URL if you want your branding on the invoice.</Step>
        <Step number={2} title="Add your business details">Enter your business name, address, GSTIN (optional), email, and phone number.</Step>
        <Step number={3} title="Add client details">Enter the client's name, address, email, and phone number so they're clearly billed.</Step>
        <Step number={4} title="Add line items">Click Add Item for each product or service. Enter description, quantity, rate, and tax percentage — OpsTools calculates each item's amount and the invoice total automatically.</Step>
        <Step number={5} title="Add bank details">Optional — add your bank name, account number, IFSC, and UPI ID so the client knows exactly how to pay.</Step>
        <Step number={6} title="Download PDF">Click Save to download the invoice as a PDF or PNG. It's ready to email or print immediately.</Step>

        <Callout icon="🔒" title="Your data is private" color="#F0FDF4" borderColor="#10B981">
          OpsTools does not store any invoice data. Everything you enter stays in your browser, and the PDF is generated entirely on your device.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 20px", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
        {[
          { q: "Is this invoice generator free?", a: "Yes, completely free with no login required." },
          { q: "Can I add bank details for payment?", a: "Yes, optional bank name, account number, IFSC, and UPI ID fields appear on the invoice for easy payment." },
          { q: "Does it support discounts and tax?", a: "Yes, you can apply a tax percentage per item and an overall discount, both reflected in the final total." },
          { q: "Is this suitable for any business type?", a: "Yes, this is a general-purpose invoice suitable for any business — for GST-specific invoices with HSN codes, see the GST Invoice Generator instead." },
          { q: "Can I download the invoice as an image instead of a PDF?", a: "Yes, the Save menu lets you export the invoice as either a PDF or a PNG image, depending on what you need it for." },
          { q: "Do I need a GSTIN to use this invoice?", a: "No — the GSTIN field is optional. It's there for registered businesses that want to display their GST number, but the invoice works fine without one." },
        ].map((faq, i) => (
          <div key={i} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 20px", marginBottom: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Q: {faq.q}</div>
            <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>A: {faq.a}</div>
          </div>
        ))}

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg,#1e1b4b,#3730a3)", borderRadius: 16, padding: "32px 28px", textAlign: "center", marginTop: 48, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Generate your invoice now</h3>
          <p style={{ fontSize: 14, color: "#A5B4FC", margin: "0 0 24px" }}>Free · No login · Line items & tax · Bank details · Instant PDF</p>
          <Link to="/documents/invoice" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#6366F1,#4F46E5)", color: "#fff", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Generate Invoice →
          </Link>
        </div>

        {/* Related */}
        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Related Tools</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { name: "GST Invoice Generator", href: "/documents/gst-invoice", desc: "Tax-compliant GST invoices with HSN codes" },
              { name: "Quotation Generator", href: "/documents/quotation", desc: "Price quotes with validity and terms" },
              { name: "Freelancer Invoice", href: "/documents/freelancer-invoice", desc: "Hourly & fixed price invoices" },
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
