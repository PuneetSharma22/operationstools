import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const NAV_ITEMS = [
  {
    label: "Document Generator",
    href: "/documents",
    dropdown: [
      { label: "Fuel Bill Generator", href: "/documents/fuel-bill", icon: "⛽" },
      { label: "Rent Receipt Generator", href: "/documents/rent-receipt", icon: "🏠" },
    ],
  },
  {
    label: "ROI Calculator",
    href: "/roi",
    dropdown: null,
  },
];

function OpsToolsLogo() {
  return (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect width="32" height="32" rx="8" fill="url(#logoGrad)"/>
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
        <linearGradient id="logoGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#2563EB"/>
          <stop offset="100%" stopColor="#4F46E5"/>
        </linearGradient>
      </defs>
    </svg>
  );
}

export default function TopHeader() {
  const [openMenu, setOpenMenu] = useState(null);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const location = useLocation();
  const { user, signOut } = useAuth();

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
  };

  return (
    <header className="bg-[#07011F] border-b border-white/10 sticky top-0 z-50 no-print">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center gap-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0" onClick={() => setOpenMenu(null)}>
          <OpsToolsLogo />
          <span className="font-bold text-white text-[16px] tracking-tight">OpsTools</span>
        </Link>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-1 flex-1">
          {NAV_ITEMS.map((item) => (
            <div key={item.label} className="relative">
              <button
                onClick={() => setOpenMenu(openMenu === item.label ? null : item.label)}
                className={`inline-flex items-center gap-1.5 px-4 h-9 rounded-lg text-[14px] font-medium leading-none transition-colors duration-150 ${
                  location.pathname.startsWith(item.href)
                    ? "text-white bg-white/10"
                    : "text-white/60 hover:text-white hover:bg-white/8"
                }`}
              >
                <span>{item.label}</span>
                {item.dropdown && (
                  <svg className={`w-3.5 h-3.5 shrink-0 transition-transform duration-150 ${openMenu === item.label ? "rotate-180" : ""}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="m6 9 6 6 6-6"/>
                  </svg>
                )}
              </button>

              {item.dropdown && openMenu === item.label && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-[#0D0630] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  {item.dropdown.map((sub) => (
                    <Link
                      key={sub.href}
                      to={sub.href}
                      onClick={() => setOpenMenu(null)}
                      className="flex items-center gap-3 px-4 py-3 text-[14px] text-white/70 hover:text-white hover:bg-white/8 transition-colors duration-150"
                    >
                      <span className="text-lg leading-none">{sub.icon}</span>
                      <span className="font-medium">{sub.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Right */}
        <div className="flex items-center gap-2 shrink-0 ml-auto">

          {user ? (
            /* Logged in state */
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="inline-flex items-center gap-2 px-3 h-9 bg-white/8 hover:bg-white/12 border border-white/10 rounded-xl transition-colors duration-150"
              >
                <div className="w-5 h-5 rounded-full bg-gradient-to-br from-[#2563EB] to-[#4F46E5] flex items-center justify-center text-white text-[10px] font-bold">
                  {user.email[0].toUpperCase()}
                </div>
                <span className="text-[13px] text-white/70 max-w-[120px] truncate">{user.email}</span>
                <svg className="w-3.5 h-3.5 text-white/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="m6 9 6 6 6-6"/></svg>
              </button>

              {showUserMenu && (
                <div className="absolute top-full right-0 mt-2 w-48 bg-[#0D0630] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-[11px] text-white/40 uppercase tracking-wider">Signed in as</p>
                    <p className="text-[13px] text-white/70 truncate mt-0.5">{user.email}</p>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center gap-2 px-4 py-3 text-[14px] text-red-400 hover:bg-white/8 transition-colors duration-150"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
                    Sign out
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Guest state */
            <>
              <div className="hidden sm:inline-flex items-center gap-1.5 px-3 h-8 bg-white/8 border border-white/10 rounded-lg">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                </svg>
                <span className="text-[12px] font-medium text-white/50 leading-none">Guest · 0 credits</span>
              </div>

              <div className="w-px h-5 bg-white/10 mx-1 hidden sm:block" />

              <Link
                to="/login"
                className="inline-flex items-center justify-center h-9 px-4 rounded-lg text-[14px] font-medium leading-none text-white/60 hover:text-white hover:bg-white/8 transition-colors duration-150"
              >
                Log in
              </Link>

              <Link
                to="/signup"
                className="inline-flex items-center justify-center h-9 px-5 text-[14px] font-semibold leading-none text-white rounded-xl transition-all duration-150 hover:opacity-90"
                style={{ background: "linear-gradient(135deg, #2563EB 0%, #4F46E5 100%)" }}
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>

      {(openMenu || showUserMenu) && (
        <div className="fixed inset-0 z-[-1]" onClick={() => { setOpenMenu(null); setShowUserMenu(false); }} />
      )}
    </header>
  );
}
