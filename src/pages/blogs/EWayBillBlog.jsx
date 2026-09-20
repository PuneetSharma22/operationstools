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
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#2563EB,#1E40AF)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>{number}</div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>{title}</h3>
        <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>{children}</div>
      </div>
    </div>
  );
}

export default function EWayBillBlog() {
  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <Helmet>
        <title>How to Generate an E-Way Bill Reference Online in India (2026) | OpsTools</title>
        <meta name="description" content="Guide to generating an e-way bill reference document with consignor, consignee, and transport details — HSN code, vehicle number, distance, and GST breakup. Free, no login, instant PDF." />
        <meta property="og:title" content="How to Generate an E-Way Bill Reference Online in India (2026) | OpsTools" />
        <meta property="og:description" content="Guide to generating an e-way bill reference document with consignor, consignee, and transport details — HSN code, vehicle number, distance, and GST breakup. Free, no login, instant PDF." />
        <meta property="og:url" content="https://www.opstools.ai/blogs/how-to-generate-eway-bill-online-india" />
        <link rel="canonical" href="https://www.opstools.ai/blogs/how-to-generate-eway-bill-online-india" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>
      <style>{`@media(max-width:900px){.blog-layout{grid-template-columns:1fr!important}.blog-sidebar{position:static!important;margin-top:32px;}}`}</style>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#1e3a8a 55%,#1e40af 100%)", padding: "72px 24px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748B", display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#334155" }}>›</span>
            <Link to="/blogs" style={{ color: "#64748B", textDecoration: "none" }}>Blog</Link>
            <span style={{ color: "#334155" }}>›</span>
            <span style={{ color: "#94A3B8" }}>E-Way Bill Guide</span>
          </nav>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(37,99,235,0.2)", border: "1px solid rgba(37,99,235,0.3)", color: "#93C5FD", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 999, marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>Guide</div>
            <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              How to Generate an E-Way Bill Reference Online in India (2026)
            </h1>
            <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 24px" }}>
              A complete guide to e-way bill reference documents — when one is legally required, what consignor, consignee, and transport details it needs, and how to lay it out cleanly for free.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#64748B", flexWrap: "wrap" }}>
              <span>Arijit Sawant</span><span>·</span><span>September 13, 2026</span><span>·</span><span>7 min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
          {[
            ["Threshold", "Consignment value > ₹50,000", "#DBEAFE", "#2563EB"],
            ["Validity", "Based on distance travelled", "#EDE9FE", "#7C3AED"],
            ["Official Portal", "ewaybillgst.gov.in", "#FEF3C7", "#D97706"],
            ["Cost Here", "100% Free", "#D1FAE5", "#059669"],
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
          Moving goods worth more than ₹50,000 under GST means having an e-way bill on hand — and once you've generated the actual EWB number on the government portal, you still need a clean, properly formatted document to travel with the shipment. Most businesses either recreate this layout by hand every time or dig up an old invoice template and edit it under time pressure while a truck waits at the gate.
        </p>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          This guide covers when an e-way bill is legally required, what fields it must carry, and how to generate a clean, print-ready e-way bill reference document — with consignor, consignee, and transport details all filled in correctly — in under a minute.
        </p>

        <Callout icon="✅" title="Quick answer" color="#EFF6FF" borderColor="#2563EB">
          Go to <Link to="/documents/eway-bill" style={{ color: "#2563EB", fontWeight: 600 }}>opstools.ai/documents/eway-bill</Link>, enter your EWB number (generated on the government portal), consignor and consignee details, goods description, and transport details. Download as PDF or PNG. No login required.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What is an E-Way Bill?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          An e-way bill (Electronic Way Bill) is a document required under Indian GST law for transporting goods worth more than ₹50,000. It must be generated on the government's e-way bill portal before the goods move, and it contains consignor/consignee details, goods description, and transport information — vehicle number, transporter name, and route.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          The e-way bill number (EWB No.) itself is issued by the portal, not by any third-party tool. What businesses still need, separately, is a clean copy of that information laid out on paper or PDF to travel with the consignment, hand to the driver, or file alongside the invoice for dispatch records.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>Who Needs This</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {[
            { icon: "🏭", title: "Businesses shipping goods", desc: "Prepare a clean, properly formatted e-way bill reference document to travel with the shipment." },
            { icon: "🚚", title: "Transporters", desc: "Keep consistent documentation for every consignment carried, across vehicles and routes." },
            { icon: "🧾", title: "Accounts & logistics teams", desc: "Generate a print-ready copy alongside the invoice for dispatch and audit records." },
          ].map(f => (
            <div key={f.title} style={{ display: "flex", gap: 14, background: "#EFF6FF", borderRadius: 12, padding: "16px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#2563EB", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What Should an E-Way Bill Reference Include?</h2>
        <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Field","Example","Required?"].map(h=><th key={h} style={{ padding:"10px 14px", fontSize:12, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"left", borderBottom:"1px solid #E2E8F0" }}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ["EWB No.","123456789012 (from the government portal)","✅ Required"],
                ["Linked Document","Tax Invoice / Delivery Challan No. & date","✅ Required"],
                ["Consignor & Consignee","Name, GSTIN, address, state","✅ Required"],
                ["HSN Code","8542","✅ Required"],
                ["Vehicle No.","MH12AB1234","✅ Required"],
                ["Transport Mode","Road / Rail / Air / Ship","✅ Required"],
                ["Distance (km)","245","✅ Required"],
                ["Taxable Value & GST","₹1,85,000 + CGST/SGST/IGST","✅ Required"],
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

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>When is an E-Way Bill Legally Required?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Under GST rules, an e-way bill is required whenever the value of the consignment being transported — the goods plus applicable tax — exceeds <strong>₹50,000</strong>, whether the movement is inter-state or intra-state (some states set their own, sometimes higher, intra-state thresholds and exemptions). It must be generated on the government's e-way bill portal <strong>before</strong> the goods start moving, not after.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Validity is tied to the distance the goods will travel and the type of cargo — normal cargo generally gets roughly one additional day of validity for every set block of distance covered, with a longer window for over-dimensional cargo moving shorter distances per day. These slabs and the base threshold are set by the government and revised from time to time, so always confirm the current distance-to-validity mapping on the e-way bill portal or with your tax advisor before relying on it for compliance.
        </p>

        <Callout icon="⚠️" title="Not an official EWB" color="#FFFBEB" borderColor="#F59E0B">
          This tool creates a properly formatted <strong>reference document</strong> with your e-way bill number and shipment details laid out clearly — it does not generate the actual e-way bill number itself. The EWB No. must come from the official e-way bill portal at <strong>ewaybillgst.gov.in</strong> before goods move; use this generator to produce the clean paperwork that travels alongside it.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 24px", letterSpacing: "-0.01em" }}>How to Generate an E-Way Bill Reference — Step by Step</h2>
        <Step number={1} title="Enter e-way bill details">Go to <Link to="/documents/eway-bill" style={{ color: "#2563EB", fontWeight: 600 }}>opstools.ai/documents/eway-bill</Link>. Add the EWB No. from the government portal, generated date, and validity.</Step>
        <Step number={2} title="Add the document reference">Link the original tax invoice, bill of supply, delivery challan, credit note, or bill of entry number and date.</Step>
        <Step number={3} title="Add goods details">Product name, HSN code, quantity, unit, taxable value, and the CGST, SGST, or IGST breakup.</Step>
        <Step number={4} title="Add transport details">Transport mode, vehicle number, transporter name and ID, and the distance to be covered.</Step>
        <Step number={5} title="Add consignor & consignee">Full name, GSTIN, address, and state for both parties — the preview fills in the route automatically.</Step>
        <Step number={6} title="Download the document">Click Save to download the reference document as a PDF or PNG. The live preview updates as you type, so you can check every field before exporting.</Step>

        <Callout icon="💡" title="Tip — Generate the EWB first" color="#EFF6FF" borderColor="#2563EB">
          Always generate the actual e-way bill number on the government portal first, then use this tool to lay out the reference document with that EWB No. and all the shipment details. That way the printed copy travelling with the goods matches exactly what's registered with the government.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 20px", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
        {[
          { q: "What is an e-way bill?", a: "An e-way bill is a document required under GST for the movement of goods worth more than ₹50,000, containing details of the goods, consignor, consignee, and transporter." },
          { q: "Does this generate a legally valid e-way bill?", a: "This creates a properly formatted reference document with your e-way bill number and details laid out clearly — the actual e-way bill number (EWB No.) itself must be generated on the government's e-way bill portal before goods move." },
          { q: "What details does an e-way bill need?", a: "Consignor and consignee details, invoice/document reference, goods description with HSN code, transport mode, vehicle number, and distance." },
          { q: "Is this free?", a: "Yes, completely free with no login required." },
          { q: "How long is an e-way bill valid for?", a: "Validity depends on the distance the goods will travel and the cargo type, under slabs set by the government that are revised from time to time. Always check the current validity period on the official e-way bill portal before dispatch." },
          { q: "Can I edit the details after downloading?", a: "Yes — the form stays editable in your browser, so you can update any field and re-download a fresh PDF or PNG at any time. Nothing is saved on our servers unless you choose to." },
        ].map((faq, i) => (
          <div key={i} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 20px", marginBottom: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Q: {faq.q}</div>
            <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>A: {faq.a}</div>
          </div>
        ))}

        <div style={{ background: "linear-gradient(135deg,#1e3a8a,#07011F)", borderRadius: 16, padding: "32px 28px", textAlign: "center", marginTop: 48, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>Generate your e-way bill reference now</h3>
          <p style={{ fontSize: 14, color: "#93C5FD", margin: "0 0 24px" }}>Free · No login · Consignor/consignee fields · HSN & GST breakup · Instant PDF</p>
          <Link to="/documents/eway-bill" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#2563EB,#1E40AF)", color: "#fff", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Generate E-Way Bill Reference →
          </Link>
        </div>

        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Related Tools</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { name: "GST Invoice Generator", href: "/documents/gst-invoice", desc: "Tax-compliant GST invoices" },
              { name: "E-Invoice Generator", href: "/documents/e-invoice", desc: "GST e-invoice with IRN" },
              { name: "Vehicle Expense Report", href: "/documents/vehicle-expense", desc: "Vehicle maintenance & fuel expense report" },
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
          <BlogSidebar currentSlug="how-to-generate-eway-bill-online-india" />
        </div>
        </div>
      </div>
    </div>
  );
}
