"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/Badge";
import { BackButton } from "@/components/ui/BackButton";
import {
  getLocalizedField,
  getLocalizedArray,
  getScholarshipTypeBadgeColor,
} from "@/lib/utils";
import type { University, Scholarship, Locale } from "@/types/database";
import { InlineAuthGate } from "@/components/auth/InlineAuthGate";
import {
  MapPin,
  ExternalLink,
  GraduationCap,
  Building,
  DollarSign,
  Globe,
  BookOpen,
  Share2,
  Award,
  Calendar,
  CheckCircle,
} from "lucide-react";
import { formatDate } from "@/lib/utils";

interface UniversityDetailProps {
  university: University;
  availableScholarships: Scholarship[];
  isAuthenticated?: boolean;
}

export function UniversityDetail({
  university,
  availableScholarships,
  isAuthenticated = true,
}: UniversityDetailProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations();

  const name = getLocalizedField(university, "name", locale);
  const location = getLocalizedField(university, "location", locale);
  const description = getLocalizedField(university, "description", locale);
  const tuition = getLocalizedField(university, "tuition_info", locale);
  const programs = getLocalizedArray(university, "programs", locale);

  const isPublic = university.type === "public";

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `${name} - ${location}`,
          url: window.location.href,
        });
      } catch {
        // User cancelled sharing
      }
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="space-y-6">
      <BackButton />

      {/* Hero Header */}
      <div
        className={`bg-gradient-to-r ${isPublic ? "from-blue-600 to-indigo-700" : "from-purple-600 to-violet-700"} rounded-2xl p-6 md:p-8 text-white relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 opacity-10">
          <Building className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <Badge
              className={
                isPublic
                  ? "bg-white/20 text-white backdrop-blur-sm"
                  : "bg-white/20 text-white backdrop-blur-sm"
              }
            >
              {t(`universities.${university.type}`)}
            </Badge>
            {availableScholarships.length > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-400/30 backdrop-blur-sm rounded-full text-xs font-medium">
                <Award className="w-3 h-3" />
                {t("universities.scholarshipsAvailable", {
                  count: availableScholarships.length,
                })}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{name}</h1>
          {location && (
            <div className="flex items-center gap-2 text-white/90">
              <MapPin className="w-4 h-4" />
              <span className="text-sm md:text-base">{location}</span>
            </div>
          )}
        </div>
      </div>

      {/* Quick Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {/* Type */}
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <Building className="w-3.5 h-3.5" />
            {t("universities.type")}
          </div>
          <p className="font-semibold text-gray-900">
            {t(`universities.${university.type}`)}
          </p>
        </div>

        {/* Location */}
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <MapPin className="w-3.5 h-3.5" />
            {t("universities.location")}
          </div>
          <p className="font-semibold text-gray-900 text-sm">
            {location || "-"}
          </p>
        </div>

        {/* Programs Count */}
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <BookOpen className="w-3.5 h-3.5" />
            {t("universities.programs")}
          </div>
          <p className="font-semibold text-gray-900">
            {programs.length > 0
              ? t("universities.programsCount", { count: programs.length })
              : "-"}
          </p>
        </div>

        {/* Scholarships Count */}
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            {t("universities.availableScholarships")}
          </div>
          <p className="font-semibold text-gray-900">
            {availableScholarships.length > 0
              ? availableScholarships.length
              : "-"}
          </p>
        </div>
      </div>

      {/* Description */}
      {description && (
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3">
            {t("universities.about")}
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
            {description}
          </p>
        </div>
      )}

      {/* Programs */}
      {programs.length > 0 && (
        <div>
          <h2 className="text-xl font-bold mb-3 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            {t("universities.programs")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {programs.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <CheckCircle className="w-3 h-3 text-blue-500" />
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Auth Gate: tuition, website, scholarships require login */}
      {!isAuthenticated ? (
        <InlineAuthGate redirectPath={`/universities/${university.id}`} />
      ) : (
        <>
          {/* Tuition */}
          {tuition && (
            <div className="p-5 bg-amber-50 rounded-xl border border-amber-200">
              <h3 className="font-bold text-amber-800 mb-3 flex items-center gap-2">
                <DollarSign className="w-5 h-5" />
                {t("universities.tuition")}
              </h3>
              <p className="text-amber-700 text-sm whitespace-pre-line leading-relaxed">
                {tuition}
              </p>
            </div>
          )}

          {/* Website & Share */}
          <div className="flex flex-wrap gap-3">
            {university.website && (
              <a
                href={university.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-brand-primary hover:bg-brand-primary-hover text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-brand-primary/25"
              >
                <Globe className="w-4 h-4" />
                {t("universities.visitWebsite")}
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-3 rounded-xl transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {t("universities.share")}
            </button>
          </div>

          {/* Available Scholarships (Reverse lookup - KEY FEATURE) */}
          {availableScholarships.length > 0 && (
            <div className="mt-8">
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-2xl p-6 border border-yellow-200">
                <h2 className="text-xl font-bold mb-2 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-yellow-600" />
                  {t("universities.availableScholarships")}
                </h2>
                <p className="text-sm text-gray-600 mb-4">
                  {t("universities.scholarshipsDescription")}
                </p>
                <div className="grid grid-cols-1 gap-3">
                  {availableScholarships.map((s) => (
                    <Link
                      key={s.id}
                      href={`/scholarships/${s.id}`}
                      className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-yellow-300 hover:shadow-md transition-all group"
                    >
                      <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-yellow-200 transition-colors">
                        <GraduationCap className="w-5 h-5 text-yellow-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-gray-900">
                          {getLocalizedField(s, "name", locale)}
                        </p>
                        <div className="flex items-center gap-3 mt-1">
                          <Badge className={getScholarshipTypeBadgeColor(s.type)}>
                            {t(`scholarships.${s.type}`)}
                          </Badge>
                          {s.deadline && (
                            <span className="text-xs text-gray-500 flex items-center gap-1">
                              <Calendar className="w-3 h-3" />
                              {formatDate(s.deadline, locale)}
                            </span>
                          )}
                        </div>
                      </div>
                      <ExternalLink className="w-4 h-4 text-gray-400 shrink-0" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
