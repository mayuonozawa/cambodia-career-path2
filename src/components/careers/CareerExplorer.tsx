"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import {
  Briefcase,
  TrendingUp,
  Heart,
  Filter,
  X,
  Plus,
  Minus,
  GraduationCap,
  Globe,
  MapPin,
  Star,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Zap,
  Wifi,
  Sprout,
  Building2,
  Wrench,
  Users,
  Cpu,
  DollarSign,
  BookOpen,
  Award,
  Sparkles,
  BarChart3,
  GitCompareArrows,
} from "lucide-react";
import type {
  Career,
  CareerCategory,
  FilterKey,
  InterestType,
} from "./careerData";
import { CAREERS, MAX_INCOME } from "./careerData";
import CareerDetail from "./CareerDetail";

// ─── Onboarding Modal ───

type OnboardingStep = 1 | 2 | 3;

interface UserProfile {
  englishLevel: string;
  location: string;
  interest: InterestType;
}

function OnboardingModal({
  onComplete,
  onSkip,
}: {
  onComplete: (profile: UserProfile) => void;
  onSkip: () => void;
}) {
  const t = useTranslations("careers");
  const [step, setStep] = useState<OnboardingStep>(1);
  const [profile, setProfile] = useState<Partial<UserProfile>>({});

  const handleSelect = (key: keyof UserProfile, value: string) => {
    const updated = { ...profile, [key]: value };
    setProfile(updated);

    if (step < 3) {
      setTimeout(() => setStep((step + 1) as OnboardingStep), 200);
    } else {
      setTimeout(() => onComplete(updated as UserProfile), 200);
    }
  };

  const englishOptions = [
    { value: "none", labelEn: "None", labelKm: "មិនចេះ", icon: "---" },
    { value: "basic", labelEn: "Basic", labelKm: "មូលដ្ឋាន", icon: "-\u00b7-" },
    {
      value: "intermediate",
      labelEn: "Intermediate",
      labelKm: "មធ្យម",
      icon: "-\u00b7\u00b7",
    },
    {
      value: "advanced",
      labelEn: "Advanced",
      labelKm: "កម្រិតខ្ពស់",
      icon: "\u00b7\u00b7\u00b7",
    },
  ];

  const locationOptions = [
    { value: "urban", labelEn: "Urban (City)", labelKm: "ទីក្រុង", icon: Building2 },
    { value: "rural", labelEn: "Rural (Province)", labelKm: "ជនបទ", icon: Sprout },
  ];

  const interestOptions: {
    value: InterestType;
    labelEn: string;
    labelKm: string;
    icon: typeof Users;
    color: string;
  }[] = [
    {
      value: "people",
      labelEn: "People",
      labelKm: "មនុស្ស",
      icon: Users,
      color: "bg-rose-50 text-rose-600 border-rose-200",
    },
    {
      value: "technology",
      labelEn: "Technology",
      labelKm: "បច្ចេកវិទ្យា",
      icon: Cpu,
      color: "bg-sky-50 text-sky-600 border-sky-200",
    },
    {
      value: "money",
      labelEn: "Money",
      labelKm: "ប្រាក់កាស",
      icon: DollarSign,
      color: "bg-amber-50 text-amber-600 border-amber-200",
    },
    {
      value: "social",
      labelEn: "Social Impact",
      labelKm: "ផលប៉ះពាល់សង្គម",
      icon: Heart,
      color: "bg-emerald-50 text-emerald-600 border-emerald-200",
    },
  ];

  const locale = useLocale();
  const isKm = locale === "km";

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-0 sm:p-4">
      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden animate-[slideUp_0.4s_cubic-bezier(0.22,1,0.36,1)]">
        {/* Progress bar */}
        <div className="flex gap-1.5 px-6 pt-5">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                s <= step ? "bg-brand-primary" : "bg-gray-200"
              }`}
            />
          ))}
        </div>

        <div className="px-6 pt-5 pb-6">
          {/* Skip */}
          <button
            onClick={onSkip}
            className="absolute top-4 right-4 text-xs text-gray-400 hover:text-gray-600 transition-colors"
          >
            {t("onboarding.skip")}
          </button>

          {step === 1 && (
            <div className="animate-[fadeIn_0.3s_ease]">
              <div className="flex items-center gap-2 mb-1">
                <Sparkles className="h-4 w-4 text-brand-primary" />
                <span className="text-xs font-medium text-brand-primary uppercase tracking-wider">
                  {t("onboarding.step")} 1/3
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                {t("onboarding.englishTitle")}
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                {t("onboarding.englishDesc")}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {englishOptions.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleSelect("englishLevel", opt.value)}
                    className={`group relative flex flex-col items-center gap-1.5 rounded-xl border-2 px-3 py-4 transition-all hover:border-brand-primary hover:bg-brand-primary-light/50 ${
                      profile.englishLevel === opt.value
                        ? "border-brand-primary bg-brand-primary-light/50"
                        : "border-gray-100 bg-gray-50/50"
                    }`}
                  >
                    <span className="text-lg font-mono tracking-widest text-gray-400 group-hover:text-brand-primary transition-colors">
                      {opt.icon}
                    </span>
                    <span className="text-sm font-semibold text-foreground">
                      {isKm ? opt.labelKm : opt.labelEn}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-[fadeIn_0.3s_ease]">
              <div className="flex items-center gap-2 mb-1">
                <MapPin className="h-4 w-4 text-brand-secondary" />
                <span className="text-xs font-medium text-brand-secondary uppercase tracking-wider">
                  {t("onboarding.step")} 2/3
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                {t("onboarding.locationTitle")}
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                {t("onboarding.locationDesc")}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {locationOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect("location", opt.value)}
                      className={`group flex flex-col items-center gap-3 rounded-xl border-2 px-4 py-6 transition-all hover:border-brand-primary hover:bg-brand-primary-light/50 ${
                        profile.location === opt.value
                          ? "border-brand-primary bg-brand-primary-light/50"
                          : "border-gray-100 bg-gray-50/50"
                      }`}
                    >
                      <Icon className="h-8 w-8 text-gray-400 group-hover:text-brand-primary transition-colors" />
                      <span className="text-sm font-semibold text-foreground">
                        {isKm ? opt.labelKm : opt.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-[fadeIn_0.3s_ease]">
              <div className="flex items-center gap-2 mb-1">
                <Heart className="h-4 w-4 text-rose-500" />
                <span className="text-xs font-medium text-rose-500 uppercase tracking-wider">
                  {t("onboarding.step")} 3/3
                </span>
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">
                {t("onboarding.interestTitle")}
              </h3>
              <p className="text-sm text-muted-foreground mb-5">
                {t("onboarding.interestDesc")}
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {interestOptions.map((opt) => {
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      onClick={() => handleSelect("interest", opt.value)}
                      className={`group flex flex-col items-center gap-2.5 rounded-xl border-2 px-3 py-5 transition-all hover:scale-[1.02] ${
                        profile.interest === opt.value
                          ? `border-current ${opt.color}`
                          : "border-gray-100 bg-gray-50/50 hover:border-gray-200"
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 transition-colors ${
                          profile.interest === opt.value
                            ? ""
                            : "text-gray-400 group-hover:text-gray-600"
                        }`}
                      />
                      <span className="text-sm font-semibold">
                        {isKm ? opt.labelKm : opt.labelEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Income Bar ───

function IncomeBar({ min, max }: { min: number; max: number }) {
  const leftPct = (min / MAX_INCOME) * 100;
  const widthPct = ((max - min) / MAX_INCOME) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 h-2 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="absolute top-0 h-full rounded-full bg-gradient-to-r from-brand-primary to-brand-secondary transition-all"
          style={{ left: `${leftPct}%`, width: `${Math.max(widthPct, 4)}%` }}
        />
      </div>
      <span className="text-[11px] font-semibold text-muted-foreground whitespace-nowrap tabular-nums">
        ${min}-${max}
      </span>
    </div>
  );
}

// ─── Growth Stars ───

function GrowthStars({ score }: { score: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-3 w-3 ${
            i <= score
              ? "fill-brand-secondary text-brand-secondary"
              : "fill-gray-200 text-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

// ─── Education Icon ───

function EducationBadge({ level, locale }: { level: string; locale: string }) {
  const isKm = locale === "km";
  const labels: Record<string, { en: string; km: string; color: string }> = {
    vocational: {
      en: "Vocational",
      km: "វិជ្ជាជីវៈ",
      color: "bg-emerald-50 text-emerald-700 border-emerald-200",
    },
    bachelor: {
      en: "Bachelor's",
      km: "បរិញ្ញាបត្រ",
      color: "bg-sky-50 text-sky-700 border-sky-200",
    },
    master: {
      en: "Master's",
      km: "អនុបណ្ឌិត",
      color: "bg-violet-50 text-violet-700 border-violet-200",
    },
    any: {
      en: "Any Level",
      km: "គ្រប់កម្រិត",
      color: "bg-amber-50 text-amber-700 border-amber-200",
    },
  };
  const l = labels[level] || labels.any;

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold ${l.color}`}
    >
      <GraduationCap className="h-2.5 w-2.5" />
      {isKm ? l.km : l.en}
    </span>
  );
}

