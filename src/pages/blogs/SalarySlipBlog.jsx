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
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#DB2777,#9D174D)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>{number}</div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>{title}</h3>
        <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>{children}</div>
      </div>
    </div>
  );
}

export default function SalarySlipBlog() {
  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <Helmet>
        <title>How to Generate a Salary Slip Online in India for Free (2026) | OpsTools</title>
        <meta name="description" content="Complete guide to generating professional salary slips in India. Covers CTC structure, basic pay, HRA, PF, TDS, deductions and net pay calculation." />
        <meta property="og:title" content="How to Generate a Salary Slip Online in India for Free (2026) | OpsTools" />
        <meta property="og:description" content="Complete guide to generating professional salary slips in India. Covers CTC structure, basic pay, HRA, PF, TDS, deductions and net pay calculation." />
        <meta property="og:url" content="https://www.opstools.ai/blogs/how-to-generate-salary-slip-online-india" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>

      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#1a0a1e 55%,#3b0764 100%)", padding: "72px 24px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748B", display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#334155" }}>›</span>
            <Link to="/blogs" style={{ color: "#64748B", textDecoration: "none" }}>Blog</Link>
            <span style={{ color: "#334155" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Salary Slip Guide</span>
          </nav>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(219,39,119,0.2)", border: "1px solid rgba(219,39,119,0.3)", color: "#F9A8D4", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 999, marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>Guide</div>
            <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              How to Generate a Salary Slip Online in India for Free (2026)
            </h1>
            <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 24px" }}>
              A complete guide to salary slips in India — CTC structure, basic pay, HRA, PF, TDS, deductions, net pay, and how to generate a professional payslip instantly.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#64748B", flexWrap: "wrap" }}>
              <span>OpsTools Team</span><span>·</span><span>July 8, 2026</span><span>·</span><span>7 min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* White illustration strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "32px 24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px,1fr))", gap: 12 }}>
          {[["Basic Pay","40-50% of CTC","#FCE7F3","#DB2777"],["HRA","40-50% of Basic","#EDE9FE","#7C3AED"],["PF","12% of Basic","#DBEAFE","#2563EB"],["TDS","As per slab","#FEF3C7","#D97706"],["Net Pay","Gross - Deductions","#D1FAE5","#059669"]].map(([l,v,bg,c])=>(
            <div key={l} style={{ background: bg, borderRadius: 12, padding: "14px 16px", textAlign: "center" }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: c }}>{l}</div>
              <div style={{ fontSize: 12, color: "#475569", marginTop: 4 }}>{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ maxWidth: 760, margin: "0 auto", padding: "48px 24px 80px" }}>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          A salary slip is one of the most requested documents in India — for home loan applications, visa processing, new job offers, rent agreements, and tax filing. Yet most small businesses and startups don't have a payroll system that generates them automatically.
        </p>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          This guide covers what goes into a salary slip, how the CTC structure works, and how to generate a professional payslip for free — for any employee, any month.
        </p>

        <Callout icon="✅" title="Quick answer" color="#FCE7F3" borderColor="#DB2777">
          Go to <Link to="/documents/salary-slip" style={{ color: "#DB2777", fontWeight: 600 }}>opstools.ai/documents/salary-slip</Link>, fill in the employee and salary details, and click Save PDF. No login, no subscription, no cost.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What is a Salary Slip?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          A salary slip (also called a payslip or pay stub) is a document issued by an employer to an employee every month, showing the breakdown of salary earned and deductions made. It serves as proof of income and is required for most financial and legal transactions in India.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>CTC vs Gross Salary vs Net Salary</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>These three terms are frequently confused. Here's the difference:</p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {[
            { term: "CTC (Cost to Company)", def: "Total cost the employer bears for the employee — includes gross salary plus employer contributions (PF, gratuity, health insurance). This is what appears in your offer letter.", color: "#FCE7F3" },
            { term: "Gross Salary", def: "Total salary before any deductions — Basic + HRA + DA + Special Allowance + all other allowances. This is what the employee earns before tax and PF deductions.", color: "#EDE9FE" },
            { term: "Net Salary (Take-home)", def: "Gross salary minus all deductions (PF, TDS, ESI, professional tax). This is the amount actually credited to the employee's bank account.", color: "#D1FAE5" },
          ].map(({ term, def, color }) => (
            <div key={term} style={{ background: color, borderRadius: 12, padding: "16px 18px" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>{term}</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{def}</div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>Standard Salary Slip Components in India</h2>

        <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Component","Typical %","Notes"].map(h=><th key={h} style={{ padding:"10px 14px", fontSize:12, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"left", borderBottom:"1px solid #E2E8F0" }}>{h}</th>)}</tr></thead>
            <tbody>
              <tr style={{ background: "#FCE7F3" }}><td colSpan={3} style={{ padding:"8px 14px", fontSize:11, fontWeight:700, color:"#DB2777", textTransform:"uppercase", letterSpacing:"0.08em" }}>Earnings</td></tr>
              {[
                ["Basic Pay","40-50% of CTC","Foundation for PF, gratuity, and HRA calculation"],
                ["HRA (House Rent Allowance)","40-50% of Basic","50% if metro city, 40% if non-metro. Tax-exempt with rent receipts"],
                ["DA (Dearness Allowance)","Varies","Mainly for govt employees. Compensates for inflation"],
                ["Special Allowance","Balancing amount","Flexible component to make up the CTC"],
                ["LTA (Leave Travel Allowance)","Per company policy","Tax-exempt for travel expenses twice in 4 years"],
              ].map(([a,b,c],i)=>(
                <tr key={i} style={{ borderBottom:"1px solid #F1F5F9", background:i%2===0?"#fff":"#FAFAFA" }}>
                  <td style={{ padding:"10px 14px", fontSize:13, fontWeight:600, color:"#0F172A" }}>{a}</td>
                  <td style={{ padding:"10px 14px", fontSize:12, color:"#DB2777", fontWeight:700 }}>{b}</td>
                  <td style={{ padding:"10px 14px", fontSize:12, color:"#475569" }}>{c}</td>
                </tr>
              ))}
              <tr style={{ background: "#FEE2E2" }}><td colSpan={3} style={{ padding:"8px 14px", fontSize:11, fontWeight:700, color:"#DC2626", textTransform:"uppercase", letterSpacing:"0.08em" }}>Deductions</td></tr>
              {[
                ["Provident Fund (PF)","12% of Basic","Both employee and employer contribute 12% each"],
                ["TDS (Tax Deducted at Source)","Per income tax slab","Deducted monthly based on projected annual tax liability"],
                ["ESI","0.75% of gross","For employees earning up to ₹21,000/month"],
                ["Professional Tax","₹200/month","Varies by state. Up to ₹2,400/year"],
              ].map(([a,b,c],i)=>(
                <tr key={i} style={{ borderBottom:"1px solid #F1F5F9", background:i%2===0?"#fff":"#FAFAFA" }}>
                  <td style={{ padding:"10px 14px", fontSize:13, fontWeight:600, color:"#0F172A" }}>{a}</td>
                  <td style={{ padding:"10px 14px", fontSize:12, color:"#DC2626", fontWeight:700 }}>{b}</td>
                  <td style={{ padding:"10px 14px", fontSize:12, color:"#475569" }}>{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 24px", letterSpacing: "-0.01em" }}>How to Generate a Salary Slip — Step by Step</h2>
        <Step number={1} title="Open the Salary Slip Generator">Go to <Link to="/documents/salary-slip" style={{ color: "#DB2777", fontWeight: 600 }}>opstools.ai/documents/salary-slip</Link>. No login required.</Step>
        <Step number={2} title="Enter Company Details">Add your company name, address, and logo URL if available. This appears in the header of the payslip.</Step>
        <Step number={3} title="Enter Employee Details">Add employee name, ID, designation, department, and PAN number. PAN is required for TDS tracking.</Step>
        <Step number={4} title="Set the Pay Period">Select the month and year for the salary slip. Also enter the number of working days and days present.</Step>
        <Step number={5} title="Enter Earnings">Add Basic Pay, HRA, DA, Special Allowance and any other allowances. The tool calculates gross salary automatically.</Step>
        <Step number={6} title="Enter Deductions">Add PF (auto-calculated as 12% of basic), TDS, ESI, professional tax and any other deductions.</Step>
        <Step number={7} title="Review Net Pay">The tool shows Gross Salary, Total Deductions, and Net Take-Home Pay. Verify the numbers.</Step>
        <Step number={8} title="Download PDF">Click Save PDF to download the payslip instantly.</Step>

        <Callout icon="💡" title="HRA Tax Exemption" color="#FCE7F3" borderColor="#DB2777">
          Employees can claim HRA tax exemption if they pay rent. The exempt amount is the minimum of: actual HRA received, 50% of basic (metro) or 40% (non-metro), or actual rent paid minus 10% of basic salary. Employees need rent receipts to claim this — which is why our <Link to="/documents/rent-receipt" style={{ color: "#DB2777", fontWeight: 600 }}>Rent Receipt Generator</Link> is useful alongside this tool.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 20px", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
        {[
          { q: "Is a salary slip legally mandatory in India?", a: "There is no central law mandating salary slips, but several state labour laws (like Payment of Wages Act) require employers to maintain wage records. Salary slips are considered best practice and are required for most financial transactions." },
          { q: "What documents can I use salary slips for?", a: "Home loan applications, personal loan applications, credit card applications, visa applications, new job offers (to prove current CTC), rent agreements, and income tax filing." },
          { q: "Can a freelancer or self-employed person generate a salary slip?", a: "Technically, salary slips are for salaried employees. Self-employed professionals should use income certificates or business income proof instead. However, if you're a sole proprietor paying yourself a salary, you can generate a payslip." },
          { q: "What is the difference between salary slip and salary certificate?", a: "A salary slip is the monthly payslip showing detailed breakdowns. A salary certificate is a formal letter from the employer confirming the employee's salary — typically used for loan applications and includes a summary rather than monthly details." },
          { q: "Is PF deduction mandatory for all employees?", a: "PF is mandatory for establishments with 20 or more employees, for employees earning up to ₹15,000/month basic salary. Employees earning more can opt out, though many employers include all employees voluntarily." },
          { q: "Is this tool free?", a: "Completely free. No login, no subscription, no credits required." },
        ].map((faq, i) => (
          <div key={i} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 20px", marginBottom: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Q: {faq.q}</div>
            <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>A: {faq.a}</div>
          </div>
        ))}

        <div style={{ background: "linear-gradient(135deg,#1a0a1e,#3b0764)", borderRadius: 16, padding: "32px 28px", textAlign: "center", marginTop: 48, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>Generate a salary slip now</h3>
          <p style={{ fontSize: 14, color: "#F9A8D4", margin: "0 0 24px" }}>Free · No login · CTC breakdown · PF & TDS · Instant PDF</p>
          <Link to="/documents/salary-slip" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#DB2777,#9D174D)", color: "#fff", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Generate Salary Slip →
          </Link>
        </div>

        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Related Tools</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { name: "Rent Receipt Generator", href: "/documents/rent-receipt", desc: "For HRA exemption claims" },
              { name: "GST Invoice Generator", href: "/documents/gst-invoice", desc: "Tax-compliant invoices" },
              { name: "ROI Calculator", href: "/business/roi-calculator", desc: "Business financial planning" },
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
