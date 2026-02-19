"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { clsx } from "clsx";
import { SearchBar } from "@/components/ui/SearchBar";
import { VocationalSchoolCard } from "./VocationalSchoolCard";
import type { VocationalSchool, Locale } from "@/types/database";
import { getLocalizedField, getLocalizedArray } from "@/lib/utils";
import { useFilterParams } from "@/hooks/useFilterParams";
import { ChevronDown, X } from "lucide-react";

// ── Field category detection ─────────────────────────────────────────────────
const FIELD_CATEGORIES = [
  { value: "it",          key: "fieldIT",          kw: ["it", "electronics", "digital", "computer", "cyber", "software", "cloud"] },
  { value: "trades",      key: "fieldTrades",      kw: ["automotive", "mechanics", "welding", "construction", "electrical", "mechanic"] },
  { value: "hospitality", key: "fieldHospitality", kw: ["hospitality", "cooking", "tourism", "hotel"] },
  { value: "agriculture", key: "fieldAgriculture", kw: ["agriculture", "farming"] },
  { value: "textile",     key: "fieldTextile",     kw: ["sewing", "textile", "garment"] },
] as const;

function schoolMatchesField(programs: string[], fieldFilter: string): boolean {
  const cat = FIELD_CATEGORIES.find((c) => c.value === fieldFilter);
  if (!cat) return true;
  const joined = programs.join(" ").toLowerCase();
  return cat.kw.some((kw) => joined.includes(kw));
}

// ── Shared pill style ────────────────────────────────────────────────────────
const pillBase = "px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap";
const pillActive   = "bg-brand-primary text-white";
const pillInactive = "bg-gray-100 text-gray-700 hover:bg-gray-200";

function CountBadge({ n, active }: { n: number; active: boolean }) {
  return (
    <span className={clsx(
      "ml-1.5 text-xs font-semibold rounded-full px-1.5 py-0.5",
      active ? "bg-white/20" : "bg-gray-200 text-gray-500"
    )}>
      {n}
    </span>
  );
}

interface VocationalSchoolListProps {
  schools: VocationalSchool[];
}

