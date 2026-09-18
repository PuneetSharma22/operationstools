import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { supabase } from "../../supabase";
import Modal from "../common/Modal";
import {
  ModalHeader, CreditsBar, StepsIndicator, UploadStep, PreviewHeader, LegendNote,
  CreditCostPanel, RealisticLookToggle, GenerateButton, GeneratingStep, DoneStep,
} from "../common/bulkSteps";
import { parseCSVRows, downloadCSVTemplate } from "../../utils/csv";
import { renderBulkPdf, settleBulkCredits } from "../../utils/documentExport";
import { isTaintedCanvasError } from "../../utils/pdfExport";
import {
  CSV_REQUIRED_COLUMNS, CSV_OPTIONAL_COLUMNS, CSV_TEMPLATE_HEADERS, CSV_SAMPLE_ROW,
  validateFuelRow, resolveRow, toBillData,
} from "./bulkCsv";

const TABLE_HEADERS = ["#", "Date", "Vehicle", "Fuel Type", "Qty (L)", "Rate ₹", "Amount ₹", "Status"];

/** Renders one resolved cell, distinguishing defaulted vs explicitly-blank. */
function resolvedCell(r) {
  if (r.isNA) return <span style={{ color: "#CBD5E1" }} title="Explicitly left blank (NA)">—</span>;
  if (r.isDefault) return <span style={{ color: "#94A3B8", fontStyle: "italic" }} title="Not entered — using default">{r.value || "—"}</span>;
  return <span>{r.value}</span>;
}

