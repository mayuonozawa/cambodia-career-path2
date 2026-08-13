"use client";

import { useTranslations } from "next-intl";
import { Info } from "lucide-react";

/**
 * Short "this is reference info, verify with the official source" notice.
 * Shown on scholarship/university/vocational-school list and detail pages
 * so the accuracy/currency disclaimer in the Terms (Article 5) is visibly
 * backed up in the UI, not just buried in legal text.
 */
export function InfoDisclaimer() {
  const t = useTranslations("common");

  return (
    <div className="flex items-start gap-2 px-4 py-3 bg-blue-50 border border-blue-100 rounded-xl text-sm text-blue-800">
      <Info className="w-4 h-4 mt-0.5 shrink-0 text-blue-500" />
      <p className="leading-relaxed">{t("accuracyNotice")}</p>
    </div>
  );
}
