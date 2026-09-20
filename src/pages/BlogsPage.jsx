import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { cloneElement } from "react";

// Same pastel line-icon style used across Home/DocumentsPage/TopHeader —
// reused here (scaled up) instead of a generic document-wireframe mockup.
const BLOG_ICONS = {
  "fuel-bill": { bg: "#DBEAFE", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="5" y="3" width="14" height="19" rx="2" fill="#BFDBFE"/><rect x="8" y="7" width="8" height="1.5" rx="0.75" fill="#3B82F6"/><rect x="8" y="10.5" width="6" height="1.5" rx="0.75" fill="#3B82F6"/><rect x="8" y="14" width="8" height="1.5" rx="0.75" fill="#3B82F6"/><circle cx="20" cy="19" r="5" fill="#FDE68A"/><path d="M19 17.5l1.5 1.5-1.5 1.5" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M18 17.5v3" stroke="#D97706" strokeWidth="1.2" strokeLinecap="round"/></svg> },
  "ld-bill": { bg: "#EDE9FE", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#DDD6FE"/><path d="M8 10h12M8 14h8M8 18h10" stroke="#7C3AED" strokeWidth="1.5" strokeLinecap="round"/></svg> },
  "gst-invoice": { bg: "#EDE9FE", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="4" y="3" width="20" height="22" rx="2.5" fill="#DDD6FE"/><rect x="7" y="7" width="14" height="2" rx="1" fill="#7C3AED"/><rect x="7" y="11" width="9" height="1.5" rx="0.75" fill="#A78BFA"/><rect x="7" y="14" width="11" height="1.5" rx="0.75" fill="#A78BFA"/><rect x="7" y="17" width="7" height="1.5" rx="0.75" fill="#A78BFA"/><rect x="15" y="20" width="6" height="2" rx="1" fill="#7C3AED"/></svg> },
  "salary-slip": { bg: "#FCE7F3", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="3" y="6" width="22" height="16" rx="2.5" fill="#FBCFE8"/><circle cx="10" cy="14" r="4" fill="#F9A8D4"/><path d="M9 14h2M10 13v2" stroke="#DB2777" strokeWidth="1.3" strokeLinecap="round"/><rect x="16" y="11" width="6" height="1.5" rx="0.75" fill="#F9A8D4"/><rect x="16" y="14" width="4" height="1.5" rx="0.75" fill="#F9A8D4"/></svg> },
  "rent-receipt": { bg: "#D1FAE5", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="4" y="5" width="20" height="18" rx="2.5" fill="#A7F3D0"/><path d="M9 10h10M9 14h6" stroke="#059669" strokeWidth="1.5" strokeLinecap="round"/><path d="M16 17l2 2 4-4" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  "hotel-bill": { bg: "#DBEAFE", svg: <svg viewBox="0 0 28 28" fill="none"><rect x="3" y="3" width="22" height="22" rx="3" fill="#BFDBFE"/><rect x="7" y="12" width="6" height="10" rx="1" fill="#2563EB"/><rect x="15" y="12" width="6" height="10" rx="1" fill="#2563EB"/><rect x="5" y="10" width="18" height="3" rx="1" fill="#3B82F6"/><rect x="11" y="6" width="6" height="4" rx="1" fill="#60A5FA"/></svg> },
};

const ALL_BLOGS = [
  {
    slug: "how-to-generate-fuel-bill-online-india",
    title: "How to Generate a Fuel Bill Online for Free in India (2026)",
    excerpt: "A complete guide to generating petrol and diesel receipts online — for reimbursement, HRA claims, and fleet management. No login needed.",
    date: "June 20, 2026",
    author: "Prakash Jha",
    readTime: "7 min read",
    category: "Guide",
    categoryColor: "#2563EB",
    categoryBg: "#EFF6FF",
    docIcon: "fuel-bill",
    gradientFrom: "#1e3a8a",
    gradientTo: "#312e81",
    tool: { name: "Try Fuel Bill Generator →", href: "/documents/fuel-bill" },
  },
  {
    slug: "how-to-generate-ld-bill-online-india",
    title: "How to Generate an L&D Tax Invoice Online in India (2026)",
    excerpt: "A complete guide to generating professional tax invoices for training, courses, and learning & development expenses — with CGST/SGST and instant PDF.",
    date: "July 2, 2026",
    author: "Arijit Sawant",
    readTime: "6 min read",
    category: "Guide",
    categoryColor: "#7C3AED",
    categoryBg: "#F5F3FF",
    docIcon: "ld-bill",
    gradientFrom: "#1e1b4b",
    gradientTo: "#312e81",
    tool: { name: "Try L&D Bill Generator →", href: "/documents/ld-bill" },
  },
  {
    slug: "how-to-generate-gst-invoice-online-india",
    title: "How to Generate a GST Invoice Online in India for Free (2026)",
    excerpt: "Complete guide to GST-compliant tax invoices — CGST, SGST, IGST, HSN codes, mandatory fields, and instant PDF download. No login, no cost.",
    date: "July 9, 2026",
    author: "Prajay Bangar",
    readTime: "8 min read",
    category: "Guide",
    categoryColor: "#7C3AED",
    categoryBg: "#EDE9FE",
    docIcon: "gst-invoice",
    gradientFrom: "#1e1b4b",
    gradientTo: "#4c1d95",
    tool: { name: "Try GST Invoice Generator →", href: "/documents/gst-invoice" },
  },
  {
    slug: "how-to-generate-salary-slip-online-india",
    title: "How to Generate a Salary Slip Online in India for Free (2026)",
    excerpt: "Complete guide to salary slips — CTC structure, basic pay, HRA, PF, TDS, deductions and net pay. Generate a professional payslip instantly.",
    date: "July 16, 2026",
    author: "Gulnaaz",
    readTime: "7 min read",
    category: "Guide",
    categoryColor: "#DB2777",
    categoryBg: "#FCE7F3",
    docIcon: "salary-slip",
    gradientFrom: "#1a0a1e",
    gradientTo: "#3b0764",
    tool: { name: "Try Salary Slip Generator →", href: "/documents/salary-slip" },
  },
  {
    slug: "how-to-generate-rent-receipt-online-india",
    title: "How to Generate a Rent Receipt Online for HRA Exemption in India (2026)",
    excerpt: "Complete guide to rent receipts for HRA tax exemption — mandatory fields, landlord PAN requirement, monthly vs annual receipts, and free PDF.",
    date: "July 23, 2026",
    author: "Prakash Jha",
    readTime: "6 min read",
    category: "Guide",
    categoryColor: "#059669",
    categoryBg: "#D1FAE5",
    docIcon: "rent-receipt",
    gradientFrom: "#052e16",
    gradientTo: "#14532d",
    tool: { name: "Try Rent Receipt Generator →", href: "/documents/rent-receipt" },
  },
  {
    slug: "how-to-generate-hotel-bill-online-india",
    title: "How to Generate a Hotel Bill Online in India for Free (2026)",
    excerpt: "Complete guide to hotel bills — check-in/check-out dates, room and additional charges, GSTIN, CGST/SGST, and instant PDF download.",
    date: "August 20, 2026",
    author: "Arijit Sawant",
    readTime: "7 min read",
    category: "Guide",
    categoryColor: "#0284C7",
    categoryBg: "#E0F2FE",
    docIcon: "hotel-bill",
    gradientFrom: "#07011F",
    gradientTo: "#0c2340",
    tool: { name: "Try Hotel Bill Generator →", href: "/documents/hotel-bill" },
  },
];

function BlogCard({ blog }) {
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
          height: 160,
          background: `linear-gradient(160deg, ${blog.gradientFrom}, ${blog.gradientTo})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          position: "relative", overflow: "hidden",
        }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 25% 25%, rgba(255,255,255,0.16), transparent 55%), radial-gradient(circle at 78% 75%, rgba(255,255,255,0.10), transparent 55%)" }} />
          {/* Concentric rings for depth */}
          <div style={{ position: "absolute", width: 210, height: 210, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.08)" }} />
          <div style={{ position: "absolute", width: 150, height: 150, borderRadius: "50%", border: "1px solid rgba(255,255,255,0.12)" }} />
          {/* Floating accent dots */}
          <div style={{ position: "absolute", top: "22%", left: "20%", width: 7, height: 7, borderRadius: "50%", background: "rgba(255,255,255,0.4)" }} />
          <div style={{ position: "absolute", bottom: "26%", right: "22%", width: 6, height: 6, borderRadius: "50%", background: "rgba(255,255,255,0.28)" }} />
          <div style={{ position: "absolute", top: "32%", right: "24%", width: 5, height: 5, borderRadius: "50%", background: "rgba(255,255,255,0.32)" }} />
          {/* Icon badge — same pastel icon used for this doc type elsewhere on the site, scaled up */}
          <div style={{
            position: "relative", zIndex: 1,
            width: 80, height: 80, borderRadius: 22,
            background: BLOG_ICONS[blog.docIcon].bg,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 20px 40px -12px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.4)",
          }}>
            {cloneElement(BLOG_ICONS[blog.docIcon].svg, { width: 42, height: 42 })}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "18px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: blog.categoryColor, background: blog.categoryBg, padding: "2px 10px", borderRadius: 999 }}>
              {blog.category}
            </span>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>{blog.readTime}</span>
          </div>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: "#0F172A", margin: "0 0 10px", lineHeight: 1.35, letterSpacing: "-0.01em" }}>
            {blog.title}
          </h2>
          <p style={{ fontSize: 13, color: "#64748B", lineHeight: 1.65, margin: "0 0 16px" }}>
            {blog.excerpt}
          </p>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: 12, color: "#94A3B8" }}>{blog.author} · {blog.date}</span>
            <span style={{ fontSize: 13, fontWeight: 600, color: "#2563EB" }}>Read more →</span>
          </div>
        </div>
      </article>
    </Link>
  );
}

export default function BlogsPage() {
  return (
    <>
    <Helmet>
      <title>Blog — GST, Documents & Business Guides for India | OpsTools</title>
      <meta name="description" content="Practical guides for Indian small business owners on generating fuel bills, GST invoices, salary slips and more." />
      <meta property="og:title" content="Blog — GST, Documents & Business Guides for India | OpsTools" />
      <meta property="og:description" content="Practical guides for Indian small business owners on generating fuel bills, GST invoices, salary slips and more." />
      <meta property="og:url" content="https://www.opstools.ai/blogs" />
      <link rel="canonical" href="https://www.opstools.ai/blogs" />
      <meta property="og:type" content="website" />
      <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
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
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}>
          {ALL_BLOGS.map(blog => <BlogCard key={blog.slug} blog={blog} />)}
        </div>
      </div>
    </div>
    </>
  );
}
