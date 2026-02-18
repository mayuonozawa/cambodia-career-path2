"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { SearchBar } from "@/components/ui/SearchBar";
import { ScholarshipCard } from "./ScholarshipCard";
import type { Scholarship, Locale } from "@/types/database";
import { getLocalizedField } from "@/lib/utils";
import { useFilterParams } from "@/hooks/useFilterParams";
import { ChevronDown, X } from "lucide-react";

interface ScholarshipListProps {
  scholarships: Scholarship[];
}

function getDaysRemaining(deadline: string | null): number | null {
  if (!deadline) return null;
  const now = new Date();
  return Math.ceil(
    (new Date(deadline).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
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
  } = useFilterParams();

  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  // Close sort dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(e.target as Node)) {
        setSortDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Compute counts across full dataset for chip badges
  const counts = useMemo(() => {
    const now = Date.now();
    return {
      urgent: scholarships.filter((s) => {
        const days = getDaysRemaining(s.deadline);
        return days !== null && days > 0 && days <= 7;
      }).length,
      soon: scholarships.filter((s) => {
        const days = getDaysRemaining(s.deadline);
        return days !== null && days > 0 && days <= 30;
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
      const name = getLocalizedField(s, "name", locale).toLowerCase();
      const provider = getLocalizedField(s, "provider", locale).toLowerCase();
      const q = search.toLowerCase();
      const matchesSearch = !q || name.includes(q) || provider.includes(q);
      const matchesType = !typeFilter || s.type === typeFilter;

      // Deadline filter
      let matchesDeadline = true;
      if (deadlineFilter === "urgent") {
        const days = getDaysRemaining(s.deadline);
        matchesDeadline = days !== null && days > 0 && days <= 7;
      } else if (deadlineFilter === "soon") {
        const days = getDaysRemaining(s.deadline);
        matchesDeadline = days !== null && days > 0 && days <= 30;
      }

      return matchesSearch && matchesType && matchesDeadline;
    });

    // Sort
    return results.sort((a, b) => {
      if (sortOrder === "name") {
        const nameA = getLocalizedField(a, "name", locale).toLowerCase();
        const nameB = getLocalizedField(b, "name", locale).toLowerCase();
        return nameA.localeCompare(nameB);
      }
      if (sortOrder === "newest") {
        return (
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
      // Default: deadline (nearest active first, closed last)
      const deadlineA = a.deadline ? new Date(a.deadline).getTime() : null;
      const deadlineB = b.deadline ? new Date(b.deadline).getTime() : null;
      const closedA = deadlineA !== null && deadlineA < now;
      const closedB = deadlineB !== null && deadlineB < now;
      if (closedA && !closedB) return 1;
      if (!closedA && closedB) return -1;
      if (deadlineA !== null && deadlineB !== null) return deadlineA - deadlineB;
      if (deadlineA !== null && deadlineB === null) return -1;
      if (deadlineA === null && deadlineB !== null) return 1;
      return 0;
    });
  }, [scholarships, search, typeFilter, deadlineFilter, sortOrder, locale]);

  // Active filter tags
  const activeFilters: { key: string; label: string; clear: () => void }[] = [];
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
    sortOrder === "newest"
      ? t("sortNewest")
      : sortOrder === "name"
      ? t("sortName")
      : t("sortDeadline");

  return (
    <div>
      {/* Header: result count + sort dropdown */}
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
                  onClick={() => {
                    setSortOrder(opt.value);
                    setSortDropdownOpen(false);
                  }}
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

      {/* Search bar */}
      <div className="mb-3">
        <SearchBar
          placeholder={t("searchPlaceholder")}
          value={search}
          onChange={setSearch}
        />
      </div>

      {/* Quick filter chips */}
      <div className="flex gap-2 overflow-x-auto pb-1 mb-3" style={{ scrollbarWidth: "none" }}>
        {/* Urgent deadline */}
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

        {/* Full scholarship */}
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

        {/* Approaching deadline */}
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

        {/* Partial scholarship */}
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

        {/* Grant */}
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

      {/* Active filter bar */}
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
            }}
            className="text-xs text-gray-400 hover:text-gray-600 underline ml-auto shrink-0"
          >
            {t("resetFilters")}
          </button>
        </div>
      )}

      {/* Results */}
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
