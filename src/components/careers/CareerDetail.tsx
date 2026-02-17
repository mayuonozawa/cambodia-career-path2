"use client";

import { useTranslations } from "next-intl";
import { useLocale } from "next-intl";
import {
  X,
  Briefcase,
  GraduationCap,
  Globe,
  MapPin,
  Star,
  ArrowRight,
  BookOpen,
  Award,
  Wrench,
  Wifi,
  CheckCircle2,
  ChevronRight,
  TrendingUp,
  Clock,
  DollarSign,
  Languages,
  Route,
  Lightbulb,
} from "lucide-react";
import type { Career } from "./careerData";

const MAX_INTL_INCOME = 10000;

function SkillBar({ level, max = 5 }: { level: number; max?: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }, (_, i) => (
        <div
          key={i}
          className={`h-1.5 w-5 rounded-full transition-all ${
            i < level
              ? "bg-gradient-to-r from-brand-primary to-brand-tertiary"
              : "bg-gray-200"
          }`}
        />
      ))}
    </div>
  );
}

function SalaryCompareBar({
  label,
  min,
  max,
  globalMax,
  color,
}: {
  label: string;
  min: number;
  max: number;
  globalMax: number;
  color: string;
}) {
  const leftPct = (min / globalMax) * 100;
  const widthPct = Math.max(((max - min) / globalMax) * 100, 3);

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between">
        <span className="text-[11px] font-medium text-muted-foreground">{label}</span>
        <span className="text-xs font-bold tabular-nums text-foreground">
          ${min.toLocaleString()} — ${max.toLocaleString()}
        </span>
      </div>
      <div className="relative h-3 rounded-full bg-gray-100 overflow-hidden">
        <div
          className={`absolute top-0 h-full rounded-full ${color} transition-all duration-700`}
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        />
      </div>
    </div>
  );
}

