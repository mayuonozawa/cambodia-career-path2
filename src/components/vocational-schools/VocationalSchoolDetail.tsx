"use client";

import { useLocale, useTranslations } from "next-intl";
import { BackButton } from "@/components/ui/BackButton";
import { getLocalizedField, getLocalizedArray } from "@/lib/utils";
import type { VocationalSchool, Locale } from "@/types/database";
import { MapPin, ExternalLink, Phone } from "lucide-react";

interface VocationalSchoolDetailProps {
  school: VocationalSchool;
}

export function VocationalSchoolDetail({
  school,
}: VocationalSchoolDetailProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations();

  const name = getLocalizedField(school, "name", locale);
  const location = getLocalizedField(school, "location", locale);
  const description = getLocalizedField(school, "description", locale);
  const programs = getLocalizedArray(school, "programs", locale);

  return (
    <div>
      <BackButton />

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-3">{name}</h1>
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
            {t("vocationalSchools.programs")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {programs.map((p) => (
              <span
                key={p}
                className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm border border-green-200"
              >
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Contact & Website */}
      <div className="space-y-3">
        {school.contact && (
          <div className="flex items-center gap-2 text-gray-700">
            <Phone className="w-4 h-4 text-gray-400" />
            <span>{school.contact}</span>
          </div>
        )}
        {school.website && (
          <a
            href={school.website}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            {t("universities.website")}
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
      </div>
    </div>
  );
}
