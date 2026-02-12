import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { GraduationCap, Search } from "lucide-react";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("aboutScholarships");
  return {
    title: t("title"),
    description: "Learn about scholarships, types, how to find them, and application tips",
  };
}

export default function AboutScholarshipsPage() {
  const t = useTranslations("aboutScholarships");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="text-center mb-10">
        <GraduationCap className="w-12 h-12 text-yellow-500 mx-auto mb-4" />
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{t("title")}</h1>
        <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
          {t("whatIs")}
        </p>
      </div>

      {/* Types */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-5">{t("types")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-green-50 rounded-xl border border-green-200">
            <h3 className="font-bold text-green-800 text-lg mb-2">
              {t("fullTitle")}
            </h3>
            <p className="text-sm text-green-700 leading-relaxed">
              {t("fullDesc")}
            </p>
          </div>
          <div className="p-5 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-bold text-blue-800 text-lg mb-2">
              {t("partialTitle")}
            </h3>
            <p className="text-sm text-blue-700 leading-relaxed">
              {t("partialDesc")}
            </p>
          </div>
          <div className="p-5 bg-yellow-50 rounded-xl border border-yellow-200">
            <h3 className="font-bold text-yellow-800 text-lg mb-2">
              {t("grantTitle")}
            </h3>
            <p className="text-sm text-yellow-700 leading-relaxed">
              {t("grantDesc")}
            </p>
          </div>
        </div>
      </section>

      {/* How to Find */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-5">{t("howToFind")}</h2>
        <div className="space-y-3">
          {(["step1", "step2", "step3", "step4"] as const).map((key, i) => (
            <div
              key={key}
              className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg"
            >
              <span className="flex-shrink-0 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-sm">
                {i + 1}
              </span>
              <p className="text-gray-700 pt-1">{t(key)}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Tips */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-5">{t("tips")}</h2>
        <ul className="space-y-3">
          {(["tip1", "tip2", "tip3", "tip4", "tip5"] as const).map((key) => (
            <li
              key={key}
              className="flex items-start gap-3 text-gray-700"
            >
              <span className="text-green-500 mt-0.5">✓</span>
              <span>{t(key)}</span>
            </li>
          ))}
        </ul>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white rounded-2xl p-8 text-center">
        <h2 className="text-2xl font-bold mb-3">{t("ctaTitle")}</h2>
        <p className="text-blue-100 mb-6">{t("ctaDesc")}</p>
        <Link
          href="/scholarships"
          className="inline-flex items-center gap-2 bg-white text-blue-700 font-semibold px-6 py-3 rounded-lg hover:bg-blue-50 transition-colors"
        >
          <Search className="w-4 h-4" />
          {t("ctaButton")}
        </Link>
      </section>
    </div>
  );
}
