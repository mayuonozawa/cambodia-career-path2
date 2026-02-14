"use client";

import { useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterButtons } from "@/components/ui/FilterButtons";
import { ScholarshipCard } from "./ScholarshipCard";
import type { Scholarship, Locale } from "@/types/database";
import { getLocalizedField } from "@/lib/utils";
import { useFilterParams } from "@/hooks/useFilterParams";

interface ScholarshipListProps {
  scholarships: Scholarship[];
}

export function ScholarshipList({ scholarships }: ScholarshipListProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const { search, setSearch, typeFilter, setTypeFilter } = useFilterParams();

  const typeOptions = [
    { value: "full", label: t("scholarships.full") },
    { value: "partial", label: t("scholarships.partial") },
    { value: "grant", label: t("scholarships.grant") },
  ];

  const filtered = useMemo(() => {
    const results = scholarships.filter((s) => {
      const name = getLocalizedField(s, "name", locale).toLowerCase();
      const provider = getLocalizedField(s, "provider", locale).toLowerCase();
      const q = search.toLowerCase();
      const matchesSearch = !q || name.includes(q) || provider.includes(q);
      const matchesType = !typeFilter || s.type === typeFilter;
      return matchesSearch && matchesType;
    });

    // Sort: active with nearest deadline first, no deadline next, closed last
    return results.sort((a, b) => {
      const now = Date.now();
      const deadlineA = a.deadline ? new Date(a.deadline).getTime() : null;
      const deadlineB = b.deadline ? new Date(b.deadline).getTime() : null;
      const closedA = deadlineA !== null && deadlineA < now;
      const closedB = deadlineB !== null && deadlineB < now;

      // Closed items go to the bottom
      if (closedA && !closedB) return 1;
      if (!closedA && closedB) return -1;

      // Among active: earliest deadline first
      if (deadlineA !== null && deadlineB !== null) return deadlineA - deadlineB;

      // Items with deadline before items without
      if (deadlineA !== null && deadlineB === null) return -1;
      if (deadlineA === null && deadlineB !== null) return 1;

      return 0;
    });
  }, [scholarships, search, typeFilter, locale]);

  return (
    <div>
      <div className="space-y-4 mb-8">
        <SearchBar
          placeholder={t("scholarships.searchPlaceholder")}
          value={search}
          onChange={setSearch}
        />
        <FilterButtons
          options={typeOptions}
          value={typeFilter}
          onChange={setTypeFilter}
          allLabel={t("common.filter")}
        />
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {t("common.noResults")}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((s) => (
            <ScholarshipCard key={s.id} scholarship={s} />
          ))}
        </div>
      )}
    </div>
  );
}
