import { type Locale } from "@/types/database";

export function getLocalizedField<T>(
  item: T,
  field: string,
  locale: Locale
): string {
  const key = `${field}_${locale}` as keyof T;
  return (item[key] as string) ?? "";
}

export function getLocalizedArray<T>(
  item: T,
  field: string,
  locale: Locale
): string[] {
  const key = `${field}_${locale}` as keyof T;
  return (item[key] as string[]) ?? [];
}

export function formatDate(dateStr: string | null, locale: Locale): string {
  if (!dateStr) return "-";
  const date = new Date(dateStr);
  return date.toLocaleDateString(locale === "km" ? "km-KH" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function getScholarshipTypeBadgeColor(type: string | null) {
  switch (type) {
    case "full":
      return "bg-green-100 text-green-800";
    case "partial":
      return "bg-blue-100 text-blue-800";
    case "grant":
      return "bg-yellow-100 text-yellow-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
}

/** Translation key for a scholarship's type badge — falls back to
 * "unclassified" when type hasn't been categorized yet (full/partial/grant
 * is optional; some scholarships are listed before that call is made). */
export function getScholarshipTypeKey(type: string | null): string {
  return type ?? "unclassified";
}

export function getApplicationTypeBadgeColor(
  applicationType: string | null
): string {
  switch (applicationType) {
    case "direct":
      return "bg-green-100 text-green-800";
    case "via_school":
      return "bg-gray-100 text-gray-800";
    case "after_enrollment":
      return "bg-blue-100 text-blue-800";
    default:
      return "";
  }
}

/** Translation key for a scholarship's application-type badge — unlike
 * getScholarshipTypeKey, there is no "unclassified" fallback: when
 * application_type is null/empty the badge is not rendered at all. */
export function getApplicationTypeLabelKey(
  applicationType: string | null
): string | null {
  switch (applicationType) {
    case "direct":
      return "applicationTypeDirect";
    case "via_school":
      return "applicationTypeViaSchool";
    case "after_enrollment":
      return "applicationTypeAfterEnrollment";
    default:
      return null;
  }
}

/** Translation key for the one-line hint shown under the application-type
 * badge on the detail page. Same null-means-hidden rule as the label. */
export function getApplicationTypeHintKey(
  applicationType: string | null
): string | null {
  switch (applicationType) {
    case "direct":
      return "applicationTypeHintDirect";
    case "via_school":
      return "applicationTypeHintViaSchool";
    case "after_enrollment":
      return "applicationTypeHintAfterEnrollment";
    default:
      return null;
  }
}
