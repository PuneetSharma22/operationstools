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
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#4F46E5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>{number}</div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>{title}</h3>
        <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>{children}</div>
      </div>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <svg width="100%" viewBox="0 0 680 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
          <rect width="680" height="280" fill="#F8FAFC"/>
          <ellipse cx="200" cy="160" rx="180" ry="120" fill="#7C3AED" opacity="0.04"/>
          <ellipse cx="500" cy="120" rx="160" ry="110" fill="#4F46E5" opacity="0.04"/>
          <pattern id="gdots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="rgba(0,0,0,0.03)"/></pattern>
          <rect width="680" height="280" fill="url(#gdots)"/>
          {/* Supplier card */}
          <g transform="translate(60,50)">
            <rect x="2" y="2" width="140" height="90" rx="10" fill="rgba(0,0,0,0.04)"/>
            <rect width="140" height="90" rx="10" fill="#fff" stroke="#E2E8F0" strokeWidth="1.5"/>
            <rect x="10" y="12" width="60" height="5" rx="2.5" fill="#7C3AED" opacity="0.8"/>
            <rect x="10" y="22" width="90" height="3" rx="1.5" fill="#E2E8F0"/>
            <rect x="10" y="29" width="70" height="3" rx="1.5" fill="#E2E8F0"/>
            <rect x="10" y="36" width="80" height="3" rx="1.5" fill="#E2E8F0"/>
            <rect x="10" y="50" width="50" height="3" rx="1.5" fill="#E2E8F0"/>
            <rect x="10" y="57" width="100" height="3" rx="1.5" fill="#E2E8F0"/>
            <rect x="10" y="70" width="40" height="10" rx="5" fill="#7C3AED" opacity="0.15"/>
            <rect x="14" y="73" width="30" height="4" rx="2" fill="#7C3AED" opacity="0.6"/>
          </g>
          {/* Arrow */}
          <path d="M210 95 L258 95" stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5"/>
          <polygon points="258,91 266,95 258,99" fill="#7C3AED" opacity="0.5"/>
          {/* Invoice */}
          <g transform="translate(266,20)">
            <rect x="3" y="3" width="148" height="240" rx="10" fill="rgba(0,0,0,0.04)"/>
            <rect width="148" height="240" rx="10" fill="#fff" stroke="#E2E8F0" strokeWidth="1.5"/>
            <rect width="148" height="4" rx="2" fill="#7C3AED"/>
            <rect x="10" y="14" width="50" height="5" rx="2.5" fill="#7C3AED" opacity="0.8"/>
            <text x="138" y="20" textAnchor="end" fill="#64748B" fontSize="7" fontFamily="sans-serif" fontWeight="700">TAX INVOICE</text>
            <rect x="10" y="24" width="80" height="3" rx="1.5" fill="#E2E8F0"/>
            <rect x="10" y="31" width="60" height="3" rx="1.5" fill="#E2E8F0"/>
            <line x1="10" y1="42" x2="138" y2="42" stroke="#F1F5F9" strokeWidth="1"/>
            {/* GSTIN row */}
            <rect x="10" y="48" width="40" height="3" rx="1.5" fill="#E2E8F0"/>
            <rect x="80" y="48" width="58" height="3" rx="1.5" fill="#7C3AED" opacity="0.4"/>
            {/* HSN row */}
            <rect x="10" y="56" width="30" height="3" rx="1.5" fill="#E2E8F0"/>
            <rect x="80" y="56" width="40" height="3" rx="1.5" fill="#E2E8F0"/>
            <line x1="10" y1="66" x2="138" y2="66" stroke="#F1F5F9" strokeWidth="1"/>
            {/* Table header */}
            <rect x="8" y="70" width="132" height="14" rx="3" fill="#7C3AED" opacity="0.1"/>
            {["Desc","HSN","Qty","Rate","GST","Total"].map((h,i)=>(
              <text key={h} x={12+i*22} y="80" fill="#7C3AED" fontSize="6" fontFamily="sans-serif" fontWeight="700">{h}</text>
            ))}
            {[0,1,2].map(row=>(
              <g key={row}>
                <rect x="8" y={88+row*14} width="132" height="12" rx="2" fill={row%2===0?"#fff":"#F8FAFC"}/>
                {[0,1,2,3,4,5].map(col=>(
                  <rect key={col} x={12+col*22} y={91+row*14} width={col===0?18:12} height="3" rx="1.5" fill="#E2E8F0"/>
                ))}
              </g>
            ))}
            {/* Totals */}
            <line x1="10" y1="135" x2="138" y2="135" stroke="#F1F5F9" strokeWidth="1"/>
            {[["Subtotal",""],["CGST 9%",""],["SGST 9%",""]].map(([l],i)=>(
              <g key={l}>
                <rect x="10" y={140+i*10} width="35" height="3" rx="1.5" fill="#E2E8F0"/>
                <rect x="110" y={140+i*10} width="28" height="3" rx="1.5" fill="#E2E8F0"/>
              </g>
            ))}
            <rect x="8" y="175" width="132" height="18" rx="5" fill="#7C3AED" opacity="0.15"/>
            <rect x="12" y="181" width="40" height="5" rx="2.5" fill="#7C3AED" opacity="0.6"/>
            <rect x="105" y="181" width="30" height="5" rx="2.5" fill="#7C3AED" opacity="0.8"/>
            <rect x="10" y="202" width="128" height="24" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5"/>
            {[0,4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80].map((x,i)=>(
              <rect key={i} x={16+x} y="206" width={x%12===0?2:1} height="16" rx="0.5" fill="#CBD5E1"/>
            ))}
            <text x="74" y="234" textAnchor="middle" fill="#94A3B8" fontSize="7" fontFamily="sans-serif" letterSpacing="0.1em">OPSTOOLS.AI</text>
          </g>
          {/* Arrow */}
          <path d="M424 140 L466 140" stroke="#4F46E5" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5"/>
          <polygon points="466,136 474,140 466,144" fill="#4F46E5" opacity="0.5"/>
          {/* PDF */}
          <g transform="translate(474,80)">
            <rect x="3" y="3" width="90" height="110" rx="8" fill="rgba(0,0,0,0.04)"/>
            <rect width="90" height="110" rx="8" fill="#fff" stroke="#E2E8F0" strokeWidth="1.5"/>
            <path d="M56 0 L90 34 L56 34 Z" fill="#EDE9FE"/>
            <path d="M56 0 L90 34" stroke="#C4B5FD" strokeWidth="0.5" fill="none"/>
            <rect x="8" y="42" width="30" height="13" rx="4" fill="#7C3AED"/>
            <text x="23" y="52" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="sans-serif">PDF</text>
            <rect x="8" y="62" width="66" height="3" rx="1.5" fill="#E2E8F0"/>
            <rect x="8" y="69" width="50" height="3" rx="1.5" fill="#F1F5F9"/>
            <rect x="8" y="76" width="58" height="3" rx="1.5" fill="#F1F5F9"/>
            <circle cx="68" cy="90" r="13" fill="#EDE9FE" stroke="#C4B5FD" strokeWidth="1"/>
            <path d="M68 83 L68 92 M64 88 L68 93 L72 88" stroke="#7C3AED" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <text x="130" y="158" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">Supplier Details</text>
          <text x="340" y="272" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="600" fontFamily="sans-serif" letterSpacing="0.06em">FREE GST INVOICE GENERATOR</text>
          <text x="519" y="208" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">Saved as PDF</text>
        </svg>
      </div>
    </div>
  );
}

