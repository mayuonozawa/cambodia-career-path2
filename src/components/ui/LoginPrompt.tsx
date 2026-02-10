"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { LogIn } from "lucide-react";

export function LoginPrompt() {
  const t = useTranslations("common");

  return (
    <div className="text-center py-12">
      <LogIn className="w-12 h-12 text-gray-400 mx-auto mb-4" />
      <p className="text-gray-600 mb-4">{t("loginRequired")}</p>
      <Link
        href="/auth"
        className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium px-6 py-2.5 rounded-lg transition-colors"
      >
        {t("login")}
      </Link>
    </div>
  );
}
