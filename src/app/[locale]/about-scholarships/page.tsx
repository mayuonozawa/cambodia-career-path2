import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { EligibilityChecker } from "@/components/scholarships/EligibilityChecker";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("aboutScholarships");
  return {
    title: t("title"),
    description: t("heroSub"),
  };
}

export default function AboutScholarshipsPage() {
  const t = useTranslations("aboutScholarships");

  return (
    <div className="max-w-lg mx-auto px-4 py-6 space-y-6">

      {/* ── Section A: Hero ── */}
      <div className="bg-gradient-to-br from-brand-primary/10 via-brand-primary/5 to-white rounded-2xl p-6 text-center">
        <div className="text-5xl mb-3">🎓</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2 leading-snug">
          {t("heroTagline")}
        </h1>
        <p className="text-sm text-gray-600 leading-relaxed mb-4">
          {t("heroSub")}
        </p>
        <span className="inline-block bg-brand-primary/15 text-brand-primary text-sm font-semibold px-4 py-1.5 rounded-full">
          {t("heroBadge")}
        </span>
      </div>

      {/* ── Section B: How It Works ── */}
      <section>
        <h2 className="text-base font-bold text-gray-800 mb-3">{t("howItWorks")}</h2>
        <div className="flex items-center gap-1.5">
          {[
            { emoji: "📋", label: t("flowApply"), bg: "bg-teal-50" },
            { emoji: "✅", label: t("flowAccepted"), bg: "bg-teal-100" },
            { emoji: "🎓", label: t("flowStudy"), bg: "bg-brand-primary/20" },
          ].map((step, i, arr) => (
            <div key={i} className="flex items-center gap-1.5 flex-1 min-w-0">
              <div className={`flex-1 ${step.bg} rounded-xl p-3 text-center`}>
                <div className="text-2xl mb-1">{step.emoji}</div>
                <p className="text-xs font-medium text-gray-700 leading-tight">{step.label}</p>
              </div>
              {i < arr.length - 1 && (
                <span className="text-gray-300 text-lg shrink-0">→</span>
              )}
            </div>
          ))}
        </div>
        <div className="text-center mt-3">
          <span className="inline-block bg-green-100 text-green-800 text-xs font-semibold px-4 py-1.5 rounded-full">
            {t("noRepay")}
          </span>
        </div>
      </section>

      {/* ── Section C: 3 Types ── */}
      <section>
        <h2 className="text-base font-bold text-gray-800 mb-3">{t("types")}</h2>
        <div className="space-y-3">

          {/* Full Scholarship */}
          <div className="bg-white rounded-xl border border-gray-100 border-l-4 border-l-green-500 shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🛡️</span>
                <span className="text-xs font-semibold bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                  {t("fullTag")}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-0.5">{t("fullTitle")}</h3>
              <p className="text-xs text-gray-500 mb-2">{t("fullSub")}</p>
              <div className="flex gap-1.5 flex-wrap text-base mb-3">
                {"🎓 💰 ✈️ 🏠 🏥".split(" ").map((icon) => (
                  <span key={icon} className="text-lg">{icon}</span>
                ))}
              </div>
              <div className="bg-green-50 rounded-lg px-3 py-2 text-xs text-green-800 mb-2">
                {t("fullExample")}
              </div>
              <p className="text-xs text-gray-400">{t("fullFooter")}</p>
            </div>
          </div>

          {/* Partial Scholarship */}
          <div className="bg-white rounded-xl border border-gray-100 border-l-4 border-l-blue-500 shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">💰</span>
                <span className="text-xs font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  {t("partialTag")}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-0.5">{t("partialTitle")}</h3>
              <p className="text-xs text-gray-500 mb-2">{t("partialSub")}</p>
              <div className="flex gap-1.5 flex-wrap mb-3">
                <span className="text-lg">🎓</span>
              </div>
              <div className="bg-blue-50 rounded-lg px-3 py-2 text-xs text-blue-800 mb-2">
                {t("partialExample")}
              </div>
              <p className="text-xs text-gray-400">{t("partialFooter")}</p>
            </div>
          </div>

          {/* Grant */}
          <div className="bg-white rounded-xl border border-gray-100 border-l-4 border-l-amber-500 shadow-sm overflow-hidden">
            <div className="p-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="text-lg">🎁</span>
                <span className="text-xs font-semibold bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  {t("grantTag")}
                </span>
              </div>
              <h3 className="font-bold text-gray-900 mb-0.5">{t("grantTitle")}</h3>
              <p className="text-xs text-gray-500 mb-2">{t("grantSub")}</p>
              <div className="flex gap-1.5 flex-wrap mb-3">
                <span className="text-lg">💵</span>
              </div>
              <div className="bg-amber-50 rounded-lg px-3 py-2 text-xs text-amber-800 mb-2">
                {t("grantExample")}
              </div>
              <p className="text-xs text-gray-400">{t("grantFooter")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Section D: Eligibility Checker ── */}
      <EligibilityChecker
        title={t("eligibilityTitle")}
        questions={[t("eq1"), t("eq2"), t("eq3")]}
        yesLabel={t("eqYes")}
        noLabel={t("eqNo")}
        resultSuccess={t("eqResultSuccess")}
        resultPartial={t("eqResultPartial")}
        ctaLabel={t("eqCta")}
      />

      {/* ── Section E: How to Find — Timeline ── */}
      <section>
        <h2 className="text-base font-bold text-gray-800 mb-4">{t("howToFind")}</h2>
        <div className="relative pl-8">
          {/* Vertical line */}
          <div className="absolute left-3.5 top-2 bottom-2 w-0.5 bg-brand-primary/20" />

          <div className="space-y-4">
            {([
              { num: 1, emoji: "🔍", label: t("tl1"), hint: t("tl1hint") },
              { num: 2, emoji: "📋", label: t("tl2"), hint: t("tl2hint") },
              { num: 3, emoji: "📄", label: t("tl3"), hint: t("tl3hint") },
              { num: 4, emoji: "📮", label: t("tl4"), hint: t("tl4hint") },
            ] as const).map((step) => (
              <div key={step.num} className="relative flex items-start gap-3">
                {/* Circle */}
                <div className="absolute -left-8 flex items-center justify-center w-7 h-7 rounded-full bg-brand-primary text-white text-xs font-bold shrink-0 z-10">
                  {step.num}
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex-1">
                  <p className="text-sm font-medium text-gray-800">{step.label}</p>
                  <p className="text-xs text-gray-400 mt-0.5">{step.hint}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section F: Tips ── */}
      <section>
        <h2 className="text-base font-bold text-gray-800 mb-3">{t("tips")}</h2>
        <div className="space-y-2">
          {([
            { key: "tip1New", dot: "bg-brand-primary" },
            { key: "tip2New", dot: "bg-blue-400" },
            { key: "tip3New", dot: "bg-green-400" },
            { key: "tip4New", dot: "bg-purple-400" },
            { key: "tip5New", dot: "bg-amber-400" },
          ] as const).map(({ key, dot }) => (
            <div key={key} className="flex items-start gap-3 bg-white rounded-xl border border-gray-100 shadow-sm px-4 py-3">
              <div className={`w-2 h-2 rounded-full ${dot} shrink-0 mt-1.5`} />
              <p className="text-sm text-gray-700 leading-relaxed">{t(key)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section G: CTA ── */}
      <section className="bg-gradient-to-br from-brand-primary to-brand-primary/80 rounded-2xl p-6 text-center text-white">
        <div className="text-4xl mb-3">🌟</div>
        <h2 className="text-lg font-bold mb-2 leading-snug">{t("ctaTitleNew")}</h2>
        <p className="text-sm text-white/80 mb-5">{t("ctaSubNew")}</p>
        <Link
          href="/scholarships"
          className="inline-block bg-white text-brand-primary font-bold px-7 py-3 rounded-full hover:bg-white/90 transition-colors text-sm"
        >
          {t("eqCta")}
        </Link>
        <p className="text-xs text-white/60 mt-3">{t("ctaNote")}</p>
      </section>

    </div>
  );
}
