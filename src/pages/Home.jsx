import { Link } from "react-router-dom";

// ─── Tool Data ───────────────────────────────────────────────────────────────

const categories = [
  {
    id: "documents",
    label: "Document Generator",
    description: "Print-ready documents in seconds — no templates to buy, no software to install.",
    tools: [
      {
        id: "fuel-bill",
        name: "Fuel Bill Generator",
        tagline: "IOCL, POS & thermal receipt formats",
        href: "/documents/fuel-bill",
        status: "live",
        icon: (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="5" y="3" width="14" height="19" rx="2" fill="#BFDBFE" />
            <rect x="8" y="7" width="8" height="1.5" rx="0.75" fill="#3B82F6" />
            <rect x="8" y="10.5" width="6" height="1.5" rx="0.75" fill="#3B82F6" />
            <rect x="8" y="14" width="8" height="1.5" rx="0.75" fill="#3B82F6" />
            <circle cx="20" cy="19" r="5" fill="#FDE68A" />
            <path d="M19 17.5l1.5 1.5-1.5 1.5" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M18 17.5v3" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" />
          </svg>
        ),
        accent: "#DBEAFE",
        accentText: "#1D4ED8",
      },
      {
        id: "rent-receipt",
        name: "Rent Receipt Generator",
        tagline: "HRA-compliant receipts for tenants",
        href: "/documents/rent-receipt",
        status: "soon",
        icon: (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="4" y="5" width="20" height="18" rx="2.5" fill="#D1FAE5" />
            <path d="M9 10h10M9 14h6" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M16 17l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ),
        accent: "#D1FAE5",
        accentText: "#065F46",
      },
      {
        id: "gst-invoice",
        name: "GST Invoice Generator",
        tagline: "Tax-compliant invoices with GSTIN",
        href: "#",
        status: "soon",
        icon: (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="4" y="3" width="20" height="22" rx="2.5" fill="#EDE9FE" />
            <rect x="7" y="7" width="14" height="2" rx="1" fill="#7C3AED" />
            <rect x="7" y="11" width="9" height="1.5" rx="0.75" fill="#A78BFA" />
            <rect x="7" y="14" width="11" height="1.5" rx="0.75" fill="#A78BFA" />
            <rect x="7" y="17" width="7" height="1.5" rx="0.75" fill="#A78BFA" />
            <rect x="15" y="20" width="6" height="2" rx="1" fill="#7C3AED" />
          </svg>
        ),
        accent: "#EDE9FE",
        accentText: "#5B21B6",
      },
      {
        id: "salary-slip",
        name: "Salary Slip Generator",
        tagline: "Professional payslips with deductions",
        href: "#",
        status: "soon",
        icon: (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="3" y="6" width="22" height="16" rx="2.5" fill="#FCE7F3" />
            <circle cx="10" cy="14" r="4" fill="#FBCFE8" />
            <path d="M9 14h2M10 13v2" stroke="#DB2777" strokeWidth="1.3" strokeLinecap="round" />
            <rect x="16" y="11" width="6" height="1.5" rx="0.75" fill="#F9A8D4" />
            <rect x="16" y="14" width="4" height="1.5" rx="0.75" fill="#F9A8D4" />
          </svg>
        ),
        accent: "#FCE7F3",
        accentText: "#9D174D",
      },
    ],
  },
  {
    id: "calculators",
    label: "Business Calculators",
    description: "Quick math for decisions you make every day — margins, ROI, taxes, and more.",
    tools: [
      {
        id: "roi-calculator",
        name: "ROI Calculator",
        tagline: "Measure returns on any investment",
        href: "#",
        status: "soon",
        icon: (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="3" y="3" width="22" height="22" rx="3" fill="#FEF3C7" />
            <path d="M7 18l4-5 4 3 5-7" stroke="#D97706" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="21" cy="9" r="2" fill="#F59E0B" />
          </svg>
        ),
        accent: "#FEF3C7",
        accentText: "#92400E",
      },
      {
        id: "gst-calculator",
        name: "GST Calculator",
        tagline: "Split or add GST in one click",
        href: "#",
        status: "soon",
        icon: (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect x="3" y="3" width="22" height="22" rx="3" fill="#CFFAFE" />
            <text x="14" y="18" textAnchor="middle" fill="#0891B2" fontSize="11" fontWeight="700" fontFamily="monospace">%</text>
          </svg>
        ),
        accent: "#CFFAFE",
        accentText: "#164E63",
      },
    ],
  },
];

