import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import TopHeader from "./components/TopHeader";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import DocumentsPage from "./pages/DocumentsPage";
import FuelBillPage from "./pages/documents/FuelBillPage";
import RentReceiptPage from "./pages/documents/RentReceiptPage";
import AboutPage from "./pages/AboutPage";

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <TopHeader />
        <div className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/documents" element={<DocumentsPage />} />
            <Route path="/documents/fuel-bill" element={<FuelBillPage />} />
            <Route path="/documents/rent-receipt" element={<RentReceiptPage />} />
            <Route path="/about" element={<AboutPage />} />
          </Routes>
        </div>
        <Footer />
      </div>
      <Analytics />
      <SpeedInsights />
    </BrowserRouter>
  );
}
