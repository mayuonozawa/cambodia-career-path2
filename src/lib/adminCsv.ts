import { parseCSV, toCSV } from "@/lib/csv";
import {
  ADMIN_CSV_COLUMNS,
  ADMIN_CSV_ENUMS,
  ARRAY_ITEM_SEPARATOR,
  type AdminTab,
  type CsvColumn,
} from "@/lib/adminCsvSchema";

// --- Export -----------------------------------------------------------

export function buildExportCSV(tab: AdminTab, rows: Record<string, unknown>[]): string {
  const columns = ADMIN_CSV_COLUMNS[tab];
  const headers = columns.map((c) => c.key);
  const csvRows = rows.map((row) =>
    columns.map((c) => {
      const value = row[c.key];
      if (value == null) return "";
      if (c.kind === "array") {
        return Array.isArray(value) ? value.join(ARRAY_ITEM_SEPARATOR) : String(value);
      }
      if (c.kind === "boolean") return value ? "true" : "false";
      return String(value);
    })
  );
  return toCSV(headers, csvRows);
}

// --- Shared cell parsing -------------------------------------------------

export interface ImportRowError {
  row: number; // 1-based, matches spreadsheet row numbers (header = row 1)
  message: string;
}

const TRUE_VALUES = new Set(["true", "1", "yes", "y", "はい"]);
const FALSE_VALUES = new Set(["false", "0", "no", "n", "いいえ"]);
const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function parseBoolean(value: string, fallback: boolean): boolean | null {
  if (value === "") return fallback;
  const v = value.trim().toLowerCase();
  if (TRUE_VALUES.has(v)) return true;
  if (FALSE_VALUES.has(v)) return false;
  return null; // unrecognized
}

type CellResult = { ok: true; value: unknown } | { ok: false; error: string };

/** Parses one raw CSV cell according to its column definition. Shared by
 * the full-row importer and the single-column importer so both apply
 * exactly the same validation rules. */
function parseCell(col: CsvColumn, rawValue: string, enumValues: string[] | undefined): CellResult {
  const value = rawValue.trim();

  if (col.required && !value) {
    return { ok: false, error: `${col.key} が空です` };
  }

  if (col.kind === "boolean") {
    const parsed = parseBoolean(value, col.defaultBoolean ?? true);
    if (parsed === null) {
      return { ok: false, error: `${col.key} の値 "${value}" はtrue/falseとして解釈できません` };
    }
    return { ok: true, value: parsed };
  }

  if (col.kind === "array") {
    return {
      ok: true,
      value: value ? value.split(ARRAY_ITEM_SEPARATOR).map((s) => s.trim()).filter(Boolean) : [],
    };
  }

  if (col.kind === "date") {
    if (value && !DATE_RE.test(value)) {
      return { ok: false, error: `${col.key} の値 "${value}" はYYYY-MM-DD形式で入力してください` };
    }
    return { ok: true, value: value || null };
  }

  // plain text column
  if (enumValues && value && !enumValues.includes(value)) {
    return {
      ok: false,
      error: `${col.key} の値 "${value}" は ${enumValues.join(" / ")} のいずれかである必要があります`,
    };
  }
  if (value === "") {
    // NOT NULL DEFAULT '' columns (description_en, coverage_en, ...) must get ''
    // rather than NULL, or the insert/update violates the NOT NULL constraint.
    return { ok: true, value: col.nullable ? null : "" };
  }
  return { ok: true, value };
}

function parseIdCell(rawValue: string): { ok: true; id: string | null } | { ok: false; error: string } {
  const value = rawValue.trim();
  if (!value) return { ok: true, id: null };
  if (!UUID_RE.test(value)) {
    return {
      ok: false,
      error: `id の値 "${value}" はUUID形式ではありません（空欄にすると新規追加として扱われます）`,
    };
  }
  return { ok: true, id: value };
}

function readHeader(table: string[][]): Record<string, number> {
  const header = table[0].map((h) => h.trim());
  const colIndex: Record<string, number> = {};
  header.forEach((h, i) => {
    colIndex[h] = i;
  });
  return colIndex;
}

// --- Full-row import ----------------------------------------------------

export interface ImportResult {
  inserted: number;
  upserted: number; // rows that had an id (created-with-explicit-id or updated)
  errors: ImportRowError[];
}

/**
 * Parses CSV text into per-table row objects ready for Supabase, split into
 * an insert batch (no id -> DB generates one) and an upsert batch (id
 * present -> update if it exists, insert-with-that-id otherwise).
 * Invalid rows are collected as errors and skipped rather than aborting
 * the whole import.
 *
 * Every column in the schema is read from every row (missing/blank cells
 * become '' or null) — this means each imported row REPLACES the full
 * existing row when updating. To touch only one field across many rows,
 * use parseSingleColumnUpdateCSV instead.
 */
