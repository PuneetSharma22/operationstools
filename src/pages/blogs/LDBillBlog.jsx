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
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#7C3AED,#4F46E5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>
        {number}
      </div>
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
        <svg width="100%" viewBox="0 0 680 300" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
          <rect width="680" height="300" fill="#F8FAFC"/>
          <ellipse cx="180" cy="180" rx="160" ry="120" fill="#7C3AED" opacity="0.04"/>
          <ellipse cx="500" cy="140" rx="180" ry="130" fill="#4F46E5" opacity="0.04"/>
          <pattern id="ldots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="rgba(0,0,0,0.04)"/></pattern>
          <rect width="680" height="300" fill="url(#ldots)"/>

          {/* Graduation cap icon left */}
          <g transform="translate(72, 90)">
            <rect x="0" y="30" width="72" height="52" rx="6" fill="#EDE9FE" stroke="#7C3AED" strokeWidth="1"/>
            <rect x="8" y="40" width="56" height="8" rx="3" fill="#7C3AED" opacity="0.7"/>
            <rect x="8" y="54" width="40" height="4" rx="2" fill="#C4B5FD" opacity="0.6"/>
            <rect x="8" y="62" width="48" height="4" rx="2" fill="#DDD6FE" opacity="0.5"/>
            <rect x="8" y="70" width="36" height="4" rx="2" fill="#DDD6FE" opacity="0.5"/>
            <polygon points="36,0 72,16 36,32 0,16" fill="#DDD6FE" stroke="#7C3AED" strokeWidth="1"/>
            <rect x="66" y="16" width="4" height="20" rx="2" fill="#7C3AED"/>
            <circle cx="68" cy="38" r="5" fill="#7C3AED"/>
          </g>

          {/* Connector */}
          <line x1="160" y1="150" x2="258" y2="150" stroke="#7C3AED" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4"/>
          <circle cx="160" cy="150" r="3" fill="#7C3AED" opacity="0.5"/>
          <circle cx="258" cy="150" r="3" fill="#7C3AED" opacity="0.5"/>

          {/* Invoice card center */}
          <g transform="translate(258, 34)">
            <rect x="4" y="4" width="164" height="232" rx="10" fill="rgba(0,0,0,0.04)"/>
            <rect x="0" y="0" width="164" height="232" rx="10" fill="#fff" stroke="#E2E8F0" strokeWidth="1.5"/>
            <rect x="0" y="0" width="164" height="4" rx="2" fill="#7C3AED"/>
            <rect x="12" y="16" width="50" height="5" rx="2.5" fill="#7C3AED" opacity="0.8"/>
            <rect x="12" y="26" width="80" height="4" rx="2" fill="#E2E8F0"/>
            <rect x="12" y="36" width="100" height="3" rx="1.5" fill="#F1F5F9"/>
            <text x="148" y="22" textAnchor="end" fill="#64748B" fontSize="7" fontFamily="sans-serif" fontWeight="700">TAX INVOICE</text>
            <line x1="12" y1="46" x2="152" y2="46" stroke="#F1F5F9" strokeWidth="1"/>
            {[0,1,2,3,4].map((i) => (
              <g key={i}>
                <rect x="12" y={54 + i*14} width={40 + (i%3)*16} height="3" rx="1.5" fill="#E2E8F0"/>
                <rect x="118" y={54 + i*14} width="34" height="3" rx="1.5" fill={i===0 ? "#7C3AED" : "#E2E8F0"} opacity={i===0 ? 0.6 : 1}/>
              </g>
            ))}
            <line x1="12" y1="128" x2="152" y2="128" stroke="#F1F5F9" strokeWidth="1"/>
            <rect x="8" y="136" width="148" height="24" rx="5" fill="#F5F3FF"/>
            <rect x="14" y="143" width="44" height="4" rx="2" fill="#C4B5FD"/>
            <rect x="100" y="142" width="48" height="6" rx="3" fill="#7C3AED" opacity="0.8"/>
            <rect x="36" y="172" width="92" height="18" rx="2" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5"/>
            {[0,4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88].map((x,i) => (
              <rect key={i} x={42+x} y="175" width={x%12===0?2:1} height="12" rx="0.5" fill="#CBD5E1"/>
            ))}
            <text x="82" y="218" textAnchor="middle" fill="#94A3B8" fontSize="8" fontFamily="sans-serif" letterSpacing="0.1em">OPSTOOLS.AI</text>
          </g>

          {/* Connector */}
          <line x1="424" y1="150" x2="466" y2="150" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.4"/>
          <circle cx="424" cy="150" r="3" fill="#4f46e5" opacity="0.5"/>
          <circle cx="466" cy="150" r="3" fill="#4f46e5" opacity="0.5"/>

          {/* PDF right */}
          <g transform="translate(466, 86)">
            <rect x="4" y="4" width="96" height="120" rx="8" fill="rgba(0,0,0,0.04)"/>
            <rect x="0" y="0" width="96" height="120" rx="8" fill="#fff" stroke="#E2E8F0" strokeWidth="1.5"/>
            <path d="M60 0 L96 36 L60 36 Z" fill="#EDE9FE"/>
            <path d="M60 0 L96 36" stroke="#C4B5FD" strokeWidth="0.5" fill="none"/>
            <rect x="8" y="44" width="32" height="14" rx="4" fill="#7C3AED"/>
            <text x="24" y="54" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="sans-serif">PDF</text>
            <rect x="8" y="66" width="72" height="3" rx="1.5" fill="#E2E8F0"/>
            <rect x="8" y="74" width="56" height="3" rx="1.5" fill="#F1F5F9"/>
            <rect x="8" y="82" width="64" height="3" rx="1.5" fill="#F1F5F9"/>
            <circle cx="76" cy="96" r="14" fill="#EDE9FE" stroke="#C4B5FD" strokeWidth="1"/>
            <path d="M76 88 L76 98 M72 94 L76 99 L80 94" stroke="#7C3AED" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </g>

          <text x="108" y="196" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">Course / Training</text>
          <text x="340" y="282" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="600" fontFamily="sans-serif" letterSpacing="0.06em">FREE L&amp;D INVOICE GENERATOR</text>
          <text x="514" y="224" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">Saved as PDF</text>
        </svg>
      </div>
    </div>
  );
}

