"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";

export function BackButton() {
  const t = useTranslations("common");
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors mb-6"
    >
      <ArrowLeft className="w-4 h-4" />
      {t("back")}
    </button>
  );
}