export function parseImportCSV(
  tab: AdminTab,
  text: string
): { toInsert: Record<string, unknown>[]; toUpsert: Record<string, unknown>[]; errors: ImportRowError[] } {
  const columns = ADMIN_CSV_COLUMNS[tab];
  const enumMap = ADMIN_CSV_ENUMS[tab] ?? {};
  const table = parseCSV(text);

  const errors: ImportRowError[] = [];
  const toInsert: Record<string, unknown>[] = [];
  const toUpsert: Record<string, unknown>[] = [];

  if (table.length === 0) {
    return { toInsert, toUpsert, errors: [{ row: 0, message: "空のファイルです" }] };
  }

  const colIndex = readHeader(table);

  const missingRequired = columns.filter((c) => c.required && !(c.key in colIndex));
  if (missingRequired.length > 0) {
    return {
      toInsert,
      toUpsert,
      errors: [
        {
          row: 1,
          message: `必須列が見つかりません: ${missingRequired.map((c) => c.key).join(", ")}`,
        },
      ],
    };
  }

  for (let r = 1; r < table.length; r++) {
    const raw = table[r];
    const rowNum = r + 1; // header is row 1
    if (raw.every((cell) => cell.trim() === "")) continue; // blank line

    const obj: Record<string, unknown> = {};
    let rowError: string | null = null;

    for (const col of columns) {
      const cellText = colIndex[col.key] !== undefined ? raw[colIndex[col.key]] ?? "" : "";

      if (col.key === "id") {
        const idResult = parseIdCell(cellText);
        if (!idResult.ok) {
          rowError = idResult.error;
          break;
        }
        if (idResult.id) obj.id = idResult.id;
        continue;
      }

      const result = parseCell(col, cellText, enumMap[col.key]);
      if (!result.ok) {
        rowError = result.error;
        break;
      }
      obj[col.key] = result.value;
    }

    if (rowError) {
      errors.push({ row: rowNum, message: rowError });
      continue;
    }

    if (obj.id) {
      toUpsert.push(obj);
    } else {
      toInsert.push(obj);
    }
  }

  return { toInsert, toUpsert, errors };
}

// --- Single-column update -------------------------------------------------

export interface SingleColumnUpdate {
  id: string;
  value: unknown;
}

export interface SingleColumnImportResult {
  updates: SingleColumnUpdate[];
  errors: ImportRowError[];
}

/**
 * Parses a CSV that should only contain 'id' and one target column, for
 * updating that single field across many rows without touching anything
 * else. Only 'id' and the target column are read — any other columns
 * present in the file are ignored. Rows with no id are skipped as errors
 * (this mode never creates new rows, since the point is a narrow patch).
 */
export function parseSingleColumnUpdateCSV(
  tab: AdminTab,
  columnKey: string,
  text: string
): SingleColumnImportResult {
  const columns = ADMIN_CSV_COLUMNS[tab];
  const col = columns.find((c) => c.key === columnKey);
  const errors: ImportRowError[] = [];
  const updates: SingleColumnUpdate[] = [];

  if (!col || col.key === "id") {
    return { updates, errors: [{ row: 0, message: `不明な列です: ${columnKey}` }] };
  }

  const enumMap = ADMIN_CSV_ENUMS[tab] ?? {};
  const table = parseCSV(text);

  if (table.length === 0) {
    return { updates, errors: [{ row: 0, message: "空のファイルです" }] };
  }

  const colIndex = readHeader(table);
  if (!("id" in colIndex) || !(columnKey in colIndex)) {
    return {
      updates,
      errors: [{ row: 1, message: `"id" と "${columnKey}" の両方の列が必要です` }],
    };
  }

  for (let r = 1; r < table.length; r++) {
    const raw = table[r];
    const rowNum = r + 1;
    if (raw.every((cell) => cell.trim() === "")) continue;

    const idResult = parseIdCell(raw[colIndex.id] ?? "");
    if (!idResult.ok) {
      errors.push({ row: rowNum, message: idResult.error });
      continue;
    }
    if (!idResult.id) {
      errors.push({ row: rowNum, message: "id が空です（このモードは既存行の更新のみ対応しています）" });
      continue;
    }

    const cellResult = parseCell(col, raw[colIndex[columnKey]] ?? "", enumMap[columnKey]);
    if (!cellResult.ok) {
      errors.push({ row: rowNum, message: cellResult.error });
      continue;
    }

    updates.push({ id: idResult.id, value: cellResult.value });
  }

  return { updates, errors };
}
