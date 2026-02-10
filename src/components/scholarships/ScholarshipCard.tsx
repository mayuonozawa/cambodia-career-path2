"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/Badge";
import { getLocalizedField, getScholarshipTypeBadgeColor, formatDate } from "@/lib/utils";
import type { Scholarship, Locale } from "@/types/database";
import { Calendar, Building } from "lucide-react";

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

export function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("scholarships");

  const name = getLocalizedField(scholarship, "name", locale);
  const provider = getLocalizedField(scholarship, "provider", locale);
  const coverage = getLocalizedField(scholarship, "coverage", locale);

  return (
    <Link
      href={`/scholarships/${scholarship.id}`}
      className="block p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-300 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {name}
        </h3>
        <Badge className={getScholarshipTypeBadgeColor(scholarship.type)}>
          {t(scholarship.type)}
        </Badge>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-gray-400 shrink-0" />
          <span>{provider}</span>
        </div>
        {scholarship.deadline && (
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400 shrink-0" />
            <span>
              {t("deadline")}: {formatDate(scholarship.deadline, locale)}
            </span>
          </div>
        )}
        {coverage && (
          <p className="text-gray-500 line-clamp-2 mt-2">{coverage}</p>
        )}
      </div>
    </Link>
  );
}