export function VocationalSchoolList({ schools }: VocationalSchoolListProps) {
  const locale = useLocale() as Locale;
  const t  = useTranslations("vocationalSchools");
  const tc = useTranslations("common");

  const {
    search, setSearch,
    locationFilter, setLocationFilter,
    programFilter, setProgramFilter,
    sortOrder, setSortOrder,
  } = useFilterParams();

  const [sortOpen, setSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) setSortOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  // Unique locations from data
  const locations = useMemo(
    () => [...new Set(schools.map((s) => s.location_en).filter(Boolean))].sort(),
    [schools]
  );

  // Badge counts (from full dataset)
  const counts = useMemo(() => {
    const fieldCounts: Record<string, number> = {};
    FIELD_CATEGORIES.forEach((c) => {
      fieldCounts[c.value] = schools.filter((s) =>
        schoolMatchesField(getLocalizedArray(s, "programs", "en"), c.value)
      ).length;
    });
    const locCounts: Record<string, number> = {};
    locations.forEach((loc) => {
      locCounts[loc] = schools.filter((s) => s.location_en === loc).length;
    });
    return { field: fieldCounts, loc: locCounts };
  }, [schools, locations]);

  const filtered = useMemo(() => {
    const results = schools.filter((s) => {
      const name     = getLocalizedField(s, "name", locale).toLowerCase();
      const location = getLocalizedField(s, "location", locale).toLowerCase();
      const q = search.toLowerCase();
      if (q && !name.includes(q) && !location.includes(q)) return false;
      if (locationFilter && s.location_en !== locationFilter) return false;
      if (programFilter) {
        const programs = getLocalizedArray(s, "programs", "en");
        if (!schoolMatchesField(programs, programFilter)) return false;
      }
      return true;
    });

    return results.sort((a, b) => {
      if (sortOrder === "name") {
        return getLocalizedField(a, "name", locale).localeCompare(getLocalizedField(b, "name", locale));
      }
      if (sortOrder === "programs") {
        return (b.programs_en?.length ?? 0) - (a.programs_en?.length ?? 0);
      }
      return 0;
    });
  }, [schools, search, locationFilter, programFilter, sortOrder, locale]);

  // Active filter tags
  const activeFilters: { key: string; label: string; clear: () => void }[] = [];
  if (locationFilter)
    activeFilters.push({ key: "loc", label: `📍 ${locationFilter}`, clear: () => setLocationFilter("") });
  if (programFilter) {
    const cat = FIELD_CATEGORIES.find((c) => c.value === programFilter);
    if (cat) activeFilters.push({ key: "field", label: t(cat.key), clear: () => setProgramFilter("") });
  }

  const currentSort = sortOrder === "name" ? t("sortName") : sortOrder === "programs" ? t("sortPrograms") : t("sortPrograms");
  const toggle = (cur: string, val: string, set: (v: string) => void) => set(cur === val ? "" : val);

  return (
    <div className="space-y-3">

      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">{t("resultsCount", { count: filtered.length })}</p>

        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setSortOpen((v) => !v)}
            className={clsx(pillBase, "flex items-center gap-1.5 border border-gray-200 bg-white hover:bg-gray-50")}
          >
            {currentSort}
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>
          {sortOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10 min-w-44">
              {[
                { value: "programs", label: t("sortPrograms") },
                { value: "name",     label: t("sortName") },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSortOrder(opt.value); setSortOpen(false); }}
                  className={clsx(
                    "w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors",
                    sortOrder === opt.value ? "text-brand-primary font-semibold" : "text-gray-700"
                  )}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Search ── */}
      <SearchBar placeholder={t("searchPlaceholder")} value={search} onChange={setSearch} />

      {/* ── Location filter ── */}
      {locations.length > 1 && (
        <div>
          <p className="text-xs text-gray-400 font-medium mb-1.5">{t("locationLabel")}</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setLocationFilter("")}
              className={clsx(pillBase, locationFilter === "" ? pillActive : pillInactive)}
            >
              {tc("filter")}
              <CountBadge n={schools.length} active={locationFilter === ""} />
            </button>
            {locations.map((loc) => (
              <button
                key={loc}
                onClick={() => toggle(locationFilter, loc, setLocationFilter)}
                className={clsx(pillBase, locationFilter === loc ? pillActive : pillInactive)}
              >
                📍 {loc}
                <CountBadge n={counts.loc[loc] ?? 0} active={locationFilter === loc} />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Field filter ── */}
      <div>
        <p className="text-xs text-gray-400 font-medium mb-1.5">{t("fieldLabel")}</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setProgramFilter("")}
            className={clsx(pillBase, programFilter === "" ? pillActive : pillInactive)}
          >
            {tc("filter")}
            <CountBadge n={schools.length} active={programFilter === ""} />
          </button>
          {FIELD_CATEGORIES.filter((c) => (counts.field[c.value] ?? 0) > 0).map((c) => (
            <button
              key={c.value}
              onClick={() => toggle(programFilter, c.value, setProgramFilter)}
              className={clsx(pillBase, programFilter === c.value ? pillActive : pillInactive)}
            >
              {t(c.key)}
              <CountBadge n={counts.field[c.value] ?? 0} active={programFilter === c.value} />
            </button>
          ))}
        </div>
      </div>

      {/* ── Active filter bar ── */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 px-3 py-2.5 bg-brand-primary/5 rounded-xl border border-brand-primary/15">
          <span className="text-xs text-brand-primary font-medium shrink-0">
            {t("activeFilters", { count: activeFilters.length })}
          </span>
          {activeFilters.map((f) => (
            <button
              key={f.key}
              onClick={f.clear}
              className="flex items-center gap-1 bg-brand-primary text-white text-xs px-2.5 py-1 rounded-full hover:bg-brand-primary/80 transition-colors"
            >
              {f.label} <X className="w-3 h-3" />
            </button>
          ))}
          <button
            onClick={() => { setLocationFilter(""); setProgramFilter(""); }}
            className="text-xs text-gray-400 hover:text-gray-600 underline ml-auto shrink-0"
          >
            {t("resetFilters")}
          </button>
        </div>
      )}

      {/* ── Results ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">{tc("noResults")}</div>
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
