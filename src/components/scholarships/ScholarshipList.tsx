"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SearchBar } from "@/components/ui/SearchBar";
import { ScholarshipCard } from "./ScholarshipCard";
import type { Scholarship, Locale } from "@/types/database";
import { getLocalizedField } from "@/lib/utils";
import { useFilterParams } from "@/hooks/useFilterParams";
import { ChevronDown, X } from "lucide-react";

// ── Destination detection ────────────────────────────────────────────────────
// Detects whether a scholarship is for studying domestically (Cambodia)
// or overseas, based on name/provider/description text.
const OVERSEAS_KEYWORDS = [
  // Countries
  "japan", "japanese", "jica", "mext",
  "korea", "korean", "gks", "niied", "koica",
  "china", "chinese", "csc",
  "singapore", "singaporean",
  "hungary", "hungarian", "hungaricum", "stipendium",
  "russia", "russian", "turkey", "turkish",
  "india", "indian", "taiwan", "vietnam",
  "europe", "european",
  // Programs / keywords
  "uwc", "uwcsea",
  "study in",
  "exchange program",
  "overseas",
  "abroad",
  "asian development bank",
];

function detectDestination(s: Scholarship): "domestic" | "overseas" {
  const text = [s.name_en, s.provider_en, s.description_en]
    .join(" ")
    .toLowerCase();
  return OVERSEAS_KEYWORDS.some((kw) => text.includes(kw))
    ? "overseas"
    : "domestic";
}

