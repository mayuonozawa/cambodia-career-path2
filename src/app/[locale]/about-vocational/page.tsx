import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import type { Metadata } from "next";
import {
  Wrench,
  DollarSign,
  Building,
  AlertTriangle,
  MapPin,
  ArrowRight,
  Smartphone,
  Globe,
  HardHat,
  Car,
  Monitor,
  Cpu,
  UtensilsCrossed,
  Sprout,
  GraduationCap,
  Banknote,
  Clock,
  CreditCard,
  CalendarClock,
  Users,
  ExternalLink,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Vocational Training Guide | PathForward",
  description:
    "Complete guide to vocational training programs in Cambodia. Learn for free, get paid, and start your career.",
};

export default async function AboutVocationalPage() {
  const t = await getTranslations("vocationalGuide");

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Hero */}
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 rounded-2xl p-6 md:p-10 text-white relative overflow-hidden mb-8">
        <div className="absolute top-0 right-0 w-40 h-40 md:w-56 md:h-56 opacity-10">
          <Wrench className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <p className="text-4xl mb-3">🚀</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 leading-snug">
            {t("heroTitle")}
          </h1>
          <p className="text-white/90 text-sm md:text-base leading-relaxed">
            {t("heroSubtitle")}
          </p>
        </div>
      </div>

      {/* Section 1: Learn for Free */}
      <section className="mb-8">
        <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-amber-800">
            <DollarSign className="w-6 h-6" />
            {t("section1.title")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white rounded-xl p-5 border border-yellow-100 shadow-sm">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                <GraduationCap className="w-5 h-5 text-green-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">
                {t("section1.free.title")}
              </h3>
              <p className="text-sm text-gray-600">{t("section1.free.desc")}</p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-yellow-100 shadow-sm">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center mb-3">
                <Banknote className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">
                {t("section1.stipend.title")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("section1.stipend.desc")}
              </p>
            </div>
            <div className="bg-white rounded-xl p-5 border border-yellow-100 shadow-sm">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                <Clock className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-gray-900 mb-1">
                {t("section1.short.title")}
              </h3>
              <p className="text-sm text-gray-600">
                {t("section1.short.desc")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Skills */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Wrench className="w-6 h-6 text-teal-600" />
          {t("section2.title")}
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            { icon: HardHat, color: "bg-orange-100 text-orange-600", key: "construction" },
            { icon: Car, color: "bg-red-100 text-red-600", key: "automotive" },
            { icon: Monitor, color: "bg-blue-100 text-blue-600", key: "it" },
            { icon: Cpu, color: "bg-purple-100 text-purple-600", key: "electronics" },
            { icon: UtensilsCrossed, color: "bg-pink-100 text-pink-600", key: "tourism" },
            { icon: Sprout, color: "bg-green-100 text-green-600", key: "agriculture" },
          ].map(({ icon: Icon, color, key }) => (
            <div
              key={key}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${color.split(" ")[0]}`}>
                <Icon className={`w-5 h-5 ${color.split(" ")[1]}`} />
              </div>
              <h3 className="font-bold text-gray-900 text-sm mb-1">
                {t(`section2.${key}.title`)}
              </h3>
              <p className="text-xs text-gray-600 leading-relaxed">
                {t(`section2.${key}.desc`)}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Section 3: Top Institutes */}
      <section className="mb-8">
        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
          <Building className="w-6 h-6 text-blue-600" />
          {t("section3.title")}
        </h2>
        <div className="space-y-3">
          {["npic", "ntti", "ppi", "nib", "jvc"].map((key) => (
            <div
              key={key}
              className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm flex items-start gap-4"
            >
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0">
                <Building className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-900">
                  {t(`section3.${key}.name`)}
                </h3>
                <p className="text-sm text-gray-600 mt-1">
                  {t(`section3.${key}.desc`)}
                </p>
              </div>
            </div>
          ))}
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 text-sm text-gray-600 flex items-start gap-2">
            <MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />
            <span>{t("section3.ptcNote")}</span>
          </div>
        </div>
      </section>

      {/* Section 4: Important Notes */}
      <section className="mb-8">
        <div className="bg-red-50 rounded-2xl p-6 border border-red-200">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-red-800">
            <AlertTriangle className="w-6 h-6" />
            {t("section4.title")}
          </h2>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                <CreditCard className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-sm text-red-700">{t("section4.idpoor")}</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center shrink-0">
                <CalendarClock className="w-4 h-4 text-red-600" />
              </div>
              <p className="text-sm text-red-700">{t("section4.deadline")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Section 5: Start Now */}
      <section className="mb-8">
        <div className="bg-gradient-to-r from-teal-50 to-emerald-50 rounded-2xl p-6 border border-teal-200">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-teal-800">
            <MapPin className="w-6 h-6" />
            {t("section5.title")}
          </h2>
          <p className="text-sm text-teal-700 mb-4">{t("section5.desc")}</p>
          <div className="space-y-3">
            <a
              href="https://tvet.gov.kh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white rounded-xl p-4 border border-teal-200 hover:shadow-md transition-shadow group"
            >
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-teal-200 transition-colors">
                <Globe className="w-5 h-5 text-teal-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">tvet.gov.kh</p>
                <p className="text-xs text-gray-500">
                  {t("section5.website1")}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
            <a
              href="https://registrations.mlvt.gov.kh"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 bg-white rounded-xl p-4 border border-teal-200 hover:shadow-md transition-shadow group"
            >
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-teal-200 transition-colors">
                <Globe className="w-5 h-5 text-teal-600" />
              </div>
              <div className="flex-1">
                <p className="font-bold text-gray-900">
                  registrations.mlvt.gov.kh
                </p>
                <p className="text-xs text-gray-500">
                  {t("section5.website2")}
                </p>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400" />
            </a>
            <div className="flex items-center gap-3 bg-white rounded-xl p-4 border border-teal-200">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="font-bold text-gray-900">TVET 1.5M</p>
                <p className="text-xs text-gray-500">{t("section5.app")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="text-center">
        <Link href="/vocational-schools">
          <button className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-bold px-8 py-4 rounded-xl transition-colors shadow-lg shadow-teal-600/25 text-lg">
            {t("cta")}
            <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </section>
    </div>
  );
}
