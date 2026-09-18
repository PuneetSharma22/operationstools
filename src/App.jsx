import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
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
const AdminPage = lazy(() => import("./pages/AdminPage"));
const EmailVerifiedPage = lazy(() => import("./pages/EmailVerifiedPage"));
const BlogsPage = lazy(() => import("./pages/BlogsPage"));
const FuelBillBlog = lazy(() => import("./pages/blogs/FuelBillBlog"));
const LDBillBlog = lazy(() => import("./pages/blogs/LDBillBlog"));
const GSTInvoiceBlog = lazy(() => import("./pages/blogs/GSTInvoiceBlog"));
const SalarySlipBlog = lazy(() => import("./pages/blogs/SalarySlipBlog"));
const RentReceiptBlog = lazy(() => import("./pages/blogs/RentReceiptBlog"));
const LDBillPage = lazy(() => import("./pages/documents/LDBillPage"));
const GSTInvoicePage = lazy(() => import("./pages/documents/GSTInvoicePage"));
const SalarySlipPage = lazy(() => import("./pages/documents/SalarySlipPage"));
const InvoiceGeneratorPage = lazy(() => import("./pages/documents/InvoiceGeneratorPage"));
const QuotationGeneratorPage = lazy(() => import("./pages/documents/QuotationGeneratorPage"));
const RestaurantBillPage = lazy(() => import("./pages/documents/RestaurantBillPage"));
const MedicalBillPage = lazy(() => import("./pages/documents/MedicalBillPage"));
const FreelancerInvoicePage = lazy(() => import("./pages/documents/FreelancerInvoicePage"));
const HotelBillPage = lazy(() => import("./pages/documents/HotelBillPage"));
const ServiceInvoicePage = lazy(() => import("./pages/documents/ServiceInvoicePage"));
const EWayBillPage = lazy(() => import("./pages/documents/EWayBillPage"));
const ElectricityBillPage = lazy(() => import("./pages/documents/ElectricityBillPage"));
const EInvoicePage = lazy(() => import("./pages/documents/EInvoicePage"));
const VehicleExpensePage = lazy(() => import("./pages/documents/VehicleExpensePage"));
const TravelExpensePage = lazy(() => import("./pages/documents/TravelExpensePage"));
const BookInvoicePage = lazy(() => import("./pages/documents/BookInvoicePage"));
const MobileBillPage = lazy(() => import("./pages/documents/MobileBillPage"));
const GSTCalculatorPage = lazy(() => import("./pages/business/GSTCalculatorPage"));
const ROICalculatorPage = lazy(() => import("./pages/business/ROICalculatorPage"));

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => { window.scrollTo(0, 0); }, [pathname]);
  return null;
}

function PageLoader() {
  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
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
          <main className="flex-1" style={{ minHeight: "calc(100vh - 64px)" }}>
            <Suspense fallback={<PageLoader />}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/documents" element={<DocumentsPage />} />
                <Route path="/documents/fuel-bill" element={<FuelBillPage />} />
                <Route path="/documents/rent-receipt" element={<RentReceiptPage />} />
                <Route path="/documents/ld-bill" element={<LDBillPage />} />
                <Route path="/documents/gst-invoice" element={<GSTInvoicePage />} />
                <Route path="/documents/salary-slip" element={<SalarySlipPage />} />
                <Route path="/documents/invoice" element={<InvoiceGeneratorPage />} />
                <Route path="/documents/quotation" element={<QuotationGeneratorPage />} />
                <Route path="/documents/restaurant-bill" element={<RestaurantBillPage />} />
                <Route path="/documents/medical-bill" element={<MedicalBillPage />} />
                <Route path="/documents/freelancer-invoice" element={<FreelancerInvoicePage />} />
                <Route path="/documents/hotel-bill" element={<HotelBillPage />} />
                <Route path="/documents/service-invoice" element={<ServiceInvoicePage />} />
                <Route path="/documents/eway-bill" element={<EWayBillPage />} />
                <Route path="/documents/electricity-bill" element={<ElectricityBillPage />} />
                <Route path="/documents/e-invoice" element={<EInvoicePage />} />
                <Route path="/documents/vehicle-expense" element={<VehicleExpensePage />} />
                <Route path="/documents/travel-expense" element={<TravelExpensePage />} />
                <Route path="/documents/book-invoice" element={<BookInvoicePage />} />
                <Route path="/documents/mobile-bill" element={<MobileBillPage />} />
                <Route path="/business/gst-calculator" element={<GSTCalculatorPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/account" element={<AccountPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/verified" element={<EmailVerifiedPage />} />
                <Route path="/business/roi-calculator" element={<ROICalculatorPage />} />
                <Route path="/blogs" element={<BlogsPage />} />
                <Route path="/blogs/how-to-generate-fuel-bill-online-india" element={<FuelBillBlog />} />
                <Route path="/blogs/how-to-generate-ld-bill-online-india" element={<LDBillBlog />} />
                <Route path="/blogs/how-to-generate-gst-invoice-online-india" element={<GSTInvoiceBlog />} />
                <Route path="/blogs/how-to-generate-salary-slip-online-india" element={<SalarySlipBlog />} />
                <Route path="/blogs/how-to-generate-rent-receipt-online-india" element={<RentReceiptBlog />} />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
