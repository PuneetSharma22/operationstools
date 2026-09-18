import { useState } from "react";
import { useSEO } from "../../seo/useSEO";
import DocumentPageSEO from "../../seo/DocumentPageSEO";
import SaveMenu from "../../components/common/SaveMenu";
import { exportSingleDocument } from "../../utils/documentExport";
import { logSaveRequest } from "../../utils/saveLog";

const TAINTED_HINT = "the logo image doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again.";

// Neutral document palette — a printed payslip should read like a normal HR
// document, not a brand-colour showcase. Brand blue is reserved for
// interactive form chrome (focus rings, buttons) below, never for the payslip
// preview itself.
const INK = "#0F172A";
const INK_SOFT = "#475569";
const INK_MUTED = "#64748B";
const BORDER = "#E2E8F0";
const SURFACE = "#F8FAFC";
const SURFACE_ALT = "#F1F5F9";
const BRAND = "#2563EB";

// ─── SEO ─────────────────────────────────────────────────────────────────────
const SEO_TITLE = "Free Salary Slip Generator Online — Payslip with CTC (2026)";
const SEO_DESCRIPTION = "Generate a professional salary slip online for free. Basic pay, HRA, allowances, deductions, and net pay. No login. Instant PDF. India-compliant.";
const CANONICAL = "https://www.opstools.ai/documents/salary-slip";
const softwareAppSchema = { "@context": "https://schema.org", "@type": "SoftwareApplication", name: "OpsTools Salary Slip Generator", operatingSystem: "Web", applicationCategory: "BusinessApplication", offers: { "@type": "Offer", price: "0", priceCurrency: "INR" }, description: SEO_DESCRIPTION, url: CANONICAL, provider: { "@type": "Organization", name: "OpsTools", url: "https://www.opstools.ai" } };
const faqSchema = { "@context": "https://schema.org", "@type": "FAQPage", mainEntity: [
  { "@type": "Question", name: "Is this salary slip generator free?", acceptedAnswer: { "@type": "Answer", text: "Yes, completely free with no login required." } },
  { "@type": "Question", name: "How is net pay calculated?", acceptedAnswer: { "@type": "Answer", text: "Net pay is calculated automatically as gross earnings (basic + HRA + allowances) minus total deductions (PF, tax, etc.) that you enter." } },
  { "@type": "Question", name: "Can employees use this for HRA claims?", acceptedAnswer: { "@type": "Answer", text: "A salary slip showing HRA received is one of the documents used alongside rent receipts to support an HRA exemption claim." } },
  { "@type": "Question", name: "Does it show CTC breakdown?", acceptedAnswer: { "@type": "Answer", text: "Yes, all earning components (basic, HRA, allowances) and deductions are itemized separately, giving a clear CTC-style breakdown." } },
] };
const INTRO = (<><p style={{ marginBottom: 16 }}>Whether you're a small business without payroll software or need a sample payslip for record-keeping, OpsTools Salary Slip Generator lays out a professional, properly itemized payslip in under a minute — earnings, deductions, and net pay, calculated automatically.</p><p style={{ marginBottom: 16 }}>Enter basic salary, HRA, and any other allowances, then list deductions like PF or professional tax. Gross earnings, total deductions, and net pay are all computed for you.</p><p>The preview updates live as you type. Download directly as a PDF — your data never leaves your browser.</p></>);
const WHAT_IS = `A salary slip (or payslip) is a document an employer issues to an employee each pay period, itemizing earnings (basic salary, HRA, allowances) and deductions (PF, tax, etc.), along with the resulting net pay. It's used for personal records, loan applications, and tax filing.`;
const WHY_USE = [
  { title: "Small businesses without payroll software", body: "Generate professional payslips for employees each month." },
  { title: "HR teams", body: "Produce consistent, properly formatted payslips quickly." },
  { title: "Employees", body: "Need a sample payslip format for reference or personal records." },
  { title: "Loan & visa applications", body: "A clear salary breakdown is often required as supporting documentation." },
];
const FEATURES = [
  { icon: "💰", title: "Full earnings breakdown", body: "Basic salary, HRA, and other allowances itemized separately." },
  { icon: "➖", title: "Deductions itemized", body: "PF, professional tax, and other deductions listed clearly." },
  { icon: "🧮", title: "Auto-calculated net pay", body: "Gross earnings minus deductions computed automatically." },
  { icon: "👁️", title: "Live preview", body: "See the payslip update in real time as you fill the form." },
  { icon: "⬇️", title: "Direct PDF download", body: "One click downloads the payslip as a PDF." },
  { icon: "🏷️", title: "Custom logo", body: "Paste any image URL to add your company logo." },
  { icon: "🔒", title: "100% private", body: "No data is stored or transmitted. Everything happens in your browser." },
];
const HOW_TO_STEPS = [
  { step: 1, title: "Enter company details", body: "Company name, address, and logo." },
  { step: 2, title: "Add employee details", body: "Name, designation, and employee ID." },
  { step: 3, title: "Enter earnings", body: "Basic salary, HRA, and any other allowances." },
  { step: 4, title: "Enter deductions", body: "PF, professional tax, or other deductions." },
  { step: 5, title: "Preview", body: "Check the live preview — net pay updates instantly." },
  { step: 6, title: "Download PDF", body: "Click Save PDF to download the payslip." },
];
const BENEFITS = [
  "Full earnings and deductions breakdown.",
  "Net pay calculated automatically.",
  "No registration or sign-up required.",
  "Direct PDF download — no print dialog.",
  "All data stays in your browser — zero privacy risk.",
  "Completely free — no subscription.",
];
const FORMAT_FIELDS = [
  { field: "Basic Salary", description: "Fixed base component of the salary", example: "₹30,000" },
  { field: "HRA", description: "House Rent Allowance component", example: "₹12,000" },
  { field: "Deductions", description: "PF, tax, or other deductions from gross pay", example: "PF — ₹1,800" },
  { field: "Net Pay", description: "Gross earnings minus total deductions", example: "₹38,700" },
];
const FAQS = faqSchema.mainEntity.map((i) => ({ q: i.name, a: i.acceptedAnswer.text }));
const RELATED_DOCS = [
  { name: "Rent Receipt Generator", href: "/documents/rent-receipt", description: "HRA-compliant rent receipts." },
  { name: "L&D Bill Generator", href: "/documents/ld-bill", description: "Tax invoices for training & courses." },
  { name: "GST Invoice Generator", href: "/documents/gst-invoice", description: "Tax-compliant GST invoices." },
];

function Field({ label, value, onChange, placeholder, type = "text", small, readOnly }) {
  return (
    <div style={{ marginBottom: small ? 8 : 12 }}>
      {label && <label style={{ fontSize: 11, fontWeight: 600, color: INK_MUTED, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>}
      <input type={type} value={value} placeholder={placeholder} readOnly={readOnly}
        onChange={e => onChange && onChange(e.target.value)}
        style={{ width: "100%", height: small ? 32 : 38, border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: "0 10px", fontSize: 13, color: INK, outline: "none", boxSizing: "border-box", background: readOnly ? SURFACE : "#fff" }}
        onFocus={e => { if (!readOnly) e.target.style.borderColor = BRAND; }}
        onBlur={e => { if (!readOnly) e.target.style.borderColor = BORDER; }}
      />
    </div>
  );
}

function numberToWords(n) {
  const ones = ["","One","Two","Three","Four","Five","Six","Seven","Eight","Nine","Ten","Eleven","Twelve","Thirteen","Fourteen","Fifteen","Sixteen","Seventeen","Eighteen","Nineteen"];
  const tens = ["","","Twenty","Thirty","Forty","Fifty","Sixty","Seventy","Eighty","Ninety"];
  if (n === 0) return "Zero";
  const convert = (num) => {
    if (num < 20) return ones[num];
    if (num < 100) return tens[Math.floor(num/10)] + (num%10 ? " "+ones[num%10] : "");
    if (num < 1000) return ones[Math.floor(num/100)] + " Hundred" + (num%100 ? " "+convert(num%100) : "");
    if (num < 100000) return convert(Math.floor(num/1000)) + " Thousand" + (num%1000 ? " "+convert(num%1000) : "");
    if (num < 10000000) return convert(Math.floor(num/100000)) + " Lakh" + (num%100000 ? " "+convert(num%100000) : "");
    return convert(Math.floor(num/10000000)) + " Crore" + (n%10000000 ? " "+convert(n%10000000) : "");
  };
  return convert(Math.floor(n)) + " Rupees Only";
}

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

// ─── Salary Slip Preview ──────────────────────────────────────────────────────
function SlipPreview({ data }) {
  const { company, employee, salary, month, year } = data;
  const earnings = [
    { label: "Basic Salary", value: Number(salary.basic) || 0 },
    { label: "House Rent Allowance (HRA)", value: Number(salary.hra) || 0 },
    { label: "Conveyance Allowance", value: Number(salary.conveyance) || 0 },
    { label: "Medical Allowance", value: Number(salary.medical) || 0 },
    { label: "Special Allowance", value: Number(salary.special) || 0 },
    { label: "Other Allowance", value: Number(salary.otherEarning) || 0 },
  ].filter(e => e.value > 0);

  const deductions = [
    { label: "Provident Fund (PF)", value: Number(salary.pf) || 0 },
    { label: "Professional Tax", value: Number(salary.profTax) || 0 },
    { label: "Income Tax (TDS)", value: Number(salary.tds) || 0 },
    { label: "ESI", value: Number(salary.esi) || 0 },
    { label: "Other Deduction", value: Number(salary.otherDeduction) || 0 },
  ].filter(d => d.value > 0);

  const grossEarnings = earnings.reduce((s, e) => s + e.value, 0);
  const totalDeductions = deductions.reduce((s, d) => s + d.value, 0);
  const netPay = grossEarnings - totalDeductions;

  const rows = Math.max(earnings.length, deductions.length);

  return (
    <div style={{ background: "#fff", fontFamily: "Arial, sans-serif", fontSize: 12, color: "#1a1a1a", padding: "28px 36px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 16, borderBottom: `2px solid ${INK}` }}>
        <div>
          {company.logoUrl && <img src={company.logoUrl} alt="logo" style={{ maxHeight: 40, maxWidth: 120, objectFit: "contain", marginBottom: 8, display: "block" }} />}
          <div style={{ fontSize: 18, fontWeight: 900, color: INK, letterSpacing: "-0.01em" }}>{company.name || "Company Name"}</div>
          <div style={{ fontSize: 11, color: INK_SOFT, marginTop: 3, lineHeight: 1.6 }}>
            {company.address && <div>{company.address}</div>}
            {company.gstin && <div>GSTIN: {company.gstin}</div>}
          </div>
        </div>
        <div style={{ textAlign: "right" }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: INK_MUTED, letterSpacing: "0.1em", textTransform: "uppercase" }}>Pay Slip</div>
          <div style={{ fontSize: 20, fontWeight: 800, color: INK, letterSpacing: "-0.02em", marginTop: 2 }}>{MONTHS[month]} {year}</div>
        </div>
      </div>

      {/* Employee details */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 0, marginBottom: 16, border: `1px solid ${BORDER}`, borderRadius: 8, overflow: "hidden" }}>
        {[
          ["Employee Name", employee.name || "—"],
          ["Employee ID", employee.empId || "—"],
          ["Designation", employee.designation || "—"],
          ["Department", employee.department || "—"],
          ["Date of Joining", employee.doj ? new Date(employee.doj).toLocaleDateString("en-IN") : "—"],
          ["PAN Number", employee.pan || "—"],
          ["Bank Account", employee.bankAccount || "—"],
          ["PF Account No.", employee.pfAccount || "—"],
          ["Working Days", employee.workingDays || "—"],
          ["Days Paid", employee.daysPaid || "—"],
        ].map(([k, v], i) => (
          <div key={k} style={{ display: "flex", padding: "8px 14px", background: i % 4 < 2 ? "#fff" : SURFACE, borderBottom: `1px solid ${SURFACE_ALT}` }}>
            <span style={{ color: INK_MUTED, minWidth: 130, fontSize: 11 }}>{k}</span>
            <span style={{ fontWeight: 600, fontSize: 11, color: INK }}>{v}</span>
          </div>
        ))}
      </div>

      {/* Earnings + Deductions */}
      <table style={{ width: "100%", borderCollapse: "collapse", marginBottom: 16 }}>
        <thead>
          <tr>
            <th colSpan={2} style={{ background: INK, color: "#fff", padding: "8px 14px", fontSize: 11, fontWeight: 700, textAlign: "left", letterSpacing: "0.08em" }}>EARNINGS</th>
            <th colSpan={2} style={{ background: INK, color: "#fff", padding: "8px 14px", fontSize: 11, fontWeight: 700, textAlign: "left", letterSpacing: "0.08em", borderLeft: "2px solid rgba(255,255,255,0.25)" }}>DEDUCTIONS</th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => {
            const e = earnings[i] || null;
            const d = deductions[i] || null;
            return (
              <tr key={i} style={{ background: i % 2 === 0 ? "#fff" : SURFACE, borderBottom: `1px solid ${BORDER}` }}>
                <td style={{ padding: "8px 14px", fontSize: 11, width: "30%", color: INK_SOFT }}>{e ? e.label : ""}</td>
                <td style={{ padding: "8px 14px", fontSize: 11, textAlign: "right", width: "20%", fontWeight: e ? 600 : 400, color: INK }}>{e ? `₹${e.value.toLocaleString("en-IN")}` : ""}</td>
                <td style={{ padding: "8px 14px", fontSize: 11, width: "30%", borderLeft: `2px solid ${BORDER}`, color: INK_SOFT }}>{d ? d.label : ""}</td>
                <td style={{ padding: "8px 14px", fontSize: 11, textAlign: "right", width: "20%", fontWeight: d ? 600 : 400, color: INK }}>{d ? `₹${d.value.toLocaleString("en-IN")}` : ""}</td>
              </tr>
            );
          })}
          <tr style={{ background: SURFACE_ALT, fontWeight: 700, color: INK }}>
            <td style={{ padding: "9px 14px", fontSize: 12 }}>Gross Earnings</td>
            <td style={{ padding: "9px 14px", fontSize: 12, textAlign: "right" }}>₹{grossEarnings.toLocaleString("en-IN")}</td>
            <td style={{ padding: "9px 14px", fontSize: 12, borderLeft: `2px solid ${BORDER}` }}>Total Deductions</td>
            <td style={{ padding: "9px 14px", fontSize: 12, textAlign: "right" }}>₹{totalDeductions.toLocaleString("en-IN")}</td>
          </tr>
        </tbody>
      </table>

      {/* Net Pay */}
      <div style={{ background: INK, borderRadius: 10, padding: "16px 20px", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 11, opacity: 0.75, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 3 }}>Net Pay</div>
          <div style={{ fontSize: 11, opacity: 0.7 }}>{numberToWords(netPay)}</div>
        </div>
        <div style={{ fontSize: 28, fontWeight: 900, letterSpacing: "-0.02em" }}>₹{netPay.toLocaleString("en-IN")}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, paddingTop: 16, borderTop: `1px solid ${BORDER}` }}>
        <div style={{ fontSize: 10, color: "#94A3B8" }}>This is a computer generated pay slip and does not require signature.</div>
        <div style={{ textAlign: "right" }}>
          <div style={{ width: 120, height: 36, borderBottom: "1px solid #CBD5E1", marginBottom: 4 }} />
          <div style={{ fontSize: 10, color: INK_MUTED }}>Employer Signature</div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
function Section({ title, children }) {
  return (
    <div style={{ background: "#fff", borderRadius: 16, border: `1px solid ${BORDER}`, padding: "20px 24px", marginBottom: 16 }}>
      <h2 style={{ fontSize: 13, fontWeight: 700, color: INK, margin: "0 0 16px", textTransform: "uppercase", letterSpacing: "0.08em" }}>{title}</h2>
      {children}
    </div>
  );
}

export default function SalarySlipPage() {
  const [company, setCompany] = useState({
    name: "Nimbus Technologies Pvt Ltd",
    address: "5th Floor, Prestige Tech Park, Whitefield, Bengaluru, Karnataka 560066",
    gstin: "29ABCDE1234F1Z5",
    logoUrl: "",
  });
  const [employee, setEmployee] = useState({
    name: "Rajesh Sharma", empId: "EMP-1042", designation: "Senior Software Engineer",
    department: "Engineering", doj: "2021-06-14", pan: "ABCDE1234F",
    bankAccount: "XXXXXXXX4821", pfAccount: "KA/BNG/12345/67890",
    workingDays: "26", daysPaid: "26",
  });
  const [salary, setSalary] = useState({
    basic: "45000", hra: "18000", conveyance: "1600", medical: "1250", special: "8000", otherEarning: "",
    pf: "5400", profTax: "200", tds: "3200", esi: "", otherDeduction: "",
  });
  const [month, setMonth] = useState(() => new Date().getMonth());
  const [year, setYear] = useState(() => new Date().getFullYear());
  const [downloading, setDownloading] = useState(false);
  const [notice, setNotice] = useState("");

  const upd = setter => (k, v) => setter(p => ({ ...p, [k]: v }));

  // Auto-calculate PF as 12% of basic
  const handleBasicChange = (v) => {
    const basic = Number(v) || 0;
    setSalary(p => ({ ...p, basic: v, pf: Math.round(basic * 0.12).toString() }));
  };

  const doDownload = async (format = "pdf") => {
    if (downloading) return;
    setDownloading(true);
    setNotice("");

    const data = { company, employee, salary, month, year };
    const printId = `SAL-${Date.now()}`;
    const logged = await logSaveRequest({ template: "salary-slip", printId, billData: data });
    if (!logged.ok) setNotice("Your payslip downloaded fine, but we couldn't record it on our side.");

    await exportSingleDocument({
      Template: SlipPreview,
      data,
      format,
      fileBase: `salary-slip-${employee.empId || Date.now()}`,
      taintedHint: TAINTED_HINT,
    });
    setDownloading(false);
  };

  useSEO({
    title: SEO_TITLE, description: SEO_DESCRIPTION, canonical: CANONICAL,
    breadcrumbs: [
      { name: "Home", url: "https://www.opstools.ai" },
      { name: "Documents", url: "https://www.opstools.ai/documents" },
      { name: "Salary Slip Generator", url: CANONICAL },
    ],
    schemas: [softwareAppSchema, faqSchema],
  });

  return (
    <div style={{ backgroundColor: SURFACE, minHeight: "100vh" }}>
      <style>{`@media(max-width:1023px){.sal-prev{position:static!important;} .preview-scale-wrap{transform:none!important;width:100%!important;margin-bottom:0!important;overflow-x:auto!important;} .sal-grid{grid-template-columns:1fr !important;}}@media(max-width:768px){.seo-section{max-width:100%!important;width:100%!important;padding:0 16px!important;}}@media print{.no-print{display:none !important;}}`}</style>

      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0c2340 100%)", padding: "40px 24px 36px" }} className="no-print">
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <nav style={{ marginBottom: 16, fontSize: 13, color: "#7DD3FC" }}>
            <a href="/" style={{ color: "#7DD3FC", textDecoration: "none" }}>Home</a>
            <span style={{ margin: "0 8px" }}>›</span>
            <span style={{ color: "#BAE6FD" }}>Salary Slip</span>
          </nav>
          <h1 style={{ fontSize: "clamp(20px,3vw,30px)", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.02em" }}>Salary Slip Generator</h1>
          <p style={{ fontSize: 14, color: "#7DD3FC", margin: 0 }}>Generate professional payslips with CTC breakdown, deductions, and net pay in seconds.</p>
        </div>
      </section>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "32px 24px" }} className="no-print">
        <div className="sal-grid" style={{ display: "grid", gridTemplateColumns: "1fr 460px", gap: 28, alignItems: "start" }}>
          <div>
            {/* Month/Year */}
            <Section title="Pay Period">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <label style={{ fontSize: 11, fontWeight: 600, color: INK_MUTED, display: "block", marginBottom: 4, textTransform: "uppercase", letterSpacing: "0.06em" }}>Month</label>
                  <select value={month} onChange={e => setMonth(Number(e.target.value))} style={{ width: "100%", height: 38, border: `1.5px solid ${BORDER}`, borderRadius: 8, padding: "0 10px", fontSize: 13, color: INK, outline: "none", background: "#fff" }}>
                    {MONTHS.map((m, i) => <option key={m} value={i}>{m}</option>)}
                  </select>
                </div>
                <Field label="Year" value={year} onChange={v => setYear(Number(v))} type="number" />
              </div>
            </Section>

            <Section title="Company Details">
              <Field label="Company Name" value={company.name} onChange={v => upd(setCompany)("name",v)} placeholder="ABC Pvt Ltd" />
              <Field label="Address" value={company.address} onChange={v => upd(setCompany)("address",v)} placeholder="City, State" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="GSTIN (optional)" value={company.gstin} onChange={v => upd(setCompany)("gstin",v)} placeholder="27ABCDE1234F1Z5" />
                <Field label="Logo URL (optional)" value={company.logoUrl} onChange={v => upd(setCompany)("logoUrl",v)} placeholder="https://..." />
              </div>
            </Section>

            <Section title="Employee Details">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Full Name" value={employee.name} onChange={v => upd(setEmployee)("name",v)} placeholder="Rajesh Sharma" />
                <Field label="Employee ID" value={employee.empId} onChange={v => upd(setEmployee)("empId",v)} placeholder="EMP-001" />
                <Field label="Designation" value={employee.designation} onChange={v => upd(setEmployee)("designation",v)} placeholder="Software Engineer" />
                <Field label="Department" value={employee.department} onChange={v => upd(setEmployee)("department",v)} placeholder="Engineering" />
                <Field label="Date of Joining" value={employee.doj} onChange={v => upd(setEmployee)("doj",v)} type="date" />
                <Field label="PAN Number" value={employee.pan} onChange={v => upd(setEmployee)("pan",v)} placeholder="ABCDE1234F" />
                <Field label="Bank Account No." value={employee.bankAccount} onChange={v => upd(setEmployee)("bankAccount",v)} placeholder="1234567890" />
                <Field label="PF Account No." value={employee.pfAccount} onChange={v => upd(setEmployee)("pfAccount",v)} placeholder="MH/12345/67890" />
                <Field label="Working Days" value={employee.workingDays} onChange={v => upd(setEmployee)("workingDays",v)} type="number" />
                <Field label="Days Paid" value={employee.daysPaid} onChange={v => upd(setEmployee)("daysPaid",v)} type="number" />
              </div>
            </Section>

            <Section title="Earnings">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <Field label="Basic Salary ₹" value={salary.basic} onChange={handleBasicChange} type="number" placeholder="25000" />
                <Field label="HRA ₹" value={salary.hra} onChange={v => upd(setSalary)("hra",v)} type="number" placeholder="10000" />
                <Field label="Conveyance ₹" value={salary.conveyance} onChange={v => upd(setSalary)("conveyance",v)} type="number" placeholder="1600" />
                <Field label="Medical ₹" value={salary.medical} onChange={v => upd(setSalary)("medical",v)} type="number" placeholder="1250" />
                <Field label="Special Allowance ₹" value={salary.special} onChange={v => upd(setSalary)("special",v)} type="number" placeholder="5000" />
                <Field label="Other Earnings ₹" value={salary.otherEarning} onChange={v => upd(setSalary)("otherEarning",v)} type="number" placeholder="0" />
              </div>
            </Section>

            <Section title="Deductions">
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <div>
                  <Field label="PF (12% of basic) ₹" value={salary.pf} onChange={v => upd(setSalary)("pf",v)} type="number" />
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: -6, marginBottom: 8 }}>Auto-calculated from basic</div>
                </div>
                <Field label="Professional Tax ₹" value={salary.profTax} onChange={v => upd(setSalary)("profTax",v)} type="number" placeholder="200" />
                <Field label="Income Tax (TDS) ₹" value={salary.tds} onChange={v => upd(setSalary)("tds",v)} type="number" placeholder="0" />
                <Field label="ESI ₹" value={salary.esi} onChange={v => upd(setSalary)("esi",v)} type="number" placeholder="0" />
                <Field label="Other Deductions ₹" value={salary.otherDeduction} onChange={v => upd(setSalary)("otherDeduction",v)} type="number" placeholder="0" />
              </div>
            </Section>
          </div>

          <div className="sal-prev" style={{ position: "sticky", top: 88 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <p style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: INK_MUTED, margin: 0 }}>Live Preview</p>
              <SaveMenu onSave={doDownload} downloading={downloading} small />
            </div>

            {notice && (
              <div style={{ background: "#FFFBEB", border: "1px solid #FDE68A", borderRadius: 8, padding: "8px 12px", marginBottom: 10, fontSize: 12, color: "#92400E", display: "flex", justifyContent: "space-between", gap: 8 }}>
                <span>⚠ {notice}</span>
                <button onClick={() => setNotice("")} style={{ background: "none", border: "none", color: "#92400E", cursor: "pointer", fontSize: 14, lineHeight: 1 }} aria-label="Dismiss">×</button>
              </div>
            )}

            <div className="preview-scale-wrap" style={{ transform: "scale(0.68)", transformOrigin: "top left", width: "147%", marginBottom: "-32%" }}>
              <SlipPreview data={{ company, employee, salary, month, year }} />
            </div>
          </div>
        </div>
      </div>

      <div style={{ background: "#fff", borderTop: `1px solid ${BORDER}` }}>
        <div className="seo-section" style={{ maxWidth: "80%", margin: "0 auto", width: "80%" }}>
          <DocumentPageSEO documentName="Salary Slip" documentSlug="salary-slip" intro={INTRO} whatIs={WHAT_IS} whyUse={WHY_USE} features={FEATURES} howToSteps={HOW_TO_STEPS} benefits={BENEFITS} formatFields={FORMAT_FIELDS} faqs={FAQS} relatedDocs={RELATED_DOCS} />
        </div>
      </div>
    </div>
  );
}
