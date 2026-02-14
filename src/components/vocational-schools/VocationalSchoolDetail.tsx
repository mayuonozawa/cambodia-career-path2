"use client";

import { useLocale, useTranslations } from "next-intl";
import { BackButton } from "@/components/ui/BackButton";
import { getLocalizedField, getLocalizedArray } from "@/lib/utils";
import type { VocationalSchool, Locale } from "@/types/database";
import { InlineAuthGate } from "@/components/auth/InlineAuthGate";
import {
  MapPin,
  ExternalLink,
  Phone,
  Globe,
  Wrench,
  Share2,
  BookOpen,
  CheckCircle,
  Building,
} from "lucide-react";

interface VocationalSchoolDetailProps {
  school: VocationalSchool;
  isAuthenticated?: boolean;
}

export function VocationalSchoolDetail({
  school,
  isAuthenticated = true,
}: VocationalSchoolDetailProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations();

  const name = getLocalizedField(school, "name", locale);
  const location = getLocalizedField(school, "location", locale);
  const description = getLocalizedField(school, "description", locale);
  const programs = getLocalizedArray(school, "programs", locale);

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
      <div className="bg-gradient-to-r from-teal-600 to-emerald-700 rounded-2xl p-6 md:p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 md:w-48 md:h-48 opacity-10">
          <Wrench className="w-full h-full" />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-sm font-medium">
              <Wrench className="w-4 h-4" />
              {t("vocationalSchools.title")}
            </span>
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
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
            {t("vocationalSchools.programs")}
          </div>
          <p className="font-semibold text-gray-900">
            {programs.length > 0
              ? t("vocationalSchools.programsCount", {
                  count: programs.length,
                })
              : "-"}
          </p>
        </div>

        {/* Contact */}
        {school.contact && (
          <div className="p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 text-gray-500 text-xs mb-1">
              <Phone className="w-3.5 h-3.5" />
              {t("vocationalSchools.contact")}
            </div>
            <p className="font-semibold text-gray-900 text-sm">
              {school.contact}
            </p>
          </div>
        )}
      </div>

      {/* Description */}
      {description && (
        <div className="p-5 bg-gray-50 rounded-xl border border-gray-200">
          <h3 className="font-bold text-gray-800 mb-3">
            {t("vocationalSchools.about")}
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
            <Wrench className="w-5 h-5 text-teal-600" />
            {t("vocationalSchools.programs")}
          </h2>
          <div className="flex flex-wrap gap-2">
            {programs.map((p) => (
              <span
                key={p}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-teal-50 text-teal-700 rounded-lg text-sm border border-teal-200 hover:bg-teal-100 transition-colors"
              >
                <CheckCircle className="w-3 h-3 text-teal-500" />
                {p}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Auth Gate: contact info and actions require login */}
      {!isAuthenticated ? (
        <InlineAuthGate redirectPath={`/vocational-schools/${school.id}`} />
      ) : (
        <>
          {/* Contact Information */}
          {(school.contact || school.website) && (
            <div className="p-5 bg-emerald-50 rounded-xl border border-emerald-200">
              <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2">
                <Phone className="w-5 h-5" />
                {t("vocationalSchools.contactInfo")}
              </h3>
              <div className="space-y-3">
                {school.contact && (
                  <div className="flex items-center gap-3 text-emerald-700">
                    <Phone className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm">{school.contact}</span>
                  </div>
                )}
                {school.website && (
                  <div className="flex items-center gap-3 text-emerald-700">
                    <Globe className="w-4 h-4 text-emerald-500" />
                    <a
                      href={school.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm hover:underline"
                    >
                      {school.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3">
            {school.website && (
              <a
                href={school.website}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white font-semibold px-6 py-3 rounded-xl transition-colors shadow-lg shadow-teal-600/25"
              >
                <Globe className="w-4 h-4" />
                {t("vocationalSchools.visitWebsite")}
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
            <button
              onClick={handleShare}
              className="inline-flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium px-5 py-3 rounded-xl transition-colors"
            >
              <Share2 className="w-4 h-4" />
              {t("vocationalSchools.share")}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