export default function LDBillBlog() {
  return (
    <>
    <Helmet>
      <title>How to Generate an L&D Tax Invoice Online in India (2026) | OpsTools</title>
      <meta name="description" content="Complete guide to generating GST tax invoices for training and L&D expenses." />
      <meta property="og:title" content="How to Generate an L&D Tax Invoice Online in India (2026) | OpsTools" />
      <meta property="og:description" content="Complete guide to generating GST tax invoices for training and L&D expenses." />
      <meta property="og:url" content="https://www.opstools.ai/blogs/how-to-generate-ld-bill-online-india" />
      <link rel="canonical" href="https://www.opstools.ai/blogs/how-to-generate-ld-bill-online-india" />
      <meta property="og:type" content="article" />
      <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0D0630 55%,#1e1b4b 100%)", padding: "72px 24px 48px", overflow: "hidden" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748B", display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#334155" }}>›</span>
            <Link to="/blogs" style={{ color: "#64748B", textDecoration: "none" }}>Blog</Link>
            <span style={{ color: "#334155" }}>›</span>
            <span style={{ color: "#94A3B8" }}>L&D Invoice Generator</span>
          </nav>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(124,58,237,0.2)", border: "1px solid rgba(124,58,237,0.3)", color: "#C4B5FD", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 999, marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Guide
            </div>
            <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              How to Generate an L&D Tax Invoice Online in India (2026)
            </h1>
            <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 24px" }}>
              A complete guide to generating professional tax invoices for training, courses, and learning & development expenses — with CGST/SGST, HSN codes, and instant PDF download.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#64748B", flexWrap: "wrap" }}>
              <span>Arijit Sawant</span>
              <span>·</span>
              <span>July 2, 2026</span>
              <span>·</span>
              <span>6 min read</span>
            </div>
          </div>
        </div>
      </section>

      <HeroIllustration />

      {/* Article */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>

        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          Whether you're claiming reimbursement for an online course, submitting a training expense to your finance team, or running a corporate L&D program — you need a proper tax invoice. Most platforms like Udemy, Coursera, and LinkedIn Learning do generate invoices, but they're not always in the format your company's finance team accepts.
        </p>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          This guide covers everything you need to know about L&D tax invoices in India — what they contain, when you need one, and how to generate a professional one in under 60 seconds using OpsTools.
        </p>

        <Callout icon="✅" title="Quick answer" color="#F5F3FF" borderColor="#7C3AED">
          Go to <Link to="/documents/ld-bill" style={{ color: "#7C3AED", fontWeight: 600 }}>opstools.ai/documents/ld-bill</Link>, fill in your supplier and recipient details, add your course line items, and click Save PDF. No login, no subscription, no cost.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What is an L&D Tax Invoice?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          An L&D (Learning & Development) tax invoice is a GST-compliant tax invoice issued for educational services — online courses, classroom training, certification programs, workshops, and professional development subscriptions.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 24 }}>
          In India, educational services for skill development are classified under <strong>HSN/SAC code 998433</strong> and attract GST. A valid L&D invoice must contain both supplier and recipient details, GST breakdown, and a unique invoice number.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>When Do You Need an L&D Invoice?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 32 }}>
          {[
            { icon: "🏢", title: "Corporate reimbursement", body: "Your company requires a GST invoice to reimburse you for an online course or training program." },
            { icon: "🎓", title: "Platform invoices don't qualify", body: "Udemy, Coursera, or LinkedIn Learning invoices sometimes don't have all the required fields for your finance team." },
            { icon: "📋", title: "L&D budget tracking", body: "HR teams managing employee learning budgets need structured invoices to maintain clean records." },
            { icon: "🏗️", title: "Training institutes", body: "Coaching centres and training providers need to issue professional invoices to corporate clients." },
          ].map(f => (
            <div key={f.title} style={{ background: "#fff", borderRadius: 12, padding: "16px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{f.body}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What Fields Must an L&D Invoice Contain?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 20 }}>
          A valid L&D tax invoice in India must include:
        </p>

        <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["Field", "Example", "Required?"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", borderBottom: "1px solid #E2E8F0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Invoice Number", "IN2026-1334632", "✅ Required"],
                ["Invoice Date", "12/06/2026", "✅ Required"],
                ["Supplier Name", "Udemy India LLP", "✅ Required"],
                ["Supplier Address", "10th Floor, Gurugram 122003", "✅ Required"],
                ["Supplier GSTIN", "06AAFFU9763M1ZE", "✅ Required"],
                ["Recipient Name", "Rajesh Verma", "✅ Required"],
                ["Recipient Email", "rajesh@company.com", "✅ Required"],
                ["Course Description", "Leadership with AI", "✅ Required"],
                ["HSN/SAC Code", "998433", "✅ Required"],
                ["Quantity", "1.0", "✅ Required"],
                ["Taxable Value", "₹7,999.00", "✅ Required"],
                ["CGST / SGST or IGST", "9% + 9% or 18%", "✅ Required"],
                ["Total Amount", "₹9,438.80", "✅ Required"],
                ["Recipient GSTIN", "29ABCDE1234F1Z5", "⚠️ If applicable"],
              ].map(([a, b, c], i) => (
                <tr key={i} style={{ borderBottom: "1px solid #F1F5F9", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                  <td style={{ padding: "10px 14px", fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{a}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: "#475569" }}>{b}</td>
                  <td style={{ padding: "10px 14px", fontSize: 13, color: "#475569" }}>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout icon="💡" title="CGST vs IGST" color="#FFFBEB" borderColor="#F59E0B">
          Use <strong>CGST + SGST</strong> (9% + 9%) when both supplier and recipient are in the same state. Use <strong>IGST</strong> (18%) when they are in different states. OpsTools lets you toggle between both modes.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 24px", letterSpacing: "-0.01em" }}>How to Generate an L&D Invoice — Step by Step</h2>

        <Step number={1} title="Open the L&D Bill Generator">
          Go to <Link to="/documents/ld-bill" style={{ color: "#7C3AED", fontWeight: 600 }}>opstools.ai/documents/ld-bill</Link>. No login or account required.
        </Step>
        <Step number={2} title="Fill in Invoice Details">
          Enter the invoice number, date, and optionally a logo URL. If your company or institution has a logo online, paste the URL and it will appear on the invoice automatically.
        </Step>
        <Step number={3} title="Choose GST Type">
          Select CGST + SGST for intra-state transactions, or IGST for inter-state. This determines which tax columns appear in the invoice.
        </Step>
        <Step number={4} title="Enter Supplier Details">
          Fill in the training provider's name, address, and GSTIN. For platforms like Udemy India, the GSTIN is printed on their platform-generated invoice — copy it from there.
        </Step>
        <Step number={5} title="Enter Recipient Details">
          Add the employee or company receiving the training. For corporate reimbursements, use the employee's name and the company's address.
        </Step>
        <Step number={6} title="Add Course Line Items">
          Click <strong>Add Item</strong> for each course. Enter the course name, HSN code (998433 for educational services), quantity (1), and rate. GST calculates automatically.
        </Step>
        <Step number={7} title="Download as PDF">
          Click <strong>Save PDF</strong>. The invoice downloads instantly — ready to submit for reimbursement or send to a client.
        </Step>

        <Callout icon="🔒" title="Your data is private" color="#F0FDF4" borderColor="#10B981">
          Everything you enter stays in your browser. OpsTools does not store, log, or transmit any invoice data. The PDF is generated entirely on your device.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 20px", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
        {[
          { q: "What HSN code should I use for training invoices?", a: "998433 is the SAC code for 'Commercial training and coaching services' in India. This covers online courses, classroom training, workshops, and professional development programs." },
          { q: "Can I add multiple courses on one invoice?", a: "Yes — the OpsTools L&D Bill Generator supports multiple line items. Click 'Add Item' for each course and the totals are calculated automatically." },
          { q: "What if the supplier doesn't have a GSTIN?", a: "Small training providers with annual turnover below the GST threshold may not have a GSTIN. In that case, leave the GSTIN field blank and note that the supplier is unregistered." },
          { q: "Can I use this for Udemy, Coursera, or LinkedIn Learning invoices?", a: "Yes — you can recreate or supplement an invoice from any platform. Enter the platform as the supplier, yourself or your company as the recipient, and the course as the line item." },
          { q: "Does the tool work on mobile?", a: "Yes — the L&D Bill Generator is fully mobile-responsive. You can fill in the form and download the PDF from your phone." },
          { q: "Is this free?", a: "Completely free. No login, no subscription, no credits required." },
        ].map((faq, i) => (
          <div key={i} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 20px", marginBottom: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Q: {faq.q}</div>
            <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>A: {faq.a}</div>
          </div>
        ))}

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg,#1e1b4b,#312e81)", borderRadius: 16, padding: "32px 28px", textAlign: "center", marginTop: 48, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Generate your L&D invoice now</h3>
          <p style={{ fontSize: 14, color: "#A5B4FC", margin: "0 0 24px" }}>Free · No login · Instant PDF · CGST/SGST/IGST support</p>
          <Link to="/documents/ld-bill" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#7C3AED,#4F46E5)", color: "#fff", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Generate L&D Invoice →
          </Link>
        </div>

        {/* Related */}
        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Related Tools</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { name: "GST Invoice Generator", href: "/documents/gst-invoice", desc: "Full GST invoices with bank details" },
              { name: "Salary Slip Generator", href: "/documents/salary-slip", desc: "Payslips with earnings & deductions" },
              { name: "Fuel Bill Generator", href: "/documents/fuel-bill", desc: "Petrol receipts for reimbursement" },
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
    </>
  );
}
