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
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>{number}</div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>{title}</h3>
        <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>{children}</div>
      </div>
    </div>
  );
}

export default function QuotationBlog() {
  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <Helmet>
        <title>How to Generate a Business Quotation Online in India for Free (2026) | OpsTools</title>
        <meta name="description" content="Complete guide to creating a business quotation in India — itemized pricing, validity period, and terms & conditions. Free, no login, instant PDF download." />
        <meta property="og:title" content="How to Generate a Business Quotation Online in India for Free (2026) | OpsTools" />
        <meta property="og:description" content="Complete guide to creating a business quotation in India — itemized pricing, validity period, and terms & conditions. Free, no login, instant PDF download." />
        <meta property="og:url" content="https://www.opstools.ai/blogs/how-to-generate-quotation-online-india" />
        <link rel="canonical" href="https://www.opstools.ai/blogs/how-to-generate-quotation-online-india" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>

      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#052e16 55%,#047857 100%)", padding: "72px 24px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748B", display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#334155" }}>›</span>
            <Link to="/blogs" style={{ color: "#64748B", textDecoration: "none" }}>Blog</Link>
            <span style={{ color: "#334155" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Quotation Guide</span>
          </nav>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(5,150,105,0.2)", border: "1px solid rgba(5,150,105,0.3)", color: "#6EE7B7", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 999, marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>Guide</div>
            <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              How to Generate a Business Quotation Online in India for Free (2026)
            </h1>
            <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 24px" }}>
              A complete guide to business quotations — itemized pricing, validity periods, and terms & conditions — and how to generate a professional one for free in under a minute.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#64748B", flexWrap: "wrap" }}>
              <span>Prajay Bangar</span><span>·</span><span>September 24, 2026</span><span>·</span><span>6 min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
          {[
            ["Line Items", "Itemized pricing", "#D1FAE5", "#059669"],
            ["Validity", "Set your own period", "#DBEAFE", "#2563EB"],
            ["Terms", "Payment & delivery", "#EDE9FE", "#7C3AED"],
            ["Cost", "100% Free", "#FEF3C7", "#D97706"],
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
          Sending a client a price quote shouldn't mean formatting a document from scratch every time. Whether you're in sales, running a service business, or freelancing, a quotation needs to look professional and cover the basics — itemized pricing, how long the prices hold, and the terms attached to them.
        </p>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          This guide covers what a quotation actually is, how it differs from an invoice, what fields it needs, and how to generate a clean, professional quotation for free in under a minute.
        </p>

        <Callout icon="✅" title="Quick answer" color="#F0FDF4" borderColor="#059669">
          Go to <Link to="/documents/quotation" style={{ color: "#059669", fontWeight: 600 }}>opstools.ai/documents/quotation</Link>, add your business and client details, list your priced line items, set a validity period and terms, and click Save PDF. No login, no subscription, no cost.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What is a Quotation?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          A quotation (or price quote) is a document a business sends a prospective client, listing prices for goods or services before any commitment is made. Unlike an invoice, it's not a request for payment — it's an offer, usually valid for a limited period.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Once the client accepts the quoted prices and work begins or goods are delivered, the quotation is typically followed by an invoice for the actual payment. Keeping the two documents distinct — and clearly labeled — avoids confusion about whether an amount is owed yet.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>Who Actually Needs This</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {[
            { title: "Sales & business development", desc: "Send prospective clients a clear, professional price quote before a deal is signed." },
            { title: "Service providers", desc: "Quote for a project before work begins, with clear pricing and terms attached." },
            { title: "Freelancers & consultants", desc: "Formalize pricing discussions with a proper written quote instead of an email estimate." },
          ].map(f => (
            <div key={f.title} style={{ display: "flex", gap: 14, background: "#F0FDF4", borderRadius: 12, padding: "16px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#059669", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>📋</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What Should a Quotation Include?</h2>
        <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Field","Example","Required?"].map(h=><th key={h} style={{ padding:"10px 14px", fontSize:12, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"left", borderBottom:"1px solid #E2E8F0" }}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ["Quote No.","QUOTE-2026-1042","✅ Required"],
                ["Date","24 September 2026","✅ Required"],
                ["Validity","30 days from issue","✅ Required"],
                ["From (Your Business)","Name, address, email, phone","✅ Required"],
                ["Prepared For (Client)","Client name, address, email","✅ Required"],
                ["Line Items","Website Design — ₹25,000","✅ Required"],
                ["Discount","₹15,000 (if applicable)","✅ If applicable"],
                ["Terms & Conditions","50% advance, balance on delivery","✅ Recommended"],
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

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>Quotation vs Invoice — What's the Difference?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          A quotation is a price estimate offered before work begins, while an invoice is a request for payment after goods or services are delivered. A quotation is non-binding until the client accepts it, and it's usually valid only for a limited period — after which prices may change due to material costs, timelines, or availability.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Once a client signs off on a quotation, that same line-item structure typically carries over into the invoice — which is why keeping quote numbers, item descriptions, and rates consistent between the two documents makes reconciliation easier for both sides.
        </p>

        <Callout icon="💡" title="Tip — Set a realistic validity period" color="#F0FDF4" borderColor="#059669">
          Always specify how long your quoted prices remain valid — typically 15 to 30 days. This protects you from being locked into old pricing if material costs, exchange rates, or your own capacity change before the client responds, and it gives the client a clear deadline to act on.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 24px", letterSpacing: "-0.01em" }}>How to Generate a Quotation — Step by Step</h2>
        <Step number={1} title="Enter quote details">Go to <Link to="/documents/quotation" style={{ color: "#059669", fontWeight: 600 }}>opstools.ai/documents/quotation</Link>. Add the quote number, date, and validity period.</Step>
        <Step number={2} title="Add your business & client details">Enter both parties' names and contact info — your business under "From," and the client under "Prepared For."</Step>
        <Step number={3} title="Add line items">List each priced item or service with quantity and rate. Add a note under any item for specifications or delivery timelines. The total updates automatically as you add items.</Step>
        <Step number={4} title="Add terms">Fill in optional terms & conditions and notes — payment terms, delivery timelines, or any other conditions your business needs specified upfront.</Step>
        <Step number={5} title="Preview">Check the live preview on the right — totals, discount, and terms update instantly as you type.</Step>
        <Step number={6} title="Download PDF">Click Save to download the quotation as a PDF. Your data never leaves your browser.</Step>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 20px", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
        {[
          { q: "Is this quotation generator free?", a: "Yes, completely free with no login required." },
          { q: "What's the difference between a quotation and an invoice?", a: "A quotation is a price estimate offered before work begins, while an invoice is a request for payment after goods or services are delivered. This tool is for the former." },
          { q: "Can I set a validity period?", a: "Yes, you can specify how long the quoted prices remain valid, which appears clearly on the document." },
          { q: "Can I add terms and conditions?", a: "Yes, a dedicated terms & conditions field lets you specify payment terms, delivery timelines, or other conditions." },
          { q: "Can I apply a discount to the total?", a: "Yes — enter a discount amount and it's subtracted from the subtotal before the final total is calculated and shown on the quotation." },
          { q: "Does my data get stored or uploaded anywhere?", a: "No — everything happens in your browser. Nothing is uploaded or stored on our servers unless you choose to save your session." },
        ].map((faq, i) => (
          <div key={i} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 20px", marginBottom: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Q: {faq.q}</div>
            <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>A: {faq.a}</div>
          </div>
        ))}

        <div style={{ background: "linear-gradient(135deg,#052e16,#047857)", borderRadius: 16, padding: "32px 28px", textAlign: "center", marginTop: 48, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>Generate your quotation now</h3>
          <p style={{ fontSize: 14, color: "#6EE7B7", margin: "0 0 24px" }}>Free · No login · Line items & validity period · Instant PDF</p>
          <Link to="/documents/quotation" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Generate Quotation →
          </Link>
        </div>

        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Related Tools</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { name: "Invoice Generator", href: "/documents/invoice", desc: "Professional invoices with line items" },
              { name: "Freelancer Invoice", href: "/documents/freelancer-invoice", desc: "Hourly & fixed price invoices" },
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
