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
      <div style={{ width: 36, height: 36, borderRadius: "50%", background: "linear-gradient(135deg,#0284C7,#0369A1)", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15, fontWeight: 800, flexShrink: 0, marginTop: 2 }}>{number}</div>
      <div>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 8px" }}>{title}</h3>
        <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>{children}</div>
      </div>
    </div>
  );
}

function HeroIllustration() {
  return (
    <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>
        <svg width="100%" viewBox="0 0 680 280" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
          <rect width="680" height="280" fill="#F8FAFC"/>
          <ellipse cx="200" cy="160" rx="180" ry="120" fill="#0284C7" opacity="0.04"/>
          <ellipse cx="500" cy="120" rx="160" ry="110" fill="#0369A1" opacity="0.04"/>
          <pattern id="hdots" x="0" y="0" width="32" height="32" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" fill="rgba(0,0,0,0.03)"/></pattern>
          <rect width="680" height="280" fill="url(#hdots)"/>

          {/* Stay details card */}
          <g transform="translate(50,55)">
            <rect x="2" y="2" width="150" height="100" rx="10" fill="rgba(0,0,0,0.04)"/>
            <rect width="150" height="100" rx="10" fill="#fff" stroke="#E2E8F0" strokeWidth="1.5"/>
            {/* little hotel building glyph */}
            <rect x="10" y="10" width="22" height="18" rx="2" fill="#0284C7" opacity="0.15"/>
            {[0,1].map(r=>[0,1,2].map(c=>(
              <rect key={`${r}-${c}`} x={13+c*6} y={13+r*7} width="3" height="4" rx="0.5" fill="#0284C7" opacity="0.7"/>
            )))}
            <rect x="38" y="14" width="60" height="5" rx="2.5" fill="#0284C7" opacity="0.8"/>
            <rect x="10" y="38" width="120" height="3" rx="1.5" fill="#E2E8F0"/>
            <rect x="10" y="46" width="90" height="3" rx="1.5" fill="#E2E8F0"/>
            <rect x="10" y="60" width="50" height="3" rx="1.5" fill="#94A3B8"/>
            <rect x="70" y="60" width="60" height="3" rx="1.5" fill="#E2E8F0"/>
            <rect x="10" y="68" width="50" height="3" rx="1.5" fill="#94A3B8"/>
            <rect x="70" y="68" width="60" height="3" rx="1.5" fill="#E2E8F0"/>
            <rect x="10" y="82" width="44" height="10" rx="5" fill="#0284C7" opacity="0.15"/>
            <rect x="14" y="85" width="34" height="4" rx="2" fill="#0284C7" opacity="0.6"/>
          </g>

          {/* Arrow */}
          <path d="M210 105 L258 105" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5"/>
          <polygon points="258,101 266,105 258,109" fill="#0284C7" opacity="0.5"/>

          {/* Hotel bill */}
          <g transform="translate(266,20)">
            <rect x="3" y="3" width="148" height="240" rx="10" fill="rgba(0,0,0,0.04)"/>
            <rect width="148" height="240" rx="10" fill="#fff" stroke="#E2E8F0" strokeWidth="1.5"/>
            <rect width="148" height="4" rx="2" fill="#0284C7"/>
            <rect x="10" y="14" width="50" height="5" rx="2.5" fill="#0284C7" opacity="0.8"/>
            <text x="138" y="20" textAnchor="end" fill="#64748B" fontSize="7" fontFamily="sans-serif" fontWeight="700">HOTEL BILL</text>
            <rect x="10" y="24" width="80" height="3" rx="1.5" fill="#E2E8F0"/>
            <rect x="10" y="31" width="60" height="3" rx="1.5" fill="#E2E8F0"/>
            <line x1="10" y1="42" x2="138" y2="42" stroke="#F1F5F9" strokeWidth="1"/>
            {/* Check-in/out row */}
            <rect x="10" y="48" width="34" height="3" rx="1.5" fill="#E2E8F0"/>
            <rect x="80" y="48" width="30" height="3" rx="1.5" fill="#0284C7" opacity="0.4"/>
            {/* Nights row */}
            <rect x="10" y="56" width="30" height="3" rx="1.5" fill="#E2E8F0"/>
            <rect x="80" y="56" width="16" height="3" rx="1.5" fill="#E2E8F0"/>
            <line x1="10" y1="66" x2="138" y2="66" stroke="#F1F5F9" strokeWidth="1"/>
            {/* Table header */}
            <rect x="8" y="70" width="132" height="14" rx="3" fill="#0284C7" opacity="0.1"/>
            {["Desc","Cat","Qty","Rate","Amt"].map((h,i)=>(
              <text key={h} x={12+i*26} y="80" fill="#0284C7" fontSize="6" fontFamily="sans-serif" fontWeight="700">{h}</text>
            ))}
            {[0,1,2].map(row=>(
              <g key={row}>
                <rect x="8" y={88+row*14} width="132" height="12" rx="2" fill={row%2===0?"#fff":"#F8FAFC"}/>
                {[0,1,2,3,4].map(col=>(
                  <rect key={col} x={12+col*26} y={91+row*14} width={col===0?20:14} height="3" rx="1.5" fill="#E2E8F0"/>
                ))}
              </g>
            ))}
            {/* Totals */}
            <line x1="10" y1="135" x2="138" y2="135" stroke="#F1F5F9" strokeWidth="1"/>
            {[["Subtotal",""],["CGST 6%",""],["SGST 6%",""]].map(([l],i)=>(
              <g key={l}>
                <rect x="10" y={140+i*10} width="35" height="3" rx="1.5" fill="#E2E8F0"/>
                <rect x="110" y={140+i*10} width="28" height="3" rx="1.5" fill="#E2E8F0"/>
              </g>
            ))}
            <rect x="8" y="175" width="132" height="18" rx="5" fill="#0284C7" opacity="0.15"/>
            <rect x="12" y="181" width="40" height="5" rx="2.5" fill="#0284C7" opacity="0.6"/>
            <rect x="105" y="181" width="30" height="5" rx="2.5" fill="#0284C7" opacity="0.8"/>
            <rect x="10" y="202" width="128" height="24" rx="6" fill="#F8FAFC" stroke="#E2E8F0" strokeWidth="0.5"/>
            {[0,4,8,12,16,20,24,28,32,36,40,44,48,52,56,60,64,68,72,76,80].map((x,i)=>(
              <rect key={i} x={16+x} y="206" width={x%12===0?2:1} height="16" rx="0.5" fill="#CBD5E1"/>
            ))}
            <text x="74" y="234" textAnchor="middle" fill="#94A3B8" fontSize="7" fontFamily="sans-serif" letterSpacing="0.1em">OPSTOOLS.AI</text>
          </g>

          {/* Arrow */}
          <path d="M424 140 L466 140" stroke="#0369A1" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.5"/>
          <polygon points="466,136 474,140 466,144" fill="#0369A1" opacity="0.5"/>

          {/* PDF */}
          <g transform="translate(474,80)">
            <rect x="3" y="3" width="90" height="110" rx="8" fill="rgba(0,0,0,0.04)"/>
            <rect width="90" height="110" rx="8" fill="#fff" stroke="#E2E8F0" strokeWidth="1.5"/>
            <path d="M56 0 L90 34 L56 34 Z" fill="#E0F2FE"/>
            <path d="M56 0 L90 34" stroke="#7DD3FC" strokeWidth="0.5" fill="none"/>
            <rect x="8" y="42" width="30" height="13" rx="4" fill="#0284C7"/>
            <text x="23" y="52" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="sans-serif">PDF</text>
            <rect x="8" y="62" width="66" height="3" rx="1.5" fill="#E2E8F0"/>
            <rect x="8" y="69" width="50" height="3" rx="1.5" fill="#F1F5F9"/>
            <rect x="8" y="76" width="58" height="3" rx="1.5" fill="#F1F5F9"/>
            <circle cx="68" cy="90" r="13" fill="#E0F2FE" stroke="#7DD3FC" strokeWidth="1"/>
            <path d="M68 83 L68 92 M64 88 L68 93 L72 88" stroke="#0284C7" strokeWidth="1.5" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          </g>
          <text x="125" y="168" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">Stay &amp; Guest Details</text>
          <text x="340" y="272" textAnchor="middle" fill="#64748B" fontSize="11" fontWeight="600" fontFamily="sans-serif" letterSpacing="0.06em">FREE HOTEL BILL GENERATOR</text>
          <text x="519" y="208" textAnchor="middle" fill="#94A3B8" fontSize="10" fontFamily="sans-serif">Saved as PDF</text>
        </svg>
      </div>
    </div>
  );
}