// ── Helper ───────────────────────────────────────────────────────────────────
function getDaysRemaining(deadline: string | null): number | null {
  if (!deadline) return null;
  return Math.ceil(
    (new Date(deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );
}

interface ScholarshipListProps {
  scholarships: Scholarship[];
}

export function ScholarshipList({ scholarships }: ScholarshipListProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("scholarships");
  const tCommon = useTranslations("common");

  const {
    search,
    setSearch,
    typeFilter,
    setTypeFilter,
    deadlineFilter,
    setDeadlineFilter,
    sortOrder,
    setSortOrder,
    destinationFilter,
    setDestinationFilter,
  } = useFilterParams();

  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Pre-compute badge counts from the full dataset
  const counts = useMemo(() => {
    const now = Date.now();
    const domestic = scholarships.filter(
      (s) => detectDestination(s) === "domestic"
    ).length;
    const overseas = scholarships.filter(
      (s) => detectDestination(s) === "overseas"
    ).length;
    return {
      domestic,
      overseas,
      urgent: scholarships.filter((s) => {
        const d = getDaysRemaining(s.deadline);
        return d !== null && d > 0 && d <= 7;
      }).length,
      soon: scholarships.filter((s) => {
        const d = getDaysRemaining(s.deadline);
        return d !== null && d > 0 && d <= 30;
      }).length,
      full: scholarships.filter((s) => s.type === "full").length,
      partial: scholarships.filter((s) => s.type === "partial").length,
      grant: scholarships.filter((s) => s.type === "grant").length,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scholarships]);

  const filtered = useMemo(() => {
    const now = Date.now();

    const results = scholarships.filter((s) => {
      // Text search
      const name = getLocalizedField(s, "name", locale).toLowerCase();
      const provider = getLocalizedField(s, "provider", locale).toLowerCase();
      const q = search.toLowerCase();
      const matchesSearch = !q || name.includes(q) || provider.includes(q);

      // Type filter
      const matchesType = !typeFilter || s.type === typeFilter;

      // Deadline filter
      let matchesDeadline = true;
      if (deadlineFilter === "urgent") {
        const d = getDaysRemaining(s.deadline);
        matchesDeadline = d !== null && d > 0 && d <= 7;
      } else if (deadlineFilter === "soon") {
        const d = getDaysRemaining(s.deadline);
        matchesDeadline = d !== null && d > 0 && d <= 30;
      }

      // Destination filter
      const matchesDestination =
        !destinationFilter || detectDestination(s) === destinationFilter;

      return matchesSearch && matchesType && matchesDeadline && matchesDestination;
    });

    // Sort
    return results.sort((a, b) => {
      if (sortOrder === "name") {
        const nameA = getLocalizedField(a, "name", locale).toLowerCase();
        const nameB = getLocalizedField(b, "name", locale).toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortOrder === "newest") {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      // Default: active nearest deadline first, no deadline next, closed last
      const dA = a.deadline ? new Date(a.deadline).getTime() : null;
      const dB = b.deadline ? new Date(b.deadline).getTime() : null;
      const closedA = dA !== null && dA < now;
      const closedB = dB !== null && dB < now;
      if (closedA && !closedB) return 1;
      if (!closedA && closedB) return -1;
      if (dA !== null && dB !== null) return dA - dB;
      if (dA !== null && dB === null) return -1;
      if (dA === null && dB !== null) return 1;
      return 0;
    });
  }, [scholarships, search, typeFilter, deadlineFilter, destinationFilter, sortOrder, locale]);

  // Active filter tags (removable)
  const activeFilters: { key: string; label: string; clear: () => void }[] = [];
  if (destinationFilter === "domestic")
    activeFilters.push({ key: "dest-dom", label: `🏠 ${t("destDomestic")}`, clear: () => setDestinationFilter("") });
  if (destinationFilter === "overseas")
    activeFilters.push({ key: "dest-ov", label: `✈️ ${t("destOverseas")}`, clear: () => setDestinationFilter("") });
  if (typeFilter === "full")
    activeFilters.push({ key: "type-full", label: `✅ ${t("full")}`, clear: () => setTypeFilter("") });
  if (typeFilter === "partial")
    activeFilters.push({ key: "type-partial", label: `💰 ${t("partial")}`, clear: () => setTypeFilter("") });
  if (typeFilter === "grant")
    activeFilters.push({ key: "type-grant", label: `🎁 ${t("grant")}`, clear: () => setTypeFilter("") });
  if (deadlineFilter === "urgent")
    activeFilters.push({ key: "dl-urgent", label: `🔥 ${t("urgentDeadline")}`, clear: () => setDeadlineFilter("") });
  if (deadlineFilter === "soon")
    activeFilters.push({ key: "dl-soon", label: `⚡ ${t("soonDeadline")}`, clear: () => setDeadlineFilter("") });

  const currentSortLabel =
    sortOrder === "newest" ? t("sortNewest")
    : sortOrder === "name" ? t("sortName")
    : t("sortDeadline");

  return (
    <div>
      {/* ── Header: result count + sort ── */}
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm text-gray-500">
          {t("resultsCount", { count: filtered.length })}
        </p>

        <div className="relative" ref={sortRef}>
          <button
            onClick={() => setSortDropdownOpen((v) => !v)}
            className="flex items-center gap-1.5 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-full px-3 py-1.5 hover:border-brand-primary transition-colors"
          >
            {currentSortLabel}
            <ChevronDown className="w-3.5 h-3.5 text-gray-400" />
          </button>

          {sortDropdownOpen && (
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10 min-w-44">
              {[
                { value: "", label: t("sortDeadline") },
                { value: "newest", label: t("sortNewest") },
                { value: "name", label: t("sortName") },
              ].map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSortOrder(opt.value); setSortDropdownOpen(false); }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${
                    sortOrder === opt.value
                      ? "text-brand-primary font-semibold"
                      : "text-gray-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Search bar ── */}
      <div className="mb-3">
        <SearchBar
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* ── Destination segmented control ── */}
      <div className="mb-3">
        <p className="text-xs font-medium text-gray-400 mb-1.5 px-0.5">
          {t("destinationLabel")}
        </p>
        <div className="flex rounded-xl border border-gray-200 bg-gray-50 p-1 gap-1">
          {[
            { value: "", icon: "🌐", label: t("destAll"), count: scholarships.length },
            { value: "domestic", icon: "🏠", label: t("destDomestic"), count: counts.domestic },
            { value: "overseas", icon: "✈️", label: t("destOverseas"), count: counts.overseas },
          ].map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDestinationFilter(opt.value)}
              className={`flex-1 flex items-center justify-center gap-1 px-2 py-2 rounded-lg text-sm font-medium transition-all ${
                destinationFilter === opt.value
                  ? "bg-white text-gray-900 shadow-sm border border-gray-200"
                  : "text-gray-500 hover:text-gray-700 hover:bg-white/60"
              }`}
            >
              <span className="text-base leading-none">{opt.icon}</span>
              <span className="hidden xs:inline truncate">{opt.label}</span>
              <span
                className={`text-xs rounded-full px-1.5 py-0.5 font-semibold leading-none ${
                  destinationFilter === opt.value
                    ? "bg-brand-primary/10 text-brand-primary"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {opt.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Quick filter chips ── */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-3" style={{ scrollbarWidth: "none" }}>
        <QuickChip
          active={deadlineFilter === "urgent"}
          onClick={() => setDeadlineFilter(deadlineFilter === "urgent" ? "" : "urgent")}
          label={`🔥 ${t("urgentDeadline")}`}
          count={counts.urgent}
          activeClass="bg-red-500 border-red-500 text-white"
          inactiveClass="bg-white border-red-200 text-red-700 hover:bg-red-50"
          countActiveClass="bg-red-400 text-white"
          countInactiveClass="bg-red-100 text-red-600"
        />
        <QuickChip
          active={typeFilter === "full"}
          onClick={() => setTypeFilter(typeFilter === "full" ? "" : "full")}
          label={`✅ ${t("full")}`}
          count={counts.full}
          activeClass="bg-green-600 border-green-600 text-white"
          inactiveClass="bg-white border-green-200 text-green-700 hover:bg-green-50"
          countActiveClass="bg-green-500 text-white"
          countInactiveClass="bg-green-100 text-green-700"
        />
        <QuickChip
          active={deadlineFilter === "soon"}
          onClick={() => setDeadlineFilter(deadlineFilter === "soon" ? "" : "soon")}
          label={`⚡ ${t("soonDeadline")}`}
          count={counts.soon}
          activeClass="bg-amber-500 border-amber-500 text-white"
          inactiveClass="bg-white border-amber-200 text-amber-700 hover:bg-amber-50"
          countActiveClass="bg-amber-400 text-white"
          countInactiveClass="bg-amber-100 text-amber-700"
        />
        <QuickChip
          active={typeFilter === "partial"}
          onClick={() => setTypeFilter(typeFilter === "partial" ? "" : "partial")}
          label={`💰 ${t("partial")}`}
          count={counts.partial}
          activeClass="bg-blue-600 border-blue-600 text-white"
          inactiveClass="bg-white border-blue-200 text-blue-700 hover:bg-blue-50"
          countActiveClass="bg-blue-500 text-white"
          countInactiveClass="bg-blue-100 text-blue-700"
        />
        <QuickChip
          active={typeFilter === "grant"}
          onClick={() => setTypeFilter(typeFilter === "grant" ? "" : "grant")}
          label={`🎁 ${t("grant")}`}
          count={counts.grant}
          activeClass="bg-amber-700 border-amber-700 text-white"
          inactiveClass="bg-white border-amber-200 text-amber-800 hover:bg-amber-50"
          countActiveClass="bg-amber-600 text-white"
          countInactiveClass="bg-amber-100 text-amber-800"
        />
      </div>

      {/* ── Active filter bar ── */}
      {activeFilters.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-4 px-3 py-2.5 bg-brand-primary/5 rounded-xl border border-brand-primary/15">
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
            onClick={() => {
              setTypeFilter("");
              setDeadlineFilter("");
              setDestinationFilter("");
            }}
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

// ── Sub-component: Quick filter chip ────────────────────────────────────────
interface QuickChipProps {
  active: boolean;
  onClick: () => void;
  label: string;
  count: number;
  activeClass: string;
  inactiveClass: string;
  countActiveClass: string;
  countInactiveClass: string;
}

function QuickChip({
  active,
  onClick,
  label,
  count,
  activeClass,
  inactiveClass,
  countActiveClass,
  countInactiveClass,
}: QuickChipProps) {
  return (
    <button
      onClick={onClick}
      className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors border ${
        active ? activeClass : inactiveClass
      }`}
    >
      <span>{label}</span>
      <span
        className={`text-xs rounded-full px-1.5 py-0.5 font-semibold ${
          active ? countActiveClass : countInactiveClass
        }`}
      >
        {count}
      </span>
    </button>
  );
}
