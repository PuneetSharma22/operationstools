// CSV helpers shared by every bulk-generation flow (fuel bills, rent
// receipts). Pure functions — no DOM, no React — so they are trivially
// testable and cannot drift between the preview table and the generator.

/**
 * Parses raw CSV text into rows of fields, respecting RFC4180-style quoting:
 * a quoted field can contain commas AND actual line breaks (e.g. a
 * spreadsheet export wrapping a multi-line address in quotes) without ending
 * the row.
 *
 * Splitting on "\n" before understanding quotes — the obvious approach —
 * breaks the moment any field spans more than one physical line, since it
 * chops that one row into several fake ones and misaligns every column after
 * it. This scans the whole text char-by-char instead, only starting a new row
 * on a newline that is genuinely outside a quoted field.
 *
 * @param {string} text raw file contents
 * @returns {string[][]} rows of raw (untrimmed) field values
 */
export function parseCSVText(text) {
  const normalized = String(text ?? "").replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < normalized.length; i++) {
    const ch = normalized[i];
    if (inQuotes) {
      if (ch === '"') {
        if (normalized[i + 1] === '"') { field += '"'; i++; }
        else inQuotes = false;
      } else {
        field += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += ch;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  // Drop blank trailing lines.
  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ""));
}

/**
 * Resolves one optional CSV cell against its default:
 *  - blank/missing -> use the default (flagged isDefault so the preview can
 *    render it distinctly, in italics)
 *  - literal "NA" (any case) -> explicitly blank, the default is skipped
 *    entirely (flagged isNA)
 *  - anything else -> the typed value, used as-is
 *
 * @returns {{ value: string, isDefault: boolean, isNA: boolean }}
 */
export function resolveOptional(raw, fallback) {
  const trimmed = (raw || "").trim();
  if (trimmed.toUpperCase() === "NA") return { value: "", isDefault: false, isNA: true };
  if (trimmed === "") return { value: fallback, isDefault: true, isNA: false };
  return { value: trimmed, isDefault: false, isNA: false };
}

/**
 * Turns parsed rows into `{ header: value }` objects plus per-row validation.
 * Used identically by the fuel and rent bulk modals.
 *
 * @param {string} text            raw CSV
 * @param {string[]} requiredCols  headers that must exist
 * @param {(row: object) => string[]} validateRow returns per-row error strings
 */
export function parseCSVRows(text, requiredCols, validateRow) {
  const allRows = parseCSVText(text);
  if (allRows.length < 2) {
    return { rows: [], errors: ["CSV must have a header row and at least one data row"] };
  }
  const headers = allRows[0].map((h) => h.trim().toLowerCase());
  const missing = requiredCols.filter((r) => !headers.includes(r));
  if (missing.length) {
    return { rows: [], errors: [`Missing required columns: ${missing.join(", ")}`] };
  }

  const rows = [];
  const errors = [];
  allRows.slice(1).forEach((vals, i) => {
    const row = {};
    headers.forEach((h, j) => { row[h] = (vals[j] || "").trim(); });
    const rowErrors = validateRow(row);
    rows.push({ ...row, _line: i + 2, _errors: rowErrors });
    if (rowErrors.length) errors.push(`Row ${i + 2}: ${rowErrors.join(", ")}`);
  });
  return { rows, errors };
}

/** Triggers a browser download of a CSV template file. */
export function downloadCSVTemplate(filename, headers, sampleRow) {
  const content = [headers, sampleRow].join("\n");
  const blob = new Blob([content], { type: "text/csv" });
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = filename;
  a.click();
}