// ─── Career Card ───

function CareerCard({
  career,
  locale,
  isSelected,
  canSelect,
  onToggleSelect,
  onOpenDetail,
}: {
  career: Career;
  locale: string;
  isSelected: boolean;
  canSelect: boolean;
  onToggleSelect: (id: string) => void;
  onOpenDetail: (career: Career) => void;
}) {
  const isKm = locale === "km";
  const t = useTranslations("careers");

  return (
    <div
      onClick={() => onOpenDetail(career)}
      className={`group relative rounded-2xl border-2 bg-white p-4 transition-all duration-200 cursor-pointer ${
        isSelected
          ? "border-brand-primary shadow-lg shadow-brand-primary/10 scale-[1.01]"
          : "border-gray-100 hover:border-gray-200 hover:shadow-md"
      }`}
    >
      {/* Select toggle */}
      <button
        onClick={(e) => { e.stopPropagation(); onToggleSelect(career.id); }}
        disabled={!canSelect && !isSelected}
        className={`absolute -top-2 -right-2 z-10 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-all ${
          isSelected
            ? "border-brand-primary bg-brand-primary text-white shadow-md"
            : canSelect
              ? "border-gray-200 bg-white text-gray-400 hover:border-brand-primary hover:text-brand-primary shadow-sm"
              : "border-gray-100 bg-gray-50 text-gray-300 cursor-not-allowed"
        }`}
        title={isSelected ? t("comparison.remove") : t("comparison.add")}
      >
        {isSelected ? <Minus className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
      </button>

      {/* Header */}
      <div className="mb-3">
        <h4 className="text-base font-bold text-foreground leading-tight mb-1">
          {isKm ? career.nameKm : career.nameEn}
        </h4>
        <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
          {isKm ? career.descriptionKm : career.descriptionEn}
        </p>
      </div>

      {/* Skills */}
      <div className="flex flex-wrap gap-1 mb-3">
        {career.skills.map((s, i) => (
          <span
            key={i}
            className="inline-flex items-center rounded-md bg-gray-50 px-2 py-0.5 text-[10px] font-medium text-gray-600 ring-1 ring-inset ring-gray-200"
          >
            {isKm ? s.km : s.en}
          </span>
        ))}
      </div>

      {/* Income bar */}
      <div className="mb-3">
        <IncomeBar min={career.incomeMin} max={career.incomeMax} />
      </div>

      {/* Bottom row: education, availability, growth */}
      <div className="flex items-center justify-between gap-2">
        <EducationBadge level={career.educationLevel} locale={locale} />

        <div className="flex items-center gap-1.5">
          {career.cambodiaAvailable && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground" title="Cambodia">
              <MapPin className="h-2.5 w-2.5 text-brand-primary" />
              KH
            </span>
          )}
          {career.internationalAvailable && (
            <span className="flex items-center gap-0.5 text-[10px] text-muted-foreground" title="International">
              <Globe className="h-2.5 w-2.5 text-brand-secondary" />
              Intl
            </span>
          )}
        </div>

        <GrowthStars score={career.growthScore} />
      </div>
    </div>
  );
}

