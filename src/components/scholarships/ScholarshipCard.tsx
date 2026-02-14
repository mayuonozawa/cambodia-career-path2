"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/Badge";
import { getLocalizedField, getScholarshipTypeBadgeColor, formatDate } from "@/lib/utils";
import type { Scholarship, Locale } from "@/types/database";
import { Calendar, Building, Clock, AlertTriangle } from "lucide-react";

interface ScholarshipCardProps {
  scholarship: Scholarship;
}

function getDaysRemaining(deadline: string | null): number | null {
  if (!deadline) return null;
  const deadlineDate = new Date(deadline);
  const now = new Date();
  return Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function ScholarshipCard({ scholarship }: ScholarshipCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("scholarships");

  const name = getLocalizedField(scholarship, "name", locale);
  const provider = getLocalizedField(scholarship, "provider", locale);
  const coverage = getLocalizedField(scholarship, "coverage", locale);

  const daysRemaining = getDaysRemaining(scholarship.deadline);
  const isClosed = daysRemaining !== null && daysRemaining <= 0;
  const isUrgent = daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 7;
  const isApproaching = daysRemaining !== null && daysRemaining > 7 && daysRemaining <= 30;

  return (
    <Link
      href={`/scholarships/${scholarship.id}`}
      className={`block p-5 bg-white border rounded-xl hover:shadow-md transition-all ${
        isClosed
          ? "border-gray-200 opacity-70"
          : isUrgent
          ? "border-red-300 hover:border-red-400 ring-1 ring-red-100"
          : isApproaching
          ? "border-amber-200 hover:border-amber-300"
          : "border-gray-200 hover:border-brand-primary-300"
      }`}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {name}
        </h3>
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <Badge className={getScholarshipTypeBadgeColor(scholarship.type)}>
            {t(scholarship.type)}
          </Badge>
          {isClosed && (
            <Badge className="bg-gray-100 text-gray-500">
              {t("closed")}
            </Badge>
          )}
          {isUrgent && (
            <Badge className="bg-red-100 text-red-700 animate-pulse">
              <span className="flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {t("daysRemaining", { days: daysRemaining })}
              </span>
            </Badge>
          )}
          {isApproaching && (
            <Badge className="bg-amber-100 text-amber-700">
              <span className="flex items-center gap-1">
                <Clock className="w-3 h-3" />
                {t("daysRemaining", { days: daysRemaining })}
              </span>
            </Badge>
          )}
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Building className="w-4 h-4 text-gray-400 shrink-0" />
          <span>{provider}</span>
        </div>
        {scholarship.deadline && (
          <div className="flex items-center gap-2">
            <Calendar className={`w-4 h-4 shrink-0 ${
              isClosed ? "text-gray-300" : isUrgent ? "text-red-400" : isApproaching ? "text-amber-400" : "text-gray-400"
            }`} />
            <span className={isClosed ? "line-through text-gray-400" : ""}>
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
