"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { clsx } from "clsx";
import { SearchBar } from "@/components/ui/SearchBar";
import { UniversityCard } from "./UniversityCard";
import type { University, Locale } from "@/types/database";
import { getLocalizedField, getLocalizedArray } from "@/lib/utils";
import { useFilterParams } from "@/hooks/useFilterParams";
import { ChevronDown, X } from "lucide-react";

// ── Program category detection ───────────────────────────────────────────────
const PROG_CATEGORIES = [
  { value: "it",          key: "fieldIT",          kw: ["computer", "it", "electronics", "software", "digital", "cyber", "cloud"] },
  { value: "business",    key: "fieldBusiness",    kw: ["business", "management", "global affairs", "commerce", "economics"] },
  { value: "law",         key: "fieldLaw",         kw: ["law"] },
  { value: "engineering", key: "fieldEngineering", kw: ["engineering"] },
  { value: "medical",     key: "fieldMedical",     kw: ["medicine", "pharmacy", "dentistry", "nursing", "health"] },
  { value: "science",     key: "fieldScience",     kw: ["science"] },
  { value: "agriculture", key: "fieldAgriculture", kw: ["agriculture"] },
  { value: "education",   key: "fieldEducation",   kw: ["education"] },
] as const;

function universityMatchesProgram(programs: string[], programFilter: string): boolean {
  const cat = PROG_CATEGORIES.find((c) => c.value === programFilter);
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

interface UniversityWithScholarships extends University {
  scholarship_count?: number;
}

interface UniversityListProps {
  universities: UniversityWithScholarships[];
}

export function UniversityList({ universities }: UniversityListProps) {
  const locale = useLocale() as Locale;
  const t  = useTranslations("universities");
  const tc = useTranslations("common");

  const {
    search, setSearch,
    typeFilter, setTypeFilter,
    locationFilter, setLocationFilter,
    programFilter, setProgramFilter,
    hasScholarshipFilter, setHasScholarshipFilter,
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

  // Unique locations derived from data (English canonical)
  const locations = useMemo(
    () => [...new Set(universities.map((u) => u.location_en).filter(Boolean))].sort(),
    [universities]
  );

  // Badge counts (from full dataset, not filtered)
  const counts = useMemo(() => {
    const progCounts: Record<string, number> = {};
    PROG_CATEGORIES.forEach((c) => {
      progCounts[c.value] = universities.filter((u) =>
        universityMatchesProgram(getLocalizedArray(u, "programs", "en"), c.value)
      ).length;
    });
    const locCounts: Record<string, number> = {};
    locations.forEach((loc) => {
      locCounts[loc] = universities.filter((u) => u.location_en === loc).length;
    });
    return {
      public:  universities.filter((u) => u.type === "public").length,
      private: universities.filter((u) => u.type === "private").length,
      hasScholarship: universities.filter((u) => (u.scholarship_count ?? 0) > 0).length,
      loc: locCounts,
      prog: progCounts,
    };
  }, [universities, locations]);

  const filtered = useMemo(() => {
    const results = universities.filter((u) => {
      const name     = getLocalizedField(u, "name", locale).toLowerCase();
      const location = getLocalizedField(u, "location", locale).toLowerCase();
      const q = search.toLowerCase();
      if (q && !name.includes(q) && !location.includes(q)) return false;
      if (typeFilter && u.type !== typeFilter) return false;
      if (locationFilter && u.location_en !== locationFilter) return false;
      if (hasScholarshipFilter && (u.scholarship_count ?? 0) === 0) return false;
      if (programFilter) {
        const programs = getLocalizedArray(u, "programs", "en");
        if (!universityMatchesProgram(programs, programFilter)) return false;
      }
      return true;
    });

    return results.sort((a, b) => {
      if (sortOrder === "name") {
        return getLocalizedField(a, "name", locale).localeCompare(getLocalizedField(b, "name", locale));
      }
      if (sortOrder === "scholarships") {
        return (b.scholarship_count ?? 0) - (a.scholarship_count ?? 0);
      }
      return 0;
    });
  }, [universities, search, typeFilter, locationFilter, hasScholarshipFilter, programFilter, sortOrder, locale]);

  // Active filter tags
  const activeFilters: { key: string; label: string; clear: () => void }[] = [];
  if (typeFilter === "public")
    activeFilters.push({ key: "type-pub", label: `🏫 ${t("public")}`, clear: () => setTypeFilter("") });
  if (typeFilter === "private")
    activeFilters.push({ key: "type-priv", label: `🏢 ${t("private")}`, clear: () => setTypeFilter("") });
  if (locationFilter)
    activeFilters.push({ key: "loc", label: `📍 ${locationFilter}`, clear: () => setLocationFilter("") });
  if (hasScholarshipFilter)
    activeFilters.push({ key: "schol", label: t("hasScholarship"), clear: () => setHasScholarshipFilter(false) });
  if (programFilter) {
    const cat = PROG_CATEGORIES.find((c) => c.value === programFilter);
    if (cat) activeFilters.push({ key: "prog", label: t(cat.key), clear: () => setProgramFilter("") });
  }

  const currentSort = sortOrder === "name" ? t("sortName") : sortOrder === "scholarships" ? t("sortScholarships") : t("sortScholarships");
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
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10 min-w-48">
              {[
                { value: "scholarships", label: t("sortScholarships") },
                { value: "name",        label: t("sortName") },
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

      {/* ── Type filter ── */}
      <div>
        <p className="text-xs text-gray-400 font-medium mb-1.5">{t("type")}</p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "",        label: tc("filter"),  count: universities.length },
            { value: "public",  label: `🏫 ${t("public")}`,  count: counts.public },
            { value: "private", label: `🏢 ${t("private")}`, count: counts.private },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setTypeFilter(opt.value)}
              className={clsx(pillBase, typeFilter === opt.value ? pillActive : pillInactive)}
            >
              {opt.label}
              <CountBadge n={opt.count} active={typeFilter === opt.value} />
            </button>
          ))}

          {/* Has Scholarship toggle */}
          <button
            onClick={() => setHasScholarshipFilter(!hasScholarshipFilter)}
            className={clsx(pillBase, hasScholarshipFilter ? pillActive : pillInactive)}
          >
            {t("hasScholarship")}
            <CountBadge n={counts.hasScholarship} active={hasScholarshipFilter} />
          </button>
        </div>
      </div>

      {/* ── Location filter (shown only when >1 location) ── */}
      {locations.length > 1 && (
        <div>
          <p className="text-xs text-gray-400 font-medium mb-1.5">{t("locationLabel")}</p>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setLocationFilter("")}
              className={clsx(pillBase, locationFilter === "" ? pillActive : pillInactive)}
            >
              {tc("filter")}
              <CountBadge n={universities.length} active={locationFilter === ""} />
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

      {/* ── Program field filter ── */}
      <div>
        <p className="text-xs text-gray-400 font-medium mb-1.5">{t("programLabel")}</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setProgramFilter("")}
            className={clsx(pillBase, programFilter === "" ? pillActive : pillInactive)}
          >
            {tc("filter")}
            <CountBadge n={universities.length} active={programFilter === ""} />
          </button>
          {PROG_CATEGORIES.filter((c) => (counts.prog[c.value] ?? 0) > 0).map((c) => (
            <button
              key={c.value}
              onClick={() => toggle(programFilter, c.value, setProgramFilter)}
              className={clsx(pillBase, programFilter === c.value ? pillActive : pillInactive)}
            >
              {t(c.key)}
              <CountBadge n={counts.prog[c.value] ?? 0} active={programFilter === c.value} />
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
            onClick={() => { setTypeFilter(""); setLocationFilter(""); setProgramFilter(""); setHasScholarshipFilter(false); }}
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
          {filtered.map((u) => (
            <UniversityCard key={u.id} university={u} scholarshipCount={u.scholarship_count} />
          ))}
        </div>
      )}
    </div>
  );
}
