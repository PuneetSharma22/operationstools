import { Helmet } from "react-helmet-async";
import { useState } from "react";
import { CURRENCIES, COMPOUND_FREQ, AMOUNT_PRESETS, ROI_TABS } from "../../components/roi/constants";
import { calcROI, calcAnnualized, calcBreakEven, calcRealROI, getRiskLevel, getInterpretation } from "../../components/roi/roiMath";
import { InvestmentDetailsPanel, CompoundingPanel, ComparePanel, WhatIfPanel, InterpretationCard } from "../../components/roi/tabPanels";
import ROIResultsPanel from "../../components/roi/ROIResultsPanel";
import OthersCalculator from "../../components/roi/OthersCalculator";
import OthersResultPanel from "../../components/roi/OthersResultPanel";
import ROISeoSection from "../../components/roi/ROISeoSection";
import { logSaveRequest } from "../../utils/saveLog";

const SEO_TITLE = "ROI Calculator — Return on Investment Calculator India | OpsTools";
const SEO_DESCRIPTION = "Free ROI calculator (return on investment calculator) for India. Compare FD, RD and savings account returns, run what-if scenarios, no login required.";

export default function ROICalculatorPage() {
  const [currency, setCurrency] = useState(CURRENCIES[0]);
  const [invested, setInvested] = useState(100000);
  const [returned, setReturned] = useState(150000);
  const [years, setYears] = useState(3);
  const [compoundFreq, setCompoundFreq] = useState(COMPOUND_FREQ[3]);
  const [inflationOn, setInflationOn] = useState(false);
  const [othersResult, setOthersResult] = useState(null);
  const [inflationRate, setInflationRate] = useState(6);
  const [whatIfBoost, setWhatIfBoost] = useState(0);
  const [activeTab, setActiveTab] = useState("basic");
  const [inv2, setInv2] = useState(200000);
  const [ret2, setRet2] = useState(260000);
  const [years2, setYears2] = useState(3);

  const s = currency.symbol;

  // Everything below is derived, in the order documented in roiMath.js.
  const boostedReturned = returned * (1 + whatIfBoost / 100);
  const roi = calcROI(invested, boostedReturned);
  const annualized = calcAnnualized(invested, boostedReturned, years, compoundFreq.n);
  const gain = boostedReturned - invested;
  const realROI = inflationOn ? calcRealROI(roi, inflationRate, years) : null;
  const risk = getRiskLevel(roi);
  const interpretation = getInterpretation(roi, annualized, years, s, gain);
  const breakEven = calcBreakEven(invested, gain, years);
  const roi2 = calcROI(inv2, ret2);
  const annualized2 = calcAnnualized(inv2, ret2, years2, compoundFreq.n);

  const isOthers = activeTab === "others";

  /** Logs the print (analytics only, never blocking) and opens the dialog. */
  const printReport = async (template) => {
    await logSaveRequest({ template, printId: `ROI-${Date.now()}` });
    window.print();
  };

  return (
    <>
      <Helmet>
        <title>{SEO_TITLE}</title>
        <meta name="description" content={SEO_DESCRIPTION} />
        <meta property="og:title" content={SEO_TITLE} />
        <meta property="og:description" content={SEO_DESCRIPTION} />
        <meta property="og:url" content="https://www.opstools.ai/business/roi-calculator" />
        <link rel="canonical" href="https://www.opstools.ai/business/roi-calculator" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://www.opstools.ai/og-image.png" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={SEO_TITLE} />
        <meta name="twitter:description" content={SEO_DESCRIPTION} />
        <meta name="twitter:image" content="https://www.opstools.ai/og-image.png" />
      </Helmet>

      <div style={{ backgroundColor: "#F8FAFC", minHeight: "100vh" }}>
        <style>{`
          .roi-tab { cursor:pointer; padding:8px 18px; border-radius:8px; font-size:13px; font-weight:600; border:none; transition:all 0.15s; background:transparent; }
          .roi-tab.active { background:linear-gradient(135deg,#2563EB,#4F46E5); color:#fff; }
          .roi-tab:not(.active) { color:#64748B; }
          .roi-tab:not(.active):hover { background:#F1F5F9; color:#0F172A; }
          @media(max-width:768px) {
            .roi-grid { grid-template-columns:1fr !important; }
            .roi-stats { flex-wrap:wrap !important; }
            .roi-stats > div { min-width:calc(50% - 6px) !important; }
            .roi-tabs { overflow-x:auto; }
          }
          @media print {
            .no-print { display:none !important; }
            .print-only { display:none !important; }
            body { background:#fff !important; }
            .roi-results {
              position: static !important;
              display: block !important;
            }
            .roi-results-print-header {
              display: flex !important;
            }
          }
        `}</style>

        {/* Hero */}
        <section style={{ background: "linear-gradient(160deg,#07011F 0%,#0D0630 55%,#1e1b4b 100%)", padding: "40px 24px 36px" }} className="no-print">
          <div style={{ maxWidth: 1100, margin: "0 auto" }}>
            <nav style={{ marginBottom: 16, fontSize: 13, color: "#475569" }}>
              <a href="/" style={{ color: "#475569", textDecoration: "none" }}>Home</a>
              <span style={{ margin: "0 8px" }}>›</span>
              <span style={{ color: "#94A3B8" }}>ROI Calculator</span>
            </nav>
            <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
              <div>
                <h1 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: 800, color: "#fff", margin: "0 0 8px", letterSpacing: "-0.02em" }}>ROI Calculator</h1>
                <p style={{ fontSize: 14, color: "#94A3B8", margin: 0 }}>
                  Calculate returns · Compare investments · Benchmark vs FD, Gold, Nifty50
                </p>
              </div>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                {CURRENCIES.map((c) => (
                  <button key={c.code} onClick={() => setCurrency(c)} style={{
                    padding: "6px 14px", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer",
                    border: currency.code === c.code ? "1.5px solid #2563EB" : "1.5px solid rgba(255,255,255,0.15)",
                    background: currency.code === c.code ? "#2563EB" : "rgba(255,255,255,0.06)",
                    color: currency.code === c.code ? "#fff" : "rgba(255,255,255,0.65)",
                  }}>{c.symbol} {c.code}</button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Tabs */}
        <div style={{ background: "#fff", borderBottom: "1px solid #E2E8F0", padding: "0 24px" }} className="no-print">
          <div style={{ maxWidth: 1100, margin: "0 auto", display: "flex", gap: 4, padding: "8px 0", overflowX: "auto" }} className="roi-tabs">
            {ROI_TABS.map((tab) => (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)} className={`roi-tab ${activeTab === tab.key ? "active" : ""}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tool */}
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>
          <div className="roi-grid" style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: 28, alignItems: "start" }}>

            {/* LEFT — inputs, hidden on print */}
            <div className="no-print">
              {!isOthers && (
                <InvestmentDetailsPanel
                  symbol={s}
                  invested={invested} setInvested={setInvested}
                  returned={returned} setReturned={setReturned}
                  years={years} setYears={setYears}
                  amountPresets={AMOUNT_PRESETS}
                  inflationOn={inflationOn} setInflationOn={setInflationOn}
                  inflationRate={inflationRate} setInflationRate={setInflationRate}
                />
              )}

              {isOthers && <OthersCalculator s={s} amountPresets={AMOUNT_PRESETS} onResult={setOthersResult} />}

              {activeTab === "advanced" && <CompoundingPanel compoundFreq={compoundFreq} setCompoundFreq={setCompoundFreq} />}

              {activeTab === "compare" && (
                <ComparePanel
                  symbol={s} amountPresets={AMOUNT_PRESETS}
                  inv2={inv2} setInv2={setInv2}
                  ret2={ret2} setRet2={setRet2}
                  years2={years2} setYears2={setYears2}
                  roi={roi} annualized={annualized} gain={gain}
                  roi2={roi2} annualized2={annualized2}
                />
              )}

              {activeTab === "whatif" && (
                <WhatIfPanel
                  whatIfBoost={whatIfBoost} setWhatIfBoost={setWhatIfBoost}
                  invested={invested} returned={returned} roi={roi}
                />
              )}

              {!isOthers && <InterpretationCard risk={risk} interpretation={interpretation} />}
            </div>

            {/* RIGHT — results */}
            {!isOthers && (
              <ROIResultsPanel
                symbol={s}
                invested={invested}
                boostedReturned={boostedReturned}
                roi={roi}
                annualized={annualized}
                gain={gain}
                years={years}
                breakEven={breakEven}
                compoundFreq={compoundFreq}
                inflationOn={inflationOn}
                realROI={realROI}
                onPrint={() => printReport("roi-calculator")}
              />
            )}

            {isOthers && (
              <div style={{ position: "sticky", top: 88 }}>
                <OthersResultPanel result={othersResult} onPrint={() => printReport("roi-calculator-others")} />
              </div>
            )}
          </div>
        </div>

        <ROISeoSection />
      </div>
    </>
  );
}
