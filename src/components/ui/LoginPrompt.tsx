"use client";

import { useState, useEffect } from "react";
import { useLocale } from "next-intl";

export function LoginPrompt({ onSuccess }: { onSuccess?: () => void }) {
  const locale = useLocale(); // "en" or "km"
  const [age, setAge] = useState("");
  const [region, setRegion] = useState("");
  const [error, setError] = useState("");
  const [lang, setLang] = useState<"en" | "km">("en");

  // 外側の言語に合わせて初期化
  useEffect(() => {
    if (locale === "km") setLang("km");
    else setLang("en");
  }, [locale]);

  const texts = {
    en: {
      title: "Please enter your age and residence to view details.",
      age: "Age",
      region: "Residence (e.g. Phnom Penh)",
      confirm: "Confirm",
      error: "Please enter your age and residence.",
      switch: "ភាសាខ្មែរ",
    },
    km: {
      title: "សូមបញ្ចូលអាយុ និងទីលំនៅដើម្បីមើលព័ត៌មានលម្អិត។",
      age: "អាយុ",
      region: "ទីលំនៅ (ឧ. ភ្នំពេញ)",
      confirm: "បញ្ជាក់",
      error: "សូមបញ្ចូលអាយុ និងទីលំនៅ។",
      switch: "English",
    },
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!age || !region) {
      setError(texts[lang].error);
      return;
    }
    localStorage.setItem("userAge", age);
    localStorage.setItem("userRegion", region);
    if (onSuccess) {
      onSuccess();
    } else {
      window.location.reload();
    }
  };

  const handleLangChange = () => {
    setLang(lang === "en" ? "km" : "en");
    setError("");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] bg-gradient-to-br from-blue-50 via-white to-blue-100 rounded-xl shadow-lg p-8">
      <button
        onClick={handleLangChange}
        className="self-end mb-4 px-3 py-1 bg-blue-200 hover:bg-blue-300 text-blue-900 rounded transition"
      >
        {texts[lang].switch}
      </button>
      <h2 className="text-2xl font-bold mb-6 text-blue-800">{texts[lang].title}</h2>
      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-sm">
        <input
          type="number"
          min={0}
          placeholder={texts[lang].age}
          value={age}
          onChange={e => setAge(e.target.value)}
          className="w-full border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        <input
          type="text"
          placeholder={texts[lang].region}
          value={region}
          onChange={e => setRegion(e.target.value)}
          className="w-full border border-blue-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
          required
        />
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-lg transition-colors"
        >
          {texts[lang].confirm}
        </button>
      </form>
    </div>
  );
}