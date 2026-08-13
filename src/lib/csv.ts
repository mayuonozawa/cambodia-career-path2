// Minimal RFC4180-ish CSV parser/stringifier (no external dependency).
// Handles quoted fields with embedded commas, quotes, and newlines.

/** Parses CSV text into rows of raw string cells (no header handling). */
export function parseCSV(text: string): string[][] {
  // strip BOM if present (common when files are saved from Excel/Sheets)
  if (text.charCodeAt(0) === 0xfeff) {
    text = text.slice(1);
  }

  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  const n = text.length;

  while (i < n) {
    const c = text[i];

    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += c;
      i += 1;
      continue;
    }

    if (c === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i += 1;
      continue;
    }
    if (c === "\r") {
      i += 1;
      continue;
    }
    if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i += 1;
      continue;
    }
    field += c;
    i += 1;
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  // drop fully-blank trailing lines
  return rows.filter((r) => !(r.length === 1 && r[0].trim() === ""));
}

function escapeCSVField(value: string): string {
  if (/[",\r\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

/** Builds CSV text (CRLF line endings) from a header row and data rows. */
export function toCSV(headers: string[], rows: string[][]): string {
  return [headers, ...rows]
    .map((r) => r.map(escapeCSVField).join(","))
    .join("\r\n");
}

/** Triggers a browser download of the given CSV text. */
export function downloadCSV(content: string, filename: string) {
  // Prefix with BOM so Excel / Google Sheets detect UTF-8 correctly (important for Khmer text).
  const blob = new Blob(["﻿" + content], {
    type: "text/csv;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
