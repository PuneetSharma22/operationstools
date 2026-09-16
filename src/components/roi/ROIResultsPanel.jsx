import PropTypes from "prop-types";
import { StatCard, SavePdfButton } from "./inputs";
import { DonutChart, Gauge, BarChart, BenchmarkBar } from "./charts";
import { fmt } from "./roiMath";

/**
 * The sticky right-hand results column for the Basic / Advanced / Compare /
 * What-if tabs: headline stats, the two charts, and the benchmark comparison.
 *
 * The `roi-results-print-header` block is hidden on screen and revealed by the
 * page's `@media print` rules, so a printed report carries its own title.
 */
export default function ROIResultsPanel({
  symbol, invested, boostedReturned, roi, annualized, gain, years,
  breakEven, compoundFreq, inflationOn, realROI, onPrint,
}) {
  return (
    <div className="roi-results" style={{ position: "sticky", top: 88 }}>
      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "24px", marginBottom: 16 }}>
        <div className="roi-results-print-header" style={{ display: "none", alignItems: "center", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "2px solid #0F172A" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: "#0F172A" }}>ROI Calculator Report</div>
            <div style={{ fontSize: 12, color: "#64748B", marginTop: 2 }}>opstools.ai · {new Date().toLocaleDateString("en-IN")}</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.08em", margin: 0 }}>Results</h2>
          <SavePdfButton onClick={onPrint} />
        </div>

        <div className="roi-stats" style={{ display: "flex", gap: 10, marginBottom: 12 }}>
          <StatCard label="ROI" value={`${roi.toFixed(2)}%`} sub={`Gain: ${fmt(Math.abs(gain), symbol)}`} accent={roi >= 0 ? "#10B981" : "#EF4444"} />
          <StatCard label="Annualized" value={`${annualized.toFixed(2)}%`} sub={compoundFreq.label} accent="#2563EB" />
        </div>
        <div className="roi-stats" style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          <StatCard label="Total Gain" value={`${gain >= 0 ? "+" : ""}${fmt(gain, symbol)}`} sub={`${years}yr period`} accent={gain >= 0 ? "#10B981" : "#EF4444"} />
          <StatCard label="Break-even" value={breakEven ? `${breakEven} yrs` : "N/A"} sub="At current rate" />
        </div>

        {inflationOn && realROI !== null && (
          <div style={{ background: "#FFF7ED", borderRadius: 10, padding: "12px 14px", marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 13, color: "#92400E", fontWeight: 600 }}>Real ROI (inflation-adjusted)</span>
            <span style={{ fontSize: 16, fontWeight: 800, color: realROI >= 0 ? "#059669" : "#DC2626" }}>{realROI.toFixed(2)}%</span>
          </div>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 20 }}>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700, textAlign: "center", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Composition</p>
            <DonutChart invested={invested} returned={boostedReturned} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
            <p style={{ fontSize: 10, color: "#94A3B8", fontWeight: 700, textAlign: "center", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.07em" }}>Performance</p>
            <Gauge roi={roi} />
          </div>
        </div>

        <BarChart invested={invested} returned={boostedReturned} symbol={symbol} />
      </div>

      <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #E2E8F0", padding: "20px 24px" }}>
        <BenchmarkBar annualized={annualized} />
      </div>
    </div>
  );
}

ROIResultsPanel.propTypes = {
  symbol: PropTypes.string.isRequired,
  invested: PropTypes.number.isRequired,
  /** Amount returned after the What-if boost/cut is applied. */
  boostedReturned: PropTypes.number.isRequired,
  roi: PropTypes.number.isRequired,
  annualized: PropTypes.number.isRequired,
  gain: PropTypes.number.isRequired,
  years: PropTypes.number.isRequired,
  /** Years to break even, or null when there is no gain. */
  breakEven: PropTypes.string,
  compoundFreq: PropTypes.shape({ label: PropTypes.string, n: PropTypes.number }).isRequired,
  inflationOn: PropTypes.bool,
  realROI: PropTypes.number,
  onPrint: PropTypes.func.isRequired,
};
