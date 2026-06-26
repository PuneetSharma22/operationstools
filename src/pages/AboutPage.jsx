const ROADMAP = [
  // Launched
  { name: "Fuel Bill Generator", category: "Transport", bundle: "Transport Suite", date: "2026-07-01", status: "live", icon: "⛽" },
  // Coming soon — grouped by week
  { name: "Invoice Generator", category: "Sales", bundle: "Invoice Suite", date: "2026-07-20", status: "soon", icon: "🧾" },
  { name: "Rent Receipt", category: "Housing", bundle: "Housing Suite", date: "2026-07-25", status: "soon", icon: "🏠" },
  { name: "Quotation Generator", category: "Sales", bundle: "Invoice Suite", date: "2026-07-27", status: "soon", icon: "📋" },
  { name: "Restaurant Bill", category: "Food", bundle: "Food Suite", date: "2026-08-08", status: "soon", icon: "🍽️" },
  { name: "Medical Bill", category: "Healthcare", bundle: "Healthcare Suite", date: "2026-08-15", status: "soon", icon: "🏥" },
  { name: "Salary Slip", category: "HR", bundle: "HR Suite", date: "2026-08-22", status: "soon", icon: "💼" },
  { name: "Service Invoice", category: "Services", bundle: "Service Suite", date: "2026-08-29", status: "soon", icon: "🔧" },
  { name: "E-Way Bill", category: "GST", bundle: "GST Suite", date: "2026-09-05", status: "soon", icon: "📦" },
  { name: "Freelancer Invoice", category: "Invoicing", bundle: "Freelancer Suite", date: "2026-09-19", status: "soon", icon: "💻" },
  { name: "Hotel Bill", category: "Hospitality", bundle: "Hospitality Suite", date: "2026-09-26", status: "soon", icon: "🏨" },
  { name: "Tax Invoice", category: "GST", bundle: "GST Suite", date: "2026-09-26", status: "soon", icon: "🧮" },
  { name: "E-Invoice", category: "GST", bundle: "GST Suite", date: "2026-09-26", status: "soon", icon: "📄" },
  { name: "Electricity Bill", category: "Utilities", bundle: "Utility Suite", date: "2026-09-26", status: "soon", icon: "⚡" },
];

const formatDate = (d) =>
  new Date(d).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

const monthLabel = (d) =>
  new Date(d).toLocaleDateString("en-IN", { month: "long", year: "numeric" });

// Group by month
function groupByMonth(items) {
  const map = {};
  items.forEach((item) => {
    const key = monthLabel(item.date);
    if (!map[key]) map[key] = [];
    map[key].push(item);
  });
  return map;
}

export default function AboutPage() {
  const grouped = groupByMonth(ROADMAP);

  return (
    <div className="max-w-[720px] mx-auto px-6 py-16">

      {/* Hero */}
      <div className="mb-14">
        <span className="inline-flex items-center px-3 py-1 bg-[#EFF6FF] text-[#2563EB] text-[12px] font-semibold rounded-full uppercase tracking-wider mb-5">
          About Us
        </span>
        <h1 className="text-[40px] font-bold text-[#0F172A] leading-tight mb-5">
          Tools built for people who just want to get things done
        </h1>
        <p className="text-[#64748B] text-[18px] leading-relaxed">
          OpsTools started with a simple frustration — why is it so hard to generate a basic fuel receipt or rent slip without downloading an app, signing up, or paying a subscription?
        </p>
      </div>

      {/* Mission */}
      <section id="mission" className="mb-14">
        <h2 className="text-[24px] font-semibold text-[#0F172A] mb-4">Our Mission</h2>
        <p className="text-[#64748B] text-[16px] leading-relaxed mb-4">
          We believe business operations tools should be free, fast, and require zero friction. No accounts. No ads. No bloat. Just open the tool and get what you need.
        </p>
        <p className="text-[#64748B] text-[16px] leading-relaxed">
          Every tool on OpsTools is built with small business owners, freelancers, and operators in mind — people who need to move fast and don't have time for complexity.
        </p>
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
          <span className="inline-flex items-center px-3 py-1 bg-[#F0FDF4] text-[#16A34A] text-[12px] font-semibold rounded-full uppercase tracking-wider mb-3">
            Product Roadmap
          </span>
          <h2 className="text-[24px] font-semibold text-[#0F172A] mb-2">What's coming next</h2>
          <p className="text-[#64748B] text-[15px]">
            Every tool below is scheduled and in development. Dates are target go-live dates.
          </p>
        </div>

        <div className="space-y-8">
          {Object.entries(grouped).map(([month, items]) => (
            <div key={month}>
              {/* Month header */}
              <div className="flex items-center gap-3 mb-4">
                <span style={{ fontSize: 13, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                  {month}
                </span>
                <div style={{ flex: 1, height: 1, background: "#E2E8F0" }} />
              </div>

              {/* Items */}
              <div className="space-y-3">
                {items.map((item) => (
                  <div
                    key={item.name}
                    className="flex items-center justify-between p-4 rounded-xl border"
                    style={{
                      background: item.status === "live" ? "#F0FDF4" : "#fff",
                      borderColor: item.status === "live" ? "#BBF7D0" : "#E2E8F0",
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <span style={{ fontSize: 20, lineHeight: 1 }}>{item.icon}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span style={{ fontSize: 14, fontWeight: 600, color: "#0F172A" }}>{item.name}</span>
                          {item.status === "live" && (
                            <span style={{ fontSize: 11, fontWeight: 700, color: "#16A34A", background: "#DCFCE7", padding: "2px 8px", borderRadius: 999, letterSpacing: "0.05em" }}>
                              LIVE
                            </span>
                          )}
                        </div>
                        <span style={{ fontSize: 12, color: "#94A3B8" }}>{item.category} · {item.bundle}</span>
                      </div>
                    </div>
                    <span style={{ fontSize: 12, color: item.status === "live" ? "#16A34A" : "#64748B", fontWeight: 500, whiteSpace: "nowrap" }}>
                      {item.status === "live" ? "Available now" : formatDate(item.date)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="bg-[#0F172A] rounded-2xl p-8 text-center">
        <h2 className="text-[24px] font-semibold text-white mb-3">Get in touch</h2>
        <p className="text-[#94a3b8] text-[15px] mb-6">
          Have a tool idea? Found a bug? Want to contribute? We'd love to hear from you.
        </p>
        <a
          href="mailto:hello@opstools.in"
          className="inline-flex items-center gap-2 h-11 px-6 bg-white text-[#0F172A] text-[14px] font-semibold rounded-xl hover:bg-[#F8FAFC] transition-colors duration-150"
        >
          ✉️ hello@opstools.in
        </a>
      </section>

    </div>
  );
}