// ─── Comparison Table ───

function ComparisonTable({
  careers,
  locale,
  onRemove,
  onClose,
}: {
  careers: Career[];
  locale: string;
  onRemove: (id: string) => void;
  onClose: () => void;
}) {
  const t = useTranslations("careers");
  const isKm = locale === "km";

  const rows: { label: string; render: (c: Career) => React.ReactNode }[] = [
    {
      label: t("comparison.income"),
      render: (c) => (
        <span className="text-sm font-semibold tabular-nums">
          ${c.incomeMin}-${c.incomeMax}
        </span>
      ),
    },
    {
      label: t("comparison.education"),
      render: (c) => <EducationBadge level={c.educationLevel} locale={locale} />,
    },
    {
      label: t("comparison.english"),
      render: (c) => {
        const levels: Record<string, { en: string; km: string }> = {
          none: { en: "None", km: "មិនចាំបាច់" },
          basic: { en: "Basic", km: "មូលដ្ឋាន" },
          intermediate: { en: "Intermediate", km: "មធ្យម" },
          advanced: { en: "Advanced", km: "កម្រិតខ្ពស់" },
        };
        const l = levels[c.englishRequired] || levels.none;
        return <span className="text-sm">{isKm ? l.km : l.en}</span>;
      },
    },
    {
      label: t("comparison.difficulty"),
      render: (c) => (
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-2 w-4 rounded-sm ${
                i <= c.skillDifficulty
                  ? "bg-brand-primary"
                  : "bg-gray-200"
              }`}
            />
          ))}
        </div>
      ),
    },
    {
      label: t("comparison.growth"),
      render: (c) => <GrowthStars score={c.growthScore} />,
    },
    {
      label: t("comparison.availability"),
      render: (c) => (
        <div className="flex items-center gap-1">
          {c.cambodiaAvailable && (
            <span className="inline-flex items-center gap-0.5 rounded bg-brand-primary-light px-1.5 py-0.5 text-[10px] font-medium text-brand-primary">
              <MapPin className="h-2.5 w-2.5" /> KH
            </span>
          )}
          {c.internationalAvailable && (
            <span className="inline-flex items-center gap-0.5 rounded bg-brand-secondary-light px-1.5 py-0.5 text-[10px] font-medium text-brand-secondary">
              <Globe className="h-2.5 w-2.5" /> Intl
            </span>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="animate-[fadeIn_0.3s_ease]">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
          <GitCompareArrows className="h-5 w-5 text-brand-primary" />
          {t("comparison.title")}
        </h3>
        <button
          onClick={onClose}
          className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
        >
          <X className="h-3.5 w-3.5" />
          {t("comparison.close")}
        </button>
      </div>

      {/* Mobile: stack cards, Desktop: table */}
      <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
        <table className="w-full min-w-[480px] border-collapse">
          <thead>
            <tr>
              <th className="text-left p-2 text-xs font-medium text-muted-foreground w-24 sm:w-32" />
              {careers.map((c) => (
                <th key={c.id} className="p-2 text-center">
                  <div className="flex flex-col items-center gap-1">
                    <span className="text-sm font-bold text-foreground leading-tight">
                      {isKm ? c.nameKm : c.nameEn}
                    </span>
                    <button
                      onClick={() => onRemove(c.id)}
                      className="text-[10px] text-gray-400 hover:text-red-500 transition-colors"
                    >
                      {t("comparison.remove")}
                    </button>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className={i % 2 === 0 ? "bg-gray-50/50" : "bg-white"}
              >
                <td className="p-2.5 text-xs font-medium text-muted-foreground whitespace-nowrap">
                  {row.label}
                </td>
                {careers.map((c) => (
                  <td key={c.id} className="p-2.5 text-center">
                    <div className="flex justify-center">{row.render(c)}</div>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Action buttons per career */}
      <div className="grid gap-3 mt-4" style={{ gridTemplateColumns: `repeat(${careers.length}, 1fr)` }}>
        {careers.map((c) => (
          <div key={c.id} className="flex flex-col gap-1.5">
            <a
              href="#"
              className="flex items-center justify-center gap-1.5 rounded-lg bg-brand-primary/10 px-3 py-2 text-[11px] font-semibold text-brand-primary hover:bg-brand-primary/20 transition-colors"
            >
              <BookOpen className="h-3 w-3" />
              {t("actions.programs")}
            </a>
            <a
              href="#"
              className="flex items-center justify-center gap-1.5 rounded-lg bg-brand-secondary/10 px-3 py-2 text-[11px] font-semibold text-brand-secondary hover:bg-brand-secondary/20 transition-colors"
            >
              <Award className="h-3 w-3" />
              {t("actions.scholarships")}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Component ───

export default function CareerExplorer() {
  const t = useTranslations("careers");
  const locale = useLocale();
  const isKm = locale === "km";

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState(true); // default true to avoid flash

  useEffect(() => {
    const seen = localStorage.getItem("career-onboarding-seen");
    if (!seen) {
      setHasSeenOnboarding(false);
      setShowOnboarding(true);
    }
  }, []);

  const handleOnboardingComplete = (profile: UserProfile) => {
    setUserProfile(profile);
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
    localStorage.setItem("career-onboarding-seen", "1");
    localStorage.setItem("career-profile", JSON.stringify(profile));

    // Auto-select category based on interest
    const categoryMap: Record<InterestType, CareerCategory> = {
      people: "social-impact",
      technology: "high-income",
      money: "high-income",
      social: "social-impact",
    };
    setActiveCategory(categoryMap[profile.interest] || null);
  };

  const handleOnboardingSkip = () => {
    setShowOnboarding(false);
    setHasSeenOnboarding(true);
    localStorage.setItem("career-onboarding-seen", "1");
  };

  // Category & filter state
  const [activeCategory, setActiveCategory] = useState<CareerCategory | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<FilterKey>>(new Set());
  const [showFilters, setShowFilters] = useState(false);

  // Comparison state
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [showComparison, setShowComparison] = useState(false);

  // Detail panel state
  const [detailCareer, setDetailCareer] = useState<Career | null>(null);

  // Filter logic
  const filteredCareers = useMemo(() => {
    let result = CAREERS;

    if (activeCategory) {
      result = result.filter((c) => c.category === activeCategory);
    }

    if (activeFilters.size > 0) {
      result = result.filter((c) =>
        Array.from(activeFilters).every((f) => c.filters.includes(f))
      );
    }

    // If user has profile, sort recommended first
    if (userProfile) {
      result = [...result].sort((a, b) => {
        const aMatch = a.interestTypes.includes(userProfile.interest) ? 1 : 0;
        const bMatch = b.interestTypes.includes(userProfile.interest) ? 1 : 0;
        return bMatch - aMatch;
      });
    }

    return result;
  }, [activeCategory, activeFilters, userProfile]);

  const toggleFilter = useCallback((key: FilterKey) => {
    setActiveFilters((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }, []);

  const toggleSelect = useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else if (next.size < 3) {
        next.add(id);
      }
      return next;
    });
  }, []);

  const selectedCareers = useMemo(
    () => CAREERS.filter((c) => selectedIds.has(c.id)),
    [selectedIds]
  );

  const categories: {
    key: CareerCategory;
    icon: typeof Briefcase;
    gradient: string;
    border: string;
  }[] = [
    {
      key: "realistic",
      icon: Briefcase,
      gradient: "from-teal-500 to-emerald-600",
      border: "border-teal-200 hover:border-teal-400",
    },
    {
      key: "high-income",
      icon: TrendingUp,
      gradient: "from-amber-500 to-orange-600",
      border: "border-amber-200 hover:border-amber-400",
    },
    {
      key: "social-impact",
      icon: Heart,
      gradient: "from-rose-500 to-pink-600",
      border: "border-rose-200 hover:border-rose-400",
    },
  ];

  const filterButtons: { key: FilterKey; icon: typeof Zap }[] = [
    { key: "highDemand", icon: Zap },
    { key: "remotePossible", icon: Wifi },
    { key: "growthIndustry", icon: Sprout },
    { key: "universityRequired", icon: GraduationCap },
    { key: "vocationalPossible", icon: Wrench },
  ];

  return (
    <>
      {/* Onboarding */}
      {showOnboarding && (
        <OnboardingModal
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}

      <section id="career-explorer" className="relative bg-gradient-to-b from-gray-50/80 to-white px-4 py-14 sm:py-20 overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 rounded-full bg-brand-primary/5 blur-3xl" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 rounded-full bg-brand-secondary/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-5xl">
          {/* Section header */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-1.5 rounded-full bg-brand-primary/10 px-3 py-1 text-xs font-semibold text-brand-primary mb-3">
              <BarChart3 className="h-3.5 w-3.5" />
              {t("sectionLabel")}
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              {t("sectionTitle")}
            </h2>
            <p className="text-sm text-muted-foreground max-w-md mx-auto">
              {t("sectionSubtitle")}
            </p>
          </div>

          {/* Category cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
            {categories.map(({ key, icon: Icon, gradient, border }) => {
              const isActive = activeCategory === key;
              return (
                <button
                  key={key}
                  onClick={() =>
                    setActiveCategory(isActive ? null : key)
                  }
                  className={`group relative overflow-hidden rounded-2xl border-2 p-5 text-left transition-all duration-300 ${
                    isActive
                      ? "border-transparent shadow-lg scale-[1.02]"
                      : `bg-white ${border} shadow-sm hover:shadow-md`
                  }`}
                >
                  {/* Active gradient bg */}
                  {isActive && (
                    <div
                      className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-[0.07]`}
                    />
                  )}
                  <div className="relative flex items-start gap-3">
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all ${
                        isActive
                          ? `bg-gradient-to-br ${gradient} text-white shadow-md`
                          : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-foreground mb-0.5">
                        {t(`categories.${key}.title`)}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t(`categories.${key}.desc`)}
                      </p>
                    </div>
                  </div>
                  {isActive && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Filters */}
          <div className="mb-8">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors mb-3"
            >
              <Filter className="h-4 w-4" />
              {t("filterLabel")}
              {activeFilters.size > 0 && (
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white">
                  {activeFilters.size}
                </span>
              )}
              {showFilters ? (
                <ChevronUp className="h-3.5 w-3.5" />
              ) : (
                <ChevronDown className="h-3.5 w-3.5" />
              )}
            </button>

            {showFilters && (
              <div className="flex flex-wrap gap-2 animate-[fadeIn_0.2s_ease]">
                {filterButtons.map(({ key, icon: FIcon }) => {
                  const isActive = activeFilters.has(key);
                  return (
                    <button
                      key={key}
                      onClick={() => toggleFilter(key)}
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all ${
                        isActive
                          ? "border-brand-primary bg-brand-primary text-white shadow-sm"
                          : "border-gray-200 bg-white text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                      }`}
                    >
                      <FIcon className="h-3 w-3" />
                      {t(`filters.${key}`)}
                    </button>
                  );
                })}

                {activeFilters.size > 0 && (
                  <button
                    onClick={() => setActiveFilters(new Set())}
                    className="inline-flex items-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X className="h-3 w-3" />
                    {t("filterClear")}
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Comparison bar (sticky) */}
          {selectedIds.size > 0 && (
            <div className="sticky top-16 z-30 mb-6 animate-[fadeIn_0.2s_ease]">
              <div className="flex items-center justify-between rounded-2xl border border-brand-primary/20 bg-white/95 backdrop-blur-md px-4 py-3 shadow-lg shadow-brand-primary/5">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-1">
                    {selectedCareers.map((c) => (
                      <div
                        key={c.id}
                        className="flex h-7 w-7 items-center justify-center rounded-full bg-brand-primary text-[10px] font-bold text-white ring-2 ring-white"
                      >
                        {(isKm ? c.nameKm : c.nameEn).charAt(0)}
                      </div>
                    ))}
                  </div>
                  <span className="text-sm font-medium text-foreground">
                    {t("comparison.selected", { count: selectedIds.size })}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setSelectedIds(new Set())}
                    className="rounded-lg px-3 py-1.5 text-xs font-medium text-gray-500 hover:bg-gray-100 transition-colors"
                  >
                    {t("comparison.clearAll")}
                  </button>
                  {selectedIds.size >= 2 && (
                    <button
                      onClick={() => setShowComparison(!showComparison)}
                      className="flex items-center gap-1.5 rounded-lg bg-brand-primary px-4 py-1.5 text-xs font-semibold text-white hover:bg-brand-primary-hover transition-colors shadow-sm"
                    >
                      <GitCompareArrows className="h-3.5 w-3.5" />
                      {t("comparison.compare")}
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Comparison table */}
          {showComparison && selectedCareers.length >= 2 && (
            <div className="mb-8 rounded-2xl border border-gray-200 bg-white p-4 sm:p-6 shadow-sm">
              <ComparisonTable
                careers={selectedCareers}
                locale={locale}
                onRemove={(id) => toggleSelect(id)}
                onClose={() => setShowComparison(false)}
              />
            </div>
          )}

          {/* Career cards grid */}
          {filteredCareers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredCareers.map((career) => (
                <CareerCard
                  key={career.id}
                  career={career}
                  locale={locale}
                  isSelected={selectedIds.has(career.id)}
                  canSelect={selectedIds.size < 3}
                  onToggleSelect={toggleSelect}
                  onOpenDetail={setDetailCareer}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 mb-4">
                <Briefcase className="h-6 w-6 text-gray-400" />
              </div>
              <p className="text-sm font-medium text-muted-foreground mb-1">
                {t("noResults")}
              </p>
              <button
                onClick={() => {
                  setActiveCategory(null);
                  setActiveFilters(new Set());
                }}
                className="text-sm text-brand-primary hover:underline mt-1"
              >
                {t("filterClear")}
              </button>
            </div>
          )}

          {/* Action Section */}
          <div className="mt-12 rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50/50 p-6 sm:p-8">
            <div className="text-center mb-6">
              <h3 className="text-lg font-bold text-foreground mb-1">
                {t("actions.title")}
              </h3>
              <p className="text-sm text-muted-foreground">
                {t("actions.subtitle")}
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a
                href={`/${locale}/universities`}
                className="group flex items-center gap-3 rounded-xl border border-brand-primary/20 bg-white p-4 transition-all hover:border-brand-primary/40 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary-light">
                  <BookOpen className="h-5 w-5 text-brand-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-foreground">
                    {t("actions.programs")}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {t("actions.programsDesc")}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-brand-primary/40 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href={`/${locale}/scholarships`}
                className="group flex items-center gap-3 rounded-xl border border-brand-secondary/20 bg-white p-4 transition-all hover:border-brand-secondary/40 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-secondary-light">
                  <Award className="h-5 w-5 text-brand-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-foreground">
                    {t("actions.scholarships")}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {t("actions.scholarshipsDesc")}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-brand-secondary/40 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href={`/${locale}/vocational-schools`}
                className="group flex items-center gap-3 rounded-xl border border-brand-tertiary/20 bg-white p-4 transition-all hover:border-brand-tertiary/40 hover:shadow-md"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-primary-light">
                  <Wrench className="h-5 w-5 text-brand-tertiary" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-sm font-semibold text-foreground">
                    {t("actions.skills")}
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {t("actions.skillsDesc")}
                  </span>
                </div>
                <ArrowRight className="h-4 w-4 shrink-0 text-brand-tertiary/40 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </div>

          {/* Re-trigger onboarding */}
          {hasSeenOnboarding && !showOnboarding && (
            <div className="mt-6 text-center">
              <button
                onClick={() => setShowOnboarding(true)}
                className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-brand-primary transition-colors"
              >
                <Sparkles className="h-3 w-3" />
                {t("retakeQuiz")}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Career Detail Panel */}
      {detailCareer && (
        <CareerDetail
          career={detailCareer}
          onClose={() => setDetailCareer(null)}
        />
      )}
    </>
  );
}
