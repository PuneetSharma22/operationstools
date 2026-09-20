import { Link } from "react-router-dom";
import { cloneElement } from "react";
import { ALL_BLOGS, BLOG_ICONS } from "../../data/blogPosts";

// Right-rail on every blog post: the single latest guide featured up top,
// then a handful of other recent ones — so a reader can keep going without
// scrolling back to /blogs. Excludes whichever post is currently open.
export default function BlogSidebar({ currentSlug }) {
  const others = [...ALL_BLOGS].reverse().filter((b) => b.slug !== currentSlug);
  const latest = others[0];
  const more = others.slice(1, 6);

  if (!latest) return null;

  return (
    <div>
      <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>Latest guide</p>
      <Link
        to={`/blogs/${latest.slug}`}
        style={{ textDecoration: "none", display: "block", background: "#fff", border: "1px solid #E2E8F0", borderRadius: 14, overflow: "hidden", marginBottom: 28, transition: "box-shadow 0.15s" }}
        onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 10px 28px rgba(0,0,0,0.08)"; }}
        onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; }}
      >
        <div style={{ height: 88, background: `linear-gradient(160deg, ${latest.gradientFrom}, ${latest.gradientTo})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: 44, height: 44, borderRadius: 11, background: BLOG_ICONS[latest.docIcon].bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
            {cloneElement(BLOG_ICONS[latest.docIcon].svg, { width: 24, height: 24 })}
          </div>
        </div>
        <div style={{ padding: "14px 16px" }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: "#0F172A", lineHeight: 1.4, marginBottom: 6 }}>{latest.title}</div>
          <div style={{ fontSize: 11, color: "#94A3B8" }}>{latest.readTime}</div>
        </div>
      </Link>

      {more.length > 0 && (
        <>
          <p style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>More guides</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 2, marginBottom: 20 }}>
            {more.map((b) => (
              <Link
                key={b.slug}
                to={`/blogs/${b.slug}`}
                style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 8px", borderRadius: 10, textDecoration: "none" }}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#F8FAFC"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 9, flexShrink: 0, background: BLOG_ICONS[b.docIcon].bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {cloneElement(BLOG_ICONS[b.docIcon].svg, { width: 17, height: 17 })}
                </div>
                <span style={{ fontSize: 12.5, fontWeight: 600, color: "#334155", lineHeight: 1.4 }}>{b.title}</span>
              </Link>
            ))}
          </div>
        </>
      )}

      <Link to="/blogs" style={{ display: "block", textAlign: "center", fontSize: 13, fontWeight: 600, color: "#2563EB", textDecoration: "none" }}>
        View all guides →
      </Link>
    </div>
  );
}
