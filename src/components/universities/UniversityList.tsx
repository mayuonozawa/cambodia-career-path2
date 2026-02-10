"use client";

import { useState, useMemo } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SearchBar } from "@/components/ui/SearchBar";
import { FilterButtons } from "@/components/ui/FilterButtons";
import { UniversityCard } from "./UniversityCard";
import type { University, Locale } from "@/types/database";
import { getLocalizedField } from "@/lib/utils";

interface UniversityWithScholarships extends University {
  scholarship_count?: number;
}

interface UniversityListProps {
  universities: UniversityWithScholarships[];
}

export function UniversityList({ universities }: UniversityListProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const typeOptions = [
    { value: "public", label: t("universities.public") },
    { value: "private", label: t("universities.private") },
  ];

  const filtered = useMemo(() => {
    return universities.filter((u) => {
      const name = getLocalizedField(u, "name", locale).toLowerCase();
      const location = getLocalizedField(u, "location", locale).toLowerCase();
      const q = search.toLowerCase();
      const matchesSearch = !q || name.includes(q) || location.includes(q);
      const matchesType = !typeFilter || u.type === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [universities, search, typeFilter, locale]);

  return (
    <div>
      <div className="space-y-4 mb-8">
        <SearchBar
          placeholder={t("universities.searchPlaceholder")}
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
          {filtered.map((u) => (
            <UniversityCard
              key={u.id}
              university={u}
              scholarshipCount={u.scholarship_count}
            />
          ))}
        </div>
      )}
    </div>
  );
}
