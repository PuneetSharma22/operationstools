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
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#D97706,#B45309)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>{number}</div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>{title}</h3>
        <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>{children}</div>
      </div>
    </div>
  );
}

export default function BookInvoiceBlog() {
  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <Helmet>
        <title>How to Generate a Book & Periodical Invoice Online in India (2026) | OpsTools</title>
        <meta name="description" content="Complete guide to GST invoices for book, magazine and periodical sales in India — HSN codes, GST rates, multi-item billing, CGST/SGST breakdown, and free instant PDF generation." />
        <meta property="og:title" content="How to Generate a Book & Periodical Invoice Online in India (2026) | OpsTools" />
        <meta property="og:description" content="Complete guide to GST invoices for book, magazine and periodical sales in India — HSN codes, GST rates, multi-item billing, CGST/SGST breakdown, and free instant PDF generation." />
        <meta property="og:url" content="https://www.opstools.ai/blogs/how-to-generate-book-invoice-online-india" />
        <link rel="canonical" href="https://www.opstools.ai/blogs/how-to-generate-book-invoice-online-india" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#451a03 55%,#78350f 100%)", padding: "72px 24px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748B", display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#334155" }}>›</span>
            <Link to="/blogs" style={{ color: "#64748B", textDecoration: "none" }}>Blog</Link>
            <span style={{ color: "#334155" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Book Invoice Guide</span>
          </nav>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(217,119,6,0.2)", border: "1px solid rgba(217,119,6,0.3)", color: "#FCD34D", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 999, marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>Guide</div>
            <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              How to Generate a Book & Periodical Invoice Online in India (2026)
            </h1>
            <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 24px" }}>
              A complete guide to GST invoices for book, magazine and newspaper sales — HSN codes, GST rates per item, multi-item billing, and how to generate a compliant invoice for free.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#64748B", flexWrap: "wrap" }}>
              <span>Arijit Sawant</span><span>·</span><span>September 25, 2026</span><span>·</span><span>6 min read</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key facts strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
          {[
            ["Book HSN", "4901", "#FEF3C7", "#D97706"],
            ["Periodical HSN", "4902", "#FDE68A", "#B45309"],
            ["Tax Split", "CGST + SGST", "#FFEDD5", "#C2410C"],
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
          Selling books, magazines or newspapers and need a proper GST invoice? Bookstores, newsstands and publishers often end up scribbling a handwritten slip or forcing every title onto one blanket tax rate — which causes problems the moment a customer buys a nil-rated book alongside a taxable magazine or a stationery item in the same bill.
        </p>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          This guide covers what a book & periodical invoice needs to include, how GST and HSN codes apply to different kinds of printed matter, and how to generate a clean, multi-item, GST-compliant invoice for free in under a minute.
        </p>

        <Callout icon="✅" title="Quick answer" color="#FFFBEB" borderColor="#D97706">
          Go to <Link to="/documents/book-invoice" style={{ color: "#D97706", fontWeight: 600 }}>opstools.ai/documents/book-invoice</Link>, add your store and customer details, list each book or periodical with its own HSN code and GST rate, and click Save. Totals, tax breakup and amount in words are calculated automatically. No login required.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What is a Book & Periodical Invoice?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          A book & periodical invoice is the GST tax invoice a bookstore, newsstand or publisher issues for the sale of books, magazines or newspapers, showing the taxable value, applicable GST, and total per title sold.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Unlike a single-rate retail bill, a book invoice usually needs to hold several titles on one document — each with its own author or publisher, HSN classification and GST rate — because printed books, periodicals and any stationery sold alongside them are not all taxed the same way.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>Who Actually Needs This</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {[
            { icon: "📚", title: "Bookstores & newsstands", desc: "Issue proper GST invoices for book and magazine sales instead of a handwritten slip." },
            { icon: "🏭", title: "Publishers & distributors", desc: "Bill retailers or direct customers with correctly split HSN codes and GST rates per title." },
            { icon: "🧾", title: "Expense & reimbursement records", desc: "Generate a clean receipt for book purchases claimed as a business or education expense." },
          ].map(f => (
            <div key={f.title} style={{ display: "flex", gap: 14, background: "#FFFBEB", borderRadius: 12, padding: "16px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#D97706", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>{f.icon}</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What Should a Book & Periodical Invoice Include?</h2>
        <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Field","Example","Required?"].map(h=><th key={h} style={{ padding:"10px 14px", fontSize:12, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"left", borderBottom:"1px solid #E2E8F0" }}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ["Invoice No. & Date","INV-2026-045, 12 Nov 2026","✅ Required"],
                ["Store Name, Address & GSTIN","Nandan Book Store, MG Road, Pune","✅ GSTIN if registered"],
                ["Customer Name","Rajesh Verma","✅ Required"],
                ["Customer Address / Phone","Mumbai, 98XXXXXXXX","Optional"],
                ["Title","Best of Indian Mythology","✅ Required"],
                ["Author / Publisher","Amar Chitra Katha","✅ Required"],
                ["HSN Code","4901 (books) / 4902 (periodicals)","✅ Required"],
                ["Quantity & Rate","2 units @ ₹250","✅ Required"],
                ["GST Rate per item","0% / 5% / 12%","✅ Required"],
                ["Payment Mode","UPI / Cash / Card","✅ Required"],
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

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>GST Rates and HSN Codes for Books & Periodicals</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Printed books fall under HSN 4901 and are commonly nil-rated (0% GST) in India. Periodicals — magazines and newspapers — fall under HSN 4902, and depending on classification can be nil-rated or attract a GST rate of their own. Stationery or gift items often sold alongside books at the same counter — notebooks, diaries, greeting cards — are a separate classification again, typically taxed at 5%, 12% or 18%.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Because rates vary by item rather than by invoice, lumping every line under one blanket GST rate is a common mistake. Each item on the invoice should carry its own HSN code and GST rate, and CGST/SGST (for intra-state sales) or IGST (for inter-state sales) should be computed on that item's taxable value individually. Rates set by the GST Council can be revised — always confirm the current rate for a given HSN code before finalizing a high-value or bulk invoice.
        </p>

        <Callout icon="💡" title="Tip — Never assume one rate for the whole bill" color="#FFFBEB" borderColor="#D97706">
          If a customer buys a nil-rated book, a taxable magazine and a stationery item in the same transaction, add them as three separate line items with three different GST rates rather than averaging or rounding to a single rate for the invoice.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 24px", letterSpacing: "-0.01em" }}>How to Generate a Book & Periodical Invoice — Step by Step</h2>
        <Step number={1} title="Open the Book & Periodical Invoice Generator">Go to <Link to="/documents/book-invoice" style={{ color: "#D97706", fontWeight: 600 }}>opstools.ai/documents/book-invoice</Link>. No login required.</Step>
        <Step number={2} title="Add Invoice Details">Invoice number, invoice date, payment mode, and a logo URL if you want your store's logo on the printed invoice.</Step>
        <Step number={3} title="Add Store Details (Sold By)">Store name, address, GSTIN, phone and email — this is the seller information printed at the top of the invoice.</Step>
        <Step number={4} title="Add Customer Details (Bill To)">Customer name is required; address and phone are optional but useful for reimbursement or record-keeping.</Step>
        <Step number={5} title="Add Each Book or Periodical">For every title, enter the description, author/publisher, HSN code, quantity, rate and its own GST rate. Add as many line items as the sale needs.</Step>
        <Step number={6} title="Check the Live Preview">The invoice preview updates instantly as you type, so you can verify each line's total and the grand total before exporting.</Step>
        <Step number={7} title="Download the Invoice">Click Save to download the invoice as a PDF or PNG. For high-volume stores, use "Generate in Bulk" to upload a CSV and produce a batch of invoices at once.</Step>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 20px", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
        {[
          { q: "Is this book invoice generator free?", a: "Yes, single invoices are completely free with no login required. Bulk generation via CSV uses credits." },
          { q: "Can I add multiple books or magazines to one invoice?", a: "Yes, add as many line items as you need — each with its own title, author/publisher, HSN code, quantity, rate and GST rate." },
          { q: "What GST rate applies to books and periodicals?", a: "Printed books are commonly nil-rated (0% GST) while some periodicals, stationery and other retail items can attract 5%, 12% or 18% — set the correct rate per item; this generator doesn't assume one rate for everything." },
          { q: "Can I generate many invoices at once?", a: "Yes, use \"Generate in Bulk\" to upload a CSV and generate a batch of single-item invoices as one PDF." },
          { q: "Can I download the invoice as an image instead of a PDF?", a: "Yes — invoices can be saved as either a PDF or a PNG image, whichever your workflow needs." },
          { q: "Does my data get stored or uploaded anywhere?", a: "For single-invoice generation, no — everything happens in your browser and nothing is transmitted or stored on our servers." },
        ].map((faq, i) => (
          <div key={i} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 20px", marginBottom: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Q: {faq.q}</div>
            <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>A: {faq.a}</div>
          </div>
        ))}

        <div style={{ background: "linear-gradient(135deg,#451a03,#78350f)", borderRadius: 16, padding: "32px 28px", textAlign: "center", marginTop: 48, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>Generate your book & periodical invoice now</h3>
          <p style={{ fontSize: 14, color: "#FCD34D", margin: "0 0 24px" }}>Free · No login · Multiple items · CGST/SGST breakdown · Instant PDF</p>
          <Link to="/documents/book-invoice" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#D97706,#B45309)", color: "#fff", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Generate Book Invoice →
          </Link>
        </div>

        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Related Tools</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { name: "GST Invoice Generator", href: "/documents/gst-invoice", desc: "General-purpose GST tax invoices" },
              { name: "Restaurant Bill Generator", href: "/documents/restaurant-bill", desc: "Restaurant bills & food receipts" },
              { name: "Mobile / Telephone Bill", href: "/documents/mobile-bill", desc: "Postpaid invoices & prepaid recharge receipts" },
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
