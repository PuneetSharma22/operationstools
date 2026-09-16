// Export plumbing shared by the fuel-bill and rent-receipt pages: page-fit
// maths, font readiness, and the cross-origin error sniff. Kept separate from
// the pages so the (pure) geometry can be reasoned about and tested on its
// own.

/** CSS px -> mm at the scale:2 used for every html2canvas capture. */
export const PX_TO_MM = 25.4 / (96 * 2);

/** Margin (mm) kept clear on the left/right of a placed receipt. */
const SIDE_MARGIN_MM = 10;
/** Distance (mm) from the top of the page to the top of the receipt. */
export const TOP_OFFSET_MM = 10;

/**
 * Works out where to place a captured receipt on an A4 page.
 *
 * The receipt is fitted inside *half* the page height rather than to a fixed
 * width: a tall, narrow thermal receipt was otherwise being stretched to fill
 * the entire page. Whichever of the two constraints bites first wins, and the
 * result is horizontally centred.
 *
 * Pure function — takes plain numbers, returns plain numbers in mm.
 *
 * @param {number} canvasW capture width in px
 * @param {number} canvasH capture height in px
 * @param {number} pageW   page width in mm
 * @param {number} pageH   page height in mm
 */
export function fitCanvasToPage(canvasW, canvasH, pageW, pageH) {
  const naturalW = canvasW * PX_TO_MM;
  const naturalH = canvasH * PX_TO_MM;
  const maxW = pageW - SIDE_MARGIN_MM * 2;
  const maxH = pageH / 2 - SIDE_MARGIN_MM;
  const fitScale = Math.min(maxW / naturalW, maxH / naturalH);
  const width = naturalW * fitScale;
  const height = naturalH * fitScale;
  return { x: (pageW - width) / 2, y: TOP_OFFSET_MM, width, height };
}

/**
 * Waits for webfonts to settle before capture so html2canvas doesn't
 * screenshot a fallback face. Never throws: a font that fails to load is a
 * cosmetic problem, not a reason to abandon the export.
 */
export async function waitForFonts(context = "export") {
  if (!document.fonts || !document.fonts.ready) return;
  try {
    await document.fonts.ready;
  } catch (err) {
    console.warn(`Font loading did not settle before ${context}; capturing with whatever is available.`, err);
  }
}

/**
 * True when an export blew up because a remote logo/image poisoned the
 * canvas. Worth distinguishing, because the fix (use a different image host)
 * is completely different from a generic failure.
 */
export function isTaintedCanvasError(err) {
  return /tainted|cross-origin|SecurityError/i.test(err?.message || err?.name || "");
}
