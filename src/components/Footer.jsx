import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="no-print" style={{ background: "#07011F", borderTop: "1px solid rgba(255,255,255,0.08)" }}>
      <div className="max-w-[1280px] mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="md:col-span-1">
          <div className="flex items-center gap-2.5 mb-4">
            <svg width="28" height="28" viewBox="0 0 32 32" fill="none">
              <rect width="32" height="32" rx="8" fill="url(#fLogoGrad)"/>
              <rect x="7" y="7" width="4" height="4" rx="1" fill="white"/>
              <rect x="14" y="7" width="4" height="4" rx="1" fill="white" opacity="0.7"/>
              <rect x="21" y="7" width="4" height="4" rx="1" fill="white" opacity="0.35"/>
              <rect x="7" y="14" width="4" height="4" rx="1" fill="white" opacity="0.7"/>
              <rect x="14" y="14" width="4" height="4" rx="1" fill="white"/>
              <rect x="21" y="14" width="4" height="4" rx="1" fill="white" opacity="0.7"/>
              <rect x="7" y="21" width="4" height="4" rx="1" fill="white" opacity="0.35"/>
              <rect x="14" y="21" width="4" height="4" rx="1" fill="white" opacity="0.7"/>
              <rect x="21" y="21" width="4" height="4" rx="1" fill="white"/>
              <defs>
                <linearGradient id="fLogoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#2563EB"/>
                  <stop offset="100%" stopColor="#4F46E5"/>
                </linearGradient>
              </defs>
            </svg>
            <span className="font-bold text-white text-[16px]">OpsTools</span>
          </div>
          <p className="text-white/40 text-[14px] leading-relaxed">
            Free tools to simplify your business operations. No sign-up required.
          </p>
        </div>

        {/* Tools */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-5">Tools</p>
          <ul className="space-y-3">
            <li><Link to="/documents/fuel-bill" className="text-white/50 text-[14px] hover:text-white transition-colors duration-150">Fuel Bill Generator</Link></li>
            <li><Link to="/documents/rent-receipt" className="text-white/50 text-[14px] hover:text-white transition-colors duration-150">Rent Receipt Generator</Link></li>
            <li><Link to="/roi" className="text-white/50 text-[14px] hover:text-white transition-colors duration-150">ROI Calculator</Link></li>
          </ul>
        </div>

        {/* Company */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-5">Company</p>
          <ul className="space-y-3">
            <li><Link to="/about" className="text-white/50 text-[14px] hover:text-white transition-colors duration-150">About Us</Link></li>
            <li><Link to="/about#mission" className="text-white/50 text-[14px] hover:text-white transition-colors duration-150">Our Mission</Link></li>
            <li><Link to="/about#contact" className="text-white/50 text-[14px] hover:text-white transition-colors duration-150">Contact</Link></li>
          </ul>
        </div>

        {/* Donate */}
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30 mb-5">Support Us</p>
          <p className="text-white/40 text-[14px] leading-relaxed mb-5">
            OpsTools is free for everyone. If it saves you time, buy us a coffee ☕
          </p>
          <a
            href="https://buymeacoffee.com"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 h-10 px-5 text-white text-[14px] font-semibold rounded-xl transition-opacity hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #F59E0B, #D97706)" }}
          >
            ☕ Donate
          </a>
        </div>
      </div>

      <div style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="max-w-[1280px] mx-auto px-6 py-5 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="text-white/25 text-[13px]">© {new Date().getFullYear()} OpsTools. All rights reserved.</p>
          <div className="flex items-center gap-5">
            <Link to="/privacy" className="text-white/25 text-[13px] hover:text-white/60 transition-colors">Privacy</Link>
            <Link to="/terms" className="text-white/25 text-[13px] hover:text-white/60 transition-colors">Terms</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
