"use client";

import { useTranslations } from "next-intl";
import {
  FileText,
  ClipboardList,
  Calendar,
  Mail,
  ChevronRight,
} from "lucide-react";
import type { Scholarship } from "@/types/database";
import {
  getApplicationTypeBadgeColor,
  getApplicationTypeLabelKey,
  getApplicationTypeHintKey,
} from "@/lib/utils";

interface ApplicationInfoProps {
  scholarship: Scholarship;
  deadlineFormatted?: string;
}

const REQUIRED_DOCS = [
  "doc_transcript",
  "doc_id_card",
  "doc_recommendation",
  "doc_motivation",
  "doc_photo",
  "doc_family_book",
  "doc_poverty_card",
] as const;

const APPLICATION_STEPS = [
  "step_prepare",
  "step_fill_form",
  "step_submit",
  "step_interview",
  "step_result",
] as const;

export function ApplicationInfo({
  scholarship,
  deadlineFormatted,
}: ApplicationInfoProps) {
  const t = useTranslations("scholarships");

  const applicationTypeLabelKey = getApplicationTypeLabelKey(scholarship.application_type);
  const applicationTypeHintKey = getApplicationTypeHintKey(scholarship.application_type);
  // The "apply directly" hint points at the application link, so only show
  // it when there actually is one; the other hints don't depend on a URL.
  const showApplicationTypeHint =
    applicationTypeHintKey &&
    (scholarship.application_type !== "direct" || !!scholarship.application_url);
  // Named affirmatively so a future application_type value defaults to
  // showing Required Documents instead of silently being hidden.
  const isViaSchool = scholarship.application_type === "via_school";

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold flex items-center gap-2">
        <ClipboardList className="w-5 h-5 text-blue-600" />
        {t("applicationInfo")}
      </h2>

      {/* How to Apply */}
      {applicationTypeLabelKey && (
        <div>
          <span
            className={`inline-block whitespace-nowrap px-2.5 py-1 rounded-full text-xs font-semibold ${getApplicationTypeBadgeColor(scholarship.application_type)}`}
          >
            {t(applicationTypeLabelKey)}
          </span>
          {showApplicationTypeHint && (
            <p className="mt-1.5 text-sm text-gray-700">
              {t(applicationTypeHintKey)}
            </p>
          )}
        </div>
      )}

      {/* Important Dates */}
      {deadlineFormatted && (
        <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
          <h3 className="font-semibold text-amber-800 mb-3 flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {t("importantDates")}
          </h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-amber-700">{t("applicationEnd")}</span>
              <span className="font-medium text-amber-900">
                {deadlineFormatted}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Required Documents (not shown when the school selects the student —
          there's nothing for the student to submit) */}
      {!isViaSchool && (
        <div className="p-4 bg-purple-50 rounded-lg border border-purple-200">
          <h3 className="font-semibold text-purple-800 mb-3 flex items-center gap-2">
            <FileText className="w-4 h-4" />
            {t("requiredDocuments")}
          </h3>
          <ul className="space-y-2">
            {REQUIRED_DOCS.map((doc) => (
              <li
                key={doc}
                className="flex items-center gap-2 text-sm text-purple-700"
              >
                <span className="w-1.5 h-1.5 bg-purple-400 rounded-full shrink-0" />
                {t(doc)}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Application Process */}
      <div className="p-4 bg-sky-50 rounded-lg border border-sky-200">
        <h3 className="font-semibold text-sky-800 mb-3 flex items-center gap-2">
          <ClipboardList className="w-4 h-4" />
          {t("applicationProcess")}
        </h3>
        <ol className="space-y-3">
          {APPLICATION_STEPS.map((step, index) => (
            <li key={step} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-sky-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {index + 1}
              </span>
              <span className="text-sm text-sky-700 pt-0.5">{t(step)}</span>
            </li>
          ))}
        </ol>
      </div>

      {/* Contact / Apply Link */}
      {scholarship.application_url && (
        <div className="p-4 bg-green-50 rounded-lg border border-green-200">
          <h3 className="font-semibold text-green-800 mb-3 flex items-center gap-2">
            <Mail className="w-4 h-4" />
            {t("contactInfo")}
          </h3>
          <a
            href={scholarship.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-sm text-green-700 hover:text-green-900 underline"
          >
            {scholarship.application_url}
            <ChevronRight className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
}
