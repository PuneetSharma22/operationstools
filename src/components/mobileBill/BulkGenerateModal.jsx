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
import MobileBillTemplate from "./MobileBillTemplate";
import {
  CSV_REQUIRED_COLUMNS, CSV_OPTIONAL_COLUMNS, CSV_TEMPLATE_HEADERS, CSV_SAMPLE_ROW,
  validateMobileRow, resolveRow, toBillData,
} from "./bulkCsv";

const TABLE_HEADERS = ["#", "Date", "Type", "Operator", "Plan / Item", "Amount ₹", "Status"];

function resolvedCell(r) {
  if (r.isNA) return <span style={{ color: "#CBD5E1" }} title="Explicitly left blank (NA)">—</span>;
  if (r.isDefault) return <span style={{ color: "#94A3B8", fontStyle: "italic" }} title="Not entered — using default">{r.value || "—"}</span>;
  return <span>{r.value}</span>;
}

export default function BulkGenerateModal({ user, formData, onClose }) {
  const [step, setStep] = useState("upload");
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
          console.error("Could not read credit balance for bulk mobile-bill generation.", error);
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
      const { rows, errors } = parseCSVRows(e.target.result, CSV_REQUIRED_COLUMNS, validateMobileRow);
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
      const generated = validRows.map((row, i) => ({
        printId: `BULK-${Date.now()}-${i}`,
        billData: toBillData(resolveRow(row, formData, i)),
      }));

      const pdf = await renderBulkPdf({
        rows: generated,
        Template: MobileBillTemplate,
        realisticLook,
        onProgress: setProgress,
      });

      await settleBulkCredits({
        userId: user.id,
        generated,
        template: "bulk-mobile-bill",
        description: `Bulk mobile bill generation — ${generated.length} bills`,
      });

      setProgress(100);
      pdf.save(`mobile-bills-bulk-${Date.now()}.pdf`);
      setStep("done");
    } catch (err) {
      console.error("Bulk mobile-bill generation failed:", err);
      alert(isTaintedCanvasError(err)
        ? "Generation failed: the logo URL doesn't allow cross-origin access, which blocks export."
        : "Generation failed: " + (err?.message || "Unknown error"));
      setStep("preview");
    }
    setGenerating(false);
  };

  return (
    <Modal onClose={onClose} wide>
      <div style={{ padding: "28px 32px" }}>
        <ModalHeader title="Generate Multiple Mobile Bills" onClose={onClose} />
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
            onDownloadTemplate={() => downloadCSVTemplate("mobile-bill-bulk-template.csv", CSV_TEMPLATE_HEADERS, CSV_SAMPLE_ROW)}
          >
            Required columns: <code style={{ background: "#EFF6FF", padding: "1px 6px", borderRadius: 4, color: "#2563EB" }}>date, amount</code><br/>
            Optional: <code style={{ background: "#F1F5F9", padding: "1px 6px", borderRadius: 4 }}>{CSV_OPTIONAL_COLUMNS.join(", ")}</code><br/>
            <span style={{ display: "inline-block", marginTop: 6 }}><code style={{ background: "#F1F5F9", padding: "1px 6px", borderRadius: 4 }}>bill_type</code> is <code>postpaid</code> or <code>prepaid</code> per row — postpaid amount is the plan rental (GST added), prepaid amount is the recharge amount (tax-inclusive). Blank cells default to the main form's current values.</span>
          </UploadStep>
        )}

        {step === "preview" && (
          <div>
            <PreviewHeader validCount={validRows.length} errorCount={csvRows.length - validRows.length} onReupload={resetUpload} />

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
                      const resolved = resolveRow(row, formData, validIndex);
                      return (
                        <tr key={i} style={{ borderBottom: "1px solid #F1F5F9", background: row._errors.length ? "#FEF2F2" : i % 2 === 0 ? "#fff" : "#FAFAFA" }}>
                          <td style={{ padding: "8px 12px", color: "#94A3B8" }}>{row._line}</td>
                          <td style={{ padding: "8px 12px" }}>{row.date}</td>
                          <td style={{ padding: "8px 12px", textTransform: "capitalize" }}>{resolved.billType}</td>
                          <td style={{ padding: "8px 12px", textTransform: "capitalize" }}>{resolvedCell(resolved.operatorName)}</td>
                          <td style={{ padding: "8px 12px" }}>{resolvedCell(resolved.planName)}</td>
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
              description="faded print, slight paper grain, and a small scan-like tilt, instead of a crisp digital render"
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
            savedNoun="mobile bills"
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
  user: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
  formData: PropTypes.object.isRequired,
  onClose: PropTypes.func.isRequired,
};