export default function HotelBillBlog() {
  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
      <Helmet>
        <title>How to Generate a Hotel Bill Online in India for Free (2026) | OpsTools</title>
        <meta name="description" content="Complete guide to generating hotel bills in India — check-in/check-out dates, room charges, additional charges, GSTIN, CGST/SGST, and instant PDF download. No login, no cost." />
        <meta property="og:title" content="How to Generate a Hotel Bill Online in India for Free (2026) | OpsTools" />
        <meta property="og:description" content="Complete guide to generating hotel bills in India — check-in/check-out dates, room charges, additional charges, GSTIN, CGST/SGST, and instant PDF download. No login, no cost." />
        <meta property="og:url" content="https://www.opstools.ai/blogs/how-to-generate-hotel-bill-online-india" />
        <link rel="canonical" href="https://www.opstools.ai/blogs/how-to-generate-hotel-bill-online-india" />
        <meta property="og:type" content="article" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>
      <style>{`@media(max-width:900px){.blog-layout{grid-template-columns:1fr!important}.blog-sidebar{position:static!important;margin-top:32px;}}`}</style>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0c2340 100%)", padding: "72px 24px 48px" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ marginBottom: 20, fontSize: 13, color: "#64748B", display: "flex", gap: 8, alignItems: "center" }}>
            <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ color: "#334155" }}>›</span>
            <Link to="/blogs" style={{ color: "#64748B", textDecoration: "none" }}>Blog</Link>
            <span style={{ color: "#334155" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Hotel Bill Guide</span>
          </nav>
          <div style={{ maxWidth: 760 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "rgba(2,132,199,0.2)", border: "1px solid rgba(2,132,199,0.3)", color: "#7DD3FC", fontSize: 11, fontWeight: 700, padding: "3px 12px", borderRadius: 999, marginBottom: 16, letterSpacing: "0.08em", textTransform: "uppercase" }}>Guide</div>
            <h1 style={{ fontSize: "clamp(22px,3vw,34px)", fontWeight: 800, color: "#fff", lineHeight: 1.2, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
              How to Generate a Hotel Bill Online in India for Free (2026)
            </h1>
            <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.7, margin: "0 0 24px" }}>
              A complete guide to hotel bills — check-in/check-out dates, room and additional charges, GSTIN, CGST/SGST, and instant PDF download. No login, no cost.
            </p>
            <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 13, color: "#64748B", flexWrap: "wrap" }}>
              <span>Arijit Sawant</span><span>·</span><span>August 20, 2026</span><span>·</span><span>7 min read</span>
            </div>
          </div>
        </div>
      </section>

      <HeroIllustration />

      {/* Key facts strip */}
      <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "24px" }}>
        <div style={{ maxWidth: 760, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(150px,1fr))", gap: 12 }}>
          {[
            ["Nights", "Auto-calculated", "#E0F2FE", "#0284C7"],
            ["Tax", "CGST + SGST", "#DBEAFE", "#2563EB"],
            ["Format", "PDF or PNG", "#EDE9FE", "#7C3AED"],
            ["Cost", "100% Free", "#D1FAE5", "#059669"],
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
          Whether you run a small hotel or guesthouse, or you're a traveler who needs a proper receipt for expense reimbursement, a hotel bill has to get a few things right: accurate stay dates, itemized charges, and — for registered properties — GSTIN and tax breakup. Most small hotels either scribble this by hand or pay for a full property management system just to print a receipt.
        </p>
        <p style={{ fontSize: 16, color: "#374151", lineHeight: 1.85, marginBottom: 20 }}>
          This guide covers what a hotel bill needs to include, how GST applies to hotel stays, and how to generate a clean, professional hotel bill for free in under a minute.
        </p>

        <Callout icon="✅" title="Quick answer" color="#F0F9FF" borderColor="#0284C7">
          Go to <Link to="/documents/hotel-bill" style={{ color: "#0284C7", fontWeight: 600 }}>opstools.ai/documents/hotel-bill</Link>, enter hotel and guest details, stay dates, and charges — nights and totals are calculated automatically. Download as PDF or PNG. No login required.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What is a Hotel Bill?</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          A hotel bill (sometimes called a guest folio) is the itemized receipt issued to a guest at checkout. It lists the room charge, number of nights, any additional charges — food, laundry, spa, transport — and the applicable tax, arriving at a final amount payable or paid.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          For business travelers, it's also the document finance teams ask for when processing a travel reimbursement claim. For the hotel or guesthouse, it's the record that ties a stay to revenue and — if GST-registered — to tax collected.
        </p>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>Who Actually Needs This</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
          {[
            { title: "Business travelers", desc: "Attach a properly formatted hotel bill when claiming back travel expenses from your employer or client." },
            { title: "Small hotels & guesthouses", desc: "Issue professional, itemized bills at checkout without buying or configuring dedicated hotel management software." },
            { title: "Finance & travel-desk teams", desc: "Keep consistent, well-formatted accommodation records across trips and vendors for expense reporting." },
          ].map(f => (
            <div key={f.title} style={{ display: "flex", gap: 14, background: "#F0F9FF", borderRadius: 12, padding: "16px" }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "#0284C7", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16, flexShrink: 0 }}>🏨</div>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: "#0F172A", marginBottom: 4 }}>{f.title}</div>
                <div style={{ fontSize: 13, color: "#475569", lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            </div>
          ))}
        </div>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>What Should a Hotel Bill Include?</h2>
        <div style={{ borderRadius: 12, border: "1px solid #E2E8F0", overflow: "hidden", marginBottom: 32 }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead><tr style={{ background: "#F8FAFC" }}>{["Field","Example","Required?"].map(h=><th key={h} style={{ padding:"10px 14px", fontSize:12, fontWeight:700, color:"#64748B", textTransform:"uppercase", letterSpacing:"0.06em", textAlign:"left", borderBottom:"1px solid #E2E8F0" }}>{h}</th>)}</tr></thead>
            <tbody>
              {[
                ["Hotel Name & Address","Hotel Sahyadri Grand, MG Road, Pune","✅ Required"],
                ["Hotel GSTIN","27AABCU9603R1ZX","✅ If GST-registered"],
                ["Guest Name & Address","Rajesh Verma, Mumbai","✅ Required"],
                ["Check-in / Check-out","20 Jun – 22 Jun 2026","✅ Required"],
                ["Room Type & Rate","Deluxe, ₹4,500/night","✅ Required"],
                ["Additional Charges","Room service, laundry, spa","✅ If applicable"],
                ["CGST & SGST","6% + 6% (varies by tariff)","✅ If GST-registered"],
                ["Bill Number & Date","HTL-1042, 22 Jun 2026","✅ Required"],
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

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 16px", letterSpacing: "-0.01em" }}>GST on Hotel Stays in India</h2>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          GST-registered hotels charge tax on room tariff based on the applicable rate slab for that tariff bracket, split as CGST + SGST for guests billed within the same state, or IGST for inter-state billing arrangements. Rates and slab thresholds are revised from time to time, so always confirm the current rate with your hotel's finance team or a tax advisor before finalizing a bill.
        </p>
        <p style={{ fontSize: 15, color: "#475569", lineHeight: 1.8, marginBottom: 16 }}>
          Additional services — food & beverage, spa, laundry — are often taxed at their own applicable rates rather than the room rate, which is why itemizing charges by category on the bill matters: it keeps each line auditable instead of lumping everything under one tax rate.
        </p>

        <Callout icon="💡" title="Tip — Categorize your charges" color="#F0F9FF" borderColor="#0284C7">
          Split charges into categories — Room, Food &amp; Beverage, Spa, Laundry, Transport, Miscellaneous — instead of one lump sum. It makes the bill easier for guests to understand, easier for your accountant to reconcile, and easier to defend if the GST breakup is ever questioned.
        </Callout>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 24px", letterSpacing: "-0.01em" }}>How to Generate a Hotel Bill — Step by Step</h2>
        <Step number={1} title="Open the Hotel Bill Generator">Go to <Link to="/documents/hotel-bill" style={{ color: "#0284C7", fontWeight: 600 }}>opstools.ai/documents/hotel-bill</Link>. No login required.</Step>
        <Step number={2} title="Add Hotel Details">Hotel name, address, phone, email, and GSTIN if registered. Add a logo URL if you want it on the printed bill.</Step>
        <Step number={3} title="Enter Stay Details">Bill number, room number and type, number of guests, and check-in/check-out dates — nights are calculated automatically.</Step>
        <Step number={4} title="Add Guest Details">Guest name, address, phone, and ID type/number if your hotel records this at check-in.</Step>
        <Step number={5} title="Add Charges by Category">Room charge, food & beverage, spa, laundry, transport, or miscellaneous — each itemized with quantity and rate.</Step>
        <Step number={6} title="Set Tax, Discount & Payment Mode">Enter CGST% and SGST%, any discount, and how the guest paid — card, cash, UPI, bank transfer, or online.</Step>
        <Step number={7} title="Download the Bill">Click Save to download as PDF or PNG. The live preview updates as you type, so you can check totals before exporting.</Step>

        <h2 style={{ fontSize: 22, fontWeight: 700, color: "#0F172A", margin: "40px 0 20px", letterSpacing: "-0.01em" }}>Frequently Asked Questions</h2>
        {[
          { q: "Is this hotel bill generator free?", a: "Yes — completely free, with no login, subscription, or credits required." },
          { q: "How is the number of nights calculated?", a: "Nights are calculated automatically from the check-in and check-out dates you enter — no manual counting needed." },
          { q: "Can I use this for travel reimbursement?", a: "Yes. A properly formatted hotel bill with dates, itemized charges, and GSTIN is exactly what most travel expense claims require." },
          { q: "Does it support additional charges beyond the room rate?", a: "Yes — charges can be added by category (Room, Food & Beverage, Spa, Laundry, Transport, Miscellaneous), each with its own quantity and rate." },
          { q: "Can small hotels or guesthouses use this instead of a PMS?", a: "For low-volume properties that don't need full booking/inventory management, this generator covers the billing side — professional itemized bills without subscribing to a property management system." },
          { q: "Does my data get stored or uploaded anywhere?", a: "No — everything happens in your browser. Nothing is uploaded or stored on our servers unless you choose to save your session." },
        ].map((faq, i) => (
          <div key={i} style={{ background: "#F8FAFC", borderRadius: 12, padding: "18px 20px", marginBottom: 12, border: "1px solid #E2E8F0" }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: "#0F172A", marginBottom: 8 }}>Q: {faq.q}</div>
            <div style={{ fontSize: 14, color: "#475569", lineHeight: 1.75 }}>A: {faq.a}</div>
          </div>
        ))}

        <div style={{ background: "linear-gradient(135deg,#0c2340,#07011F)", borderRadius: 16, padding: "32px 28px", textAlign: "center", marginTop: 48, border: "1px solid rgba(255,255,255,0.06)" }}>
          <h3 style={{ fontSize: 20, fontWeight: 800, color: "#fff", margin: "0 0 10px" }}>Generate your hotel bill now</h3>
          <p style={{ fontSize: 14, color: "#7DD3FC", margin: "0 0 24px" }}>Free · No login · Auto-calculated nights · CGST/SGST · Instant PDF</p>
          <Link to="/documents/hotel-bill" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#0284C7,#0369A1)", color: "#fff", padding: "13px 28px", borderRadius: 10, fontWeight: 700, fontSize: 15, textDecoration: "none" }}>
            Generate Hotel Bill →
          </Link>
        </div>

        <div style={{ marginTop: 48 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", marginBottom: 16 }}>Related Tools</h3>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            {[
              { name: "Travel Expense Report", href: "/documents/travel-expense", desc: "Business travel expense summary" },
              { name: "Restaurant Bill Generator", href: "/documents/restaurant-bill", desc: "Restaurant bills & food receipts" },
              { name: "Fuel Bill Generator", href: "/documents/fuel-bill", desc: "Petrol & diesel receipts" },
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
          <BlogSidebar currentSlug="how-to-generate-hotel-bill-online-india" />
        </div>
        </div>
      </div>
    </div>
  );
}
