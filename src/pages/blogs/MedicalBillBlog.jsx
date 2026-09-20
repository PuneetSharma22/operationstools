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
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#16A34A,#15803D)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>{number}</div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>{title}</h3>
        <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>{children}</div>
      </div>
    </div>
  );
}

export default function MedicalBillBlog() {
  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <Helmet>
        <title>How to Generate a Medical Bill Online in India for Free (2026) | OpsTools</title>
        <meta name="description" content="Complete guide to generating medical and pharmacy bills in India — patient details, itemized medicines and charges, hospital GSTIN, and instant free PDF download." />
        <meta property="og:title" content="How to Generate a Medical Bill Online in India for Free (2026) | OpsTools" />
        <meta property="og:description" content="Complete guide to generating medical and pharmacy bills in India — patient details, itemized medicines and charges, hospital GSTIN, and instant free PDF download." />
        <meta property="og:url" content="https://www.opstools.ai/blogs/how-to-generate-medical-bill-online-india" />
        <link rel="canonical" href="https://www.opstools.ai/blogs/how-to-generate-medical-bill-online-india" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#022c22 55%,#065f46 100%)", padding: "72px 24px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748B", display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#334155" }}>›</span>
            <Link to="/blogs" style={{ color: "#64748B", textDecoration: "none" }}>Blog</Link>
            <span style={{ color: "#334155" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Medical Bill Guide</span>
          </nav>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(22,163,74,0.2)", border: "1px solid rgba(22,163,74,0.3)", color: "#86EFAC", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 999, marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>Guide</div>
            <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              How to Generate a Medical Bill Online in India for Free (2026)
            </h1>
            <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 24px" }}>
              A complete guide to medical and pharmacy bills — patient details, itemized medicines, consultations, tests and procedures, hospital GSTIN, and instant PDF download. No login, no cost.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#64748B", flexWrap: "wrap" }}>
              <span>Gulnaaz</span><span>·</span><span>August 26, 2026</span><span>·</span><span>6 min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
          {[
            ["Line Items", "Medicine, tests, procedures", "#DCFCE7", "#16A34A"],
            ["GSTIN", "Optional hospital field", "#DBEAFE", "#2563EB"],
            ["Format", "Instant PDF", "#EDE9FE", "#7C3AED"],
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
          Need a clean medical or pharmacy bill for an insurance claim, reimbursement, or your own records? Most clinics, small hospitals, and pharmacies either handwrite receipts or pay for full hospital management software just to print a bill — and patients filing a reimbursement claim often have nothing more than a handwritten slip to submit.
        </p>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          This guide covers what a proper medical bill needs to include, how to itemize medicines and services correctly, and how to generate a professional, itemized medical bill for free in under a minute.
        </p>

        <Callout icon="✅" title="Quick answer" color="#F0FDF4" borderColor="#16A34A">
          Go to <Link to="/documents/medical-bill" style={{ color: "#16A34A", fontWeight: 600 }}>opstools.ai/documents/medical-bill</Link>, enter hospital/clinic and patient details, add each charge or medicine as a line item, and the total calculates itself. Download as PDF. No login, no subscription, no cost.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What is a Medical Bill?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          A medical bill is the receipt issued by a hospital, clinic, or pharmacy for medical services or medicines provided, itemizing charges and often including patient and doctor details. It's commonly required for insurance reimbursement claims and expense records.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          The same format works whether you're issuing a hospital bill after a course of treatment, a clinic's consultation receipt, or a pharmacy bill for medicines sold across the counter — the line items just change.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>Who Actually Needs This</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {[
            { title: "Insurance reimbursement", desc: "Attach a properly itemized medical bill when filing a claim with your insurer." },
            { title: "Clinics & small hospitals", desc: "Generate professional bills without hospital management software." },
            { title: "Pharmacies", desc: "Issue itemized medicine bills quickly at the counter." },
            { title: "Personal expense records", desc: "Keep track of medical spending for tax or budgeting purposes." },
          ].map(f => (
            <div key={f.title} style={{ display: "flex", gap: 14, background: "#F0FDF4", borderRadius: 12, padding: "16px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#16A34A", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🏥</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What Should a Medical Bill Include?</h2>
        <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Field","Example","Required?"].map(h=><th key={h} style={{ padding:"10px 14px", fontSize:12, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"left", borderBottom:"1px solid #E2E8F0" }}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ["Hospital/Clinic Name & Address","Sunrise Multispeciality Hospital, MG Road, Mumbai","✅ Required"],
                ["Hospital GSTIN","27AABCU9603R1ZX","✅ If applicable"],
                ["Patient Name & Details","Rajesh Verma, Age 38, UHID-204519","✅ Required"],
                ["Line Items","Consultation Fee — ₹800, CBC Test — ₹450","✅ Required"],
                ["Doctor Name & Department","Dr. Anjali Deshmukh, General Medicine","✅ Recommended"],
                ["Bill Number & Date","MED-1042, 3 Sep 2026","✅ Required"],
                ["Total Amount","Sum of all itemized charges minus discount","✅ Required"],
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

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>Line Item Types — What Can You Bill For?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Rather than lumping everything into one amount, list each charge as its own line item with a type — Medicine, Consultation, Lab Test, Procedure, Equipment, or Other. This keeps the bill readable for the patient and easy for an insurer or accountant to verify against a claim.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          The GSTIN field is optional — many core healthcare services are treated differently from taxable goods like pharmacy medicines under Indian GST rules, and the correct treatment depends on the exact service and current regulations. If your hospital, clinic, or pharmacy is GST-registered, add the GSTIN; when in doubt about how tax applies to a specific line item, confirm with your finance team or a tax advisor before finalizing the bill.
        </p>

        <Callout icon="💡" title="Tip — Use UHID for repeat patients" color="#F0FDF4" borderColor="#16A34A">
          If your clinic or hospital assigns a UHID or MRN (medical record number) to patients, include it on the bill. It makes the bill easier to match against a patient's treatment history and is often expected on documents submitted for insurance reimbursement.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 24px", letterSpacing: "-0.01em" }}>How to Generate a Medical Bill — Step by Step</h2>
        <Step number={1} title="Enter hospital/clinic details">Go to <Link to="/documents/medical-bill" style={{ color: "#16A34A", fontWeight: 600 }}>opstools.ai/documents/medical-bill</Link>. Add the hospital or clinic name, address, and GSTIN. No login required.</Step>
        <Step number={2} title="Add patient details">Enter the patient's name and other relevant info such as age, gender, phone, and UHID/MRN.</Step>
        <Step number={3} title="Add line items">List each charge, test, or medicine with a type, quantity, and rate — Medicine, Consultation, Lab Test, Procedure, Equipment, or Other.</Step>
        <Step number={4} title="Preview">Check the live preview on the right — totals, discount, and net amount update instantly as you type.</Step>
        <Step number={5} title="Download PDF">Click Save PDF to download the finished bill. Nothing is uploaded — your data stays in your browser.</Step>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 20px", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
        {[
          { q: "Is this medical bill generator free?", a: "Yes, completely free with no login required." },
          { q: "Can I use this for insurance claims?", a: "Yes, a properly itemized medical bill with patient and hospital details is what most insurers require for a reimbursement claim." },
          { q: "Does it work for pharmacies too?", a: "Yes, the itemized line items work equally well for medicine bills or hospital/clinic charges." },
          { q: "Can I include the hospital's GSTIN?", a: "Yes, an optional GSTIN field is available for the hospital or clinic." },
          { q: "Is my patient and hospital data stored anywhere?", a: "No — everything happens in your browser. Nothing is uploaded or stored on our servers unless you choose to save your session." },
          { q: "Can I bill for consultations, tests, and medicines on the same receipt?", a: "Yes — each line item can be tagged as Medicine, Consultation, Lab Test, Procedure, Equipment, or Other, so a single bill can combine all of them with an accurate total." },
        ].map((faq, i) => (
          <div key={i} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 20px", marginBottom: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Q: {faq.q}</div>
            <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>A: {faq.a}</div>
          </div>
        ))}

        <div style={{ background: "linear-gradient(135deg,#022c22,#065f46)", borderRadius: 16, padding: "32px 28px", textAlign: "center", marginTop: 48, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>Generate your medical bill now</h3>
          <p style={{ fontSize: 14, color: "#86EFAC", margin: "0 0 24px" }}>Free · No login · Itemized line items · GSTIN support · Instant PDF</p>
          <Link to="/documents/medical-bill" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#16A34A,#15803D)", color: "#fff", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Generate Medical Bill →
          </Link>
        </div>

        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Related Tools</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { name: "Hotel Bill Generator", href: "/documents/hotel-bill", desc: "Hotel stay receipts for reimbursement" },
              { name: "GST Invoice Generator", href: "/documents/gst-invoice", desc: "Tax-compliant GST invoices" },
              { name: "Rent Receipt Generator", href: "/documents/rent-receipt", desc: "HRA-compliant rent receipts" },
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
