import { Link } from "react-router-dom";

export const ALL_BLOGS = [
  {
    slug: "how-to-generate-fuel-bill-online-india",
    title: "How to Generate a Fuel Bill Online for Free in India (2026)",
    excerpt: "A complete guide to generating petrol and diesel receipts online — for reimbursement, HRA claims, and fleet management. No login needed.",
    date: "June 20, 2026",
    readTime: "7 min read",
    category: "Guide",
    categoryColor: "#2563EB",
    categoryBg: "#EFF6FF",
    icon: "⛽",
    gradientFrom: "#1e3a8a",
    gradientTo: "#312e81",
    tool: { name: "Try Fuel Bill Generator →", href: "/documents/fuel-bill" },
  },
];

function BlogCard({ blog, featured }) {
  return (
    <Link to={`/blogs/${blog.slug}`} style={{ textDecoration: "none", display: "block" }}>
      <article style={{
        background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0",
        overflow: "hidden", transition: "box-shadow 0.18s, transform 0.18s",
        height: "100%",
      }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 8px 32px rgba(0,0,0,0.1)"; e.currentTarget.style.transform = "translateY(-2px)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "translateY(0)"; }}
      >
        {/* Illustration */}
        <div style={{
          height: featured ? 240 : 160,
          background: `linear-gradient(160deg, ${blog.gradientFrom}, ${blog.gradientTo})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 30% 50%, rgba(37,99,235,0.15), transparent 60%), radial-gradient(circle at 70% 60%, rgba(79,70,229,0.15), transparent 60%)" }} />
          {/* Inline SVG receipt illustration */}
          <svg width={featured ? 280 : 180} height={featured ? 140 : 90} viewBox="0 0 280 140" fill="none" style={{ position: "relative", zIndex: 1 }}>
            <rect x="60" y="10" width="160" height="120" rx="8" fill="white" opacity="0.07" stroke="rgba(255,255,255,0.12)" strokeWidth="1" />
            <rect x="74" y="22" width="60" height="6" rx="3" fill="#2563EB" opacity="0.6" />
            <rect x="74" y="34" width="100" height="4" rx="2" fill="rgba(255,255,255,0.15)" />
            {[0,1,2,3,4].map(i => (
              <g key={i}>
                <rect x="74" y={48 + i * 14} width={40 + (i % 3) * 16} height="3" rx="1.5" fill="rgba(255,255,255,0.1)" />
                <rect x={188} y={48 + i * 14} width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.15)" />
              </g>
            ))}
            <rect x="74" y="120" width="132" height="3" rx="1.5" fill="rgba(37,99,235,0.4)" />
            <text x="140" y="134" textAnchor="middle" fill="rgba(255,255,255,0.35)" fontSize="8" fontWeight="600" letterSpacing="0.1em">{blog.category.toUpperCase()}</text>
          </svg>
        </div>

        {/* Content */}
        <div style={{ padding: featured ? "24px" : "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: blog.categoryColor, background: blog.categoryBg, padding: "2px 10px", borderRadius: 999 }}>
              {blog.category}
            </span>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>{blog.readTime}</span>
          </div>
          <h2 style={{ fontSize: featured ? 20 : 16, fontWeight: 700, color: "#0F172A", margin: "0 0 10px", lineHeight: 1.35, letterSpacing: "-0.01em" }}>
            {blog.title}
          </h2>
          <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.65, margin: "0 0 16px" }}>
            {blog.excerpt}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>{blog.date}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#2563EB" }}>Read more →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogsPage() {
  const featured = ALL_BLOGS[0];
  const rest = ALL_BLOGS.slice(1);

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>

      {/* Hero */}
      <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0D0630 55%,#1e1b4b 100%)", padding: "72px 24px 64px", overflow: "hidden" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <nav style={{ marginBottom: 16, fontSize: 13, color: "#64748B" }}>
            <Link to="/" style={{ color: "#64748B", textDecoration: "none" }}>Home</Link>
            <span style={{ margin: "0 8px", color: "#334155" }}>›</span>
            <span style={{ color: "#94A3B8" }}>Blog</span>
          </nav>
          <h1 style={{ fontSize: "clamp(24px,3vw,36px)", fontWeight: 800, color: "#fff", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            OpsTools Blog
          </h1>
          <p style={{ fontSize: 15, color: "#94A3B8", margin: 0, maxWidth: 520, lineHeight: 1.7 }}>
            Guides, tips, and resources for Indian small business operators — documents, reimbursements, and more.
          </p>
        </div>
      </section>

      {/* Blog grid */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "48px 24px 80px" }}>

        {/* Featured */}
        {featured && (
          <div style={{ marginBottom: 40 }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>Featured</p>
            <BlogCard blog={featured} featured={true} />
          </div>
        )}

        {/* Rest */}
        {rest.length > 0 && (
          <div>
            <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: 16 }}>All Posts</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
              {rest.map(blog => <BlogCard key={blog.slug} blog={blog} />)}
            </div>
          </div>
        )}

        {/* Empty state if only 1 blog */}
        {rest.length === 0 && (
          <div style={{ textAlign: "center", padding: "40px 0", color: "#94A3B8" }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>✍️</div>
            <p style={{ fontSize: 14 }}>More guides coming soon — GST invoices, salary slips, rent receipts and more.</p>
          </div>
        )}
      </div>
    </div>
  );
}
