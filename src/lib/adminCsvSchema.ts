// Column definitions used by the /admin CSV export & import feature.
// Kept separate from the per-tab form field lists in admin/page.tsx because
// CSV needs a couple of extra behaviors the form doesn't (array <-> string
// conversion, boolean defaults, enum validation).

export type AdminTab = "scholarships" | "universities" | "vocational_schools";

export type CsvColumnKind = "text" | "boolean" | "array" | "date";

export interface CsvColumn {
  key: string;
  kind?: CsvColumnKind; // default "text"
  required?: boolean; // non-empty text required (ignored for id)
  /** For booleans: value used when the cell is blank. */
  defaultBoolean?: boolean;
  /**
   * For non-required text columns: whether the DB column is nullable.
   * true  -> a blank cell is written as NULL (application_url, website, ...)
   * false -> a blank cell is written as '' (description_en, coverage_en, ...
   *          these are NOT NULL DEFAULT '', so NULL would violate the constraint)
   */
  nullable?: boolean;
}

const SCHOLARSHIP_COLUMNS: CsvColumn[] = [
  { key: "id" },
  { key: "name_en", required: true },
  { key: "name_km", required: true },
  { key: "provider_en", required: true },
  { key: "provider_km", required: true },
  { key: "description_en" },
  { key: "description_km" },
  // Not required: a scholarship can be listed before it's been classified
  // as full/partial/grant. A blank cell becomes NULL and the site shows
  // an "Not Yet Classified" badge instead of erroring the row out.
  { key: "type", nullable: true },
  { key: "coverage_en" },
  { key: "coverage_km" },
  { key: "eligibility_en" },
  { key: "eligibility_km" },
  { key: "application_url", nullable: true },
  { key: "deadline", kind: "date" },
  { key: "is_active", kind: "boolean", defaultBoolean: true },
  { key: "is_domestic", kind: "boolean", defaultBoolean: true },
];

const UNIVERSITY_COLUMNS: CsvColumn[] = [
  { key: "id" },
  { key: "name_en", required: true },
  { key: "name_km", required: true },
  { key: "type", required: true },
  { key: "is_domestic", kind: "boolean", defaultBoolean: true },
  { key: "location_en" },
  { key: "location_km" },
  { key: "description_en" },
  { key: "description_km" },
  { key: "website", nullable: true },
  { key: "tuition_info_en", nullable: true },
  { key: "tuition_info_km", nullable: true },
  { key: "programs_en", kind: "array" },
  { key: "programs_km", kind: "array" },
];

const VOCATIONAL_COLUMNS: CsvColumn[] = [
  { key: "id" },
  { key: "name_en", required: true },
  { key: "name_km", required: true },
  { key: "location_en" },
  { key: "location_km" },
  { key: "description_en" },
  { key: "description_km" },
  { key: "programs_en", kind: "array" },
  { key: "programs_km", kind: "array" },
  { key: "website", nullable: true },
  { key: "contact", nullable: true },
];

export const ADMIN_CSV_COLUMNS: Record<AdminTab, CsvColumn[]> = {
  scholarships: SCHOLARSHIP_COLUMNS,
  universities: UNIVERSITY_COLUMNS,
  vocational_schools: VOCATIONAL_COLUMNS,
};

// Columns validated against a fixed enum of allowed values.
export const ADMIN_CSV_ENUMS: Partial<Record<AdminTab, Record<string, string[]>>> = {
  scholarships: { type: ["full", "partial", "grant"] },
  universities: { type: ["public", "private"] },
};

// Array-valued cells use ';' to separate items (CSV already uses ',' as the
// field delimiter, and program lists such as "IT; Business" read fine).
export const ARRAY_ITEM_SEPARATOR = ";";
