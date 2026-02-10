"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/Badge";
import { BackButton } from "@/components/ui/BackButton";
import { getLocalizedField, getLocalizedArray } from "@/lib/utils";
import type { University, Scholarship, Locale } from "@/types/database";
import { MapPin, ExternalLink, GraduationCap } from "lucide-react";
import { getScholarshipTypeBadgeColor } from "@/lib/utils";

interface UniversityDetailProps {
  university: University;
  availableScholarships: Scholarship[];
}

export function UniversityDetail({
  university,
  availableScholarships,
}: UniversityDetailProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations();

  const name = getLocalizedField(university, "name", locale);
  const location = getLocalizedField(university, "location", locale);
  const description = getLocalizedField(university, "description", locale);
  const tuition = getLocalizedField(university, "tuition_info", locale);
  const programs = getLocalizedArray(university, "programs", locale);

  return (
    <div>
      <BackButton />

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start gap-3 mb-3">
          <h1 className="text-2xl md:text-3xl font-bold">{name}</h1>
          <Badge
            className={
              university.type === "public"
                ? "bg-blue-100 text-blue-800"
                : "bg-purple-100 text-purple-800"
            }
          >
            {t(`universities.${university.type}`)}
          </Badge>
        </div>
        {location && (
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="w-4 h-4" />
            <span>{location}</span>
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <div className="mb-8">
          <p className="text-gray-700 leading-relaxed whitespace-pre-line">
            {description}
          </p>
        </div>
      )}

      {/* Programs */}
      {programs.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-3">
            {t("universities.programs")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {programs.map((p) => (
              <span
                key={p}
                className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm border border-blue-200"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Tuition */}
      {tuition && (
        <div className="mb-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="font-semibold mb-2">{t("universities.tuition")}</h3>
          <p className="text-gray-700 text-sm whitespace-pre-line">{tuition}</p>
        </div>
      )}

      {/* Website */}
      {university.website && (
        <div className="mb-8">
          <a
            href={university.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            {t("universities.website")}
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      )}

      {/* Available Scholarships (Reverse lookup) */}
      {availableScholarships.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-4">
            {t("universities.availableScholarships")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {availableScholarships.map((s) => (
              <Link
                key={s.id}
                href={`/scholarships/${s.id}`}
                className="flex items-center gap-3 p-4 border border-gray-200 rounded-lg hover:border-yellow-300 hover:bg-yellow-50 transition-all"
              >
                <GraduationCap className="w-5 h-5 text-yellow-500 shrink-0" />
                <div>
                  <p className="font-medium">
                    {getLocalizedField(s, "name", locale)}
                  </p>
                  <Badge className={getScholarshipTypeBadgeColor(s.type)}>
                    {t(`scholarships.${s.type}`)}
                  </Badge>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
