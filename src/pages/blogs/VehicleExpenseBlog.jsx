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
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#0284C7,#0369A1)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>{number}</div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>{title}</h3>
        <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>{children}</div>
      </div>
    </div>
  );
}

export default function VehicleExpenseBlog() {
  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <Helmet>
        <title>How to Generate a Vehicle Expense Report Online in India (2026) | OpsTools</title>
        <meta name="description" content="Complete guide to generating a vehicle expense report in India — track fuel, tolls, parking and maintenance for employee reimbursement or fleet management. Free, no login, instant PDF." />
        <meta property="og:title" content="How to Generate a Vehicle Expense Report Online in India (2026) | OpsTools" />
        <meta property="og:description" content="Complete guide to generating a vehicle expense report in India — track fuel, tolls, parking and maintenance for employee reimbursement or fleet management. Free, no login, instant PDF." />
        <meta property="og:url" content="https://www.opstools.ai/blogs/how-to-generate-vehicle-expense-report-online-india" />
        <link rel="canonical" href="https://www.opstools.ai/blogs/how-to-generate-vehicle-expense-report-online-india" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0c2340 55%,#0369a1 100%)", padding: "72px 24px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748B", display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#334155" }}>›</span>
            <Link to="/blogs" style={{ color: "#64748B", textDecoration: "none" }}>Blog</Link>
            <span style={{ color: "#334155" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Vehicle Expense Guide</span>
          </nav>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(2,132,199,0.2)", border: "1px solid rgba(2,132,199,0.3)", color: "#7DD3FC", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 999, marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>Guide</div>
            <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              How to Generate a Vehicle Expense Report Online in India (2026)
            </h1>
            <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 24px" }}>
              A complete guide to vehicle expense reports — tracking fuel, tolls, parking and maintenance for employee reimbursement or fleet management, and generating a compliant report for free.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#64748B", flexWrap: "wrap" }}>
              <span>Gulnaaz</span><span>·</span><span>September 19, 2026</span><span>·</span><span>6 min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
          {[
            ["Report Modes", "Employee or Fleet", "#E0F2FE", "#0284C7"],
            ["Distance", "Auto-calculated", "#DBEAFE", "#2563EB"],
            ["Expense Types", "9 categories", "#EDE9FE", "#7C3AED"],
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
          Claiming travel expenses or tracking fleet running costs usually means wrestling with a spreadsheet or waiting on your accounts team to build a report from scattered receipts. Fuel slips get lost, toll receipts fade, and by the time reimbursement season comes around nobody remembers which trip a particular expense belonged to.
        </p>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          This guide covers what a vehicle expense report should include, the difference between employee reimbursement and fleet management reports, and how to generate a clean, print-ready report for free in a couple of minutes.
        </p>

        <Callout icon="✅" title="Quick answer" color="#F0F9FF" borderColor="#0284C7">
          Go to <Link to="/documents/vehicle-expense" style={{ color: "#0284C7", fontWeight: 600 }}>opstools.ai/documents/vehicle-expense</Link>, choose Employee Reimbursement or Fleet Management, log your fuel, toll, parking and maintenance entries, and click Save PDF. Totals and distance are calculated automatically. No login, no subscription, no cost.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What is a Vehicle Expense Report?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          A vehicle expense report is a structured record of costs incurred while using a vehicle for work — fuel, tolls, parking, maintenance and repairs. It is used to support employee reimbursement claims and to track running costs across a fleet of vehicles.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Instead of forwarding a folder of individual receipts to your accounts team, a vehicle expense report groups every entry into one dated, itemized document with a running total — the same document your approver signs off on and your finance team files for audit.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>Who Needs This</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {[
            { title: "Employee travel reimbursement", desc: "Log every trip-related expense against a report number your accounts team can approve." },
            { title: "Fleet expense tracking", desc: "See total spend broken down by vehicle across your whole fleet in one report." },
            { title: "Business mileage records", desc: "Odometer-based distance tracking supports mileage-based reimbursement policies." },
            { title: "Tax and audit documentation", desc: "Keep a clean, dated record of vehicle-related business expenses." },
            { title: "Replacing lost receipts", desc: "Misplaced a fuel or toll receipt? Log the expense manually before your reimbursement deadline." },
          ].map(f => (
            <div key={f.title} style={{ display: "flex", gap: 14, background: "#F0F9FF", borderRadius: 12, padding: "16px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0284C7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🚗</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What Should a Vehicle Expense Report Include?</h2>
        <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Field","Example","Required?"].map(h=><th key={h} style={{ padding:"10px 14px", fontSize:12, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"left", borderBottom:"1px solid #E2E8F0" }}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ["Report No.","VEH-2026-3737","✅ Required"],
                ["Period","01/09/2026 – 30/09/2026","✅ Required"],
                ["Employee / Fleet Details","Rajesh Verma, EMP-1042","✅ Required"],
                ["Vehicle Reg. No.","MH12AB1234","✅ Required"],
                ["Expense Type","Fuel / Toll / Parking / Maintenance","✅ Required"],
                ["Odometer Reading","12000 → 12150 (150 km)","✅ In Employee Reimbursement mode"],
                ["Amount","₹850.00","✅ Required"],
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

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>Employee Reimbursement vs Fleet Management</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          The two modes cover the two most common use cases, and picking the right one changes what the report tracks:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
          {[
            { title: "Employee Reimbursement", pros: "Tracks a single vehicle. Enter an odometer start and end reading per trip and the distance is calculated automatically — built for one employee claiming back a travel expense.", color: "#F0F9FF", border: "#0284C7" },
            { title: "Fleet Management", pros: "Tracks multiple vehicles at once. Add every vehicle in your fleet and the report shows a per-vehicle breakdown — entries and total spend — across the whole fleet.", color: "#EFF6FF", border: "#2563EB" },
          ].map(f=>(
            <div key={f.title} style={{ background: f.color, borderRadius: 12, padding: "16px", border: `1px solid ${f.border}20` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{f.pros}</div>
            </div>
          ))}
        </div>

        <Callout icon="💡" title="Tip — Categorize every entry" color="#F0F9FF" borderColor="#0284C7">
          Log each expense under its own category — Fuel, Toll, Parking, Maintenance, Repair, Tyre, Oil Change, Insurance or Other — instead of lumping everything into one line. The report totals each category automatically, which makes it far easier for an approver to sanity-check and for your accounts team to reconcile.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 24px", letterSpacing: "-0.01em" }}>How to Generate a Vehicle Expense Report — Step by Step</h2>
        <Step number={1} title="Choose a mode">Go to <Link to="/documents/vehicle-expense" style={{ color: "#0284C7", fontWeight: 600 }}>opstools.ai/documents/vehicle-expense</Link> and pick Employee Reimbursement for one vehicle, or Fleet Management for several. No login required.</Step>
        <Step number={2} title="Fill in report details">Enter the report number, the period it covers, and the approver's name.</Step>
        <Step number={3} title="Add employee or fleet details">In Employee mode, add the employee's details and their vehicle. In Fleet mode, add every vehicle you want to track.</Step>
        <Step number={4} title="Log expense entries">Add each fuel, toll, parking, maintenance or repair expense as its own line item, with a date, description and amount.</Step>
        <Step number={5} title="Preview your report">Check the live preview as you go — totals, category breakdowns, and (in Employee mode) distance travelled all update instantly.</Step>
        <Step number={6} title="Download PDF">Click Save PDF to download the finished report directly to your device, ready to attach to a reimbursement claim or file for the fleet's records.</Step>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 20px", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
        {[
          { q: "Is this vehicle expense report generator free to use?", a: "Yes, completely free with no login required." },
          { q: "Can I track expenses for more than one vehicle?", a: "Yes. Switch to Fleet Management mode to add multiple vehicles and see a per-vehicle expense breakdown." },
          { q: "Does it calculate distance travelled?", a: "Yes, in Employee Reimbursement mode — enter the odometer start and end reading for a trip and the distance is calculated automatically." },
          { q: "Does this generate a PDF?", a: "Yes. Click Save PDF to directly download the report as a PDF file." },
          { q: "What expense types can I log?", a: "Fuel, Toll, Parking, Maintenance, Repair, Tyre, Oil Change, Insurance, and Other — each entry is tagged with its category so the report can total them separately." },
          { q: "Does my data get stored or uploaded anywhere?", a: "No — everything happens in your browser. Nothing is uploaded or stored on our servers." },
        ].map((faq, i) => (
          <div key={i} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 20px", marginBottom: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Q: {faq.q}</div>
            <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>A: {faq.a}</div>
          </div>
        ))}

        <div style={{ background: "linear-gradient(135deg,#0c2340,#07011F)", borderRadius: 16, padding: "32px 28px", textAlign: "center", marginTop: 48, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>Generate your vehicle expense report now</h3>
          <p style={{ fontSize: 14, color: "#7DD3FC", margin: "0 0 24px" }}>Free · No login · Employee or fleet mode · Auto-calculated distance · Instant PDF</p>
          <Link to="/documents/vehicle-expense" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#0284C7,#0369A1)", color: "#fff", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Generate Vehicle Expense Report →
          </Link>
        </div>

        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Related Tools</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { name: "Fuel Bill Generator", href: "/documents/fuel-bill", desc: "Petrol & diesel receipts, 4 Indian formats" },
              { name: "Rent Receipt Generator", href: "/documents/rent-receipt", desc: "HRA-compliant rent receipts" },
              { name: "Salary Slip Generator", href: "/documents/salary-slip", desc: "Professional payslips" },
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
