"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { popAndGetBackTarget } from "@/lib/navigationStack";

interface BackButtonProps {
  /** Where to navigate when there's no recorded in-app page to return to. */
  fallbackHref?: string;
}

export function BackButton({ fallbackHref = "/" }: BackButtonProps) {
  const t = useTranslations("common");
  const router = useRouter();
  const pathname = usePathname();

  const handleBack = () => {
    const target = popAndGetBackTarget(pathname, fallbackHref);
    router.push(target as Parameters<typeof router.push>[0]);
  };

  return (
    <button
      onClick={handleBack}
      className="flex items-center gap-1 text-gray-600 hover:text-blue-600 text-sm font-medium transition-colors mb-6"
    >
      <ArrowLeft className="w-4 h-4" />
      {t("back")}
    </button>
  );
}
