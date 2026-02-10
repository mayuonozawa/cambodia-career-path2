"use client";

import { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterButtons } from "@/components/ui/FilterButtons";
import { ScholarshipCard } from "./ScholarshipCard";
import type { Scholarship, Locale } from "@/types/database";
import { getLocalizedField } from "@/lib/utils";

interface ScholarshipListProps {
  scholarships: Scholarship[];
}

export function ScholarshipList({ scholarships }: ScholarshipListProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const typeOptions = [
    { value: "full", label: t("scholarships.full") },
    { value: "partial", label: t("scholarships.partial") },
    { value: "grant", label: t("scholarships.grant") },
  ];

  const filtered = useMemo(() => {
    return scholarships.filter((s) => {
      const name = getLocalizedField(s, "name", locale).toLowerCase();
      const provider = getLocalizedField(s, "provider", locale).toLowerCase();
      const q = search.toLowerCase();
      const matchesSearch = !q || name.includes(q) || provider.includes(q);
      const matchesType = !typeFilter || s.type === typeFilter;
      return matchesSearch && matchesType;
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