export default function GSTInvoiceBlog() {
  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <Helmet>
        <title>How to Generate a GST Invoice Online in India for Free (2026) | OpsTools</title>
        <meta name="description" content="Complete guide to generating GST-compliant tax invoices in India. Covers CGST, SGST, IGST, HSN codes, mandatory fields and free PDF download." />
        <meta property="og:title" content="How to Generate a GST Invoice Online in India for Free (2026) | OpsTools" />
        <meta property="og:description" content="Complete guide to generating GST-compliant tax invoices in India. Covers CGST, SGST, IGST, HSN codes, mandatory fields and free PDF download." />
        <meta property="og:url" content="https://www.opstools.ai/blogs/how-to-generate-gst-invoice-online-india" />
        <link rel="canonical" href="https://www.opstools.ai/blogs/how-to-generate-gst-invoice-online-india" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0D0630 55%,#1e1b4b 100%)", padding: "72px 24px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748B", display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#334155" }}>›</span>
            <Link to="/blogs" style={{ color: "#64748B", textDecoration: "none" }}>Blog</Link>
            <span style={{ color: "#334155" }}>›</span>
            <span style={{ color: "#94A3B8" }}>GST Invoice Guide</span>
          </nav>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", color: "#C4B5FD", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 999, marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>Guide</div>
            <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              How to Generate a GST Invoice Online in India for Free (2026)
            </h1>
            <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 24px" }}>
              A complete guide to generating GST-compliant tax invoices — with CGST/SGST/IGST, HSN codes, mandatory fields, and instant PDF download. No login, no cost.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#64748B", flexWrap: "wrap" }}>
              <span>OpsTools Team</span><span>·</span><span>July 8, 2026</span><span>·</span><span>8 min read</span>
            </div>
          </div>
        </div>
      </section>

      <HeroIllustration />

      {/* Article */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          Every registered GST business in India is required to issue a tax invoice for every sale of goods or services. But generating one that's actually compliant — with the right GSTIN, HSN codes, tax breakdowns, and format — is harder than it sounds. Most people end up using Excel templates or paying for accounting software just to get a basic invoice out.
        </p>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          This guide covers everything you need to know about GST invoices in India — what they must contain, when to use CGST vs IGST, how HSN codes work, and how to generate one for free in under a minute.
        </p>

        <Callout icon="✅" title="Quick answer" color="#F5F3FF" borderColor="#7C3AED">
          Go to <Link to="/documents/gst-invoice" style={{ color: "#7C3AED", fontWeight: 600 }}>opstools.ai/documents/gst-invoice</Link>, fill in your supplier and buyer details, add line items with HSN codes, and click Save PDF. No login, no subscription, no cost.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What is a GST Invoice?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          A GST invoice (also called a tax invoice) is a document issued by a GST-registered supplier to a buyer, detailing the goods or services supplied, the applicable GST rate, and the total tax charged. It is the primary document for claiming input tax credit (ITC) under the GST system.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Under the CGST Act 2017, every registered taxable person must issue a tax invoice at the time of supply. Failure to issue a proper invoice can result in the buyer being unable to claim ITC, and penalties for the supplier.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>Mandatory Fields in a GST Invoice</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 20 }}>As per Rule 46 of CGST Rules 2017, a valid tax invoice must contain:</p>

        <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["Field", "Details", "Required?"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", borderBottom: "1px solid #E2E8F0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Invoice Number", "Consecutive serial number — unique per financial year", "✅ Mandatory"],
                ["Invoice Date", "Date of issue", "✅ Mandatory"],
                ["Supplier Name & Address", "Legal name and principal place of business", "✅ Mandatory"],
                ["Supplier GSTIN", "15-digit GST Identification Number", "✅ Mandatory"],
                ["Recipient Name & Address", "For B2B — buyer's legal name and address", "✅ B2B mandatory"],
                ["Recipient GSTIN", "Buyer's GSTIN for B2B transactions", "✅ B2B mandatory"],
                ["Place of Supply", "State where supply is made — determines CGST/SGST or IGST", "✅ Mandatory"],
                ["HSN/SAC Code", "6-digit code for goods / 4-digit SAC for services", "✅ Mandatory"],
                ["Description of Goods/Services", "Clear description of what was supplied", "✅ Mandatory"],
                ["Quantity & Unit", "Quantity and unit of measure", "✅ For goods"],
                ["Taxable Value", "Value before tax", "✅ Mandatory"],
                ["GST Rate & Tax Amount", "CGST + SGST or IGST rate and amount", "✅ Mandatory"],
                ["Total Invoice Value", "Total including all taxes", "✅ Mandatory"],
                ["Signature", "Authorised signatory", "✅ Mandatory"],
              ].map(([a, b, c], i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F1F5F9", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                  <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{a}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#475569" }}>{b}</td>
                  <td style={{ padding: "10px 14px", fontSize: 12, color: "#475569" }}>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>CGST + SGST vs IGST — Which One to Use?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          This is the most common source of confusion on GST invoices. The rule is simple:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
          {[
            { title: "CGST + SGST", when: "Intra-state supply", desc: "Supplier and buyer are in the same state. GST is split equally — e.g. 18% GST = 9% CGST + 9% SGST.", color: "#F5F3FF", border: "#7C3AED" },
            { title: "IGST", when: "Inter-state supply", desc: "Supplier and buyer are in different states. Full GST charged as IGST — e.g. 18% GST = 18% IGST.", color: "#EFF6FF", border: "#2563EB" },
          ].map(f => (
            <div key={f.title} style={{ background: f.color, borderRadius: 12, padding: "16px", border: `1px solid ${f.border}20` }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{f.title}</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: f.border, marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.06em" }}>{f.when}</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{f.desc}</div>
            </div>
          ))}
        </div>

        <Callout icon="💡" title="Place of Supply" color="#FFFBEB" borderColor="#F59E0B">
          The Place of Supply field on the invoice determines which tax type applies. If Place of Supply matches the supplier's state — use CGST + SGST. If different — use IGST.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What is an HSN Code?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          HSN stands for Harmonised System of Nomenclature — a 6-digit code that classifies every good traded internationally. Under GST, businesses must mention HSN codes on invoices based on their annual turnover:
        </p>
        <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 24 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Annual Turnover", "HSN Digits Required"].map(h => <th key={h} style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", borderBottom: "1px solid #E2E8F0" }}>{h}</th>)}</tr></thead>
            <tbody>
              {[["Up to ₹5 crore", "4 digits"],["₹5 crore and above", "6 digits"],["For exports", "8 digits"]].map(([a,b],i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F1F5F9", background: i%2===0?"#fff":"#FAFAFA" }}>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: "#0F172A" }}>{a}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13, fontWeight: 700, color: "#7C3AED" }}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 24 }}>
          For services, SAC (Services Accounting Code) is used instead of HSN. For example, SAC 998433 is used for training and coaching services (L&D invoices).
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 24px", letterSpacing: "-0.01em" }}>How to Generate a GST Invoice — Step by Step</h2>
        <Step number={1} title="Open the GST Invoice Generator">Go to <Link to="/documents/gst-invoice" style={{ color: "#7C3AED", fontWeight: 600 }}>opstools.ai/documents/gst-invoice</Link>. No login required.</Step>
        <Step number={2} title="Enter Invoice Details">Fill in the invoice number (must be unique per financial year), invoice date, due date, and place of supply.</Step>
        <Step number={3} title="Choose GST Type">Select CGST + SGST for intra-state or IGST for inter-state. This determines which tax columns appear.</Step>
        <Step number={4} title="Enter Supplier Details">Add your business name, address, and GSTIN. If you have a logo URL, paste it to add branding to the invoice.</Step>
        <Step number={5} title="Enter Buyer Details">For B2B: add buyer's name, address, and GSTIN. For B2C: name and address are sufficient.</Step>
        <Step number={6} title="Add Line Items">Click Add Item for each product or service. Enter description, HSN/SAC code, quantity, rate, and tax rate. OpsTools calculates tax amounts automatically.</Step>
        <Step number={7} title="Add Bank Details (Optional)">Add your bank name, account number, and IFSC for payment. Useful for B2B invoices.</Step>
        <Step number={8} title="Download PDF">Click Save PDF. The invoice downloads instantly — ready to email or print.</Step>

        <Callout icon="🔒" title="Your data is private" color="#F0FDF4" borderColor="#10B981">
          OpsTools does not store any invoice data. Everything you enter stays in your browser. The PDF is generated entirely on your device.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 20px", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
        {[
          { q: "Is a GST invoice the same as a tax invoice?", a: "Yes — under GST law, a 'tax invoice' and a 'GST invoice' refer to the same document. It is the invoice issued by a registered supplier charging GST on a supply." },
          { q: "What is the difference between a GST invoice and a bill of supply?", a: "A tax invoice is issued when GST is charged (for taxable supplies). A bill of supply is issued for exempt supplies or by a composition scheme taxpayer who cannot charge GST." },
          { q: "Can I issue a GST invoice without a GSTIN?", a: "No — only GST-registered businesses can issue a tax invoice. If you are not registered, you must issue a bill of supply or a regular invoice without charging GST." },
          { q: "What is the time limit for issuing a GST invoice?", a: "For goods: invoice must be issued at the time of delivery or before. For services: within 30 days of supply (45 days for banks and financial institutions)." },
          { q: "Can I modify a GST invoice after issuing it?", a: "You cannot cancel a GST invoice directly. If you need to correct it, issue a credit note (for reducing the amount) or a debit note (for increasing the amount)." },
          { q: "Is this tool free to use?", a: "Completely free. No login, no subscription, no credits required." },
        ].map((faq, i) => (
          <div key={i} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 20px", marginBottom: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Q: {faq.q}</div>
            <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>A: {faq.a}</div>
          </div>
        ))}

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)", borderRadius: 16, padding: "32px 28px", textAlign: "center", marginTop: 48, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Generate your GST invoice now</h3>
          <p style={{ fontSize: 14, color: "#A5B4FC", margin: "0 0 24px" }}>Free · No login · CGST/SGST/IGST · HSN codes · Instant PDF</p>
          <Link to="/documents/gst-invoice" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#7C3AED,#4F46E5)", color: "#fff", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Generate GST Invoice →
          </Link>
        </div>

        {/* Related */}
        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Related Tools</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { name: "Salary Slip Generator", href: "/documents/salary-slip", desc: "Payslips with CTC & deductions" },
              { name: "L&D Tax Invoice", href: "/documents/ld-bill", desc: "Training & course invoices" },
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
