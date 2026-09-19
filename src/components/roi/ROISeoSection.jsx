// Static explainer content below the ROI calculator tool. Pure copy — no
// state, no props — kept out of the page file so the page stays about
// behaviour.

import { Link } from "react-router-dom";
import { FAQS } from "./roiFaqs";

const FORMULAS = [
  { label: "Basic ROI", formula: "(Return − Cost) ÷ Cost × 100", color: "#2563EB" },
  { label: "Annualized ROI", formula: "(Return ÷ Cost)^(1÷Years) − 1", color: "#7C3AED" },
  { label: "Real ROI", formula: "Nominal ROI − Inflation Rate × Years", color: "#059669" },
];

const WHY_USE = [
  { icon: "📊", title: "Compare investments", body: "Objectively compare FDs, stocks, real estate, or business ventures on the same scale." },
  { icon: "🎯", title: "Set return targets", body: "Work backwards from a goal — know exactly what return rate you need to reach your target." },
  { icon: "📈", title: "Track performance", body: "Measure how an existing investment is performing against benchmarks like Nifty 50 or gold." },
  { icon: "💡", title: "Justify business spend", body: "Evaluate whether a marketing campaign, equipment purchase, or expansion is worth the cost." },
];

const HOW_TO_STEPS = [
  { step: 1, title: "Enter your numbers", body: "Amount invested, amount returned, and the number of years you held it." },
  { step: 2, title: "Pick a mode", body: "Basic for a quick ROI%, or switch to Advanced, Compare, or What-if to see annualized returns, compare two investments side by side, or test a different outcome." },
  { step: 3, title: "Read your results", body: "ROI%, annualized (CAGR) return, and break-even period — turn on inflation to see your real, purchasing-power-adjusted return too." },
];

const RELATED_TOOLS = [
  { name: "GST Calculator", href: "/business/gst-calculator", description: "Add or remove GST with a CGST/SGST/IGST breakdown." },
  { name: "Salary Slip Generator", href: "/documents/salary-slip", description: "Payslips with CTC, deductions & net pay." },
  { name: "GST Invoice Generator", href: "/documents/gst-invoice", description: "Tax-compliant GST invoices with HSN codes." },
];

const BENCHMARK_TABLE = [
  { type: "Savings Account", ret: "3–4%", risk: "Very Low", liq: "Instant" },
  { type: "Fixed Deposit (1yr)", ret: "6.5–7.5%", risk: "Very Low", liq: "On maturity" },
  { type: "Gold", ret: "10–14%", risk: "Low–Medium", liq: "High" },
  { type: "Real Estate", ret: "8–12%", risk: "Medium", liq: "Low" },
  { type: "Nifty 50 Index", ret: "12–16%", risk: "Medium–High", liq: "High" },
  { type: "Direct Equity", ret: "Varies", risk: "High", liq: "High" },
];

export default function ROISeoSection() {
  return (
    <div style={{ background: "#fff", borderTop: "1px solid #E2E8F0" }}>
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "64px 24px" }}>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, color: "#0F172A", margin: "0 0 16px", letterSpacing: "-0.01em" }}>What is ROI?</h2>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, margin: "0 0 16px" }}>
            Return on Investment (ROI) is a performance metric used to evaluate the efficiency of an investment. It tells you how much profit or loss you made relative to the amount you originally invested — expressed as a percentage.
          </p>
          <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, margin: "0 0 20px" }}>
            The basic ROI formula is: <strong style={{ color: "#0F172A" }}>ROI% = ((Amount Returned − Amount Invested) ÷ Amount Invested) × 100</strong>. For example, if you invested ₹1,00,000 and got back ₹1,50,000, your ROI is 50%.
          </p>
          <div style={{ background: "#F8FAFC", borderRadius: 12, padding: "20px 24px", border: "1px solid #E2E8F0" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 20 }}>
              {FORMULAS.map((f) => (
                <div key={f.label} style={{ padding: "14px 16px", background: "#fff", borderRadius: 10, border: "1px solid #E2E8F0" }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: f.color, marginBottom: 6 }}>{f.label}</div>
                  <code style={{ fontSize: 12, color: "#374151", lineHeight: 1.6 }}>{f.formula}</code>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "0 0 20px", letterSpacing: "-0.01em" }}>Why use an ROI Calculator?</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
            {WHY_USE.map((f) => (
              <div key={f.title} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 16px", border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 22, marginBottom: 8 }}>{f.icon}</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "0 0 20px", letterSpacing: "-0.01em" }}>How to Calculate ROI with This Tool</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
            {HOW_TO_STEPS.map((s, i) => (
              <div key={s.step} style={{ display: "flex", gap: 16, paddingBottom: 20, position: "relative" }}>
                {i < HOW_TO_STEPS.length - 1 && (
                  <div style={{ position: "absolute", left: 15, top: 32, bottom: 0, width: 2, background: "#E2E8F0" }} />
                )}
                <div style={{ flexShrink: 0, width: 32, height: 32, borderRadius: "50%", background: "linear-gradient(135deg, #2563EB, #4F46E5)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, zIndex: 1 }}>
                  {s.step}
                </div>
                <div style={{ paddingTop: 6 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 3 }}>{s.title}</div>
                  <div style={{ fontSize: 13.5, color: "#64748B", lineHeight: 1.65 }}>{s.body}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginBottom: 56 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "0 0 16px", letterSpacing: "-0.01em" }}>ROI Benchmarks in India (2024–25)</h2>
          <p style={{ fontSize: 14, color: "#64748B", margin: "0 0 20px", lineHeight: 1.7 }}>
            Use these benchmarks to contextualise your investment returns. Historical averages are approximate and vary with market conditions.
          </p>
          <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Investment Type", "Typical Annual Return", "Risk Level", "Liquidity"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontSize: 12, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #E2E8F0" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {BENCHMARK_TABLE.map((row, i) => (
                  <tr key={row.type} style={{ borderBottom: "1px solid #F1F5F9", background: i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                    <td style={{ padding: "12px 16px", fontWeight: 600, color: "#0F172A" }}>{row.type}</td>
                    <td style={{ padding: "12px 16px", color: "#059669", fontWeight: 600 }}>{row.ret}</td>
                    <td style={{ padding: "12px 16px", color: "#64748B" }}>{row.risk}</td>
                    <td style={{ padding: "12px 16px", color: "#64748B" }}>{row.liq}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "0 0 20px", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {FAQS.map((faq) => (
              <div key={faq.q} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 20px", border: "1px solid #E2E8F0" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>{faq.q}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{faq.a}</div>
              </div>
            ))}
          </div>
        </section>

        <section style={{ marginTop: 56 }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "0 0 16px", letterSpacing: "-0.01em" }}>Related Tools</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 12 }}>
            {RELATED_TOOLS.map((t) => (
              <Link key={t.href} to={t.href} style={{ background: "#fff", border: "1px solid #E2E8F0", borderRadius: 12, padding: "14px 16px", textDecoration: "none", display: "block" }}
                onMouseEnter={(e) => e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"}
                onMouseLeave={(e) => e.currentTarget.style.boxShadow = "none"}
              >
                <div style={{ fontSize: 14, fontWeight: 600, color: "#0F172A", marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: 12.5, color: "#94A3B8", lineHeight: 1.5 }}>{t.description}</div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
