import { Link, useLocation, Outlet } from "react-router-dom";

const DOC_TOOLS = [
  { label: "Fuel Bill Generator", href: "/documents/fuel-bill", icon: "⛽" },
  { label: "Rent Receipt Generator", href: "/documents/rent-receipt", icon: "🏠" },
];

export default function DocumentsPage() {
  const location = useLocation();
  const isIndex = location.pathname === "/documents";

  return (
    <div>
      {/* Sub Header */}
      <div className="bg-white border-b border-[#E2E8F0] no-print">
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-center gap-1 h-12">
            <span className="text-[12px] font-semibold text-[#64748B] uppercase tracking-widest mr-3">Documents</span>
            <div className="w-px h-4 bg-[#E2E8F0] mr-3" />
            {DOC_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                to={tool.href}
                className={`flex items-center gap-2 px-4 h-8 rounded-lg text-[13px] font-medium transition-colors duration-150 ${
                  location.pathname === tool.href
                    ? "bg-[#EFF6FF] text-[#2563EB]"
                    : "text-[#64748B] hover:text-[#0F172A] hover:bg-[#F8FAFC]"
                }`}
              >
                <span>{tool.icon}</span>
                {tool.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Index: show tool cards */}
      {isIndex && (
        <div className="max-w-[1280px] mx-auto px-6 py-12">
          <h1 className="text-[32px] font-bold text-[#0F172A] mb-2">Document Generator</h1>
          <p className="text-[#64748B] text-[16px] mb-10">Choose a document type to get started.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl">
            {DOC_TOOLS.map((tool) => (
              <Link
                key={tool.href}
                to={tool.href}
                className="bg-white border border-[#E2E8F0] rounded-2xl p-6 hover:shadow-md transition-shadow duration-200 group"
              >
                <div className="text-3xl mb-4">{tool.icon}</div>
                <h3 className="text-[16px] font-semibold text-[#0F172A] mb-1">{tool.label}</h3>
                <span className="text-[#2563EB] text-[13px] font-medium group-hover:underline">Open →</span>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
