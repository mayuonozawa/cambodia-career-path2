import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { createClient } from "@/lib/supabase/server";
import { GraduationCap, Building2, Wrench, Search, ArrowRight, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { getLocalizedField, getScholarshipTypeBadgeColor, formatDate } from "@/lib/utils";
import type { Locale } from "@/types/database";

export default async function HomePage() {
  const t = await getTranslations();
  const locale = (await getLocale()) as Locale;
  const supabase = await createClient();

  const { data: scholarships } = await supabase
    .from("scholarships")
    .select("*")
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            {t("home.heroTitle")}
          </h1>
          <p className="text-lg md:text-xl mb-8 text-blue-100">
            {t("home.heroSubtitle")}
          </p>
          <Link href="/scholarships" className="max-w-xl mx-auto relative block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <div className="w-full pl-12 pr-4 py-3 rounded-lg bg-white text-gray-500 text-lg text-left hover:ring-2 hover:ring-blue-300">
              {t("home.searchPlaceholder")}
            </div>
          </Link>
        </div>
      </section>

      {/* Navigation Cards */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/scholarships" className="group block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-yellow-300 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-yellow-100 rounded-lg"><GraduationCap className="w-6 h-6 text-yellow-600" /></div>
              <h2 className="text-xl font-semibold group-hover:text-yellow-600">{t("common.scholarships")}</h2>
            </div>
            <p className="text-gray-600 text-sm">{t("home.scholarshipsDesc")}</p>
          </Link>
          <Link href="/universities" className="group block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-blue-300 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-lg"><Building2 className="w-6 h-6 text-blue-600" /></div>
              <h2 className="text-xl font-semibold group-hover:text-blue-600">{t("common.universities")}</h2>
            </div>
            <p className="text-gray-600 text-sm">{t("home.universitiesDesc")}</p>
          </Link>
          <Link href="/vocational-schools" className="group block p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md hover:border-green-300 transition-all">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-green-100 rounded-lg"><Wrench className="w-6 h-6 text-green-600" /></div>
              <h2 className="text-xl font-semibold group-hover:text-green-600">{t("common.vocationalSchools")}</h2>
            </div>
            <p className="text-gray-600 text-sm">{t("home.vocationalDesc")}</p>
          </Link>
        </div>
      </section>

      {/* Featured Scholarships */}
      {scholarships && scholarships.length > 0 && (
        <section className="bg-gray-50 py-12 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">{t("home.featuredScholarships")}</h2>
              <Link href="/scholarships" className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium">
                {t("home.viewAll")}<ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scholarships.map((s) => (
                <Link key={s.id} href={`/scholarships/${s.id}`} className="block p-5 bg-white border border-gray-200 rounded-xl hover:shadow-md hover:border-blue-300 transition-all">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold line-clamp-2">{getLocalizedField(s, "name", locale)}</h3>
                    <Badge className={getScholarshipTypeBadgeColor(s.type)}>{t(`scholarships.${s.type}`)}</Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{getLocalizedField(s, "provider", locale)}</p>
                  {s.deadline && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="w-3 h-3" />{formatDate(s.deadline, locale)}
                    </div>
                  )}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* About Scholarships CTA */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <GraduationCap className="w-10 h-10 text-yellow-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold mb-4">{t("aboutScholarships.title")}</h2>
          <p className="text-gray-700 mb-6 max-w-2xl mx-auto">{t("aboutScholarships.whatIs")}</p>
          <Link href="/about-scholarships" className="inline-block bg-yellow-500 hover:bg-yellow-600 text-white font-semibold px-6 py-3 rounded-lg transition-colors">
            {t("home.browseAll")}
          </Link>
        </div>
      </section>
    </div>
  );
}