export default function BulkGenerateModal({ user, stationData, activeTemplate, templateComponents, onClose }) {
  const [step, setStep] = useState("upload"); // upload | preview | generating | done
  const [csvRows, setCsvRows] = useState([]);
  const [csvErrors, setCsvErrors] = useState([]);
  const [credits, setCredits] = useState(null);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [dragOver, setDragOver] = useState(false);
  const [realisticLook, setRealisticLook] = useState(false);

  useEffect(() => {
    supabase.from("user_credits").select("balance").eq("user_id", user.id).maybeSingle()
      .then(({ data, error }) => {
        if (error) {
          console.error("Could not read credit balance for bulk fuel-bill generation.", error);
          setCsvErrors((prev) => [...prev, "Could not load your credit balance. Try reopening this dialog."]);
        }
        setCredits(data?.balance ?? 0);
      });
  }, [user.id]);

  const handleFile = (file) => {
    if (!file || !file.name.endsWith(".csv")) { setCsvErrors(["Please upload a .csv file"]); return; }
    const reader = new FileReader();
    reader.onerror = () => {
      console.error("Could not read the uploaded CSV file.", reader.error);
      setCsvErrors(["Could not read that file. Try re-saving it as CSV and uploading again."]);
    };
    reader.onload = (e) => {
      const { rows, errors } = parseCSVRows(e.target.result, CSV_REQUIRED_COLUMNS, validateFuelRow);
      setCsvRows(rows);
      setCsvErrors(errors);
      if (rows.length > 0) setStep("preview");
    };
    reader.readAsText(file);
  };

  const resetUpload = () => { setStep("upload"); setCsvRows([]); setCsvErrors([]); };

  const validRows = csvRows.filter((r) => r._errors.length === 0);
  const hasEnoughCredits = credits !== null && credits >= validRows.length;

  const handleGenerate = async () => {
    if (!hasEnoughCredits || generating) return;
    setGenerating(true);
    setStep("generating");

    try {
      // Collects { printId, billData } per row as we go, so the full bill
      // content (not just template/print_id) can be recorded afterward.
      const generated = validRows.map((row, i) => ({
        printId: `BULK-${Date.now()}-${i}`,
        billData: toBillData(resolveRow(row, stationData, i), stationData),
      }));

      const pdf = await renderBulkPdf({
        rows: generated,
        Template: templateComponents[activeTemplate],
        realisticLook,
        onProgress: setProgress,
      });

      await settleBulkCredits({
        userId: user.id,
        generated,
        template: `bulk-${activeTemplate}`,
        description: `Bulk fuel bill generation — ${generated.length} bills`,
      });

      setProgress(100);
      pdf.save(`fuel-bills-bulk-${Date.now()}.pdf`);
      setStep("done");
    } catch (err) {
      console.error("Bulk fuel-bill generation failed:", err);
      alert(isTaintedCanvasError(err)
        ? "Generation failed: one of the logo/bank-strip image URLs doesn't allow cross-origin access, which blocks export. Try a different image host, or remove the logo URL and try again."
        : "Generation failed: " + (err?.message || "Unknown error"));
      setStep("preview");
    }
    setGenerating(false);
  };

  return (
    <Modal onClose={onClose} wide>
      <div style={{ padding: "28px 32px" }}>
        <ModalHeader title="Generate Multiple Fuel Bills" onClose={onClose} />
        <CreditsBar credits={credits} />
        <StepsIndicator step={step} />

        {step === "upload" && (
          <UploadStep
            errors={csvErrors}
            dragOver={dragOver}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFile(e.dataTransfer.files[0]); }}
            onFile={handleFile}
            onDownloadTemplate={() => downloadCSVTemplate("fuel-bill-bulk-template.csv", CSV_TEMPLATE_HEADERS, CSV_SAMPLE_ROW)}
          >
            Required columns: <code style={{ background: "#EFF6FF", padding: "1px 6px", borderRadius: 4, color: "#2563EB" }}>date, price_per_litre, amount</code><br/>
            Optional: <code style={{ background: "#F1F5F9", padding: "1px 6px", borderRadius: 4 }}>{CSV_OPTIONAL_COLUMNS.join(", ")}</code><br/>
            <span style={{ display: "inline-block", marginTop: 6 }}>Blank station/dispenser fields (station_name, station_address, station_phone, gst_no, logo_url, bank_logo_url, nozzle_no, density, preset_type, attendant_id) default to the main form's current value — leave them blank for a normal same-station batch. Blank invoice_no defaults to blank, since it's unique per transaction.</span><br/>
            <span style={{ display: "inline-block", marginTop: 6 }}>Volume isn't a column — it's calculated automatically from amount ÷ rate.</span><br/>
            Leave an optional cell <b>blank</b> to use a sensible default (shown in italics in the preview table), or type <code style={{ background: "#FEF9C3", padding: "1px 6px", borderRadius: 4 }}>NA</code> to force it blank instead of defaulting.
          </UploadStep>
        )}

        {step === "preview" && (
          <div>
            <PreviewHeader validCount={validRows.length} errorCount={csvRows.length - validRows.length} onReupload={resetUpload} />

            {/* Table preview — shows the *resolved* values (after defaults and
                NA-overrides are applied), computed with the exact same
                resolveRow() the generator uses, so nothing shown here can
                drift from what actually gets produced. */}
            <div style={{ border: "1px solid #E2E8F0", borderRadius: 12, overflow: "hidden", marginBottom: 16 }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 12 }}>
                <thead style={{ background: "#F8FAFC", position: "sticky", top: 0 }}>
                  <tr>{TABLE_HEADERS.map((h) => (
                    <th key={h} style={{ padding: "10px 12px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#64748B", textTransform: "uppercase", letterSpacing: "0.06em", borderBottom: "1px solid #E2E8F0" }}>{h}</th>
                  ))}</tr>
                </thead>
                <tbody>
                  {(() => {
                    let validIndex = -1;
                    return csvRows.map((row, i) => {
                      if (row._errors.length === 0) validIndex += 1;
                      const resolved = resolveRow(row, stationData, validIndex);
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid #F1F5F9", background: row._errors.length ? "#FEF2F2" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                          <td style={{ padding: "8px 12px", color: "#94A3B8" }}>{row._line}</td>
                          <td style={{ padding: "8px 12px" }}>{row.date}</td>
                          <td style={{ padding: "8px 12px", fontWeight: 600 }}>{resolvedCell(resolved.vehicleNumber)}</td>
                          <td style={{ padding: "8px 12px" }}>{resolvedCell(resolved.fuelType)}</td>
                          <td style={{ padding: "8px 12px" }}>{resolved.quantity || "—"}</td>
                          <td style={{ padding: "8px 12px" }}>₹{row.price_per_litre}</td>
                          <td style={{ padding: "8px 12px", fontWeight: 700 }}>₹{row.amount}</td>
                          <td style={{ padding: "8px 12px" }}>
                            {row._errors.length === 0
                              ? <span style={{ color: "#059669", fontWeight: 600 }}>✓ Valid</span>
                              : <span style={{ color: "#DC2626", fontSize: 11 }}>{row._errors.join(", ")}</span>}
                          </td>
                        </tr>
                      );
                    });
                  })()}
                </tbody>
              </table>
            </div>
            <LegendNote />

            <CreditCostPanel noun="Bills" count={validRows.length} credits={credits} hasEnoughCredits={hasEnoughCredits} />

            <RealisticLookToggle
              checked={realisticLook}
              onChange={setRealisticLook}
              description="faded print, slight paper grain, and a small scan-like tilt on each bill, instead of a crisp digital render"
            />

            <GenerateButton
              label={`Generate ${validRows.length} Bills — ${validRows.length} Credits`}
              disabled={!hasEnoughCredits || validRows.length === 0}
              onClick={handleGenerate}
            />
          </div>
        )}

        {step === "generating" && <GeneratingStep noun="bills" progress={progress} total={validRows.length} />}

        {step === "done" && (
          <DoneStep
            noun="bills"
            savedNoun="fuel bills"
            count={validRows.length}
            remainingCredits={credits - validRows.length}
            onClose={onClose}
            onRestart={() => { resetUpload(); setProgress(0); }}
          />
        )}
      </div>
    </Modal>
  );
}

BulkGenerateModal.propTypes = {
  /** Supabase auth user — bulk generation requires an account. */
  user: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  /** The main form's current values, used as per-column defaults. */
  stationData: PropTypes.object.isRequired,
  /** Template id every generated bill is rendered with. */
  activeTemplate: PropTypes.string.isRequired,
  /** Map of template id -> React component. */
  templateComponents: PropTypes.objectOf(PropTypes.elementType).isRequired,
  onClose: PropTypes.func.isRequired,
};
