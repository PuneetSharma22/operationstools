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
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#0F766E,#115E59)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>{number}</div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>{title}</h3>
        <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>{children}</div>
      </div>
    </div>
  );
}

export default function GSTCalculatorBlog() {
  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <Helmet>
        <title>How to Calculate GST Online in India — Add or Remove GST (2026) | OpsTools</title>
        <meta name="description" content="Step-by-step guide to calculating GST in India — add GST to a base price or remove it from a GST-inclusive price, with a full CGST/SGST/IGST breakdown for any rate, free and with no login." />
        <meta property="og:title" content="How to Calculate GST Online in India — Add or Remove GST (2026) | OpsTools" />
        <meta property="og:description" content="Step-by-step guide to calculating GST in India — add GST to a base price or remove it from a GST-inclusive price, with a full CGST/SGST/IGST breakdown for any rate, free and with no login." />
        <meta property="og:url" content="https://www.opstools.ai/blogs/how-to-calculate-gst-online-india" />
        <link rel="canonical" href="https://www.opstools.ai/blogs/how-to-calculate-gst-online-india" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>

      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#042f2e 55%,#0f766e 100%)", padding: "72px 24px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748B", display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#334155" }}>›</span>
            <Link to="/blogs" style={{ color: "#64748B", textDecoration: "none" }}>Blog</Link>
            <span style={{ color: "#334155" }}>›</span>
            <span style={{ color: "#94A3B8" }}>GST Calculator Guide</span>
          </nav>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(15,118,110,0.2)", border: "1px solid rgba(15,118,110,0.3)", color: "#5EEAD4", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 999, marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>Guide</div>
            <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              How to Calculate GST Online in India (2026)
            </h1>
            <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 24px" }}>
              A complete guide to calculating GST — add GST to a base price or remove it from a GST-inclusive price, with a full CGST/SGST/IGST breakdown for any rate. Free, instant, no login.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#64748B", flexWrap: "wrap" }}>
              <span>Prakash Jha</span><span>·</span><span>December 3, 2026</span><span>·</span><span>6 min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
          {[
            ["Modes", "Add GST or Remove GST", "#CCFBF1", "#0F766E"],
            ["Intra-state", "Split as CGST + SGST", "#DBEAFE", "#2563EB"],
            ["Inter-state", "Charged as IGST", "#EDE9FE", "#7C3AED"],
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
          GST calculations trip up a lot of small business owners and freelancers — not because the math is hard, but because there are two different questions people confuse: "what's the price after I add GST?" and "how much GST is already baked into this price?" Get the wrong formula and your invoice, quotation, or expense claim comes out wrong.
        </p>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          This guide walks through both calculations, explains when GST should be split into CGST + SGST versus charged as IGST, and shows how to get an instant, accurate breakdown using a free calculator — no spreadsheet formulas to remember.
        </p>

        <Callout icon="✅" title="Quick answer" color="#F0FDFA" borderColor="#0F766E">
          Go to <Link to="/business/gst-calculator" style={{ color: "#0F766E", fontWeight: 600 }}>opstools.ai/business/gst-calculator</Link>, choose "Add GST" or "Remove GST", enter the amount, pick a GST rate, and select intra-state or inter-state. The taxable value, GST amount, and CGST/SGST or IGST split are calculated instantly. No login, no cost.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What is GST and How is it Calculated?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          GST (Goods and Services Tax) is India's unified indirect tax, charged as a percentage of the price of goods or services. There are two directions you might need to calculate it in, depending on whether your starting price already includes GST or not:
        </p>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 24 }}>
          {[
            { title: "Add GST (price excludes GST)", desc: "GST Amount = Price × (Rate ÷ 100). Total Amount = Price + GST Amount. Use this when you have a base price and need to add tax on top of it — like pricing a product or service before invoicing." },
            { title: "Remove GST (price includes GST)", desc: "Taxable Amount = Price ÷ (1 + Rate ÷ 100). GST Amount = Price − Taxable Amount. Use this when you have a final, tax-inclusive price and need to work out how much of it is tax and how much is the actual base value." },
          ].map(f => (
            <div key={f.title} style={{ background: "#F0FDFA", borderRadius: 12, padding: "16px", border: "1px solid #0F766E20" }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 6 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.7 }}>{f.desc}</div>
            </div>
          ))}
        </div>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          For example, on a base price of ₹1,000 at 18% GST: adding GST gives a GST amount of ₹180 and a total of ₹1,180. But if ₹1,180 was already the GST-inclusive price, removing 18% GST gives a taxable amount of ₹1,000 (₹1,180 ÷ 1.18) and a GST amount of ₹180 — the two formulas are inverses of each other, not the same calculation run backwards with simple percentage subtraction.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>CGST + SGST vs IGST — Which Applies?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Once you know the total GST amount, it has to be split correctly depending on where the buyer and seller are located:
        </p>
        <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 24 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Transaction Type","How GST Splits","Example @ 18%"].map(h=><th key={h} style={{ padding:"10px 14px", fontSize:12, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"left", borderBottom:"1px solid #E2E8F0" }}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ["Intra-state (same state)","Split equally into CGST + SGST","CGST 9% + SGST 9%"],
                ["Inter-state (different states)","Charged fully as IGST","IGST 18%"],
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
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          For intra-state transactions, the total GST amount is divided equally — half goes to CGST (Central GST) and half to SGST (State GST), each charged at half the total rate. For inter-state transactions, the same total GST amount is charged in full as IGST (Integrated GST) instead of being split.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>Common GST Rate Slabs</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          GST in India is charged at several different rates depending on the category of goods or services. The calculator supports 0%, 0.25%, 0.5%, 1%, 1.5%, 3%, 5%, 7.5%, 12%, 18%, and 28% — with quick shortcuts for commonly billed categories:
        </p>
        <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 24 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Category","Typical Rate"].map(h=><th key={h} style={{ padding:"10px 14px", fontSize:12, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"left", borderBottom:"1px solid #E2E8F0" }}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ["Milk / Eggs / Fresh vegetables","0%"],
                ["Sugar / Tea / Coffee","5%"],
                ["Freight services","5%"],
                ["Packed food / Namkeen","12%"],
                ["Medicines","12%"],
                ["Restaurant (AC)","18%"],
                ["Mobile phones","18%"],
                ["Computers / Laptops","18%"],
                ["Cement / Paint","28%"],
                ["Cars / SUVs","28%"],
              ].map(([a,b],i)=>(
                <tr key={i} style={{ borderBottom:"1px solid #F1F5F9", background:i%2===0?"#fff":"#FAFAFA" }}>
                  <td style={{ padding:"10px 14px", fontSize:13, fontWeight:600, color:"#0F172A" }}>{a}</td>
                  <td style={{ padding:"10px 14px", fontSize:12, color:"#0F766E", fontWeight:700 }}>{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout icon="⚠️" title="Rates change" color="#FFFBEB" borderColor="#F59E0B">
          GST rates and slab classifications are revised by the GST Council from time to time. The rates above are common reference points — always confirm the current applicable rate for your specific product or service with the official GST rate schedule or a tax advisor before finalizing an invoice.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 24px", letterSpacing: "-0.01em" }}>How to Calculate GST — Step by Step</h2>
        <Step number={1} title="Open the GST Calculator">Go to <Link to="/business/gst-calculator" style={{ color: "#0F766E", fontWeight: 600 }}>opstools.ai/business/gst-calculator</Link>. No login required.</Step>
        <Step number={2} title="Choose Add GST or Remove GST">Pick "Add GST" if your price excludes GST and you need the total, or "Remove GST" if your price already includes GST and you need the base amount.</Step>
        <Step number={3} title="Enter the Amount">Type in the price — the label switches automatically to "Price (Excl. GST)" or "Price (Incl. GST)" depending on the mode you picked.</Step>
        <Step number={4} title="Select the GST Rate">Choose from 0%, 0.25%, 0.5%, 1%, 1.5%, 3%, 5%, 7.5%, 12%, 18%, or 28% — or click a common item from the quick-reference list to auto-select its typical rate.</Step>
        <Step number={5} title="Select Transaction Type">Choose "Intra-state" if buyer and seller are in the same state (splits GST into CGST + SGST) or "Inter-state" if they're in different states (charges the full amount as IGST).</Step>
        <Step number={6} title="Read the Breakdown">The taxable amount, total GST, CGST/SGST or IGST split, and final total appear instantly, along with a full breakdown table and a comparison across common rates (0%, 5%, 12%, 18%, 28%).</Step>
        <Step number={7} title="Save to History (Optional)">Click "Save to History" to keep a running list of up to 10 recent calculations on the page, useful when comparing multiple line items in one sitting.</Step>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 20px", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
        {[
          { q: "What's the difference between adding and removing GST?", a: "Adding GST starts from a GST-exclusive price and calculates the tax on top (Price × Rate ÷ 100), giving you a higher total. Removing GST starts from a GST-inclusive price and works backward to find the base value (Price ÷ (1 + Rate ÷ 100)) and the tax hidden within it. They use different formulas — you can't just subtract the percentage from an inclusive price." },
          { q: "When do I use CGST + SGST instead of IGST?", a: "CGST + SGST applies when the buyer and seller are in the same state (intra-state) — the total GST is split equally between the two. IGST applies when the buyer and seller are in different states (inter-state) — the full GST amount is charged as IGST instead of being split." },
          { q: "How is the CGST/SGST rate calculated from the total GST rate?", a: "For an intra-state transaction, the total GST rate is split evenly: each of CGST and SGST is charged at half the total rate, and each amount is half of the total GST amount. For example, at an 18% total rate, CGST is 9% and SGST is 9%." },
          { q: "Can I calculate GST for any rate, not just 5%, 12%, 18%, or 28%?", a: "Yes — the calculator supports 0%, 0.25%, 0.5%, 1%, 1.5%, 3%, 5%, 7.5%, 12%, 18%, and 28%, covering both the standard slabs and the lower rates used for items like rough diamonds, precious metals, and specific job-work services." },
          { q: "Do the GST rate slabs shown for common items always apply?", a: "The categories and rates shown are common reference points for everyday items, but GST classifications and rates can change and can vary by specific product description or notification. Always verify the exact rate applicable to your product or service before issuing an invoice." },
          { q: "Is this GST calculator free to use?", a: "Yes — completely free, with no login, subscription, or credits required. Calculations happen instantly in your browser." },
        ].map((faq, i) => (
          <div key={i} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 20px", marginBottom: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Q: {faq.q}</div>
            <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>A: {faq.a}</div>
          </div>
        ))}

        <div style={{ background: "linear-gradient(135deg,#042f2e,#0f766e)", borderRadius: 16, padding: "32px 28px", textAlign: "center", marginTop: 48, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>Calculate your GST now</h3>
          <p style={{ fontSize: 14, color: "#5EEAD4", margin: "0 0 24px" }}>Free · No login · Add or remove GST · CGST/SGST/IGST breakdown</p>
          <Link to="/business/gst-calculator" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#0F766E,#115E59)", color: "#fff", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Open GST Calculator →
          </Link>
        </div>

        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Related Tools</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { name: "GST Invoice Generator", href: "/documents/gst-invoice", desc: "Tax-compliant invoices" },
              { name: "ROI Calculator", href: "/business/roi-calculator", desc: "Business return on investment" },
              { name: "Invoice Generator", href: "/documents/invoice", desc: "Professional invoices for any business" },
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
