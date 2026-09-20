import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { cloneElement } from "react";
import { ALL_BLOGS, BLOG_ICONS } from "../data/blogPosts";

// Flat-lay style thumbnail — two overlapping "paper" cards with shadow and a
// slight rotation, on a soft neutral backdrop. Reads as a photographed
// document mockup rather than a flat vector badge, without needing an
// actual photo asset.
function CardIllustration({ blog }) {
  const icon = BLOG_ICONS[blog.docIcon];
  return (
    <div style={{
      height: 168,
      background: "linear-gradient(160deg, #EEF1F5 0%, #DDE3EA 100%)",
      position: "relative", overflow: "hidden",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      {/* soft studio-light vignette */}
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 32% 22%, rgba(255,255,255,0.75), transparent 55%)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 75% 85%, rgba(15,23,42,0.06), transparent 60%)" }} />

      {/* back sheet, rotated behind */}
      <div style={{
        position: "absolute", width: 118, height: 148, background: "#fff", borderRadius: 7,
        transform: "rotate(-9deg) translate(20px, 4px)",
        boxShadow: "0 10px 24px rgba(15,23,42,0.12)",
        border: "1px solid rgba(15,23,42,0.05)",
      }} />

      {/* front sheet — the "document" */}
      <div style={{
        position: "relative", width: 126, height: 156, background: "#fff", borderRadius: 7,
        transform: "rotate(5deg)",
        boxShadow: "0 18px 34px rgba(15,23,42,0.20)",
        border: "1px solid rgba(15,23,42,0.06)",
        padding: "16px 14px", boxSizing: "border-box",
      }}>
        <div style={{ width: 34, height: 4, borderRadius: 2, background: blog.categoryColor, marginBottom: 12 }} />
        <div style={{ height: 5, width: "88%", background: "#E2E8F0", borderRadius: 2, marginBottom: 7 }} />
        <div style={{ height: 5, width: "72%", background: "#E2E8F0", borderRadius: 2, marginBottom: 7 }} />
        <div style={{ height: 5, width: "80%", background: "#E2E8F0", borderRadius: 2, marginBottom: 14 }} />
        <div style={{
          width: 36, height: 36, borderRadius: 10, background: icon.bg,
          display: "flex", alignItems: "center", justifyContent: "center",
          boxShadow: "0 4px 10px rgba(15,23,42,0.10)",
        }}>
          {cloneElement(icon.svg, { width: 20, height: 20 })}
        </div>
      </div>
    </div>
  );
}

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
        <CardIllustration blog={blog} />

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
          {/* ALL_BLOGS is in publish order (oldest first) — reverse so newest shows first */}
          {[...ALL_BLOGS].reverse().map(blog => <BlogCard key={blog.slug} blog={blog} />)}
        </div>
      </div>
    </div>
    </>
  );
}
