import { Link } from "react-router-dom";

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
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#2563EB,#4F46E5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>
        {number}
      </div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>{title}</h3>
        <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>{children}</div>
      </div>
    </div>
  );
}

// ─── Hero SVG illustration ─────────────────────────────────────────────────────

export default function FuelBillBlog() {
  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0D0630 55%,#1e1b4b 100%)", padding: "72px 24px 48px", overflow: "hidden" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748B", display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#334155" }}>›</span>
            <Link to="/blogs" style={{ color: "#64748B", textDecoration: "none" }}>Blog</Link>
            <span style={{ color: "#334155" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Fuel Bill Generator</span>
          </nav>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.3)", color: "#93C5FD", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 999, marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>
              Guide
            </div>
            <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              How to Generate a Fuel Bill Online for Free in India (2026)
            </h1>
            <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 24px" }}>
              A complete guide to generating petrol and diesel receipts online — for reimbursement, expense tracking, and fleet management. No login needed.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#64748B", flexWrap: "wrap" }}>
              <span>OpsTools Team</span>
              <span>·</span>
              <span>June 20, 2026</span>
              <span>·</span>
              <span>7 min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Hero illustration */}
      <div style={{ background: "#07011F", borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
          <svg width="100%" viewBox="0 0 680 300" role="img" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
            <title>Fuel Bill Generator illustration</title>
            <desc>A petrol pump on the left, a detailed receipt in the center, and a PDF document on the right, connected by dotted lines.</desc>
            <rect width="680" height="300" fill="#07011F"/>
            <ellipse cx="180" cy="180" rx="160" ry="120" fill="#2563EB" opacity="0.07"/>
            <ellipse cx="500" cy="140" rx="180" ry="130" fill="#4F46E5" opacity="0.07"/>
            <pattern id="bdots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.04)"/></pattern>
            <rect width="680" height="300" fill="url(#bdots)"/>
            <g transform="translate(88, 80)">
              <rect x="0" y="24" width="64" height="88" rx="6" fill="#1e3a8a" stroke="#2563EB" strokeWidth="1"/>
              <rect x="8" y="32" width="48" height="32" rx="3" fill="#0f172a" stroke="#1d4ed8" strokeWidth="0.5"/>
              <rect x="14" y="40" width="20" height="2" rx="1" fill="#60a5fa" opacity="0.8"/>
              <rect x="14" y="46" width="30" height="2" rx="1" fill="#3b82f6" opacity="0.5"/>
              <rect x="14" y="52" width="24" height="2" rx="1" fill="#3b82f6" opacity="0.3"/>
              <rect x="12" y="72" width="40" height="22" rx="2" fill="#1d4ed8" opacity="0.3"/>
              <rect x="16" y="76" width="10" height="6" rx="1" fill="#2563EB" opacity="0.6"/>
              <rect x="30" y="76" width="10" height="6" rx="1" fill="#2563EB" opacity="0.4"/>
              <rect x="16" y="86" width="24" height="4" rx="2" fill="#4f46e5" opacity="0.5"/>
              <rect x="64" y="36" width="18" height="6" rx="3" fill="#1d4ed8" stroke="#2563EB" strokeWidth="0.5"/>
              <path d="M82 39 Q100 39 100 55 L100 75" stroke="#1d4ed8" strokeWidth="5" fill="none" strokeLinecap="round"/>
              <rect x="94" y="72" width="14" height="8" rx="3" fill="#2563EB"/>
              <circle cx="32" cy="16" r="10" fill="#1d4ed8" stroke="#3b82f6" strokeWidth="0.5"/>
              <text x="32" y="20" textAnchor="middle" fill="#93c5fd" fontSize="9" fontWeight="700" fontFamily="sans-serif">⛽</text>
            </g>
            <line x1="215" y1="150" x2="258" y2="150" stroke="#2563EB" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5"/>
            <circle cx="215" cy="150" r="3" fill="#2563EB" opacity="0.6"/>
            <circle cx="258" cy="150" r="3" fill="#2563EB" opacity="0.6"/>
            <g transform="translate(258, 34)">
              <rect x="4" y="4" width="164" height="232" rx="10" fill="rgba(0,0,0,0.4)"/>
              <rect x="0" y="0" width="164" height="232" rx="10" fill="#0f1d3d" stroke="#1e3a8a" strokeWidth="1"/>
              <rect x="0" y="0" width="164" height="4" rx="2" fill="#2563EB"/>
              <rect x="12" y="16" width="80" height="7" rx="3.5" fill="#2563EB" opacity="0.9"/>
              <rect x="12" y="28" width="120" height="4" rx="2" fill="rgba(255,255,255,0.12)"/>
              <rect x="12" y="36" width="90" height="3" rx="1.5" fill="rgba(255,255,255,0.07)"/>
              <line x1="12" y1="46" x2="152" y2="46" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
              <rect x="12" y="54" width="56" height="3" rx="1.5" fill="rgba(255,255,255,0.15)"/>
              <rect x="116" y="54" width="36" height="3" rx="1.5" fill="#60a5fa" opacity="0.7"/>
              <rect x="12" y="64" width="70" height="3" rx="1.5" fill="rgba(255,255,255,0.1)"/>
              <rect x="120" y="64" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.15)"/>
              <rect x="12" y="74" width="48" height="3" rx="1.5" fill="rgba(255,255,255,0.1)"/>
              <rect x="118" y="74" width="34" height="3" rx="1.5" fill="rgba(255,255,255,0.12)"/>
              <rect x="12" y="84" width="64" height="3" rx="1.5" fill="rgba(255,255,255,0.08)"/>
              <rect x="120" y="84" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.1)"/>
              <rect x="12" y="94" width="52" height="3" rx="1.5" fill="rgba(255,255,255,0.08)"/>
              <rect x="116" y="94" width="36" height="3" rx="1.5" fill="rgba(255,255,255,0.1)"/>
              <line x1="12" y1="106" x2="152" y2="106" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
              <rect x="12" y="114" width="44" height="3" rx="1.5" fill="rgba(255,255,255,0.12)"/>
              <rect x="100" y="114" width="52" height="3" rx="1.5" fill="#818cf8" opacity="0.6"/>
              <rect x="12" y="124" width="38" height="3" rx="1.5" fill="rgba(255,255,255,0.08)"/>
              <line x1="12" y1="134" x2="152" y2="134" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5"/>
              <rect x="8" y="142" width="148" height="24" rx="5" fill="#1d4ed8" opacity="0.25"/>
              <rect x="14" y="149" width="44" height="4" rx="2" fill="rgba(255,255,255,0.3)"/>
              <rect x="104" y="148" width="44" height="6" rx="3" fill="#60a5fa" opacity="0.9"/>
              <rect x="36" y="176" width="92" height="20" rx="2" fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
              {[0,4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80,84,88].map((x,i) => (
                <rect key={i} x={42+x} y="179" width={x%12===0?2:1} height="14" rx="0.5" fill="rgba(255,255,255,0.2)"/>
              ))}
              <text x="82" y="220" textAnchor="middle" fill="rgba(255,255,255,0.25)" fontSize="8" fontFamily="sans-serif" letterSpacing="0.1em">OPSTOOLS.AI</text>
            </g>
            <line x1="424" y1="150" x2="466" y2="150" stroke="#4f46e5" strokeWidth="1.5" strokeDasharray="4 4" opacity="0.5"/>
            <circle cx="424" cy="150" r="3" fill="#4f46e5" opacity="0.6"/>
            <circle cx="466" cy="150" r="3" fill="#4f46e5" opacity="0.6"/>
            <g transform="translate(466, 86)">
              <rect x="4" y="4" width="96" height="120" rx="8" fill="rgba(0,0,0,0.35)"/>
              <rect x="0" y="0" width="96" height="120" rx="8" fill="#1e1b4b" stroke="#4f46e5" strokeWidth="1"/>
              <path d="M60 0 L96 36 L60 36 Z" fill="#2d2a72"/>
              <path d="M60 0 L96 36" stroke="#4f46e5" strokeWidth="0.5" fill="none"/>
              <rect x="8" y="44" width="32" height="14" rx="4" fill="#4f46e5"/>
              <text x="24" y="54" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="sans-serif">PDF</text>
              <rect x="8" y="66" width="72" height="3" rx="1.5" fill="rgba(255,255,255,0.12)"/>
              <rect x="8" y="74" width="56" height="3" rx="1.5" fill="rgba(255,255,255,0.08)"/>
              <rect x="8" y="82" width="64" height="3" rx="1.5" fill="rgba(255,255,255,0.08)"/>
              <circle cx="76" cy="96" r="14" fill="#312e81" stroke="#4f46e5" strokeWidth="0.5"/>
              <path d="M76 88 L76 98 M72 94 L76 99 L80 94" stroke="#818cf8" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
            </g>
            <text x="120" y="196" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="sans-serif">Petrol pump</text>
            <text x="340" y="282" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="11" fontWeight="600" fontFamily="sans-serif" letterSpacing="0.06em">FREE FUEL BILL GENERATOR</text>
            <text x="514" y="224" textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize="10" fontFamily="sans-serif">Saved as PDF</text>
          </svg>
        </div>
      </div>

      {/* Article */}
      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>

        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          Every month, thousands of Indian employees submit fuel bills for reimbursement — only to realise they've lost the receipt, the petrol pump didn't print one, or the printout is too faded to read. If you've been in this situation, you're not alone.
        </p>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          This guide explains everything you need to know about fuel bills in India — what they contain, why they matter, and how to generate a professional one in under 60 seconds using OpsTools, completely free.
        </p>

        <Callout icon="✅" title="Quick answer" color="#ECFDF5" borderColor="#10B981">
          Go to <Link to="/documents/fuel-bill" style={{ color: "#059669", fontWeight: 600 }}>opstools.ai/documents/fuel-bill</Link>, choose a template, fill in your details, and click Save PDF. No login, no subscription, no cost.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What is a Fuel Bill?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          A fuel bill (also called a petrol receipt or fuel receipt) is the printed proof of purchase issued by a petrol station when you refuel your vehicle. In India, these receipts are issued by pumps operated by IOCL, HPCL, BPCL, and private operators.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 24 }}>
          A standard Indian fuel bill contains the following information:
        </p>

        <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ background: "#F8FAFC" }}>
                {["Field", "Example", "For Reimbursement?"].map(h => (
                  <th key={h} style={{ padding: "10px 14px", fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", textAlign: "left", borderBottom: "1px solid #E2E8F0" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                ["Station Name", "PK Fuel Station, Kandivali", "✅ Required"],
                ["Station Address", "S V Rd, Mumbai 400067", "✅ Required"],
                ["GST Number", "27AABCU9603R1ZX", "✅ Required"],
                ["Date & Time", "20/06/2026 — 14:35", "✅ Required"],
                ["Fuel Type", "Petrol / Diesel / CNG", "✅ Required"],
                ["Quantity (Litres)", "9.52 L", "✅ Required"],
                ["Rate per Litre", "₹104.29", "✅ Required"],
                ["Total Amount", "₹992.00", "✅ Required"],
                ["Vehicle Number", "MH 12 AB 1234", "⚠️ Recommended"],
                ["Bill / Invoice No.", "G64695", "⚠️ Recommended"],
                ["Pump / Nozzle No.", "P-05 / N-02", "Optional"],
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

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>Why Do You Need a Fuel Bill?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 32 }}>
          {[
            { icon: "🏢", title: "Office reimbursement", body: "Most employers require a fuel receipt for travel or conveyance expense claims." },
            { icon: "🚚", title: "Fleet management", body: "Track fuel costs across multiple vehicles with structured, consistent receipts." },
            { icon: "💼", title: "Business records", body: "Maintain clean fuel expense records for your business accounts." },
            { icon: "📋", title: "Lost receipt replacement", body: "Misplaced your pump receipt? Generate a replacement before your deadline." },
          ].map(f => (
            <div key={f.title} style={{ background: "#fff", borderRadius: 12, padding: "16px", border: "1px solid #E2E8F0" }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>{f.icon}</div>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{f.body}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>The 4 Indian Fuel Bill Formats</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 20 }}>
          Not all petrol pumps use the same receipt format. OpsTools supports four formats modelled on real Indian pump receipts:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 32 }}>
          {[
            { id: "IOCL Formal", icon: "🏛️", desc: "Used at Indian Oil (IOCL) outlets. Features the logo, dashed separators, and formal layout with shift, pump, and nozzle number fields.", when: "Corporate reimbursement, formal expense claims" },
            { id: "Classic POS", icon: "🖨️", desc: "Monospace font, bold header — the most common format at private petrol stations and HPCL/BPCL outlets.", when: "General reimbursement, small business expense records" },
            { id: "Thermal Full", icon: "📋", desc: "Dot-matrix style thermal receipt with all fields including FCC ID, FIP number, LST number, and attendant ID.", when: "Fleet operators, detailed expense tracking" },
            { id: "Thermal Compact", icon: "📄", desc: "Minimal thermal receipt with only the core transaction fields. Fastest to fill in.", when: "Quick claims, WhatsApp submission" },
          ].map(t => (
            <div key={t.id} style={{ background: "#fff", borderRadius: 12, padding: "16px 18px", border: "1px solid #E2E8F0", display: "flex", gap: 14 }}>
              <span style={{ fontSize: 28, flexShrink: 0 }}>{t.icon}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{t.id}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.65, marginBottom: 6 }}>{t.desc}</div>
                <div style={{ fontSize: 12, color: "#2563EB", fontWeight: 600 }}>Best for: {t.when}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 24px", letterSpacing: "-0.01em" }}>How to Generate a Fuel Bill — Step by Step</h2>
        <Step number={1} title="Open the Fuel Bill Generator">
          Go to <Link to="/documents/fuel-bill" style={{ color: "#2563EB", fontWeight: 600 }}>opstools.ai/documents/fuel-bill</Link>. No login or account required.
        </Step>
        <Step number={2} title="Choose your template">
          Select from Thermal Full, Classic POS, IOCL Formal, or Thermal Compact. IOCL Formal or Classic POS are most widely accepted for office reimbursements.
        </Step>
        <Step number={3} title="Fill in station details">
          Enter the petrol station name, address, GST number, and optionally a logo URL. The preview updates live as you type.
        </Step>
        <Step number={4} title="Enter transaction details">
          Add date, time, fuel type (Petrol/Diesel/CNG), quantity in litres, and rate per litre. The total amount calculates automatically.
        </Step>
        <Step number={5} title="Add vehicle information">
          Enter the vehicle registration number. Most finance teams require this for processing claims.
        </Step>
        <Step number={6} title="Download as PDF">
          Click <strong>Save PDF</strong>. The receipt downloads directly to your device — ready to email or attach to an expense claim.
        </Step>

        <Callout icon="🔒" title="Your data is private" color="#F0FDF4" borderColor="#10B981">
          All data you enter stays in your browser. OpsTools does not store, transmit, or log any information you fill in. The PDF is generated entirely on your device.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 20px", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
        {[
          { q: "Can I use this for office reimbursement?", a: "Yes — for internal reimbursement purposes, a generated fuel bill is generally accepted as long as it contains all the required fields: station name, address, GST, date, fuel type, quantity, rate, amount, and vehicle number. Always check your company's expense policy." },
          { q: "What if I don't know the petrol station's GST number?", a: "You can look up any petrol station's GSTIN on the GST portal (gst.gov.in) by searching their business name. For IOCL outlets, the GSTIN is often printed on the pump itself." },
          { q: "Does the tool work on mobile?", a: "Yes — the OpsTools Fuel Bill Generator is fully mobile-responsive. Fill in the form, preview the bill, and download the PDF directly from your phone." },
          { q: "Is this free?", a: "Completely free. No subscription, no credits, no login required for generating individual fuel bills." },
          { q: "Can I add a petrol station logo to the bill?", a: "Yes — paste any public image URL in the Logo URL field and it will appear on the IOCL Formal template." },
          { q: "What formats are supported?", a: "Four formats: IOCL Formal, Classic POS, Thermal Full, and Thermal Compact — all modelled on real Indian petrol station receipts." },
        ].map((faq, i) => (
          <div key={i} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 20px", marginBottom: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Q: {faq.q}</div>
            <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>A: {faq.a}</div>
          </div>
        ))}

        {/* CTA */}
        <div style={{ background: "linear-gradient(135deg,#07011F,#1e1b4b)", borderRadius: 16, padding: "32px 28px", textAlign: "center", marginTop: 48, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px", letterSpacing: "-0.02em" }}>Generate your fuel bill now</h3>
          <p style={{ fontSize: 14, color: "#94A3B8", margin: "0 0 24px" }}>Free · No login · Instant PDF · 4 Indian receipt formats</p>
          <Link to="/documents/fuel-bill" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#2563EB,#4F46E5)", color: "#fff", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Generate Fuel Bill →
          </Link>
        </div>

        {/* Related */}
        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Related Tools</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { name: "Rent Receipt Generator", href: "/documents/rent-receipt", desc: "HRA-compliant receipts with PAN" },
              { name: "ROI Calculator", href: "/business/roi-calculator", desc: "Calculate return on investment" },
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