// ─── Stats ────────────────────────────────────────────────────────────────────

const stats = [
  { value: "100%", label: "Free forever" },
  { value: "0", label: "Sign-ups needed" },
  { value: "4", label: "Bill templates" },
  { value: "∞", label: "Documents generated" },
];

// ─── Component ────────────────────────────────────────────────────────────────

export default function Home() {
  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>

      {/* ── Hero ── */}
      <section
        style={{
          background: "linear-gradient(160deg, #07011F 0%, #0D0630 55%, #1e1b4b 100%)",
          padding: "80px 24px 72px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 680, margin: "0 auto" }}>
          {/* Eyebrow */}
          <span
            style={{
              display: "inline-block",
              background: "rgba(99,102,241,0.18)",
              border: "1px solid rgba(99,102,241,0.35)",
              color: "#A5B4FC",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              padding: "4px 14px",
              borderRadius: 999,
              marginBottom: 28,
            }}
          >
            Free tools for Indian businesses
          </span>

          <h1
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 800,
              color: "#FFFFFF",
              lineHeight: 1.15,
              margin: "0 0 20px",
              letterSpacing: "-0.02em",
            }}
          >
            Professional documents,{" "}
            <span
              style={{
                background: "linear-gradient(90deg, #60A5FA, #818CF8)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              ready in seconds
            </span>
          </h1>

          <p
            style={{
              fontSize: 18,
              color: "#94A3B8",
              lineHeight: 1.7,
              margin: "0 0 40px",
              maxWidth: 520,
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Fuel bills, rent receipts, GST invoices — generated, filled, and printed without a single login or rupee spent.
          </p>

          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <Link
              to="/documents/fuel-bill"
              style={{
                background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)",
                color: "#fff",
                padding: "13px 28px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 15,
                textDecoration: "none",
                display: "inline-block",
                boxShadow: "0 4px 20px rgba(79,70,229,0.4)",
              }}
            >
              Generate a fuel bill →
            </Link>
            <a
              href="#tools"
              style={{
                background: "rgba(255,255,255,0.07)",
                border: "1px solid rgba(255,255,255,0.15)",
                color: "#CBD5E1",
                padding: "13px 28px",
                borderRadius: 10,
                fontWeight: 500,
                fontSize: 15,
                textDecoration: "none",
                display: "inline-block",
              }}
            >
              Browse all tools
            </a>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section
        style={{
          background: "#07011F",
          borderBottom: "1px solid rgba(255,255,255,0.07)",
          padding: "20px 24px",
        }}
      >
        <div
          style={{
            maxWidth: 900,
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 8,
          }}
        >
          {stats.map((s) => (
            <div key={s.label} style={{ textAlign: "center", padding: "8px 0" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: "#E0E7FF", lineHeight: 1 }}>
                {s.value}
              </div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 4, fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Tools by category ── */}
      <section id="tools" style={{ padding: "72px 24px", maxWidth: 960, margin: "0 auto" }}>

        {categories.map((cat, ci) => (
          <div key={cat.id} style={{ marginBottom: ci < categories.length - 1 ? 64 : 0 }}>

            {/* Category header */}
            <div style={{ marginBottom: 28 }}>
              <h2
                style={{
                  fontSize: 22,
                  fontWeight: 700,
                  color: "#0F172A",
                  margin: "0 0 6px",
                  letterSpacing: "-0.01em",
                }}
              >
                {cat.label}
              </h2>
              <p style={{ fontSize: 14, color: "#64748B", margin: 0, lineHeight: 1.6 }}>
                {cat.description}
              </p>
            </div>

            {/* Tool cards */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))",
                gap: 16,
              }}
            >
              {cat.tools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          </div>
        ))}
      </section>

      {/* ── Why OpsTools ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #07011F 0%, #0D0630 100%)",
          padding: "72px 24px",
          textAlign: "center",
        }}
      >
        <div style={{ maxWidth: 720, margin: "0 auto" }}>
          <h2
            style={{
              fontSize: 28,
              fontWeight: 700,
              color: "#fff",
              margin: "0 0 16px",
              letterSpacing: "-0.02em",
            }}
          >
            Built for the operator, not the accountant
          </h2>
          <p style={{ fontSize: 16, color: "#94A3B8", lineHeight: 1.75, margin: "0 0 48px" }}>
            Most document tools are built for chartered accountants — complex, expensive, and full of fields you don't understand. OpsTools is different. Every tool here is designed for the person running the business, not auditing it.
          </p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: 24,
              textAlign: "left",
            }}
          >
            {[
              { icon: "⚡", title: "Instant", body: "Fill the form, hit print. No account, no waiting, no email verification." },
              { icon: "🔒", title: "Private", body: "Nothing is stored on our servers. Your data stays in your browser." },
              { icon: "📱", title: "Mobile-ready", body: "Works on any phone. Generate and share a PDF from anywhere." },
              { icon: "🇮🇳", title: "India-specific", body: "Templates based on actual Indian receipts and compliance formats." },
            ].map((f) => (
              <div
                key={f.title}
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.09)",
                  borderRadius: 14,
                  padding: "20px 18px",
                }}
              >
                <div style={{ fontSize: 24, marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontSize: 15, fontWeight: 600, color: "#E2E8F0", marginBottom: 6 }}>
                  {f.title}
                </div>
                <div style={{ fontSize: 13, color: "#64748B", lineHeight: 1.6 }}>{f.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

// ─── Tool Card ────────────────────────────────────────────────────────────────

function ToolCard({ tool }) {
  const isLive = tool.status === "live";

  const inner = (
    <div
      style={{
        background: "#fff",
        border: "1px solid #E2E8F0",
        borderRadius: 16,
        padding: "20px 18px",
        height: "100%",
        boxSizing: "border-box",
        transition: "box-shadow 0.2s, transform 0.2s",
        cursor: isLive ? "pointer" : "default",
        opacity: isLive ? 1 : 0.72,
        display: "flex",
        flexDirection: "column",
        gap: 12,
        position: "relative",
      }}
      onMouseEnter={(e) => {
        if (isLive) {
          e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.1)";
          e.currentTarget.style.transform = "translateY(-2px)";
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Icon bubble */}
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: tool.accent,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        {tool.icon}
      </div>

      <div style={{ flex: 1 }}>
        <div
          style={{
            fontSize: 15,
            fontWeight: 650,
            color: "#0F172A",
            marginBottom: 4,
            lineHeight: 1.3,
          }}
        >
          {tool.name}
        </div>
        <div style={{ fontSize: 12.5, color: "#64748B", lineHeight: 1.5 }}>
          {tool.tagline}
        </div>
      </div>

      {/* Status badge */}
      {isLive ? (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 5,
            fontSize: 11.5,
            fontWeight: 600,
            color: tool.accentText,
            background: tool.accent,
            padding: "3px 10px",
            borderRadius: 999,
            alignSelf: "flex-start",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: tool.accentText,
              display: "inline-block",
            }}
          />
          Live
        </div>
      ) : (
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            fontSize: 11.5,
            fontWeight: 600,
            color: "#94A3B8",
            background: "#F1F5F9",
            padding: "3px 10px",
            borderRadius: 999,
            alignSelf: "flex-start",
          }}
        >
          Coming soon
        </div>
      )}
    </div>
  );

  return isLive ? (
    <Link to={tool.href} style={{ textDecoration: "none", display: "block" }}>
      {inner}
    </Link>
  ) : (
    <div>{inner}</div>
  );
}
