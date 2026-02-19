"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { clsx } from "clsx";
import { SearchBar } from "@/components/ui/SearchBar";
import { ScholarshipCard } from "./ScholarshipCard";
import type { Scholarship, Locale } from "@/types/database";
import { getLocalizedField } from "@/lib/utils";
import { useFilterParams } from "@/hooks/useFilterParams";
import { ChevronDown, X } from "lucide-react";

// ── Destination detection ────────────────────────────────────────────────────
const OVERSEAS_KEYWORDS = [
  "japan", "japanese", "jica", "mext",
  "korea", "korean", "gks", "niied", "koica",
  "china", "chinese", "csc",
  "singapore", "singaporean",
  "hungary", "hungarian", "hungaricum", "stipendium",
  "russia", "russian", "turkey", "turkish",
  "india", "indian", "taiwan", "vietnam",
  "europe", "european",
  "uwc", "uwcsea",
  "study in", "exchange program", "overseas", "abroad",
  "asian development bank",
];

function detectDestination(s: Scholarship): "domestic" | "overseas" {
  const text = [s.name_en, s.provider_en, s.description_en].join(" ").toLowerCase();
  return OVERSEAS_KEYWORDS.some((kw) => text.includes(kw)) ? "overseas" : "domestic";
}

function getDaysRemaining(deadline: string | null): number | null {
  if (!deadline) return null;
  return Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
}

// ── Shared pill style ────────────────────────────────────────────────────────
const pillBase = "px-3 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap";
const pillActive = "bg-brand-primary text-white";
const pillInactive = "bg-gray-100 text-gray-700 hover:bg-gray-200";

interface ScholarshipListProps {
  scholarships: Scholarship[];
}

