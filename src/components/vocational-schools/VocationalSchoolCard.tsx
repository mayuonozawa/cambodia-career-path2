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
      className="block p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-green-300 transition-all"
    >
      <h3 className="text-lg font-semibold text-gray-900 mb-3 line-clamp-2">
        {name}
      </h3>

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
                className="px-2 py-0.5 bg-green-50 text-green-700 rounded text-xs"
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
