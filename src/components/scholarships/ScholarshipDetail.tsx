"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { Badge } from "@/components/ui/Badge";
import { BackButton } from "@/components/ui/BackButton";
import {
  getLocalizedField,
  getScholarshipTypeBadgeColor,
  formatDate,
} from "@/lib/utils";
import type { Scholarship, University, Locale } from "@/types/database";
import { ApplicationInfo } from "@/components/scholarships/ApplicationInfo";
import {
  Calendar,
  Building,
  ExternalLink,
  CheckCircle,
  GraduationCap,
  Shield,
  Clock,
  AlertTriangle,
  MapPin,
  Share2,
  DollarSign,
  Users,
} from "lucide-react";

interface ScholarshipDetailProps {
  scholarship: Scholarship;
  relatedUniversities: University[];
}

function getTypeGradient(type: string) {
  switch (type) {
    case "full":
      return "from-green-600 to-emerald-700";
    case "partial":
      return "from-blue-600 to-indigo-700";
    case "grant":
      return "from-amber-500 to-orange-600";
    default:
      return "from-gray-600 to-gray-700";
  }
}

function getTypeIcon(type: string) {
  switch (type) {
    case "full":
      return <Shield className="w-6 h-6" />;
    case "partial":
      return <DollarSign className="w-6 h-6" />;
    case "grant":
      return <Users className="w-6 h-6" />;
    default:
      return <GraduationCap className="w-6 h-6" />;
  }
}

function isDeadlineApproaching(deadline: string | null): boolean {
  if (!deadline) return false;
  const deadlineDate = new Date(deadline);
  const now = new Date();
  const diffDays = Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
  return diffDays > 0 && diffDays <= 30;
}

function isDeadlinePassed(deadline: string | null): boolean {
  if (!deadline) return false;
  return new Date(deadline) < new Date();
}

