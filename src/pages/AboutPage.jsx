const ROADMAP = [
  { name: "Fuel Bill Generator", category: "Transport", bundle: "Transport Suite", date: "2026-06-19", status: "live", icon: "⛽", href: "/documents/fuel-bill" },
  { name: "Rent Receipt", category: "Housing", bundle: "Housing Suite", date: "2026-06-19", status: "live", icon: "🏠", href: "/documents/rent-receipt" },
  { name: "L&D Bill Generator", category: "Education", bundle: "Education Suite", date: "2026-06-25", status: "live", icon: "🎓", href: "/documents/ld-bill" },
  { name: "GST Invoice Generator", category: "GST", bundle: "GST Suite", date: "2026-06-28", status: "live", icon: "🧾", href: "/documents/gst-invoice" },
  { name: "Salary Slip Generator", category: "HR", bundle: "HR Suite", date: "2026-06-28", status: "live", icon: "💼", href: "/documents/salary-slip" },
  { name: "ROI Calculator", category: "Finance", bundle: "Finance Suite", date: "2026-06-28", status: "live", icon: "📈", href: "/business/roi-calculator" },
  { name: "Invoice Generator", category: "Sales", bundle: "Invoice Suite", date: "2026-07-07", status: "new", icon: "🧾", href: "/documents/invoice" },
  { name: "Quotation Generator", category: "Sales", bundle: "Invoice Suite", date: "2026-07-07", status: "new", icon: "📋", href: "/documents/quotation" },
  { name: "Restaurant Bill", category: "Food", bundle: "Food Suite", date: "2026-07-07", status: "new", icon: "🍽️", href: "/documents/restaurant-bill" },
  { name: "Medical Bill", category: "Healthcare", bundle: "Healthcare Suite", date: "2026-07-07", status: "new", icon: "🏥", href: "/documents/medical-bill" },
  { name: "Hotel Bill", category: "Hospitality", bundle: "Hospitality Suite", date: "2026-07-07", status: "new", icon: "🏨", href: "/documents/hotel-bill" },
  { name: "Electricity Bill", category: "Utilities", bundle: "Utility Suite", date: "2026-07-07", status: "new", icon: "⚡", href: "/documents/electricity-bill" },
  { name: "Service Invoice", category: "Services", bundle: "Service Suite", date: "2026-07-07", status: "new", icon: "🔧", href: "/documents/service-invoice" },
  { name: "Freelancer Invoice", category: "Invoicing", bundle: "Freelancer Suite", date: "2026-07-07", status: "new", icon: "💻", href: "/documents/freelancer-invoice" },
  { name: "E-Way Bill", category: "GST", bundle: "GST Suite", date: "2026-07-07", status: "new", icon: "📦", href: "/documents/eway-bill" },
  { name: "E-Invoice", category: "GST", bundle: "GST Suite", date: "2026-07-07", status: "new", icon: "📄", href: "/documents/e-invoice" },
  { name: "Vehicle Expense Report", category: "Transport", bundle: "Transport Suite", date: "2026-08-01", status: "soon", icon: "🚗" },
  { name: "Travel Expense Report", category: "Transport", bundle: "Transport Suite", date: "2026-08-08", status: "soon", icon: "✈️" },
  { name: "GST Calculator", category: "Finance", bundle: "Finance Suite", date: "2026-08-15", status: "soon", icon: "🧮" },
  { name: "Purchase Order", category: "Procurement", bundle: "Procurement Suite", date: "2026-09-01", status: "soon", icon: "📝" },
  { name: "Delivery Challan", category: "Logistics", bundle: "GST Suite", date: "2026-09-15", status: "soon", icon: "📦" },
];

const formatDate = (d) => new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
const monthLabel = (d) => new Date(d).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

function groupByMonth(items) {
  const map = {};
  items.forEach((item) => {
    const key = monthLabel(item.date);
    if (!map[key]) map[key] = [];
    map[key].push(item);
  });
  return map;
}