export function ScholarshipList({ scholarships }: ScholarshipListProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("scholarships");
  const tCommon = useTranslations("common");

  const {
    search, setSearch,
    typeFilter, setTypeFilter,
    deadlineFilter, setDeadlineFilter,
    sortOrder, setSortOrder,
    destinationFilter, setDestinationFilter,
  } = useFilterParams();

  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Badge counts from full dataset
  const counts = useMemo(() => ({
    domestic: scholarships.filter((s) => detectDestination(s) === "domestic").length,
    overseas: scholarships.filter((s) => detectDestination(s) === "overseas").length,
    urgent: scholarships.filter((s) => { const d = getDaysRemaining(s.deadline); return d !== null && d > 0 && d <= 7; }).length,
    soon:   scholarships.filter((s) => { const d = getDaysRemaining(s.deadline); return d !== null && d > 0 && d <= 30; }).length,
    full:    scholarships.filter((s) => s.type === "full").length,
    partial: scholarships.filter((s) => s.type === "partial").length,
    grant:   scholarships.filter((s) => s.type === "grant").length,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [scholarships]);

  const filtered = useMemo(() => {
    const now = Date.now();
    const results = scholarships.filter((s) => {
      const name     = getLocalizedField(s, "name", locale).toLowerCase();
      const provider = getLocalizedField(s, "provider", locale).toLowerCase();
      const q        = search.toLowerCase();
      if (q && !name.includes(q) && !provider.includes(q)) return false;
      if (typeFilter && s.type !== typeFilter) return false;
      if (deadlineFilter === "urgent") {
        const d = getDaysRemaining(s.deadline);
        if (d === null || d <= 0 || d > 7) return false;
      } else if (deadlineFilter === "soon") {
        const d = getDaysRemaining(s.deadline);
        if (d === null || d <= 0 || d > 30) return false;
      }
      if (destinationFilter && detectDestination(s) !== destinationFilter) return false;
      return true;
    });

    return results.sort((a, b) => {
      if (sortOrder === "name") {
        return getLocalizedField(a, "name", locale).localeCompare(getLocalizedField(b, "name", locale));
      }
      if (sortOrder === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      const dA = a.deadline ? new Date(a.deadline).getTime() : null;
      const dB = b.deadline ? new Date(b.deadline).getTime() : null;
      const closedA = dA !== null && dA < now;
      const closedB = dB !== null && dB < now;
      if (closedA && !closedB) return 1;
      if (!closedA && closedB) return -1;
      if (dA !== null && dB !== null) return dA - dB;
      if (dA !== null) return -1;
      if (dB !== null) return 1;
      return 0;
    });
  }, [scholarships, search, typeFilter, deadlineFilter, destinationFilter, sortOrder, locale]);

  // Active filter tags
  const activeFilters: { key: string; label: string; clear: () => void }[] = [];
  if (destinationFilter === "domestic")
    activeFilters.push({ key: "dest-dom", label: `🏠 ${t("destDomestic")}`, clear: () => setDestinationFilter("") });
  if (destinationFilter === "overseas")
    activeFilters.push({ key: "dest-ov",  label: `✈️ ${t("destOverseas")}`, clear: () => setDestinationFilter("") });
  if (typeFilter === "full")
    activeFilters.push({ key: "type-full",    label: t("full"),    clear: () => setTypeFilter("") });
  if (typeFilter === "partial")
    activeFilters.push({ key: "type-partial", label: t("partial"), clear: () => setTypeFilter("") });
  if (typeFilter === "grant")
    activeFilters.push({ key: "type-grant",   label: t("grant"),   clear: () => setTypeFilter("") });
  if (deadlineFilter === "urgent")
    activeFilters.push({ key: "dl-urgent", label: `🔥 ${t("urgentDeadline")}`, clear: () => setDeadlineFilter("") });
  if (deadlineFilter === "soon")
    activeFilters.push({ key: "dl-soon",   label: `⚡ ${t("soonDeadline")}`,   clear: () => setDeadlineFilter("") });

  const currentSortLabel =
    sortOrder === "newest" ? t("sortNewest")
    : sortOrder === "name"   ? t("sortName")
    : t("sortDeadline");

  // Toggle helper: if already selected, clear it
  const toggleType     = (v: string) => setTypeFilter(typeFilter === v ? "" : v);
  const toggleDeadline = (v: string) => setDeadlineFilter(deadlineFilter === v ? "" : v);
  const toggleDest     = (v: string) => setDestinationFilter(destinationFilter === v ? "" : v);

  return (
    <div className="space-y-3">

      {/* ── Header: count + sort ── */}
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-500">
          {t("resultsCount", { count: filtered.length })}
        </p>

        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setSortDropdownOpen((v) => !v)}
            className={clsx(pillBase, "flex items-center gap-1.5 border border-gray-200 bg-white hover:bg-gray-50")}
          >
            {currentSortLabel}
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {sortDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10 min-w-44">
              {[
                { value: "",        label: t("sortDeadline") },
                { value: "newest",  label: t("sortNewest") },
                { value: "name",    label: t("sortName") },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSortOrder(opt.value); setSortDropdownOpen(false); }}
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
      <SearchBar
        placeholder={t("searchPlaceholder")}
        value={search}
        onChange={setSearch}
      />

      {/* ── Destination filter ── */}
      <div>
        <p className="text-xs text-gray-400 font-medium mb-1.5">{t("destinationLabel")}</p>
        <div className="flex flex-wrap gap-2">
          {[
            { value: "",         label: t("destAll"),     count: scholarships.length },
            { value: "domestic", label: `🏠 ${t("destDomestic")}`, count: counts.domestic },
            { value: "overseas", label: `✈️ ${t("destOverseas")}`, count: counts.overseas },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleDest(opt.value)}
              className={clsx(pillBase, destinationFilter === opt.value ? pillActive : pillInactive)}
            >
              {opt.label}
              <span className={clsx(
                "ml-1.5 text-xs font-semibold rounded-full px-1.5 py-0.5",
                destinationFilter === opt.value ? "bg-white/20" : "bg-gray-200 text-gray-500"
              )}>
                {opt.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Type filter ── */}
      <div>
        <p className="text-xs text-gray-400 font-medium mb-1.5">{t("type")}</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setTypeFilter("")}
            className={clsx(pillBase, typeFilter === "" ? pillActive : pillInactive)}
          >
            {tCommon("filter")}
          </button>
          {[
            { value: "full",    label: t("full"),    count: counts.full },
            { value: "partial", label: t("partial"), count: counts.partial },
            { value: "grant",   label: t("grant"),   count: counts.grant },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleType(opt.value)}
              className={clsx(pillBase, typeFilter === opt.value ? pillActive : pillInactive)}
            >
              {opt.label}
              <span className={clsx(
                "ml-1.5 text-xs font-semibold rounded-full px-1.5 py-0.5",
                typeFilter === opt.value ? "bg-white/20" : "bg-gray-200 text-gray-500"
              )}>
                {opt.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Deadline filter ── */}
      <div>
        <p className="text-xs text-gray-400 font-medium mb-1.5">{t("deadline")}</p>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setDeadlineFilter("")}
            className={clsx(pillBase, deadlineFilter === "" ? pillActive : pillInactive)}
          >
            {tCommon("filter")}
          </button>
          {[
            { value: "urgent", label: `🔥 ${t("urgentDeadline")}`, count: counts.urgent },
            { value: "soon",   label: `⚡ ${t("soonDeadline")}`,   count: counts.soon },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => toggleDeadline(opt.value)}
              className={clsx(pillBase, deadlineFilter === opt.value ? pillActive : pillInactive)}
            >
              {opt.label}
              <span className={clsx(
                "ml-1.5 text-xs font-semibold rounded-full px-1.5 py-0.5",
                deadlineFilter === opt.value ? "bg-white/20" : "bg-gray-200 text-gray-500"
              )}>
                {opt.count}
              </span>
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
              {f.label}
              <X className="w-3 h-3" />
            </button>
          ))}
          <button
            onClick={() => { setTypeFilter(""); setDeadlineFilter(""); setDestinationFilter(""); }}
            className="text-xs text-gray-400 hover:text-gray-600 underline ml-auto shrink-0"
          >
            {t("resetFilters")}
          </button>
        </div>
      )}

      {/* ── Results ── */}
      {filtered.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {tCommon("noResults")}
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
