"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

export function LoginPrompt() {
  const t = useTranslations("common");
  const [age, setAge] = useState("");
  const [region, setRegion] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!age || !region) {
      setError("年齢と地域を入力してください。");
      return;
    }
    localStorage.setItem("userAge", age);
    localStorage.setItem("userRegion", region);
    window.location.reload();
  };

  return (
    <div className="text-center py-12">
      <p className="text-gray-600 mb-4">詳細を見るには年齢と地域を入力してください。</p>
      <form onSubmit={handleSubmit} className="space-y-4 max-w-xs mx-auto">
        <input
          type="number"
          min={0}
          placeholder="年齢"
          value={age}
          onChange={e => setAge(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        />
        <select
          value={region}
          onChange={e => setRegion(e.target.value)}
          className="w-full border rounded px-3 py-2"
          required
        >
          <option value="">地域を選択</option>
          <option value="tokyo">東京</option>
          <option value="osaka">大阪</option>
          <option value="hokkaido">北海道</option>
          {/* 必要に応じて地域を追加 */}
        </select>
        {error && <div className="text-red-500">{error}</div>}
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
        >
          確認
        </button>
      </form>
    </div>
  );
}