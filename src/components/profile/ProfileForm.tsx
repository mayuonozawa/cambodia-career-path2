"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types/database";
import { Save, CheckCircle, ChevronRight, ChevronLeft } from "lucide-react";

const PROVINCES = [
  "Phnom Penh", "Banteay Meanchey", "Battambang", "Kampong Cham",
  "Kampong Chhnang", "Kampong Speu", "Kampong Thom", "Kampot",
  "Kandal", "Koh Kong", "Kratie", "Mondulkiri", "Oddar Meanchey",
  "Pailin", "Preah Sihanouk", "Preah Vihear", "Prey Veng",
  "Pursat", "Ratanakiri", "Siem Reap", "Stung Treng",
  "Svay Rieng", "Takeo", "Tboung Khmum",
];

const INTEREST_FIELDS = [
  "IT / Computer Science",
  "Business / Management",
  "Medicine / Health",
  "Engineering",
  "Law",
  "Education / Teaching",
  "Agriculture",
  "Arts / Design",
  "Tourism / Hospitality",
  "Social Science",
];

const TOTAL_STEPS = 3;

interface ProfileFormProps {
  initialProfile?: Profile | null;
  userId: string;
}

export function ProfileForm({ initialProfile, userId }: ProfileFormProps) {
  const t = useTranslations("profile");
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const [form, setForm] = useState({
    nickname: initialProfile?.nickname ?? "",
    date_of_birth: initialProfile?.date_of_birth ?? "",
    grade: initialProfile?.grade ?? "",
    current_province: initialProfile?.current_province ?? "",
    interests: initialProfile?.interests ?? [],
    academic_performance: initialProfile?.academic_performance ?? "",
    preferred_location: initialProfile?.preferred_location ?? "",
    khmer_level: initialProfile?.khmer_level ?? "",
    english_level: initialProfile?.english_level ?? "",
    economic_status: initialProfile?.economic_status ?? "",
    career_status: initialProfile?.career_status ?? "",
    challenges: initialProfile?.challenges ?? "",
    dream: initialProfile?.dream ?? "",
    privacy_agreed: initialProfile?.privacy_agreed ?? false,
  });

  const updateField = (field: string, value: string | boolean | string[]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const toggleInterest = (interest: string) => {
    const updated = form.interests.includes(interest)
      ? form.interests.filter((i) => i !== interest)
      : [...form.interests, interest];
    updateField("interests", updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const supabase = createClient();
    const profileData = {
      user_id: userId,
      ...form,
      updated_at: new Date().toISOString(),
    };

    if (initialProfile) {
      await supabase
        .from("profiles")
        .update(profileData)
        .eq("user_id", userId);
    } else {
      await supabase.from("profiles").insert(profileData);
    }

    setSaving(false);
    setSaved(true);
  };

  const selectClass =
    "w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500";
  const inputClass = selectClass;

  const stepTitles = [t("step1Title"), t("step2Title"), t("step3Title")];

  const canGoNext = currentStep === 1 ? form.nickname.trim() !== "" : true;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Step Indicator */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-600">
            {t("stepOf", { current: currentStep, total: TOTAL_STEPS })}
          </span>
          <span className="text-sm font-medium text-gray-600">
            {stepTitles[currentStep - 1]}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-brand-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / TOTAL_STEPS) * 100}%` }}
          />
        </div>
        <div className="flex justify-between mt-2">
          {stepTitles.map((title, i) => (
            <div
              key={i}
              className={`flex items-center gap-1 text-xs ${
                i + 1 <= currentStep ? "text-brand-primary font-medium" : "text-gray-400"
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                  i + 1 < currentStep
                    ? "bg-brand-primary text-white"
                    : i + 1 === currentStep
                    ? "bg-brand-primary text-white"
                    : "bg-gray-200 text-gray-500"
                }`}
              >
                {i + 1}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Step 1: Basic Information */}
      {currentStep === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("nickname")} *
            </label>
            <input
              type="text"
              required
              value={form.nickname}
              onChange={(e) => updateField("nickname", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("dateOfBirth")}
            </label>
            <input
              type="date"
              value={form.date_of_birth}
              onChange={(e) => updateField("date_of_birth", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("grade")}
            </label>
            <select
              value={form.grade}
              onChange={(e) => updateField("grade", e.target.value)}
              className={selectClass}
            >
              <option value="">--</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="graduated">{t("graduated")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("currentProvince")}
            </label>
            <select
              value={form.current_province}
              onChange={(e) => updateField("current_province", e.target.value)}
              className={selectClass}
            >
              <option value="">--</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {t(`provinces.${p}`)}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* Step 2: Learning & Skills */}
      {currentStep === 2 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {t("interests")}
            </label>
            <div className="flex flex-wrap gap-2">
              {INTEREST_FIELDS.map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => toggleInterest(interest)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                    form.interests.includes(interest)
                      ? "bg-blue-600 text-white"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {t(`interestFields.${interest}`)}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("academicPerformance")}
            </label>
            <select
              value={form.academic_performance}
              onChange={(e) => updateField("academic_performance", e.target.value)}
              className={selectClass}
            >
              <option value="">--</option>
              <option value="A">A</option>
              <option value="B">B</option>
              <option value="C">C</option>
              <option value="D">D</option>
              <option value="E">E</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("preferredLocation")}
            </label>
            <select
              value={form.preferred_location}
              onChange={(e) => updateField("preferred_location", e.target.value)}
              className={selectClass}
            >
              <option value="">--</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {t(`provinces.${p}`)}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("khmerLevel")}
            </label>
            <select
              value={form.khmer_level}
              onChange={(e) => updateField("khmer_level", e.target.value)}
              className={selectClass}
            >
              <option value="">--</option>
              <option value="native">{t("khmerLevels.native")}</option>
              <option value="fluent">{t("khmerLevels.fluent")}</option>
              <option value="intermediate">{t("khmerLevels.intermediate")}</option>
              <option value="basic">{t("khmerLevels.basic")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("englishLevel")}
            </label>
            <select
              value={form.english_level}
              onChange={(e) => updateField("english_level", e.target.value)}
              className={selectClass}
            >
              <option value="">--</option>
              <option value="advanced">{t("englishLevels.advanced")}</option>
              <option value="intermediate">{t("englishLevels.intermediate")}</option>
              <option value="basic">{t("englishLevels.basic")}</option>
              <option value="none">{t("englishLevels.none")}</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 3: Goals & Situation */}
      {currentStep === 3 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("economicStatus")}
            </label>
            <select
              value={form.economic_status}
              onChange={(e) => updateField("economic_status", e.target.value)}
              className={selectClass}
            >
              <option value="">--</option>
              <option value="very_difficult">{t("economicStatuses.very_difficult")}</option>
              <option value="difficult">{t("economicStatuses.difficult")}</option>
              <option value="moderate">{t("economicStatuses.moderate")}</option>
              <option value="comfortable">{t("economicStatuses.comfortable")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("careerStatus")}
            </label>
            <select
              value={form.career_status}
              onChange={(e) => updateField("career_status", e.target.value)}
              className={selectClass}
            >
              <option value="">--</option>
              <option value="not_started">{t("careerStatuses.not_started")}</option>
              <option value="exploring">{t("careerStatuses.exploring")}</option>
              <option value="decided">{t("careerStatuses.decided")}</option>
              <option value="applied">{t("careerStatuses.applied")}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("challenges")}
            </label>
            <textarea
              rows={3}
              value={form.challenges}
              onChange={(e) => updateField("challenges", e.target.value)}
              className={inputClass}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {t("dream")}
            </label>
            <textarea
              rows={3}
              value={form.dream}
              onChange={(e) => updateField("dream", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="privacy"
              required
              checked={form.privacy_agreed}
              onChange={(e) => updateField("privacy_agreed", e.target.checked)}
              className="mt-1"
            />
            <label htmlFor="privacy" className="text-sm text-gray-700">
              {t("privacyAgreement")} *
            </label>
          </div>
        </div>
      )}

      {/* Navigation Buttons */}
      <div className="flex gap-3 pt-4">
        {currentStep > 1 && (
          <button
            type="button"
            onClick={() => setCurrentStep((s) => s - 1)}
            className="flex-1 flex items-center justify-center gap-2 border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors hover:bg-gray-50"
          >
            <ChevronLeft className="w-5 h-5" />
            {t("previous")}
          </button>
        )}

        {currentStep < TOTAL_STEPS ? (
          <button
            type="button"
            disabled={!canGoNext}
            onClick={() => setCurrentStep((s) => s + 1)}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-primary hover:bg-brand-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {t("next")}
            <ChevronRight className="w-5 h-5" />
          </button>
        ) : (
          <button
            type="submit"
            disabled={saving}
            className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {saved ? (
              <>
                <CheckCircle className="w-5 h-5" />
                {t("saved")}
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                {saving ? "..." : t("save")}
              </>
            )}
          </button>
        )}
      </div>
    </form>
  );
}
