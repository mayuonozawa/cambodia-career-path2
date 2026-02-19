"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/Badge";
import { getLocalizedField, getLocalizedArray } from "@/lib/utils";
import type { University, Locale } from "@/types/database";
import { MapPin } from "lucide-react";

interface UniversityCardProps {
  university: University;
  scholarshipCount?: number;
}

export function UniversityCard({
  university,
  scholarshipCount,
}: UniversityCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations();

  const name = getLocalizedField(university, "name", locale);
  const location = getLocalizedField(university, "location", locale);
  const programs = getLocalizedArray(university, "programs", locale);

  return (
    <Link
      href={`/universities/${university.id}`}
      className="block p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-brand-primary/40 transition-all"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
          {name}
        </h3>
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
        {typeof scholarshipCount === "number" && scholarshipCount > 0 && (
          <p className="text-brand-primary font-medium mt-2 text-sm">
            🎓 {t("universities.scholarshipsAvailable", { count: scholarshipCount })}
          </p>
        )}
      </div>
    </Link>
  );
}
