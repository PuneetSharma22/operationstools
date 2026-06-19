import { Link } from "react-router-dom";

const TOOLS = [
  {
    icon: "⛽",
    title: "Fuel Bill Generator",
    description: "Generate GST-compliant fuel receipts instantly. Fill in details and print or save as PDF.",
    href: "/documents/fuel-bill",
    category: "Document",
  },
  {
    icon: "🏠",
    title: "Rent Receipt Generator",
    description: "Create professional rent receipts for landlords and tenants in seconds.",
    href: "/documents/rent-receipt",
    category: "Document",
  },
  {
    icon: "📊",
    title: "ROI Calculator",
    description: "Calculate return on investment for any business decision quickly and accurately.",
    href: "/roi",
    category: "Calculator",
    soon: true,
  },
];

export default function Home() {
  return (
    <div>
      {/* Hero — dark */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(160deg, #07011F 0%, #0D0630 60%, #0a0a1a 100%)" }}>
        {/* Glow blobs */}
        <div className="absolute top-[-80px] left-[20%] w-[500px] h-[500px] rounded-full opacity-20 blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, #2563EB, transparent 70%)" }} />
        <div className="absolute top-[40px] right-[10%] w-[300px] h-[300px] rounded-full opacity-15 blur-[100px] pointer-events-none" style={{ background: "radial-gradient(circle, #4F46E5, transparent 70%)" }} />

        <div className="relative max-w-[1280px] mx-auto px-6 py-24 md:py-32">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/8 border border-white/15 rounded-full mb-8">
            <div className="w-1.5 h-1.5 bg-[#2563EB] rounded-full" />
            <span className="text-[12px] font-semibold text-white/70 uppercase tracking-wider">Free Business Tools</span>
          </div>

          <h1 className="text-[52px] md:text-[64px] font-bold text-white leading-[1.1] tracking-tight max-w-3xl mb-6">
            Run your operations{" "}
            <span className="text-transparent bg-clip-text" style={{ backgroundImage: "linear-gradient(90deg, #528FF0, #818CF8)" }}>
              smarter
            </span>
          </h1>

          <p className="text-white/50 text-[18px] max-w-xl leading-relaxed mb-10">
            Free tools for invoices, receipts, and calculations. No sign-up needed. Just open and use.
          </p>

          <div className="flex items-center gap-4">
            <Link
              to="/documents"
              className="inline-flex items-center justify-center h-12 px-7 text-[15px] font-semibold text-white rounded-xl transition-all duration-150 hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)" }}
            >
              Browse Tools
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center justify-center h-12 px-7 text-[15px] font-semibold text-white/70 hover:text-white bg-white/8 hover:bg-white/12 border border-white/10 rounded-xl transition-all duration-150"
            >
              Learn More
            </Link>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-8 mt-16 pt-10 border-t border-white/8">
            {[
              { value: "100%", label: "Free forever" },
              { value: "0", label: "Sign-ups needed" },
              { value: "3+", label: "Tools available" },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-[28px] font-bold text-white leading-none">{value}</p>
                <p className="text-[13px] text-white/40 mt-1">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tools */}
      <section className="bg-[#F8FAFC]">
        <div className="max-w-[1280px] mx-auto px-6 py-20">
          <div className="mb-12">
            <p className="text-[12px] font-semibold uppercase tracking-widest text-[#64748B] mb-3">All Tools</p>
            <h2 className="text-[32px] font-bold text-[#0F172A]">Everything you need, nothing you don't</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {TOOLS.map((tool) => (
              <div key={tool.title} className="relative bg-white border border-[#E2E8F0] rounded-2xl p-7 hover:shadow-lg hover:border-[#2563EB]/30 transition-all duration-200 group">
                {tool.soon && (
                  <span className="absolute top-5 right-5 text-[11px] font-semibold bg-[#F1F5F9] text-[#64748B] px-2.5 py-1 rounded-full">Coming soon</span>
                )}
                <div className="w-12 h-12 bg-[#EFF6FF] rounded-xl flex items-center justify-center text-2xl mb-5">{tool.icon}</div>
                <p className="text-[11px] font-semibold text-[#2563EB] uppercase tracking-wider mb-2">{tool.category}</p>
                <h3 className="text-[18px] font-semibold text-[#0F172A] mb-2">{tool.title}</h3>
                <p className="text-[#64748B] text-[14px] leading-relaxed mb-6">{tool.description}</p>
                {!tool.soon ? (
                  <Link
                    to={tool.href}
                    className="inline-flex items-center gap-1.5 text-[#2563EB] text-[14px] font-semibold group-hover:gap-2.5 transition-all duration-150"
                  >
                    Open tool
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                  </Link>
                ) : (
                  <span className="text-[#94a3b8] text-[14px]">Available soon</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative overflow-hidden" style={{ background: "linear-gradient(135deg, #07011F 0%, #0D0630 100%)" }}>
        <div className="absolute inset-0 opacity-20 blur-[80px] pointer-events-none" style={{ background: "radial-gradient(circle at 30% 50%, #2563EB, transparent 60%)" }} />
        <div className="relative max-w-[1280px] mx-auto px-6 py-20 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h2 className="text-[32px] font-bold text-white mb-3">Start using OpsTools today</h2>
            <p className="text-white/50 text-[16px]">Free. No account required. Takes 10 seconds.</p>
          </div>
          <Link
            to="/documents/fuel-bill"
            className="inline-flex items-center justify-center h-12 px-8 text-[15px] font-semibold text-white rounded-xl shrink-0 hover:opacity-90 transition-opacity"
            style={{ background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)" }}
          >
            Try Fuel Bill Generator →
          </Link>
        </div>
      </section>
    </div>
  );
}