export default function CareerDetail({
  career,
  onClose,
}: {
  career: Career;
  onClose: () => void;
}) {
  const t = useTranslations("careers");
  const locale = useLocale();
  const isKm = locale === "km";
  const d = career.detail;

  const educationLevelLabels: Record<string, { en: string; km: string }> = {
    vocational: { en: "Vocational Training", km: "បណ្តុះបណ្តាលវិជ្ជាជីវៈ" },
    bachelor: { en: "Bachelor's Degree", km: "បរិញ្ញាបត្រ" },
    master: { en: "Master's Degree", km: "អនុបណ្ឌិត" },
    any: { en: "Any Level", km: "គ្រប់កម្រិត" },
  };

  const englishLabels: Record<string, { en: string; km: string }> = {
    none: { en: "Not required", km: "មិនចាំបាច់" },
    basic: { en: "Basic", km: "មូលដ្ឋាន" },
    intermediate: { en: "Intermediate", km: "មធ្យម" },
    advanced: { en: "Advanced", km: "កម្រិតខ្ពស់" },
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/30 backdrop-blur-[2px]">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Panel */}
      <div className="relative w-full max-w-lg bg-white shadow-2xl overflow-y-auto animate-[slideInRight_0.35s_cubic-bezier(0.22,1,0.36,1)]">
        {/* Sticky header */}
        <div className="sticky top-0 z-10 flex items-center justify-between bg-white/95 backdrop-blur-md border-b border-gray-100 px-5 py-3">
          <div className="min-w-0">
            <h2 className="text-base font-bold text-foreground truncate">
              {isKm ? career.nameKm : career.nameEn}
            </h2>
            <p className="text-[11px] text-brand-primary font-medium truncate">
              {isKm ? d.taglineKm : d.taglineEn}
            </p>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-gray-100 transition-colors ml-3"
          >
            <X className="h-4 w-4 text-gray-500" />
          </button>
        </div>

        <div className="px-5 py-6 space-y-7">
          {/* ── 1. Job Description ── */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-primary/10">
                <Briefcase className="h-3.5 w-3.5 text-brand-primary" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{t("detail.jobDescription")}</h3>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-3">
              {isKm ? d.jobDescriptionKm : d.jobDescriptionEn}
            </p>
            <div className="space-y-1.5">
              {(isKm ? d.dailyTasksKm : d.dailyTasksEn).map((task, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0 text-brand-primary/60" />
                  <span className="text-xs text-muted-foreground">{task}</span>
                </div>
              ))}
            </div>
          </section>

          {/* ── 2. Required Skills (detailed) ── */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10">
                <Lightbulb className="h-3.5 w-3.5 text-amber-600" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{t("detail.requiredSkills")}</h3>
            </div>
            <div className="space-y-2.5">
              {d.detailedSkills.map((skill, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-xs font-medium text-foreground">
                    {isKm ? skill.name.km : skill.name.en}
                  </span>
                  <SkillBar level={skill.level} />
                </div>
              ))}
            </div>
          </section>

          {/* ── 3. Income Range (Cambodia vs International) ── */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10">
                <DollarSign className="h-3.5 w-3.5 text-emerald-600" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{t("detail.incomeRange")}</h3>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-4">
              <SalaryCompareBar
                label={isKm ? "🇰🇭 កម្ពុជា (ប្រចាំខែ)" : "🇰🇭 Cambodia (monthly)"}
                min={career.incomeMin}
                max={career.incomeMax}
                globalMax={MAX_INTL_INCOME}
                color="bg-gradient-to-r from-brand-primary to-brand-tertiary"
              />
              {career.internationalAvailable && (
                <SalaryCompareBar
                  label={isKm ? "🌍 អន្តរជាតិ (ប្រចាំខែ)" : "🌍 International (monthly)"}
                  min={d.incomeIntlMin}
                  max={d.incomeIntlMax}
                  globalMax={MAX_INTL_INCOME}
                  color="bg-gradient-to-r from-brand-secondary to-orange-500"
                />
              )}
            </div>
          </section>

          {/* ── 4. Education Requirements ── */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-sky-500/10">
                <GraduationCap className="h-3.5 w-3.5 text-sky-600" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{t("detail.education")}</h3>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4 space-y-3">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded-md border border-sky-200 bg-sky-50 px-2 py-1 text-[11px] font-semibold text-sky-700">
                  <GraduationCap className="h-3 w-3" />
                  {isKm
                    ? educationLevelLabels[career.educationLevel]?.km
                    : educationLevelLabels[career.educationLevel]?.en}
                </span>
                <span className="inline-flex items-center gap-1 rounded-md border border-gray-200 bg-white px-2 py-1 text-[11px] font-medium text-muted-foreground">
                  <Languages className="h-3 w-3" />
                  {isKm ? "អង់គ្លេស៖ " : "English: "}
                  {isKm
                    ? englishLabels[career.englishRequired]?.km
                    : englishLabels[career.englishRequired]?.en}
                </span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isKm ? d.educationPathKm : d.educationPathEn}
              </p>
              {d.selfTaughtPossible && (
                <div className="flex items-center gap-1.5 text-[11px] font-medium text-emerald-600">
                  <CheckCircle2 className="h-3 w-3" />
                  {t("detail.selfTaught")}
                </div>
              )}
            </div>
          </section>

          {/* ── 5. Regional Availability ── */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-500/10">
                <Globe className="h-3.5 w-3.5 text-violet-600" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{t("detail.availability")}</h3>
            </div>
            <div className="space-y-2.5">
              {career.cambodiaAvailable && (
                <div className="flex items-start gap-3 rounded-xl border border-brand-primary/15 bg-brand-primary-light/30 p-3">
                  <MapPin className="h-4 w-4 mt-0.5 shrink-0 text-brand-primary" />
                  <div>
                    <span className="text-xs font-bold text-foreground block mb-0.5">
                      🇰🇭 {isKm ? "កម្ពុជា" : "Cambodia"}
                    </span>
                    <span className="text-[11px] text-muted-foreground leading-relaxed">
                      {isKm ? d.cambodiaDetailKm : d.cambodiaDetailEn}
                    </span>
                  </div>
                </div>
              )}
              {career.internationalAvailable && (
                <div className="flex items-start gap-3 rounded-xl border border-brand-secondary/15 bg-brand-secondary-light/30 p-3">
                  <Globe className="h-4 w-4 mt-0.5 shrink-0 text-brand-secondary" />
                  <div>
                    <span className="text-xs font-bold text-foreground block mb-0.5">
                      🌍 {isKm ? "អន្តរជាតិ" : "International"}
                      {d.remotePossible && (
                        <span className="inline-flex items-center gap-0.5 ml-1.5 text-[10px] font-medium text-emerald-600">
                          <Wifi className="h-2.5 w-2.5" />
                          {isKm ? "ពីចម្ងាយ" : "Remote OK"}
                        </span>
                      )}
                    </span>
                    <span className="text-[11px] text-muted-foreground leading-relaxed">
                      {isKm ? d.internationalDetailKm : d.internationalDetailEn}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ── 6. Future Growth ── */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-secondary/10">
                <TrendingUp className="h-3.5 w-3.5 text-brand-secondary" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{t("detail.futureGrowth")}</h3>
            </div>
            <div className="rounded-xl border border-gray-100 bg-gray-50/50 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 ${
                        i <= career.growthScore
                          ? "fill-brand-secondary text-brand-secondary"
                          : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-foreground">{career.growthScore}/5</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isKm ? d.growthExplanationKm : d.growthExplanationEn}
              </p>
            </div>
          </section>

          {/* ── 7. Career Path Timeline ── */}
          <section>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-500/10">
                <Route className="h-3.5 w-3.5 text-rose-500" />
              </div>
              <h3 className="text-sm font-bold text-foreground">{t("detail.careerPath")}</h3>
            </div>
            <div className="relative pl-5">
              {/* Vertical line */}
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-gradient-to-b from-brand-primary via-brand-secondary to-rose-400" />
              <div className="space-y-4">
                {d.careerPath.map((step, i) => (
                  <div key={i} className="relative flex items-start gap-3">
                    {/* Dot */}
                    <div
                      className={`absolute -left-5 top-1.5 h-3.5 w-3.5 rounded-full border-2 border-white ${
                        i === 0
                          ? "bg-brand-primary shadow-sm shadow-brand-primary/30"
                          : i === d.careerPath.length - 1
                            ? "bg-rose-400 shadow-sm shadow-rose-400/30"
                            : "bg-brand-secondary shadow-sm shadow-brand-secondary/30"
                      }`}
                    />
                    <div className="flex-1 rounded-lg border border-gray-100 bg-white p-3">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-bold text-foreground">
                          {isKm ? step.titleKm : step.titleEn}
                        </span>
                        <span className="text-[10px] font-medium text-brand-primary bg-brand-primary-light/50 px-1.5 py-0.5 rounded">
                          {isKm ? step.salaryKm : step.salaryEn}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-2.5 w-2.5" />
                        {isKm ? step.yearsKm : step.yearsEn}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ── 8. Action CTAs ── */}
          <section className="rounded-2xl border border-gray-200 bg-gradient-to-br from-brand-primary-light/40 to-brand-secondary-light/40 p-5">
            <h3 className="text-sm font-bold text-foreground mb-3 text-center">
              {t("detail.nextSteps")}
            </h3>
            <div className="space-y-2">
              <a
                href={`/${locale}/universities`}
                className="group flex items-center gap-3 rounded-xl bg-white border border-brand-primary/15 p-3 transition-all hover:border-brand-primary/30 hover:shadow-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary/10">
                  <BookOpen className="h-4 w-4 text-brand-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-bold text-foreground">{t("detail.viewPrograms")}</span>
                  <span className="block text-[10px] text-muted-foreground">
                    {d.relatedPrograms.join(", ")}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-brand-primary/40 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href={`/${locale}/scholarships`}
                className="group flex items-center gap-3 rounded-xl bg-white border border-brand-secondary/15 p-3 transition-all hover:border-brand-secondary/30 hover:shadow-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-secondary/10">
                  <Award className="h-4 w-4 text-brand-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-bold text-foreground">{t("detail.viewScholarships")}</span>
                  <span className="block text-[10px] text-muted-foreground">
                    {t("detail.scholarshipsHint")}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-brand-secondary/40 group-hover:translate-x-0.5 transition-transform" />
              </a>

              <a
                href={`/${locale}/vocational-schools`}
                className="group flex items-center gap-3 rounded-xl bg-white border border-brand-tertiary/15 p-3 transition-all hover:border-brand-tertiary/30 hover:shadow-sm"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-primary-light">
                  <Wrench className="h-4 w-4 text-brand-tertiary" />
                </div>
                <div className="flex-1 min-w-0">
                  <span className="block text-xs font-bold text-foreground">{t("detail.learnSkills")}</span>
                  <span className="block text-[10px] text-muted-foreground">
                    {t("detail.skillsHint")}
                  </span>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-brand-tertiary/40 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
