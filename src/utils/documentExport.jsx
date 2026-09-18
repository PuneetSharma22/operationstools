import { supabase } from "../supabase";
import { applyRealisticScanLook } from "./scanEffect";
import { fitCanvasToPage, waitForFonts, isTaintedCanvasError } from "./pdfExport";

// Export engine shared by the fuel-bill and rent-receipt pages — single-
// document Save as PDF/PNG, and the bulk multi-page run. Both pages used to
// inline byte-identical copies of all of this.

const CAPTURE_BACKGROUND = "#FBFAF6";
// html2canvas screenshots the DOM, so the component has to actually be laid
// out and painted first. 300ms is the empirically-chosen settle time.
const RENDER_SETTLE_MS = 300;

/** Renders a component into a detached, off-screen node and waits for paint. */
async function renderOffScreen(container, Template, data) {
  const { createRoot } = await import("react-dom/client");
  const root = createRoot(container);
  await new Promise((resolve) => {
    root.render(<Template data={data} />);
    setTimeout(resolve, RENDER_SETTLE_MS);
  });
  await waitForFonts("export");
  return root;
}

/**
 * Saves the current document as a PDF or PNG.
 *
 * Renders a fresh, unscaled, off-screen copy specifically for capture rather
 * than screenshotting the on-screen preview. The on-screen preview is wrapped
 * in a CSS scale() transform purely so it fits the sidebar column, and
 * html2canvas doesn't reliably capture through that transform — it was the
 * source of both a persistent off-white "bleed" past the card's real edge and
 * dividers that render fine on screen but don't paint at all in the export.
 *
 * @param {object}   args
 * @param {Function} args.Template   React component taking `{ data }`
 * @param {object}   args.data       the document record
 * @param {string}   args.format     "pdf" | "png"
 * @param {string}   args.fileBase   filename without extension
 * @param {string}   args.taintedHint what to suggest on a cross-origin failure
 */
export async function exportSingleDocument({ Template, data, format = "pdf", fileBase, taintedHint }) {
  const { default: html2canvas } = await import("html2canvas");
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;left:-9999px;top:0;background:#FBFAF6;display:inline-block;";
  document.body.appendChild(container);

  let root = null;
  try {
    root = await renderOffScreen(container, Template, data);
    const canvas = await html2canvas(container, { scale: 2, useCORS: true, backgroundColor: CAPTURE_BACKGROUND, logging: false });

    if (format === "png") {
      // Just the preview section itself, as a flat image — no page layout.
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `${fileBase}.png`;
      link.click();
    } else {
      const { default: jsPDF } = await import("jspdf");
      // JPEG at high quality instead of PNG — PNG is lossless and produces
      // multi-MB files for this kind of image (text + a colour logo over a
      // solid background); JPEG compresses it far better with no visible
      // quality loss at this setting.
      const imgData = canvas.toDataURL("image/jpeg", 0.92);
      const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
      const box = fitCanvasToPage(
        canvas.width, canvas.height,
        pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight()
      );
      pdf.addImage(imgData, "JPEG", box.x, box.y, box.width, box.height);
      pdf.save(`${fileBase}.pdf`);
    }
  } catch (err) {
    console.error(`Saving ${fileBase} as ${format.toUpperCase()} failed.`, err);
    alert(isTaintedCanvasError(err)
      ? `Save failed: ${taintedHint}`
      : "Save failed: " + (err?.message || "Unknown error"));
  } finally {
    if (root) root.unmount();
    if (container.parentNode) document.body.removeChild(container);
  }
}

/**
 * Renders every row into one multi-page PDF, one document per page.
 *
 * @param {object}   args
 * @param {Array}    args.rows          one entry per document: `{ billData }`
 * @param {Function} args.Template      React component taking `{ data }`
 * @param {boolean}  args.realisticLook apply the scanned-paper effect
 * @param {Function} args.onProgress    called with 0-100 as pages are added
 * @returns {Promise<object>} the finished jsPDF instance
 */
export async function renderBulkPdf({ rows, Template, realisticLook, onProgress }) {
  const { default: jsPDF } = await import("jspdf");
  const { default: html2canvas } = await import("html2canvas");

  const pdf = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  // One hidden container reused for every row, so we never thrash the DOM.
  const container = document.createElement("div");
  container.style.cssText = "position:fixed;left:-9999px;top:0;width:400px;background:#FBFAF6;";
  document.body.appendChild(container);

  try {
    for (let i = 0; i < rows.length; i++) {
      if (onProgress) onProgress(Math.round((i / rows.length) * 100));

      const wrapper = document.createElement("div");
      wrapper.style.display = "inline-block";
      container.appendChild(wrapper);

      const root = await renderOffScreen(wrapper, Template, rows[i].billData);

      const rawCanvas = await html2canvas(wrapper, { scale: 2, useCORS: true, backgroundColor: CAPTURE_BACKGROUND, logging: false });
      const canvas = realisticLook ? applyRealisticScanLook(rawCanvas, CAPTURE_BACKGROUND) : rawCanvas;
      const box = fitCanvasToPage(canvas.width, canvas.height, pageW, pageH);

      if (i > 0) pdf.addPage();
      pdf.addImage(canvas.toDataURL("image/jpeg", 0.92), "JPEG", box.x, box.y, box.width, box.height);

      root.unmount();
      container.removeChild(wrapper);
    }
  } finally {
    // Always reclaim the off-screen container, even if a capture threw.
    if (container.parentNode) document.body.removeChild(container);
  }

  return pdf;
}

/**
 * Debits the user's credits, records the transaction, and logs one
 * save_requests row per generated document.
 *
 * Runs only after the PDF has been produced: a failure here must not cost the
 * user documents they never received. The debit itself goes through the
 * spend_credits() RPC (a SECURITY DEFINER function) rather than a direct
 * table UPDATE — the balance is recomputed and bounds-checked server-side,
 * so a client can no longer set its own balance to an arbitrary value.
 * spend_credits() throws if the balance is insufficient, which callers
 * already surface via their existing catch block.
 */
export async function settleBulkCredits({ userId, generated, template, description }) {
  const count = generated.length;

  const { error } = await supabase.rpc("spend_credits", { p_count: count, p_template: description });
  if (error) throw error;

  // Includes the full document content (bill_data), not just which
  // template/print_id was used, so every generated document is recorded.
  await supabase.from("save_requests").insert(
    generated.map(({ printId, billData }) => ({
      template,
      print_id: printId,
      user_id: userId,
      bill_data: billData,
    }))
  );
}
