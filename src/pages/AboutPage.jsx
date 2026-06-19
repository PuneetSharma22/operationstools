export default function AboutPage() {
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
