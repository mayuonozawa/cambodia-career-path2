"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { getLocalizedField, getLocalizedArray } from "@/lib/utils";
import type { VocationalSchool, Locale } from "@/types/database";
import { MapPin } from "lucide-react";

interface VocationalSchoolCardProps {
  school: VocationalSchool;
}

export function VocationalSchoolCard({ school }: VocationalSchoolCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations();

  const name = getLocalizedField(school, "name", locale);
  const location = getLocalizedField(school, "location", locale);
  const programs = getLocalizedArray(school, "programs", locale);

  return (
    <Link
      href={`/vocational-schools/${school.id}`}
      className="block p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-brand-primary/40 transition-all"
    >
      <div className="flex items-start justify-between gap-2 mb-3">
        <h3 className="text-base font-semibold text-gray-900 line-clamp-2 flex-1">
          {name}
        </h3>
        {programs.length > 0 && (
          <span className="shrink-0 text-xs font-semibold bg-brand-primary/10 text-brand-primary px-2 py-0.5 rounded-full">
            {t("vocationalSchools.programsCount", { count: programs.length })}
          </span>
        )}
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        {location && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-gray-400 shrink-0" />
            <span>{location}</span>
          </div>
        )}
        {programs.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {programs.slice(0, 3).map((p) => (
              <span
                key={p}
                className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs"
              >
                {p}
              </span>
            ))}
            {programs.length > 3 && (
              <span className="px-2 py-0.5 text-gray-400 text-xs">
                +{programs.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