function getDaysRemaining(deadline: string | null): number {
  if (!deadline) return -1;
  const deadlineDate = new Date(deadline);
  const now = new Date();
  return Math.ceil(
    (deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  );
}

export function ScholarshipDetail({
  scholarship,
  relatedUniversities,
}: ScholarshipDetailProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations();

  const name = getLocalizedField(scholarship, "name", locale);
  const provider = getLocalizedField(scholarship, "provider", locale);
  const description = getLocalizedField(scholarship, "description", locale);
  const coverage = getLocalizedField(scholarship, "coverage", locale);
  const eligibility = getLocalizedField(scholarship, "eligibility", locale);
  const daysRemaining = getDaysRemaining(scholarship.deadline);
  const deadlinePassed = isDeadlinePassed(scholarship.deadline);
  const deadlineApproaching = isDeadlineApproaching(scholarship.deadline);

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: name,
          text: `${name} - ${provider}`,
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
        className={`bg-gradient-to-r ${getTypeGradient(scholarship.type)} rounded-2xl p-6 md:p-8 text-white relative overflow-hidden`}
      >
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 opacity-10">
          <GraduationCap className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              {getTypeIcon(scholarship.type)}
              {t(`scholarships.${scholarship.type}`)}
            </span>
            {scholarship.is_active && !deadlinePassed && (
              <span className="px-2 py-1 bg-green-400/30 backdrop-blur-sm rounded-full text-xs font-medium">
                {t("scholarships.active")}
              </span>
            )}
            {deadlinePassed && (
              <span className="px-2 py-1 bg-red-400/30 backdrop-blur-sm rounded-full text-xs font-medium">
                {t("scholarships.closed")}
              </span>
            )}
          </div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{name}</h1>
          <div className="flex items-center gap-2 text-white/90">
            <Building className="w-4 h-4" />
            <span className="text-sm md:text-base">{provider}</span>
          </div>
        </div>
      </div>

      {/* Deadline Warning */}
      {deadlineApproaching && (
        <div className="flex items-center gap-3 p-4 bg-amber-50 border border-amber-300 rounded-xl animate-pulse">
          <AlertTriangle className="w-6 h-6 text-amber-600 shrink-0" />
          <div>
            <p className="font-semibold text-amber-800">
              {t("scholarships.deadlineWarning")}
            </p>
            <p className="text-sm text-amber-700">
              {t("scholarships.daysRemaining", { days: daysRemaining })}
            </p>
          </div>
        </div>
      )}

      {/* Quick Info Cards */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {/* Type */}
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <GraduationCap className="w-3.5 h-3.5" />
            {t("scholarships.type")}
          </div>
          <p className="font-semibold text-gray-900">
            {t(`scholarships.${scholarship.type}`)}
          </p>
        </div>

        {/* Provider */}
        <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <Building className="w-3.5 h-3.5" />
            {t("scholarships.provider")}
          </div>
          <p className="font-semibold text-gray-900 text-sm">{provider}</p>
        </div>

        {/* Deadline */}
        <div className="col-span-2 md:col-span-1 p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
            <Calendar className="w-3.5 h-3.5" />
            {t("scholarships.deadline")}
          </div>
          <p
            className={`font-semibold ${deadlinePassed ? "text-red-600" : deadlineApproaching ? "text-amber-600" : "text-gray-900"}`}
          >
            {scholarship.deadline
              ? formatDate(scholarship.deadline, locale)
              : t("scholarships.noDeadline")}
          </p>
        </div>
      </div>

      {/* Coverage & Eligibility */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {coverage && (
          <div className="p-5 bg-green-50 rounded-xl border border-green-200">
            <h3 className="font-bold text-green-800 mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              {t("scholarships.coverage")}
            </h3>
            <p className="text-green-700 text-sm leading-relaxed whitespace-pre-line">
              {coverage}
            </p>
          </div>
        )}

        {eligibility && (
          <div className="p-5 bg-blue-50 rounded-xl border border-blue-200">
            <h3 className="font-bold text-blue-800 mb-3 flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {t("scholarships.eligibility")}
            </h3>
            <p className="text-blue-700 text-sm leading-relaxed whitespace-pre-line">
              {eligibility}
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3">
            {t("scholarships.description")}
          </h3>
          <p className="text-gray-700 leading-relaxed whitespace-pre-line text-sm">
            {description}
          </p>
        </div>
      )}

      {/* Application Info (F-009) */}
      <ApplicationInfo
        scholarship={scholarship}
        deadlineFormatted={
          scholarship.deadline
            ? formatDate(scholarship.deadline, locale)
            : undefined
        }
      />

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        {scholarship.application_url && !deadlinePassed && (
          <a
            href={scholarship.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-blue-600/25"
          >
            {t("scholarships.applyNow")}
            <ExternalLink className="w-4 h-4" />
          </a>
        )}
        <button
          onClick={handleShare}
          className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-3 rounded-xl transition-colors"
        >
          <Share2 className="w-4 h-4" />
          {t("scholarships.share")}
        </button>
      </div>

      {/* Related Universities */}
      {relatedUniversities.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Building className="w-5 h-5 text-blue-600" />
            {t("scholarships.relatedUniversities")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {relatedUniversities.map((uni) => (
              <Link
                key={uni.id}
                href={`/universities/${uni.id}`}
                className="flex items-center gap-4 p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-300 hover:shadow-md transition-all group"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-blue-200 transition-colors">
                  <Building className="w-5 h-5 text-blue-600" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-gray-900 truncate">
                    {getLocalizedField(uni, "name", locale)}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <MapPin className="w-3 h-3" />
                    <span className="truncate">
                      {getLocalizedField(uni, "location", locale)}
                    </span>
                  </div>
                </div>
                <Badge
                  className={
                    uni.type === "public"
                      ? "bg-blue-100 text-blue-800 ml-auto shrink-0"
                      : "bg-purple-100 text-purple-800 ml-auto shrink-0"
                  }
                >
                  {t(`universities.${uni.type}`)}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
