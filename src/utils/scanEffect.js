// Canvas post-processing shared by the fuel-bill and rent-receipt bulk
// generators ("Make it look real" checkbox).

/**
 * Post-processes a captured canvas to look like a real scanned/printed
 * receipt rather than a crisp digital render: pulls dark pixels toward gray +
 * a warm tint (print/scan fading), adds blotchy grain (coarser 3x3px blocks
 * rather than per-pixel noise, so it survives JPEG compression instead of
 * being smoothed away by quantization), darkens/smudges each corner
 * independently (radius capped by the shorter dimension so it stays a corner
 * effect even on a tall narrow receipt, never a broad band), a slight blur
 * for scan softness, and a clearly visible random tilt (±2.5°) onto a padded
 * canvas filled with the paper colour.
 *
 * Tuned and visually verified against both tall/narrow and normal receipt
 * proportions before shipping — the first version of this was too subtle to
 * notice at all.
 *
 * @param {HTMLCanvasElement} sourceCanvas capture to transform (mutated)
 * @param {string} paperColor background of the padded output canvas
 * @returns {HTMLCanvasElement} a new, padded and rotated canvas
 */
export function applyRealisticScanLook(sourceCanvas, paperColor = "#FBFAF6") {
  const w = sourceCanvas.width, h = sourceCanvas.height;
  const ctx = sourceCanvas.getContext("2d");

  // Fade + warm tint
  const imageData = ctx.getImageData(0, 0, w, h);
  const d = imageData.data;
  const fadeAmount = 0.22;
  const warmR = 10, warmG = 3, warmB = -14;
  for (let i = 0; i < d.length; i += 4) {
    d[i] = Math.min(255, Math.max(0, d[i] + (205 - d[i]) * fadeAmount + warmR));
    d[i + 1] = Math.min(255, Math.max(0, d[i + 1] + (205 - d[i + 1]) * fadeAmount + warmG));
    d[i + 2] = Math.min(255, Math.max(0, d[i + 2] + (205 - d[i + 2]) * fadeAmount + warmB));
  }
  ctx.putImageData(imageData, 0, 0);

  // Blotchy grain
  const blockSize = 3;
  for (let y = 0; y < h; y += blockSize) {
    for (let x = 0; x < w; x += blockSize) {
      const v = Math.random() * 44 - 22;
      const alpha = Math.min(0.5, Math.abs(v) / 60);
      ctx.fillStyle = v > 0 ? `rgba(0,0,0,${alpha})` : `rgba(255,255,255,${alpha})`;
      ctx.fillRect(x, y, blockSize, blockSize);
    }
  }

  // Corner smudges
  const cornerR = Math.min(w, h) * 0.28;
  [[0, 0], [w, 0], [0, h], [w, h]].forEach(([cx, cy]) => {
    const r = cornerR * (0.75 + Math.random() * 0.4);
    const grad = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
    grad.addColorStop(0, `rgba(55,42,28,${0.38 + Math.random() * 0.15})`);
    grad.addColorStop(0.6, "rgba(55,42,28,0.15)");
    grad.addColorStop(1, "rgba(55,42,28,0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
    ctx.fill();
  });

  // Slight blur (scan softness). Canvas filter support is not universal —
  // Safari only shipped it recently — so a failure here just means a slightly
  // sharper receipt, not a broken export.
  const blurred = document.createElement("canvas");
  blurred.width = w;
  blurred.height = h;
  const bctx = blurred.getContext("2d");
  try {
    bctx.filter = "blur(0.7px)";
  } catch (err) {
    console.warn("Scan effect: canvas blur filter unsupported, continuing without softening.", err);
  }
  bctx.drawImage(sourceCanvas, 0, 0);

  // Rotation onto a padded canvas — clearly visible tilt
  const angle = (Math.random() * 5 - 2.5) * (Math.PI / 180); // -2.5° to 2.5°
  const pad = Math.ceil(Math.max(w, h) * 0.04) + 14;
  const outCanvas = document.createElement("canvas");
  outCanvas.width = w + pad * 2;
  outCanvas.height = h + pad * 2;
  const outCtx = outCanvas.getContext("2d");
  outCtx.fillStyle = paperColor;
  outCtx.fillRect(0, 0, outCanvas.width, outCanvas.height);
  outCtx.translate(outCanvas.width / 2, outCanvas.height / 2);
  outCtx.rotate(angle);
  outCtx.drawImage(blurred, -w / 2, -h / 2);
  return outCanvas;
}
