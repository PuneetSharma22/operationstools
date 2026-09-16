import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

export default function EmailVerifiedPage() {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    // Auto redirect to login after 5 seconds
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <Helmet>
        <title>Email Verified — OpsTools</title>
      </Helmet>

      <div style={{ maxWidth: 480, width: "100%", textAlign: "center" }}>
        {/* Success icon */}
        <div style={{ width: 80, height: 80, borderRadius: "50%", background: "linear-gradient(135deg,#D1FAE5,#A7F3D0)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 28px", boxShadow: "0 8px 32px rgba(5,150,105,0.2)" }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6L9 17l-5-5"/>
          </svg>
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 24, border: "1px solid #E2E8F0", padding: "40px 36px", boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#0F172A", margin: "0 0 12px", letterSpacing: "-0.02em" }}>
            Email verified! 🎉
          </h1>
          <p style={{ fontSize: 15, color: "#64748B", lineHeight: 1.7, margin: "0 0 32px" }}>
            Your OpsTools account is ready. Log in to access your document history, credit balance, and all 19 free tools.
          </p>

          {/* Tools preview */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 32 }}>
            {[
              { icon: "🧾", label: "GST Invoice", color: "#EDE9FE" },
              { icon: "💼", label: "Salary Slip", color: "#FCE7F3" },
              { icon: "⛽", label: "Fuel Bill", color: "#DBEAFE" },
              { icon: "🏠", label: "Rent Receipt", color: "#D1FAE5" },
            ].map(t => (
              <div key={t.label} style={{ background: t.color, borderRadius: 12, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
                <span style={{ fontSize: 20 }}>{t.icon}</span>
                <span style={{ fontSize: 13, fontWeight: 600, color: "#0F172A" }}>{t.label}</span>
              </div>
            ))}
          </div>

          {/* CTA */}
          <Link to="/login" style={{ display: "flex", alignItems: "center", justifyContent: "center", height: 48, borderRadius: 12, background: "linear-gradient(135deg,#2563EB,#4F46E5)", color: "#fff", fontSize: 15, fontWeight: 700, textDecoration: "none", marginBottom: 14 }}>
            Log in to your account →
          </Link>

          <p style={{ fontSize: 13, color: "#94A3B8", margin: 0 }}>
            Redirecting to login in {countdown}s...
          </p>
        </div>

        {/* Skip */}
        <div style={{ marginTop: 20 }}>
          <Link to="/documents" style={{ fontSize: 13, color: "#64748B", textDecoration: "none" }}>
            Or browse tools without logging in →
          </Link>
        </div>
      </div>
    </div>
  );
}
