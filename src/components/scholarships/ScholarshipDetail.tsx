"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/Badge";
import { BackButton } from "@/components/ui/BackButton";
import {
  getLocalizedField,
  getScholarshipTypeBadgeColor,
  formatDate,
} from "@/lib/utils";
import type { Scholarship, University, Locale } from "@/types/database";
import { ApplicationInfo } from "@/components/scholarships/ApplicationInfo";
import { Calendar, Building, ExternalLink, CheckCircle } from "lucide-react";

interface ScholarshipDetailProps {
  scholarship: Scholarship;
  relatedUniversities: University[];
}

export function ScholarshipDetail({
  scholarship,
  relatedUniversities,
}: ScholarshipDetailProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations();

  const name = getLocalizedField(scholarship, "name", locale);
  const provider = getLocalizedField(scholarship, "provider", locale);
  const description = getLocalizedField(scholarship, "description", locale);
  const coverage = getLocalizedField(scholarship, "coverage", locale);
  const eligibility = getLocalizedField(scholarship, "eligibility", locale);

  return (
    <div>
      <BackButton />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-3 mb-3">
          <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
          <Badge className={getScholarshipTypeBadgeColor(scholarship.type)}>
            {t(`scholarships.${scholarship.type}`)}
          </Badge>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <Building className="w-4 h-4" />
          <span>{provider}</span>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Coverage */}
        {coverage && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="font-semibold text-green-800 mb-2">
              {t("scholarships.coverage")}
            </h3>
            <p className="text-green-700 text-sm whitespace-pre-line">
              {coverage}
            </p>
          </div>
        )}

        {/* Eligibility */}
        {eligibility && (
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-2">
              {t("scholarships.eligibility")}
            </h3>
            <p className="text-blue-700 text-sm whitespace-pre-line">
              {eligibility}
            </p>
          </div>
        )}
      </div>

      {/* Deadline */}
      {scholarship.deadline && (
        <div className="flex items-center gap-2 text-gray-700 mb-6 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
          <Calendar className="w-5 h-5 text-yellow-600" />
          <span className="font-medium">
            {t("scholarships.deadline")}:{" "}
            {formatDate(scholarship.deadline, locale)}
          </span>
        </div>
      )}

      {/* Description */}
      {description && (
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
      )}

      {/* Application Info (F-009) */}
      <div className="mb-8">
        <ApplicationInfo
          scholarship={scholarship}
          deadlineFormatted={
            scholarship.deadline
              ? formatDate(scholarship.deadline, locale)
              : undefined
          }
        />
      </div>

      {/* Apply Button */}
      {scholarship.application_url && (
        <div className="mb-8">
          <a
            href={scholarship.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-3 rounded-lg transition-colors"
          >
            {t("scholarships.applyNow")}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Related Universities */}
      {relatedUniversities.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            {t("scholarships.relatedUniversities")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relatedUniversities.map((uni) => (
              <Link
                key={uni.id}
                href={`/universities/${uni.id}`}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all"
              >
                <CheckCircle className="w-5 h-5 text-green-500 shrink-0" />
                <div>
                  <p className="font-medium">
                    {getLocalizedField(uni, "name", locale)}
                  </p>
                  <p className="text-sm text-gray-500">
                    {getLocalizedField(uni, "location", locale)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
