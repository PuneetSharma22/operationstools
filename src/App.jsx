import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import TopHeader from "./components/TopHeader";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import DocumentsPage from "./pages/DocumentsPage";
import FuelBillPage from "./pages/documents/FuelBillPage";
import RentReceiptPage from "./pages/documents/RentReceiptPage";
import AboutPage from "./pages/AboutPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import AccountPage from "./pages/AccountPage";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
          <TopHeader />
          <div className="flex-1">
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
          </div>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
