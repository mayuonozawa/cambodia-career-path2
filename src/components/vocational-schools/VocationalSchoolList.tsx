"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SearchBar } from "@/components/ui/SearchBar";
import { VocationalSchoolCard } from "./VocationalSchoolCard";
import type { VocationalSchool, Locale } from "@/types/database";
import { getLocalizedField } from "@/lib/utils";
import { useFilterParams } from "@/hooks/useFilterParams";

interface VocationalSchoolListProps {
  schools: VocationalSchool[];
}

export function VocationalSchoolList({ schools }: VocationalSchoolListProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const { search, setSearch } = useFilterParams();

  const filtered = useMemo(() => {
    return schools.filter((s) => {
      const name = getLocalizedField(s, "name", locale).toLowerCase();
      const location = getLocalizedField(s, "location", locale).toLowerCase();
      const q = search.toLowerCase();
      return !q || name.includes(q) || location.includes(q);
    });
  }, [schools, search, locale]);

  return (
    <div>
      <div className="mb-8">
        <SearchBar
          placeholder={t("vocationalSchools.searchPlaceholder")}
          value={search}
          onChange={setSearch}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {t("common.noResults")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((s) => (
            <VocationalSchoolCard key={s.id} school={s} />
          ))}
        </div>
      )}
    </div>
  );
}