import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function AboutPage() {
  const grouped = groupByMonth(ROADMAP);

  return (
    <>
    <Helmet>
      <title>About OpsTools — Free Business Document Tools for India</title>
      <meta name="description" content="OpsTools is a free toolkit for Indian small business operators to generate professional documents without sign-ups." />
      <meta property="og:title" content="About OpsTools — Free Business Document Tools for India" />
      <meta property="og:description" content="OpsTools is a free toolkit for Indian small business operators to generate professional documents without sign-ups." />
      <meta property="og:url" content="https://www.opstools.ai/about" />
      <link rel="canonical" href="https://www.opstools.ai/about" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
    <div className="max-w-[720px] mx-auto px-6 py-16">

      {/* Hero */}
      <div className="mb-14">
        <span className="inline-flex items-center px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-[12px] font-semibold rounded-full uppercase tracking-wider mb-5">About Us</span>
        <h1 className="text-[40px] font-bold text-[#0F172A] leading-tight mb-5">Tools built for people who just want to get things done</h1>
        <p className="text-[#64748B] text-[18px] leading-relaxed">OpsTools started with a simple frustration — why is it so hard to generate a basic fuel receipt or rent slip without downloading an app, signing up, or paying a subscription?</p>
      </div>

      {/* Mission */}
      <section id="mission" className="mb-14">
        <h2 className="text-[24px] font-semibold text-[#0F172A] mb-4">Our Mission</h2>
        <p className="text-[#64748B] text-[16px] leading-relaxed mb-4">We believe business operations tools should be free, fast, and require zero friction. No accounts. No ads. No bloat. Just open the tool and get what you need.</p>
        <p className="text-[#64748B] text-[16px] leading-relaxed">Every tool on OpsTools is built with small business owners, freelancers, and operators in mind — people who need to move fast and don't have time for complexity.</p>
      </section>

      {/* Values */}
      <section className="mb-14">
        <h2 className="text-[24px] font-semibold text-[#0F172A] mb-6">What we stand for</h2>
        <div className="space-y-5">
          {[
            { icon: "⚡", title: "Speed first", desc: "Every tool loads instantly and works without a login." },
            { icon: "🔓", title: "Free forever", desc: "Core tools will always be free. No bait-and-switch." },
            { icon: "🔒", title: "Privacy by default", desc: "We don't store your data. Everything stays in your browser." },
            { icon: "🛠️", title: "Built for operators", desc: "Designed for people running real businesses, not demos." },
          ].map(({ icon, title, desc }) => (
            <div key={title} className="flex gap-4 p-5 bg-[#F8FAFC] rounded-xl border border-[#E2E8F0]">
              <span className="text-2xl shrink-0">{icon}</span>
              <div>
                <p className="font-semibold text-[#0F172A] text-[15px] mb-1">{title}</p>
                <p className="text-[#64748B] text-[14px]">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Roadmap */}
      <section id="roadmap" className="mb-14">
        <div className="mb-8">
          <span className="inline-flex items-center px-3 py-1 bg-[#F0FDF4] text-[#16A34A] text-[12px] font-semibold rounded-full uppercase tracking-wider mb-3">Product Roadmap</span>
          <h2 className="text-[24px] font-semibold text-[#0F172A] mb-2">What's live & what's coming</h2>
          <p className="text-[#64748B] text-[15px]">Real ship dates — no vague timelines. Click any live tool to use it now.</p>
        </div>

        <div className="space-y-8">
          {Object.entries(grouped).map(([month, items]) => (
            <div key={month}>
              <div className="flex items-center gap-3 mb-4">
                <span style={{ fontSize: 13, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em" }}>{month}</span>
                <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
              </div>
              <div className="space-y-3">
                {items.map((item) => {
                  const isClickable = item.status === "live" || item.status === "new";
                  const card = (
                    <div className="flex items-center justify-between p-4 rounded-xl border" style={{
                      background: item.status === "live" ? "#F0FDF4" : item.status === "new" ? "#F0FFF4" : "#fff",
                      borderColor: item.status === "live" ? "#BBF7D0" : item.status === "new" ? "#6EE7B7" : "#E2E8F0",
                      cursor: isClickable ? "pointer" : "default",
                      transition: "box-shadow 0.15s",
                    }}
                      onMouseEnter={e => { if (isClickable) e.currentTarget.style.boxShadow = "0 4px 16px rgba(0,0,0,0.08)"; }}
                      onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}
                    >
                      <div className="flex items-center gap-3">
                        <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
                        <div>
                          <div className="flex items-center gap-2">
                            <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{item.name}</span>
                            {item.status === "live" && <span style={{ fontSize: 11, fontWeight: 700, color: "#16A34A", background: "#DCFCE7", padding: "2px 8px", borderRadius: 999 }}>LIVE</span>}
                            {item.status === "new" && <span style={{ fontSize: 11, fontWeight: 700, color: "#fff", background: "#10B981", padding: "2px 8px", borderRadius: 999 }}>NEW</span>}
                          </div>
                          <span style={{ fontSize: 12, color: "#94A3B8" }}>{item.category} · {item.bundle}</span>
                        </div>
                      </div>
                      <span style={{ fontSize: 12, color: item.status === "live" ? "#16A34A" : item.status === "new" ? "#059669" : "#64748B", fontWeight: 500, whiteSpace: "nowrap" }}>
                        {item.status === "live" ? "Available now" : item.status === "new" ? "Available now ↗" : formatDate(item.date)}
                      </span>
                    </div>
                  );
                  return isClickable && item.href
                    ? <Link key={item.name} to={item.href} style={{ textDecoration: "none", display: "block" }}>{card}</Link>
                    : <div key={item.name}>{card}</div>;
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Request a template */}
        <div style={{ background: "linear-gradient(135deg,#07011F,#1e1b4b)", borderRadius: 16, padding: "28px 32px", marginTop: 40, border: "1px solid rgba(255,255,255,0.08)" }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, color: "#fff", margin: "0 0 10px" }}>Don't see what you need?</h3>
          <p style={{ fontSize: 14, color: "#94A3B8", margin: "0 0 20px", lineHeight: 1.7 }}>
            Tell us which document you'd like us to build next. We read every request and prioritise based on demand.
          </p>
          <a href="mailto:hello@opstools.ai?subject=Template Request&body=Hi, I'd like OpsTools to build: "
            style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "linear-gradient(135deg,#2563EB,#4F46E5)", color: "#fff", padding: "11px 24px", borderRadius: 10, fontWeight: 600, fontSize: 14, textDecoration: "none" }}>
            ✉️ Write to us at hello@opstools.ai
          </a>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-[#0F172A] rounded-2xl p-8 text-center">
        <h2 className="text-[24px] font-semibold text-white mb-3">Get in touch</h2>
        <p className="text-[#94a3b8] text-[15px] mb-6">Have a tool idea? Found a bug? Want to contribute? We'd love to hear from you.</p>
        <a href="mailto:hello@opstools.ai" className="inline-flex items-center gap-2 h-11 px-6 bg-white text-[#0F172A] text-[14px] font-semibold rounded-xl hover:bg-[#F8FAFC] transition-colors duration-150">
          ✉️ hello@opstools.ai
        </a>
      </section>

    </div>
    </>
  );
}
