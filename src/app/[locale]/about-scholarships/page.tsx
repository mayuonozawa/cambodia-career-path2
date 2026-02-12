"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

export default function ScholarshipGuidePage() {
  const t = useTranslations("scholarshipGuide");

  return (
    <div className="bg-gradient-to-b from-[#E0F5F4] to-white min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="mb-4 text-5xl">📘</div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#3DBDB8] mb-4">
            {t("title")}
          </h1>
        </div>

        {/* Definition */}
        <section className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-[#E0F5F4]">
          <h2 className="text-3xl font-bold text-[#3DBDB8] mb-4 flex items-center gap-3">
            <span>📚</span> {t("definition.title")}
          </h2>
          <p className="text-gray-700 mb-6 leading-relaxed text-lg">
            {t("definition.content")}
          </p>
        </section>

        {/* When to Use */}
        <section className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-[#FEF0E6]">
          <h2 className="text-3xl font-bold text-[#E8995E] mb-4 flex items-center gap-3">
            <span>💰</span> {t("whenToUse.title")}
          </h2>
          <ul className="space-y-3 mb-4">
            {(["reason1", "reason2", "reason3"] as const).map((key) => (
              <li key={key} className="flex items-start gap-3 text-gray-700">
                <span className="text-[#3DBDB8] font-bold mt-1">•</span>
                <span className="text-lg">{t(`whenToUse.${key}`)}</span>
              </li>
            ))}
          </ul>
          <p className="text-[#3DBDB8] font-bold text-lg">{t("whenToUse.cta")}</p>
        </section>

        {/* Benefits */}
        <section className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-[#E0F5F4]">
          <h2 className="text-3xl font-bold text-[#3DBDB8] mb-6 flex items-center gap-3">
            <span>✨</span> {t("benefits.title")}
          </h2>
          <div className="space-y-4">
            {(["benefit1", "benefit2", "benefit3"] as const).map((key) => (
              <div key={key} className="flex items-start gap-4 p-4 bg-[#E0F5F4]/30 rounded-lg">
                <span className="text-2xl">{key === "benefit1" ? "🎓" : key === "benefit2" ? "💭" : "🌈"}</span>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{t(`benefits.${key}.title`)}</h3>
                  <p className="text-gray-700">{t(`benefits.${key}.desc`)}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Types */}
        <section className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-[#E8995E]">
          <h2 className="text-3xl font-bold text-[#E8995E] mb-6 flex items-center gap-3">
            <span>🎯</span> {t("types.title")}
          </h2>
          <div className="space-y-4">
            {(["type1", "type2", "type3"] as const).map((key) => (
              <div key={key} className="p-5 bg-[#FEF0E6]/50 rounded-lg border-l-4 border-[#E8995E]">
                <h3 className="font-bold text-[#E8995E] text-lg mb-2">
                  {t(`types.${key}.title`)}
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  {t(`types.${key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Requirements */}
        <section className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-[#E0F5F4]">
          <h2 className="text-3xl font-bold text-[#3DBDB8] mb-6 flex items-center gap-3">
            <span>📋</span> {t("requirements.title")}
          </h2>
          <div className="space-y-3">
            {(["req1", "req2", "req3", "req4", "req5"] as const).map((key) => (
              <div key={key} className="flex items-start gap-3 p-3 bg-[#E0F5F4]/20 rounded-lg">
                <span className="text-[#3DBDB8] font-bold">✓</span>
                <span className="text-gray-700">{t(`requirements.${key}`)}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Process */}
        <section className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-[#E8995E]">
          <h2 className="text-3xl font-bold text-[#E8995E] mb-6 flex items-center gap-3">
            <span>🚀</span> {t("process.title")}
          </h2>
          <div className="space-y-3">
            {(["step1", "step2", "step3", "step4", "step5"] as const).map((key, idx) => (
              <div key={key} className="flex items-start gap-4 p-4 bg-[#FEF0E6]/30 rounded-lg">
                <div className="flex-shrink-0 w-8 h-8 bg-[#E8995E] text-white rounded-full flex items-center justify-center font-bold">
                  {idx + 1}
                </div>
                <p className="text-gray-700 pt-1 text-lg">{t(`process.${key}`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ */}
        <section className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-[#E0F5F4]">
          <h2 className="text-3xl font-bold text-[#3DBDB8] mb-6 flex items-center gap-3">
            <span>❗</span> {t("faq.title")}
          </h2>
          <div className="space-y-4">
            {(["q1", "q2", "q3", "q4", "q5"] as const).map((key) => (
              <div key={key} className="p-4 bg-[#E0F5F4]/10 rounded-lg border-l-4 border-[#3DBDB8]">
                <h3 className="font-bold text-gray-900 mb-2 text-lg">
                  {t(`faq.${key}.q`)}
                </h3>
                <p className="text-gray-700 text-lg">{t(`faq.${key}.a`)}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Tips */}
        <section className="mb-12 bg-white rounded-xl p-8 shadow-sm border border-[#3DBDB8]">
          <h2 className="text-3xl font-bold text-[#3DBDB8] mb-6 flex items-center gap-3">
            <span>💡</span> {t("tips.title")}
          </h2>
          <ul className="space-y-3">
            {(["tip1", "tip2", "tip3", "tip4", "tip5"] as const).map((key) => (
              <li
                key={key}
                className="flex items-start gap-3 text-gray-700 p-3 bg-[#E0F5F4]/20 rounded-lg"
              >
                <span className="text-[#3DBDB8] text-lg">✓</span>
                <span className="text-lg">{t(`tips.${key}`)}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Scams Warning */}
        <section className="mb-12 bg-red-50 rounded-xl p-8 shadow-sm border border-red-200">
          <h2 className="text-3xl font-bold text-red-700 mb-6 flex items-center gap-3">
            <span>⚠️</span> {t("scams.title")}
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-bold text-red-700 mb-3 text-lg">❌ {t("scams.redFlags")}</h3>
              <ul className="space-y-2">
                {(["flag1", "flag2", "flag3"] as const).map((key) => (
                  <li key={key} className="flex items-start gap-2 text-red-700">
                    <span>•</span> <span className="text-lg">{t(`scams.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-bold text-green-700 mb-3 text-lg">✅ {t("scams.trustworthy")}</h3>
              <ul className="space-y-2">
                {(["trust1", "trust2"] as const).map((key) => (
                  <li key={key} className="flex items-start gap-2 text-green-700">
                    <span>•</span> <span className="text-lg">{t(`scams.${key}`)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        {/* Final Message */}
        <section className="bg-gradient-to-r from-[#3DBDB8] to-[#2da8a3] text-white rounded-xl p-10 shadow-lg text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">🌟 {t("final.title")}</h2>
          <p className="text-lg text-white/90 leading-relaxed">
            {t("final.message")}
          </p>
        </section>

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/scholarships"
            className="inline-flex items-center gap-2 bg-[#3DBDB8] text-white font-bold px-8 py-4 rounded-lg hover:bg-[#2da8a3] transition-colors text-lg"
          >
            {t("cta")}
          </Link>
        </div>
      </div>
    </div>
  );
}
