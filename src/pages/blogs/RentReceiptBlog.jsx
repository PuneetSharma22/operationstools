import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import BlogSidebar from "../../components/blog/BlogSidebar";

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

export default function RentReceiptBlog() {
  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <Helmet>
        <title>How to Generate a Rent Receipt Online for HRA Exemption in India (2026) | OpsTools</title>
        <meta name="description" content="Complete guide to rent receipts for HRA tax exemption in India. Covers mandatory fields, landlord PAN requirement, monthly vs annual receipts, and free PDF download." />
        <meta property="og:title" content="How to Generate a Rent Receipt Online for HRA Exemption in India (2026) | OpsTools" />
        <meta property="og:description" content="Complete guide to rent receipts for HRA tax exemption in India. Covers mandatory fields, landlord PAN requirement, monthly vs annual receipts, and free PDF download." />
        <meta property="og:url" content="https://www.opstools.ai/blogs/how-to-generate-rent-receipt-online-india" />
        <link rel="canonical" href="https://www.opstools.ai/blogs/how-to-generate-rent-receipt-online-india" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>
      <style>{`@media(max-width:900px){.blog-layout{grid-template-columns:1fr!important}.blog-sidebar{position:static!important;margin-top:32px;}}`}</style>

      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#052e16 55%,#14532d 100%)", padding: "72px 24px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748B", display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#334155" }}>›</span>
            <Link to="/blogs" style={{ color: "#64748B", textDecoration: "none" }}>Blog</Link>
            <span style={{ color: "#334155" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Rent Receipt Guide</span>
          </nav>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(5,150,105,0.2)", border: "1px solid rgba(5,150,105,0.3)", color: "#6EE7B7", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 999, marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>Guide</div>
            <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              How to Generate a Rent Receipt Online for HRA Exemption in India (2026)
            </h1>
            <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 24px" }}>
              A complete guide to rent receipts for HRA tax exemption — what fields are mandatory, when you need the landlord's PAN, and how to generate a compliant receipt for free.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#64748B", flexWrap: "wrap" }}>
              <span>Prakash Jha</span><span>·</span><span>July 23, 2026</span><span>·</span><span>6 min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
          {[
            ["PAN Required", "If rent > ₹1 lakh/year", "#D1FAE5", "#059669"],
            ["HRA Limit", "Metro: 50% of Basic", "#DBEAFE", "#2563EB"],
            ["Receipt Period", "Monthly recommended", "#EDE9FE", "#7C3AED"],
            ["Revenue Stamp", "If paid in cash", "#FEF3C7", "#D97706"],
          ].map(([l,v,bg,c])=>(
            <div key={l} style={{ background: bg, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: c }}>{l}</div>
              <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "48px 24px 80px" }}>
        <div className="blog-layout" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 48, alignItems: "start" }}>
        <div>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          Every year, thousands of salaried employees in India miss out on HRA (House Rent Allowance) tax exemption simply because they don't have proper rent receipts. Their employer deducts more TDS than necessary, and they end up filing for refunds — or worse, never claiming the exemption at all.
        </p>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          This guide covers everything you need to know about rent receipts for HRA exemption — what fields are mandatory, when you need your landlord's PAN, monthly vs annual receipts, and how to generate a compliant receipt in under a minute.
        </p>

        <Callout icon="✅" title="Quick answer" color="#F0FDF4" borderColor="#059669">
          Go to <Link to="/documents/rent-receipt" style={{ color: "#059669", fontWeight: 600 }}>opstools.ai/documents/rent-receipt</Link>, fill in tenant and landlord details, enter the monthly rent amount and period, and click Save PDF. No login, no subscription, no cost.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What is HRA and Why Do You Need Rent Receipts?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          HRA (House Rent Allowance) is a component of your salary that is partially exempt from income tax if you live in rented accommodation. To claim this exemption, you need to submit rent receipts to your employer — who uses them to reduce the TDS deducted from your salary.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Without rent receipts, your employer treats the full HRA as taxable income and deducts higher TDS. You can reclaim the excess tax by filing your ITR, but it's much simpler to submit receipts and avoid the deduction in the first place.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>How Much HRA is Tax-Exempt?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          The HRA exemption is the <strong>minimum of these three amounts</strong>:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {[
            { num: "1", title: "Actual HRA received", desc: "The HRA component in your salary slip — as stated by your employer." },
            { num: "2", title: "50% of Basic Salary (metro) or 40% (non-metro)", desc: "Metro cities: Delhi, Mumbai, Kolkata, Chennai. All other cities are non-metro." },
            { num: "3", title: "Actual rent paid minus 10% of Basic Salary", desc: "Rent you pay each month × 12, minus 10% of your annual basic salary." },
          ].map(({ num, title, desc }) => (
            <div key={num} style={{ display: "flex", gap: 14, background: "#F0FDF4", borderRadius: 12, padding: "16px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#059669", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, flexShrink: 0 }}>{num}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{title}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>Mandatory Fields on a Rent Receipt</h2>
        <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Field","Example","Required?"].map(h=><th key={h} style={{ padding:"10px 14px", fontSize:12, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"left", borderBottom:"1px solid #E2E8F0" }}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ["Tenant Name","Rajesh Verma","✅ Required"],
                ["Landlord Name","Suresh Patel","✅ Required"],
                ["Rental Property Address","123, MG Road, Bangalore 560001","✅ Required"],
                ["Rent Amount","₹18,000 per month","✅ Required"],
                ["Period Covered","June 2026 (or 1 June – 30 June)","✅ Required"],
                ["Date of Receipt","Date the receipt is issued","✅ Required"],
                ["Landlord's PAN","ABCDE1234F","✅ If rent > ₹1 lakh/year"],
                ["Revenue Stamp","₹1 stamp if cash payment","✅ If paid in cash"],
                ["Landlord Signature","Signed by landlord","✅ Required"],
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

        <Callout icon="⚠️" title="PAN Requirement" color="#FFFBEB" borderColor="#F59E0B">
          If your annual rent exceeds ₹1,00,000 (i.e., more than ₹8,333/month), your employer is required to collect your landlord's PAN. Without it, the employer cannot grant the full HRA exemption. If your landlord doesn't have a PAN, they need to provide a declaration stating so.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>Monthly vs Annual Rent Receipts</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Most employers accept either format, but monthly receipts are safer and more commonly expected:
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 24 }}>
          {[
            { title: "Monthly receipts", pros: "More credible, easier to verify, matches payroll periods, easier to submit quarterly", color: "#F0FDF4", border: "#059669" },
            { title: "Annual / Lump-sum receipt", pros: "Simpler — one document for the full year. Some employers accept this. Less paperwork for tenant and landlord.", color: "#EFF6FF", border: "#2563EB" },
          ].map(f=>(
            <div key={f.title} style={{ background: f.color, borderRadius: 12, padding: "16px", border: `1px solid ${f.border}20` }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{f.pros}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 24px", letterSpacing: "-0.01em" }}>How to Generate a Rent Receipt — Step by Step</h2>
        <Step number={1} title="Open the Rent Receipt Generator">Go to <Link to="/documents/rent-receipt" style={{ color: "#059669", fontWeight: 600 }}>opstools.ai/documents/rent-receipt</Link>. No login required.</Step>
        <Step number={2} title="Enter Tenant Details">Add your full name as it appears on your salary slip or ID. The name must match what you've told your employer.</Step>
        <Step number={3} title="Enter Landlord Details">Add landlord's full name and PAN number. PAN is mandatory if monthly rent exceeds ₹8,333.</Step>
        <Step number={4} title="Enter Property Address">Add the complete address of the rented property including PIN code. This must match what you've submitted to your employer.</Step>
        <Step number={5} title="Set Rent Amount and Period">Enter the monthly rent amount and select the month and year. Generate one receipt per month if you want monthly receipts.</Step>
        <Step number={6} title="Add Payment Method">Specify whether rent was paid by cash, cheque, bank transfer, or UPI. If cash, a revenue stamp is required.</Step>
        <Step number={7} title="Download PDF">Click Save PDF. Print the receipt and have your landlord sign it. For digital submission, a scanned signed copy is usually accepted.</Step>

        <Callout icon="💡" title="Tip — Generate all 12 at once" color="#F0FDF4" borderColor="#059669">
          At the start of the financial year (April), generate all 12 monthly receipts at once, get them signed by your landlord, and submit the full set to your employer's HR team. This avoids the monthly hassle and ensures you don't miss any deadlines.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 20px", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
        {[
          { q: "Can I claim HRA if I pay rent to my parents?", a: "Yes — you can pay rent to your parents and claim HRA exemption. However, your parents must declare this rental income in their ITR. A formal rent agreement and regular rent receipts are required." },
          { q: "What if my landlord refuses to give their PAN?", a: "If your landlord genuinely doesn't have a PAN, they can provide a written declaration to that effect. Without this, your employer may not grant the full HRA exemption, but you can still claim it while filing your ITR." },
          { q: "Do I need to submit rent receipts to the Income Tax Department?", a: "No — rent receipts are submitted to your employer for TDS purposes. The IT department may ask for them during scrutiny, so keep copies for at least 6 years." },
          { q: "Is a digital/electronic rent receipt valid?", a: "Yes — digital receipts are accepted for HRA claims. Most employers accept scanned signed receipts or PDFs. Make sure the landlord's signature is present." },
          { q: "Can I claim HRA if I'm living in my own house?", a: "No — HRA exemption is only for employees who live in rented accommodation and pay rent. If you own the property you live in, the HRA portion of your salary is fully taxable." },
          { q: "Is this tool free?", a: "Completely free. No login, no subscription, no credits required." },
        ].map((faq, i) => (
          <div key={i} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 20px", marginBottom: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Q: {faq.q}</div>
            <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>A: {faq.a}</div>
          </div>
        ))}

        <div style={{ background: "linear-gradient(135deg,#052e16,#14532d)", borderRadius: 16, padding: "32px 28px", textAlign: "center", marginTop: 48, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>Generate your rent receipt now</h3>
          <p style={{ fontSize: 14, color: "#6EE7B7", margin: "0 0 24px" }}>Free · No login · HRA-compliant · Landlord PAN field · Instant PDF</p>
          <Link to="/documents/rent-receipt" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#059669,#047857)", color: "#fff", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Generate Rent Receipt →
          </Link>
        </div>

        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Related Tools</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { name: "Salary Slip Generator", href: "/documents/salary-slip", desc: "To verify HRA component" },
              { name: "GST Invoice Generator", href: "/documents/gst-invoice", desc: "Tax-compliant invoices" },
              { name: "L&D Tax Invoice", href: "/documents/ld-bill", desc: "Training course invoices" },
            ].map(r => (
              <Link key={r.name} to={r.href} style={{ flex: 1, minWidth: 160, background: "#fff", borderRadius: 12, padding: "14px 16px", border: "1px solid #E2E8F0", textDecoration: "none", display: "flex", flexDirection: "column", gap: 4 }}>
                <span style={{ fontSize: 14, fontWeight: 700, color: "#0F172A" }}>{r.name}</span>
                <span style={{ fontSize: 12, color: "#64748B" }}>{r.desc}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
        <div style={{ position: "sticky", top: 88 }} className="blog-sidebar">
          <BlogSidebar currentSlug="how-to-generate-rent-receipt-online-india" />
        </div>
        </div>
      </div>
    </div>
  );
}
