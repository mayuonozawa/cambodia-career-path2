"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";
import { createClient } from "@/lib/supabase/client";

const PROVINCES = [
  "Phnom Penh", "Banteay Meanchey", "Battambang", "Kampong Cham",
  "Kampong Chhnang", "Kampong Speu", "Kampong Thom", "Kampot",
  "Kandal", "Koh Kong", "Kratie", "Mondulkiri", "Oddar Meanchey",
  "Pailin", "Preah Sihanouk", "Preah Vihear", "Prey Veng", "Pursat",
  "Ratanakiri", "Siem Reap", "Stung Treng", "Svay Rieng", "Takeo",
  "Tboung Khmum",
];

const PROVINCE_KM: Record<string, string> = {
  "Phnom Penh": "ភ្នំពេញ", "Banteay Meanchey": "បន្ទាយមានជ័យ",
  "Battambang": "បាត់ដំបង", "Kampong Cham": "កំពង់ចាម",
  "Kampong Chhnang": "កំពង់ឆ្នាំង", "Kampong Speu": "កំពង់ស្ពឺ",
  "Kampong Thom": "កំពង់ធំ", "Kampot": "កំពត",
  "Kandal": "កណ្ដាល", "Koh Kong": "កោះកុង",
  "Kratie": "ក្រចេះ", "Mondulkiri": "មណ្ឌលគិរី",
  "Oddar Meanchey": "ឧត្តរមានជ័យ", "Pailin": "ប៉ៃលិន",
  "Preah Sihanouk": "ព្រះសីហនុ", "Preah Vihear": "ព្រះវិហារ",
  "Prey Veng": "ព្រៃវែង", "Pursat": "ពោធិ៍សាត់",
  "Ratanakiri": "រតនគិរី", "Siem Reap": "សៀមរាប",
  "Stung Treng": "ស្ទឹងត្រែង", "Svay Rieng": "ស្វាយរៀង",
  "Takeo": "តាកែវ", "Tboung Khmum": "ត្បូងឃ្មុំ",
};

export function ProfileSetupPrompt({ userId }: { userId: string }) {
  const locale = useLocale();
  const [age, setAge] = useState("");
  const [province, setProvince] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [lang, setLang] = useState<"en" | "km">("en");

  useEffect(() => {
    if (locale === "km") setLang("km");
    else setLang("en");
  }, [locale]);

  const texts = {
    en: {
      title: "Almost there! Please tell us about yourself.",
      subtitle: "This helps us show you the most relevant information.",
      age: "Age",
      province: "Province / Residence",
      selectProvince: "Select your province",
      confirm: "Continue",
      error: "Please enter your age and select your province.",
      saving: "Saving...",
      switch: "ភាសាខ្មែរ",
    },
    km: {
      title: "ជិតរួចហើយ! សូមប្រាប់យើងអំពីអ្នក។",
      subtitle: "នេះជួយយើងបង្ហាញព័ត៌មានដែលសមស្របបំផុតសម្រាប់អ្នក។",
      age: "អាយុ",
      province: "ខេត្ត / ទីលំនៅ",
      selectProvince: "ជ្រើសរើសខេត្តរបស់អ្នក",
      confirm: "បន្ត",
      error: "សូមបញ្ចូលអាយុ និងជ្រើសរើសខេត្តរបស់អ្នក។",
      saving: "កំពុងរក្សាទុក...",
      switch: "English",
    },
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!age || !province) {
      setError(texts[lang].error);
      return;
    }

    setSaving(true);
    setError("");

    try {
      const supabase = createClient();

      // profilesテーブルにupsert（年齢と居住地）
      const { error: dbError } = await supabase.from("profiles").upsert(
        {
          user_id: userId,
          nickname: "",
          current_province: province,
          privacy_agreed: true,
        },
        { onConflict: "user_id" }
      );

      if (dbError) {
        console.error("Failed to save profile:", dbError);
      }

      // visitorsテーブルにも保存（匿名統計用）
      await supabase
        .from("visitors")
        .insert({ age: parseInt(age, 10), region: province });

      // Cookieにも保存（サーバー側でのゲート用）
      document.cookie = `userAge=${encodeURIComponent(age)}; path=/; max-age=${60 * 60 * 24 * 365}`;
      document.cookie = `userRegion=${encodeURIComponent(province)}; path=/; max-age=${60 * 60 * 24 * 365}`;

      window.location.reload();
    } catch (err) {
      console.error("Error saving profile:", err);
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-xl shadow-lg p-8">
      <button
        onClick={() => setLang(lang === "en" ? "km" : "en")}
        className="self-end mb-4 px-3 py-1 bg-blue-200 hover:bg-blue-300 text-blue-900 rounded transition"
      >
        {texts[lang].switch}
      </button>

      <div className="mb-2 text-5xl">📝</div>
      <h2 className="text-2xl font-bold mb-2 text-blue-800">
        {texts[lang].title}
      </h2>
      <p className="text-gray-600 mb-6 text-center max-w-sm">
        {texts[lang].subtitle}
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <input
          type="number"
          min={10}
          max={99}
          placeholder={texts[lang].age}
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full border border-blue-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
          disabled={saving}
        />

        <select
          value={province}
          onChange={(e) => setProvince(e.target.value)}
          className="w-full border border-blue-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-white"
          required
          disabled={saving}
        >
          <option value="">{texts[lang].selectProvince}</option>
          {PROVINCES.map((p) => (
            <option key={p} value={p}>
              {lang === "km" ? PROVINCE_KM[p] || p : p}
            </option>
          ))}
        </select>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <button
          type="submit"
          disabled={saving}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold px-6 py-3 rounded-lg transition-colors"
        >
          {saving ? texts[lang].saving : texts[lang].confirm}
        </button>
      </form>
    </div>
  );
}
