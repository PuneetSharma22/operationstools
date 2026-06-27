import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import TopHeader from "./components/TopHeader";
import Footer from "./components/Footer";
import { useEffect, lazy, Suspense } from "react";

const Home = lazy(() => import("./pages/Home"));
const DocumentsPage = lazy(() => import("./pages/DocumentsPage"));
const FuelBillPage = lazy(() => import("./pages/documents/FuelBillPage"));
const RentReceiptPage = lazy(() => import("./pages/documents/RentReceiptPage"));
const AboutPage = lazy(() => import("./pages/AboutPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const SignupPage = lazy(() => import("./pages/SignupPage"));
const AccountPage = lazy(() => import("./pages/AccountPage"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ width: 32, height: 32, borderRadius: "50%", border: "3px solid #E2E8F0", borderTopColor: "#2563EB", animation: "spin 0.7s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg) } }`}</style>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
          <TopHeader />
          <div className="flex-1">
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/documents/fuel-bill" element={<FuelBillPage />} />
                <Route path="/documents/rent-receipt" element={<RentReceiptPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/account" element={<AccountPage />} />
              </Routes>
            </Suspense>
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
